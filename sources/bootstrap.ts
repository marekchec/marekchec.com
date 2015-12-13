import {bootstrap, provide} from 'angular2/angular2';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AppComponent} from './components/app/app';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS
]);