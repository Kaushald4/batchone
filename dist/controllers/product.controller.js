"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getAllProducts = exports.addProduct = void 0;
const formidable_1 = __importDefault(require("formidable"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const imageUpload_1 = require("../services/imageUpload");
const asyncHandler_1 = __importDefault(require("../services/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
const index_1 = __importDefault(require("../config/index"));
const product_schema_1 = __importDefault(require("../models/product.schema"));
/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/
exports.addProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const form = (0, formidable_1.default)({
        multiples: true,
        keepExtensions: true,
    });
    form.parse(req, async function (err, fields, files) {
        try {
            if (err) {
                throw new customError_1.default(err.message || "Something went wrong", 500);
            }
            let productId = new mongoose_1.default.Types.ObjectId().toHexString();
            //console.log(fields, files)
            // check for fields
            if (!fields.name || !fields.price || !fields.description || !fields.collectionId) {
                throw new customError_1.default("Please fill all details", 500);
            }
            // handling images
            let imgArrayResp = Promise.all(Object.keys(files).map(async (filekey, index) => {
                const element = files[filekey];
                const data = fs_1.default.readFileSync(element.filepath);
                const upload = await (0, imageUpload_1.s3FileUpload)({
                    bucketName: index_1.default.S3_BUCKET_NAME,
                    key: `products/${productId}/photo_${index + 1}.png`,
                    body: data,
                    contentType: element.mimetype,
                });
                return {
                    secure_url: upload.Location,
                };
            }));
            let imgArray = await imgArrayResp;
            const product = await product_schema_1.default.create({
                _id: productId,
                photos: imgArray,
                ...fields,
            });
            if (!product) {
                throw new customError_1.default("Product was not created", 400);
                //remove image
            }
            res.status(200).json({
                success: true,
                product,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Something went wrong",
            });
        }
    });
});
/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 *********************************************************/
exports.getAllProducts = (0, asyncHandler_1.default)(async (req, res) => {
    const products = await product_schema_1.default.find({});
    if (!products) {
        throw new customError_1.default("No product was found", 404);
    }
    res.status(200).json({
        success: true,
        products,
    });
});
/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/product
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 *********************************************************/
exports.getProductById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id: productId } = req.params;
    const product = await product_schema_1.default.findById(productId);
    if (!product) {
        throw new customError_1.default("No product was found", 404);
    }
    res.status(200).json({
        success: true,
        product,
    });
});
// assignment to read
/*
model.aggregate([{}, {}, {}])

$group
$push
$$ROOT
$lookup
$project

*/
