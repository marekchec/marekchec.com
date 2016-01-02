import * as gulp            from 'gulp';
import * as del             from 'del';
import {join}               from 'path';
import * as browsersync     from 'browser-sync';
import * as runSequence     from 'run-sequence';
import * as config          from './gulpfile.config';

let plugins = require("gulp-load-plugins")();


// -------------------------------------------------------------------
//  Clean tasks
// -------------------------------------------------------------------

gulp.task('clean:dist', function(done) {
    del(config.DEST_DIRECTORY).then(function() {
        done();
    })
});


// -------------------------------------------------------------------
//  Copy tasks
// -------------------------------------------------------------------

gulp.task('copy:templates', function() {
    return gulp.src(join(config.SOURCES_DIRECTORY, '**/*.html'), {base: config.SOURCES_DIRECTORY})
        .pipe(gulp.dest(config.DEST_DIRECTORY));
});

gulp.task('copy:index', function() {
    return gulp.src(join(config.SOURCES_DIRECTORY, 'index.html'))
        .pipe(gulp.dest(config.DEST_DIRECTORY));
});

gulp.task('copy:images', function() {
    return gulp.src(config.IMAGES_DIRECTORY)
        .pipe(gulp.dest(config.DEST_DIRECTORY));
});

gulp.task('copy:fonts', function() {
    return gulp.src(config.FONTS_DIRECTORY)
        .pipe( gulp.dest(config.DEST_DIRECTORY));
});


// -------------------------------------------------------------------
//  Compile scss files
// -------------------------------------------------------------------

gulp.task('scss', function() {
    return gulp.src(join(config.SOURCES_DIRECTORY, '**/*.scss'))
        .pipe(plugins.inject(getOrderedScssReferences(), {
            starttag: '// inject:{{ext}}',
            endtag: '// endinject',
            transform: function(filepath) {
                filepath = filepath.replace('_', '');
                return '@import "' + filepath + '";';
            },
            relative: true
        }))
        .pipe(plugins.sass())
        .pipe(gulp.dest(config.DEST_DIRECTORY))
});


// -------------------------------------------------------------------
//  Compile typescript files
// -------------------------------------------------------------------

gulp.task('typescript', function() {
    var tsProject = plugins.typescript.createProject('tsconfig.json', {
        typescript: require('typescript')
    });

    return gulp.src(join(config.SOURCES_DIRECTORY, '**/*.ts'))
        .pipe(plugins.typescript(tsProject))
        .pipe(gulp.dest(config.DEST_DIRECTORY))
        .pipe(browsersync.reload({stream: true}));
});


// -------------------------------------------------------------------
//  Inject tasks
// -------------------------------------------------------------------

var svgFiles = gulp.src(join(config.SVGS_DIRECTORY, '*.svg'))
    .pipe(plugins.rename({prefix: config.SVG_FILEPREFIX}))
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({inlineSvg: true}));

function svgFileContents(filePath, file) {
    return file.contents.toString();
}

gulp.task('inject:development', function() {
    return gulp.src(join(config.DEST_DIRECTORY, 'index.html'))
        .pipe(plugins.inject(getOrderedShimsReferences(), {name: 'shims'}))
        .pipe(plugins.inject(getOrderedLibReferences(), {name: 'libs'}))
        .pipe(plugins.inject(gulp.src(join(config.DEST_DIRECTORY, '**/*.js')), {name: 'sources'}))
        .pipe(plugins.inject(gulp.src(join(config.DEST_DIRECTORY, 'scripts/templates.js'), {read: false}), {
            name: 'templates',
            relative: true
        }))
        .pipe(plugins.inject(gulp.src(join(config.DEST_DIRECTORY, 'components/app/styles/*.css'), {read: false}), {relative: true}))
        .pipe(plugins.inject(svgFiles, {transform: svgFileContents}))
        .pipe(gulp.dest(config.DEST_DIRECTORY))
        .pipe(browsersync.reload({stream: true}));

});


// -------------------------------------------------------------------
//  Browsersync
// -------------------------------------------------------------------

gulp.task('browsersync', function() {
    browsersync.init( {
        server: {
            baseDir: config.BROWSERSYNC.baseDir
        },
        browser: config.BROWSERSYNC.browser,
        notify: config.BROWSERSYNC.notify
    });

    runSequence(
        'watch:assets',
        'watch:scripts',
        'watch:svgs',
        'watch:styles',
        'watch:templates'
    );
});


// -------------------------------------------------------------------
//  Helper methods
// -------------------------------------------------------------------

function getOrderedLibReferences() {
    return gulp.src(config.LIB_SOURCES, {read: false})
        .pipe(plugins.order(config.LIB_SOURCES, {base: config.ROOT_DIRECTORY}));
}

function getOrderedShimsReferences() {
    return gulp.src(config.SHIMS_SOURCES, {read: false})
        .pipe(plugins.order(config.SHIMS_SOURCES, {base: config.ROOT_DIRECTORY}));
}

function getOrderedScssReferences() {
    return gulp.src(config.SCSS_SOURCES, {read: false})
        .pipe(plugins.order(config.SCSS_SOURCES, {base: config.ROOT_DIRECTORY}));
}


// -------------------------------------------------------------------
//  Watcher
// -------------------------------------------------------------------

gulp.task('watch:assets', function() {
    plugins.watch(config.IMAGES_DIRECTORY, { events: [ 'add', 'unlink' ] }, function() {
        runSequence( 'copy:images' )
    });
});

gulp.task('watch:scripts', function() {
    plugins.watch( join(config.SOURCES_DIRECTORY, '**/*.ts'), function() {
        runSequence( 'typescript' )
    });
});

gulp.task('watch:svgs', function() {
    plugins.watch(config.SVGS_DIRECTORY, { events: [ 'add', 'unlink' ] }, function() {
        runSequence( 'inject:development' )
    });
} );

gulp.task('watch:styles', function() {
    plugins.watch( join(config.SOURCES_DIRECTORY, '**/*.scss'), function() {
        runSequence( 'scss' )
    });
});

gulp.task('watch:templates', function() {
    plugins.watch( join(config.SOURCES_DIRECTORY, '**/*.html'), function() {
        runSequence( 'copy:templates' )
    });
});


// -------------------------------------------------------------------
//  Main tasks
// -------------------------------------------------------------------

gulp.task('default', function(done) {
    runSequence(
        'clean:dist',
        [
            'copy:templates',
            'copy:images',
            'copy:fonts',
            'scss',
            'typescript'
        ],
        'inject:development',
        'browsersync',
        done
    );
});