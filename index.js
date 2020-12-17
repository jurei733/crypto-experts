const express = require("express");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const compression = require("compression");
const session = require("cookie-session");
const bcrypt = require("bcryptjs");
const secrets = require("./secrets.json");
const db = require("./db.js");
const csurf = require("csurf");
const crypto = require("crypto-random-string");
const sendEmail = require("./ses");
const uploader = require("./middlewares/uploader.js");
const s3 = require("./middlewares/s3.js");
const CoinGecko = require("coingecko-api");
const CryptoNewsAPI = require("crypto-news-api").default;
const Api = new CryptoNewsAPI("772fc7ab3372aa82a6c504be6e509417");

const CoinGeckoClient = new CoinGecko();
let connectedList = [];

app.use(compression());

app.use(express.json());

const sessionMiddleware = session({
    secret: secrets.sessionSecret,
    maxAge: 30 * 24 * 60 * 60 * 1000,
});
app.use(sessionMiddleware);

io.use(function (socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

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
app.use(express.static("uploads"));

app.use(csurf());

app.use((req, res, next) => {
    res.cookie("super-secret-csrf-token", req.csrfToken());
    next();
});

app.get("/welcome", (req, res) => {
    console.log("I am in Welcome Route");
    console.log(req.query);
    if (req.session.userId) {
        res.redirect("/");
    } else {
        console.log("I AM in else Blcok");
        console.log(connectedList);
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.sendStatus(400);
    }

    bcrypt
        .hash(password, 10)
        .then((hash) => db.addUser(firstname, lastname, email, hash))
        .then(({ rows }) => {
            console.log("inserted", rows);
            req.session.userId = rows[0].id;
            res.sendStatus(200);
        })
        .catch(() => {
            res.sendStatus(400);
        });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.sendStatus(400);
    }

    db.getUserByEmail(email)
        .then(({ rows }) => {
            if (rows.length !== 1) {
                return res.sendStatus(400);
            }

            return Promise.all([
                bcrypt.compare(password, rows[0].password),
                rows[0].id,
            ]);
        })
        .then(([match, userId]) => {
            if (!match) {
                return res.sendStatus(400);
            }

            req.session.userId = userId;
            res.sendStatus(200);
        });
});

app.post("/password/reset/start", (req, res) => {
    let { email } = req.body;
    const code = crypto({ length: 10 });
    db.getUserByEmail(email).then(({ rows }) => {
        if (rows.length === 0) return res.sendStatus(400);
        sendEmail(
            "reichlej@gmx.de",
            "Here is the code you need to reset your Password: " +
                code +
                " you have 10 minutes time for that",
            "IT WORKS "
        )
            .catch(() => {
                res.sendStatus(400);
            })
            .then(() => {
                db.addCode(email, code);
                res.sendStatus(200);
            })
            .catch(() => {
                res.sendStatus(400);
            });
    });
});

app.post("/password/reset/verify", (req, res) => {
    let { code, password } = req.body;
    console.log(code, password);
    db.getCode(code)
        .then(({ rows }) => {
            console.log("RESULTS", rows);
            if (rows.length === 1) {
                bcrypt.hash(password, 10).then((hash) => {
                    db.resetPassword(rows[0].email, hash)
                        .then(() => {
                            res.sendStatus(200);
                        })
                        .catch(() => {
                            res.sendStatus(400);
                        });
                });
            } else {
                res.sendStatus(400);
            }
        })
        .catch((e) => {
            console.log("ERROR", e);
            res.sendStatus(400);
        });
});

app.get("/user", function (req, res) {
    db.getProfile(req.session.userId).then(({ rows }) => {
        if (rows.length === 0) return res.sendStatus(400);
        //console.log("Profile Informations", rows);
        res.json(rows[0]);
    });
});

app.post("/upload", uploader.single("file"), s3, (req, res) => {
    let { url } = req.body;
    db.addImage(req.session.userId, url).then(({ rows }) => {
        //if (rows.length === 0) return res.sendStatus(400);
        console.log("IMAGE ADDED INTO DATABASE", rows[0]);

        res.json(rows[0]);
    });
});

app.post("/update/profile", (req, res) => {
    //console.log("SAVE REQUEST", req.body.bio);
    db.updateBio(req.session.userId, req.body.bio)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.sendStatus(400);
        });
});

