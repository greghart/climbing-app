# Overlay 

Overlay component is a drawer component with mobile support for dragging that is docked to the bottom 
of the page. Inspiration came from Google maps.

Note, we cannot use layouts here, because the overlay layout itself would need two slots (title for 
bleed area, plus content), and Next.js does not currently support this.