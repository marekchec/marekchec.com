import {Directive, ElementRef, Input} from 'angular2/core';

@Directive({
    selector: 'svg-icon'
})

export class SvgIcon {
    private svgElement:HTMLElement;
    @Input() name:string;

    // -------------------------------------------------------------------
    //  Lifecycle
    // -------------------------------------------------------------------

    constructor(private elementRef: ElementRef) {
        this.svgElement = elementRef.nativeElement;
    }
    
    ngOnInit() {
        this.createIcon();
    }

    // -------------------------------------------------------------------
    //  Private methods
    // -------------------------------------------------------------------

    createIcon() {
        var svgSources  = document.getElementById(this.name);
        var svg         = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', svgSources.getAttribute( 'viewBox'));
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.appendChild(svgSources);

        this.svgElement.appendChild(svg); 
    }
}