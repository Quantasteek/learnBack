const getAllProducts = async(req, res)=>{
    res.status(200).json({
        success: true,
        message: 'Get all products successfully',
        data: []
    });

}
const getAllProductsTesting = async(req, res)=>{
    res.status(200).json({
        success: true,
        message: 'Get All products testing successfully',
        data: []
    });

}

module.exports = {
    getAllProducts,
    getAllProductsTesting
}