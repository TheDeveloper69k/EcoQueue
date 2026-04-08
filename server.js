const express = require('express')
const cors = require('cors')
require('dotenv').config()

const producerRouter = require('./routes/producer')
const consumerRouter = require('./routes/consumer')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/producer', producerRouter)
app.use('/api/consumer', consumerRouter)

// Admin login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body
    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, token: 'ecoqueue-admin-token' })
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`EcoQueue server running on port ${PORT}`)
})