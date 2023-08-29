const { Router } = require("express");
const router = Router();

const path=require('path')
const fs=require('fs')

let ruta = path.join(__dirname,'..','archivos','productos.json')


function saveProducts(productos){
    fs.writeFileSync(ruta,JSON.stringify(productos,null,5))
}

function addProduct(title,description,category,price,thumbnail,code,stock){ 
    const productos = getProducts()
    let newProduct ={
        title:title,
        description:description,
        category:category,
        price:price,
        thumbnail:thumbnail,
        code:code,
        stock:stock , 
        status:true,
    }
    if(productos.length===0){
        newProduct.id=1
    }else{
        newProduct.id=productos.length+1;
    }
    for (let index = 0; index < productos.length; index++) {
        if(code===productos[index].code){
            return console.log(`Error el producto ${title} no se pudo agregar porque se repite el code`)
        }
    }
    productos.push(newProduct) 
    saveProducts(productos)
}
function getProducts() {
    let productos = [];

    if (fs.existsSync(ruta)) {
        try {
            const data = fs.readFileSync(ruta, 'utf-8');
            productos = JSON.parse(data);
        } catch (error) {
            console.error('Error al parsear el archivo JSON:', error);
        }
    }

    return productos;
}

  
function getProductById(idFind) { 
    const productos = getProducts()
    const productId = parseInt(idFind); 
    if (isNaN(productId)) {
        return res.status(400).json({ error: 'El id no es un número' });
      }
    const product = productos.find(prod => prod.id === productId);

    if (!product) {
        console.log(`Error, el producto con id ${idFind} no existe`);
        return null;
    }

    return product;
}

router.get('/',(req,res) => {
    const limit = parseInt(req.query.limit);
    const productos = getProducts()
    if (limit) {
        let productoslimit =productos.slice(0, limit);
        res.json(productoslimit);
    } else {
        res.json(productos);
    }
})
 
router.get('/:pid', (req, res) => { 
    const idProducto = parseInt(req.params.pid);
    if (isNaN(idProducto)) {
        return res.status(400).json({ error: 'El id no es un número'});
      }
    const producto = getProductById(idProducto);
    
    if (producto) {
        res.send(`El producto con ID ${idProducto} es: ${JSON.stringify(producto)}`);
    } else {
        res.send(`No se encontró ningún producto con ID ${idProducto}`);
    }
}); 
router.post('/', (req, res) => { 
    const productosAgregar = req.body;

    if (!Array.isArray(productosAgregar)) {
        return res.status(400).json({ error: 'Debe ingresar un array de productos' });
    }

    productosAgregar.forEach(product => {
        const { title, description, category, price, thumbnail, code, stock } = product;

        if (!title || !description || !category || !price || !thumbnail || !code || !stock) {
            return res.status(400).json({ error: 'El valor ingresado no es válido' });
        }

        addProduct(title, description, category, price, thumbnail, code, stock);
    });

    res.status(201).json({ message: 'Productos agregados exitosamente' });
});

  router.put('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El id no es un número' });
    }

    const productos = getProducts();
    const productIndex = productos.findIndex(product => product.id === id);

    if (productIndex === -1) {
        return res.status(400).json({ error: `El producto con id ${id} no existe` });
    }

    const fieldsToUpdate = req.body;

    if (Object.keys(fieldsToUpdate).length === 0) {
        return res.status(400).json({ error: 'Debe ingresar al menos un campo para actualizar' });
    }

    productos[productIndex] = Object.assign({}, productos[productIndex], fieldsToUpdate);

    saveProducts(productos);
    res.status(200).json({ message: 'Producto modificado exitosamente', productoModificado: productos[productIndex] });
});



  router.delete('/:pid', (req,res) => {
    const id = parseInt(req.params.pid);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El id no es un número' });
      }
      const productos = getProducts()

      let index = productos.findIndex(producto => producto.id === id);

      if (index === -1){
        return res.status(400).json({error:`El id ${id} no existe`})
      }

      let productoEliminado = productos.splice(index, 1);

      res.status(200).json({productoEliminado}) 
      saveProducts(productos)
  });

  module.exports = router; 
  
  