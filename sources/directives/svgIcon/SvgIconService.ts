import {Injectable}                 from "angular2/core";
import {Http}                       from "angular2/http";
import {Observable}                 from 'rxjs/Observable';
import 'rxjs/add/operator/share';

@Injectable()
export class SvgIconService {

    public observable: Observable<any>;

    private svgsObserver: any;
    private svgStore: string        = '';
    private dataLoaded: boolean     = false;

    // -----------------------------------------
    //  Constructor
    // -----------------------------------------

    /**
     * Constructor
     * @param http
     */
    constructor(
        private http:Http
    ) {
        this.observable = new Observable(observer =>
            this.svgsObserver = observer).share();
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
    //  Public methods
    // -----------------------------------------

    /**
     * Find svg by icon-name
     * @param iconName
     * @returns {*}
     */
    public findElement(iconName:string) {
        var div = document.createElement('div');
        div.insertAdjacentHTML('beforeend', this.svgStore);

        var sprite          = div.firstChild;
        var symbolSource    = sprite.querySelector('#' + iconName);
        //var symbolSource    = sprite.getElementById('#' + iconName);
        console.log(symbolSource);
        return symbolSource;
    }

    /**
     * Get svg-icon by name
     * @param iconName
     * @returns {*}
     */
    public loadData() {
        if(!this.dataLoaded) {
            this.http.get(this.templatePath).map(result => result._body).subscribe(
                data => {
                    this.svgStore = data;
                    this.svgsObserver.next(data);
                },
                error => {
                    console.log('SvgIconService:: Couldn\'t load svg store. Please check if "templatePath" property will be set correctly: ', error)
                }
            );

            this.dataLoaded = true;
        } else if(this.svgStore.length > 0) {
            this.svgsObserver.next();
        }
    }

}