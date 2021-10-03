// Import model
const { transaction, users } = require("../../models");

// Import package
const Joi = require("joi");
const fs = require("fs");

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    // Validate data from input json
    const schema = Joi.object({
      user_id: Joi.number().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      fs.unlinkSync("uploads/" + req.file.filename);
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }
    if (!req.file) {
      res.send({
        status: "failed",
        message: "Please insert file to upload!",
      });
    }

    // Checking id user
    const checkId = await users.findOne({
      where: {
        id: req.body.user_id,
      },
    });
    if (checkId === null) {
      fs.unlinkSync("uploads/" + req.file.filename);
      return res.send({
        status: "failed",
        message: `User id ${req.body.user_id} not found!`,
      });
    }

    // Insert data to database
    const addTransaction = await transaction.create({
      user_id: req.body.user_id,
      transfer_proof: req.file.filename,
      remaining_active: 30,
      user_status: "Active",
      payment_status: "Approved",
    });

    // Select data from database
    let data = await transaction.findOne({
      where: {
        id: addTransaction.id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // Add path to transfer proof
    data = {
      ...data.dataValues,
      transfer_proof: process.env.FILE_PATH + data.transfer_proof,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        transaction: data,
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

// Edit transaction
exports.editTransaction = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Get data from body
    const dataBody = req.body;

    // Check id
    const checkId = await transaction.findOne({
      where: {
        id,
      },
    });
    if (checkId === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Update data from database checking by id
    if (!req.file) {
      await transaction.update(dataBody, {
        where: {
          id,
        },
      });
    } else {
      const dataTransaction = await transaction.findOne({
        where: {
          id,
        },
      });
      fs.unlinkSync("uploads/" + dataTransaction.transfer_proof);
      await transaction.update(
        { ...dataBody, transfer_proof: req.file.filename },
        {
          where: {
            id,
          },
        }
      );
    }

    // Select data from database
    let data = await transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // Add path file to transfer proof
    data = {
      ...data.dataValues,
      transfer_proof: process.env.FILE_PATH + data.transfer_proof,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        transaction: data,
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

// Get Transaction
exports.transaction = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Get data from database checking by id
    let data = await transaction.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // Checking if data null
    if (data === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Add path file to transfer proof
    data = {
      ...data.dataValues,
      transfer_proof: process.env.FILE_PATH + data.transfer_proof,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        transaction: data,
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

// Get all transactions
exports.transactions = async (req, res) => {
  try {
    // Get all data from database
    let data = await transaction.findAll({
      include: [
        {
          model: users,
          as: "users",
          attributes: {
            exclude: ["email", "password", "subscribe_status", "role", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["user_id", "createdAt", "updatedAt"],
      },
    });

    // If data null
    if (data.length === 0) {
      res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Add path file to transfer proof
    data = data.map((item) => {
      return {
        ...item.dataValues,
        transfer_proof: process.env.FILE_PATH + item.dataValues.transfer_proof,
      };
    });

    // Send response to client
    res.send({
      status: "success",
      data: {
        transactions: data,
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
