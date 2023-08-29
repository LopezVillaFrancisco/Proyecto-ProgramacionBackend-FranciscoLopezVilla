const { Router } = require("express");
const router = Router();

const path = require('path');
const fs = require('fs');

let ruta = path.join(__dirname, '..', 'archivos', 'carts.json');

function saveCarts(carts) {
    fs.writeFileSync(ruta, JSON.stringify(carts, null, 5));
}

function addCart(products) {
    const carts = getCarts();
    let newCart = {
        products: products
    };
    if (carts.length === 0) {
        newCart.id = 1;
    } else {
        newCart.id = carts.length + 1;
    }
    carts.push(newCart);
    saveCarts(carts);
}

function getCarts() {
    let carts = [];

    if (fs.existsSync(ruta)) {
        try {
            const data = fs.readFileSync(ruta, 'utf-8');
            carts = JSON.parse(data);
        } catch (error) {
            console.error('Error al parsear el archivo JSON:', error);
        }
    }
    return carts;
}

function getCartsById(idFind) {
    const carts = getCarts();
    const cartId = parseInt(idFind);
    if (isNaN(cartId)) {
        return null;
    }
    const cart = carts.find(prod => prod.id === cartId);

    if (!cart) {
        console.log(`Error, el carrito con id ${idFind} no existe`);
        return null;
    }

    return cart;
}

router.post("/", (req, res) => {
    const { products } = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({ error: "Valor invalido, ingrese un array de productos" });
    }
    addCart(products);
    res.status(201).json({ message: "Carrito agregado exitosamente" });
});

router.get('/:cid', (req, res) => {
    const id = parseInt(req.params.cid);

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El id no es un número' });
    }
    const cart = getCartsById(id);
    if (cart) {
        res.json({ cart });
    } else {
        res.status(404).json({ error: `No se encontró ningún carrito con id ${id}` });
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;

    if (isNaN(cartId) || isNaN(productId) || isNaN(quantity)) {
        return res.status(400).json({ error: 'Los valores ingresados no son válidos' });
    }
    const carts = getCarts();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if (cartIndex === -1) {
        return res.status(404).json({ error: `El carrito con id ${cartId} no existe` });
    }

    const cart = carts[cartIndex];
    const productoRepetidoId = cart.products.findIndex(product => product.productId === productId);

    if (productoRepetidoId === -1) {
        cart.products.push({ productId: productId, quantity: quantity });
    } else {
        cart.products[productoRepetidoId].quantity += quantity;
    }

    saveCarts(carts);
    res.status(201).json({ message: "Producto agregado al carrito exitosamente" });
});

module.exports = router;
