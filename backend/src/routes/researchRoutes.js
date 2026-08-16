import { Router } from 'express';
import { getResearchPapers } from '../controllers/researchController.js';

const router = Router();

router.get('/', getResearchPapers);

export default router;