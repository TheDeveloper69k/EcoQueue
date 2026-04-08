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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`EcoQueue server running on port ${PORT}`)
})