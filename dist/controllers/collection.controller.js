"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCollections = exports.deleteCollection = exports.updateCollection = exports.createCollection = void 0;
const collection_schema_1 = __importDefault(require("../models/collection.schema"));
const asyncHandler_1 = __importDefault(require("../services/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
/******************************************************
 * @Create_COLLECTION
 * @route http://localhost:5000/api/collection
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ******************************************************/
exports.createCollection = (0, asyncHandler_1.default)(async (req, res) => {
    //take name from front end
    const { name } = req.body;
    if (!name) {
        throw new customError_1.default("Collection name is required", 400);
    }
    //add this name to database
    const collection = await collection_schema_1.default.create({
        name,
    });
    //send this response value to frontend
    res.status(200).json({
        success: true,
        message: "Collection created with success",
        collection,
    });
});
exports.updateCollection = (0, asyncHandler_1.default)(async (req, res) => {
    //existing value to be updates
    const { id: collectionId } = req.params;
    //new value to get updated
    const { name } = req.body;
    if (!name) {
        throw new customError_1.default("Collection name is required", 400);
    }
    let updatedCollection = await collection_schema_1.default.findByIdAndUpdate(collectionId, {
        name,
    }, {
        new: true,
        runValidators: true,
    });
    if (!updatedCollection) {
        throw new customError_1.default("Collection not found", 400);
    }
    //send response to front end
    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        updateCollection: exports.updateCollection,
    });
});
exports.deleteCollection = (0, asyncHandler_1.default)(async (req, res) => {
    const { id: collectionId } = req.params;
    const collectionToDelete = await collection_schema_1.default.findByIdAndDelete(collectionId);
    if (!collectionToDelete) {
        throw new customError_1.default("Collection not found", 400);
    }
    collectionToDelete.remove();
    //send response to front end
    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
    });
});
exports.getAllCollections = (0, asyncHandler_1.default)(async (req, res) => {
    const collections = await collection_schema_1.default.find();
    if (!collections) {
        throw new customError_1.default("No Collection found", 400);
    }
    res.status(200).json({
        success: true,
        collections,
    });
});
