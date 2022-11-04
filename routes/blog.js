import express from 'express';
import BlogController from '../controller/Blog.js';

const router = new express.Router();

router.get('/getall', BlogController.getAllPosts);
router.get('/getone/:id([0-9]+)', BlogController.getOnePost);
router.post('/create', BlogController.createPost);
router.put('/update/:id([0-9]+)', BlogController.updatePost);
router.delete('/delete/:id([0-9]+)', BlogController.deletePost);

export default router;
