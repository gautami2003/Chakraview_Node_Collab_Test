const express = require("express");
const router = express.Router();

const { BODY, PARAMS, QUERY } = require("../../constants/request-properties.constant");

// Controller methods.
const {
    mmiWebhook
} = require("../../controllers/public.controller");


router.post(
    "/mmi-webhook",
    mmiWebhook
);


module.exports = router;
