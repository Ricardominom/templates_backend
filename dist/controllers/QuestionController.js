"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const Question_1 = __importDefault(require("../models/Question"));
class QuestionController {
    static createQuestion = async (req, res) => {
        try {
            const question = new Question_1.default(req.body);
            question.template = req.template.id;
            req.template.questions.push(question.id);
            await Promise.allSettled([question.save(), req.template.save()]);
            res.send('Question created succesfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static getTemplateQuestions = async (req, res) => {
        try {
            const questions = await Question_1.default.find({ template: req.template.id }).populate('template');
            res.json(questions);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static getQuestionById = async (req, res) => {
        try {
            const question = await Question_1.default.findById(req.question.id)
                .populate({ path: 'completedBy.user', select: 'id name email' })
                .populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } });
            res.json(question);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updateQuestion = async (req, res) => {
        try {
            req.question.ask = req.body.ask;
            req.question.answer = req.body.answer;
            await req.question.save();
            res.send('Question Updated Successfuly');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static deleteQuestion = async (req, res) => {
        try {
            req.template.questions = req.template.questions.filter(question => question.toString() !== req.question.id.toString());
            await Promise.allSettled([req.question.deleteOne(), req.template.save()]);
            res.send('Question Deleted Successfuly');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updateStatus = async (req, res) => {
        try {
            const { status } = req.body;
            req.question.status = status;
            const data = {
                user: req.user.id,
                status
            };
            req.question.completedBy.push(data);
            await req.question.save();
            res.send('Question Updated');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
}
exports.QuestionController = QuestionController;
//# sourceMappingURL=QuestionController.js.map