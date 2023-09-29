const { Schema, model } = require("mongoose");

const cartsColl = 'carts';

const cartsSchema = new Schema({
    id: Number,
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity: Number,
        },
    ],
});

module.exports =  cartModel = model(cartsColl, cartsSchema);