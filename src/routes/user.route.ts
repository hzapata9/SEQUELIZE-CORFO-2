import { Router } from "express";
import { User } from "../models/user.model";
import { verify } from "crypto";
import { verifyToken } from "../middleware/jwt.middleware";

const userRouter = Router();

userRouter.use(verifyToken);

userRouter.get("/", async (req, res) => {
    console.log("REQ>EMAIL: " + req.email);
    console.log("REQ>UAID: " + req.uid);

    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch(error) {
        console.log(error);
        res.status(500).json( {message: "Internal server error"});
    }

});

export { userRouter };
export default userRouter;