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

app.use(function (req, res, next) {
    res.locals.logged = req.session.logged;
    next();
});

app.get('/', ash(async (req, res) => {
    res.render('index');
}));

app.get('/login', ash(async (req, res) => {
    if (req.session.userid) {
        res.redirect('/');
    } else {
        res.render('login');
    }
}));
app.post('/login', ash(async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var userid = await db.login_user(username, password);
    if (userid) {
        req.session.username = username;
        req.session.userid = userid;
        req.session.logged = true;
        res.redirect('/');
    } else {
        res.render('login');
    }
}));

app.get('/product/:id(\\d+)', ash(async (req, res) => {
    var id = req.params.id;
    const [product] = await db.get_full_product(id);
    res.render('product', { product });
}));

app.get('/listing', ash(async (req, res) => {
    var id = req.query.id
    const result = await db.get_product();
    var listing = result;
    var active = null;
    if (id) {
        listing = listing.filter(pr => pr.category == id);
        active = id;
    }
    const categories = await db.get_category();
    res.render('listing', { listing, categories, active });
}));

app.post('/', (req, res) => {
    res.render('index', { username: req.session.username });
});

app.get('/register', (req, res) => {
    if (req.session.userid) {
        res.redirect('/');
    } else {
        res.render('register');
    }
});

app.post('/register', ash(async (req, res) => {
    var username = req.body.reg_username;
    var password = req.body.reg_password;
    var confirm_password = req.body.reg_password_confirm;
    if (password != confirm_password) {
        res.render('register');
    } else {
        var success = await db.add_user(username, password, false);
        if (success) {
            req.session.userid = success;
            req.session.username = username;
            res.redirect('/');
        } else {
            res.render('register');
        }
    }
}));


app.get('/logout', (req, res) => {
    delete req.session.logged;
    delete req.session.userid;
    delete req.session.username;
    res.redirect('/');
})


app.get('/basket', (req, res) => {
    res.render('basket');
})

app.get('/admin', (req, res) => {
    res.render('admin_panel');
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
