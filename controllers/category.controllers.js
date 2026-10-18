const categoryServices = require("../services/category.services")
const asyncWrapper = require("../middlewares/asyncWrapper")
const httpStatusText = require("../utils/httpStatusText")

const createCategory = asyncWrapper(async (req , res) => {
    const data = req.body
    const result = await categoryServices.createCategory(data);
    res.status(201).json({Status: httpStatusText.SUCCESS, message: "Category created successfully", data: {result}})
})

module.exports = {
    createCategory,

}