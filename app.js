const express = require('express');
const session = require('express-session');
const ash = require('express-async-handler');
const http = require('http');
const db = require('./db/db_services');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer();
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
    if (!req.session.basket) {
        req.session.basket = {};
        req.session.basketinfo = {};
        req.session.basketlength = 0;
    }
    res.locals.basketlength = req.session.basketlength;
    next();
});

app.get('/clearbasket', (req, res) => {
    delete req.session.basket;
    delete req.session.basketinfo;
    res.redirect('/');
});

app.get('/', async (req, res) => {
    //debug:
    console.log(req.session);
    res.render('index');
});

app.get('/login', (req, res) => {
    if (req.session.logged) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

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
    var search = req.query.search;
    var id = req.query.id
    const result = await db.get_product();
    var listing = result;
    var active = null;
    if (id) {
        listing = listing.filter(pr => pr.category == id);
        active = id;
    }
    if(search){
        listing = listing.filter(pr => pr.name.toLowerCase().includes(search.toLowerCase()));
    }
    const categories = await db.get_category();
    res.render('listing', { listing, categories, active, search });
}));

app.post('/', (req, res) => {
    res.render('index', { username: req.session.username });
});

app.get('/register', (req, res) => {
    if (req.session.logged) {
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
            req.session.logged = true;
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


app.post('/api/add2basket', upload.single(), ash(async (req, res) => {
    var id = Number(req.body.txtParam);
    req.session.basketlength += 1;
    if (req.session.basket[id]) {
        req.session.basket[id].amount += 1;
    } else {
        req.session.basket[id] = { amount: 1 };
        let full_prod = await db.get_full_product(id);
        req.session.basketinfo[id] = full_prod[0];
    }
    res.json({ success: "Updated Successfully", status: 200, productName: req.session.basketinfo[id].name });
}));

app.get('/api/remove/:id(\\d+)', (req, res) => {
    var id = parseInt(req.params.id);
    if (req.session.basket && req.session.basket[id]) {
        req.session.basketlength -= 1;
        req.session.basket[id].amount -= 1;
        if (req.session.basket[id].amount < 1) {
            delete req.session.basket[id];
            delete req.session.basketinfo[id];
        }
    }
    res.redirect('/basket');
});

app.get('/basket', (req, res) => {
    let products_in_basket = [];
    let bi = req.session.basketinfo;
    let b = req.session.basket;
    Object.keys(bi).map((key) => {
        products_in_basket.push({ item: bi[key], amount: b[key].amount });
    })
    console.log(products_in_basket);
    res.render('basket', { basket: products_in_basket });
});

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

app.get('/order', (req, res) => {
    res.render('order_view');
});

app.get('/admin', (req, res) => {
    res.render('admin_panel');
});

app.get('/admin/products', (req, res) => {
    res.render('admin-products');
});

app.get('/admin/product', (req, res) => {
    res.render('admin-product');
});

app.get('/admin/products/:id(\\d+)', (req, res) => {
    res.render('admin-products');
});

app.get('/admin/users', (req, res) => {
    res.render('admin-users');
});

app.get('/admin/user', (req, res) => {
    res.render('admin_user');
});

app.get('/admin/orders', (req, res) => {
    res.render('admin-orders');
});

app.get('/admin/order', (req, res) => {
    res.render('admin_order_view');
});

http.createServer(app).listen(process.env.PORT || 8080);
console.log('Server started');