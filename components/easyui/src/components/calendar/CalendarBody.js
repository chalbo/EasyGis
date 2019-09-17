import React from 'react';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import CalendarMonths from './CalendarMonths';

class CalendarBody extends LocaleBase{
    saIndex() {
        let index = 6 - this.props.firstDay;
        if (index >= 7){
            index -= 7;
        }
        return index;
    }
    suIndex() {
        let index = this.saIndex() + 1;
        if (index >= 7){
            index -= 7;
        }
        return index;
    }
    calcWeekNumber(week){
        let date = new Date(week[0][0], week[0][1]-1, week[0][2]);
        return this.getWeekNumber(date);
    }
    getWeekNumber(date) {
        var checkDate = new Date(date.getTime());
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        var time = checkDate.getTime();
        checkDate.setMonth(0);
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
    }
    isToday(day) {
        let now = new Date();
        let y = now.getFullYear();
        let m = now.getMonth() + 1;
        let d = now.getDate();
        if (y === day[0] && m === day[1] && d === day[2]){
            return true;
        }
        return false;
    }
    isHighlighted(day) {
        const {highlightDay} = this.props;
        if (highlightDay){
            if (highlightDay.join(',') === day.join(',')){
                return true;
            }
        }
        return false;
    }
    isSelected(day) {
        const {selection} = this.props;
        if (selection){
            let y = selection.getFullYear();
            let m = selection.getMonth() + 1;
            let d = selection.getDate();
            if (y === day[0] && m === day[1] && d === day[2]){
                return true;
            }
        }
        return false;
    }
    handleDayMouseEnter(day){
        this.props.onDayMouseEnter(day);
    }
    handleDayMouseLeave(day){
        this.props.onDayMouseLeave(day);
    }
    handleDayClick(day){
        this.props.onDayClick(day);
    }
    handleMonthMouseEnter(month){
        this.props.onMonthMouseEnter(month);
    }
    handleMonthMouseLeave(){
        this.props.onMonthMouseLeave();
    }
    handleMonthClick(month){
        this.props.onMonthClick(month)
    }
    renderCells(week){
        const {year,month} = this.props;
        const saIndex = this.saIndex();
        const suIndex = this.suIndex();
        const weekNumber = !this.props.showWeek ? null : <td key="wk" className="calendar-week">{this.calcWeekNumber(week)}</td>
        const getCellCls = (day,index) => {
            return classHelper.classNames('calendar-day', {
                'calendar-other-month': day[0]!==year || day[1]!==month,
                'calendar-saturday': index===saIndex,
                'calendar-sunday': index===suIndex,
                'calendar-today': this.isToday(day),
                'calendar-selected': this.isSelected(day),
                'calendar-disabled': !this.props.calendar.isValid(day),
                'calendar-nav-hover': this.isHighlighted(day)
            })
        }
        const cells = week.map((day,index) => (
            <td 
                key={index}
                className={getCellCls(day,index)}
                onMouseEnter={()=>this.handleDayMouseEnter(day)}
                onMouseLeave={()=>this.handleDayMouseLeave(day)}
                onClick={()=>this.handleDayClick(day)}
            >{day[2]}</td>
        ))
        return [
            weekNumber,
            cells
        ]
    }
    render(){
        const {headerData,bodyData,showWeek,weekNumberHeader} = this.props;
        return (
            <div className="calendar-body f-full">
                <div className="calendar-content">
                    <table className="calendar-dtable" cellSpacing="0" cellPadding="0" border="0">
                        <thead>
                            <tr>
                            {showWeek && <th>{weekNumberHeader}</th>}
                            {
                                headerData.map((week,index) => (
                                    <th key={index}>{week}</th>
                                ))
                            }
                            </tr>
                        </thead>
                        <tbody>
                        {
                            bodyData.map((week,weekIndex) => (
                                <tr key={weekIndex}>
                                {this.renderCells(week)}
                                </tr>
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                <CalendarMonths
                    {...this.props}
                    onYearChange={(year)=>this.props.onYearChange(year)}
                    onYearPrev={()=>this.props.onYearPrev()}
                    onYearNext={()=>this.props.onYearNext()}
                    onMonthMouseEnter={this.handleMonthMouseEnter.bind(this)}
                    onMonthMouseLeave={this.handleMonthMouseLeave.bind(this)}
                    onMonthClick={this.handleMonthClick.bind(this)}
                />
            </div>
        )
    }
}
export default CalendarBody


// WEBPACK FOOTER //
// ./src/components/calendar/CalendarBody.js