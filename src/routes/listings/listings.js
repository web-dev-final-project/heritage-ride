import { Router } from "express";
import { getAll } from "../../data/listings.js";
import { NotFoundException } from "../../utils/exceptions.js";
import { authSafe } from "../../middleware/auth.js";

const router = Router();

router.get('/search', authSafe, async (req, res) => { // car listings search, displays cars
    const query = req.query
    // should I validate all query fields?
    try {
      const result = await getAll(query);
      if (!result) throw new NotFoundException(`listing not found`);
      console.log(result)
      res.render('carSearch', {results: result, user: req.user})
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch search results' });
      // OR next(e);
    }
  });

  export default router;