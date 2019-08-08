import InputBase from "../base/InputBase";

export default class TextBox extends InputBase{
    text(){
        const {focused, text} = this.state;
        return focused ? text : this.props.textFormatter(text);
    }
}


// WEBPACK FOOTER //
// ./src/components/textbox/TextBox.js