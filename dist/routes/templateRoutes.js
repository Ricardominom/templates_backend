"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const TemplateController_1 = require("../controllers/TemplateController");
const validation_1 = require("../middleware/validation");
const QuestionController_1 = require("../controllers/QuestionController");
const template_1 = require("../middleware/template");
const question_1 = require("../middleware/question");
const auth_1 = require("../middleware/auth");
const TeamController_1 = require("../controllers/TeamController");
const NoteController_1 = require("../controllers/NoteController");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', auth_1.authenticate, (0, express_validator_1.body)('title')
    .notEmpty().withMessage('Title is required'), (0, express_validator_1.body)('userName')
    .notEmpty().withMessage('UserName is required'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('Description is required'), validation_1.handleInputErrors, TemplateController_1.TemplateController.createTemplate);
router.get('/', TemplateController_1.TemplateController.getAllTemplates);
router.get('/:id', auth_1.authenticate, (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, TemplateController_1.TemplateController.getTemplateById);
/** Routes for questions */
router.param('templateId', template_1.TemplateExists);
router.put('/:templateId', (0, express_validator_1.param)('templateId').isMongoId().withMessage('Invalid ID'), (0, express_validator_1.body)('title')
    .notEmpty().withMessage('Title is required'), (0, express_validator_1.body)('userName')
    .notEmpty().withMessage('UserName is required'), (0, express_validator_1.body)('description')
    .notEmpty().withMessage('Description is required'), validation_1.handleInputErrors, question_1.hasAuthorization, TemplateController_1.TemplateController.updateTemplate);
router.delete('/:templateId', (0, express_validator_1.param)('templateId').isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, question_1.hasAuthorization, TemplateController_1.TemplateController.deleteTemplate);
router.post('/:templateId/questions', question_1.hasAuthorization, (0, express_validator_1.body)('ask')
    .notEmpty().withMessage('Ask is required'), (0, express_validator_1.body)('answer')
    .notEmpty().withMessage('Answer is required'), QuestionController_1.QuestionController.createQuestion);
router.get('/:templateId/questions', QuestionController_1.QuestionController.getTemplateQuestions);
router.param('questionId', question_1.questionExists);
router.param('questionId', question_1.questionBelongsToTemplate);
router.get('/:templateId/questions/:questionId', (0, express_validator_1.param)('questionId').isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, QuestionController_1.QuestionController.getQuestionById);
router.put('/:templateId/questions/:questionId', question_1.hasAuthorization, (0, express_validator_1.param)('questionId').isMongoId().withMessage('Invalid ID'), (0, express_validator_1.body)('ask')
    .notEmpty().withMessage('Ask is required'), (0, express_validator_1.body)('answer')
    .notEmpty().withMessage('Answer is required'), validation_1.handleInputErrors, QuestionController_1.QuestionController.updateQuestion);
router.delete('/:templateId/questions/:questionId', question_1.hasAuthorization, (0, express_validator_1.param)('questionId').isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, QuestionController_1.QuestionController.deleteQuestion);
router.post('/:templateId/questions/:questionId/status', (0, express_validator_1.param)('questionId').isMongoId().withMessage('Invalid ID'), (0, express_validator_1.body)('status')
    .notEmpty().withMessage('State is required'), validation_1.handleInputErrors, QuestionController_1.QuestionController.updateStatus);
/** Routes form teams */
router.post('/:templateId/team/find', (0, express_validator_1.body)('email')
    .isEmail().toLowerCase().withMessage('Invalid E-mail'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.findMemberByEmail);
router.get('/:templateId/team', TeamController_1.TeamMemberController.getTemplateTeam);
router.post('/:templateId/team', (0, express_validator_1.body)('id')
    .isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.addMemberById);
router.delete('/:templateId/team/:userId', (0, express_validator_1.param)('userId')
    .isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, TeamController_1.TeamMemberController.removeMemberById);
/** Routes for Notes */
router.post('/:templateId/questions/:questionId/notes', (0, express_validator_1.body)('content')
    .notEmpty().withMessage('The content of Note is required'), validation_1.handleInputErrors, NoteController_1.NoteController.createNote);
router.get('/:templateId/questions/:questionId/notes', NoteController_1.NoteController.getQuestionNotes);
router.delete('/:templateId/questions/:questionId/notes/:noteId', (0, express_validator_1.param)('noteId').isMongoId().withMessage('Invalid ID'), validation_1.handleInputErrors, NoteController_1.NoteController.deleteNote);
exports.default = router;
//# sourceMappingURL=templateRoutes.js.map