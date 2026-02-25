import {z} from "zod"

export const createUSerSchema = z.object({
    name:z.string().min(2),
    email:z.string().email(),
    password:z.string().min(6),
    role:z.enum(["owner" , "admin" , "manager" , "user"]).default("user"),
})