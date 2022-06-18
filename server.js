//import express from 'express'
const express = require('express')
const { Router } = express
const Api = require('./clases/api.js')

const app = express()
const router = express.Router()

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto http://localhost:${PORT}`);
})
server.on('error', error => console.log(`Error en el servidor ${error}`))

app.use('/api/productos', router)
app.use('/', express.static(__dirname + '/public'))

router.use(express.json())
router.use(express.urlencoded({extended:true}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

/*----*/

let products = []
const productos = new Api(products)

router.get('/', (req, res)=>{
    productos.getAll().length > 0 ? res.json(productos.getAll()) : res.json({msg:'No hay productos'})
})

router.get('/:id', (req,res)=>{
    let id = parseInt(req.params.id)
    productos.getById(id) ? res.json(productos.getById(id)) : res.json({error:'Producto no encontrado'})
})

router.post('/', (req, res)=>{
    let product = {title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail}
    req.body.title.length > 0 && req.body.price > 0 && req.body.thumbnail > 0 ?
    res.json(productos.add(product)) :
    res.json({error:'Debes completar todos los campos'})
})

router.put('/:id', (req,res)=>{
    let id = parseInt(req.params.id)
    let prodFinded = products.find(p => p.id === id)
    let prodUpdated = {id: id, title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail}
    prodFinded ? res.json(productos.updateById(id, prodUpdated)) : res.json({error:'El producto que quiere actualizar no se existe'})
})

router.delete('/:id', (req,res)=>{
    let id = parseInt(req.params.id)
    let prodFinded = products.find(p => p.id === id)
    prodFinded ? res.json(productos.deleteById(id)) : res.json({error:'El producto que quiere eliminar no se existe'})
})
