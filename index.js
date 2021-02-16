const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const html2pug = require('html2pug');
const cors = require('cors');

app.use(cors());
app.options('*', cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('', (req, res) => {
  res
    .status(200)
    .send('Spectrum Mailing Pug API!')
    .end();
});

router.post('/convert', (req, res) => {
    console.log(req.body);
    var template = req.body.htmlTemplate;
    if (!template){
        res.status(401)
        .send("{'status': false, 'errors': [{'message': 'Plantilla inexistente o invalida'}]}")
        .end();
    }
    var pugTemplate = "";
    try {
        pugTemplate = html2pug(template, { tabs: true });
    } catch (error) {
        console.log(error);
        res.status(500).send("A ocurrido un error").end();        
    }
    if(pugTemplate){
        res.status(200).end(JSON.stringify(pugTemplate));
    } else {
        res.status(502).send("No se pudo obtener un pug").end();
    }
})

app.use("/", router) 

// handle 404
app.use(function(req, res) {
    res.status(404).send({status:404, message: '404 Not Found', type:'client'});
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send({status:500, message: 'internal error', type:'internal'});
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});