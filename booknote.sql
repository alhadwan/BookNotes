CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  read_date DATE,
  isbn TEXT
);

INSERT INTO books (title, notes, rating, read_date, isbn)
VALUES ('rich dad poor dad', 'this is a great finance book', 5, '2025-04-01', '235624562');
