var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var logger = require('log4js').getLogger('Server');
var bodyParser = require('body-parser');
var app = express();
var database = require('./database');
var validator = require('validator');
var sha256 = require('sha256');
var dateFormat = require('dateformat');
var session = require('express-session');
var sess;

// config
app.set('view engine', 'ejs');
app.set('pages', __dirname + '/pages');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined')); // Active le middleware de logging

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

app.use(session({secret: 'secret'}));

logger.info('server start');

app.get('/', function(req, res){
    sess = req.session;
    if(sess.email){
        res.redirect('/main');
    }
    else{
        res.redirect('/login');
    }
});

app.get('/header', function(req, res){
    sess=req.session;
    res.render('main',{sess : sess});
});

app.get('/login', function(req, res){
    sess=req.session;
    if(sess.email){
        res.redirect('/main');
    }
    else {
        res.render('login', {errors: []});
    }
});

app.post('/login', function(req, res) {
    sess = req.session;
    if(sess.email){
        res.redirect('/main');
    }
    else {

        var email = req.body.email;
        var password = sha256(String(req.body.password));
        var errors = [];

        if (errors.length != 0) {
            res.render('login', {errors: errors});
        }
        else {
            var data = {email: email, password: password};

            database.login(req, res, data, function (rows) {
                if (rows.length == 0) {
                    errors.push('Email ou mot de passe incorrect !');
                    res.render('login', {errors: errors});
                }
                else {
                    sess.id = rows[0].id;
                    sess.email = rows[0].email;
                    sess.name = rows[0].nom;
                    sess.firstname = rows[0].prenom;
                    sess.phone = rows[0].tel;
                    sess.website = rows[0].website;
                    sess.sex = rows[0].sexe;
                    sess.birthdate = rows[0].birthdate;
                    sess.town = rows[0].ville;
                    sess.size = rows[0].taille;
                    sess.color = rows[0].couleur;
                    sess.profilepic = rows[0].profilepic;
                    res.redirect('/main');
                }
            });
        }
    }
});

app.get('/register', function(req, res){
    sess=req.session;
    if(sess.email){
        res.redirect('/main');
    }
    else {
        res.render('register', {errors: []});
    }
});


app.post('/register', function(req, res) {
    sess=req.session;
    if(sess.email){
        res.redirect('/main');
    }
    else {
        var email = req.body.email;
        var password = sha256(String(req.body.password));
        var prenom = req.body.prenom;
        var nom = req.body.nom;
        var tel = req.body.telephone;
        var website = req.body.web;
        var sexe = req.body.sexe;
        var birthdate = dateFormat(req.body.datenaissance, "isoDateTime");
        var ville = req.body.ville;
        var taille = req.body.taille;
        var couleur = req.body.couleur.substr(1);
        var profilepic = req.body.profilepic;
        var errors = [];

        if (errors.length != 0) {
            res.render('login', {errors: errors});
        }
        else {
            var data = {
                email: email,
                password: password,
                prenom: prenom,
                nom: nom,
                tel: tel,
                website: website,
                sexe: sexe,
                birthdate: birthdate,
                ville: ville,
                taille: taille,
                couleur: couleur,
                profilepic: profilepic
            };

            database.verifyEmail(req, res, data, function (rows){
                if (rows.length != 0) {
                    errors.push('Email déjà existant !');
                    res.render('register', {errors: errors});
                }
                else {
                    database.register(req, res, data, function (rows) {
                        res.redirect('/login');
                    });
                }
            });
        }
    }
});

app.get('/main', function(req, res){
    sess=req.session;
    if(sess.email){
        res.render('main',{sess : sess});
    }
    else {
        res.redirect('/login');
    }
});

app.get('/paint', function(req, res){
    sess=req.session;
    res.render('paint');
});

app.get('/logout',function(req,res){

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });

});

app.listen(1234);