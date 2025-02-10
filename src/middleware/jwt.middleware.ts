import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    email?: string;
    uid?: string;
  }
};

const secret = process.env.JWT_SECRET!;
if (!secret) {
  console.error("JWT_SECRET must be provided");
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Para traer el token desde los Headers
  //const token = req.headers?.authorization?.split(" ")[1];

  // Para traer el token desde las Cookies
  const token = req.cookies.token;

  console.log( {token} );

  if (!token) {
    return void res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }

  try {
    const { uid, email } = jsonwebtoken.verify(token, secret) as jsonwebtoken.JwtPayload;
    req.email = email;
    req.uid = uid;
    return next();
  } catch (error) {
    console.log(error);

    if (error instanceof jsonwebtoken.TokenExpiredError) {
        return void res.status(401).json({ message: "Token expired" });
    }

    if (error instanceof jsonwebtoken.JsonWebTokenError) {
        return void res.status(401).json({ message: "Invalid token" });
    }

    return void res.status(500).json({ message: "JWT: Internal server error" });    
  }

};
