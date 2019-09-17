import Panel from '../panel/Panel';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';

class CollapsedPanel extends Panel{
    componentDidMount(){
        domHelper.bind(this.panelRef, 'click', this.handleClick.bind(this))
    }
    componentWillUnmount(){
        domHelper.unbind(this.panelRef);
    }
    expand(){
        const {region,layout} = this.props;
        const panel = layout.getPanel(region);
        panel.expand();
    }
    handleClick(e){
        const ptool = domHelper.closest(e.target, '.panel-tool');
        if (!ptool){
            e.preventDefault();
            e.stopPropagation();
            this.expand();
        }
    }
    clickCollapsibleTool(e){
        e.preventDefault();
        this.expand();
    }
    panelClasses(){
        const {region} = this.props;
        return classHelper.classNames(['panel f-column layout-expand', this.props.className, {
            'layout-expand-east':region==='east',
            'layout-expand-west':region==='west',
            'layout-expand-south':region==='south',
            'layout-expand-north':region==='north'
        }]);
    }
    panelStyles(){
        const {region,paddingTop,paddingBottom,collapsedSize} = this.props;
        const top = region==='west'||region==='east' ? paddingTop : (region==='north' ? 0 : null);
        const bottom = region==='west'||region==='east' ? paddingBottom : (region==='south' ? 0 : null);
        const left = region==='west'||region==='north'||region==='south' ? 0 : null;
        const right = region==='east' ? 0 : null;
        const width = region==='west'||region==='east' ? collapsedSize : '100%';
        const height = region==='north'||region==='south' ? collapsedSize : null;
        return Object.assign({}, this.props.style, {
            top: top,
            bottom: bottom,
            left: left,
            right: right,
            position: 'absolute',
            width: width,
            height: height
        })
    }
}
export default CollapsedPanel


// WEBPACK FOOTER //
// ./src/components/layout/CollapsedPanel.js