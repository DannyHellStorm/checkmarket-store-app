import express from 'express';
import ProductController from '../controller/Product.js';

const router = new express.Router();

// Filters
router.get('/getall/categoryId/:categoryId', ProductController.getAll);

// Product
router.get('/search/product_title/:key', ProductController.searchProduct);
router.get('/getall', ProductController.getAll);
router.get('/getone/:id([0-9]+)', ProductController.getOne);
router.post('/create', ProductController.create);
// router.put('/update/:id([0-9]+)', ProductController.update);
// router.delete('/delete/:id([0-9]+)', ProductController.delete);

export default router;
