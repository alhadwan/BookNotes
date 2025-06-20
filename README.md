# book Notes App
A personal book-tracking web app where you can log what you’ve read, add your own notes, rate them, and track your reading history — complete with cover images via the Open Library Covers API.

  live Demo: https://booknotes-cstr.onrender.com

# Features
- Add books with title, notes, rating, read date, and ISBN
- Edit or delete existing entries
- Sort books by title, rating, or most recent read
- View real book covers using Open Library Covers API (https://openlibrary.org/dev/docs/api/covers)

# Tech Stack
- *Frontend*: HTML, CSS, EJS
- *Backend*: Node.js, Express.js
- *Database*: PostgreSQL
- *API*: [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)

# Setup & Installation
-  git clone https://github.com/alhadwan/BookNotes-project.git
-  cd BookNotes-project
-  npm install
-  nodemon index.js (start project) 

# Database Setup on Render
-  go to https://dashboard.render.com/d/dpg-d19ruo95pdvs73a4ofb0-a/info
-  fill necessary info
-  Add the following variables to your project: 
      - DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>?sslmode=require
      - NODE_ENV=production
-  Connect Your App to the Database
    if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
}
- Initialize the Database using terminal(Create Table + Seed Data)
    - psql "<DATABASE_URL>?sslmode=require" -f booknote.sql (PSQL Command)