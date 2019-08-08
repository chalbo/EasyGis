class TreeHelper{
    constructor(){
        this.cascadeCheck = true;
    }

    setCheckState(node, checkState){
        node.checkState = checkState;
	}

	checkNode(node, callback){
		if (node.checkState !== 'checked'){
			node.checkState = 'checked';
			if (this.cascadeCheck){
				this.setChildCheckbox(node, node.checkState);
				this.setParentCheckbox(node);
			}
			callback(node);
		}
	}

	uncheckNode(node, callback){
		if (node.checkState !== 'unchecked'){
			node.checkState = 'unchecked';
			if (this.cascadeCheck){
				this.setChildCheckbox(node, node.checkState);
				this.setParentCheckbox(node);
			}
			callback(node);
		}
	}

	uncheckAllNodes(nodes, callback){
		let changed = false;
		this.forNodes(nodes, (node) => {
			if (node.checkState !== 'unchecked'){
				node.checkState = 'unchecked';
				changed = true;
			}
		});
		if (changed){
			callback();
		}
	}

	setParentCheckbox(node){
		let pnode = node.parent;
		if (pnode){
			pnode.checkState = this.calcNodeState(pnode);
			this.setParentCheckbox(pnode);
		}
	}

	setChildCheckbox(node, checkState){
		node.checkState = checkState;
		if (node.children){
			for(let cnode of node.children){
				this.setChildCheckbox(cnode, checkState);
			}
		}
	}

	adjustCheck(node) {
		if (!this.cascadeCheck){
			return;
		}
		if (node.checkState === 'checked'){
			this.setChildCheckbox(node, node.checkState);
			this.setParentCheckbox(node);
		} else if (node.checkState === 'unchecked'){
			this.setChildCheckbox(node, node.checkState);
			this.setParentCheckbox(node);
		} else {
			node.checkState = this.calcNodeState(node);
			this.setParentCheckbox(node);
		}
	}

	calcNodeState(node) {
		let count = node.children ? node.children.length : 0;
		if (count){
			let checkedCount = 0;
			let uncheckedCount = 0;
			for(let cnode of node.children){
				cnode.checkState = cnode.checkState || 'unchecked';
				if (cnode.checkState === 'checked'){
					checkedCount ++;
				} else if (cnode.checkState === 'unchecked'){
					uncheckedCount ++;
				}
			}
			if (checkedCount === count){
				return 'checked';
			} else if (uncheckedCount === count){
				return 'unchecked';
			} else {
				return 'indeterminate';
			}
		}
		return 'unchecked';
	}

	forNodes(fromNodes, callback){
		fromNodes = fromNodes || [];
		let nodes = [];
		for(let i=0; i<fromNodes.length; i++){
			nodes.push(fromNodes[i]);
		}
		while(nodes.length){
			let node = nodes.shift();
			if (callback(node) === false){return;}
			if (node.children){
				for(let i=node.children.length-1; i>=0; i--){
					nodes.unshift(node.children[i]);
				}
			}
		}
	}

	findNode(nodes, field, value){
		let node = null;
		this.forNodes(nodes, (n) => {
			if (n[field] === value){
				node = n;
				return false;
			}
		});
		return node;
	}    
}
export default new TreeHelper();



// WEBPACK FOOTER //
// ./src/components/base/TreeHelper.js