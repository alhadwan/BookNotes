import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;

import axios from "axios";
import { cache } from "ejs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "bookNote",
    password: "123",
    port: 5432,
  });

// const db = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

db.connect();

let books = [
    // {id: 1,
    // title: 'rich dad poor dad',
    // notes: 'this is a great finance book',
    // rating: 5,
    // read_date: 2025-04-01T07:00:00.000Z,
    // isbn: '1612681131'}
];

app.get("/", async(req, res) =>{
    try{
        const sort = req.query.sort;
        let orderby = "title ASC";
        if(sort === "rating"){
            orderby = "rating DESC"
        }else if(sort === "date"){
            orderby = "read_date DESC"
        }
        console.log(orderby);
        const result = await db.query(`SELECT * FROM books ORDER By ${orderby}`);
         books = result.rows;
        console.log(books);
        res.render("index.ejs", {book: books});
    } catch(err){
        console.error("Error fetching books:", err);
    }
});

app.get("/add", (req, res) => {
    res.render("form.ejs");
  });

  app.get("/edit", (req, res) => {
    res.render("editform.ejs");
  });
app.post("/submit", async(req, res) => {
    const booktitle = req.body.booktitle;
    const booknotes = req.body.booknotes;
    const rating = req.body.rating;
    const date = req.body.date;
    console.log(date);
    const bookisbn = req.body.bookisbn;

    const result = await db.query("INSERT INTO books (title, notes, rating, read_date, isbn) VALUES ($1, $2, $3, $4, $5)",[booktitle, booknotes, rating, date, bookisbn]);
    const Data = result.rows;
    console.log(Data);

    res.redirect("/");
  });


  app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
  const book = result.rows[0];
  console.log(book);
    if (book) {
        res.render("editform.ejs", { book: book });
      } else {
        res.status(404).send("Book not found.");
      }
});

  app.post("/edit/:id", async(req, res) => {
    const editbooktitle = req.body.editbooktitle;
    const editbooknotes = req.body.editbooknotes;
    console.log("NOTES:", editbooknotes);
    const editrating = req.body.editrating;
    const editdate = req.body.editdate;
    const editbookisbn = req.body.editbookisbn;

    const id = Number(req.params.id); 
    
    try {
        const result = await db.query("UPDATE books SET title = $1, notes = $2, rating = $3, read_date = $4, isbn = $5 WHERE id = $6;",[editbooktitle, editbooknotes, editrating, editdate, editbookisbn, id]);
         const date = result.rows;
         console.log(date); 

         res.redirect("/");
      } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).send("Failed to update book.");
      }
  });

  app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try{
        const result = await db.query("DELETE FROM books WHERE id = $1 RETURNING *;", [id]);
        console.log("Deleted book:", result.rows[0]);
        res.redirect("/");   
    }catch(err){
        console.error("Error deleting book:", err);
        res.status(500).send("Failed to delete book.");
    }
    
  });


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});