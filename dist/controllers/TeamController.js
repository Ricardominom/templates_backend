"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Template_1 = __importDefault(require("../models/Template"));
class TeamMemberController {
    static findMemberByEmail = async (req, res) => {
        const { email } = req.body;
        //Find user
        const user = await User_1.default.findOne({ email }).select('id email name');
        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return;
        }
        res.json(user);
    };
    static getTemplateTeam = async (req, res) => {
        const template = await (await Template_1.default.findById(req.template.id)).populate({
            path: 'team',
            select: 'id email name'
        });
        res.json(template.team);
    };
    static addMemberById = async (req, res) => {
        const { id } = req.body;
        //Find user
        const user = await User_1.default.findById(id).select('id');
        if (!user) {
            const error = new Error('User not found');
            res.status(404).json({ error: error.message });
            return;
        }
        if (req.template.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('User already exists in the template');
            res.status(409).json({ error: error.message });
            return;
        }
        req.template.team.push(user.id);
        await req.template.save();
        res.send('User added succesfully');
    };
    static removeMemberById = async (req, res) => {
        const { userId } = req.params;
        if (!req.template.team.some(team => team.toString() === userId)) {
            const error = new Error('User does not  already exists in the template');
            res.status(409).json({ error: error.message });
            return;
        }
        req.template.team = req.template.team.filter(teamMember => teamMember.toString() !== userId);
        await req.template.save();
        res.send('User deleted succesfully');
    };
}
exports.TeamMemberController = TeamMemberController;
//# sourceMappingURL=TeamController.js.map