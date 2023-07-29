const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// const https = require('https');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Read data from the JSON file
const readData = () => {
    const rawData = fs.readFileSync('./json/book.json');
    return JSON.parse(rawData);
};
  
// Write data to the JSON file
const writeData = (data) => {
    fs.writeFileSync('./json/book.json', JSON.stringify(data, null, 2));
};

app.get('/', (req, res) => {
    res.status(200).send({code:200, status: true, msg: "Hello"});
});

// Get all books
app.get('/books', (req, res) => {
    const data = readData();
    res.status(200).send({status:true,code:200,data:data.books});
});
  
// Get a book by ID
app.get('/books/:id', (req, res) => {
    const data = readData();
    const book = data.books.find((b) => b.id === parseInt(req.params.id));
    if (book) {
        res.status(200).send({status:true,code:200,data:book});
    } else {
        res.status(404).send({ status:false, code:404, message: 'Book not found' });
    }
});
  
// Create a new book
app.post('/', (req, res) => {
    res.status(200).send({status:true,code:200,msg:'Hello World'});
});

// Create a new book
app.post('/books', (req, res) => {
    const data = readData();
    const newBook = {
        id: data.books.length + 1,
        title: req.body.title,
        author: req.body.author,
    };
    data.books.push(newBook);
    writeData(data);
    res.status(200).send({status:true,code:200,data:newBook});
});
  
// Update a book by ID
app.put('/books/:id', (req, res) => {
    const data = readData();
    const book = data.books.find((b) => b.id === parseInt(req.params.id));
    if (book) {
        book.title = req.body.title;
        book.author = req.body.author;
        writeData(data);
        res.status(200).send({status:true,code:200,data:book});
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});
  
// Delete a book by ID
app.delete('/books/:id', (req, res) => {
    const data = readData();
    const index = data.books.findIndex((b) => b.id === parseInt(req.params.id));
    if (index !== -1) {
        data.books.splice(index, 1);
        writeData(data);
        res.sendStatus(204);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});
  
// Start the server with HTTPS
// const server = https.createServer(
//     {
//         key: fs.readFileSync('certificates/server.key'),
//         cert: fs.readFileSync('certificates/server.crt'),
//     },
//     app
// );
// server.listen(PORT, () => {
//     console.log(`Server running on https://localhost:${PORT}`);
// });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app;