const express = require("express");
const createHttpError = require("http-errors");
const { NotFoundError, DuplicateEntryError } = require("../errors");
const {
    getReceivedFriends,
    getSentReqFriends,
    searchByUsername,
    addNewFriends,
    deleteFriends,
    updateStatus,
    getFriends

} = require("../models/friends");
const router = express.Router();


router.get("/:username", function (req, res, next) {
    const username = req.params.username;
    searchByUsername(username)
        .then(function (list) {
            res.json({ data: list });
        })
        .catch(function (error) {
            next(error);
        });
});

//3 handle the request
router.get("/", function (req, res, next) {
    console.log("handling request");

    const userid = +req.query.userid;
    const gameid = +req.query.gameid;
    const type = req.query.type; // Assuming you have a "type" parameter to determine the request type

    if (type === "received") {
        // Handle "received" requests
        getReceivedFriends(gameid, userid)
            .then(function (list) {
                return res.json({ data: list });
            })
            .catch(function (error) {
                next(error);
            });
    } else if (type === "sent") {
        // Handle "sent" requests
        getSentReqFriends(gameid, userid)
            .then(function (list) {
                return res.json({ data: list });
            })
            .catch(function (error) {
                next(error);
            });
    } else if (type == "friends") {
        // Handle "friends" requests

        getFriends(gameid, userid)
            .then(function (list) {
                return res.json({ data: list });
            })
            .catch(function (error) {
                next(error);
            });
    }
});

//3 handle the request
router.get("/:username", function (req, res, next) {
    const username = req.params.username;
    searchByUsername(username)
        .then(function (list) {
            res.json({ data: list });
        })
        .catch(function (error) {
            next(error);
        });
});

//3 handle the request
router.post("/", function (req, res, next) {

    const { gameid, received_request, sent_request } = req.body;

    addNewFriends(gameid, received_request, sent_request)
        .then(function (list) {
            return res.json({ data: list });
        })
        .catch(function (error) {
            next(createHttpError(400, error.message));


        });
});
//3 handle the request
router.put("/:id", function (req, res, next) {
    const id = +req.params.id;
    const status = req.body.status;
    updateStatus(status, id)
        .then(function () {
            return res.sendStatus(200);
        })
        .catch(function (error) {
            if (error instanceof NotFoundError) {
                next(createHttpError(404, error.message));
            } else {
                next(error);
            }
        });
});

//3 handle the request
router.delete("/:sent_request/:received_request/:gameId", function (req, res, next) {
    const sent_request = +req.params.sent_request;
    const received_request = +req.params.received_request;
    const gameId = +req.params.gameId;
    deleteFriends(received_request, sent_request, gameId)
        .then(function () {
            return res.sendStatus(200);
        })
        .catch(function (error) {
            if (error instanceof NotFoundError) {
                next(createHttpError(404, error.message));
            } else {
                next(error);
            }
        });
});

module.exports = router;
