
const paginate = async (model, query, options) => {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const skip = (page - 1) * limit;
  
    const totalDocuments = await model.countDocuments(query);
  
    const results = await model.find(query).skip(skip).limit(limit);
  
    return {
      page,
      limit,
      totalDocuments,
      totalPages: Math.ceil(totalDocuments / limit),
      results,
    };
  };
  
  module.exports = paginate;
  