var gulp            = require('gulp');
var sass            = require('gulp-sass');
var minifyCss       = require('gulp-minify-css');
var rename          = require('gulp-rename');
var jshint          = require('gulp-jshint');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var mainBowerFiles  = require('main-bower-files');
var inject          = require('gulp-inject');
var nodemon         = require('gulp-nodemon');

var paths = {
  scss         : 'client/assets/scss/*.scss',
  css          : 'client/assets/css',
  server       : 'server.js',
  api          : 'app_api/**/*.js',
  client       : 'client/',
  clientMain   : 'client/*.js',
  clientScripts: 'client/scripts/**/*.js',
  angularMin   : 'all.min.js',
  dist         : 'client/dist',
  vendors      : 'bower_components/',
  index        : 'client/index.html'
};

gulp.task('sass', function() {
  gulp.src(paths.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css));
});

gulp.task('js', function() {
  gulp.src([paths.server, paths.api])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('angular', function() {
  gulp.src([paths.clientMain, paths.clientScripts])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat(paths.clientMain))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('vendors', function() {
  var index   = gulp.src(paths.index);
  var vendors = gulp.src(mainBowerFiles());

  index
    .pipe(inject(vendors, {name: 'vendorinject'}))
    .pipe(gulp.dest(paths.client));
});

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.vendors, ['vendors']);
  gulp.watch([paths.server, paths.api, paths.clientMain, paths.clientScripts], ['js', 'angular']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: paths.server,
    ext: 'js scss html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

gulp.task('default', ['nodemon']);




