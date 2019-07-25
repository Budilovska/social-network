const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bc = require("./utils/bc");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

//------------------------has to be above the routes, handles file uploads
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");

//-------- multer saves the file to uploads directory -------//

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

//---multer saves the file to uploads directory ----//
//filename function tells multer to use as the file name the unique id generated by the call to uidSafe with the extension of the original file name appended to it//

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//----------------------------------------------
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

app.get("/user", async (req, res) => {
    try {
        const result = await db.getUserInfo(req.session.userId);
        res.json(result.rows[0]);
    } catch (err) {
        console.log("err in GET /user", err);
    }
});

//--------------------------------------------------------
//single indicates that we are only expecting one file. The string passed to single is the name of the field in the request.

app.post("/upload", uploader.single("file"), s3.upload, async (req, res) => {
    // console.log("req.file: ", req.file);
    const url = config.s3Url + req.file.filename;
    try {
        const result = await db.insertImage(url, req.session.userId);
        console.log("INSERT IMG:", result.rows[0].image);
        res.json(result.rows[0].image);
    } catch (err) {
        console.log("err in POST /upload", err);
    }
});

//-------------- Do not delete this!!! ----------------------------
//this route has to be after all get routes.
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

app.listen(8080, function() {
    console.log("I'm listening.");
});

//location.href = is the classic way to relocate in the browser
//
