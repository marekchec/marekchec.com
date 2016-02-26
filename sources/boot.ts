import {provide}                            from 'angular2/core';
import {bootstrap}                          from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS}                     from 'angular2/http';
import {AppComponent}                       from "./components/app/AppComponent";
import {SvgIconService}                     from "./directives/svgIcon/SvgIconService";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    SvgIconService
]);