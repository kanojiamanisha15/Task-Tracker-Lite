const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
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
          len: [2, 50],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [6, 255],
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        defaultValue: "user",
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
      },
    }
  );

  // Instance methods
  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Class methods
  User.findByEmail = async function (email) {
    return await this.findOne({ where: { email } });
  };

  User.findByEmailWithPassword = async function (email) {
    return await this.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });
  };

  User.existsByEmail = async function (email) {
    const user = await this.findOne({ where: { email } });
    return !!user;
  };

  User.existsById = async function (id) {
    const user = await this.findByPk(id);
    return !!user;
  };

  User.findByEmail = async function (email) {
    return await this.findOne({ where: { email } });
  };

  User.findByEmailWithPassword = async function (email) {
    return await this.findOne({
      where: { email },
      attributes: { include: ["password"] },
    });
  };

  User.existsByEmail = async function (email) {
    const user = await this.findOne({ where: { email } });
    return !!user;
  };

  User.existsById = async function (id) {
    const user = await this.findByPk(id);
    return !!user;
  };

  return User;
};
