const express = require("express");
const createHttpError = require("http-errors");
const router = express.Router();
const tSettings = require("../models/tetrisSettings.js");
const bodyParser = require("body-parser");
router.use(bodyParser.json());


// GET 


// GET: Retrieve Tetris settings for a user
router.get("/settingsRetrive/:userid", async (req, res) => {
    const { userid } = req.params;

    try {
        const result = await tSettings.getSettings(userid);
        if (result) {
            res.status(200).json({ success: true, result: result, message: 'Tetris settings retrieved successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Tetris settings not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// POST: Create new Tetris settings for a user
router.post('/settingsCreate', async (req, res) => {
    const { userid, rotate, left, right, down, drop, hold, pause,reset } = req.body;

    try {
        const result = await tSettings.insertUpdateSettings(userid, rotate, left, right, down, drop, hold, pause,reset);
        console.log(result[0].affectedRows);
        if (result[0].affectedRows > 0) {
            res.status(201).json({ success: true, message: 'Tetris settings created successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Error creating Tetris settings' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



module.exports = router;
