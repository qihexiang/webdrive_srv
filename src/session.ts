import { ironSession } from "iron-session/express";

const session = ironSession({
  cookieName: "iron-session/examples/express",
  password: "jfjeiqj3294300{}rfej43129-1()()-",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});

declare module "iron-session" {
    interface IronSessionData {
        username?: string
    }
}

export default session