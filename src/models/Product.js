const {Schema,model} = require('mongoose'); 
const mongoosePaginte = require('mongoose-paginate-v2')
const productSchema = new Schema({
    title:String,
    description:String,
    category:String,
    price:Number,
    thumbnails:String,
    code:String,
    stock:Number, 
    status: { type: Boolean, default: true }
})

productSchema.plugin(mongoosePaginte)

module.exports = model('Product',productSchema)