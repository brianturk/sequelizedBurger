const express = require("express");

const router = express.Router();

// Import the model (burger.js) to use its database functions.
const burger = require("../models/burger.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", (req, res) => {
  burger.all(data => {
    const hbsObject = {
      burgers: data
    };
    // console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

router.post("/api/addBurger", (req, res) => {
  // console.log(req.body.burgerName);
  burger.create(["burger_name"], [req.body.burgerName], result => {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});

router.put("/api/eatBurger", (req, res) => {
  const condition = "id = " + req.body.id;

  burger.update(
    {
      devoured: true
    },
    condition,
    result => {
      if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(200).end();

    }
  );
});

// add a delete route to the burgers api
router.delete("/api/deleteBurger", (req, res) => {
  // call the burgers model 
  // to delete a burger by id 
  // respond back with data
  burger.delete("id", req.body.id, (data) => {
    res.json(data);
  });
});

// Export routes for server.js to use.
module.exports = router;
