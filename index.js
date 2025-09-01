import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432,
});

db.connect();
let search;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let sort = "review_id";

app.get("/", async (req, res) => {
    try {
        const response = await db.query(
            `SELECT * FROM books JOIN book_reviews ON books.book_id = book_reviews.book_id ORDER BY ${sort} ASC`
        );
        const data = response.rows;
        res.render("index.ejs", { search: search, data: data });
    } catch (error) {
        console.log("Could not execute query: ", error);
    }
});

app.get("/book", async (req, res) => {
    const bookTitle = req.query.title;
    const author = req.query.author;
    const coverId = req.query.coverId;
    try {
        const response = await db.query(`SELECT * FROM books JOIN book_reviews ON books.book_id = book_reviews.book_id`);
        const data = response.rows;
        const bookCheck = data.find((book) => book.title === req.query.title);
        const review = bookCheck ? bookCheck.review_text : undefined;
        const book_id = bookCheck ? bookCheck.book_id : undefined;
        res.render("addBook.ejs", {
            title: bookTitle, 
            author: author,
            cover: coverId,
            review: review,
            book_id: book_id
        });
    } catch (error) {
        console.log("Error: ", error);
    }
});

app.post("/sort", async (req, res) => {
    sort = req.body.sort;
    res.redirect("/");
});

app.post("/updateReview", async (req, res) => {
    const review_text = req.body.review_text;
    const rating = req.body.rating;
    const book_id = req.body.bookId;
    const currentDate = new Date().toISOString();
    try {
        const response = await db.query(`UPDATE book_reviews SET review_text = $1, rating = $2, review_date = $3 WHERE book_id = $4 RETURNING *`, [review_text, rating, currentDate, book_id]);
        const data = response.rows;
        console.log(`${rating}, ${book_id}, ${currentDate}`);
        res.redirect("/");
    } catch (error) {
        console.log("Error: ", error);
    }
});

app.post("/addBook", async (req, res) => {
    const bookTitle = req.body.title;
    const coverId = req.body.cover_id;
    const author = req.body.author;
    const review_text = req.body.review_text;
    const rating = req.body.rating;
    try {
        await db.query('BEGIN');
        const newBook = await db.query(`INSERT INTO books (title, author, cover_id) VALUES ($1, $2, $3) RETURNING book_id`, [bookTitle, author, coverId]);
        const newReview = await db.query(`INSERT INTO book_reviews (book_id, review_text, rating ) VALUES ($1, $2, $3) RETURNING *`, [newBook.rows[0].book_id, review_text, rating]);
        await db.query('COMMIT');
        res.redirect("/");
    } catch (error) {
        await db.query('ROLLBACK');
        console.log("An Error Occured: ", error);
    }
});

app.delete("/delete/:id", async (req, res) => {
    const bookId = req.params.id;
    try {
        await db.query('BEGIN');
        await db.query(`DELETE FROM book_reviews WHERE book_id = $1`, [bookId]);
        await db.query(`DELETE FROM books WHERE book_id = $1`, [bookId]);
        await db.query('COMMIT');
    } catch (error) {
        await db.query('ROLLBACK');
        console.log("An error occured: ", error);
    }
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});