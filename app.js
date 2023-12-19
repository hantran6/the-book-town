const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

let products = require('./products');
console.log(products);

//render home page
app.get('/', (req, res) => {
    res.render('home', {products: products});
});

//render order page
app.get('/order', (req, res) => {
    res.render('order', {products: products});
});


app.listen(port, () => {
    console.log(`Servert started on port ${port}`);
})