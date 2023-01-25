import { IUser } from "./../models/User";
import { Request } from "express";

export declare module "express" {
    export interface RequestX extends Request {
        user?: IUser;
    }
}
