var del             = require('del');
var fs              = require('fs');
var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var path            = require('path');
var browsersync     = require('browser-sync').create();
var plugins         = gulpLoadPlugins({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

var gulpConfig = require('./gulp/defaultConfig.json');
var userConfig = './gulp/config.json';

if (fs.existsSync(userConfig)) {
    gulpConfig = require(userConfig);
}

var projectPrefix            = 'mc';
var projectPrefixPlaceholder = 'PFX';
var svgPrefix                = 'icon-';

var basePaths = {
    root: './',
    sources: 'sources',
    dist: 'dist'
}

var paths = {
    index: {
        sources: path.join(basePaths.sources, 'index.html')
    },
    scripts: {
        sources: [
            path.join(basePaths.sources, '**/*Module.js'),
            path.join(basePaths.sources, 'components/**/AppModules.js'),
            path.join(basePaths.sources, 'components/**/*.js'),
            path.join(basePaths.sources, 'directives/**/*.js'),
            path.join('!' + basePaths.sources, '**/*Test.js')
        ]
    },
    libs: {
        sources: [
            'node_modules/angular/angular.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js',
            'node_modules/angular-translate/dist/angular-translate.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-translate/dist/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'node_modules/gsap/src/uncompressed/TweenLite.js',
            'node_modules/gsap/src/uncompressed/TimelineLite.js'
        ]
    },
    scss: {
        appFile: path.join(basePaths.sources, 'components/app/styles/app.scss'),
        sources: [
            path.join(basePaths.sources, '**/_reset.scss'),
            path.join(basePaths.sources, '**/_variables.scss'),
            path.join(basePaths.sources, '**/_mixins.scss'),
            path.join(basePaths.sources, '**/_base.scss'),
            path.join(basePaths.sources, '**/_*.scss'),
        ],
        dist: path.join(basePaths.dist, 'styles')
    },
    images: {
        sources: path.join(basePaths.sources, 'assets/images/**/*'),
        dist: path.join(basePaths.dist, 'assets/images')
    },
    fonts: {
        sources: path.join(basePaths.sources, 'assets/fonts/*.*'),
        dist: path.join(basePaths.dist, 'assets/fonts')
    },
    svgs: {
        sources: path.join(basePaths.sources, 'assets/svgs/*.svg')
    },
    templates: {
        sources: [
            '!' + path.join(basePaths.sources, 'index.html'),
            path.join(basePaths.sources, '**/*.html')
        ],
        dist: path.join(basePaths.dist, 'scripts')
    },
    locales: {
        sources: path.join(basePaths.sources, 'locales/**.json'),
        dist: path.join(basePaths.dist, 'locales')
    },
    environment: {
        sources: path.join(basePaths.sources, 'components/app/EnvironmentConfig.json'),
        dist: path.join(basePaths.dist, 'scripts')
    }
};


// ------------------------------------------------------------
//  Clean tasks
// ------------------------------------------------------------

gulp.task('clean:dist', function() {
    return del([basePaths.dist]);
});

gulp.task('clean:tempFiles', function() {
    return del([
        path.join(paths.templates.dist, 'templates.js'),
        path.join(paths.scss.dist, 'app.css'),
        path.join(paths.environment.dist, 'EnvironmentConfig.js')
    ]);
});


// ------------------------------------------------------------
//  Copy tasks
// ------------------------------------------------------------

gulp.task('copy:index', function() {
    return gulp.src(path.join(basePaths.sources, 'index.html'))
        .pipe(gulp.dest(basePaths.dist));
});

gulp.task('copy:images', function() {
    return gulp.src(paths.images.sources)
        .pipe(gulp.dest(paths.images.dist));
});

gulp.task('copy:fonts', function() {
    return gulp.src(paths.fonts.sources)
        .pipe(gulp.dest(paths.fonts.dist))
});

gulp.task('copy:locales', function() {
    return gulp.src(paths.locales.sources)
        .pipe(gulp.dest(paths.locales.dist));
});


// ------------------------------------------------------------
//  Compile scss
// ------------------------------------------------------------

gulp.task('scss', function() {
    var orderedScssFiles = gulp.src(paths.scss.sources, {read: false})
        .pipe(plugins.order(paths.scss.sources, {base: basePaths.root}));

    return gulp.src(paths.scss.appFile)
        .pipe(plugins.inject(orderedScssFiles, {
            starttag: '// inject:{{ext}}',
            endtag: '// endinject',
            transform: function(filepath) {
                filepath = filepath.replace('_', '');
                return '@import "' + filepath + '";';
            },
            relative: true
        }))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer({
            browsers: gulpConfig.autoprefixer.browsers,
            cascade: gulpConfig.autoprefixer.cascade
        }))
        .pipe(gulp.dest(paths.scss.dist, {overwrite: true}));
});


// ------------------------------------------------------------
//  Prepare svgs
// ------------------------------------------------------------

gulp.task('svgstore', function() {
    var svgs = gulp.src(paths.svgs.sources)
        .pipe(plugins.rename({prefix: svgPrefix}))
        .pipe(plugins.svgmin())
        .pipe(plugins.svgstore({inlineSvg: true}));

    function svgFileContents(filePath, file) {
        return file.contents.toString();
    };

    return gulp.src(path.join(basePaths.dist, 'index.html'))
        .pipe(plugins.inject(svgs, {transform: svgFileContents}))
        .pipe(gulp.dest(basePaths.dist));
});


// ------------------------------------------------------------
//  Inject tasks
// ------------------------------------------------------------

function getOrderedScriptFiles() {
    return gulp.src(paths.scripts.sources, {read: false})
        .pipe(plugins.order(paths.scripts.sources, {base: basePaths.root}));
}

function getOrderedLibFiles() {
    return gulp.src(paths.libs.sources, {read: false})
        .pipe(plugins.order(paths.libs.sources, {base: basePaths.root}));
}

var svgFiles = gulp.src(paths.svgs.sources)
    .pipe(plugins.rename({prefix: svgPrefix}))
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({inlineSvg: true}));

