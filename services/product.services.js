const Product = require("../models/products.model")
const Category = require("../models/categories.model");
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

const createProduct = async (productData, sellerId) => {
    const {productName, description, price, stock, images, category} = productData
    
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
        throw appError.create("Category not found", 404, httpStatusText.FAIL);
    }

    const existingProduct = await Product.findOne({productName});
    if (existingProduct) {
        throw appError.create("Product is already exists", 409, httpStatusText.FAIL);
    }

    const newProduct = new Product({
        productName,
        description,
        price,
        stock,
        category: existingCategory._id,
        seller: sellerId,
        images: images || []
    })
    await newProduct.save();

    await newProduct.populate([
    {
        path: "seller",
        select: "firstName lastName"
    }
]);

    return {
        productData: {
            productId: newProduct._id,
            productName: newProduct.productName,
            description: newProduct.description,
            price: newProduct.price,
            stock: newProduct.stock,
            seller: newProduct.seller,
            category: existingCategory.categoryName,
            status: newProduct.status,
            createdAt: newProduct.createdAt
        }
    }
}

module.exports = {
    createProduct,

}