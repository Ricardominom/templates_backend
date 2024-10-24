import mongoose, { Schema, Document, Types } from "mongoose";
declare const questionStatus: {
    readonly PENDING: "pending";
    readonly COMPLETED: "completed";
};
export type QuestionStatus = typeof questionStatus[keyof typeof questionStatus];
export interface IQuestion extends Document {
    ask: string;
    answer: string;
    template: Types.ObjectId;
    status: QuestionStatus;
    completedBy: {
        user: Types.ObjectId;
        status: QuestionStatus;
    }[];
    notes: Types.ObjectId[];
}
export declare const QuestionSchema: Schema;
declare const Question: mongoose.Model<IQuestion, {}, {}, {}, mongoose.Document<unknown, {}, IQuestion> & IQuestion & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>;
export default Question;
