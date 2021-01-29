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
    res.render('index', {username: req.session.username});
});

app.get('/category/:id(\\d+)', (req, res) => {
    res.render('category');
});

app.get('/login', ash( async (req, res) => {
    if(req.session.userid) {
        res.redirect('/');
    } else {
        res.render('login');
    }
}));
app.post('/login', ash( async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var userid = await db.login_user(username, password);
    if(userid) {
        req.session.username = username;
        req.session.userid = userid;
        res.redirect('/');
    } else {
        res.render('login');
    }
}));

app.get('/product', (req, res) => {
    res.render('product');
});

app.get('/listing', ash(async (req, res) => {
    const listing = await db.get_product();
    res.render('listing', { listing });
}));

app.post('/', (req, res) => {
    res.render('index', {username: req.session.username});
});

app.get('/register', (req, res) => {
    if(req.session.userid) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

app.post('/register', ash( async(req, res) => {
    var username = req.body.reg_username;
    var password = req.body.reg_password;
    var confirm_password = req.body.reg_password_confirm;
    if(password != confirm_password) {
        res.render('register');
    } else {
        var success = await db.add_user(username, password, false);
        if(success) {
            req.session.userid = success;
            req.session.username = username;
            res.redirect('/');
        } else {
            res.render('register');
        }
    }
}));

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