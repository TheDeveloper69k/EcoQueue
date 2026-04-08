const express = require('express')
const router = express.Router()
const supabase = require('../supabase/client')

// Citizen submits a waste report (PRODUCER)
router.post('/report', async (req, res) => {
    const { location, description } = req.body

    if (!location || !description) {
        return res.status(400).json({ error: 'Location and description are required' })
    }

    const { data, error } = await supabase
        .from('reports')
        .insert([{ location, description, status: 'pending' }])
        .select()

    if (error) return res.status(500).json({ error: error.message })

    res.status(201).json({
        message: 'Waste report submitted successfully',
        report: data[0]
    })
})

// Get all pending reports in the queue
router.get('/queue', async (req, res) => {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })

    if (error) return res.status(500).json({ error: error.message })

    res.json({ queue: data, count: data.length })
})

module.exports = router