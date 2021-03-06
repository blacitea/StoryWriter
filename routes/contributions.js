/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (queryFunctions) => {

  // Browse based on user_id
  router.get('/', (req, res) => {
    const options = {
      user_id : req.session.user_id
    };
    queryFunctions.getContributionsByUserId(options)
      .then(contributions => {
        res.json(contributions);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Browse pending contributions based on story_id
  router.get('/story/:id', (req, res) => {
    const options = {
      story_id: req.params.id
    };
    queryFunctions.getPendingContributionByStoryId(options)
      .then(contributions => {
        // check if requesting user is owner of story
        contributions.forEach(contribution => {
          contribution.is_story_owner = Number(contribution.story_owner_id) === Number(req.session.user_id);
        });
        res.json(contributions);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Read
  router.get("/:id", (req, res) => {
    const contributionId = [req.params.id];
    queryFunctions.getContributionById(contributionId)
      .then(contribution => {
        contribution.is_story_owner = Number(contribution.story_owner_id) === Number(req.session.user_id);
        res.json(contribution);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // EDIT - mark contribution as accepted
  router.post("/story/:id", (req, res) => {

    const options = {
      contribution_id: req.params.id,
      user_id: req.session.user_id,
    };
    queryFunctions.verifyUser(options)
      .then(resolve => {
        if (resolve) {
          return queryFunctions.markContrAsAccepted(options);
        }
      })
      .then(accepted => {
        res.json(accepted);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // ADD
  router.post("/", (req, res) => {
    const user_id = req.session.user_id;
    const { story_id, content, accepted } = req.body;
    const newContribution = {
      user_id,
      story_id,
      content,
      accepted
    };
    queryFunctions.createContribution(newContribution)
      .then(contribution => {
        res.json(contribution);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // DELETE - toggle deleted field to true
  router.post("/:id", (req, res) => {
    const contribution_id = req.params.id;
    const user_id = req.session.user_id;
    const queryParams = [contribution_id, user_id];
    queryFunctions.deleteContribution(queryParams)
      .then(contribution => {
        if (contribution) {
          res.json(contribution);
        } else {
          throw new Error('Contribution not found!');
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
