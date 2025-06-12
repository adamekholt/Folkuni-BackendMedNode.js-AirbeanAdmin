import { Router } from 'express';
import { getMenu, createProduct } from '../services/menu.js';
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

export default router;