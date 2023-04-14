import express from "express"
import dir from "./directory";

const app = express();

app.get("/", (req, res) => {
    res.send("hello, world")
})

app.use("/dir", dir)

app.listen(8080)
