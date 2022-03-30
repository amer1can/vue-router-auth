const express = require('express');
const cors = require('cors');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const db = new DB('sqlitedbv2')
const app = express()
const router = express.Router()

app.use(cors())

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.post('/register', function(req, res) {
    db.insert([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        req.body.is_admin
    ], function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")

        db.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            let token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400})
            res.status(200).send({
                auth: true,
                token,
                user
            })
        })
    })
})

router.post('/register-admin', function(req, res) {
    db.insertAdmin([
        req.body.name,
        req.body.email,
        bcrypt.hashSync(req.body.password, 8),
        req.body.is_admin
    ], function (err) {
        if (err) return res.status(500).send("There was a problem registering the admin.")

        db.selectByEmail(req.body.email, (err, user) => {
            if (err) return res.status(500).send("There was a problem getting admin")
            let token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400})
            res.status(200).send({
                auth: true,
                token,
                user
            })
        })
    })
})

router.get('/me', function(req, res) {
    let token = req.headers['x-access-token']
    if (!token) return res.status(401).send({
        auth: false,
        message: 'No token provided.'
    })

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({
            auth: false,
            message: 'Failed to authenticate token.'
        })
        res.status(200).send(decoded)
    })
})

router.post('/login', (req, res) => {
    db.selectByEmail(req.body.email, (err, user) => {
        if (err) return res.status(500).send('Error on the server')
        if (!user) return res.status(404).send('No user found')

        let passIsValid = bcrypt.compareSync(req.body.password, user.user_pass)
        if (!passIsValid) return res.status(401).send({
            auth: false,
            token: null
        })

        let token = jwt.sign({id: user.id}, config.secret, { expiresIn: 86400 })
        res.status(200).send({
            auth: true,
            token,
            user
        })
    })
})

router.get('/all', (req, res) => {
    db.selectAll((err, rows) => {
        if (err) return res.status(500).send('Error on the server')
        res.status(200).send(rows)
    })
})

app.use(router)

const port = process.env.PORT || 3000

const server = app.listen(port, ()=> {
    console.log('Express server listening on port ' + port)
})
