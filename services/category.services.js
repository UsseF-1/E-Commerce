const Category = require("../models/categories.model")
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

const createCategory = async (data) => {
    const {name , description} = data

    const exsistCategory = await Category.findOne({name: name})
    if (exsistCategory) {
        throw appError.create("Category is already exsist", 403, httpStatusText.FAIL)
    }

    const newCategoty = new Category({
        name,
        description
    })

    await newCategoty.save()

    return {
        categoryData: {
            categoryId: newCategoty._id,
            name: newCategoty.name,
            description: newCategoty.description,
            createdAt: newCategoty.createdAt,
            updatedAt: newCategoty.updatedAt
        },
    }
}

module.exports = {
    createCategory,

}