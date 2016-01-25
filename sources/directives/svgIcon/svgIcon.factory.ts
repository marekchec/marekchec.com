export class SvgIconFactory {

    // -----------------------------------------
    //  Lifecycle
    // -----------------------------------------

    /**
     * Constructor
     */
    constructor() {
        console.log("hmm");
    }

    /**
     * Create new svg element
     * @param svgSources
     * @returns {Element}
     */
    create(svgSources:Node) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', svgSources.getAttribute( 'viewBox'));
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.appendChild(svgSources);

        return svg;
    }

}