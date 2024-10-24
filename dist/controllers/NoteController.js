"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const Note_1 = __importDefault(require("../models/Note"));
class NoteController {
    static createNote = async (req, res) => {
        const { content } = req.body;
        const note = new Note_1.default();
        note.content = content;
        note.createdBy = req.user.id;
        note.question = req.question.id;
        req.question.notes.push(note.id);
        try {
            await Promise.allSettled([req.question.save(), note.save()]);
            res.send('Note Created Succesfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static getQuestionNotes = async (req, res) => {
        try {
            const notes = await Note_1.default.find({ question: req.question.id });
            res.json(notes);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static deleteNote = async (req, res) => {
        const { noteId } = req.params;
        const note = await Note_1.default.findById(noteId);
        if (!note) {
            const error = new Error('Note not founded');
            res.status(404).json({ error: error.message });
            return;
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            const error = new Error('Invalid Action');
            res.status(401).json({ error: error.message });
            return;
        }
        req.question.notes = req.question.notes.filter(note => note.toString() !== noteId.toString());
        try {
            await Promise.allSettled([req.question.save(), note.deleteOne()]);
            res.send('Note deleted');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
}
exports.NoteController = NoteController;
//# sourceMappingURL=NoteController.js.map