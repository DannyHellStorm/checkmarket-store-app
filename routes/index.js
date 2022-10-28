import express from 'express';

import category from './category.js';
import basket from './basket.js';
import product from './product.js';

const router = new express.Router();

router.use('/category', category);
router.use('/basket', basket);
router.use('/product', product);

export default router;
