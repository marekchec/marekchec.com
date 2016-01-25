import {Directive, ElementRef, Input}   from 'angular2/core';
import {SvgIconService}                 from "./svgIcon.service";
import {SvgIconFactory}                 from "./svgIcon.factory";
import {SvgIconFactory} from "./svgIcon.factory";

@Directive({
    selector: 'svg-icon'
})

export class SvgIcon {
    private svgElement:HTMLElement;
    private svgIconService:SvgIconService;
    private svgIconFactory:SvgIconFactory;

    @Input() name:string;

    // -----------------------------------------
    //  Lifecycle
    // -----------------------------------------

    /**
     * Constructor
     * @param SvgIconService
     * @param elementRef
     */
    constructor(
        elementRef:ElementRef,
        SvgIconService:SvgIconService,
        SvgIconFactory:SvgIconFactory
    ) {
        this.svgElement        = elementRef.nativeElement;
        this.svgIconService    = SvgIconService;
        this.svgIconFactory    = SvgIconFactory;
    }

    /**
     * Initialize controller
     */
    ngOnInit() {
        this.svgIconFactory.create(
            this.svgIconService.getSvgSource(this.name)
        );
    }

    // -----------------------------------------
    //  Private methods
    // -----------------------------------------

    //createIcon() {
    //    var svgSources  = document.getElementById(this.name);
    //    var svg         = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    //    svg.setAttribute('viewBox', svgSources.getAttribute( 'viewBox'));
    //    svg.setAttribute('height', '100%');
    //    svg.setAttribute('width', '100%');
    //    svg.appendChild(svgSources);
    //
    //    this.svgElement.appendChild(svg);
    //}
}