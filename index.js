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
        res.json(result.rows[0].image);
    } catch (err) {
        console.log("err in POST /upload", err);
    }
});
///------------------adding bio to database------------------
app.post("/bio", async (req, res) => {
    try {
        const result = await db.addBio(req.session.userId, req.body.draftBio);
        res.json(result.rows[0].bio);
    } catch (err) {
        console.log("err in POST /bio", err);
    }
});

//------------------getting other user ------------------
app.get("/user/:id.json", async (req, res) => {
    try {
        if (req.params.id == req.session.userId) {
            throw new Error("same user");
        }
        const result = await db.getUserInfo(req.params.id);
        if (result.rows.length == 0) {
            res.json({
                noUser: true
            });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.log("err in get /user/id", err);
        res.json({
            sameUser: true
        });
    }
});

//------------------getting last 3 users --------------------

app.get("/users.json", async (req, res) => {
    try {
        const result = await db.latestUsers();
        // console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.log("err in GET /users", err);
    }
});

//------------------searching users --------------------

app.get("/search/:val.json", async (req, res) => {
    try {
        const result = await db.searchUser(req.params.val);
        // console.log(result.rows);
        res.json(result.rows);
        // if (result.rows.length == 0) {
        //     throw new Error("no results");
        // }
    } catch (err) {
        console.log("err in GET /users", err);
        res.json({
            noResults: true
        });
    }
});
//------------------ check friendship ------------------------
app.get("/friendship/:othProfId", async (req, res) => {
    try {
        const result = await db.checkFriendship(
            req.session.userId,
            req.params.othProfId
        );
        if (result.rows.length == 0) {
            res.json({ buttonText: "Add friend" });
        } else if (result.rows[0].accepted) {
            res.json({ buttonText: "Unfriend" });
        } else if (result.rows[0].sender_id == req.params.othProfId) {
            res.json({ buttonText: "Accept friend request" });
        } else {
            res.json({ buttonText: "Cancel friend request" });
        }

        // res.json(result.rows[0]);
    } catch (err) {
        console.log("err in GET /frienship", err);
    }
});

//------------------ send friend request ------------------------
app.post("/friendship/:othProfId", async (req, res) => {
    try {
        console.log(req.body.button);
        if (req.body.button == "Add friend") {
            const result = await db.sendFriendRequest(
                req.session.userId,
                req.params.othProfId
            );
            // console.log("accepted", result.rows);
            res.json({ buttonText: "Cancel friend request" });
        } else if (req.body.button == "Accept friend request") {
            const results = await db.acceptFriendRequest(
                req.params.othProfId,
                req.session.userId
            );
            res.json({ buttonText: "Unfriend" });
        } else if (
            req.body.button == "Unfriend" ||
            req.body.button == "Cancel friend request"
        ) {
            const results = await db.deleteFriend(
                req.params.othProfId,
                req.session.userId
            );
            res.json({ buttonText: "Add friend" });
        }
    } catch (err) {
        console.log("err in GET /frienship", err);
    }
});

//---------------- Getting all friends------------------------
app.get("/friends.json", async (req, res) => {
    try {
        const friends = await db.getFriendsList(req.session.userId);
        // console.log("friends", friends);
        res.json(friends.rows);
    } catch (err) {
        console.log("err in GET /friends", err);
    }
});

///-------------- Do not delete this!!! ---------------------
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
