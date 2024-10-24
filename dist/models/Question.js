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
exports.QuestionSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Note_1 = __importDefault(require("./Note"));
const questionStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed'
};
exports.QuestionSchema = new mongoose_1.Schema({
    ask: {
        type: String,
        trim: true,
        required: true
    },
    answer: {
        type: String,
        trim: true,
        required: true
    },
    template: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Template'
    },
    status: {
        type: String,
        enum: Object.values(questionStatus),
        default: questionStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: mongoose_1.Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(questionStatus),
                default: questionStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true });
//Middleware
exports.QuestionSchema.pre('deleteOne', { document: true }, async function () {
    const questionId = this._id;
    if (!questionId)
        return;
    await Note_1.default.deleteMany({ question: questionId });
});
const Question = mongoose_1.default.model('Question', exports.QuestionSchema);
exports.default = Question;
//# sourceMappingURL=Question.js.map