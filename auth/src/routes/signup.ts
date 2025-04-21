import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('You have to use a valid email'),
    body('password')
      .trim()
      .isLength({ min: 8, max: 15 })
      .withMessage('Password must be between 8 to 15 characters'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }
    const { email, password } = req.body;

    console.log('A user is created .............');

    res.send({ email });
  }
);

export { router as signupRouter };
