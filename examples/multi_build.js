var spritify = require('../index.js');
var path = require('path');
var fs = require('fs');

var imgOnFolderPath = path.resolve(__dirname, './src/imgs/on');
var onImages = getFolderAllPng(imgOnFolderPath);
var imgOffFolderPath = path.resolve(__dirname, './src/imgs/off');
var offImages = getFolderAllPng(imgOffFolderPath);

function getFolderAllPng(imgFolderPath) {
	return fs.readdirSync(imgFolderPath).map(function(img) {
		return path.resolve(imgFolderPath, img);
	}).filter(function(img) {
		return /.png$/.test(img)
	});
}

spritify({
	entry: {
		on: onImages,
		off: offImages
	},
	output: {
		path: path.resolve(__dirname, './dist/', '[name]_sprite.png'),
		lessPath: path.resolve(__dirname, './dist/', '[name]_sprite.less'),
		// 相对路径, 为了给生成的Less用的 这个有点乱
		publicPath: './[name]_sprite.png'
	},
	spritesheetInfo: {
		name: '[name]'
	}
});