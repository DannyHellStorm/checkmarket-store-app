import express from 'express';
import OrderController from '../controller/Order.js';

const router = new express.Router();

router.get('/getall', OrderController.getAll);
router.get('/getone/:id([0-9]+)', OrderController.getOne);
router.post('/create', OrderController.create);
router.delete('/delete/:id([0-9]+)', OrderController.delete);

export default router;
