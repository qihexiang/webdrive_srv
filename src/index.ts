import express from "express"
import fileRoute from "./file";
import dir from "./directory";

const app = express();

app.get("/", (req, res) => {
    res.send("hello, world")
})

app.use("/file", fileRoute)
app.use("/dir", dir)

app.listen(8080)
