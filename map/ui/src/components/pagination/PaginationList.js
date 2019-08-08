import React from 'react';

class PaginationList extends React.Component{
    handleChange(event){
        let pageSize = parseInt(event.target.value,10);
        this.props.onListChange(pageSize);
    }
    render(){
        return (
            <select 
                className="pagination-page-list" 
                value={this.props.pageSize}
                onChange={this.handleChange.bind(this)}
            >
            {
                this.props.pageList.map(page => {
                    return <option key={page}>{page}</option>
                })
            }
            </select>
        )
    }
}
export default PaginationList


// WEBPACK FOOTER //
// ./src/components/pagination/PaginationList.js