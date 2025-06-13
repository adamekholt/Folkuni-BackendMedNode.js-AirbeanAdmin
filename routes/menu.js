import { Router } from 'express';
import { getMenu, createProduct, updateProduct, deleteProduct } from '../services/menu.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = Router();

router.get('/', async (req, res, next) => {
    const menu = await getMenu();
    if(menu) {
        res.json({
            success: true,
            menu: menu
        });
    } else {
        next({
            status: 404,
            message: 'Menu is not found'
        });
    }
});

router.post('/', adminAuth, async (req, res, next) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        next({
            status: 400,
            message: error.message
        });
    }
});

router.put('/:prodId', adminAuth, async (req, res, next) => {
    try {
        const product = await updateProduct(req.params.prodId, req.body);
        res.json({
            success: true,
            product
        });
    } catch (error) {
        next({
            status: error.message === 'Product not found' ? 404 : 400,
            message: error.message
        });
    }
});

router.delete('/:prodId', adminAuth, async (req, res, next) => {
    try {
        const result = await deleteProduct(req.params.prodId);
        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        next({
            status: error.message === 'Product is not found' ? 404 : 400,
            message: error.message
        });
    }
});

export default router;
