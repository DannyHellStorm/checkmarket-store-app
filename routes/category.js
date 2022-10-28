import express from 'express';
import CategoryController from '../controller/Category.js';

const router = new express.Router();

router.get('/getall', CategoryController.getAll);
router.post('/create', CategoryController.create);
router.put('/update/:id([0-9]+)', CategoryController.update);
router.delete('/delete/:id([0-9]+)', CategoryController.delete);

export default router;
