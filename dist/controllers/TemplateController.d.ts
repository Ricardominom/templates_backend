import type { Request, Response } from "express";
export declare class TemplateController {
    static createTemplate: (req: Request, res: Response) => Promise<void>;
    static getAllTemplates: (req: Request, res: Response) => Promise<void>;
    static getTemplateById: (req: Request, res: Response) => Promise<void>;
    static updateTemplate: (req: Request, res: Response) => Promise<void>;
    static deleteTemplate: (req: Request, res: Response) => Promise<void>;
}
