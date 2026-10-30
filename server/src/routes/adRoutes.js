import express from 'express';
import { getAdPlacements, updateAdPlacement } from '../controllers/adController.js';
import { verifyAdminToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAdPlacements);
router.put('/:slotId', verifyAdminToken, updateAdPlacement);

export default router;
