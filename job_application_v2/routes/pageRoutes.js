const express = require('express')
const router = express.Router()
const comboModel = require('../models/comboModel')

router.get('/form', async (req, res) => {
    try {
        const relationship_status = await comboModel.getOptionssByName('relationship_status');
        const gender = await comboModel.getOptionssByName('gender');
        const technologies = await comboModel.getOptionssByName('technologies');
        const languages = await comboModel.getOptionssByName('languages');
        const preferred_role = await comboModel.getOptionssByName('preferred_role');
        const education = await comboModel.getOptionssByName('education');
        const job_location = await comboModel.getOptionssByName('job_location');
        console.log(relationship_status,
            gender,
            technologies,
            languages,
            preferred_role,
            education,
            job_location);

        res.render('form', {
            relationship_status,
            gender,
            technologies,
            languages,
            preferred_role,
            education,
            job_location
        })
    }
    catch (error) {
        console.error('Error fetching combo options:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;