function svgFileContents(filePath, file) {
    return file.contents.toString();
}

gulp.task('inject:development', function() {
    return gulp.src(path.join(basePaths.dist, 'index.html'))
        .pipe(plugins.inject(getOrderedLibFiles(), {name: 'libs'}))
        .pipe(plugins.inject(getOrderedScriptFiles(), {name: 'sources'}))
        .pipe(plugins.inject(gulp.src(path.join(paths.environment.dist, 'EnvironmentConfig.js'), {read: false}), {
            name: 'environment',
            relative: true
        }))
        .pipe(plugins.inject(gulp.src(path.join(paths.templates.dist, 'templates.js'), {read: false}), {
            name: 'templates',
            relative: true
        }))
        .pipe(plugins.inject(gulp.src(path.join(paths.scss.dist, '*.css'), {read: false}), {relative: true}))
        .pipe(plugins.inject(svgFiles, {transform: svgFileContents}))
        .pipe(gulp.dest(basePaths.dist));
});

gulp.task('inject:production', function() {
    return gulp.src(path.join(basePaths.dist, 'index.html'))
        .pipe(plugins.inject(getOrderedLibFiles(), {name: 'libs', relative: true}))
        .pipe(plugins.inject(getOrderedScriptFiles(), {name: 'sources', relative: true}))
        .pipe(plugins.inject(gulp.src(path.join(paths.environment.dist, 'EnvironmentConfig.js'), {read: false}), {
            name: 'environment',
            relative: true
        }))
        .pipe(plugins.inject(gulp.src(path.join(paths.templates.dist, 'templates.js'), {read: false}), {
            name: 'templates',
            relative: true
        }))
        .pipe(plugins.inject(gulp.src(path.join(paths.scss.dist, '*.css'), {read: false}), {relative: true}))
        .pipe(plugins.inject(svgFiles, {transform: svgFileContents}))
        .pipe(gulp.dest(basePaths.dist));
});


// ------------------------------------------------------------
//  Template cache
// ------------------------------------------------------------

gulp.task('templatecache', function() {
    return gulp.src(paths.templates.sources)
        .pipe(plugins.minifyHtml({empty: true}))
        .pipe(plugins.angularTemplatecache({module: projectPrefixPlaceholder + '.app', root: '/', standAlone: false}))
        .pipe(gulp.dest(paths.templates.dist));
});


// ------------------------------------------------------------
//  Project prefix
// ------------------------------------------------------------

