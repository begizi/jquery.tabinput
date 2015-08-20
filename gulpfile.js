var gulp = require('gulp'),
    rs = require('run-sequence'),
    argv = require('yargs').argv,
    header = require('gulp-header'),
    bump = require('gulp-bump'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify');


var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('header-css', function() {
  return gulp.src('src/*.css')
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('header-js', function() {
  return gulp.src('src/*.js')
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('header', ['header-js', 'header-css']);

gulp.task('bump', function() {
  var version = argv.version;
  var type = argv.type || "Major";
  var bumpTo = {};

  if (version !== undefined) {
    bumpTo.version = version;
  } else {
    bumpTo.type = type;
  }

  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump(bumpTo))
    .pipe(gulp.dest('./'));

});

gulp.task('clean', function() {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('js', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src(["src/*.css"])
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('lint', function() {
  return gulp.src(['src/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    return gulp.watch(['./src/*.js', './src/*.css'], ['lint']);
});

gulp.task('default', function() {
    return gulp.start('lint', 'release');
});

gulp.task('release', function(cb) {
  return rs('clean', 'bump', 'header', ['css', 'js'], cb);
});
