"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionExists = questionExists;
exports.questionBelongsToTemplate = questionBelongsToTemplate;
exports.hasAuthorization = hasAuthorization;
const Question_1 = __importDefault(require("../models/Question"));
async function questionExists(req, res, next) {
    try {
        const { questionId } = req.params;
        const question = await Question_1.default.findById(questionId);
        if (!question) {
            const error = new Error('Question not found');
            res.status(404).json({ error: error.message });
            return;
        }
        req.question = question;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'There was an error' });
    }
}
function questionBelongsToTemplate(req, res, next) {
    if (req.question.template.toString() !== req.template.id.toString()) {
        const error = new Error('Invalid Action');
        res.status(400).json({ error: error.message });
        return;
    }
    next();
}
function hasAuthorization(req, res, next) {
    if (req.user.id.toString() !== req.template.creator.toString()) {
        const error = new Error('Invalid Action');
        res.status(400).json({ error: error.message });
        return;
    }
    next();
}
//# sourceMappingURL=question.js.map