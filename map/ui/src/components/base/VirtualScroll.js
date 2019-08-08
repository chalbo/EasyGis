import React from 'react';
import PropTypes from 'prop-types';
import domHelper from '../base/DomHelper';
import classHelper from '../base/ClassHelper';
import LocaleBase from './LocaleBase';

class VirtualScroll extends LocaleBase{
    constructor(props){
        super(props);
        this.innerData = [];
        this.isUpdating = false;
        this.isNewFetching = true;
        this.waitingPage = 1;
        this.fetchingPage = 0;
        this.startIndex = 0;
        this.deltaTopHeight = 0;
        this.total = props.total;
        this.pageNumber = props.pageNumber;
        this.hasMounted = false;
        this.state = {
            items: [],
            topHeights: [],
            bottomHeights: []
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.total !== this.props.total){
            this.total = nextProps.total;
        }
        if (nextProps.pageNumber !== this.props.pageNumber){
            this.pageNumber = nextProps.pageNumber;
        }
        if (nextProps.data !== this.props.data){
            this.setData(nextProps.data);
        }
    }
    componentDidMount(){
        if (this.props.scrollPosition){
            this.scrollState(this.props.scrollPosition);
        } else {
            this.setData(this.props.data);
            this.isNewFetching = true;
        }
        setTimeout(() => this.hasMounted = true)
    }
    setData(value) {
        if (value == null){
            value = [];
        }
        this.innerData = value;
        if (this.props.lazy){
            if (this.fetchingPage > 0 && this.fetchingPage !== this.pageNumber){
                this.scrolling();
                return;
            }
            if (this.innerData.length){
                this.waitingPage = this.pageNumber;
                this.loadPage(this.innerData);
            } else {
                if (this.total > 0){
                    this.fetchPage(this.waitingPage);
                } else {
                    this.loadPage(this.innerData);
                }
            }
        } else {
            this.fetchingPage = 0;
            this.total = this.innerData.length;
            this.pageNumber = 1;
            this.waitingPage = 1;
            this.startIndex = 0;
            this.loadPage(this.innerData);
        }
    }
    scrollbarWidth() {
        return domHelper.outerWidth(this.bodyRef) - domHelper.outerWidth(this.contentRef);
    }
    scrollLeft(value){
        if (value !== undefined){
            this.bodyRef.scrollLeft = value;
        } else {
            return this.bodyRef.scrollLeft;
        }
    }
    scrollTop(value){
        if (value !== undefined){
            this.bodyRef.scrollTop = value;
        } else {
            return this.bodyRef.scrollTop;
        }
    }
    relativeScrollTop() {
        return this.bodyRef.scrollTop - this.startIndex * this.props.rowHeight + this.deltaTopHeight;
    }
    scrollState(value){
        if (value){
            this.deltaTopHeight = value.deltaTopHeight;
            this.startIndex = value.startIndex;
            this.pageNumber = value.pageNumber;
            this.waitingPage = value.waitingPage;
            this.fetchingPage = value.fetchingPage;
            this.innerData = value.innerData || [];
            this.setState({
                topHeights: value.topHeights,
                bottomHeights: value.bottomHeights,
                items: value.items || []
            }, ()=>{
                this.isUpdating = false;
                this.scrollTop(value.scrollTop);
            })
        } else {
            return {
                topHeights: Object.assign([],this.state.topHeights),
                bottomHeights: Object.assign([],this.state.bottomHeights),
                deltaTopHeight: this.deltaTopHeight,
                startIndex: this.startIndex,
                pageNumber: this.pageNumber,
                waitingPage: this.waitingPage,
                fetchingPage: this.fetchingPage,
                scrollTop: this.scrollTop(),
                items: Object.assign([], this.state.items),
                innerData: Object.assign([], this.innerData)
            };
        }
    }
    scrolling() {
        const {rowHeight,pageSize} = this.props;
        const {items} = this.state;
        this.isNewFetching = false;
        let bodyHeight = domHelper.outerHeight(this.bodyRef);
        let bodyOffset = domHelper.offset(this.bodyRef);
        let contentOffset = domHelper.offset(this.contentRef);
        let top = contentOffset.top - bodyOffset.top;
        let bottom = top + domHelper.outerHeight(this.contentRef);
        
        if (top > bodyHeight || bottom < 0){
            let scrollTop = this.bodyRef.scrollTop;
            let index = Math.floor((scrollTop + this.deltaTopHeight) / rowHeight);
            let page = Math.floor(index / pageSize) + 1;
            if (page > 0){
                let pageCount = Math.ceil(this.total/pageSize);
                if (page > pageCount){
                    page = pageCount;
                }
                this.isNewFetching = true;
                this.startIndex = (page - 1) * pageSize;
                this.waitingPage = page;
                // this.setState({items:[]});
                this.fetchPage(this.waitingPage);
            }
        } else if (top > 0){
            if (this.startIndex === 0){
                return;
            }
            let page = Math.floor(this.startIndex / pageSize) + 1;
            this.waitingPage = page - 1;
            this.fetchPage(this.waitingPage);
        } else if (bottom < bodyHeight){
            if (this.startIndex + items.length >= this.total){
                return;
            }
            let page = Math.floor(this.startIndex / pageSize) + 1;
            if (items.length >= pageSize*2){
                this.waitingPage = page + 2;
            } else {
                this.waitingPage = page + 1;
            }
            this.fetchPage(this.waitingPage);
        }
    }
    populate(items) {
        const {maxVisibleHeight,rowHeight,pageSize} = this.props;
        // const {items} = this.state;
        let newState = {items:items};
        if (!this.bodyRef){
            return;
        }
        this.isUpdating = true;

        let bodyHeight = domHelper.outerHeight(this.bodyRef);
        let topHeight = this.startIndex * rowHeight;
        let bottomHeight = this.total * rowHeight - topHeight - items.length * rowHeight;
        Object.assign(newState, {
            topHeights: this.splitHeights(topHeight),
            bottomHeights: this.splitHeights(bottomHeight)
        })
        let spos = this.bodyRef.scrollTop + this.deltaTopHeight;
        if (topHeight > maxVisibleHeight){
            this.deltaTopHeight = topHeight - maxVisibleHeight;
            Object.assign(newState,{
                topHeights: this.splitHeights(maxVisibleHeight)
            });
        } else {
            this.deltaTopHeight = 0;
        }
        if (bottomHeight > maxVisibleHeight){
            Object.assign(newState, {
                bottomHeights: this.splitHeights(maxVisibleHeight)
            });
        } else if (bottomHeight === 0){
            let lastCount = this.total % pageSize;
            if (lastCount){
                Object.assign(newState, {
                    bottomHeights: this.splitHeights(bodyHeight - lastCount*rowHeight)
                });
            }
        }
        this.bodyRef.scrollTop = spos - this.deltaTopHeight;
        this.setState(newState, ()=>{
            if (this.bodyRef){
                this.bodyRef.scrollTop = spos - this.deltaTopHeight;
                if (this.isNewFetching){
                    this.scrolling();
                }
                this.isUpdating = false;
            }
            this.props.onUpdate(this.state.items);
        });
    }
    splitHeights(height) {
        const { maxDivHeight } = this.props;
        let count = Math.floor(height / maxDivHeight);
        let leftHeight = height - maxDivHeight * count;
        if (height < 0){
            leftHeight = 0;
        }
        let heights = [];
        for(let i=0; i<count; i++){
            heights.push(maxDivHeight);
        }
        heights.push(leftHeight);
        return heights;
    }
    loadPage(items){
        const {pageSize} = this.props;
        if (this.pageNumber !== this.waitingPage){
            return;
        }
        items = items.slice(0, pageSize);
        let page = Math.floor(this.startIndex / pageSize) + 1;
        if (page === this.waitingPage){
        } else if (this.waitingPage === page + 1){
            items = this.state.items.slice(0, pageSize).concat(items)
        } else if (this.waitingPage === page + 2){
            this.startIndex += pageSize;
            items = this.state.items.slice(pageSize, pageSize*2).concat(items);
        } else if (this.waitingPage === page - 1){
            this.startIndex -= pageSize;
            items = items.concat(this.state.items.slice(0, pageSize));
        } else {
            this.startIndex = (this.pageNumber - 1) * pageSize;
        }
        // this.setState({items:items});
        this.populate(items);
    }
    fetchPage(page) {
        const {pageSize,lazy} = this.props;
        if (this.fetchingPage !== page){
            this.fetchingPage = page;
            if (!lazy){
                let start = (page - 1) * pageSize;
                let items = this.innerData.slice(start, start + pageSize);
                this.pageNumber = page;
                this.loadPage(items);
            }
            if (this.hasMounted){
                this.props.onPageChange({
                    pageNumber: page,
                    pageSize: pageSize
                })
            }
        }
    }
    refresh() {
        let page = Math.floor(this.startIndex / this.props.pageSize) + 1;
        this.waitingPage = page;
        this.fetchingPage = 0;
        this.fetchPage(page);
        this.scrolling();
    }
    handleScroll(event){
        event.stopPropagation();
        if (!this.isUpdating){
            this.scrolling();
        }
        this.setState({}, ()=>{
            this.props.onBodyScroll({
                left: this.bodyRef.scrollLeft,
                top: this.scrollTop(),
                relativeTop: this.relativeScrollTop(),
                items: this.state.items
            })
        })
    }
    renderContent(){
        const {renderItems,renderItem,rowHeight} = this.props;
        if (renderItems){
            return renderItems(this.state.items);
        } else if (renderItem){
            return this.state.items.map((item,index) => {
                let el = renderItem(item,index+this.startIndex);
                let style = el.props.style || {};
                return React.cloneElement(React.Children.only(el), {
                    style: Object.assign(style, {
                        height: rowHeight+'px'
                    })
                });
            })
        } else {
            return null;
        }
    }
    render(){
        let vsClasses = classHelper.classNames('f-column panel-noscroll', this.props.className);
        let topHeights = [];
        let bottomHeights = [];
        this.state.topHeights.forEach((h,index) => {
            topHeights.push(<div key={index} style={{height:h+'px'}}></div>);
        });
        this.state.bottomHeights.forEach((h,index) => {
            bottomHeights.push(<div key={index} style={{height:h+'px'}}></div>);
        });
        return (
            <div className={vsClasses} style={this.props.style}>
                <div className="scroll-body f-column f-full" ref={el=>this.bodyRef=el} onScroll={this.handleScroll.bind(this)}>
                    <div className="scroll-top f-noshrink" ref={el=>this.topRef=el}>{topHeights}</div>
                    <div className="scroll-content f-noshrink" ref={el=>this.contentRef=el}>
                    {
                        this.renderContent()
                    }
                    </div>
                    <div className="scroll-bottom f-noshrink" ref={el=>this.bottomRef=el}>{bottomHeights}</div>
                </div>
            </div>
        )
    }
}
VirtualScroll.propTypes = {
    lazy: PropTypes.bool,
    rowHeight: PropTypes.number,
    maxDivHeight: PropTypes.number,
    maxVisibleHeight: PropTypes.number,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    data: PropTypes.array,
    renderItems: PropTypes.func,
    renderItem: PropTypes.func,
    onUpdate: PropTypes.func,
    onPageChange: PropTypes.func
}
VirtualScroll.defaultProps = {
    lazy: false,
    rowHeight: 32,
    maxDivHeight: 10000000,
    maxVisibleHeight: 15000000,
    pageNumber: 1,
    pageSize: 10,
    total: 0,
    data: [],
    onUpdate(items){},
    onPageChange({pageNumber,pageSize}){},
    onBodyScroll(event){}
}
export default VirtualScroll


// WEBPACK FOOTER //
// ./src/components/base/VirtualScroll.js