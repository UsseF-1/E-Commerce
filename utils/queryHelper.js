const buildFilter = (queryParams) => {
    const filter = { status: "ACTIVE" };

    if (queryParams.search) {
        filter.$or = [
            { productName: { $regex: queryParams.search, $options: "i" } }, 
            { description: { $regex: queryParams.search, $options: "i" } }
        ];
    }

    if (queryParams.category) {
        filter.category = queryParams.category;
    }

    if (queryParams.minPrice || queryParams.maxPrice) {
        filter.price = {};
        if (queryParams.minPrice) filter.price.$gte = Number(queryParams.minPrice); 
        if (queryParams.maxPrice) filter.price.$lte = Number(queryParams.maxPrice); 
    }

    return filter;
};

const buildSort = (sortParam) => {
    return sortParam ? sortParam.split(",").join(" ") : "-createdAt";
};

const buildPagination = (pageParam, limitParam) => {
    const page = Math.max(1, Number(pageParam) || 1);       
    const limit = Math.max(1, Number(limitParam) || 10);    
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

module.exports = {
    buildFilter,
    buildSort,
    buildPagination
};