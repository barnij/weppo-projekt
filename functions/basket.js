const db = require('../db/db_services');

function get(req, res) {
    let products_in_basket = [];
    let bi = req.session.basketinfo;
    let b = req.session.basket;
    Object.keys(bi).map((key) => {
        products_in_basket.push({ item: bi[key], amount: b[key].amount });
    })
    console.log(products_in_basket);
    res.render('basket', { basket: products_in_basket });
}


async function add(req, res) {
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
}

function remove(req, res) {
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
}

function clear(req, res) {
    delete req.session.basket;
    delete req.session.basketinfo;
    res.redirect('/');
}

module.exports = {
    get,
    add,
    remove,
    clear
}