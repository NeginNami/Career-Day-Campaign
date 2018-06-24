
module.exports = function(sequelize, DataTypes) {
    var Admin = sequelize.define("Admin", {

      username: {
            type: DataTypes.STRING,
            defaultValue: null
          },
      password: {
        type: DataTypes.STRING,
        defaultValue: null
      }
    }, 
    {
        timestamps: false
    }
);
    return Admin;
  };    