import express from "express";
import { db } from "./config/database";
import { userRouter } from "./routes/user.route";
import { authRouter } from "./routes/auth.route";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

const main = async () => {
  try {
    await db.authenticate();
    //await db.sync({ force: true });
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(error);
  }
};

main();
