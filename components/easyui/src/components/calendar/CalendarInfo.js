import React from 'react';
import LocaleBase from '../base/LocaleBase';

class CalendarInfo extends LocaleBase{
    render(){
        const {date,info} = this.props;
        const d = date||new Date();
        const s1 = info(d);
        const s2 = typeof s1 === 'object' ? s1 : (
            <div>
                <div className="year">{d.getFullYear()}</div>
                <div>{s1}</div>
            </div>
        )
        return (
            <div className="calendar-info f-column">
                {s2}
            </div>
        )
    }
}
export default CalendarInfo


// WEBPACK FOOTER //
// ./src/components/calendar/CalendarInfo.js