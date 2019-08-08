import TimeSpinner from '../timespinner/TimeSpinner';

class DateTimeSpinner extends TimeSpinner{

}
DateTimeSpinner.defaultProps = Object.assign({}, TimeSpinner.defaultProps, {
    selections: [[0,2],[3,5],[6,10],[11,13],[14,16],[17,19]],
    format: 'MM/dd/yyyy HH:mm'
})
export default DateTimeSpinner


// WEBPACK FOOTER //
// ./src/components/datetimespinner/DateTimeSpinner.js