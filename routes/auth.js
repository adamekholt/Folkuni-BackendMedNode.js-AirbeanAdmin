import { Router } from 'express';
import { validateAuthBody } from '../middlewares/validators.js';
import { getUser, registerUser } from '../services/users.js';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/logout', (req, res, next) => {
    if(global.user) {
        global.user = null;
        res.json({
            success: true,
            message: 'User logged out successfully'
        });
    } else {
        next({
            status: 400,
            message: 'No user is currently logged in'
        });
    }
});

router.post('/register', validateAuthBody, async (req, res) => {
    const { username, password, role } = req.body;
    console.log('Registering user with role:', role);
    
    if (role && role !== 'user' && role !== 'admin') {
        return res.status(400).json({
            success: false,
            message: 'Role must be either "user" or "admin"'
        });
    }

    try {
        const result = await registerUser({
            username: username,
            password: password,
            role: role || 'user',
            userId: `${role || 'user'}-${uuid().substring(0, 5)}`
        });

        if(result) {
            console.log('Registered user:', result);
            res.status(201).json({
                success: true,
                message: 'New user registered successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Registration unsuccessful'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/login', validateAuthBody, async (req, res) => {
    const { username, password } = req.body;
    const user = await getUser(username);
    console.log('Found user during login:', user);
    
    if(user) {
        if(user.password === password) {
            global.user = user;
            console.log('Set global.user to:', global.user);
            console.log('User role is:', global.user.role);
            res.json({
                success: true,
                message: 'User logged in successfully',
                user: {
                    username: user.username,
                    role: user.role,
                    userId: user.userId
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Incorrect username and/or password'
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: 'No user is found'
        });
    }
});

export default router;