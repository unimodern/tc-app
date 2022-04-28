// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]

var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");
var ejs = require('ejs');
var partials = require('express-partials');
var Convert = require('./js/Convert.js')
var Site = require('./js/Site.js')


const app = express();
var server = http.createServer(app);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet({ 
    contentSecurityPolicy: { 
        useDefaults: true, 
        directives: { 
            'script-src': [
                "'self'", "https://cdn.jsdelivr.net"
            ] 
        } 
    } 
}));
app.use(limiter);
app.use(express.json());
app.use(partials());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
console.log("Started");
const site = new Site();



app.get('/', (req, res) => {
    console.log("get");
    const model = new Convert();
    res.render('index.ejs', { converted: false, site: site, model: model })
});


app.post('/', (req, res) => {
    console.log("post");
    console.log(req.body);
    const model = new Convert(req.body);
    model.convert();
    console.log(model);
    res.render('index.ejs', {converted: true, site: site, model: model })
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit. ');
});
// [END gae_node_request_example]

module.exports = app;
