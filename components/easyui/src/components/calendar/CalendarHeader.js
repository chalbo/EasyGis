import React from 'react';
import LocaleBase from '../base/LocaleBase';

class CalendarHeader extends LocaleBase{
    render(){
        const {defaultMonths,year,month} = this.props;
        const months = this.t('Calendar.months', defaultMonths);
        return(
            <div className="calendar-header f-row f-noshrink">
                <div className="calendar-title f-row f-full f-content-center">
                    <span className="calendar-text" onClick={()=>this.props.onMenuClick()}>{months[month-1] + ' ' + year}</span>
                </div>
                <div className="calendar-nav calendar-prevmonth" onClick={()=>this.props.onMonthPrev()}></div>
                <div className="calendar-nav calendar-nextmonth" onClick={()=>this.props.onMonthNext()}></div>
                <div className="calendar-nav calendar-prevyear" onClick={()=>this.props.onYearPrev()}></div>
                <div className="calendar-nav calendar-nextyear" onClick={()=>this.props.onYearNext()}></div>
            </div>
        )

    }
}
export default CalendarHeader


// WEBPACK FOOTER //
// ./src/components/calendar/CalendarHeader.js