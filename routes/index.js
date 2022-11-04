import express from 'express';

import category from './category.js';
import basket from './basket.js';
import product from './product.js';
import order from './order.js';
import service from './service.js';
import contact from './contact.js';
import blog from './blog.js';

const router = new express.Router();

router.use('/category', category);
router.use('/basket', basket);
router.use('/product', product);
router.use('/order', order);
router.use('/service', service);
router.use('/contact', contact);
router.use('/blog', blog);

export default router;
