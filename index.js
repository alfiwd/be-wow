// Instantiate express module
const express = require("express");

// Use express in app variable
const app = express();

// Define the server port
const port = 5000;

app.use(express.json());

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
];

// Create the homepage route
app.get("/", (req, res) => {
  // Res means, response and it send string "Hello Express!" to the API
  res.send(todos);
});

app.get("/todo/:id", (req, res) => {
  const { id } = req.params;

  let data = todos.find((item) => item.id == id);

  if (!data) {
    return res.send({
      status: "failed",
      message: "Data not found!",
    });
  }

  res.send({
    data,
  });
});

app.post("/todo", (req, res) => {
  const data = req.body;

  todos.push(data);

  res.send({
    todos,
  });
});

app.patch("/todo/:id", (req, res) => {
  const { id } = req.params;

  todos = todos.map((item) => {
    if (item.id == id) {
      return { ...req.body };
    } else {
      return item;
    }
  });

  res.send({
    data: todos,
  });
});

app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;

  todos = todos.filter((todo) => todo.id != id);

  res.send({
    data: todos,
  });
});

// When this NodeJS app executed, it will listen to defined port
app.listen(port, () => console.log(`Listening on port ${port}`));
