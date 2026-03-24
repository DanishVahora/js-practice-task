const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const countryRoute = require('./routes/countryRoutes')

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/location', async (req, res) => {

    let country = [];
    let state = [];
    let city = [];

    country = await fetch("http://localhost:3000/api/country")
    console.log(country);




    res.render("index", {
        country,
        state,
        city
    })
});

app.use('/api', countryRoute);


app.get('')

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
