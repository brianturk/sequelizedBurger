var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {


  // Create all our routes and set up logic within those routes where required.
  app.get("/", (req, res) => {
    db.Burger.findAll({})
      .then(function (data) {
        // console.log(data);
        data = data.map(el => el.get({ plain: true }))
        const hbsObject = {
          burgers: data
        };
        res.render("index", hbsObject);
      });
  });


};


