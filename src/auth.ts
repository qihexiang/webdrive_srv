import { Router } from "express"
import bodyParser from "body-parser"
import z from "zod";
import prisma from "./dao/prisma";
import { Permission } from "@prisma/client";
import bcrypt from "bcrypt"
import session from "./session";

const registrySchema = z.object({
    username: z.string().min(5).max(255).regex(/[a-z,A-Z,0-9]/),
    password: z.string().min(5).max(255)
})

const authRoute = Router();

authRoute.use()
authRoute.post("/registry", async (req, res) => {
    const checkResult = registrySchema.safeParse(req.body);
    if (checkResult.success) {
        const { username, password } = checkResult.data;
        const bcrpted = await bcrypt.hash(password, 8);
        const { user, group, homeDirectory } = await prisma.$transaction(async (prisma) => {
            const { user, group } = await prisma.userGroup.create({
                data: {
                    user: {
                        create: {
                            username, password: bcrpted
                        }
                    },
                    group: {
                        create: {
                            groupname: username
                        }
                    }
                },
                select: {
                    user: {
                        select: {
                            username: true
                        }
                    }, group: true
                }
            })
            const homeDirectory = await prisma.directory.create({
                data: {
                    dirname: username, owner: {
                        connect: { username }
                    }, group: {
                        connect: { groupname: username }
                    }, groupPermission: Permission.R
                }
            })
            return { user, group, homeDirectory }
        })
        res.json({ user, group, homeDirectory })
    } else {
        res.status(400).json(checkResult.error)
    }
})
authRoute.post("/login", session, async (req, res) => {
    const checkResult = registrySchema.safeParse(req.body);
    if (checkResult.success) {
        const { username, password } = checkResult.data;
        const user = await prisma.user.findUnique({
            where: { username }, select: {
                password: true
            }
        })
        if (user !== null) {
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                req.session.username = username;
                await req.session.save()
                res.status(200).json({ username })
            } else {
                res.status(403).json("Invalid username or password")
            }
        } else {
            res.status(403).json("Invalid username or password")
        }
    } else {
        res.status(400).json(checkResult.error)
    }
})
authRoute.get("/user", session, async (req, res) => {
    if (req.session.username !== undefined) {
        res.json({
            username: req.session.username
        })
    } else {
        res.status(403).json({
            message: "Not logged in."
        })
    }
})
authRoute.post("/logout", session, async (req, res) => {
    req.session.destroy();
    res.json({
        message: "success"
    })
})

export default authRoute;