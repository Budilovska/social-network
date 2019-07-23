const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bc = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
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

app.get("*", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// app.get("*", function(req, res) {
//     if (!req.session.userId) {
//         res.redirect("/welcome");
//     } else {
//         res.sendFile(__dirname + "/index.html");
//     }
// });

app.post("/welcome", function(req, res) {
    bc.hashPassword(req.body.password)
        .then(hashPass => {
            console.log("HASH IS:", hashPass);
            return db
                .newUser(
                    req.body.first,
                    req.body.last,
                    req.body.email,
                    hashPass
                )
                .then(result => {
                    console.log("You have a new user");
                    console.log("result", result);
                    req.session.userId = result.rows[0].id;
                    res.json({ success: true });
                });
        })
        .catch(err => {
            console.log("error in welcome POST:", err);
        });
});

app.listen(8080, function() {
    console.log("I'm listening.");
});

//location.href = is the classic way to relocate in the browser
//
