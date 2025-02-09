import express from "express";
import { db } from "./config/database";
import { userRouter } from "./routes/user.route";

const app = express();

app.use(express.json());
app.use("/api/v1/users", userRouter);

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
