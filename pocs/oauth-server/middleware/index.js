module.exports = {
    isUserAuthenticated(req, res, next) {
        if(!req.user) return res.send('You must be logged in!')
        next()
    }
}