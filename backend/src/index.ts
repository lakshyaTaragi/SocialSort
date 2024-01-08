// const express = require('express');
import express, { Express, Request, Response } from 'express';
const port: number = 8000;

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
    res.send("hello from express + ts* !!!2");
});

app.get("/hi", (req: Request, res: Response) => {
    res.send("hiiiiii");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

