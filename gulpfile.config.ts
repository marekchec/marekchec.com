import {join} from 'path';

export const ROOT_DIR           = './';
export const DEST_DIR           = './dist';
export const SOURCES_DIR        = './sources';
export const SVG_DEST           = join(DEST_DIR, 'assets/icons');

export const BROWSERSYNC = {
    baseDir: [DEST_DIR, ROOT_DIR],
    browser: ['google chrome'],
    notify: false
};

export const LIB_SOURCES = [
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/http.js',
    'node_modules/angular2/bundles/router.js',
    'node_modules/gsap/src/minified/TweenMax.min.js'
];

export const SCSS_SOURCES = [
    join(SOURCES_DIR, 'components/app/styles/_reset.scss'),
    join(SOURCES_DIR, 'components/app/styles/_variables.scss'),
    join(SOURCES_DIR, 'components/app/styles/_helpers.scss'),
    join(SOURCES_DIR, 'components/app/styles/_fonts.scss'),
    join(SOURCES_DIR, 'components/app/styles/**/_*.scss')
];

export const ASSETS_SOURCES = [
    join(SOURCES_DIR, '**/*.html'),
    join(SOURCES_DIR, '**/*.{jpg,png}'),
    join(SOURCES_DIR, 'assets/fonts/**/*'),

];