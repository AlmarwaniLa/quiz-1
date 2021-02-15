const express = require('express');
const morgan = require('morgan');
const app = express();
const logger = require('morgan');
const path = require('path');
const cookieParser = require("cookie-parser");
const router = require("./routes/clucks");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const knex = require('knex');
const multer = require('multer');
const connect = require('connect');


app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


const clucksRouter = require('./routes/clucks');
app.use('/clucks', clucksRouter);

app.get("/", (req, res) => {
    res.render('home');

    router.get('/login', (req, res) => {
        res.render('login');
    });
});
const DOMAIN = 'localhost';
const PORT = '4646';
app.listen(PORT, DOMAIN, () => {
    console.log(`🖥 Server listenning on http://${DOMAIN}:${PORT}`);
});