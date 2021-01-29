const express = require('express');
const session = require('express-session');
const ash = require('express-async-handler');
const http = require('http');
const db = require('./db/db_services');
const path = require('path');

const app = express();
app.use(session({
    secret: 'weppoweppo',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/category/:id(\\d+)', (req, res) => {
    res.render('category');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/listing', ash(async (req, res) => {
    const listing = await db.get_product();
    res.render('listing', { listing });
}));

app.post('/', (req, res) => {
    res.render('index');
});

app.get('/cart', (req, res) => {
    res.render('cart');
})

app.get('/account', (req, res) => {
    res.render('account');
});

app.post('/account', (req, res) => {
    res.redirect('/account');
});

app.get('/checkout', (req, res) => {
    res.render('checkout');
});

app.post('/checkout', (req, res) => {
    res.render('buy-success');
});

app.get('/admin', (req, res) => {
    res.render('admin');
});

app.get('/admin/products', (req, res) => {
    res.render('admin-products');
});

app.get('/admin/products/:id(\\d+)', (req, res) => {
    res.render('admin-products');
});

app.get('/admin/users', (req, res) => {
    res.render('admin-users');
});

app.get('/admin/orders', (req, res) => {
    res.render('admin-orders');
});

http.createServer(app).listen(process.env.PORT || 8080);
console.log('Server started');