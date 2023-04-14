import {Router} from "express"
import { FILE_ROOT } from "./config"
import { join } from "path"

/**
 * fileRoute适用于下载和上传文件的路由
 * 
 * 访问方法：
 * 
 * - GET [filepath]：下载指定路径上的文件
 * - POST [dirpaht]：把文件上传到指定目录
 */
const fileRoute = Router()

fileRoute.get("/:filepath(*{0,})", (req, res) => {
    const filepath = req.params["filepath"]
    const fullPath = join(FILE_ROOT, filepath)
    res.sendFile(fullPath)
})

export default fileRoute