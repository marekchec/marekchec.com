import {Component, Inject, ViewEncapsulation}       from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES}             from 'angular2/router';
import {Http}                                       from 'angular2/http';
import {StartComponent}                             from '../../components/start/start';
import {AboutComponent}                             from '../../components/about/about';
import {ImpressumComponent}                         from '../../components/impressum/impressum';
import {SvgIcon}                                    from "../../directives/svgIcon/svgIcon.directive";
import {SvgIconService}                             from "../../directives/svgIcon/svgIcon.service";

@Component({
    selector: 'app',
    templateUrl: './components/app/app.html',
    styleUrls: ['./components/app/styles/app.css'],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, SvgIcon]
})

@RouteConfig([
    { path: '/', component: StartComponent, as: 'Start' },
    { path: '/about', component: AboutComponent, as: 'About' },
    { path: '/impressum', component: ImpressumComponent, as: 'Impressum' }
])

export class AppComponent {
    private svgIconService:SvgIconService;

    // -----------------------------------------
    //  Lifecycle
    // -----------------------------------------

    /**
     * Constructor
     */
    constructor(
        SvgIconService:SvgIconService
    ) {
        this.svgIconService = SvgIconService;

        this.setSvgTemplate();
    }

    // -----------------------------------------
    //  Private mehods
    // -----------------------------------------

    private setSvgTemplate() {
        this.svgIconService.templatePath = './assets/icons/svgs.html';
    }
}