import express from 'express';
import { 
  createPart, getPartById, searchPartsByName, getCarsByPartId 
} from '../data/parts.js';
import { auth } from '../middleware/auth.js';
import { error } from '../middleware/error.js';

const router = express.Router();

router.post('/', auth, async (req, res, next) => {
    try {
        const { name, price, manufacturer, sellerId, carIds } = req.body;
        const newPart = await createPart(name, price, manufacturer, sellerId, carIds);
        res.status(201).json(newPart);
    } catch (e) {
        next(e);
    }
});

router.get('/:partId', auth, async (req, res, next) => {
    try {
        const part = await getPartById(req.params.partId);
        res.status(200).json(part);
    } catch (e) {
        next(e);
    }
});

router.get('/search', auth, async (req, res, next) => {
    try {
        const { query } = req.query;
        const parts = await searchPartsByName(query);
        res.render('partSearch', { results: parts });
    } catch (e) {
        next(e);
    }
});

router.get('/:partId/cars', auth, async (req, res, next) => {
    try {
        const carsList = await getCarsByPartId(req.params.partId);
        res.status(200).json(carsList);
    } catch (e) {
        next(e);
    }
});

router.use(error);

export default router;
