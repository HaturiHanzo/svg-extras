var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    karma = require('karma'),
    path = require('path'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    concat = require('gulp-concat'),
    sequence = require('run-sequence').use(gulp),
    DEFAULT_PORT = 3000;

/**
 * Runs unit tests using karma & jasmine in a headless browser PhantomJS
 */
gulp.task('test', function (callback) {
    new karma.Server({
        configFile: path.join(__dirname, 'karma.config.js')
    }, function () {
        callback();
    }).start();
});

/**
 * Concatenates all js files
 */
gulp.task('build.js', function (callback) {
    var stream = getSrc()
        .pipe(concat('svg-extras.js'))
        .pipe(gulp.dest('./dist'));

    streamHandler(stream, callback);
});

/**
 * Concatenates all js files and minifies them
 */
gulp.task('build.min.js', function (callback) {
    var stream = gulp.src('./dist/svg-extras.js')
        .pipe(uglify({mangle: true}))
        .pipe(concat('svg-extras.min.js'))
        .pipe(gulp.dest('./dist'));

    streamHandler(stream, callback);
});

/**
 * Concatenates vendor libs with the build file
 */
gulp.task('build.full.min.js', function (callback) {
    var stream = gulp.src([
            './bower_components/eventemitter3/index.js',
            './bower_components/inherit/lib/inherit.js',
            './dist/svg-extras.min.js'
        ])
        .pipe(uglify({mangle: true}))
        .pipe(concat('svg-extras.full.min.js'))
        .pipe(gulp.dest('./dist'));

    streamHandler(stream, callback);
});

/**
 * Concatenates all css files
 */
gulp.task('build.css', function (callback) {
    var stream = gulp.src('./src/**/*.css')
        .pipe(concat('svg-extras.css'))
        .pipe(gulp.dest('./dist'));

    streamHandler(stream, callback);
});

/**
 * Concatenates all css files and minifies them
 */
gulp.task('build.min.css', function (callback) {
    var stream = gulp.src('./dist/svg-extras.css')
        .pipe(cssmin())
        .pipe(concat('svg-extras.min.css'))
        .pipe(gulp.dest('./dist'));

    streamHandler(stream, callback);
});

/**
 * Builds js and css files
 */
gulp.task('build', function (callback) {
    return sequence(
        ['build.js', 'build.css'],
        ['build.min.js', 'build.min.css'],
        'build.full.min.js',
        callback);
});

gulp.task('serve', false, function (callback) {
    connect()
        // Decided to use two path's, not to break project structure for examples
        .use(serveStatic(path.join(__dirname, 'examples')))
        .use(serveStatic(path.join(__dirname)))
        .listen(DEFAULT_PORT, callback);
});

/**
 * Builds all files and starts watcher
 */
gulp.task('default',  function (callback) {
    /**
     * Default task callback
     */
    function defaultTaskCallback() {
        gulp.watch(['./src/**/*.js', '!./src/**/*.spec.js'], ['build.js']);
        gulp.watch('./src/**/*.css', ['build.css']);
        callback();
        console.log('App started on : http://127.0.0.1:' + DEFAULT_PORT);
    }
    sequence('build', 'serve', defaultTaskCallback);
});

/**
 * Module js source files getter
 *
 * @returns {Stream}
 */
function getSrc() {
    return gulp.src(['svg-extras.js',
        'svg-element.js',
        'svg-block.js',
        'svg-draggable.js',
        'svg-container.js',
        'svg-control.js',
        'svg-rect.js',
        'cartesian-geometry-math/cartesian-geometry-math.js',
        'polygon/svg-polygon-vertex.js',
        'polygon/svg-polygon.js',
        'resizable-rect/svg-rect-control.js',
        'resizable-rect/svg-resizable-rect.js',
        'bordered-rect/svg-border.js',
        'bordered-rect/svg-border-control.js',
        'bordered-rect/svg-bordered-rect.js'
    ].map(function (elem) {
        return './src/' + elem;
    }));
}

/**
 * Adds universal listeners to the stream
 *
 * @param {Stream} stream
 * @param {Function} callback
 */
function streamHandler(stream, callback) {
    stream.on('error', function (err) {
        console.error(err);
        callback();
    });

    stream.on('finish', function () {
        callback();
    });
}
