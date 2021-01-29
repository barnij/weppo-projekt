const express = require('express');
const Router = require('express-promise-router');
const http = require('http');
const db = require('./db/db_services');
const path = require('path');

const app = express();
const router = Router();
app.use(router);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/category/:id(\\d+)', (req, res) => {
    res.render('category');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/listing', async (req, res) => {
    const listing = await db.get_product();
    res.render('listing', { listing });
});

router.post('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});


router.get('/cart', (req, res) => {
    res.render('cart');
})

router.get('/account', (req, res) => {
    res.render('account');
});

router.post('/account', (req, res) => {
    res.redirect('/account');
});

router.get('/checkout', (req, res) => {
    res.render('checkout');
});

router.post('/checkout', (req, res) => {
    res.render('buy-success');
});

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.get('/admin/products', (req, res) => {
    res.render('admin-products');
});

router.get('/admin/products/:id(\\d+)', (req, res) => {
    res.render('admin-products');
});

router.get('/admin/users', (req, res) => {
    res.render('admin-users');
});

router.get('/admin/orders', (req, res) => {
    res.render('admin-orders');
});

http.createServer(app).listen(process.env.PORT || 8080);
console.log('Server started');