const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bc = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
// app.use(require('cookie-session') {
//     secret: process.env.SESSION_SECRET,
//     maxAge: 1000 *
// })

app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(compression());

app.use(
    cookieSession({
        secret: `I'm always hungry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14 //in two weeks cookie will be deleted
    })
);

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//-------------- Do not delete this!!! ----------------------------
// app.get("*", function(req, res) {
//     res.sendFile(__dirname + "/index.html");
// });
//-----------------------------------------------------------------
//
// app.get("*", function(req, res) {
//     if (!req.session.userId && req.url != "/welcome") {
//         res.redirect("/welcome");
//     } else {
//         res.sendFile(__dirname + "/index.html");
//     }
// });
//-----------------------------------------------------------------
app.get("*", function(req, res) {
    if (!req.session.userId && req.url != "/welcome") {
        res.redirect("/welcome");
    } else if (req.session.userId && req.url == "/welcome") {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//-----------------------------------------------------------------
app.post("/welcome", async (req, res) => {
    const { first, last, email, password } = req.body;
    try {
        let hash = await bc.hashPassword(password);
        let result = await db.newUser(first, last, email, hash);
        req.session.userId = result.rows[0].id;
        res.json({ success: true });
    } catch (err) {
        console.log("err in POST /welcome", err);
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let result = await db.getPassword(email);
        // console.log("result is:", result.rows.length);
        if (result.rows.length == 0) {
            throw new Error("email is not registered");
        }
        let didMatch = await bc.checkPassword(
            password,
            result.rows[0].password
        );
        // console.log("didMatch", didMatch);
        req.session.userId = result.rows[0].id;
        res.json({ didMatch });
    } catch (err) {
        console.log("err in POST /login", err);
        res.json({ didMatch: false });
    }
});

// app.post("/login", function(req, res) {
//     db.getPassword(req.body.email).then(result => {
//         console.log("result is:", result.rows.length);
//         req.session.userId = result.rows[0].id;
//         return bc
//             .checkPassword(req.body.password, result.rows[0].password)
//             .then(info => {
//                 console.log("INFO:", info);
//                 res.json({ info });
//             })
//             .catch(err => {
//                 console.log("error in login POST:", err);
//             });
//     });
// });

app.listen(8080, function() {
    console.log("I'm listening.");
});

//location.href = is the classic way to relocate in the browser
//
