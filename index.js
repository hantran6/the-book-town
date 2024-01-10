const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Use the `express.urlencoded` middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// let products = require('./products');
// console.log(products);

const pool = require('./config/db');
  
app.get('/', (req, res) => {
  const query = `
      SELECT products.*, product_category.product_category_name
      FROM products
      JOIN product_category ON products.product_category = product_category.product_category_number
  `;

  pool.query(query, (error, results) => {
      if (error) {
          console.error('Error executing query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      // Render the order page and pass the retrieved data to it
      res.render('home', { products: results });
  });
});

app.get('/order', (req, res) => {
    const query = `
        SELECT products.*, product_category.product_category_name
        FROM products
        JOIN product_category ON products.product_category = product_category.product_category_number
    `;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        // Render the order page and pass the retrieved data to it
        res.render('order', { products: results });
    });
});

function calculateTotalAmount(selectedProductIds, callback) {
  // Fetch product prices from the database based on product ids
  const query = 'SELECT product_id, product_name, price FROM products WHERE product_id IN (?)';
  pool.query(query, [selectedProductIds], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      callback(error, null, null);
      return;
    }

    if (!Array.isArray(results) || results.length === 0 || !results[0].hasOwnProperty('price')) {
      // Handle the case when there are no results or the structure is unexpected
      callback(null, 0, null);  // Returning 0 as the total amount
      return;
    }

    // Calculate the total amount based on selected product ids and their prices
    const totalAmount = results.reduce((accumulator, product) => {
    accumulator += parseFloat(product.price);
    return accumulator;
}, 0);

    const selectedProductNames = results.map((product) => product.product_name);

    callback(null, totalAmount, selectedProductNames);
  });
}

app.post('/checkout', (req, res) => {
  const {
      firstName,
      lastName,
      email,
      address,
      country,
      state,
      zip,
      products: selectedProductIds
  } = req.body;

  console.log('Received data:', req.body);

  // Ensure that selectedProductIds is an array
  const productIds = Array.isArray(selectedProductIds) ? selectedProductIds : [selectedProductIds];

  console.log('Product IDs:', productIds);

  if (productIds.length === 0) {
      // Handle the case when there are no selected products
      res.status(400).json({ error: 'No selected products' });
      return;
  }

  // Insert order information into the database
  const orderQuery = 'INSERT INTO orders (first_name, last_name, email, address, country, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?)';
  pool.query(orderQuery, [firstName, lastName, email, address, country, state, zip], (error, results) => {
      if (error) {
          console.error('Error executing order query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }

      const orderId = results.insertId;

      // Fetch product names and prices based on the selected product IDs
      const productQuery = 'SELECT product_id, product_name, price FROM products WHERE product_id IN (?)';
      pool.query(productQuery, [productIds], (error, productResults) => {
          if (error) {
              console.error('Error fetching product data:', error);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
          }

          const orderItemsData = productResults.map((product) => {
              return [orderId, product.product_id, 1, product.price];
          });

          // Insert order items into the database
          if (orderItemsData.length > 0) {
              const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, quantity, amount) VALUES ?';
              pool.query(orderItemsQuery, [orderItemsData], (error) => {
                  if (error) {
                      console.error('Error executing order items query:', error);
                      res.status(500).json({ error: 'Internal Server Error' });
                      return;
                  }

                  // Define selectedProductNames here
                  const selectedProductNames = productResults.map((product) => product.product_name);
                  const selectedProductPrices = productResults.map((product) => product.price);


                  // Calculate the total amount based on product prices
                  const totalAmount = productResults.reduce((accumulator, product) => {
                      accumulator += parseFloat(product.price);
                      return accumulator;
                  }, 0);

                  res.render('order-summary', {
                      customerName: `${firstName} ${lastName}`,
                      products: selectedProductNames,
                      prices: selectedProductPrices,
                      totalAmount: totalAmount,
                  });
                  console.log(selectedProductNames);
                  console.log(selectedProductPrices);

              });
          } else {
              // Handle the case when there are no selected products
              res.status(400).json({ error: 'No selected products' });
          }
      });
  });

  calculateTotalAmount(productIds, (error, totalAmount, selectedProductNames) => {
      if (error) {
          console.error('Error calculating total amount:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
  });
});

app.get('/find-order', (req, res) => {
  // Render the find-order template with any necessary initial data
  res.render('find-order', { email: null, orderItems: null });
});

app.post('/find-order', (req, res) => {
  const { email } = req.body;

  // Query the database to find order items based on the provided email
  const query = 'SELECT order_items.order_id, products.product_name, order_items.quantity, order_items.amount FROM order_items INNER JOIN orders ON order_items.order_id = orders.order_id INNER JOIN products ON order_items.product_id = products.product_id WHERE orders.email = ?';
  pool.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Render the find-order template with the obtained order items
    res.render('find-order', { email, orderItems: results });
  });
});

// ... (your existing code)


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})