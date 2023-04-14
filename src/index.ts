import express from "express"
import fileRoute from "./file";

const app = express();

app.get("/", (req, res) => {
    res.send("hello, world")
})

app.use("/file", fileRoute)

app.listen(8080)
