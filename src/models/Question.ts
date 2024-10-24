import mongoose, {Schema, Document, Types } from "mongoose"
import Note from "./Note"

const questionStatus = {
    PENDING: 'pending',
    COMPLETED: 'completed'
} as const 

export type QuestionStatus = typeof questionStatus[keyof typeof questionStatus]

export interface IQuestion extends Document  {
    ask: string
    answer: string
    template: Types.ObjectId
    status: QuestionStatus
    completedBy: {
        user:Types.ObjectId
        status: QuestionStatus
    }[]
    notes: Types.ObjectId[]
}

export const QuestionSchema : Schema = new Schema({
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
        type: Types.ObjectId,
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
                type: Types.ObjectId,
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
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true})

//Middleware
QuestionSchema.pre('deleteOne', {document: true}, async function() {

    const questionId = this._id
    if (!questionId) return
    await Note.deleteMany({question: questionId})
})

const Question = mongoose.model<IQuestion>('Question', QuestionSchema)
export default Question