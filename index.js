"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ably = exports.app = exports.envPath = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var mongoose_1 = require("mongoose");
var cors = require("cors");
var dotenv = require("dotenv");
var helmet_1 = require("helmet");
var morgan = require("morgan");
var http = require("http");
var Ably = require("ably");
var path = require("path");
exports.envPath = path.resolve(__dirname, "./.env");
dotenv.config({ path: exports.envPath });
/* CONFIGURATIONS */
exports.app = express();
exports.app.use(express.json());
exports.app.use((0, helmet_1.default)());
exports.app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
exports.app.use(morgan("common"));
exports.app.use(bodyParser.json({ limit: "30mb" }));
exports.app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
exports.app.use(cors());
/**Ably Setup */
exports.ably = new Ably.Realtime({ key: process.env.ABLY_API_KEY });
var server = http.createServer(exports.app);
/* MONGOOSE SETUP */
var PORT = process.env.PORT || 6001;
var MONGO_URL = process.env.MONGO_URL || "";
/* Mongoose Model */
var messageSchema = new mongoose_1.default.Schema({
    channel: String,
    account: String,
    text: String,
});
var Message = mongoose_1.default.model("Message", messageSchema);
var channel = exports.ably.channels.get("messages");
channel.attach();
var connectWithRetry = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.ably.connection.once("connected")];
            case 1:
                _a.sent();
                exports.ably.channels.get("messages");
                console.log("connecting");
                mongoose_1.default
                    .connect(MONGO_URL)
                    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        exports.app.listen(PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
                            var messages;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        console.log("Server connected to port: ".concat(PORT, "\n"));
                                        return [4 /*yield*/, Message.find().lean()];
                                    case 1:
                                        messages = _a.sent();
                                        channel.attach();
                                        channel.publish("messages", messages);
                                        channel.subscribe("getMessages", function () { return __awaiter(void 0, void 0, void 0, function () {
                                            var messages;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Message.find().lean()];
                                                    case 1:
                                                        messages = _a.sent();
                                                        channel.publish("messages", messages);
                                                        console.log("messages requested");
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        channel.subscribe("newMessage", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                                            var newMessage, messages;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        newMessage = new Message(msg.data);
                                                        return [4 /*yield*/, newMessage.save()];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, Message.find().lean()];
                                                    case 2:
                                                        messages = _a.sent();
                                                        channel.publish("messages", messages);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                    });
                }); })
                    .catch(function (error) {
                    console.log("".concat(error, " did not connect"));
                    // setTimeout(connectWithRetry, 3000);
                });
                return [2 /*return*/];
        }
    });
}); };
connectWithRetry();