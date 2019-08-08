import React from 'react';

class PaginationManual extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: props.pageNumber
        }
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.pageNumber !== this.props.pageNumber){
            this.setState({value:nextProps.pageNumber});
        }
    }
    handleChange(event){
        this.setState({value:event.target.value})
    }
    handleBlur(){
        var page = parseInt(this.state.value,10) || 1;
        this.props.onPageInput(page);
    }
    handleKeyDown(event){
        if (event.keyCode === 13){
            this.handleBlur()
        }
    }
    render(){
        const {value} = this.state;
        const {beforePageText,afterPageText} = this.props;
        return (
            <span style={{margin:'0 6px'}}>
                <span>{beforePageText}</span>
                    <input 
                        className="pagination-num" 
                        type="text" 
                        value={value} 
                        size="2" 
                        onChange={this.handleChange.bind(this)}
                        onBlur={this.handleBlur.bind(this)}
                        onKeyDown={this.handleKeyDown.bind(this)}
                    >
                    </input>
                <span>{afterPageText}</span>
            </span>
        )
    }
}
export default PaginationManual


// WEBPACK FOOTER //
// ./src/components/pagination/PaginationManual.js