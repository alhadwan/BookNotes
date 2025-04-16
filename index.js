import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

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
let books = [];

app.get("/", async(req, res) =>{
    try{
        const result = await db.query("SELECT * FROM books");
         books = result.rows;
        console.log(books);
        res.render("index.ejs", {book: books});
    } catch(err){
        console.error("Error fetching books:", err);
    }
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});