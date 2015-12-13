import * as gulp from 'gulp';
import {join} from 'path';
import * as del from 'del';
import * as browsersync from 'browser-sync';
import * as config from './gulpfile.config';
import * as runSequence from 'run-sequence';

let gulpLoadPlugins = require("gulp-load-plugins");

const plugins = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// -------------------------------------------------------------------
//  Clean tasks
// -------------------------------------------------------------------

gulp.task('clean:dist', done => {
    del(join(config.DEST_DIR)).then(() => done());
});


// -------------------------------------------------------------------
//  Copy tasks
// -------------------------------------------------------------------

gulp.task('copy:index', () => {
    return gulp.src(join(config.SOURCES_DIR, 'index.html'))
        .pipe(gulp.dest(config.DEST_DIR));
});

//gulp.task( 'copy:images', function() {
//    return gulp.src( paths.images.sources )
//        .pipe( gulp.dest( paths.images.dist ) );
//});

//gulp.task( 'copy:fonts', function() {
//    return gulp.src( paths.fonts.sources )
//        .pipe( gulp.dest( paths.fonts.dist ) )
//});


// -------------------------------------------------------------------
//  Compile scss files
// -------------------------------------------------------------------

gulp.task('scss', () => {
    return gulp.src(join(config.SOURCES_DIR, '**/*.scss'))
        .pipe(plugins.sass())
        .pipe(gulp.dest(config.DEST_DIR))
});


// -------------------------------------------------------------------
//  Compile typescript files
// -------------------------------------------------------------------

gulp.task('typescript', () => {
    var tsProject = plugins.typescript.createProject('tsconfig.json', {
        typescript: require('typescript')
    });

    return gulp.src(join(config.SOURCES_DIR, '**/*.ts'))
        .pipe(plugins.typescript(tsProject))
        .pipe(gulp.dest(config.DEST_DIR))
});


// -------------------------------------------------------------------
//  Browsersync
// -------------------------------------------------------------------

gulp.task('browsersync', () => {
    browsersync.init( {
        server: {
            baseDir: [config.DEST_DIR, config.ROOT_DIR],
            open: config.BROWSERSYNC.browser ? true : false
        },
        browser: config.BROWSERSYNC.browser,
        notify: config.BROWSERSYNC.notify
    });
});


// -------------------------------------------------------------------
//  Main tasks
// -------------------------------------------------------------------

gulp.task('default', done => {
    runSequence(
        'clean:dist',
        'copy:index',
        'scss',
        'browsersync',
        done
    );
});