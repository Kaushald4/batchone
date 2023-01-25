import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (err: any) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message,
        });
    }
};

export default asyncHandler;

// added by Anirudh
// const asyncHandler = () => {};
// const asyncHandler = (func) => {};
// const asyncHandler = (func) => () => {};
// const asyncHandler = (func) => async () => {};

//added by Satyendra
// function asyncHandler(fn) {
//     return async function (req, res, next) {
//       try {
//         await fn(req, res, next);
//       } catch (err) {
//         res.status(err.code || 500).json({
//           success: false,
//         });
//       }
//     };
//   }
