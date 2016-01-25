import * as gulp            from 'gulp';
import * as del             from 'del';
import {join}               from 'path';
import * as browsersync     from 'browser-sync';
import * as runSequence     from 'run-sequence';
import * as config          from './gulpfile.config';
import * as fs              from 'fs';

let plugins = require("gulp-load-plugins")();


// -----------------------------------------
//  Task: clean
// -----------------------------------------

gulp.task('clean:dist', done => {
    del(config.DEST_DIR).then(() => {
        done();
    })
});


// -----------------------------------------
//  Task: copy
// -----------------------------------------

gulp.task('copy:assets', () => {
    return gulp.src(config.ASSETS_SOURCES, {base: config.SOURCES_DIR})
        .pipe(gulp.dest(config.DEST_DIR));
});


// -----------------------------------------
//  Task: svg
// -----------------------------------------

gulp.task('svgstore', done => {
    var svgs = gulp.src(join(config.SOURCES_DIR, 'assets/svgs/*.svg'))
        .pipe(plugins.svgmin())
        .pipe(plugins.svgstore({ inlineSvg: true }));

    function fileContents (filePath, file) {
        return file.contents.toString();
    }

    plugins.file('svgs.html', '<!-- icons:svg --><!-- endinject -->')
        .pipe(plugins.inject(svgs, { name: 'icons', transform: fileContents, removeTags: true }))
        .pipe(gulp.dest(join(config.DEST_DIR, 'assets/icons')));

    done();
});


// -----------------------------------------
//  Task: compile scss
// -----------------------------------------

gulp.task('compile:scss', () => {
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

gulp.task('compile:typescript', () => {
    var tsProject = plugins.typescript.createProject('tsconfig.json', {
        typescript: require('typescript'),
        module: 'system'
    });

    return gulp.src(join(config.SOURCES_DIR, '**/*.ts'))
        .pipe(plugins.typescript(tsProject))
        .pipe(gulp.dest(config.DEST_DIR))
        .pipe(browsersync.reload({stream: true}));
});


// -----------------------------------------
//  Task: inject
// -----------------------------------------

gulp.task('inject', () => {
    function getOrderedLibReferences() {
        return gulp.src(config.LIB_SOURCES, {read: false})
            .pipe(plugins.order(config.LIB_SOURCES, {base: config.ROOT_DIR}));
    }

    gulp.src(join(config.DEST_DIR, 'index.html'))
        .pipe(plugins.inject(getOrderedLibReferences(), {name: 'libs', relative: true}))
        .pipe(gulp.dest(config.DEST_DIR));
});


// -----------------------------------------
//  Task: browsersync
// -----------------------------------------

gulp.task('browsersync', () => {
    browsersync.init({
        server: {
            baseDir: config.BROWSERSYNC.baseDir
        },
        browser: config.BROWSERSYNC.browser,
        notify: config.BROWSERSYNC.notify
    });

    plugins.watch(join(config.SOURCES_DIR, '**/*.ts'), function () {
        runSequence('compile:typescript')
    });

    plugins.watch(join(config.SOURCES_DIR, '**/*.scss'), function () {
        runSequence('compile:scss')
    });

    plugins.watch(config.ASSETS_SOURCES, function () {
        runSequence('copy:assets');
    });

});


// -----------------------------------------
//  Task: minify
// -----------------------------------------

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


// -----------------------------------------
//  Main tasks
// -----------------------------------------

gulp.task('default', done => {
    runSequence(
        'clean:dist',
        [
            'copy:assets',
            'compile:scss',
            'compile:typescript'
        ],
        'inject',
        'svgstore',
        'browsersync',
        done
    );
});

gulp.task('production', done => {
    runSequence(
        'clean:dist',
        [
            'copy:assets',
            'compile:scss',
            'compile:typescript'
        ],
        'inject',
        'svgstore',
        'minify:index',
        'minify:css',
        'minify:js',
        done
    );
});