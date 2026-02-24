import {Router} from "express"
import { createUserController } from "./userController";


const router = Router();

router.post("/create",createUserController)

export default router;