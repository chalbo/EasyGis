import React from 'react';
import LinkButton from '../linkbutton/LinkButton';

class PaginationLink extends React.Component{
    pages() {
        const {pageCount,pageNumber,links} = this.props;

        let begin = pageNumber - Math.floor(links/2);
        if (begin < 1){
            begin = 1;
        }
        let end = begin + links - 1;
        if (end > pageCount){
            end = pageCount;
        }
        begin = end - links + 1;
        if (begin < 1){
            begin = 1;
        }
        let pp = [];
        for(let i=begin; i<=end; i++){
            pp.push(i);
        }
        return pp;
    }
    handleClick(page){
        return ()=>{
            this.props.onLinkChange(page);
        }
    }
    render(){
        const pageNumber = this.props.pageNumber;
        return (
            <div className="pagination-links f-inline-row">
            {
                this.pages().map(page => {
                    return (
                        <LinkButton
                            className="pagination-link"
                            key={page}
                            text={String(page)}
                            plain={true}
                            selected={pageNumber===page}
                            onClick={this.handleClick(page)}
                        />
                    )
                })
            }
            </div>
        )
    }
}
export default PaginationLink


// WEBPACK FOOTER //
// ./src/components/pagination/PaginationLink.js