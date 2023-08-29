const express = require('express');
const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router'); 

const app = express();

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter); 

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
