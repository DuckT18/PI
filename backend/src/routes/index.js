import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import * as authController from '../controllers/authController.js';
import * as dashboard from '../controllers/dashboardController.js';
import * as devices from '../controllers/deviceController.js';
import * as sensors from '../controllers/sensorController.js';

const router = Router();

router.post('/auth/login', authController.login);

router.use(auth); // tudo abaixo exige JWT (RNE-002)

router.get('/auth/me', authController.me); // Sidebar / Settings
router.get('/rooms', dashboard.rooms); // filtro de cômodos
router.get('/devices', devices.list); // Devices
router.patch('/devices/:id', devices.update); // toggle (RF-002)
router.get('/activity', devices.activity); // Home
router.get('/energy', dashboard.energy); // Home / Energy
router.get('/security', dashboard.security); // Security
router.post('/sensors/simulate', sensors.simulate);

export default router;
