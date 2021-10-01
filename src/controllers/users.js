// Import model
const { users } = require("../../models");

exports.users = async (req, res) => {
  try {
    // Select all data users from database
    const data = await users.findAll({
      attributes: {
        exclude: ["password", "subscribe_status", "role", "createdAt", "updatedAt"],
      },
    });

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

exports.deleteUser = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

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
      status: "error",
      message: "Server Error",
    });
  }
};
