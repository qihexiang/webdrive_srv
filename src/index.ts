import express from "express"
import fileRoute from "./file";
import dirRoute from "./directory";
import { join } from "path";

const app = express();

app.use("/file", fileRoute)
app.use("/dir", dirRoute)
app.use(express.static(join(__dirname, "..", "static")))
app.use((req, res) => {
    res.sendFile(join(__dirname, "..", "static", "index.html"))
})

app.listen(8080)
