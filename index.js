import express from "express";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  db = new Client({
   user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
}

db.connect();

let books = [];

app.get("/", async(req, res) =>{
    try{
        const sort = req.query.sort;
        let orderby = "title ASC";
        if(sort === "rating"){
            orderby = "rating DESC"
        }else if(sort === "date"){
            orderby = "read_date DESC"
        }
        const result = await db.query(`SELECT * FROM books ORDER By ${orderby}`);
         books = result.rows;
        res.render("index.ejs", {book: books});
    } catch(err){
        console.error("Error fetching books:", err);
    }
});

app.get("/add", (req, res) => {
    res.render("form.ejs");
  });

  app.get("/edit", (req, res) => {
    res.render("editForm.ejs");
  });
app.post("/submit", async(req, res) => {
    const bookTitle = req.body.bookTitle;
    const bookNotes = req.body.bookNotes;
    const rating = req.body.rating;
    const date = req.body.date;
    const bookIsBn = req.body.bookIsBn;

    const result = await db.query("INSERT INTO books (title, notes, rating, read_date, isbn) VALUES ($1, $2, $3, $4, $5)",[bookTitle, bookNotes, rating, date, bookIsBn]);
    const Data = result.rows;

    res.redirect("/");
  });


  app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;

  const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
  const book = result.rows[0];
 
    if (book) {
        res.render("editForm.ejs", { book: book });
      } else {
        res.status(404).send("Book not found.");
      }BookNote
});

  app.post("/edit/:id", async(req, res) => {
    const editBookTitle = req.body.editBookTitle;
    const editBookNotes = req.body.editBookNotes;
    const editRating = req.body.editRating;
    const editDate = req.body.editDate;
    const editBookIsBn = req.body.editBookIsbn;

    const id = Number(req.params.id); 
    
    try {
        const result = await db.query("UPDATE books SET title = $1, notes = $2, rating = $3, read_date = $4, isbn = $5 WHERE id = $6;",[editBookTitle, editBookNotes, editRating, editDate, editBookIsBn, id]);
         const date = result.rows;

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
        res.redirect("/");   
    }catch(err){
        console.error("Error deleting book:", err);
        res.status(500).send("Failed to delete book.");
    }
    
  });


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});