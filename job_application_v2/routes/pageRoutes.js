const express = require('express')
const router = express.Router()
const comboModel = require('../models/comboModel')

router.get('/form', async (req, res) => {
    try {
        const relationship_status = await comboModel.getOptionByName('relationship_status');
        const gender = await comboModel.getOptionByName('gender');
        const technologies = await comboModel.getOptionByName('technologies');
        const languages = await comboModel.getOptionByName('languages');
        const preferred_role = comboModel.getOptionByName('preferred_role');

        console.log(relationship_status,
            gender,
            technologies,
            languages,
            preferred_role);

        res.render('form', {
            relationship_status,
            gender,
            technologies,
            languages,
            preferred_role
        })
    }
    catch (error) {
        console.error('Error fetching combo options:', error);
        res.status(500).send('Internal Server Error');
    }
})

module.exports = router;