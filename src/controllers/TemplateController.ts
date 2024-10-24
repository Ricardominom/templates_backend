import type { Request, Response } from "express"
import Template from "../models/Template"

export class TemplateController {

    static createTemplate = async (req: Request, res: Response) => {
        const template = new Template(req.body)

        //Assign a Creator
        template.creator = req.user.id

        try {
            await template.save()
            res.send('Template create successfully')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllTemplates = async (req: Request, res: Response) => {
        try {
            const templates = await Template.find({
                $or: [
                    {creator: {$in: req.user.id}},
                    {team: {$in: req.user.id}}
                ]
            })
            res.json(templates)
        } catch (error) {
            console.log(error)
        }
    }

    static getTemplateById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params
        try {
            const template = await Template.findById(id).populate('questions')

            if (!template) {
                const error = new Error('Template not found')
                res.status(404).json({error: error.message})
                return
            }
            
            if (template.creator.toString() !== req.user.id.toString() && !template.team.includes(req.user.id)) {
                const error = new Error('Invalid Action')
                res.status(404).json({error: error.message})
                return
            }
            res.json(template)
        } catch (error) {
            console.log(error)
        }
    }

    static updateTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            req.template.title = req.body.title
            req.template.userName = req.body.userName
            req.template.description = req.body.description
            await req.template.save()
            res.send('Template Updated')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            await req.template.deleteOne()
            res.send('Template Deleted')
        } catch (error) {
            console.log(error)
        }
    }
}