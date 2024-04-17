"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* Mongoose Model */
var mongoose_1 = require("mongoose");
var messageSchema = new mongoose_1.default.Schema({
    channel: String,
    account: String,
    text: String,
});
var Message = mongoose_1.default.model("Message", messageSchema);
exports.default = Message;
