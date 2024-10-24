import { Router } from "express";
import { body, param } from "express-validator";
import { TemplateController } from "../controllers/TemplateController";
import { handleInputErrors } from "../middleware/validation";
import { QuestionController } from "../controllers/QuestionController";
import { TemplateExists } from "../middleware/template";
import { hasAuthorization, questionBelongsToTemplate, questionExists } from "../middleware/question";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router()


router.use(authenticate)

router.post('/', authenticate,
    body('title')
        .notEmpty().withMessage('Title is required'),
    body('userName')
        .notEmpty().withMessage('UserName is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    TemplateController.createTemplate
)

router.get('/', TemplateController.getAllTemplates)

router.get('/:id', authenticate,
    param('id').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TemplateController.getTemplateById
)


/** Routes for questions */
router.param('templateId', TemplateExists)

router.put('/:templateId', 
    param('templateId').isMongoId().withMessage('Invalid ID'),
    body('title')
        .notEmpty().withMessage('Title is required'),
    body('userName')
        .notEmpty().withMessage('UserName is required'),
    body('description')
        .notEmpty().withMessage('Description is required'),
    handleInputErrors,
    hasAuthorization,
    TemplateController.updateTemplate
)

router.delete('/:templateId', 
    param('templateId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    hasAuthorization,
    TemplateController.deleteTemplate
)

router.post('/:templateId/questions',
    hasAuthorization,
    body('ask')
        .notEmpty().withMessage('Ask is required'),
    body('answer')
        .notEmpty().withMessage('Answer is required'),
    QuestionController.createQuestion
)

router.get('/:templateId/questions',
    QuestionController.getTemplateQuestions
)

router.param('questionId', questionExists)
router.param('questionId', questionBelongsToTemplate)

router.get('/:templateId/questions/:questionId',
    param('questionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    QuestionController.getQuestionById
)

router.put('/:templateId/questions/:questionId',
    hasAuthorization,
    param('questionId').isMongoId().withMessage('Invalid ID'),
    body('ask')
        .notEmpty().withMessage('Ask is required'),
    body('answer')
        .notEmpty().withMessage('Answer is required'),
    handleInputErrors,
    QuestionController.updateQuestion
)

router.delete('/:templateId/questions/:questionId',
    hasAuthorization,
    param('questionId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    QuestionController.deleteQuestion
)

router.post('/:templateId/questions/:questionId/status',
    param('questionId').isMongoId().withMessage('Invalid ID'),
    body('status')
        .notEmpty().withMessage('State is required'),
    handleInputErrors,
    QuestionController.updateStatus
)

/** Routes form teams */
router.post('/:templateId/team/find',
    body('email')
        .isEmail().toLowerCase().withMessage('Invalid E-mail'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail
)

router.get('/:templateId/team',
    TeamMemberController.getTemplateTeam
)

router.post('/:templateId/team',
    body('id')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

router.delete('/:templateId/team/:userId',
    param('userId')
        .isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/** Routes for Notes */
router.post('/:templateId/questions/:questionId/notes',
    body('content')
        .notEmpty().withMessage('The content of Note is required'),
        handleInputErrors,

        NoteController.createNote
)

router.get('/:templateId/questions/:questionId/notes',
    NoteController.getQuestionNotes
)

router.delete('/:templateId/questions/:questionId/notes/:noteId',
    param('noteId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    NoteController.deleteNote
)

export default router