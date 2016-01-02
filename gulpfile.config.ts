import {join} from 'path';

export const ROOT_DIRECTORY         = './';
export const DEST_DIRECTORY         = './dist';

export const SOURCES_DIRECTORY      = './sources';
export const IMAGES_DIRECTORY       = join(SOURCES_DIRECTORY, 'assets/images');
export const FONTS_DIRECTORY        = join(SOURCES_DIRECTORY, 'assets/fonts');
export const SVGS_DIRECTORY         = join(SOURCES_DIRECTORY, 'assets/svgs');

export const SVG_FILEPREFIX         = 'icon-';

export const BROWSERSYNC = {
    baseDir: [DEST_DIRECTORY, ROOT_DIRECTORY],
    browser: ['google chrome'],
    notify: false
};

export const LIB_SOURCES = [
    'node_modules/rxjs/bundles/Rx.min.js',
    'node_modules/angular2/bundles/angular2.min.js',
    'node_modules/angular2/bundles/router.js',
    'node_modules/angular2/bundles/http.min.js'
];

export const SHIMS_SOURCES = [
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/reflect-metadata/Reflect.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/angular2/bundles/angular2-polyfills.js'
];

export const SCSS_SOURCES = [
    join(SOURCES_DIRECTORY, 'components/app/styles/_reset.scss'),
    join(SOURCES_DIRECTORY, 'components/app/styles/_variables.scss'),
    join(SOURCES_DIRECTORY, 'components/app/styles/_helpers.scss'),
    join(SOURCES_DIRECTORY, 'components/app/styles/_fonts.scss'),
    join(SOURCES_DIRECTORY, 'components/app/styles/**/_*.scss')
];