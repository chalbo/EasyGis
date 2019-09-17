import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import CalendarHeader from './CalendarHeader';
import CalendarBody from './CalendarBody';
import CalendarInfo from './CalendarInfo';

class Calendar extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            year: props.year,
            month: props.month,
            highlightDay: null,
            highlightMonth: null,
            headerData: [],
            bodyData: [],
            showMenu: false,
            selection: props.selection
        }
    }
    componentDidMount(){
        const {selection} = this.state;
        if (selection){
            this.moveTo(selection);
        } else {
            this.refresh();
        }
    }
    componentWillReceiveProps(nextProps) {
        let newState = {};
        if (nextProps.year !== this.props.year){
            Object.assign(newState, {year:nextProps.year})
        }
        if (nextProps.month !== this.props.month){
            Object.assign(newState, {month:nextProps.month})
        }
        if (nextProps.firstDay !== this.props.firstDay){
            Object.assign(newState, {firstDay:nextProps.firstDay})
        }
        if (nextProps.selection !== this.props.selection){
            Object.assign(newState, {selection:nextProps.selection})
        }
        if (!this.isStateEmpty(newState)){
            this.setState(newState, ()=>this.refresh())
            if (newState.selection){
                this.moveTo(newState.selection);
                this.selectDate(nextProps.selection);
            }
        }
    }
    refresh(){
        this.setState({
            headerData: this.getHeaderData(),
            bodyData: this.getWeeks()
        })
    }
    isStateEmpty(obj){
        for(let name in obj){
            return false;
        }
        return true;
    }
    getHeaderData() {
        const {firstDay,defaultWeeks} = this.props;
        const weeks = this.t('Calendar.weeks', defaultWeeks);

        let data1 = weeks.slice(firstDay, weeks.length);
        let data2 = weeks.slice(0, firstDay);
        return data1.concat(data2);
    }
    getWeeks() {
        const {year,month} = this.state;
        const {firstDay} = this.props;
        let dates = [];
        let lastDay = new Date(year, month, 0).getDate();
        for(let i=1; i<=lastDay; i++) dates.push([year,month,i]);
        
        // group date by week
        let weeks = [];
        let week = [];
        let memoDay = -1;
        while(dates.length > 0){
            let date = dates.shift();
            week.push(date);
            let day = new Date(date[0],date[1]-1,date[2]).getDay();
            if (memoDay === day){
                day = 0;
            } else if (day === (firstDay===0 ? 7 : firstDay) - 1){
                weeks.push(week);
                week = [];
            }
            memoDay = day;
        }
        if (week.length){
            weeks.push(week);
        }
        
        let firstWeek = weeks[0];
        if (firstWeek.length < 7){
            while(firstWeek.length < 7){
                let firstDate = firstWeek[0];
                let date = new Date(firstDate[0],firstDate[1]-1,firstDate[2]-1)
                firstWeek.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
            }
        } else {
            let firstDate = firstWeek[0];
            let week = [];
            for(let i=1; i<=7; i++){
                let date = new Date(firstDate[0], firstDate[1]-1, firstDate[2]-i);
                week.unshift([date.getFullYear(), date.getMonth()+1, date.getDate()]);
            }
            weeks.unshift(week);
        }
        
        let lastWeek = weeks[weeks.length-1];
        while(lastWeek.length < 7){
            let lastDate = lastWeek[lastWeek.length-1];
            let date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+1);
            lastWeek.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
        }
        if (weeks.length < 6){
            let lastDate = lastWeek[lastWeek.length-1];
            let week = [];
            for(let i=1; i<=7; i++){
                let date = new Date(lastDate[0], lastDate[1]-1, lastDate[2]+i);
                week.push([date.getFullYear(), date.getMonth()+1, date.getDate()]);
            }
            weeks.push(week);
        }
        
        return weeks;
    }
    isDiff(date1, date2) {
        if (date1 != null && date2 == null){
            return true;
        }
        if (date1 == null && date2 != null){
            return true;
        }
        if (date1 != null && date2 != null){
            if (this.toArray(date1).join(',') !== this.toArray(date2).join(',')){
                return true;
            }
        }
        return false;
    }
    isValid(day) {
        let date = new Date(day[0], day[1]-1, day[2]);
        return this.props.validator(date);
    }
    toDate(day) {
        return new Date(day[0], day[1]-1, day[2]);
    }
    toArray(date){
        return [date.getFullYear(), date.getMonth()+1, date.getDate()];
    }
    selectDate(date = null) {
        const {highlightDay,selection} = this.state;
        if (!date){
            if (highlightDay){
                date = this.toDate(highlightDay);
            } else {
                date = this.selection;
            }
        }
        if (this.isDiff(selection, date)){
            this.setState({selection:date}, ()=>{
                this.refresh();
                this.props.onSelectionChange(date)
            })
        }
    }
    highlightDate(date) {
        const highlightDay = date ? this.toArray(date) : null;
        this.setState({highlightDay:highlightDay})
    }
    moveTo(date) {
        if (date){
            this.setState({
                year: date.getFullYear(),
                month: date.getMonth()+1
            }, ()=>this.refresh())
        }
    }
    navDate(step) {
        const {highlightDay,selection} = this.state;
        let date = highlightDay ? this.toDate(highlightDay) : selection;
        if (date) {
            date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + step);
        } else {
            date = new Date();
        }
        this.moveTo(date);
        this.highlightDate(date);
    }
    handleMenuClick(){
        this.setState({showMenu:!this.state.showMenu})
    }
    handleMonthPrev(){
        const {month} = this.state;
        this.setState({month: month===1?12:month-1}, ()=>{
            this.setState({bodyData: this.getWeeks()})
        })
    }
    handleMonthNext(){
        const {month} = this.state;
        this.setState({month: month===12?1:month+1}, ()=>{
            this.setState({bodyData: this.getWeeks()})
        })
    }
    handleYearPrev(){
        this.setState({year:this.state.year-1}, ()=>{
            this.setState({bodyData: this.getWeeks()})
        })
    }
    handleYearNext(){
        this.setState({year:this.state.year+1}, ()=>{
            this.setState({bodyData: this.getWeeks()})
        })
    }
    handleYearChange(year){
        year = parseInt(year,10);
        if (!isNaN(year)){
            this.setState({year:year}, ()=>this.refresh())
        }
    }
    handleDayMouseEnter(day){
        this.setState({highlightDay:day})
    }
    handleDayMouseLeave(){
        this.setState({highlightDay:null})
    }
    handleDayClick(day){
        if (this.isValid(day)){
            this.setState({year:day[0],month:day[1]}, ()=>{
                this.selectDate(new Date(day[0], day[1]-1, day[2]));
            })
        }
    }
    handleMonthMouseEnter(month){
        this.setState({highlightMonth:month})
    }
    handleMonthMouseLeave(){
        this.setState({highlightMonth:null})
    }
    handleMonthClick(month){
        const months = this.t('Calendar.months', this.props.defaultMonths);
        let index = months.indexOf(month);
        if (index >= 0){
            this.setState({
                month: index+1,
                showMenu: false,
                highlightMonth: null
            }, ()=>this.refresh())
        }
    }
    render(){
        const cls = classHelper.classNames('calendar f-column', this.props.className, {
            'calendar-noborder': !this.props.border
        })
        return (
            <div className={cls} style={this.props.style}>
                {this.props.showInfo && <CalendarInfo date={this.state.selection} info={this.props.info||this.props.defaultInfo}></CalendarInfo>}
                <CalendarHeader 
                    {...this.props} 
                    {...this.state}
                    onMenuClick={this.handleMenuClick.bind(this)}
                    onMonthPrev={this.handleMonthPrev.bind(this)}
                    onMonthNext={this.handleMonthNext.bind(this)}
                    onYearPrev={this.handleYearPrev.bind(this)}
                    onYearNext={this.handleYearNext.bind(this)}
                />
                <CalendarBody 
                    {...this.props} 
                    {...this.state}
                    calendar={this}
                    onDayMouseEnter={this.handleDayMouseEnter.bind(this)}
                    onDayMouseLeave={this.handleDayMouseLeave.bind(this)}
                    onDayClick={this.handleDayClick.bind(this)}
                    onYearChange={this.handleYearChange.bind(this)}
                    onYearPrev={this.handleYearPrev.bind(this)}
                    onYearNext={this.handleYearNext.bind(this)}
                    onMonthMouseEnter={this.handleMonthMouseEnter.bind(this)}
                    onMonthMouseLeave={this.handleMonthMouseLeave.bind(this)}
                    onMonthClick={this.handleMonthClick.bind(this)}
                />
            </div>
        )
    }
}
Calendar.propTypes = Object.assign({}, LocaleBase.propTypes, {
    weeks: PropTypes.array,
    months: PropTypes.array,
    border: PropTypes.bool,
    showWeek: PropTypes.bool,
    showInfo: PropTypes.bool,
    weekNumberHeader: PropTypes.string,
    firstDay: PropTypes.number,
    year: PropTypes.number,
    month: PropTypes.number,
    selection: PropTypes.object,
    validator: PropTypes.func,
    info: PropTypes.func
})
Calendar.defaultProps = {
    defaultWeeks: ['S','M','T','W','T','F','S'],
    defaultMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    border: true,
    showWeek: false,
    showInfo: false,
    info: null,
    weekNumberHeader: '',
    firstDay: 0,
    year: new Date().getFullYear(),
    month: new Date().getMonth()+1,
    validator(date){return true},
    defaultInfo(date){
        const y = date.getFullYear();
        return date.toDateString().replace(y, '');
    },
    onSelectionChange(date){}
}
export default Calendar


// WEBPACK FOOTER //
// ./src/components/calendar/Calendar.js