import { Router } from "express";
import { getAll } from "../../data/listings.js";

const router = Router();

router.get('/search', async (req, res) => {
    const query = req.query;
  
    try {
      const result = await getAll(query);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch search results' });
    }
  });

  export default router;