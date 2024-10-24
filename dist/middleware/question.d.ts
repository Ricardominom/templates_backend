import type { Request, Response, NextFunction } from "express";
import { IQuestion } from "../models/Question";
declare global {
    namespace Express {
        interface Request {
            question: IQuestion;
        }
    }
}
export declare function questionExists(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function questionBelongsToTemplate(req: Request, res: Response, next: NextFunction): void;
export declare function hasAuthorization(req: Request, res: Response, next: NextFunction): void;
