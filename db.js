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
