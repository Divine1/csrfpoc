import express from 'express';
import {json,urlencoded} from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import hbs from "hbs";
import csurf from 'csurf'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import lusca from 'lusca'

const app = express();
app.set("view engine","hbs");

/*
const csrfMiddleware = csurf({
    cookie: true
});
app.use(cookieParser());
app.use(csrfMiddleware);
*/


app.use(json())
app.use(urlencoded({extended:true}))
app.use(morgan('dev'))

var whitelist = ['http://localhost:3001',"http://192.168.0.3:3001"]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(session({
    secret: 'abc',
    resave: true,
    saveUninitialized: true
}));
//app.use(cors(corsOptionsDelegate))
app.use(cors())
app.use(lusca.csrf());
app.use(lusca.referrerPolicy('no-referrer'));

app.get('/page',(req,res)=>{
    //console.log("req-- ",req.csrfToken())
    console.log("__dirname ",__dirname)
    res.render("rest.hbs");
})



app.get('/',(req,res)=>{
    console.log("req-- ",req.csrfToken())
    res.send({message  :"hello index"})
})
app.get('/csrf',(req,res)=>{
    console.log("in /csrf route");

    let data = ""
    try{
        data = req.csrfToken();
    }
    catch(err){

    }

    res.send({"csrfToken" : data });
})
app.get('/index',(req,res)=>{
    console.log("in /index route");
    res.render("index.hbs", { csrfToken : req.csrfToken()});
})
app.post('/store',(req,res)=>{
    console.log("req--- ",req.body)
    res.send({data  : req.body.firstname+" - "+Date.now()})
})

app.listen(3000,()=>{
    console.log("server started at 3000")
})