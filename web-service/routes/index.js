var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

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
        addTag(tagList[i]);
    }
}

function flushPool() {
    pool = { "tags":[], "song":[] };
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
	console.log(songdb);
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/submit', function(req, res, next) {
	//res.sendFile(path.join(__dirname, "../views/loading.html"));
	console.log("New post " + req.body.url);
	var dir = 'persistance/';
	var command = 'youtube-dl';
	var args =['--add-metadata', '-ic', '-o', dir+'%(id)s.%(ext)s', '-x', '--audio-format', 'mp3', '--get-id', '--geo-bypass', '--write-info-json', req.body.url];
	var spawnSync = require('child_process').spawnSync(command, args);
	if(spawnSync.status == 1) res.sendFile(path.join(__dirname, "../views/error.html"));
	else {
		var id = spawnSync.stdout.toString('utf8');
		id = id.substring(0, id.length-1);
		var _path = dir + id + '.info.json';
		var args = ['--add-metadata', '-ic', '-o', dir+'%(id)s.%(ext)s', '-x', '--audio-format', 'mp3', '--geo-bypass', '--write-info-json', req.body.url];
		var spawnSync = require('child_process').spawnSync(command, args);
		var info = JSON.parse(fs.readFileSync(_path,'utf8'));
		songdb.push({"id":id,"title":info.title,"track":info.track,"artist":info.artist,"tags":info.tags,"path": dir+id+".mp3"});
		//console.log(songdb);

		res.sendFile(path.join(__dirname, "../views/index.html"));
	}
});

router.get('/viewer', function(req, res, next) {
	res.render('viewer.html');
});
module.exports = router;