app.get("/api/user/:id", (req, res) => {
    if (!req.session.userId) return res.sendStatus(401);

    if (req.params.id == req.session.userId) {
        return res.sendStatus(418);
    }
    console.log("ID in index", req.params.id);
    db.getProfile(req.params.id).then(({ rows }) => {
        if (rows.length === 0) return res.sendStatus(404);
        res.json(rows);
    });
});

app.get("/api/users", async (req, res) => {
    console.log(req.query);
    if (!Object.getOwnPropertyNames(req.query).length) {
        let { rows } = await db.newestUsers();
        console.log(rows);
        res.json(rows);
    } else {
        let { rows } = await db.searchUsers(req.query.q);
        console.log(rows);
        res.json(rows);
    }
});

app.get("/statusFriendship/:id", (req, res) => {
    if (!req.session.userId) return res.sendStatus(401);

    db.statusFriendship(req.params.id, req.session.userId)
        .then((data) => {
            if (data.rows.length === 0) {
                res.send("Send Friend Request");
            } else {
                if (data.rows[0].accepted) {
                    res.send("Unfriend");
                } else {
                    if (data.rows[0].sender_id === req.session.userId) {
                        res.send("Cancel Friend Request");
                    } else {
                        res.send("Accept Friend Request");
                    }
                }
            }
        })
        .catch((e) => {
            res.sendStatus(400);
        });
});

app.post("/send-friend-request/:id", (req, res) => {
    db.requestFriendship(req.params.id, req.session.userId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.sendStatus(400);
        });
});

app.post("/accept-friend-request/:id", (req, res) => {
    db.acceptFriendship(req.params.id, req.session.userId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.sendStatus(400);
        });
});

app.post("/end-friendship/:id", (req, res) => {
    db.endFriendship(req.params.id, req.session.userId)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((e) => {
            res.sendStatus(400);
        });
});

app.get("/friends-wannabes", async (req, res) => {
    const data = await db.friendsWannabes(req.session.userId);
    data.rows.forEach((row) => delete row.password);
    res.json(data);
});

app.get("/api/coins", async (req, res) => {
    let { data } = await CoinGeckoClient.coins.markets({
        per_page: 20,
        page: 1,
    });
    res.json(data);
});

app.get("/api/coins/global", async (req, res) => {
    let { data } = await CoinGeckoClient.global();
    res.json(data);
});

app.get("/api/coin/:id", async (req, res) => {
    let { data } = await CoinGeckoClient.coins.fetch(req.params.id);
    //console.log(data);
    res.json(data);
});

app.get("/api/coin/history/:id", async (req, res) => {
    let { data } = await CoinGeckoClient.coins.fetchMarketChart(req.params.id);

    res.json(data);
});

app.post("/api/coin/buy/:name", async (req, res) => {
    console.log(
        "Buy Order",
        req.params,
        req.body.price,
        "Amount",
        req.body.amount
    );
    let totalBuyOrder = Math.round(req.body.amount * req.body.price);
    console.log("totalBuyOrder", totalBuyOrder);
    let balance = await db.getBalance(req.session.userId);
    console.log("BALANCE BEFORE BUY ORDER", balance.rows[0].balance);
    if (totalBuyOrder <= 0)
        return res
            .status(400)
            .json("Your order request need to be a positive number");
    if (totalBuyOrder > balance.rows[0].balance)
        return res
            .status(400)
            .json("Your order was too high. Not enough Fiat money");
    try {
        await db.buyCoin(
            req.session.userId,
            req.body.amount,
            req.params.name,
            req.body.price
        );
    } catch (e) {
        return res.status(400).json({ error: "just no" });
    }

    let newBalance = balance.rows[0].balance - totalBuyOrder;
    console.log("NEW BALANCE", newBalance);
    await db.updateBalance(req.session.userId, newBalance);
    let updatedBalance = await db.getBalance(req.session.userId);
    console.log("Updated Balance", updatedBalance.rows[0].balance);
});

