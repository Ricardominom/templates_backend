import mongoose, { Schema, Document, Types } from "mongoose"

export interface INote extends Document {
    content: string
    createdBy: Types.ObjectId
    question: Types.ObjectId
}

const NoteSchema: Schema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: Types.ObjectId,
        ref: 'Question',
        required: true
    }
}, {timestamps: true})

const Note = mongoose.model<INote>('Note', NoteSchema)
export default Note