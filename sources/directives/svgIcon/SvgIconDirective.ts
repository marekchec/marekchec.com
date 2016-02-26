import {Directive, ElementRef, Input}   from 'angular2/core';
import {SvgIconService}                 from "./SvgIconService";
import {SvgIconFactory}                 from "./SvgIconFactory";
import {Observable}                     from 'rxjs/Observable';

@Directive({
    selector: 'svg-icon',
    providers: [SvgIconFactory]
})

export class SvgIcon {
    private svgElement:HTMLElement;

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
        private svgIconService: SvgIconService,
        private svgIconFactory: SvgIconFactory
    ) {
        this.svgElement = elementRef.nativeElement;
    }

    /**
     * On initialize
     */
    ngOnInit() {
        var svgObservable = this.svgIconService.observable.subscribe(() => {
            this.svgElement.appendChild(
                this.svgIconFactory.create(
                    this.svgIconService.findElement(this.name)
                )
            );

            svgObservable.unsubscribe();
        });

        this.svgIconService.loadData();
    }

}