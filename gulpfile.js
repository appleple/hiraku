var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
require('es6-promise').polyfill(); //if node version is lower than v.0.1.2
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');

gulp.task('sass',function(){
	gulp.src(['scss/**/*.scss'])
		.pipe(sass().on('error', sass.logError))
		.pipe(autoPrefixer({
			browsers: ['last 2 versions', 'ie 9']
		}))
		.pipe(cssComb())
		.pipe(cmq({
			log: true
		}))
		.pipe(gulp.dest('src/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('src/'))
});

gulp.task('js',function(){
	gulp.src(['src/hiraku.js'])
		.pipe(plumber({
			errorHandler: function (err) {
				console.log(err);
				this.emit('end');
			}
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(gulp.dest('src'))
});



gulp.task('default',function(){
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('src/hiraku.js', ['js']);
});
