import { Router } from "express";
import { User } from "../models/user.model";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
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