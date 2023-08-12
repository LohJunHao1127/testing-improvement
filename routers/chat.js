const express = require("express");
const createHttpError = require("http-errors");
const { NotFoundError, DuplicateEntryError } = require("../errors");
const {
    insertMessage,
    getMessages

} = require("../models/chat");
const router = express.Router();

//3 handle request for chat
router.post('/', function (req, res, next) {
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const message = req.body.message;

    insertMessage(sender, receiver, message)
        .then(function () {
            res.json({ success: true });
        })
        .catch(function (error) {
            next(error);
        });
});

// get chat history
router.get('/:userId/:myUserId', function (req, res, next) {
    const userId = req.params.userId;
    console.log("checking userid: " + userId);
    const myUserId = req.params.myUserId;
    console.log("checking my own userid: " + myUserId);

    getMessages(userId, myUserId, myUserId, userId)
        .then(function (list) {
            return res.json({ data: list });
        })
        .catch(function (error) {
            next(error);
        });
});

module.exports = router;
