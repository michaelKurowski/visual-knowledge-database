const should = require('should')
const mongoose = require('mongoose')
const dbConnection = require('../db/dbConnectionProvider')

const DUMMY_DATA = {
    id: '12345'
}

describe('User', function() {
    before(function(done) {
        db = mongoose.createConnection('mongodb://tester:dupadupa12345@ds361488.mlab.com:61488/testdb1', {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
        dbConnection.setDbConnection(db)
        User = require('../db/schema/user')
        done()
    })
    after(function(done) {
        mongoose.disconnect()
        done()
    })
    beforeEach(done => {
        let user = new User({id: '12345'})

        user.save(function(error) {
            if(error) console.log('error' + error.message)
            else console.log('no error')
            done()
        })
    })

    afterEach(done => {
        User.remove({}, () => {
            done()
        })
    })
    it('Find a user by username', (done) => {
        User.findOne(DUMMY_DATA, (err, user) => {
            user.email.should.eql('testy mctestyface')
            user.id.should.eql('12345')
            done()
        })
    })
})