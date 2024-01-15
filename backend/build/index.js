"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const port = 8000;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("hello from express + ts* !!!2");
});
app.get("/hi", (req, res) => {
    res.json({ message: "hiiiiii" });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
