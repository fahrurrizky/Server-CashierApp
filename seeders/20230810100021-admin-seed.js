"use strict";

const bcrypt = require("bcrypt");
// const { v4: uuidv4 } = require("uuid");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash("Admin123@", 10);
    // const adminUuid = uuidv4();

    return queryInterface.bulkInsert("Users", [
      {
        username: "fahrur_rizky",
        email: "rizky928@gmail.com",
        password: hashedPassword,
        role: "Admin",
        isActive: "1",
        imgProfile: "photo",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    // Delete the admin user data
    return queryInterface.bulkDelete("Users", { username: "admin" });
  },
};
