import * as gulp            from 'gulp';
import * as del             from 'del';
import {join}               from 'path';
import * as browsersync     from 'browser-sync';
import * as runSequence     from 'run-sequence';
import * as config          from './gulpfile.config';
import * as fs              from 'fs';

let plugins = require("gulp-load-plugins")();


// -------------------------------------------------------------------
//  Clean tasks
// -------------------------------------------------------------------

gulp.task('clean:dist', done => {
    del(config.DEST_DIR).then(() => {
        done();
    })
});


// -------------------------------------------------------------------
//  Copy tasks
// -------------------------------------------------------------------

gulp.task('copy:assets', () => {
    return gulp.src(config.ASSETS_SOURCES, {base: config.SOURCES_DIR})
        .pipe(gulp.dest(config.DEST_DIR));
});

// -------------------------------------------------------------------
//  Svg
// -------------------------------------------------------------------

//gulp.task('svg', () => {
//    let destDir     = '/directives/svgIcon';
//    let filename    = 'svgList';
//    var tsFile;
//
//    fs.writeFile(join(destDir, filename, '.ts'), tsFile, function(error) {
//        if(error) {
//            return console.log(error);
//        }
//
//        console.log("The file was saved!");
//    });
//});

gulp.task('svgstore', function () {
    return gulp.src('sources/assets/svgs/*.svg')
        .pipe(plugins.svgmin())
        .pipe(plugins.svgstore())
        .pipe(gulp.dest('test/dest'));
});


// -------------------------------------------------------------------
//  Compile scss files
// -------------------------------------------------------------------

gulp.task('scss', () => {
    function getOrderedScssReferences() {
        return gulp.src(config.SCSS_SOURCES, {read: false})
            .pipe(plugins.order(config.SCSS_SOURCES, {base: config.ROOT_DIR}));
    }

    return gulp.src(join(config.SOURCES_DIR, '**/*.scss'))
        .pipe(plugins.inject(getOrderedScssReferences(), {
            starttag: '// inject:{{ext}}',
            endtag: '// endinject',
            transform: function (filepath) {
                filepath = filepath.replace('_', '');
                return '@import "' + filepath + '";';
            },
            relative: true
        }))
        .pipe(plugins.sass())
        .pipe(gulp.dest(config.DEST_DIR))
});


// -------------------------------------------------------------------
//  Compile typescript files
// -------------------------------------------------------------------

gulp.task('typescript', () => {
    var tsProject = plugins.typescript.createProject('tsconfig.json', {
        typescript: require('typescript'),
        module: 'system'
    });

    return gulp.src(join(config.SOURCES_DIR, '**/*.ts'))
        .pipe(plugins.typescript(tsProject))
        .pipe(gulp.dest(config.DEST_DIR))
        .pipe(browsersync.reload({stream: true}));
});


// -------------------------------------------------------------------
//  Inject tasks
// -------------------------------------------------------------------

gulp.task('inject:libs', () => {
    function getOrderedLibReferences() {
        return gulp.src(config.LIB_SOURCES, {read: false})
            .pipe(plugins.order(config.LIB_SOURCES, {base: config.ROOT_DIR}));
    }

    return gulp.src(join(config.DEST_DIR, 'index.html'))
        .pipe(plugins.inject(getOrderedLibReferences(), {name: 'libs', relative: true}))
        .pipe(gulp.dest(config.DEST_DIR));
});


// -------------------------------------------------------------------
//  Browsersync
// -------------------------------------------------------------------

gulp.task('browsersync', () => {
    browsersync.init({
        server: {
            baseDir: config.BROWSERSYNC.baseDir
        },
        browser: config.BROWSERSYNC.browser,
        notify: config.BROWSERSYNC.notify
    });

    plugins.watch(join(config.SOURCES_DIR, '**/*.ts'), function () {
        runSequence('typescript')
    });

    plugins.watch(join(config.SOURCES_DIR, '**/*.scss'), function () {
        runSequence('scss')
    });

    plugins.watch(config.ASSETS_SOURCES, function () {
        runSequence('copy:assets');
    });

});


// -------------------------------------------------------------------
//  Minify
// -------------------------------------------------------------------

gulp.task('minify:index', () => {
    return gulp.src(join(config.DEST_DIR, 'index.html'))
        .pipe(plugins.usemin({
            js: [plugins.uglify(), plugins.rev()]
        }))
        .pipe(gulp.dest(config.DEST_DIR));
});

gulp.task('minify:js', () => {
    return gulp.src(join(config.DEST_DIR, '**/*.js'), {base: config.DEST_DIR})
        .pipe(plugins.uglify())
        .pipe(gulp.dest(config.DEST_DIR));
});

gulp.task('minify:css', () => {
    return gulp.src(join(config.DEST_DIR, '**/*.css'), {base: config.DEST_DIR})
        .pipe(plugins.cssnano())
        .pipe(gulp.dest(config.DEST_DIR));
});


// -------------------------------------------------------------------
//  Main tasks
// -------------------------------------------------------------------

gulp.task('default', done => {
    runSequence(
        'clean:dist',
        [
            'copy:assets',
            'scss',
            'typescript'
        ],
        'inject:libs',
        'browsersync',
        done
    );
});

gulp.task('production', done => {
    runSequence(
        'clean:dist',
        [
            'copy:assets',
            'scss',
            'typescript'
        ],
        'inject:libs',
        'minify:index',
        'minify:css',
        'minify:js',
        done
    );
});