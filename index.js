const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const { createDatabasePool } = require('./config/db');

app.get('/', async (req, res) => {
    try {
        const pool = await createDatabasePool();
        const query = `
            SELECT products.*, product_category.product_category_name
            FROM products
            JOIN product_category ON products.product_category = product_category.product_category_number
        `;

        const [results] = await pool.query(query);

        res.render('home', { products: results });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/order', async (req, res) => {
    try {
        const pool = await createDatabasePool();
        const query = `
            SELECT products.*, product_category.product_category_name
            FROM products
            JOIN product_category ON products.product_category = product_category.product_category_number
        `;

        const [results] = await pool.query(query);

        res.render('order', { products: results });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ... (rest of your code)

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
