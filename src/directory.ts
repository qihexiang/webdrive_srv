import { Router } from "express";
import { readdir } from "fs/promises";
import { join } from "path";
import { FILE_ROOT } from "./config";
import listDir from "./dao/listDir";

/**
 * dir是用于进行目录操作的路由
 * 
 * 请求方法：
 * 
 * - GET [dirpath]：列出特定路径下的文件和文件夹
 * - POST [dirpath]：在指定路径下创建新的文件夹
 */
const dir = Router()

dir.get("/:dirpath(*{0,})", async (req, res) => {
    const dirpath = req.params["dirpath"]
    const fullPath = join(FILE_ROOT, dirpath)
    try {
        const { dirs, files } = await listDir(fullPath)
        res.json({
            dirs, files
        })
    } catch (err) {
        res.status(403).json(err)
    }
})

export default dir