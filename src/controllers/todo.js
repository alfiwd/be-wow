let todos = [
  {
    id: 1,
    title: "Cuci tangan",
    isDone: true,
  },
  {
    id: 2,
    title: "Jaga jarak",
    isDone: false,
  },
  {
    id: 3,
    title: "Gunakan masker",
    isDone: true,
  },
];

// Create controller get todos
exports.getTodos = async (req, res) => {
  try {
    res.send({
      status: "success",
      data: {
        todos,
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

// Create controller get todo by received id
exports.getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    let todo = todos.find((todo) => todo.id == id);
    res.send({
      status: "success",
      data: {
        todo,
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

// Create controller add todo
exports.addTodo = async (req, res) => {
  todos.push(req.body);

  res.send({
    status: "success",
    data: req.body,
  });
  try {
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Create controller update todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    todos = todos.map((todo) => {
      if (todo.id == id) {
        return req.body;
      } else {
        return todo;
      }
    });

    res.send({
      status: "success",
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

// Create controller delete todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    todos = todos.filter((todo) => todo.id != id);

    res.send({
      status: "success",
      data: todos,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
