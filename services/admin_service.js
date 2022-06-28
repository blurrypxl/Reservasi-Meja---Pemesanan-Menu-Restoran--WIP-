const db = require('../server');

function readAdmin(req, res, next) {}

function readTotalAdmin(req, res, next) {
    db.query(`SELECT COUNT(id) AS total FROM users WHERE role='admin'`, (err, results) => {
        if (err) throw err;

        res.locals.totalAdmin = results;

        next();
    });
}

function createAdmin(req, res, next) {}

function updateAdmin(req, res, next) {}

function deleteAdmin(req, res, next) {}

module.exports = {
    readAdmin,
    readTotalAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin
};