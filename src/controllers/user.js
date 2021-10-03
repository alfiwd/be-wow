// Import model
const { users } = require("../../models");

// Users
exports.users = async (req, res) => {
  try {
    // Select all data users from database
    const data = await users.findAll({
      attributes: {
        exclude: ["password", "subscribe_status", "role", "createdAt", "updatedAt"],
      },
    });

    // If data null
    if (data.length === 0) {
      res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Send response to client
    res.send({
      status: "success",
      data: {
        users: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Checking id user
    const checkId = await users.findOne({
      where: {
        id,
      },
    });
    if (checkId === null) {
      return res.send({
        status: "failed",
        message: `User id ${id} not found!`,
      });
    }

    // Delete data from databse
    const data = await users.destroy({
      where: {
        id,
      },
    });

    // Send response to client
    res.send({
      status: "success",
      data: {
        id,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
