import type { Request, Response } from "express";
import Template from "../models/Template";
import Question from "../models/Question";


export class QuestionController {
    static createQuestion = async (req: Request, res: Response) => {
        try {
            const question = new Question(req.body)
            question.template = req.template.id
            req.template.questions.push(question.id)
            await Promise.allSettled([question.save(), req.template.save()])
            res.send('Question created succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static getTemplateQuestions = async (req: Request, res: Response) => {
        try {
            const questions = await Question.find({template: req.template.id}).populate('template')
            res.json(questions)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})        
        }
    }

    static  getQuestionById = async (req: Request, res: Response) => {
        try {
            const question = await Question.findById(req.question.id)
                                .populate({path: 'completedBy.user', select: 'id name email'})
                                .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}})
            res.json(question)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})   
        }
    }

    static  updateQuestion = async (req: Request, res: Response) => {
        try {
            req.question.ask = req.body.ask
            req.question.answer = req.body.answer
            await req.question.save()
            res.send('Question Updated Successfuly')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})   
        }
    }

    static deleteQuestion = async (req: Request, res: Response) => {
        try {
            req.template.questions = req.template.questions.filter( question => question.toString() !== req.question.id.toString())
            await Promise.allSettled([req.question.deleteOne(), req.template.save()])
            res.send('Question Deleted Successfuly')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})   
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            req.question.status = status
            
            const data = {
                user: req.user.id,
                status
            }
            req.question.completedBy.push(data)
            await req.question.save()
            res.send('Question Updated')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})  
        }
    }
}