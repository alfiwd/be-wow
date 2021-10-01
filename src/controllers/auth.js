// Import model
const { users } = require("../../models");

// Import package
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login
exports.login = async (req, res) => {
  try {
    const dataLogin = req.body;

    // Validate data from input json
    const schema = Joi.object({
      email: Joi.string().email().min(5).required(),
      password: Joi.string().min(5).required(),
    });
    const { error } = schema.validate(dataLogin);
    if (error) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }

    // Check data from input json to database
    const userExist = await users.findOne({
      where: {
        email: dataLogin.email,
      },
      attributes: {
        exclude: ["id", "subscribe_status", "full_name", "role", "createdAt", "updatedAt"],
      },
    });
    if (!userExist) {
      return res.send({
        status: "failed",
        message: "Email and password doesn't match!",
      });
    }

    // Matching password from input json with database
    const isValid = await bcrypt.compare(dataLogin.password, userExist.password);
    const dataToken = {
      id: userExist.id,
    };
    const SECRET_KEY = "Rahasiaku";
    const token = jwt.sign(dataToken, SECRET_KEY);
    const channel = {
      email: userExist.email,
      token: token,
    };
    if (!isValid) {
      return res.send({
        status: "failed",
        message: "Email and password doesn't match!",
      });
    }

    // Send response to client
    res.send({
      status: "success",
      data: {
        channel,
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
