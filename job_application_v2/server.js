const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const comboRoutes = require('./routes/comboRoutes');
app.use('/api', comboRoutes);

const pageRoutes = require('./routes/pageRoutes');
app.use('/', pageRoutes);

const countryRoute = require('./routes/locationRoutes')
app.use('/ap', countryRoute);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})


