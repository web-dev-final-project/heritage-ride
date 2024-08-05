import { Router } from "express";
import { getAll } from "../../data/listings.js";
import { NotFoundException } from "../../utils/exceptions.js";
import { authSafe } from "../../middleware/auth.js";
import Validator from "../../utils/validator.js";

const router = Router();

router.get('/search', authSafe, async (req, res, next) => { // car listings search, displays cars
    const query = req.query
    // Error check
    const errors = Validator.validateQuery(query);
    if (errors.length > 0) {
        return res.status(400).render('carSearch', {
            error: 'Invalid search criteria: ' + errors.join(', '),
            results: [] // Ensure no results are shown if there's an error
        });
    }

    try {
      const result = await getAll(query);
      if (!result) throw new NotFoundException(`listing not found`);
      res.render('carSearch', {results: result})
    } catch (e) {
      next(e)
    }
  });

  export default router;