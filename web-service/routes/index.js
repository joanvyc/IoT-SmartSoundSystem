var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


//
// 1 chill
// 2 normie
// 3 rave
// 4 apagat
//

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

function setTagList(tagList) {
    var i, j, k;
    pool = { "tags": [], "song": [] };
    for (i = 0; i < tagList.length; i++) {
        addTag(tagList[i]);
    }
    add_tag:
    for (j = 0; j < songdb.length; i++) {
        for (i = 0; i < tagList.length; i++) {
            for (k = 0; k < songdb[j].tags.length; k++) {
                if (tagList[i] == songdb[j].tags[k]) {
                    pool.song.push(j);
                    break add_tag;
                }
            }
        }
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
	var ret = songdb[pool.song[i]];
	return ret;
}

function play() {
	if (state == "empty") {
		state = "playing";
		player.add(fetchSong().path);
		player.play((err, player) => {
			next_song();
		});
	} else if (state != "playing") {
		player.pause();
		state = "playing";
	}
}

function pause() {
	if (state != "pause") {
		player.pause();
		state = "pause";
	}
}

function stop() {
	player.stop();
	player.list = [];
	state = "empty";
}

function next_song() {
	state="playing";
	var song = fetchSong();
	player.add(song.path);
	player.next();
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/submit', function(req, res, next) {
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
		var song = {"id":id,"title":info.title,"track":info.track,"artist":info.artist,"tags":info.tags,"path": dir+id+".mp3"}
		songdb.push(song);

		var jsoncontent = JSON.stringify(songdb);

		var stream = fs.createWriteStream(path.join(__dirname, "../persistance/songdb.json"), {flags:'w'});
		stream.write(jsoncontent);
		stream.end();
		stream.on('close', function() {

			// join tool
			if (pool.tags === undefined || pool.tags.length == 0) {
				pool.song.push(songdb.length-1);
			} else {
				var i, j;
				check_tags:
				for (i = 0;!match && i < pool.tags.length; i++) {
					for (j = 0; !match && j < song.tags.length; j++) {
						if (song.tags[j] == pool.tags[i]) {
							pool.song.push(songdb.length-1);
							break check_tags;
						}
					}
				}
			}
			//console.log(songdb);

			res.sendFile(path.join(__dirname, "../views/index.html"));
		});
	}
});

router.get('/viewer', (req, res, next) => {
	res.render('viewer.html');
});

router.post('/play', (req, res, next) => {
	play();
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/pause', (req, res, next) =>{
	pause();
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/stop', (req, res, next) => {
	stop();
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/next', (req, res, next) => {
	next_song();
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

mode = "4";

function set_hardcore_mode() {
    setTagList(["electronic", "house", "dub step", "electro", "edm", "bass", "metal"]);
    mode = "3";
}

function set_chill_mode() {
    console.log(songdb);
//    setTagList([]);
    mode = "1";
}

function set_normie_mode() {
    setTagList([]);
    mode = "2";
}

router.post('/hardcore', (req, res, next) => {
    set_hardcore_mode();
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/chill', (req, res, next) => {
    set_chill_mode();
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/normie', (req, res, next) => {
    set_normie_mode();
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.post('/custom', (req, res, next) => {

	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get('/songlist', (req, res, next) => {
	console.log(songdb);
	var i;
	var command = 'cp';
	var args =[path.join(__dirname, "../views/aux.html"), path.join(__dirname, "../views/template.html")];
	var spawnSync = require('child_process').spawnSync(command, args);
console.log(spawnSync.stderr.toString('utf8'));
	var stream = fs.createWriteStream(path.join(__dirname, "../views/template.html"), {flags:'a'});
	for(i = 0; i < songdb.length; i++){
		var nom = songdb[i].track;
		if(nom == null) nom = songdb[i].title;
		else nom = nom + " - " + songdb[i].artist;
		console.log(nom);
		stream.write("<tr>\n<td>" + "\n");
		stream.write("<form method=\"post\" action=\"/remove\">" + "\n");
		stream.write("<p style=\"display: flex; float: left; margin-right: 10px;\"> "+ nom + " </p>\n");
		stream.write("<p hidden name=\"todelete\" value=\" " + songdb.id + " \"></p>");
		stream.write("<input style=\"display: flex; justify-content: center; padding-block: 5px;\" type=\"submit\" value=\"Delete song\">");
		stream.write("</form>\n</td>\n</tr>" + "\n");
	}
	stream.write("</table>\n<footer style=\"position: fixed; bottom: 0\">" + "\n");
	stream.write("Better than spotify©" + "\n");
	stream.write("</footer>\n</body>\n</html>" + "\n");

	stream.end();
	stream.on('close', function() {
		res.sendFile(path.join(__dirname, "../views/template.html"));
	});

});

router.get('/state', (req, res, next) => {
    res.send(mode);
});
module.exports = router;
