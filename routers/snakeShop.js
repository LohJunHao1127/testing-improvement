const express = require("express");
const createHttpError = require("http-errors");
const { NotFoundError, DuplicateEntryError } = require("../errors");
const {
    insertsScore

} = require("../models/snakeShop");
const router = express.Router();

//3 handle the request
router.post("/", function (req, res, next) {

    const { score, userid } = req.body;

    insertsScore(score, userid)
        .then(function (list) {
            return res.json({ data: list });
        })
        .catch(function (error) {
            next(createHttpError(400, error.message));
        });
});

module.exports = router;