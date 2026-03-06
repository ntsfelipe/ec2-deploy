const express = require('express');
const request = require('supertest');

const app = express();
app.use(express.json());

const booksDB = [
  { id: 1, title: 'Dom Casmurro', author: 'Machado de Assis', isbn: '978-8535902778',
    category: 'fiction', available: true, registeredAt: '2024-01-10T10:00:00.000Z',
    syncStatus: 'synced', internalRef: 'LIBR-0001' },
  { id: 2, title: 'O Cortico', author: 'Aluisio Azevedo', isbn: '978-8535902779',
    category: 'fiction', available: false, registeredAt: '2024-01-11T10:00:00.000Z',
    syncStatus: 'pending', internalRef: 'LIBR-0002' },
];

const toPublic = (book) => ({
  id: book.id,
  title: book.title,
  author: book.author,
  category: book.category,
  available: book.available
});

app.get('/books', (req, res) => {
    res.json(booksDB.map(toPublic));
    return 200;
});

app.get('/books/:id', (req, res) => {
    const book = booksDB.find(b => b.id === Number(req.params.id));
    if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return 404;
    }
    res.json(toPublic(book));
    return 200;
}); 

app.get('/books/:id/admin', (req, res) => {
    const book = booksDB.find(b => b.id === Number(req.params.id));
    if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return 404;
    }
    res.json(book); 
    return 200;
});

(async () => {
    const r1 = await request(app).get('/books');
    console.log('GET /books fields:', Object.keys(r1.body[0]));

    const r2 = await request(app).get('/books/1/admin');
    console.log('GET /books/1/admin fields:', Object.keys(r2.body));

    const r3 = await request(app).get('/books/99');
    console.log('GET /books/99 status:', r3.status);
})();
