import React from 'react';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';

class CalendarMonths extends LocaleBase{
    handleMonthClick(month){
        setTimeout(()=>this.props.onMonthClick(month))
    }
    renderTable(){
        const {defaultMonths,month,highlightMonth} = this.props;
        const months = this.t('Calendar.months', defaultMonths);
        const getCellCls = (rowIndex,colIndex) => {
            return classHelper.classNames('calendar-nav calendar-menu-month', {
                'calendar-nav-hover':highlightMonth===months[rowIndex*4+colIndex],
                'calendar-selected':months[month-1]===months[rowIndex*4+colIndex]
            })
        }
        return (
            <table className="calendar-mtable">
                <tbody>
                {
                    [0,1,2].map(rowIndex => (
                        <tr key={rowIndex}>
                        {
                            [0,1,2,3].map(colIndex => (
                                <td
                                    key={colIndex}
                                    className={getCellCls(rowIndex,colIndex)}
                                    onMouseEnter={()=>this.props.onMonthMouseEnter(months[rowIndex*4+colIndex])}
                                    onMouseLeave={()=>this.props.onMonthMouseLeave()}
                                    onClick={()=>this.handleMonthClick(months[rowIndex*4+colIndex])}
                                >
                                {months[rowIndex*4+colIndex]}
                                </td>
                            ))
                        }
                        </tr>
                    ))
                }
                </tbody>
            </table>
        )
    }
    render(){
        const {showMenu,year} = this.props;
        if (!showMenu){
            return null;
        }
        return (
            <div className="calendar-menu f-column">
                <div className="calendar-menu-year-inner">
                    <span className="calendar-nav calendar-menu-prev" onClick={()=>this.props.onYearPrev()}></span>
                    <span>
                        <input className="calendar-menu-year" type="text" 
                            value={year}
                            onChange={(event)=>this.props.onYearChange(event.target.value)}
                        />
                    </span>
                    <span className="calendar-nav calendar-menu-next" onClick={()=>this.props.onYearNext()}></span>
                </div>
                <div className="calendar-menu-month-inner f-full">
                    <div className="calendar-content">
                    {this.renderTable()}
                    </div>
                </div>
            </div>
        )
    }
}
export default CalendarMonths


// WEBPACK FOOTER //
// ./src/components/calendar/CalendarMonths.js