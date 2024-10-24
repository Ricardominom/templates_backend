import type { Request, Response, NextFunction } from "express";
import Template, { ITemplate } from "../models/Template";

declare global {
    namespace Express {
        interface Request {
            template: ITemplate
        }
    }
}

export async function TemplateExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { templateId } = req.params
        const template = await Template.findById(templateId)
            if (!template) {
                const error = new Error('Template not found')
                res.status(404).json({error: error.message})
                return
            }
            req.template = template
        next()
    } catch (error) {
        res.status(500).json({error: 'There was an error'})
    }
}