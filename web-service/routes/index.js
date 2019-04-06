var express = require('express');
var router = express.Router();
var path = require('path')

function addTag(tag) {
    var i;
    var exists = false;
    for (i = 0; i < pool.tag.lenght; i++) {
        if (pool.tag[i] == tag) {
            exists = true;
        }
    }
    if (exists) {
        this.pool.tags.push(tag);
    }
}

function addTagList(tagList) {
    var i;
    for (i = 0; i < tagList.length; i++) {
        addTag(tagList[i];
    }
}

function flushPool() {
    pool = { "tags"=[], "song"=[] };
}

function fetchSong() {
    var i = Math.floor(Math.random() * pool.song.length);
    return songdb[pool.song[i]];
}

function play() {
    if (player == null) {
        player = new Player(fetchSong().path);
        player.play((err, player) => {
            console.log('playend!');
        });
    } else if (state != playing) {
        player.pause();
    }
}

function pause() {
    if (state != pause) {
        player.pause();
    }
}

function stop() {
    player.stop();
    delete player;
}

function next() {
    player.next();
}

function next() {
    player.add(fetchSong().path);
    player.next();
}

player.on('playend',(item) => {
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, "../views/index.html"));

});

router.post('/submit', function(req, res, next) {
    console.log("New post " + req.body.url);
    res.sendFile(path.join(__dirname, "../views/index.html"));

});

router.get('/viewer', function(req, res, next) {
    res.render('viewer.html');
});
module.exports = router;
