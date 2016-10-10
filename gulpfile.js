var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    karma = require('karma'),
    path = require('path'),
    rename = require('gulp-rename');

gulp.task('test', function (callback) {
    new karma.Server({
        configFile: path.join(__dirname, 'karma.config.js')
    }, function () {
        callback();
    }).start();
});

gulp.task('build', function (callback) {

    // TODO build all as one file
    var stream = gulp.src(['./src/**/*.js', '!./src/**/*.spec.js'])
        .pipe(uglify({mangle: true}))
        .pipe(rename('svg-extras.min.js'))
        .pipe(gulp.dest('./dist'));

    stream.on('error', function (err) {
        console.error(err);
        callback();
    });

    stream.on('finish', function () {
        callback();
    });
});
