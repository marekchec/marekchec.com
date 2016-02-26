export class SvgIconFactory {

    // -----------------------------------------
    //  Public methods
    // -----------------------------------------

    /**
     * Create new svg element
     * @param svgSources
     * @returns {Element}
     */
    create(svgSources:any) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', svgSources.getAttribute( 'viewBox'));
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        
        for ( var k = 0; k < svgSources.childNodes.length; ++k ) {
			svg.appendChild( svgSources.childNodes[ k ].cloneNode( true ) );
		}
        
        return svg;
    }

}