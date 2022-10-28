import express from 'express';
import ServiceController from '../controller/Service.js';

const router = new express.Router();

router.get('/getall', ServiceController.getAllServices);
router.get('/getone/:id([0-9]+)', ServiceController.getOneService);
router.post('/create', ServiceController.createService);
router.put('/update/:id([0-9]+)', ServiceController.updateService);
router.delete('/delete/:id([0-9]+)', ServiceController.deleteService);
router.post(
  '/request/serviceId/:serviceId([0-9]+)',
  ServiceController.sendRequest
);

export default router;
