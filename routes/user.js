"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var User_1 = require("../controllers/User");
var router = express.Router();
router.get("/messages", User_1.getMessages);
router.post("/new", User_1.newMessage);
exports.default = router;
