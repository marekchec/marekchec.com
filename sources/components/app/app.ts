import {Component, ViewEncapsulation} from 'angular2/core';
import {
    RouteConfig,
    ROUTER_DIRECTIVES
} from 'angular2/router';

import {StartComponent} from '../start/start';
import {AboutComponent} from '../about/about';

@Component({
    selector: 'app',
    templateUrl: './components/app/app.html',
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', component: StartComponent, as: 'Start' },
    { path: '/about', component: AboutComponent, as: 'About' }
])

export class AppComponent {}