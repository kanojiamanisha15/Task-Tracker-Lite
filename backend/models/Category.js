module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "categories",
      timestamps: true,
    }
  );

  // Class methods
  Category.existsById = async function (id) {
    const category = await this.findByPk(id);
    return !!category;
  };

  Category.getUsageCount = async function (categoryId) {
    const { Task } = require("./index");
    return await Task.count({ where: { categoryId } });
  };

  Category.isNameExists = async function (name, excludeId = null) {
    const where = { name };
    if (excludeId) {
      where.id = { [sequelize.Sequelize.Op.ne]: excludeId };
    }
    const category = await this.findOne({ where });
    return !!category;
  };

  return Category;
};
