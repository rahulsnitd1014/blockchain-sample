import { HttpResponse, HttpRequest } from "../util/interfaces";
import { NextFunction } from "express";

function auth() {
  return async function (req: HttpRequest,res: HttpResponse, next: NextFunction) {
    // Write logic here to private routes
    return next();
  };
}

export { auth };
