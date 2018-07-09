'use strict';

const gulp          = require('gulp');
const watch         = require('gulp-watch');
const babel         = require('gulp-babel');
const browserSync   = require('browser-sync');
const sass          = require('gulp-sass');
const prefixer      = require('gulp-autoprefixer');
const util          = require('gulp-util');
const uglify        = require('gulp-uglify');
const gulpif        = require('gulp-if');
const webpack       = require('webpack-stream');

var production = process.env.NODE_ENV == 'production' || false

var paths = {
	src: { root: 'src' },
	dist: { root: 'dist' },

	init: function() {
		this.src.javascript  = [this.src.root + '/js/**/*.js', '!' + this.src.root];
		this.src.styles      = this.src.root + '/scss/main.scss';
		this.src.pages       = this.src.root + '/pages/*.html';

		this.dist.javascript = this.dist.root + '/js';
		this.dist.css        = this.dist.root + '/css';

		return this;
	}
}.init();

/*
 * Dev server
 */
gulp.task('serve', () => {
	browserSync.init({
		server: paths.dist.root,
		open: false,
		notify: false
	})
});

/*
 * Javascript stuff
 */
 gulp.task('scripts', () => {
 	gulp.src(paths.src.javascript)
        .pipe(webpack({output: { filename: 'patd.js'} }))
 		.pipe(gulpif(production, uglify().on('error', util.log)))
/*        .pipe(babel({
            presets: ['env']
        }))*/
 	    .pipe(gulp.dest(paths.dist.javascript))
		.pipe(browserSync.reload({stream: true}));
 })

 /*
  * Sass / Scss
  */
  gulp.task('styles', () => {
  	var sass_options = {
  		includePaths: ['src/scss']
  	}

  	if (production) {
  		sass_options['outputStyle'] = 'compressed';
  	}

  	gulp.src(paths.src.styles)
  		.pipe(sass(sass_options))
  		.on('error', util.log)
  		.pipe(prefixer('last 3 versions'))
  		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.reload({stream: true}));
  });


/*
 * Static pages
 */
 gulp.task('pages', () => {
 	gulp.src(paths.src.pages)
 		.pipe(gulp.dest(paths.dist.root))
		.pipe(browserSync.reload({stream: true}));
 });

/*
 * File Watchers
 */
gulp.task('watch', () => {
	// Handle our javascript
	gulp.watch(paths.src.javascript, ['scripts']);
	gulp.watch(paths.src.pages, ['pages']);
	gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('build', ['scripts', 'styles', 'pages']);
gulp.task('build:prod', () => {
	production = true;

	gulp.start('build');
})

gulp.task('default', ['watch', 'scripts', 'styles', 'pages', 'serve']);
