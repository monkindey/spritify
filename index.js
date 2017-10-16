/**
 * @author zhangkaihao
 * @date 2016.10.31
 * @description 图片精灵化
 * 类似webpack.config.js配置
 * 1. entry Array/Object/String 可以单一和多入口
 * 2. output {img, css}
 * 3. spritesheet_info 
 * 参考 https://github.com/twolfson/spritesheet-templates
 */
var fs = require('fs');
var path = require('path');

var Spritesmith = require('spritesmith');
var templater = require('spritesheet-templates');

module.exports = spritify;

function Spritify(config) {
	this.config = config || {};
}

/**
 * options {}
 * single 
 * name
 */
Spritify.prototype.run = function(options) {
	options = options || {};
	var config = this.config;
	var name = options.name;
	var src = options.single ? config.entry : config.entry[name];

	Spritesmith.run({
		src: src
	}, function(err, res) {
		var data = makeTplData(res, Object.assign({
			image: fillName(config.output.publicPath, name)
		}, options));

		data = Object.assign({
			spritesheet_info: Object.assign({}, config.spritesheetInfo)
		}, data);

		data.spritesheet_info.name = fillName(config.spritesheetInfo.name, name);

		var css = templater(data, {
			format: 'less'
		});

		fs.writeFileSync(fillName(config.output.path, name), res.image);
		fs.writeFileSync(fillName(config.output.lessPath, name), css);
	})
}

/**
 *  填充名字
 *  有点像webpack [name]
 */
function fillName(pre, val) {
	return pre.replace(/(\[name\])/, val);
}

function spritify(config) {
	var sp = new Spritify(config);
	var entry = config.entry;
	// { name: path }
	if (typeof entry === 'object' && !Array.isArray(entry)) {
		Object.keys(entry).forEach(function(name) {
			sp.run({
				name: name
			})
		})
	} else {
		sp.run({
			single: true
		});
	}
}

function removePrefix(name) {
	name = name.split('/');
	return name[name.length - 1];
}

function removeSuffix(name) {
	return name.replace(/\..*$/, '');
}

// 下划线_ 变成 驼峰
function underline2Hyphen(name) {
	return name;
	// return name.replace(/_/g, function($1, $2) {
	// 	return '-';
	// })
}

/**
 * /Users/monkindey/360wangguanban/private_cloud_web_code/kits/spritify/examples/src/img/aqvm_on.png
 * ==> aqvm_on
 *
 * 这个应该是可以替换的
 */
function transformName(name, prefix) {
	return underline2Hyphen(removeSuffix(removePrefix(name)));
}

function makeTplData(spriteRes, options) {
	var coords = spriteRes.coordinates;
	var sprites = Object.keys(coords).map(function(name) {
		// name是每一张图片的绝对路径
		return {
			// name: options.name || transformName(name),
			name: transformName(name),
			x: coords[name].x,
			y: coords[name].y,
			width: coords[name].width,
			height: coords[name].height
		}
	});

	var spritesheet = {
		image: options.image,
		width: spriteRes.properties.width,
		height: spriteRes.properties.height
	};

	return {
		spritesheet: spritesheet,
		sprites: sprites
	}
}