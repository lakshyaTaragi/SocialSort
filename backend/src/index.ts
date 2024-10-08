import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const port: number = 8000

const app: Express = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.get("/", (req: Request, res: Response) => {
    res.send("hello from express + ts* !!!2")
})

app.get("/hi", (req: Request, res: Response) => {
    res.json({
        message: "hiiiiii",
        code: 123
    })
})

app.post("/action/", (req: Request, res: Response) => {
    console.log("received action request: ", req.body)
    res.json({
        success: true,
        message: "Action data received successfully"
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

