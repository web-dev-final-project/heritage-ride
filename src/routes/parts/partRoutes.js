import express from 'express';
import { createPart, getPartById, getParts, searchPartsByName } from '../../data/parts.js';
import Validator from "../../utils/validator.js";
import { HttpResponse, HttpStatus } from "../../utils/class.js";
import auth from "../../middleware/auth.js";

const router = express.Router();


router.get("/", auth, async (req, res, next) => {
  try {
    const parts = await getParts();
    res.status(200).send(new HttpResponse(parts, HttpStatus.SUCCESS));
  } catch (e) {
    next(e);
  }
});

router.post('/parts', async (req, res) => {
  try {
    const { name, description, tag, sellerId, carIds } = req.body;
    
    const newPart = await createPart(name, description, tag, sellerId, carIds);
    res.status(201).json(newPart);
  } catch (e) {
    res.status(500).json({e});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const partId = req.params.id;

    const part = await getPartById(partId);
    if (!part) {
      return res.status(404).json({ error: 'Part not found' });
    }
    res.json(part);
  } catch (e) {
    res.status(500).json({e});
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query;
    const results = await searchPartsByName(query);
    res.json(results);
  } catch (e) {
    res.status(500).json({e});
  }
});

export default router;
