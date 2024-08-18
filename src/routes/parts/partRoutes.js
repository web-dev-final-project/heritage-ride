import express from 'express';
import { createPart, getPartById, getParts, searchPartsByName } from '../../data/parts.js';
import auth from "../../middleware/auth.js";
import authSafe from "../../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res, next) => {
  try {
    const parts = await getParts();
    res.status(200).send(parts);
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
    res.status(500).json({ error: e.message });
  }
});

router.get('/parts/:id', async (req, res) => {
  try {
    const partId = req.params.id;
    const part = await getPartById(partId);
    if (!part) {
      return res.status(404).json({ error: 'Part not found' });
    }
    res.json(part);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/parts/search', authSafe, async (req, res) => {
  const query = req.query.query || '';
  const tag = req.query.tag || '';

  try {
    let results = [];
    if (query || tag) {
      results = await searchPartsByName({ query, tag });
    } else {
      results = await getParts();
    }

    res.render('partSearch', {
      results: results,
      searchQuery: query
    });
  } catch (error) {
    console.error('Error:', error);
    res.render('partSearch', {
      results: [],
      searchQuery: query,
      error: 'An error occurred while fetching parts.'
    });
  }
});

export default router;
