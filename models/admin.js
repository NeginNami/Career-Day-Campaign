
module.exports = function(sequelize, DataTypes) {
    var Admin = sequelize.define("Admin", {

      username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
              is: /^[a-z0-9\_\-]+$/i,
            }
          },
      password: {
        type: DataTypes.STRING
      },
      salt: {
        type: DataTypes.STRING
      }
    }, 
    {
        timestamps: false
    }
);
    return Admin;
  };    