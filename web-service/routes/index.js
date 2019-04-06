var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

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
