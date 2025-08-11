const express = require("express");
const router = express.Router();
const jwtValidatorMiddleware = require("../../middlewares/jwt-validator.middleware");
const requestValidatorMiddleware = require("../../middlewares/request-validator.middleware");
const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");
const { idParam } = require("../../validators/common.validator");

const { createFeesCollectionSchema, deleteFeesCollectionSchema } = require("../../validators/feesCollection.validator");
const { getAllFeesWithDetails, createFeesCollection, deleteFeesCollection, updateFeesCollection } = require("../../controllers/feesCollection.controller");

router.get('/', jwtValidatorMiddleware, getAllFeesWithDetails);

router.post('/',
    jwtValidatorMiddleware,
    requestValidatorMiddleware([createFeesCollectionSchema], [BODY]),
    createFeesCollection
);

router.delete('/:id',
    jwtValidatorMiddleware,
    requestValidatorMiddleware([deleteFeesCollectionSchema], [PARAMS]),
    deleteFeesCollection);

router.put('/:id',
    jwtValidatorMiddleware, requestValidatorMiddleware([idParam, createFeesCollectionSchema], [PARAMS, BODY]),
    updateFeesCollection)

module.exports = router;
