import {Component, ViewEncapsulation}       from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES}     from 'angular2/router';
import {StartComponent}                     from '../../components/start/start';
import {AboutComponent}                     from '../../components/about/about';
import {ImpressumComponent}                 from '../../components/impressum/impressum';


@Component({
    selector: 'app',
    templateUrl: './components/app/app.html',
    styleUrls: ['./components/app/styles/app.css'],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', component: StartComponent, as: 'Start', useAsDefault: true },
    { path: '/about', component: AboutComponent, as: 'About' },
    { path: '/impressum', component: ImpressumComponent, as: 'Impressum' }
])

export class AppComponent {
}