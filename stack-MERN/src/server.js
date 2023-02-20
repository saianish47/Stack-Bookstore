import express from "express";
import {db, connectToDB} from "./connect.js";
import helper from "./helper.js";
import validator from "./validator.js"
// import mycors from "./cors.js";

const app = express();
app.use(express.json());

// Get Category

app.get('/api/categories/', async (req, res) => {
    
    const categories = await db.collection('category').find().toArray();
    if (categories) {
        res.json(categories);
    }
    else{
        res.sendStatus(404);
    }
});

// Get Category by ID

app.get('/api/categories/:category_id', async (req, res) => {
    const {category_id} = req.params;

    const categories = await helper.getCategory('category_id', parseInt(category_id));

    if (categories) {
        res.json(categories);
    }
    else{
        res.sendStatus(404);
    }
});

// Get Category by name

app.get('/api/categories/name/:name', async (req, res) => {
    const {name} = req.params;

    const categories = await helper.getCategory('name', name);

    if (categories) {
        res.json(categories);
    }
    else{
        res.sendStatus(404);
    }
});

// Get book by book ID

app.get('/api/books/:book_id', async (req, res) => {
    const {book_id} = req.params;

    const books = await helper.getBook('book_id', parseInt(book_id));

    if (books) {
        res.json(books);
    }
    else{
        res.sendStatus(404);
    }
});

// Featured Books

app.get('/api/books/featured/all', async (req, res) => {

    const books = await helper.getBook('is_featured', 1);

    if (books) {
        res.json(books);
    }
    else{
        res.sendStatus(404);
    }
});

// Get book by category ID

app.get('/api/categories/:category_id/books', async (req, res) => {
    const {category_id} = req.params;

    const books = await helper.getBook('category_id', parseInt(category_id));

    if (!books) {
        return res.status(404).send('Books not found');
    }
    
    res.json(books);
});


// Get Suggested Books by category ID

app.get('/api/categories/:category_id/suggested-books', async (req, res) => {
    const {category_id} = req.params;
    const limit = req.query.limit || 3;

    const books = await helper.getRandom('category_id', parseInt(category_id), parseInt(limit));

    if (!books) {
        return res.status(404).send('Books not found');
    }
    
    res.json(books);
});

// Get book by category name 

app.get('/api/categories/name/:name/books', async (req, res) => {
    const {name} = req.params;

    const category = await helper.getCategory('name', name);

    const books = await helper.getBook('category_id', parseInt(category.category_id));

    if (!books) {
        return res.status(404).send('Books not found');
    }
    
    res.json(books);
});

// categories/name/{category-name}/suggested-books?limit=#

app.get('/api/categories/name/:name/suggested-books', async (req, res) => {
    const {name} = req.params;
    const limit = req.query.limit || 3;
    const books = await helper.getRandom('name', parseInt(name), parseInt(limit));

    if (!books) {
        return res.status(404).send('Books not found');
    }
    
    res.json(books);
});

// /api/orders

app.post('/api/orders', async(req,res) => {

    const collection = await db.collection('orders');
    const [code, orderDetails] = helper.createOrder(req.body);

    if (code == 500){
        return res.status(500).json(orderDetails);
    }

    const result = await collection.insertOne(orderDetails);

    if (result.acknowledged){
        return res.json(orderDetails);
    }
    else{
        return res.sendStatus(500);
    }
});


connectToDB(()=>{
    console.log('Successfully Connected to Database');
    app.listen(8011, () =>
    {
        console.log('Server is listening on port 8011');
    });
});