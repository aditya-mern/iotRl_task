// console.log("hello");
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "mydb.db");

const app = express();
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
    try {
      database = await open({
        filename: databasePath,
        driver: sqlite3.Database,
      });

       app.listen(process.env.PORT || 3000, ()=>
        console.log("server is running at port: 3000")
        );
} catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();


app.get("/todos/:user_name/", async (request, response) => {
  const { user_name } = request.params;
  const getTodoQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      user_name = ${user_name};
    `;
  const usertodo = await database.get(getTodoQuery);
  response.send(usertodo);
  response.status(200);
});

app.get("/todos/", async (request, response) => {
  
  const getTodoQuery = `
    SELECT
      *
    FROM
      user;
    `;
  const todo = await database.get(getTodoQuery);
  response.send(todo);
  response.status(200);
});

app.post("/todos/", async (request, response) => {
  const { user_id, user_name, task, status } = request.body;
  try {
      const postTodoQuery = `
    INSERT INTO
    user (user_id, user_name, task, status)
  VALUES
    (${user_id}, '${user_name}', '${task}', '${status}');`;
      await database.run(postTodoQuery);
      response.send("Todo Successfully Added");
    
  } catch (e) {
    response.status(400);
    response.send("Invalid Details");
  }
});

app.delete("/todos/:user_id/", async (request, response) => {
  const { user_id } = request.params;
  const deleteTodoQuery = `
    DELETE FROM
      user
    WHERE
      user_id = ${user_id};
    `;
  await database.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
