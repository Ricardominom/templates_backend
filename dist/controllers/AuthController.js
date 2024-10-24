"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const auth_1 = require("../utils/auth");
const token_1 = require("../utils/token");
const AuthEmail_1 = require("../emails/AuthEmail");
const jwt_1 = require("../utils/jwt");
class AuthController {
    static createAccount = async (req, res) => {
        try {
            const { password, email } = req.body;
            // Prevent duplicates
            const userExists = await User_1.default.findOne({ email });
            if (userExists) {
                const error = new Error('The user is already registered');
                res.status(409).json({ error: error.message });
                return;
            }
            //Create an User
            const user = new User_1.default(req.body);
            // Hash Password
            user.password = await (0, auth_1.hashPassword)(password);
            // Generate Token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Send email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send('Account created, check your email to confirm');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static confirmAccount = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Invalid Token');
                res.status(404).json({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExists.user);
            user.confirmed = true;
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('Account confirm successfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('User not found');
                res.status(404).json({ error: error.message });
                return;
            }
            if (!user.confirmed) {
                const token = new Token_1.default();
                token.user = user.id;
                token.token = (0, token_1.generateToken)();
                await token.save();
                // Send email
                AuthEmail_1.AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                });
                const error = new Error('Account has not been confirmed, We have sent you a confirmation e-mail');
                res.status(401).json({ error: error.message });
                return;
            }
            //Check Password
            const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
            if (!isPasswordCorrect) {
                const error = new Error('Invalid Password');
                res.status(401).json({ error: error.message });
                return;
            }
            const token = (0, jwt_1.generateJWT)({ id: user.id });
            res.send(token);
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static requestConfirmationCode = async (req, res) => {
        try {
            const { email } = req.body;
            // User Exists
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('User is not registered');
                res.status(404).json({ error: error.message });
                return;
            }
            if (user.confirmed) {
                const error = new Error('User is already confirmed');
                res.status(403).json({ error: error.message });
                return;
            }
            // Generate Token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            // Send email
            AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            });
            await Promise.allSettled([user.save(), token.save()]);
            res.send('A new token has been sent to your email');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            // User Exists
            const user = await User_1.default.findOne({ email });
            if (!user) {
                const error = new Error('User is not registered');
                res.status(404).json({ error: error.message });
                return;
            }
            // Generate Token
            const token = new Token_1.default();
            token.token = (0, token_1.generateToken)();
            token.user = user.id;
            await token.save();
            // Send email
            AuthEmail_1.AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            });
            res.send('Check your email for instructions');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static validateToken = async (req, res) => {
        try {
            const { token } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Invalid Token');
                res.status(404).json({ error: error.message });
                return;
            }
            res.send('Valid Token, create your new password');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updatePasswordWithToken = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const tokenExists = await Token_1.default.findOne({ token });
            if (!tokenExists) {
                const error = new Error('Invalid Token');
                res.status(404).json({ error: error.message });
                return;
            }
            const user = await User_1.default.findById(tokenExists.user);
            user.password = await (0, auth_1.hashPassword)(password);
            await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
            res.send('Password was changed succesfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static user = async (req, res) => {
        res.json(req.user);
    };
    static updateProfile = async (req, res) => {
        const { name, email } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('This email already exists');
            res.status(409).json({ error: error.message });
            return;
        }
        req.user.name = name;
        req.user.email = email;
        try {
            await req.user.save();
            res.send('Profile Updated Succesfully');
        }
        catch (error) {
            res.status(500).json({ error: 'There was an error' });
        }
    };
    static updateCurrentUserPassword = async (req, res) => {
        const { current_password, password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(current_password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Current Password is wrong');
            res.status(401).json({ error: error.message });
            return;
        }
        try {
            user.password = await (0, auth_1.hashPassword)(password);
            await user.save();
            res.send('Password was updated succesfully');
        }
        catch (error) {
            res.status(500).send('There was an error');
        }
    };
    static checkPassword = async (req, res) => {
        const { password } = req.body;
        const user = await User_1.default.findById(req.user.id);
        const isPasswordCorrect = await (0, auth_1.checkPassword)(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Incorrect Password');
            res.status(401).json({ error: error.message });
            return;
        }
        res.send('Correct Password');
    };
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map