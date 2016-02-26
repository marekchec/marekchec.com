import {Component}      from 'angular2/core';
import {SvgIcon}        from "../../directives/svgIcon/SvgIconDirective";


@Component({
    selector: 'about',
    templateUrl: './components/about/about.html',
    styleUrls: ['./components/about/about.css'],
    directives: [SvgIcon]
})
export class AboutComponent {}