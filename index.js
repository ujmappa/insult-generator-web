require('dotenv').config();
const insults = require('./sources/insults')

const express = require('express')
const app = express()

app.use(express.static('public'));

app.get('/api/v1/insult', function(req, res) {
    const name = req.query.name;
    const gender = req.query.gender || 'both';
    
    if (name === undefined) {
        res.status(400).json({ error: 'A név megadása kötelező!' });
        return;
    }
    
    if (gender && !['male', 'female', 'both'].includes(gender)) {
        res.status(400).json({ error: 'Hibás nem érték!' });
        return;
    }

    const insult = insults.getInsult(name, gender);
    res.status(200).json({ text: insult });
});

app.listen(process.env.PORT || 3000);