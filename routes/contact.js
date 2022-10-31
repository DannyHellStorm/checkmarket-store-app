import express from 'express';
import ContactController from '../controller/Contact.js';

const router = new express.Router();

router.get('/getall', ContactController.getAllRequests);
router.get('/getone/:id([0-9]+)', ContactController.getOneRequest);
router.post('/create', ContactController.createRequest);
router.delete('/delete/:id([0-9]+)', ContactController.deleteRequest);

export default router;
