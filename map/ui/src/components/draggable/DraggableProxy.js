import React from 'react';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';

class DraggableProxy extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            left: 0,
            top: 0,
            reverting: false
        }
    }
    componentDidMount(){
        document.body.appendChild(this.proxyRef);
    }
    componentWillUnmount(){
        if (this.proxyRef){
			this.el.appendChild(this.proxyRef);
		}
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.reverting !== this.props.reverting){
            this.setState({reverting:nextProps.reverting})
        }
        if (nextProps.closed !== this.props.closed){
            this.setState({closed:nextProps.closed})
        }
    }
    proxyClasses(){
        return classHelper.classNames([this.props.className, {
            'draggable-reverting': this.state.reverting
        }])
    }
    proxyStyles(){
        const {left,top} = this.state;
        return Object.assign({}, this.props.style||{}, {
            position: 'absolute',
            left: left+'px',
            top: top+'px'
        });
    }
    handleTransitionEnd(){
        this.setState({
            reverting: false,
            closed: true
        }, ()=>{
            this.props.host.hideProxy();
        })
    }
    render(){
        const innerDiv = (
            <div 
                className={this.proxyClasses()} 
                style={this.proxyStyles()} ref={el=>this.proxyRef=el}
                onTransitionEnd={this.handleTransitionEnd.bind(this)}
            >
            {this.props.children}
            </div>
        )
        const proxyWrap = this.props.host.props.proxyWrap;
        return React.cloneElement(proxyWrap||<div></div>, {
            className: 'f-hide',
            ref: (el=>this.el=el),
            children: innerDiv
        })
    }
}
export default DraggableProxy


// WEBPACK FOOTER //
// ./src/components/draggable/DraggableProxy.js