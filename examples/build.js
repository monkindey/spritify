var spritify = require('../index.js');
var path = require('path');
var fs = require('fs');

var imgFolderPath = path.resolve(__dirname, './src/img/');
var images = getFolderAllPng(imgFolderPath);

function getFolderAllPng(imgFolderPath) {
	return fs.readdirSync(imgFolderPath).map(function(img) {
		return path.resolve(imgFolderPath, img);
	}).filter(function(img) {
		return /.png$/.test(img)
	});
}

spritify({
	entry: images,
	output: {
		path: path.resolve(__dirname, './dist/', 'engine_on_sprite.png'),
		lessPath: path.resolve(__dirname, './dist/', 'engine_on_sprite.less'),
		// 相对路径, 为了给生成的Less用的 这个有点乱
		publicPath: './engine_on_sprite.png'
	},
	spritesheetInfo: {
		name: 'engine-on'
	}
});