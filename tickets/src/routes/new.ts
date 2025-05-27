import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tj-gildedpass/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required!!!'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price should be greater than or equal zero'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
