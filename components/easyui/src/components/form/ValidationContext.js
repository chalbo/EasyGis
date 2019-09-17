import React from 'react';

const ValidationContext = React.createContext({
    validateTime: null,
    errorType: null,
    tooltipPosition: null,
    getError: null
})
export default ValidationContext


// WEBPACK FOOTER //
// ./src/components/form/ValidationContext.js