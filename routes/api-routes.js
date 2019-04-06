var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {


  // POST route for saving a new post
  app.post("/api/addBurger", function (req, res) {
    console.log(req.body.burgerName);
    db.Burger.create({
      burger_name: req.body.burgerName
    })
      .then(data => res.json(data))
      .catch(err => console.log(err));
  });


  // PUT route for updating posts
  app.put("/api/eatBurger", function (req, res) {
    db.Burger.update({
      devoured: true
    },
      {
        where: {
          id: req.body.id
        }
      })
      .then(function (data) {
        res.json(data);
      });
  });


  // DELETE route for deleting posts
  app.delete("/api/deleteBurger", function (req, res) {
    db.Burger.destroy({
      where: {
        id: req.body.id
      }
    })
      .then(function (data) {
        res.json(data);
      });
  });



};


