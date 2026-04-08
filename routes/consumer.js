const express = require('express')
const router = express.Router()
const supabase = require('../supabase/client')

// Admin processes the next report in queue (CONSUMER)
router.post('/process', async (req, res) => {
    // Get the oldest pending report
    const { data: reports, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
        .limit(1)

    if (fetchError) return res.status(500).json({ error: fetchError.message })
    if (reports.length === 0) return res.status(404).json({ message: 'Queue is empty' })

    const report = reports[0]

    // Mark it as processed
    const { data, error: updateError } = await supabase
        .from('reports')
        .update({ status: 'processed', processed_at: new Date() })
        .eq('id', report.id)
        .select()

    if (updateError) return res.status(500).json({ error: updateError.message })

    res.json({
        message: 'Report processed successfully',
        report: data[0]
    })
})

// Get all processed reports
router.get('/processed', async (req, res) => {
    const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('status', 'processed')
        .order('processed_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })

    res.json({ processed: data, count: data.length })
})

module.exports = router