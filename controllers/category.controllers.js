const categoryServices = require("../services/category.services")
const asyncWrapper = require("../middlewares/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")

const createCategory = asyncWrapper(async (req , res) => {
    const data = req.body
    const result = await categoryServices.createCategory(data);
    res.status(201).json({Status: httpStatusText.SUCCESS, message: "Category created successfully", data: result})
})

const getCategories = asyncWrapper(async (req, res) => {
    const result = await categoryServices.getCategories();
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Category Displayed successfully", data: result})
})

const updateCategory = asyncWrapper(async (req, res) => {
    const currentName = req.params.name;
    const updateData = req.body;

    const result = await categoryServices.updateCategory(currentName, updateData);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Category Updateed successfully", data: result})
})

const deleteCategory = asyncWrapper(async (req, res) => {
    const currentName = req.params.name
    await categoryServices.deleteCategory(currentName);
    res.status(200).json({Status: httpStatusText.SUCCESS, message: "Category Deleted successfully", data: null})
})

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}