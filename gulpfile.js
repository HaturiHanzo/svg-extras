var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    karma = require('karma'),
    path = require('path'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    concat = require('gulp-concat'),
    sequence = require('run-sequence').use(gulp),
    env = process.env.NODE_ENV || 'development',
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
 * Concatenates all js files and minifies them in a production environment
 */
gulp.task('build.js', function (callback) {
    var stream = gulp.src(['svg-extras.js',
            'svg-element.js',
            'svg-block.js',
            'svg-draggable.js',
            'svg-container.js',
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
        })),
        name = 'svg-extras.js';

    if (env === 'production') {
        stream.pipe(uglify({mangle: true}));
        name = 'svg-extras.min.js';
    }

    stream.pipe(concat(name))
        .pipe(gulp.dest('./dist'));

    stream.on('error', function (err) {
        console.error(err);
        callback();
    });

    stream.on('finish', function () {
        callback();
    });
});

/**
 * Concatenates all css files and minifies them in a production environment
 */
gulp.task('build.css', function (callback) {
    var stream = gulp.src('./src/**/*.css'),
        name = 'svg-extras.css';

    if (env === 'production') {
        stream.pipe(cssmin());
        name = 'svg-extras.min.css';
    }
    stream.pipe(concat(name))
        .pipe(gulp.dest('./dist'));

    stream.on('error', function (err) {
        console.error(err);
        callback();
    });

    stream.on('finish', function () {
        callback();
    });
});

/**
 * Builds js and css files
 */
gulp.task('build', function (callback) {
    return sequence(['build.js', 'build.css'], callback);
});

gulp.task('serve', false, function (callback) {
    connect()
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
