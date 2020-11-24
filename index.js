const express = require("express");
const app = express();
const compression = require("compression");
const session = require("cookie-session");
const bcrypt = require("bcryptjs");

const secrets = require("./secrets.json");
const db = require("./db.js");

app.use(compression());

app.use(express.json());

app.use(
    session({
        secret: secrets.sessionSecret,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    })
);

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(express.static("public"));

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.redirect(400, "/");
    }

    bcrypt
        .hash(password, 10)
        .then((hash) => db.addUser(firstname, lastname, email, hash))
        .then(({ rows }) => {
            console.log("inserted", rows);
            req.session.userId = rows[0].id;
            res.redirect(200, "/");
        })
        .catch(() => {
            res.sendStatus(400);
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8888, function () {
    console.log("I'm listening.");
});
