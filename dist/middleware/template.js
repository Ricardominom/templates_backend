"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateExists = TemplateExists;
const Template_1 = __importDefault(require("../models/Template"));
async function TemplateExists(req, res, next) {
    try {
        const { templateId } = req.params;
        const template = await Template_1.default.findById(templateId);
        if (!template) {
            const error = new Error('Template not found');
            res.status(404).json({ error: error.message });
            return;
        }
        req.template = template;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'There was an error' });
    }
}
//# sourceMappingURL=template.js.map