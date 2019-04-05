// Import the ORM to create functions that will interact with the database.
const orm = require("../config/orm.js");

const burger = {
  all: function(cb) {
    orm.all("burgers", (res) => {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("burgers", cols, vals, (res) => {
      cb(res);
    });
  },
  update: function(objColVals, condition, cb) {
    orm.update("burgers", objColVals, condition, (res) => {
      cb(res);
    });
  },
  // add a delete for the burgers
  delete: function(col, val, cb) {
    // call the orm delete method 
    // with the "burgers" table
    orm.delete("burgers", col, val, (data) => {
      cb(data);
    });
  }
};
// burger.delete("id", 6, (data) => {
//   console.log(data);
// });

// Export the database functions for the controller (burgersController.js).
module.exports = burger;
