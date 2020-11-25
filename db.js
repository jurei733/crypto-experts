const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:reichlej:reichlej@localhost:5432/socialnetwork"
);

module.exports.login = function login(username) {
    return db.query("SELECT * FROM users WHERE email = $1", [username]);
};

module.exports.addUser = function addUser(
    firstname,
    lastname,
    email,
    password
) {
    return db.query(
        "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [firstname, lastname, email, password]
    );
};

module.exports.getUserByEmail = function getUserByEmail(email) {
    return db.query("SELECT * FROM users WHERE email = $1", [email]);
};

module.exports.addCode = function addCode(email, code) {
    return db.query(
        "INSERT INTO codes (email, code) VALUES ($1,$2) RETURNING *",
        [email, code]
    );
};

module.exports.getCode = function getCode(code) {
    return db.query(
        "SELECT * FROM codes WHERE code=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'",
        [code]
    );
};

module.exports.resetPassword = function resetPassword(email, password) {
    return db.query("UPDATE users SET password=$2 WHERE email=$1", [
        email,
        password,
    ]);
};
