module.exports = function (app) {
    app.use(require('./signIn.js').routes())
    app.use(require('./signUp.js').routes())
}