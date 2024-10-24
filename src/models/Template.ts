import mongoose, {Schema, Document, PopulatedDoc, Types} from "mongoose";
import Question, { IQuestion } from "./Question";
import { IUser } from "./User";
import Note from "./Note";

export interface ITemplate extends Document  {
    title: string
    userName: string
    description: string
    questions: PopulatedDoc<IQuestion & Document>[]
    creator: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
}

const TemplateSchema: Schema = new Schema({
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
            type: Types.ObjectId,
            ref: 'Question'
        }
    ],
    creator: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ],
}, {timestamps: true})

//Middleware
TemplateSchema.pre('deleteOne', {document: true}, async function() {

    const templateId = this._id
    if (!templateId) return

    const questions = await Question.find({ template: templateId})
    for(const question of questions) {
        await Note.deleteMany({ question: question.id})
    }
    
    await Question.deleteMany({template: templateId})
})

const Template = mongoose.model<ITemplate>('Template', TemplateSchema)
export default Template