app.post("/api/coin/sell/:name", async (req, res) => {
    console.log(
        "SELL ORDER",
        req.params,
        req.body.price,
        "AMOUNT",
        req.body.amount
    );

    const totalSellOrder = Math.round(req.body.amount * req.body.price);
    const checkOrder = await db.checkBuyOrder(
        req.session.userId,
        req.params.name
    );
    console.log("checkOrder.rows[0].sum", checkOrder.rows[0].sum);
    console.log("checkOrder.rows.length", checkOrder.rows.length);

    if (
        checkOrder.rows[0].sum < req.body.amount ||
        checkOrder.rows.length == 0
    ) {
        console.log("IAM IN");
        return res.sendStatus(400);
    }
    try {
        await db.sellCoin(
            req.session.userId,
            -req.body.amount,
            req.params.name,
            req.body.price
        );
    } catch (e) {
        console.log("END UP IN CATCH");
        return res.sendStatus(400);
    }
    let balance = await db.getBalance(req.session.userId);
    console.log(balance.rows[0].balance);
    let newBalance = Math.round(balance.rows[0].balance + totalSellOrder);
    console.log(newBalance);
    await db.updateBalance(req.session.userId, newBalance);
});

app.get("/api/coins/balance/", async (req, res) => {
    try {
        /*if (req.params.id) {
            let { rows } = await db.getCoinsBalance(req.params.id);
            console.log("DATA", rows);
            return res.json(rows);
        }*/
        let { rows } = await db.getCoinsBalance(req.session.userId);
        console.log("DATA", rows);
        res.json(rows);
    } catch (e) {
        console.log(e);
    }
});

app.get("/api/coins/balance/user/:id", async (req, res) => {
    try {
        /*if (req.params.id) {
            let { rows } = await db.getCoinsBalance(req.params.id);
            console.log("DATA", rows);
            return res.json(rows);
        }*/
        let { rows } = await db.getCoinsBalance(req.params.id);
        console.log("DATA", rows);
        res.json(rows);
    } catch (e) {
        console.log(e);
    }
});

app.get("/api/ranking", async (req, res) => {
    try {
        let { rows } = await db.getRanking();
        for (const element of rows) {
            console.log(element.id);
            const { rows } = await db.getCoinsBalance(element.id);
            const buy = await db.getBuyPerformance(element.id);
            console.log(
                "BUY PERFORMANCE DATA",
                buy.rows[0].sum,
                buy.rows[0].count
            );
            let buyPerform = buy.rows[0].sum / buy.rows[0].count;
            const sell = await db.getSellPerformance(element.id);
            console.log(
                "SELL PERFORMANCE DATA",
                sell.rows[0].sum,
                sell.rows[0].count
            );
            let sellPerform = Math.abs(sell.rows[0].sum) / sell.rows[0].count;
            element.performance = 1 - sellPerform / buyPerform;
            element.coinsBalance = rows;
        }

        res.json(rows);
    } catch (e) {
        console.log(e);
    }
});

app.get("/activeUsers", async (req, res) => {
    console.log("ACTIVE USERS", connectedList);

    res.json(connectedList.length);
});

app.get("/api/news", async (req, res) => {
    Api.getTopNews()
        .then(function (articles) {
            return res.json(articles);
        })
        .catch(function (error) {
            console.log(error);
        });
});

app.get("/logout", (req, res) => {
    let arrItem = connectedList.indexOf(req.session.userId);
    delete connectedList[arrItem];
    connectedList = connectedList.filter(function (el) {
        return el != null;
    });
    req.session = null;
    res.redirect(`/login`);
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function () {
    console.log("I'm listening.");
});

io.on("connection", async (socket) => {
    console.log("USER_CONNECTED", socket.id);

    const userId = socket.request.session.userId;
    if (!userId) {
        return socket.disconnect(true);
    }
    if (!connectedList.includes(userId)) connectedList.push(userId);
    console.log("connectedList", connectedList);

    const { rows } = await db.getChatMessages();

    socket.emit("chatMessages", rows.reverse());

    socket.on("chatMessage", async (msg) => {
        let data = await db.addMessage(userId, msg);
        console.log(data.rows[0]);

        io.emit("chatMessage", data.rows[0]);
    });
});
