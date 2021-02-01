const express = require('express');
const session = require('express-session');
const ash = require('express-async-handler');
const http = require('http');
const path = require('path');
const multer = require('multer');

const { checksession } = require('./functions/middleware');
const basket = require('./functions/basket');
const auth = require('./functions/auth');
const user = require('./functions/user');
const product = require('./functions/product');
const account = require('./functions/account');


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


app.use(checksession);

app.get('/', (req, res) => {
    //debug:
    console.log(req.session);
    res.render('index');
});

//user
app.get('/login', user.getLogin);

app.post('/login', ash(user.postLogin));

app.get('/register', user.getRegister);

app.post('/register', ash(user.postRegister));

app.get('/logout', user.logout);


//basket
app.get('/basket', basket.get);

app.post('/api/add2basket', upload.single(), ash(basket.add));

app.get('/api/remove/:id(\\d+)', basket.remove);

app.get('/clearbasket', basket.clear);

//products
app.get('/product/:id(\\d+)', ash(product.get));

app.get('/listing', ash(product.list));


//account
app.get('/account', auth.user, ash(account.get));

app.post('/account/changepassword', auth.user, ash(account.changePassword));

app.get('/order/:id(\\d+)', auth.user, ash(account.order));

app.get('/checkout', auth.user, (req, res) => {
    res.render('checkout');
});

app.post('/checkout', auth.user, (req, res) => {
    res.render('buy-success');
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