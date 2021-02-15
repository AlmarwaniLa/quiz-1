const express = require('express');
const app = express();
const logger = require('morgan');
const path = require('path');

app.set('view engine', 'ejs');
app.use(logger { "dev" });
app.use('/static', express.static(path.join(__dirname, 'public')))


app.get("/", (req, res) => {
    res.send("home");
});
const DOMAIN = 'localhost';
const PORT = '4646';
app.listen(PORT, DOMAIN, () => {
    console.log(`🖥 Server listenning on http://${DOMAIN}:${PORT}`);
});