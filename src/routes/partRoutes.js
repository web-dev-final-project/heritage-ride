import { Router } from "express";
import { 
  createPart, getPartById, searchPartsByName, getCarsByPartId 
} from '../data/parts.js';
import { auth } from '../middleware/auth.js';
import { error } from '../middleware/error.js';

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const experts = await expertDb.getAllExperts();
    res.status(200).send(experts);
  } catch (e) {
    next(e);
  }
})
  .post('/', auth, async (req, res, next) => {
    try {
        const { name, price, manufacturer, sellerId, carIds } = req.body;
        const newPart = await createPart(name, price, manufacturer, sellerId, carIds);
        res.status(201).json(newPart);
    } catch (e) {
        next(e);
    }
});


router.get('/:partId', authSafe, async (req, res, next) => {
    try {
      let partId = req.params.partId;
    if (!partId) throw new InvalidInputException("Part ID can't be null.");
    partId = Validator.validateId(partId);
        const part = await getPartById(partId);
        res.status(200).json(part);
    } catch (e) {
        next(e);
    }
});

router.get('/search', auth, async (req, res, next) => {
    try {
        const { query } = req.query;
        const parts = await searchPartsByName(query);
        res.render('partSearch', { results: parts, user: req.user });
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

export default router;
