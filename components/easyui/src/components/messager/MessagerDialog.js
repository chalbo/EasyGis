import React from 'react';
import Dialog from '../dialog/Dialog';
import { LinkButton } from '../linkbutton';

class MessagerDialog extends Dialog{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            inputValue: '',
            resultValue: null
        })
    }
    open(){
        super.open();
        this.setState({inputValue:'',resultValue:null})
        setTimeout(() => {
            if (this.input){
                this.input.focus()
            }
        })
    }
    close(){
        if (!this.state.closed){
            this.dialogContainer.appendChild(this.panelRef);
            this.closeMask();
            this.setState({closed:true}, ()=>{
                this.props.onClose();
                if (this.props.result){
                    this.props.result(this.state.resultValue)
                }
            })
        }
    }
    closeDialog(button){
        const {messagerType} = this.props;
        let value = null;
        if (messagerType === 'prompt' && button && button['value'] === true){
            value = this.state.inputValue;
        } else {
            value = button ? button['value'] : null;
        }
        this.setState({resultValue:value})
        this.close();
    }
    handleButtonClick(button){
        this.closeDialog(button);
    }
    messagerIcon() {
        const {icon} = this.props;
        return icon ? 'messager-' + icon : null;
    }
    renderPrompt(){
        const {messagerType} = this.props;
        if (messagerType !== 'prompt'){
            return null;
        }
        return (
            <div>
                <input 
                    style={{paddingLeft:4,paddingRight:4}}
                    className="messager-input" 
                    value={this.state.inputValue}
                    onChange={(e)=>this.setState({inputValue:e.target.value})}
                    ref={el=>this.input=el}
                />
            </div>
        )
    }
    renderButtons(){
        const {buttons} = this.props;
        if (!buttons || !buttons.length){
            return null;
        }
        return (
            <div key="buttons" className="dialog-button messager-button f-noshrink">
            {
                buttons.map((button,index) => (
                    <LinkButton key={index} text={button.text} onClick={()=>this.handleButtonClick(button)}></LinkButton>
                ))
            }
            </div>
        )
    }
    renderContent(){
        const {content,msg} = this.props;
        if (content){
            return content(this.props);
        } else {
            return [
                <div key="content" className="f-column f-full">
                    <div className="messager-body f-full f-column">
                        <div className="f-row f-full">
                            {this.messagerIcon() && <div className={'f-noshrink messager-icon '+this.messagerIcon()}></div>}
                            <div className="f-full" style={{marginBottom:20}}>{msg}</div>
                        </div>
                        {this.renderPrompt()}
                    </div>
                </div>,
                this.renderButtons()
            ]
        }
    }
    panelBody(){
        return (
            <div className={this.bodyClasses()+' f-column'} style={this.props.bodyStyle}>
            {this.renderContent()}
            </div>
        )
    }

}
MessagerDialog.defaultProps = Object.assign({}, Dialog.defaultProps, {
    style: {width:360,minHeight:130},
    modal: true,
    closed: true
})
export default MessagerDialog


// WEBPACK FOOTER //
// ./src/components/messager/MessagerDialog.js