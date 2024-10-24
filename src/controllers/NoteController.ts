import type { Request, Response } from "express";
import Note, {INote} from '../models/Note'
import { Types } from "mongoose";

type NoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        const { content } = req.body

        const note = new Note()
        note.content = content
        note.createdBy = req.user.id
        note.question = req.question.id

        req.question.notes.push(note.id)

        try {
            await Promise.allSettled([req.question.save(), note.save()])
            res.send('Note Created Succesfully')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static getQuestionNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({question: req.question.id})
            res.json(notes)
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }

    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const { noteId } = req.params
        const note = await Note.findById(noteId)

        if (!note) {
            const error = new Error('Note not founded')
            res.status(404).json({error: error.message})
            return
        }

        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Invalid Action')
            res.status(401).json({error: error.message})
            return
        }

        req.question.notes = req.question.notes.filter( note => note.toString() !== noteId.toString())

        try {
            await Promise.allSettled([req.question.save(), note.deleteOne()])
            res.send('Note deleted')
        } catch (error) {
            res.status(500).json({error: 'There was an error'})
        }
    }
}