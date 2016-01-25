import {Inject}         from "angular2/core";
import {Http}           from "angular2/http";

export class SvgIconService {
    private http:Http;
    private svgs;

    // -----------------------------------------
    //  Constructor
    // -----------------------------------------

    /**
     * Constructor
     * @param http
     */
    constructor(
        @Inject(Http) http:Http
    ) {
        this.http = http;
    }

    // -----------------------------------------
    //  Getter & Setter
    // -----------------------------------------

    private _templatePath:string;

    get templatePath():string {
        return this._templatePath;
    }

    set templatePath(newValue:string) {
        this._templatePath = newValue;
    }

    // -----------------------------------------
    //  Private methods
    // -----------------------------------------

    private findElement(iconName:string) {
        console.log("hmmmmmmmmm");

        var div = document.createElement('div');
        div.innerHTML = this.svgs;
        var elements = div.childNodes;

        console.log("SVG: ", this.svgs.getElementById(iconName));
        return this.svgs.getElementById(iconName);
    }

    private getData(iconName:string) {
        this.http.get(this._templatePath)
            .subscribe(
                data => {
                    this.svgs = data._body;
                    this.findElement(iconName);
                } ,
                () => console.log('Complete')
            );
    }

    // -----------------------------------------
    //  Public methods
    // -----------------------------------------

    getSvgSource(iconName:string) {
        if(!this.svgs) {
            this.getData(iconName);
        } else {
            return this.findElement(iconName);
        }
    }

}