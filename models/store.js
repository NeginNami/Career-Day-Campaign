
module.exports = function(sequelize, DataTypes) {
    var Store = sequelize.define("Store", {

      name: {
            type: DataTypes.STRING,
            defaultValue: null
          },
      region: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      ship_address: {
        type: DataTypes.TEXT,
        defaultValue: null 
      },
      ship_city: {
        type: DataTypes.TEXT,
        defaultValue: null 
      },
      ship_state: {
        type: DataTypes.TEXT,
        defaultValue: null
      },
      ship_zip: {
        type: DataTypes.STRING,
        defaultValue: null   
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6), 
        defaultValue: null
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        defaultValue: null
      },
      selected: {
        type: DataTypes.BOOLEAN, 
        defaultValue: false
      },
      status:{
        type:DataTypes.STRING,
        defaultValue: "General"
      }
    }, {
        timestamps: false
    }
);

    Store.associate = function(models) {
        // Associating Stores with Supervisors
        Store.hasMany(models.Supervisor,{
          //onDelete: "null"
          //onUpdate: "cascade"
        });
      };
  
    return Store;
  };