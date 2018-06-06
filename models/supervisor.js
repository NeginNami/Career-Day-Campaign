
module.exports = function(sequelize, DataTypes) {
    var Supervisor = sequelize.define("Supervisor", {

      firstname: {
            type: DataTypes.STRING,
            defaultValue: null
          },
      lastname: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      email: {
        type: DataTypes.STRING,
        defaultValue: null 
      },
      region: {
        type: DataTypes.STRING,
        defaultValue: null 
      },
     
    }, 
    {
        timestamps: false
    }
);

    Supervisor.associate = function(models) {
        // We're saying that a supervisor can not chose more than one store
        
        Supervisor.belongsTo(models.Store);
      };
  
    return Supervisor;
  };    