const express = require('express');
const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const {engine} = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

require('./database');

const app = express();

app.use(express.json());
const PORT = 8080;
app.engine(
  'handlebars',
  engine({
    extname: 'handlebars',
    defaultLayout: 'main',
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

const serverExpress = app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});

const serverSocket = new Server(serverExpress);

serverSocket.on('connection', (socket) => {
  console.log('Usuario conectado');
});

module.exports = { serverSocket };
