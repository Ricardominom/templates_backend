"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateController = void 0;
const Template_1 = __importDefault(require("../models/Template"));
class TemplateController {
    static createTemplate = async (req, res) => {
        const template = new Template_1.default(req.body);
        //Assign a Creator
        template.creator = req.user.id;
        try {
            await template.save();
            res.send('Template create successfully');
        }
        catch (error) {
            console.log(error);
        }
    };
    static getAllTemplates = async (req, res) => {
        try {
            const templates = await Template_1.default.find({
                $or: [
                    { creator: { $in: req.user.id } },
                    { team: { $in: req.user.id } }
                ]
            });
            res.json(templates);
        }
        catch (error) {
            console.log(error);
        }
    };
    static getTemplateById = async (req, res) => {
        const { id } = req.params;
        try {
            const template = await Template_1.default.findById(id).populate('questions');
            if (!template) {
                const error = new Error('Template not found');
                res.status(404).json({ error: error.message });
                return;
            }
            if (template.creator.toString() !== req.user.id.toString() && !template.team.includes(req.user.id)) {
                const error = new Error('Invalid Action');
                res.status(404).json({ error: error.message });
                return;
            }
            res.json(template);
        }
        catch (error) {
            console.log(error);
        }
    };
    static updateTemplate = async (req, res) => {
        try {
            req.template.title = req.body.title;
            req.template.userName = req.body.userName;
            req.template.description = req.body.description;
            await req.template.save();
            res.send('Template Updated');
        }
        catch (error) {
            console.log(error);
        }
    };
    static deleteTemplate = async (req, res) => {
        try {
            await req.template.deleteOne();
            res.send('Template Deleted');
        }
        catch (error) {
            console.log(error);
        }
    };
}
exports.TemplateController = TemplateController;
//# sourceMappingURL=TemplateController.js.map