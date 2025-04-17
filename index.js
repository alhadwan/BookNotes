import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

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



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});