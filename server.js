const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();


// Requiring our models for syncing
var db = require("./models");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {

    // db.Burger.create({
    //   burger_name: 'Big Mac'
    // })

    // db.Burger.create({
    //   burger_name: 'Quarterpounder with cheese'
    // })

    console.log("App listening on PORT " + PORT);
  });
});
