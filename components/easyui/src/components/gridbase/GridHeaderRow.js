import React from 'react';
import LocaleBase from '../base/LocaleBase';

class GridHeaderRow extends LocaleBase{
    constructor(props){
        super(props);
        this.columns = [];
    }
    componentDidMount(){
        this.props.onRowAdd(this)
    }
    componentWillUnmount(){
        this.props.onRowRemove(this)
    }
    onColumnAdd(column){
        this.columns.push(column);
    }
    onColumnRemove(column){
        let index = this.columns.indexOf(column);
        if (index >= 0){
            this.columns.splice(index,1);
        }
    }
    render(){
        return (
            <div>
                {
                    React.Children.map(this.props.children, child => {
                        return React.cloneElement(child, {
                            grid: this.props.grid,
                            onColumnAdd: this.onColumnAdd.bind(this),
                            onColumnRemove: this.onColumnRemove.bind(this)
                        })
                    })
                }
            </div>
        )
    }
}
export default GridHeaderRow



// WEBPACK FOOTER //
// ./src/components/gridbase/GridHeaderRow.js