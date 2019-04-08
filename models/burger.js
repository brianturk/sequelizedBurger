module.exports = function(sequelize, DataTypes) {
  var Burger = sequelize.define("Burger", {
    burger_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    devoured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Burger.associate = (models) => {
    Burger.belongsToMany(models.Buddy, {
      through: 'BurgerBuddy',
      foreignKey: 'burger_id'
    });
  };

  return Burger;
};
