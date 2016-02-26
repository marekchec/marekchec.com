import {Component}                      from 'angular2/core';
import {OnActivate, OnDeactivate}       from "angular2/src/router/interfaces";
import {ComponentInstruction}           from "angular2/src/router/instruction";

@Component({
    selector: 'start',
    templateUrl: './components/start/start.html',
    styleUrls: ['./components/start/start.css']
})
export class StartComponent implements OnActivate, OnDeactivate{

    // -----------------------------------------
    //  Lifecycle
    // -----------------------------------------

    routerOnActivate(next: ComponentInstruction, prev: ComponentInstruction) {
        TweenMax.fromTo(document.getElementsByClassName('start_shortcuts')[0], 1, {opacity: 0}, {opacity: 1});

        return new Promise((res, rej) => setTimeout(() => res(1), 1000));
    }

    routerOnDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
        TweenMax.fromTo(document.getElementsByClassName('start_shortcuts')[0], 1, {opacity:1}, {opacity: 0});

        return new Promise((res, rej) => setTimeout(() => res(1), 1000));
    }
}