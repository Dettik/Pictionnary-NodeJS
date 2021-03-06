var mysql = require('mysql');
var logger = require('log4js').getLogger('Server');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'test',
    password: 'test',
    database: 'pictionnary'
});

connection.connect();

exports.verifyEmail=function (req,res,data, callback) {
    logger.info('fils de pute');
    connection.query('SELECT * from users where email=?', [data.email], function (err, rows, fields) {
        if (!err)
        {
            callback(rows);
        }
        else
            logger.error(err);

    });
};

exports.login=function (req,res,data, callback) {
    connection.query('SELECT * from users where email=? and password=?', [data.email , data.password], function (err, rows, fields) {
        if (!err)
        {
            callback(rows);
        }
        else
            logger.error(err);

    });
};

exports.register=function (req,res,data, callback) {
    connection.query('INSERT INTO users (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [data.email,
                     data.password,
                     data.nom,
                     data.prenom,
                     data.tel,
                     data.website,
                     data.sexe,
                     data.birthdate,
                     data.ville,
                     data.taille,
                     data.couleur,
                     data.profilepic
                     ], function (err, rows, fields) {
        if (!err)
        {
            callback(rows);
        }
        else
            logger.error(err);

    });
};

exports.insertPaint=function (req,res,data, callback) {
    connection.query('INSERT INTO drawings (id_user, commands, drawing, name) VALUES (?, ?, ?, ?)',
        [data.id_user,
            data.commands,
            data.dessin,
            data.name
        ], function (err, rows, fields) {
            if (!err)
            {
                callback(rows);
            }
            else
                logger.error(err);
    });
};

exports.getPaint=function (req,res,data, callback) {
    connection.query('SELECT * from drawings where id_user=?', [data.id_user], function (err, rows, fields) {
        if (!err)
        {
            callback(rows);
        }
        else
            logger.error(err);

    });
};

exports.guess=function (req,res,data, callback) {
    connection.query('SELECT * from drawings where id_draw=? and id_user=?', [data.id_draw, data.id_user], function (err, rows, fields) {
        if (!err)
        {
            callback(rows);
        }
        else
            logger.error(err);

    });
};