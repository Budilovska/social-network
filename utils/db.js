var spicedPg = require("spiced-pg");
var db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg("postgres:postgres:postgres@localhost:5432/socialnetwork");
}

exports.newUser = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getPassword = function(email) {
    return db.query("SELECT password, id FROM users WHERE users.email=$1", [
        email
    ]);
};

exports.getUserInfo = function(id) {
    return db.query(
        "SELECT first, last, image, bio FROM users WHERE users.id=$1",
        [id]
    );
};

exports.insertImage = function(url, id) {
    return db.query(
        "UPDATE users SET image=$1 WHERE users.id=$2 RETURNING image",
        [url, id]
    );
};

exports.addBio = function(id, bio) {
    return db.query("UPDATE users SET bio=$2 WHERE users.id=$1 RETURNING bio", [
        id,
        bio
    ]);
};
