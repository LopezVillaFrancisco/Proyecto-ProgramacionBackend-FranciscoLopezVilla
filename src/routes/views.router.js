const { Router } = require('express');
const router = Router(); 

router.get('/products', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).render('products');
}) 

router.get('/carts/:id', (req, res) => {
    const cartId = req.params.id;
    res.setHeader('Content-Type', 'text/html');
    res.render('cart', { cartId });
});
module.exports = router; 
