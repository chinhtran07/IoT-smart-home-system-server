// accessControlRoutes.js
import express from 'express';
import { grantPermission, getAccessControl, updateAccessControl, getGrantedUsersByOwner, deleteAccessControl } from '../controllers/accessControl.controller.js';

const router = express.Router();

// Routes for access control
router.post('/grant', grantPermission);
router.get('/:userId', getAccessControl);
router.get('/', getGrantedUsersByOwner);
router.put('/grant/:userId', updateAccessControl);
router.delete('/revoke', deleteAccessControl);

export default router;
