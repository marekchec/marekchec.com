import {Component, Inject, ViewEncapsulation}           from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES}                 from 'angular2/router';
import {Http}                                           from 'angular2/http';
import {SvgIcon}                                        from "../../directives/svgIcon/SvgIconDirective";
import {SvgIconService}                                 from "../../directives/svgIcon/SvgIconService";
import {StartComponent}                                 from "../start/StartComponent";
import {AboutComponent}                                 from "../about/AboutComponent";
import {ImprintComponent}                               from "../imprint/ImprintComponent";

@Component({
    selector: 'app',
    templateUrl: './components/app/app.html',
    styleUrls: ['./components/app/styles/app.css'],
    encapsulation: ViewEncapsulation.None,
    directives: [ROUTER_DIRECTIVES, SvgIcon]
})

@RouteConfig([
    {
        path: '/',
        component: StartComponent,
        as: 'Start'
    },
    {
        path: '/about',
        component: AboutComponent,
        as: 'About'
    },
    {
        path: '/impressum',
        component: ImprintComponent,
        as: 'Imprint'
    }
])

export class AppComponent {

    // -----------------------------------------
    //  Lifecycle
    // -----------------------------------------

    /**
     * Constructor
     */
    constructor(
        private svgIconService:SvgIconService
    ) {
        this.setSvgTemplatePath();
    }

    // -----------------------------------------
    //  Private mehods
    // -----------------------------------------

    private setSvgTemplatePath() {
        this.svgIconService.templatePath = './assets/icons/svgs.html';
    }
}