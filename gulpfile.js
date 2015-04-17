var gulp = require('gulp'),
	rimraf = require('gulp-rimraf'),
	shell = require('gulp-shell'),
	rename = require("gulp-rename"),
	uglify = require('gulp-uglifyjs'),
	wrap = require("gulp-wrap"),
	fs = require('fs');

/**** FILE SETUP **/
gulp.task('mkdir', function(){
	if (!fs.existsSync(__dirname + '/dist')){
		fs.mkdirSync(__dirname + '/dist', 0777);
	}
});

gulp.task('mimetype', function(done){
	var mimetypes = require('./node_modules/mime-db/db.json');
	var stream = fs.createWriteStream("./lib/mimetype.js");
	stream.once('open', function(fd) {
	  stream.write('(function(exports){\n exports.mimetype = {\n');
	  first = true;
	  for(var type in mimetypes){
	  	if ((mimetypes[type].extensions)){
	  		for(var i = 0; i < mimetypes[type].extensions.length; i++){
	  			if (!first) stream.write(',\n');
	  			stream.write('\t"'+ mimetypes[type].extensions[i] +'": "'+type+'"');
	  		}
		  	if (first) first = false;
		}
	  }
	  stream.write('}\n})(this);');
	  stream.end();
	  done();
	});
});

gulp.task('clean', function(){
	return gulp.src([
		'./dist',
	], {read: false}).pipe(rimraf());
});

gulp.task('build:target', ['clean', 'mkdir'], function(){
	return gulp.src(['./src/Filedrive.js', './lib/mimetype.js', './src/directives/*.js','./src/services/*.js'])
    .pipe(uglify('angular-filedrive.js', {
      mangle: false,
      compress: {
      	sequences: false
      },
      output: {
        beautify: true
      }
    }))
    .pipe(wrap('(function(angular, filesize){\n<%= contents %>\n})(angular, typeof global !== "undefined" ? global.filesize : window.filesize);'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build:target'], function(){
	return gulp.src('./dist/angular-filedrive.js')
		.pipe(uglify('angular-filedrive.min.js'))
    	.pipe(gulp.dest('./dist'));
});

/*** FOR TESTS ******/
//gulp.task('test', shell.task(['phpunit']));