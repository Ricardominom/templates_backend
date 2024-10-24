import type { Request, Response, NextFunction } from "express";
import Question, { IQuestion } from "../models/Question";

declare global {
    namespace Express {
        interface Request {
            question: IQuestion
        }
    }
}

export async function questionExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { questionId } = req.params
        const question = await Question.findById(questionId)
            if (!question) {
                const error = new Error('Question not found')
                res.status(404).json({error: error.message})
                return
            }
            req.question = question
        next()
    } catch (error) {
        res.status(500).json({error: 'There was an error'})
    }
}

export function questionBelongsToTemplate(req: Request, res: Response, next: NextFunction) {
    if (req.question.template.toString() !== req.template.id.toString()) {
        const error = new Error('Invalid Action')
        res.status(400).json({error: error.message})
        return
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.template.creator.toString()) {
        const error = new Error('Invalid Action')
        res.status(400).json({error: error.message})
        return
    }
    next()
}