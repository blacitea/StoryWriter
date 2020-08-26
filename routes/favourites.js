const express = require('express');
const router  = express.Router();

module.exports = (queryFunctions) => {
  // Get full list of favourite stories by user id
  router.get("/", (req, res) => {
    const options = {
      user_id: req.session.user_id,
    };
    queryFunctions.getFavouritesByUserId(options)
      .then(favourites => {
        console.log(favourites);
        res.json(favourites);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Add a new favourite story by user id and story id
  router.post("/:id", (req, res) => {
    const options = {
      user_id: req.session.user_id,
      story_id: req.params.id
    };
    queryFunctions.addFavoriteByStoryId(options)
      .then(favorite => {
        res.json(favorite);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};