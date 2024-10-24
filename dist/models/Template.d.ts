import mongoose, { Document, PopulatedDoc } from "mongoose";
import { IQuestion } from "./Question";
import { IUser } from "./User";
export interface ITemplate extends Document {
    title: string;
    userName: string;
    description: string;
    questions: PopulatedDoc<IQuestion & Document>[];
    creator: PopulatedDoc<IUser & Document>;
    team: PopulatedDoc<IUser & Document>[];
}
declare const Template: mongoose.Model<ITemplate, {}, {}, {}, mongoose.Document<unknown, {}, ITemplate> & ITemplate & Required<{
    _id: unknown;
}> & {
    __v?: number;
}, any>;
export default Template;
