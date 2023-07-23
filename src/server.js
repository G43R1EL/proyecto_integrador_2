// Levantamos las variables de entorno
require('dotenv').config();

// Importamos el módulo de express
const express = require('express');

// Importamos las funciones de conexión y desconexión a la base de datos
const { connectToCollection, disconnectMongo, generateCode } = require('../connection_db');

// Desestructuramos las variables de entorno
const { SERVER_PORT, SERVER_HOST } = process.env;

// Creamos el servidor de express
const server = express();

// Middlewares globales
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Endpoints

// GET general, puede recibir los parámetros de filtrado categoria, precio_gte y precio_lte
server.get('/api/v1/muebles', async (req, res) => {
    try {
        const collection = await connectToCollection('muebles');
        const { categoria, precio_gte, precio_lte } = req.query;
        const query = {}; // Objeto vacío para ir agregando los filtros
        if (categoria) query.categoria = categoria;
        if (precio_gte) query.precio = { $gte: Number(precio_gte) };
        if (precio_lte) query.precio = { ...query.precio, $lte: Number(precio_lte) };
        const sorting = {}; // Objeto vacío para ir agregando los criterios de ordenamiento
        if (categoria) sorting.nombre = 1;
        if (precio_gte) sorting.precio = 1;
        if (precio_lte) sorting.precio = -1; // Si hay dos criterios de ordenamiento, el último se sobreescribe
        const muebles = await collection.find(query).sort(sorting).toArray();
        res.status(200).json({ payload: muebles });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos' });
    } finally {
        disconnectMongo();
    }
});

// GET por código
server.get('/api/v1/muebles/:codigo', async (req, res) => {
    try {
        const collection = await connectToCollection('muebles');
        const mueble = await collection.findOne({ codigo: Number(req.params.codigo) });
        if (!mueble) {
            res.status(400).json({ message: 'El código no corresponde a un mueble registrado' });
        } else {
            res.status(200).json({ payload: mueble });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos' });
    } finally {
        disconnectMongo();
    }
});

// POST para crear un nuevo mueble
server.post('/api/v1/muebles', async (req, res) => {
    try {
        const collection = await connectToCollection('muebles');
        const { nombre, precio, categoria } = req.body;
        const mueble = { codigo: await generateCode(collection), nombre, precio, categoria };
        if (!mueble.codigo || !mueble.nombre || !mueble.precio || !mueble.categoria) {
            res.status(400).json({ message: 'Faltan datos relevantes' });
        } else {
            await collection.insertOne(mueble);
            res.status(201).json({ message: 'Registro creado', payload: mueble });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Se ha generado un error en el servidor' });
    } finally {
        disconnectMongo();
    }
});

// PUT para actualizar un mueble
server.put('/api/v1/muebles/:codigo', async (req, res) => {
    try {
        const collection = await connectToCollection('muebles');
        const codigo = Number(req.params.codigo);
        const { nombre, precio, categoria } = req.body;
        const mueble = { codigo, nombre, precio: Number(precio), categoria };
        if (!mueble.codigo || !mueble.nombre || !mueble.precio || !mueble.categoria) {
            res.status(400).json({ message: 'Faltan datos relevantes' });
        } else {
            const response = await collection.updateOne({ codigo }, { $set: mueble });
            if (response.matchedCount === 1) {
                res.status(200).json({ message: 'Registro actualizado', payload: mueble });
            } else {
                res.status(400).json({ message: 'El código no corresponde a un mueble registrado' });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Se ha generado un error en el servidor' });
    } finally {
        disconnectMongo();
    }
});

// DELETE para eliminar un mueble
server.delete('/api/v1/muebles/:codigo', async (req, res) => {
    try {
        const collection = await connectToCollection('muebles');
        const codigo = Number(req.params.codigo);
        const response = await collection.deleteOne({ codigo });
        if (response.deletedCount === 1) {
            res.status(200).json({ message: 'Registro eliminado' });
        } else {
            res.status(400).json({ message: 'El código no corresponde a un mueble registrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Se ha generado un error en el servidor' });
    } finally {
        disconnectMongo();
    }
});

// Control de ruta no encontrada
server.use('*', (req, res) => {
    res.status(404).json({ message: 'No encontrado' });
});

// Levantamos el servidor
server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Server running on http://${SERVER_HOST}:${SERVER_PORT}`);
});