gulp.task('projectPrefix', function() {
    return gulp.src(path.join(basePaths.dist, '**/*'))
        .pipe(plugins.replace(projectPrefixPlaceholder, function() {
            return projectPrefix;
        }, {skipBinary: true}))
        .pipe(gulp.dest(basePaths.dist));
});


// ------------------------------------------------------------
//  JavaScript linting and code style check
// ------------------------------------------------------------

gulp.task('lint', function(done) {
    if (!gulpConfig.lint.enabled) {
        done();
    }

    return gulp.src(paths.scripts.sources, {since: gulp.lastRun('lint')})
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jscs({
            configPath: '.jscsrc'
        }))
        .pipe(plugins.jscsStylish.combineWithHintResults())
        .pipe(plugins.jshint.reporter(require('jshint-stylish')));
});


// ------------------------------------------------------------
//  Watcher
// ------------------------------------------------------------

gulp.task('watch', function(done) {
    if (!gulpConfig.watcher.enabled) {
        done();
    }

    gulp.watch(paths.scripts.sources, {ignoreInitial: true})
        .on('change', gulp.series('lint'))
        .on('unlink', gulp.series('inject:development'))
        .on('add', gulp.series('inject:development'));

    gulp.watch(paths.images.sources, {ignoreInitial: true})
        .on('unlink', gulp.series('copy:images'))
        .on('add', gulp.series('copy:images'));

    gulp.watch(paths.svgs.sources, {ignoreInitial: true})
        .on('unlink', gulp.series('inject:development'))
        .on('add', gulp.series('inject:development'));

    gulp.watch(paths.scss.sources,
        gulp.series('scss'));

    gulp.watch(paths.templates.sources,
        gulp.series('templatecache', 'browsersync:reload'));

    gulp.watch(paths.index.sources,
        gulp.series('copy:index', 'inject:development'));
});


// ------------------------------------------------------------
//  Serve website
// ------------------------------------------------------------

gulp.task('browsersync', function() {
    browsersync.init({
        server: !gulpConfig.browsersync.proxy ? {baseDir: [basePaths.dist, basePaths.root]} : false,
        proxy: gulpConfig.browsersync.proxy ? gulpConfig.browsersync.proxy : false,
        open: gulpConfig.browsersync.open,
        browser: gulpConfig.browsersync.browser,
        notify: gulpConfig.browsersync.notify
    });
});

gulp.task('browsersync:reload', gulp.series( browsersync.reload ) );


// ------------------------------------------------------------
//  Environment config
// ------------------------------------------------------------

gulp.task('environment:development', function() {
    return gulp.src(paths.environment.sources)
        .pipe(plugins.ngConfig('EnvironmentConfig', {environment: 'development'}))
        .pipe(gulp.dest(paths.environment.dist));
});

gulp.task('environment:production', function() {
    return gulp.src(paths.environment.sources)
        .pipe(plugins.ngConfig('EnvironmentConfig', {environment: 'production'}))
        .pipe(gulp.dest(paths.environment.dist));
});


// ------------------------------------------------------------
//  Minify task
// ------------------------------------------------------------


gulp.task('minify', function() {
    return gulp.src(path.join(basePaths.dist, 'index.html'))
        .pipe(plugins.usemin({
            html: [plugins.minifyHtml({comments: true, empty: true})],
            css: [plugins.minifyCss(), plugins.rev()],
            js: [plugins.ngAnnotate(), plugins.uglify(), plugins.rev()]
        }))
        .pipe(gulp.dest(basePaths.dist));
});


// ------------------------------------------------------------
//  Main tasks
// ------------------------------------------------------------

gulp.task('default',
    gulp.series(
        'clean:dist',
        gulp.parallel(
            'copy:index',
            'copy:images',
            'copy:fonts',
            'copy:locales',
            'environment:development',
            'scss',
            'templatecache'
        ),
        'inject:development',
        'lint',
        'browsersync'
    )
);

gulp.task('production',
    gulp.series(
        'clean:dist',
        gulp.parallel(
            'copy:index',
            'copy:images',
            'copy:fonts',
            'copy:locales',
            'environment:production',
            'scss',
            'templatecache'
        ),
        'inject:production',
        'minify',
        'projectPrefix',
        'clean:tempFiles'
    )
);