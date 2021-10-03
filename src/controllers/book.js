// Import model
const { books } = require("../../models");

// Import package
const Joi = require("joi");
const fs = require("fs");

// Books
exports.books = async (req, res) => {
  try {
    // Select all data users from database
    let data = await books.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Checking if data null
    if (data.length === 0) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Parse to json and map data item
    data = JSON.parse(JSON.stringify(data));
    data = data.map((item) => {
      return {
        ...item,
        book_file: process.env.FILE_PATH + item.book_file,
      };
    });

    // Send response to client
    res.send({
      status: "success",
      data: {
        books: data,
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

// Book
exports.book = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Select data from database by id
    let data = await books.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Checking if data null
    if (data === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Add path to book file
    data = {
      ...data.dataValues,
      book_file: process.env.FILE_PATH + data.book_file,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        book: data,
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

// Add book
exports.addBook = async (req, res) => {
  try {
    // Validate data from input json
    const schema = Joi.object({
      title: Joi.string().required(),
      publication_date: Joi.date().required(),
      pages: Joi.number().required(),
      author: Joi.string().required(),
      isbn: Joi.number().required(),
      about: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error && !req.file) {
      return res.send({
        status: "failed",
        message: "Please insert all data!",
      });
    }
    if (error) {
      fs.unlinkSync("uploads/" + req.file.filename);
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }
    if (!req.file) {
      return res.send({
        status: "failed",
        message: "Please insert file to upload!",
      });
    }

    // Insert all data to database
    const addBook = await books.create({
      title: req.body.title,
      publication_date: req.body.publication_date,
      pages: req.body.pages,
      author: req.body.author,
      isbn: req.body.isbn,
      about: req.body.about,
      book_file: req.file.filename,
    });

    // Select data from database by id
    let data = await books.findOne({
      where: {
        id: addBook.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Parse to json and add path to book file
    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      book_file: process.env.FILE_PATH + data.book_file,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        book: data,
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

// Edit book
exports.editBook = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Get data from body
    const dataBody = req.body;

    // Update data from databse checking by id
    const checkId = await books.findOne({
      where: {
        id,
      },
    });
    if (checkId === null) {
      res.send({
        status: "failed",
        message: `Book id ${id} not found!`,
      });
    }
    if (!req.file) {
      await books.update(
        { ...dataBody },
        {
          where: {
            id,
          },
        }
      );
    } else {
      const book = await books.findOne({
        where: {
          id,
        },
      });
      fs.unlinkSync("uploads/" + book.book_file);
      await books.update(
        { ...dataBody, book_file: req.file.filename },
        {
          where: {
            id,
          },
        }
      );
    }

    // Select data from database by id
    let data = await books.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Parse to json and add path to book file
    data = JSON.parse(JSON.stringify(data));
    data = {
      ...data,
      book_file: process.env.FILE_PATH + data.book_file,
    };

    // Send response to client
    res.send({
      status: "success",
      data: {
        book: data,
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

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    // Get id from parameter
    const { id } = req.params;

    // Get data book from database to delete book file
    const book = await books.findOne({
      where: {
        id,
      },
    });

    // Checking if book null
    if (book === null) {
      return res.send({
        status: "failed",
        message: "Data not found!",
      });
    }

    // Delete data from database
    fs.unlinkSync("uploads/" + book.book_file);
    await books.destroy({
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
