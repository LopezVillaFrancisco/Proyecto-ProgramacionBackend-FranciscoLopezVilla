const { Router } = require('express');
const router = Router();
const Product = require('../models/Product'); 

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1; 
    const sort = req.query.sort;
    const validSortValues = ["asc", "desc"];
  
    let sortOption = {};
  
    if (sort && validSortValues.includes(sort)) {
      sortOption = { price: sort }; 
    } 
  
    const querys = {
      limit,
      page,
      sort: sortOption,
    };
  
    try {
      const productos = await Product.paginate({}, querys);
  
      const response = {
        totalItems: productos.totalDocs,
        totalPages: productos.totalPages,
        currentPage: productos.page,
        hasNextPage: productos.hasNextPage,
        hasPrevPage: productos.hasPrevPage,
        data: productos.docs,
      };  
  
      const urlActual = req.originalUrl.replace(/\?.*$/, ''); 
      console.log(urlActual); 
      console.log(productos.prevPage); 
      console.log(productos.nextPage);
      const prevLink = productos.hasPrevPage ? `${urlActual}?page=${productos.prevPage}` : null;
      console.log(prevLink);
      const nextLink = productos.hasNextPage ? `${urlActual}?page=${productos.nextPage}` : null;
      console.log(nextLink);
  
      response.prevLink = prevLink;
      response.nextLink = nextLink;
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  });
  

 
router.get('/:pid', async (req, res) => { 
    const productId = req.params.pid
    try{
    const product = await Product.findById(productId);
    
    if(!product) {
      res.status(404).json({ error: `No se encontró ningún producto con id ${productId}` });
    }

    res.json({ product});

  }catch (error) { 
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});  
router.post('/',async (req, res) => {
    const newProdcuct = new Product(req.body)
    const productSaved = await newProdcuct.save()
    res.send(productSaved);
});

  router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const fieldToUpdate = req.body

    try{
    const productUpdate = await Product.findById(productId);

    if (!productUpdate){
      return res.status(404).json({ error: `El producto con ID ${productId} no existe` });
    } 
    const allowedFields = ['title', 'description', 'price', 'stock', 'status'];

    for (const field in fieldToUpdate) {
        if (!allowedFields.includes(field)) {
            delete fieldToUpdate[field];
        }
    }
    Object.assign(productUpdate, fieldToUpdate);

    await productUpdate.save(); 
    res.status(200).json({ message: 'Producto modificado exitosamente'});
  }catch(error){
    res.status(500).json({ error: 'Error al editar el producto' });
  }
});



router.delete('/:pid', async (req, res) => {
  const productId = req.params.pid;

  try {
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ error: `El producto con ID ${productId} no existe` });
      }

      await product.remove();

      res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});


  module.exports = router; 
  
  