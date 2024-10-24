import { Router } from "express"
import { body, param } from "express-validator"
import { AuthController } from "../controllers/AuthController"
import { handleInputErrors } from "../middleware/validation"
import { authenticate } from "../middleware/auth"

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('password')
        .isLength({min: 8}).withMessage('Password is short, minimun 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
    }),
    body('email')
        .notEmpty().withMessage('Invalid Email'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('Token is required'),
        handleInputErrors,
        AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .notEmpty().withMessage('Invalid Email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
        handleInputErrors,
        AuthController.login
)

router.post('/request-code',
    body('email')
        .notEmpty().withMessage('Invalid Email'),
        handleInputErrors,
        AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .notEmpty().withMessage('Invalid Email'),
        handleInputErrors,
        AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('Token is required'),
        handleInputErrors,
        AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Invalid Token'),
    body('password')
        .isLength({min: 8}).withMessage('Password is short, minimun 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/** Profile */
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('email')
        .notEmpty().withMessage('Invalid Email'),
    handleInputErrors,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('Current password can not be empty'),
    body('password')
        .isLength({min: 8}).withMessage('Password is short, minimun 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('Password can not be empty'),
    handleInputErrors,
    AuthController.checkPassword
)

export default router