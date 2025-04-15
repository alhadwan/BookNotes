import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookNote",
    password: "123",
    port: 5432,
  });
  
  db.connect();

app.get("/", (req, res) =>{
    res.send("hello, express");
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});