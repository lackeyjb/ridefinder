var gulp      = require('gulp');
var sass      = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename    = require('gulp-rename');
var jshint    = require('gulp-jshint');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var nodemon   = require('gulp-nodemon');

gulp.task('sass', function() {
  gulp.src('client/assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('client/assets/css'));
});

gulp.task('js', function() {
  gulp.src(['server.js', 'app_api/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('angular', function() {
  gulp.src(['client/*.js', 'client/scripts/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('client/dist'));
});

gulp.task('watch', function() {
  gulp.watch('client/assets/scss/*.scss', ['sass']);
  gulp.watch(['server.js', 'app_api/**/*.js', 'client/*.js', 'client/scripts/**/*.js'], ['js', 'angular']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js scss html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

gulp.task('deploy', ['sass', 'angular']);

gulp.task('default', ['nodemon']);




