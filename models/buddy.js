module.exports = function(sequelize, DataTypes) {
    var Buddy = sequelize.define("Buddy", {
      buddy_name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
      }
    });

    // Buddy.belongsToMany(id, {through: 'BurgerBuddy'});

  Buddy.associate = (models) => {
    Buddy.belongsToMany(models.Burger, {
      through: 'BurgerBuddy',
      foreignKey: 'buddy_name'
    });
  };
    return Buddy;
  };