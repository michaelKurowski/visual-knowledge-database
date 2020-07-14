const should = require('should')
const mongoose = require('mongoose')
const dbConnection = require('../db/dbConnectionProvider')

const DUMMY_DATA = {
    googleId: '12345',
    email: 'testy mctestyface',
    token: 'super special token'
}

describe('User', function() {
    before(function(done) {
        db = mongoose.createConnection('mongodb://tester:dupadupa12345@ds361488.mlab.com:61488/testdb1', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
        dbConnection.setDbConnection(db)
        GoogleUser = require('../db/schema/googleUser')
        done()
    })
    after(function(done) {
        mongoose.disconnect()
        done()
    })
    beforeEach(done => {
        let user = new GoogleUser({
            googleId: '12345',
            email: 'testy mctestyface',
            token: 'super special token'
        })

        user.save(function(error) {
            if(error) console.log('error' + error.message)
            else console.log('no error')
            done()
        })
    })

    afterEach(done => {
        GoogleUser.remove({}, () => {
            done()
        })
    })
    it('Find a user by username', (done) => {
        GoogleUser.findOne(DUMMY_DATA, (err, user) => {
            user.email.should.eql('testy mctestyface')
            user.googleId.should.eql('12345')
            done()
        })
    })
})