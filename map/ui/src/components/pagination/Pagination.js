import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import LocaleBase from '../base/LocaleBase';
import PaginationButton from './PaginationButton';
import PaginationLink from './PaginationLink';
import PaginationList from './PaginationList';
import PaginationManual from './PaginationManual';

class Pagination extends LocaleBase{
    constructor(props){
        super(props);
        this.lastState = null;
        this.state = {
            pageNumber: props.pageNumber,
            pageSize: props.pageSize
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.pageNumber !== this.props.pageNumber){
            this.setState({pageNumber:nextProps.pageNumber}, ()=>{
                this.adjustPage();
            });
        }
        if (nextProps.pageSize !== this.props.pageSize){
            this.setState({pageSize:nextProps.pageSize}, ()=>{
                this.adjustPage();
            });
        }
        if (nextProps.total !== this.props.total){
            this.setState({}, ()=>{
                this.adjustPage();
            });
        }
    }
    componentDidMount(){
        this.adjustPage();
        this.lastState = {
            pageNumber: this.state.pageNumber,
            pageSize: this.state.pageSize
        };
    }
    beforePageText(){
        return this.props.beforePageText || this.t('Pagination.beforePageText', this.props.defaultBeforePageText);
    }
    afterPageText(){
        let text = this.props.afterPageText || this.t('Pagination.afterPageText', this.props.defaultAfterPageText);
        text = text.replace(/{pages}/, String(this.pageCount()));
        return text;
    }
    pageInfo() {
        const {total,displayMsg,defaultDisplayMsg} = this.props;
        const {pageSize,pageNumber} = this.state;
        let info = displayMsg || this.t('Pagination.displayMsg', defaultDisplayMsg);
        info = info.replace(/{from}/, String(total===0 ? 0 : pageSize*(pageNumber-1)+1));
        info = info.replace(/{to}/, String(Math.min(pageSize*(pageNumber), total)));
        info = info.replace(/{total}/, String(total));
        return info;
    }
    pageCount() {
        const total = this.props.total;
        const pageSize = this.state.pageSize;
        return !total ? 0 : Math.ceil(total / pageSize) || 1;
    }
    isButton(name) {
        let aa = ['first','prev','next','last','refresh'];
        let index = aa.indexOf(name);
        return index >= 0;
    }
    adjustPage() {
        const total = this.props.total;
        const pageSize = this.state.pageSize;
        const pageCount = this.pageCount();
        let pageNumber = this.state.pageNumber;
        if (pageNumber < 1){
            pageNumber = 1;
        }
        if (pageNumber > pageCount){
            pageNumber = pageCount;
        }
        if (total === 0){
            pageNumber = 0;
            if (this.lastState){
                this.lastState.pageNumber = 1;
            }
        }
        this.setState({pageNumber:pageNumber});
        if (this.lastState){
            let state = {pageNumber: pageNumber||1, pageSize: pageSize};
            if (state.pageNumber !== this.lastState.pageNumber || state.pageSize !== this.lastState.pageSize){
                this.lastState = state;
                this.props.onPageChange(this.lastState);
            }
        }
    }
    selectPage(page) {
        this.setState({pageNumber:page}, ()=>{
            this.adjustPage();
        })
    }
    refreshPage() {
        let state = Object.assign({refresh: true}, this.lastState);
        if (state.pageNumber <= 0){
            state.pageNumber = 1;
        }
        this.props.onPageChange(state);
    }
    handleButtonClick(page){
        if (page === 0){
            this.refreshPage();
        } else {
            this.selectPage(page);
        }
    }
    handleLinkChange(page){
        this.selectPage(page);
    }
    handleListChange(pageSize){
        this.setState({pageSize:pageSize}, ()=>{
            this.adjustPage()
        })
    }
    handlePageInput(page){
        this.selectPage(page)
    }
    renderLayout(name,index){
        const props = Object.assign({}, this.props, this.state, {
            className: null,
            style: null
        })
        if (this.isButton(name)){
            return <PaginationButton key={index} {...props} pageCount={this.pageCount()} name={name} onButtonClick={this.handleButtonClick.bind(this)}></PaginationButton>
        } else if (name === 'links'){
            return <PaginationLink key={index} {...props} pageCount={this.pageCount()} onLinkChange={this.handleLinkChange.bind(this)}></PaginationLink>
        } else if (name === 'list'){
            return <PaginationList key={index} pageList={this.props.pageList} pageSize={this.state.pageSize} onListChange={this.handleListChange.bind(this)}></PaginationList>
        } else if (name === 'manual'){
            return <PaginationManual key={index} {...this.state} beforePageText={this.beforePageText()} afterPageText={this.afterPageText()} onPageInput={this.handlePageInput.bind(this)}></PaginationManual>
        } else if (name === 'info'){
            return (
                <div key={index} className="f-full">
                    <div className="pagination-info">{this.pageInfo()}</div>
                </div>
            )
        } else if (name === 'sep'){
            return <div key={index} className="pagination-btn-separator"></div>
        } else if (name === 'ext' && this.props.renderExt){
            return React.cloneElement(React.Children.only(this.props.renderExt()), {
                key: index
            });
        } else {
            return null;
        }
    }
    render(){
        const cls = classHelper.classNames('pagination f-row f-content-center', this.props.className);
        return (
            <div className={cls} style={this.props.style}>
            {
                this.props.layout.map((name,index) => {
                     return this.renderLayout(name,index)
                })
            }
            </div>
        )
    }
}
Pagination.propTypes = {
    pageList: PropTypes.array,
    loading: PropTypes.bool,
    showPageList: PropTypes.bool,
    showPageInfo: PropTypes.bool,
    showPageRefresh: PropTypes.bool,
    links: PropTypes.number,
    beforePageText: PropTypes.string,
    afterPageText: PropTypes.string,
    displayMsg: PropTypes.string,
    layout: PropTypes.array,
    total: PropTypes.number,
    pageSize: PropTypes.number,
    pageNumber: PropTypes.number,
    renderExt: PropTypes.func,
    onPageChange: PropTypes.func
}
Pagination.defaultProps = {
    pageList: [10,20,30,40,50],
    loading: false,
    showPageList: true,
    showPageInfo: true,
    showPageRefresh: true,
    links: 10,
    defaultBeforePageText: 'Page',
    defaultAfterPageText: 'of {pages}',
    defaultDisplayMsg: 'Displaying {from} to {to} of {total} items',
    layout: ['first','prev','links','next','last','refresh'],
    total: 0,
    pageSize: 10,
    pageNumber: 1,
    onPageChange(){}
}
export default Pagination


// WEBPACK FOOTER //
// ./src/components/pagination/Pagination.js