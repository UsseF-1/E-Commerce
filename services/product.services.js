const Product = require("../models/products.model")
const Category = require("../models/categories.model");
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")
const roles = require("../utils/usersRoles");

const createProduct = async (productData, currentUser) => {
    const { productName, description, price, stock, images, category } = productData;
    
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
        throw appError.create("Category not found", 404, httpStatusText.FAIL);
    }

    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
        throw appError.create("Product already exists", 409, httpStatusText.FAIL);
    }

    const newProduct = new Product({
        productName,
        description,
        price,
        stock,
        category: existingCategory._id,
        seller: currentUser.id, 
        images: images || []
    });

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
    };
};

const getProducts = async () => {
    const products = await Product.find({ status: "ACTIVE" })
        .populate("category", "categoryName")
        .populate("seller", "firstName lastName email")
        .select("-__v");

    return {
        productsData: products
    }
}

const getProduct = async (productData) => {
    const product = await Product.findById(productData)
        .populate("category", "categoryName")
        .populate("seller", "firstName lastName email")
        .select("-__v");;

    if (!product) {
        throw appError.create("Product is not exists", 404, httpStatusText.FAIL);
    }

    return {
        productData: product
    }
}

const updateProduct = async (productId, updateData, currentUser) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw appError.create("Product not found", 404, httpStatusText.FAIL);
    }

    const isOwner = product.seller.toString() === currentUser.id;
    const isAdmin = currentUser.role === roles.ADMIN;

    if (!isOwner && !isAdmin) {
        throw appError.create("You can only edit your own products", 403, httpStatusText.FAIL);
    }

    Object.assign(product, updateData);

    await product.save();

    return { 
        productData: product
    };
};

const deleteProduct = async (productId, currentUser) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw appError.create("Product not found", 404, httpStatusText.FAIL);
    }

    const isOwner = product.seller.toString() === currentUser.id;
    const isAdmin = currentUser.role === roles.ADMIN;

    if (!isOwner && !isAdmin) {
        throw appError.create("You can only edit your own products", 403, httpStatusText.FAIL);
    }
    
    await Product.findByIdAndDelete(productId)
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}