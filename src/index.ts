import express from "express"
import fileRoute from "./file";
import dirRoute from "./directory";

const app = express();

app.get("/", (req, res) => {
    res.send("hello, world")
})

app.use("/file", fileRoute)
app.use("/dir", dirRoute)

app.listen(8080)
