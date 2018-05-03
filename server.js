//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use('/vendor', express.static(__dirname + '/vendor'));
app.use('/store', express.static(__dirname + '/store'));
app.use('/tests', express.static(__dirname + '/tests'));
app.use('/book', express.static(__dirname + '/book'));

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);