"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Question_1 = __importDefault(require("./Question"));
const Note_1 = __importDefault(require("./Note"));
const TemplateSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    questions: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Question'
        }
    ],
    creator: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'User'
        }
    ],
}, { timestamps: true });
//Middleware
TemplateSchema.pre('deleteOne', { document: true }, async function () {
    const templateId = this._id;
    if (!templateId)
        return;
    const questions = await Question_1.default.find({ template: templateId });
    for (const question of questions) {
        await Note_1.default.deleteMany({ question: question.id });
    }
    await Question_1.default.deleteMany({ template: templateId });
});
const Template = mongoose_1.default.model('Template', TemplateSchema);
exports.default = Template;
//# sourceMappingURL=Template.js.map