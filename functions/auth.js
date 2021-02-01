function user(req, res, next) {
    if (req.session.logged) {
        next();
    } else {
        req.session.customAlert = { type: 'danger', message: 'By przejść do żądanej strony, musisz się zalogować' };
        res.redirect('/login?redirect=' + req.url);
    }
}

module.exports = {
    user
}