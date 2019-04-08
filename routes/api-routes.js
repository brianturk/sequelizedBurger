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

  // POST route for saving a new post
  app.post("/api/addBuddy", function (req, res) {
    db.Buddy.create({
      buddy_name: req.body.buddyName
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

        buddyList = req.body.buddies

        req.body.buddies.forEach(async function (value) {
          await addBuddy(req.body.id, value);
        })

        res.json(data);

      });
  });

  function addBuddy(burger_id, buddy_name) {
    return new Promise(async function (resolve, reject) {
      db.BurgerBuddy.create({
        burger_id: burger_id,
        buddy_name: buddy_name
      })
        .then(data => resolve(data))
        .catch(err => resolve(err))

    })
  }

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

  // Create all our routes and set up logic within those routes where required.
  app.get("/api/burgerBuddies", (req, res) => {
    db.Buddy.findAll({})
      .then(function (data) {
        // console.log(data);
        // data = data.map(a => a.get({ plain: true }))
        // const hbsObject = {
        //   buddies: data
        // };
        res.json(data);
      });
  });


  // PUT route for updating posts
  app.put("/api/updateBuddy", function (req, res) {
    db.Buddy.update({
      buddy_name: req.body.newBuddyName
    },
      {
        where: {
          buddy_name: req.body.oldBuddyName
        }
      })
      .then(data => res.json(data))
      .catch(err => res.status(404).json(err))
  });


  // DELETE route for deleting posts
  app.delete("/api/deleteBuddy", function (req, res) {
    db.Buddy.destroy({
      where: {
        buddy_name: req.body.buddyName
      }
    })
      .then(data => res.json(data))
      .catch(err => res.status(404).json(err))
  });


  // Create all our routes and set up logic within those routes where required.
  app.get("/api/burgerInfo/:id", (req, res) => {
    db.Burger.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(function (data) {
        res.json(data);
      });
  });


  // Create all our routes and set up logic within those routes where required.
  app.get("/api/buddyInfo/:id", (req, res) => {
    db.BurgerBuddy.findAll({
      where: {
        burger_id: req.params.id
      }
    })
      .then(function (data) {
        data = data.map(a => a.get({ plain: true }))
        data = data.map(a => a.buddy_name)
        res.json(data);
      });
  });

};


