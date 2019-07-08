import 'zone.js/dist/zone-node';
import {enableProdMode} from '@angular/core';
// Express Engine
import {ngExpressEngine} from '@nguniversal/express-engine';
// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as compression from 'compression';
import {join} from 'path';



// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
const fetch = require('node-fetch');
const cors = require('cors');


app.use(compression());

const PORT = process.env.PORT || 4204;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');




// Domino adition
const domino = require('domino');
const fs = require('fs');
const path = require('path');
const template = fs.readFileSync(path.join(DIST_FOLDER, 'index.html')).toString();
const win = domino.createWindow(template);

// uncomment if you need fetch
// import fetch from 'node-fetch';
// win.fetch = fetch;

win.pageYOffset = 0;
win.pageXOffset = 0;
win.Date = Date;
win.cancelAnimationFrame = () => {};
win.matchMedia = () => {};


declare var global: any;


global.window = win;
global.DOMTokenList = win.DOMTokenList;
global.Node = win.Node;
global.Text = win.Text;

win.HTMLElement.prototype.getBoundingClientRect = () => ({
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0
});
global.HTMLElement = win.HTMLElement;
global.Element = win.HTMLElement;
global.navigator = win.navigator;
global.Event = win.Event;
global.Event.prototype = win.Event.prototype;
Object.defineProperty(win.document.body.style, 'transform', {
    value: () => {
        return {
            enumerable: true,
            configurable: true
        };
    },
});
global.document = win.document;
global.CSS = null;
global.getComputedStyle = () => ({
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: 0,
    fontWeight: 0,
    letterSpacing: 0,
    fontFamily: 0,
    lineHeight: 0,
    wordWrap: 0,
    wordBreak: 0,
    hyphens: 0,
    top: '',
    bottom: '',
    left: '',
    right: '',
});

// import * as Hammer from 'hammerjs/hammer';
// win.Hammer = Hammer;

// import * as Highcharts from 'highcharts';
// win.Highcharts = Highcharts;
/////////////////





// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        provideModuleMap(LAZY_MODULE_MAP)
    ]
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 200 /* some legacy browsers (IE11, various SmartTVs) choke on 204 */,
}));

// proxy requests to graphql in prod
// app.use('/api/*', proxy('http://10.229.132.29:8080/api/*'));
// app.use('/api/*', async(req, res) => {
//     const data = await fetch('http://10.229.132.29:8080' + req.baseUrl);
//     const dataJson =  await data.json();
//     res.status(200).json(dataJson);
// });



// Serve static files from /browser
app.get('*.*', express.static(DIST_FOLDER, {
    maxAge: '1y'
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
    res.render('index', { req });
});

// Start up the Node server
app.listen(4204, () => {
    console.log(`Node Express server listening on http://localhost:${PORT}`);
});
