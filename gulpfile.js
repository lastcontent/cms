'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var ngAnnotate = require('gulp-ng-annotate');

// Start dev server

gulp.task('server', function() {
    connect.server({
    port: 8008,
    root: ['material/dist/modules/js', 'dist'],
    livereload: {
      port: 33333
    },
    fallback: 'dist/index.html'
  });
});

gulp.task('js', function(){
  return gulp.src('./app/**/*.js')
    //.pipe(babel({
      //  compact: false,
     //   presets: [['es2015', {modules: false}]],
        //plugins: ['extensible-destructuring'],
      //  comments: false
   // }))
    .pipe(ngAnnotate().on('error', console.error.bind(console)))
    //.pipe(uglify({
      //preserveComments: 'license'
    //}).on('error', console.error.bind(console)))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('pug', function(){
	return gulp.src(['./pug/**/*.pug', './app/**/*.pug'])
		.pipe(pug())
		.pipe(gulp.dest('dist'))
		.pipe(connect.reload());
});

gulp.task('img', function(){
  return gulp.src(['./app/**/*.png', './app/**/*.jpg'])
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['pug/**/*.pug', 'app/**/*.pug'], ['pug']);
  gulp.watch('sass/**/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['js'])
});

gulp.task('default', [
	'pug',
  'js',
	'sass',
  'img',
	'server',
	'watch'
]);