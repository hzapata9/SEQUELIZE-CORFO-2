import { Router } from "express";
import { User } from "../models/user.model";
import jsonwebtoken from "jsonwebtoken";

const authRouter = Router();

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET must be provided");
}

authRouter.post("/register", async (req, res) => {
    console.log("Register User");
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (user) {
          return void res.status(400).json({ message: "User already exists" });
        }
        const newUser = await User.create({ username, email, password });
        return void res.status(201).json( {user: newUser} );

    } catch (error) {
      console.log(error);
      return void res.status(500).json( {message: "Internal server error"} );
    }
  });

authRouter.post("/login", async (req, res) => {
  console.log("Login route");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return void res.status(403).json({ message: "User Not found!" });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return void res.status(400).json({ message: "Invalid password" });
    }

    //const secret = ?
    //const payload = ?
    //const expiration = ?

    const token = jsonwebtoken.sign(
        { uid: user.uid , email: user.email }, 
        secret,
        { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    return void res.status(201).json( {msg: "Login Ok"} );

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});



export { authRouter };
export default authRouter;