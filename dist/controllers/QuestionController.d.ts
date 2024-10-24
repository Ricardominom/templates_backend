import type { Request, Response } from "express";
export declare class QuestionController {
    static createQuestion: (req: Request, res: Response) => Promise<void>;
    static getTemplateQuestions: (req: Request, res: Response) => Promise<void>;
    static getQuestionById: (req: Request, res: Response) => Promise<void>;
    static updateQuestion: (req: Request, res: Response) => Promise<void>;
    static deleteQuestion: (req: Request, res: Response) => Promise<void>;
    static updateStatus: (req: Request, res: Response) => Promise<void>;
}
