const Category = require("../models/categories.model")
const appError = require("../utils/appError")
const httpStatusText = require("../utils/httpStatusText")

const createCategory = async (data) => {
    const {categoryName , description} = data

    const exsistCategory = await Category.findOne({categoryName})
    if (exsistCategory) {
        throw appError.create("Category is already exsist", 403, httpStatusText.FAIL)
    }

    const newCategoty = new Category({
        categoryName,
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

const getCategories = async () => {
    const categories = await Category.find({}, {"__v": false, "_id": false});

    return {
        categoryData: categories
    };
};

const updateCategory = async (currentName, updateData) => {
    const updateCategory = await Category.findOne({categoryName: currentName})
    if (!updateCategory) {
        throw appError.create("Category is not exsist", 404, httpStatusText.FAIL)
    }

    const {categoryName, description} = updateData
    
    updateCategory.categoryName = categoryName
    updateCategory.description = description
    await updateCategory.save()

    return {
        categoryData: {
            categoryId: updateCategory._id,
            name: updateCategory.name,
            description: updateCategory.description,
            createdAt: updateCategory.createdAt,
            updatedAt: updateCategory.updatedAt
        }
    }
}

const deleteCategory = async (currentName) => {
    const deletedCategory = await Category.findOneAndDelete({categoryName: currentName})
}
module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}