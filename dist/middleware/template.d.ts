import type { Request, Response, NextFunction } from "express";
import { ITemplate } from "../models/Template";
declare global {
    namespace Express {
        interface Request {
            template: ITemplate;
        }
    }
}
export declare function TemplateExists(req: Request, res: Response, next: NextFunction): Promise<void>;
