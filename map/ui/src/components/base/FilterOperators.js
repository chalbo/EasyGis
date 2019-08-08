export default {
    nofilter: {
        text: 'No Filter',
        isMatch: () => {
            return true;
        }
    },
    contains: {
        text: 'Contains',
        isMatch: function(source, value){
            source = String(source);
            value = String(value);
            return source.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        }
    },
    equal: {
        text: 'Equal',
        isMatch: function(source, value){
            return source === value;
        }
    },
    notequal: {
        text: 'Not Equal',
        isMatch: function(source, value){
            return source !== value;
        }
    },
    beginwith: {
        text: 'Begin With',
        isMatch: function(source, value){
            source = String(source);
            value = String(value);
            return source.toLowerCase().indexOf(value.toLowerCase()) === 0;
        }
    },
    endwith: {
        text: 'End With',
        isMatch: function(source, value){
            source = String(source);
            value = String(value);
            return source.toLowerCase().indexOf(value.toLowerCase(), source.length - value.length) !== -1;
        }
    },
    less: {
        text: 'Less',
        isMatch: function(source, value){
            return source < value;
        }
    },
    lessorequal: {
        text: 'Less Or Equal',
        isMatch: function(source, value){
            return source <= value;
        }
    },
    greater: {
        text: 'Greater',
        isMatch: function(source, value){
            return source > value;
        }
    },
    greaterorequal: {
        text: 'Greater Or Equal',
        isMatch: function(source, value){
            return source >= value;
        }
    }

};



// WEBPACK FOOTER //
// ./src/components/base/FilterOperators.js