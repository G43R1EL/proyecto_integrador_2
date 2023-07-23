// Levantamos las variables de entorno
require('dotenv').config();

// Importamos MongoClient del módulo de mongodb
const { MongoClient } = require('mongodb');

// Desestructuramos las variables de entorno
const { DATABASE_URL, DATABASE_NAME } = process.env;

// Creamos una instancia de MongoClient
const client = new MongoClient(DATABASE_URL);

// Función de conexión a la base de datos
const connectMongo = async () => {
    try {
        await client.connect();
    } catch (error) {
        console.error('Error al conectarse a la base de datos');
    }
};

// Función de desconexión a la base de datos
const disconnectMongo = async () => {
    try {
        await client.close();
    } catch (error) {
        console.error('Error al desconectarse de la base de datos');
    }
};

// Función para generar el código de un nuevo mueble
const generateCode = async (collection) => {
    const sortedCollection = await collection.find().sort({ codigo: -1 }).limit(1).toArray();
    const maxCode = sortedCollection[0]?.codigo ?? 0;
    return maxCode + 1;
};

// Función para conectarse a una colección de la base de datos
const connectToCollection = async (collection) => {
    try {
        await connectMongo();
        const db = client.db(DATABASE_NAME);
        const data = await db.collection(collection);
        return data;
    } catch (error) {
        console.error('Error al obtener los datos');
    }
};

// Exportamos las funciones
module.exports = {
    connectToCollection,
    disconnectMongo,
    generateCode
};
