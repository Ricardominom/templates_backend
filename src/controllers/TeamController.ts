import type { Request, Response } from 'express' 
import User from '../models/User'
import Template from '../models/Template'

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        //Find user
        const user = await User.findOne({email}).select('id email name')
        if (!user) {
            const error = new Error('User not found')
            res.status(404).json({error: error.message})
            return
        }

        res.json(user)
    }

    static getTemplateTeam = async (req: Request, res: Response) => {
        const template = await (await Template.findById(req.template.id)).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(template.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body
        
         //Find user
         const user = await User.findById(id).select('id')
         if (!user) {
             const error = new Error('User not found')
             res.status(404).json({error: error.message})
             return
         }

        if(req.template.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already exists in the template')
            res.status(409).json({error: error.message})
            return
        }
         req.template.team.push(user.id)
         await req.template.save()
 
         res.send('User added succesfully')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        if(!req.template.team.some(team => team.toString() === userId)) {
            const error = new Error('User does not  already exists in the template')
            res.status(409).json({error: error.message})
            return
        }

        req.template.team = req.template.team.filter( teamMember => teamMember.toString() !== userId)
        await req.template.save()
        res.send('User deleted succesfully')
    }
}