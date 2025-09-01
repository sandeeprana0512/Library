# 📚 Book Review Manager

A full-stack web application built with **Node.js**, **Express**, **PostgreSQL**, and **EJS** to manage a collection of books and their reviews.

---

## 🚀 Features

- View all books with their reviews and ratings
- Add new books with cover images and reviews
- Update existing reviews and ratings
- Sort book listings by title, author, or rating
- Delete books along with their reviews
- Search books via Open Library API integration with live dropdown suggestions
- Responsive UI using EJS templating and Font Awesome stars for ratings

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: EJS templating, CSS, Font Awesome
- **Environment Management**: dotenv
- **External API**: Open Library for book search and covers

---

## 📂 Project Structure

project/
│
├── public/ # Static assets (CSS, JS, images)
├── views/ # EJS templates and partials
│ ├── index.ejs
│ ├── addBook.ejs
│ └── partials/
│ ├── header.ejs
│ └── footer.ejs
├── .env # Environment variables
├── app.js # Main Express server app
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sandeeprana0512/Library.git
cd Library
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a .env file

Add your PostgreSQL database credentials and config:

```bash
PG_USER=your_pg_user
PG_HOST=localhost
PG_DATABASE=your_database
PG_PASSWORD=your_password
PG_PORT=5432
```

### 4. Setup the PostgreSQL database

Run the following SQL to create the tables:

```bash
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    cover_id INTEGER
);

CREATE TABLE book_reviews (
    review_id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(book_id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    review_date DATE DEFAULT CURRENT_DATE
);
```

### 5. Run the application

```bash
node app.js
```

Visit the app at: http://localhost:3000

## 📝 Usage

Use the search bar to find books by title, author, or ISBN using Open Library’s API.

Add new books and reviews if the book isn’t listed yet.

Edit or update existing reviews.

Sort books by title, author, or rating using the dropdown.

Delete books and their reviews.

## 🧹 Validation & Error Handling

Client-side validation to ensure ratings are selected before submitting.

Server-side try/catch blocks with transactions for safe database writes.

User confirmation prompt before deleting a book.

## 🚧 Future Improvements

Add user authentication and personalized reviews

Pagination for large lists of books

Enhanced UI with more detailed book metadata

Add cover image upload support

Deploy to cloud platforms like Heroku or Vercel

## 📄 License

MIT License © Sandeep Rana

## 🙌 Acknowledgements

Open Library API

Font Awesome

Express

PostgreSQL
