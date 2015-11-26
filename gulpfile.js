var del                 = require( 'del' );
var fs                  = require( 'fs' );
var gulp                = require( 'gulp' );
var gulpLoadPlugins     = require( 'gulp-load-plugins' );
var path                = require( 'path' );
var browserSync         = require( 'browser-sync' ).create();
var runSequence         = require( 'run-sequence' );
var plugins             = gulpLoadPlugins( {
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var gulpConfig                  = require( './gulp/defaultConfig.json' );
var userConfig                  = './gulp/config.json';

if( fs.existsSync( userConfig ) ) {
    gulpConfig = require( userConfig );
}

var projectPrefix               = 'mc';
var projectPrefixPlaceholder    = 'PFX';
var svgPrefix                   = 'icon-';

var basePaths = {
    root:       './',
    sources:    'sources',
    dist:       'dist'
};

var paths = {
    index: {
        sources: path.join( basePaths.sources, 'index.html' )
    },
    scripts: {
        sources:    [
            path.join( basePaths.sources, '**/*Module.js'),
            path.join( basePaths.sources, 'components/**/AppModules.js' ),
            path.join( basePaths.sources, 'components/**/*.js' ),
            path.join( '!' + basePaths.sources, '**/*Test.js')
        ]
    },
    libs: {
        sources:    [
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js'
        ]
    },
    images: {
        sources:    path.join( basePaths.sources, 'assets/images/**/*' ),
        dist:       path.join( basePaths.dist, 'assets/images' )
    },
    fonts: {
        sources:    path.join( basePaths.sources, 'assets/fonts/*.*' ),
        dist:       path.join( basePaths.dist, 'assets/fonts' )
    },
    svgs: {
        sources:    path.join( basePaths.sources, 'assets/svgs/*.svg')
    },
    scss: {
        appFile:    path.join( basePaths.sources, 'components/app/styles/app.scss' ),
        sources:    [
            path.join( basePaths.sources, '**/_reset.scss' ),
            path.join( basePaths.sources, '**/_variables.scss' ),
            path.join( basePaths.sources, '**/_base.scss' ),
            path.join( basePaths.sources, '**/_*.scss' ),
        ],
        dist:   	path.join( basePaths.dist, 'styles' )
    },
    templates: {
        sources:    [
            '!' + path.join( basePaths.sources, 'index.html' ),
            path.join( basePaths.sources, '**/*.html' )
        ],
        dist:       path.join( basePaths.dist, 'scripts' )
    }
};

// ------------------------------------------------------------
//  Clean tasks
// ------------------------------------------------------------

gulp.task( 'clean:dist', function() {
    return del( [ basePaths.dist ] );
});

gulp.task( 'clean:tempFiles', function() {
    return del( [
        path.join( paths.templates.dist, 'templates.js' ),
        path.join( paths.scss.dist, 'app.css' )
    ] );
});


// ------------------------------------------------------------
//  Copy tasks
// ------------------------------------------------------------

gulp.task( 'copy:index', function() {
    return gulp.src( path.join( basePaths.sources, 'index.html' ) )
        .pipe( gulp.dest( basePaths.dist ) );
});

gulp.task( 'copy:images', function() {
    return gulp.src( paths.images.sources )
        .pipe( gulp.dest( paths.images.dist ) );
});

gulp.task( 'copy:fonts', function() {
    return gulp.src( paths.fonts.sources )
        .pipe( gulp.dest( paths.fonts.dist ) )
});


// ------------------------------------------------------------
//  Compile scss
// ------------------------------------------------------------

gulp.task( 'scss', function () {
    var orderedScssFiles = gulp.src( paths.scss.sources, { read:false } )
        .pipe( plugins.order( paths.scss.sources, { base: basePaths.root } ) );

    return gulp.src( paths.scss.appFile )
        .pipe( plugins.inject( orderedScssFiles, {
            starttag: '// inject:{{ext}}',
            endtag: '// endinject',
            transform: function( filepath ) {
                filepath = filepath.replace( '_', '' );
                return '@import "' + filepath + '";';
            },
            relative: true
        } ) )
        .pipe( plugins.sass().on( 'error', plugins.sass.logError ) )
        .pipe( plugins.autoprefixer( {
            browsers: gulpConfig.autoprefixer.browsers,
            cascade: gulpConfig.autoprefixer.cascade
        } ) )
        .pipe( gulp.dest( paths.scss.dist ) )
        .pipe( browserSync.reload( { stream: true } ) );
});


// ------------------------------------------------------------
//  Prepare svgs
// ------------------------------------------------------------

gulp.task( 'svgstore', function() {
    var svgs = gulp.src( paths.svgs.sources )
        .pipe( plugins.rename( { prefix: svgPrefix } ) )
        .pipe( plugins.svgmin() )
        .pipe( plugins.svgstore( { inlineSvg: true } ) );

    function svgFileContents ( filePath, file ) {
        return file.contents.toString();
    };

    return gulp.src( path.join( basePaths.dist, 'index.html' ) )
        .pipe( plugins.inject( svgs, { transform: svgFileContents } ))
        .pipe( gulp.dest(  basePaths.dist ) );
});


// ------------------------------------------------------------
//  Inject tasks
// ------------------------------------------------------------

function getOrderedScriptFiles() {
    return gulp.src( paths.scripts.sources, { read:false } )
        .pipe( plugins.order( paths.scripts.sources, { base: basePaths.root } ) );
}

function getOrderedLibFiles() {
    return gulp.src( paths.libs.sources, { read: false } )
        .pipe( plugins.order( paths.libs.sources, { base: basePaths.root } ) );
}

var svgFiles = gulp.src( paths.svgs.sources )
    .pipe( plugins.rename( { prefix: svgPrefix } ) )
    .pipe( plugins.svgmin() )
    .pipe( plugins.svgstore( { inlineSvg: true } ) );

function svgFileContents ( filePath, file ) {
    return file.contents.toString();
};

gulp.task( 'inject:development', function() {
    return gulp.src( path.join( basePaths.dist, 'index.html' ) )
        .pipe( plugins.inject( getOrderedLibFiles(), { name: 'libs' } ) )
        .pipe( plugins.inject( getOrderedScriptFiles(), { name: 'sources' } ) )
        .pipe( plugins.inject( gulp.src( path.join( paths.templates.dist, 'templates.js' ), { read: false } ), { name: 'templates', relative: true } ) )
        .pipe( plugins.inject( gulp.src( path.join( paths.scss.dist, '*.css' ), { read: false } ), { relative: true } ) )
        .pipe( plugins.inject( svgFiles, { transform: svgFileContents } ))
        .pipe( gulp.dest( basePaths.dist ) )
        .pipe( browserSync.reload( { stream:true } ) );
});

gulp.task( 'inject:production', function() {
    return gulp.src( path.join( basePaths.dist, 'index.html' ) )
        .pipe( plugins.inject( getOrderedLibFiles(), { name: 'libs', relative: true } ) )
        .pipe( plugins.inject( getOrderedScriptFiles(), { name: 'sources', relative: true } ) )
        .pipe( plugins.inject( gulp.src( path.join( paths.templates.dist, 'templates.js' ), { read: false } ), { name: 'templates', relative: true } ) )
        .pipe( plugins.inject( gulp.src( path.join( paths.scss.dist, '*.css' ), { read: false } ), { relative: true } ) )
        .pipe( plugins.inject( svgFiles, { transform: svgFileContents } ))
        .pipe( gulp.dest( basePaths.dist ) );
});


// ------------------------------------------------------------
//  Template cache
// ------------------------------------------------------------

gulp.task( 'templatecache', function(){
    return gulp.src( paths.templates.sources )
        .pipe( plugins.minifyHtml( { empty: true } ) )
        .pipe( plugins.angularTemplatecache( { module: projectPrefixPlaceholder + '.app', root: '/', standAlone: false } ))
        .pipe( gulp.dest( paths.templates.dist ))
        .pipe( browserSync.reload( { stream:true } ) );
});


// ------------------------------------------------------------
//  Project prefix
// ------------------------------------------------------------

gulp.task( 'projectPrefix', function() {
    return gulp.src( path.join( basePaths.dist, '**/*' ))
        .pipe( plugins.replace( projectPrefixPlaceholder, function() {
            return projectPrefix;
        }, { skipBinary: true }))
        .pipe(gulp.dest( basePaths.dist ));

});


// ------------------------------------------------------------
//  JavaScript linting and code style check
// ------------------------------------------------------------

gulp.task( 'lint', function() {
    if( !gulpConfig.lint.enabled ) {
        return;
    }

    return gulp.src( paths.scripts.sources )
        .pipe( plugins.plumber( onError ))
        .pipe( plugins.jshint( '.jshintrc' ) )
        .pipe( plugins.jscs({
            configPath: '.jscsrc'
        }))
        .pipe( plugins.jscsStylish.combineWithHintResults() )
        .pipe( plugins.jshint.reporter( require('jshint-stylish') ) );
});


// ------------------------------------------------------------
//  Watcher
// ------------------------------------------------------------

gulp.task( 'watch:assets', function() {
    plugins.watch( paths.images.sources, { events: [ 'add', 'unlink' ] }, function() {
        runSequence( 'copy:images' )
    });
});

gulp.task( 'watch:scripts', function() {
    plugins.watch( paths.scripts.sources, { events: [ 'add', 'unlink' ] }, function() {
        runSequence( 'inject:development' )
    });
});

gulp.task( 'watch:svgs', function() {
    plugins.watch( paths.svgs.sources, { events: [ 'add', 'unlink' ] }, function() {
        runSequence( 'inject:development' )
    });
} );

gulp.task( 'watch:styles', function() {
    plugins.watch( paths.scss.sources, function() {
        runSequence( 'scss' )
    });
});

gulp.task( 'watch:templates', function() {
    plugins.watch( paths.templates.sources, function() {
        runSequence( 'templatecache' )
    });
});

gulp.task( 'watch:codeStyle', function() {
    plugins.watch( paths.scripts.sources, function() {
        runSequence( 'lint' )
    });
});

gulp.task( 'watch:index', function() {
    plugins.watch( paths.index.sources, function() {
        runSequence( 'copy:index', 'inject:development' )
    });
});


// ------------------------------------------------------------
//  Serve website
// ------------------------------------------------------------

gulp.task('browsersync', function () {
    browserSync.init({
        server: !gulpConfig.browsersync.proxy ? { baseDir: [basePaths.dist, basePaths.root] } : false,
        proxy: gulpConfig.browsersync.proxy ? gulpConfig.browsersync.proxy : false,
        open: gulpConfig.browsersync.open,
        browser: gulpConfig.browsersync.browser,
        notify: gulpConfig.browsersync.notify
    });
});


// ------------------------------------------------------------
//  Minify task
// ------------------------------------------------------------


gulp.task( 'minify', function() {
    return gulp.src( path.join( basePaths.dist, 'index.html' ) )
        .pipe( plugins.usemin({
            html:   [ plugins.minifyHtml( { comments: true, empty: true } ) ],
            css:    [ plugins.minifyCss(), plugins.rev() ],
            js:     [ plugins.ngAnnotate(), plugins.uglify(), plugins.rev() ]
        } ) )
        .pipe( gulp.dest(  basePaths.dist ) );
});


// ------------------------------------------------------------
//  Helper methods
// ------------------------------------------------------------

var onError = function( error ) {
    plugins.util.beep();
    console.log( error );

    this.emit( 'end' );
};


// ------------------------------------------------------------
//  Main tasks
// ------------------------------------------------------------

gulp.task( 'default', function( done ) {
    runSequence(
        'clean:dist',
        'copy:index',
        'copy:images',
        'copy:fonts',
        'scss',
        'templatecache',
        'inject:development',
        'watch:assets',
        'watch:scripts',
        'watch:svgs',
        'watch:styles',
        'watch:templates',
        'watch:index',
        'lint',
        'browsersync',
        'watch:codeStyle',
        done
    )
});

gulp.task( 'production', function( done ) {
    runSequence(
        'clean:dist',
        'copy:index',
        'copy:images',
        'copy:fonts',
        'scss',
        'templatecache',
        'inject:production',
        'minify',
        'projectPrefix',
        'clean:tempFiles',
        done
    )
});