const db = require('../db/db_services');

async function get(req, res) {
    var alert = false;
    if (req.session.pass_change) {
        alert = { type: 'warning', message: 'Wpisano niepoprawne dane' };
        if (req.session.pass_change == 2) {
            alert = { type: 'success', message: 'Zmieniono hasło' };
        }
        delete req.session.pass_change;
    }
    let orders_list = await db.get_described_purchase(req.session.userid);
    res.render('account', { username: req.session.username, alert, orders_list: orders_list });
}

async function changePassword(req, res) {
    var old_pass = req.body.old_pass;
    var new_pass = req.body.new_pass;
    var repeat_pass = req.body.repeat_pass;
    var userid = await db.get_user_id(req.session.username, old_pass);
    var success = 1;
    if (new_pass == repeat_pass) {
        success = await db.set_user_password(userid, new_pass);
    }
    req.session.pass_change = success;
    res.redirect('/account');
}

module.exports = {
    get,
    changePassword
}