const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const { application } = require("express");
const PORT = process.env.PORT || 8080;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "CRUDDataBase",
  password: "Qwert1234",
  socketPath: "/var/run/mysqld/mysqld.sock",
});
connection.connect(function (err) {
  if (err) {
    return console.error("Ошибка: " + err.message);
  } else {
    console.log("Подключение к серверу MySQL успешно установлено");
  }
});

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Qwert1234",
  database: "CRUDDataBase",
  socketPath: "/var/run/mysqld/mysqld.sock",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM number_description";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM number_description WHERE id = ?";
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(`delete from number_description id = ${id}`);
  });
});

app.put("/api/update", (req, res) => {
  const id = req.body.id;
  const number = req.body.number;
  const description = req.body.description;
  const owner = req.body.owner;
  const category = req.body.category;

  const sqlUpdateDescription =
    "UPDATE number_description SET description = ?  WHERE id = ?";

  const sqlUpdateNumber =
    "UPDATE number_description SET number = ?  WHERE id = ?";

  const sqlUpdateOwner =
    "UPDATE number_description SET owner = ?  WHERE id = ?";

  const sqlUpdateCategory =
    "UPDATE number_description SET category = ?  WHERE id = ?";

  db.query(sqlUpdateDescription, [description, id], (err, result) => {
    if (err) {
      console.log(err);
    }
  });

  db.query(sqlUpdateNumber, [number, id], (err, result) => {
    if (err) {
      console.log(err);
    }
  });

  db.query(sqlUpdateOwner, [owner, id], (err, result) => {
    if (err) {
      console.log(err);
    }
  });

  db.query(sqlUpdateCategory, [category, id], (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.post("/api/insert", (req, res) => {
  const number = req.body.number;
  const description = req.body.description;
  const owner = req.body.owner;
  const category = req.body.category;
  const sqlInsert =
    "INSERT INTO number_description (number, description, owner, category) VALUES (?, ?, ?, ?);";
  db.query(sqlInsert, [number, description, owner, category], (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
