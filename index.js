const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const url = require('./config/urls')
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
    console.log("MySQL is connect.");
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
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM number_description";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
    console.log(result);
  });
});

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/images/");
  },
  filename: (req, file, callBack) => {
    callBack(null, `image-${Date.now()}-${path.extname(file.originalname)}`);
  },
});

var upload = multer({
  storage: storage,
});

app.delete("/api/delete/:id", (req, res) => {
  const id = req.params.id;

  const sqlDeleteImage = "SELECT file_src FROM number_description WHERE id = ?";
  const sqlDelete = "DELETE FROM number_description WHERE id = ?";
  try {
    db.query(sqlDeleteImage, [id], (err, result) => {
      if (err) {
        console.log(err);
      }
      file_name = result[0].file_src.split("/").pop();
      console.log(`./public/images/${file_name}`);
      fs.unlinkSync(`./public/images/${file_name}`);
    });

    db.query(sqlDelete, id, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(`delete from number_description id = ${id}`);
    });
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/update", upload.single("image"), (req, res) => {
  const id = req.body.id;
  const number = req.body.number;
  const description = req.body.description;
  const owner = req.body.owner;
  const category = req.body.category;

  if (req.file) {
    const sqlDeleteImage =
      "SELECT file_src FROM number_description WHERE id = ?";
    try {
      db.query(sqlDeleteImage, [id], (err, result) => {
        if (err) {
          console.log(err);
        }
        file_name = result[0].file_src.split("/").pop();
        console.log(`./public/images/${file_name}`);
        fs.unlinkSync(`./public/images/${file_name}`);
      });
    } catch (err) {
      console.log(err);
    }

    const imgsrc = `${url}/images/` + req.file.filename;
    const sqlUpdateFileSrc =
      "UPDATE number_description SET file_src = ?  WHERE id = ?";
    db.query(sqlUpdateFileSrc, [imgsrc, id], (result) => {});
  }

  const sqlUpdateCategory =
    "UPDATE number_description SET category = ?  WHERE id = ?";

  const sqlUpdateDescription =
    "UPDATE number_description SET description = ?  WHERE id = ?";

  const sqlUpdateNumber =
    "UPDATE number_description SET number = ?  WHERE id = ?";

  const sqlUpdateOwner =
    "UPDATE number_description SET owner = ?  WHERE id = ?";

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

  res.send("UPLOAD OK");
});

app.post("/api/insert", upload.single("image"), (req, res) => {
  const number = req.body.number;
  const description = req.body.description;
  const owner = req.body.owner;
  const category = req.body.category;
  const imgsrc = `${url}/images/` + req.file.filename;
  const sqlInsert =
    "INSERT INTO number_description (number, description, owner, category, file_src) VALUES (?, ?, ?, ?, ?);";
  db.query(
    sqlInsert,
    [number, description, owner, category, imgsrc],
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
