import React from 'react';
import LocaleBase from '../base/LocaleBase';
import domHelper from '../base/DomHelper';

class GridBody extends LocaleBase{
    constructor(props){
        super(props);
        this.currScrollTop = 0;
    }
    handleScroll(){
        this.props.onBodyScroll({
            left: this.bodyRef.scrollLeft,
            top: this.bodyRef.scrollTop
        })
    }
    scrollLeft(value){
        if (value === undefined){
            return this.bodyRef.scrollLeft;
        } else {
            this.bodyRef.scrollLeft = value;
        }
    }
    scrollTop(value){
        if (value === undefined){
            return this.currScrollTop;
        } else {
            this.currScrollTop = value;
            this.bodyRef.scrollTop = value;
        }
    }
    scrollbarWidth(){
        return domHelper.outerWidth(this.bodyRef) - domHelper.outerWidth(this.innerRef);
    }
    render(){
        return (
            <div className="datagrid-body f-full"
                onScroll={this.handleScroll.bind(this)}
                ref={el=>this.bodyRef=el}
            >
                <div className="datagrid-body-inner"
                    ref={el=>this.innerRef=el}
                >
                </div>
            </div>
        )
    }
}
GridBody.defaultProps = {
    onBodyScroll(){}
}
export default GridBody


// WEBPACK FOOTER //
// ./src/components/gridbase/GridBody.js