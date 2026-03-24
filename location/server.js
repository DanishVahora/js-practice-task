const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const countryRoute = require('./routes/locationRoutes')

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/location', async (req, res) => {

    let country;
    let state = [];
    let city = [];

    const temp = await fetch("http://localhost:3000/api/country")
    country = await temp.json()
    console.log(await country);




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
