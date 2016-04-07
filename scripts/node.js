
var Node = function(x,y,nodeIndex){
	this.x = x;
	this.y = y;
	this.nodeIndex = nodeIndex;
};
/*
* Gets all the child nodes of the node,sorted in ascending order
 */
Node.prototype.getChildren = function(){
	var arr = app.aMatrixData[this.nodeIndex];
	 var childNodes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === "1")
            childNodes.push(app.nodes[i]);

	var c = _.sortBy(childNodes, function(o) {
		return o.y - o.x;
	});
    return c;
};

/*
* Checks to see if a certain node is a child of this node
 */
Node.prototype.hasChild = function(index){
	var nodeEntered = app.nodes[index];
	var result = _.findIndex(this.getChildren(),function(n) {
		return _.isMatch(n,nodeEntered);
	});
	
	return result != -1;
};

/*
* The core algorithm - find the optimal child node closest to the destination node ( n - 1)
 */
Node.prototype.getOptimalChildNode = function(toNode){
	var children = this.getChildren(); //gets the children nodes of this node
	var toNodeCalc =  toNode.y - toNode.x  ; //calculates the value position of the node n - 1.

	var calculations = _.map(children,function(o){  //creates a new array with the position value of each node
		return o.y - o.x  ; //
	});

	var optimalChildIndex = app.optimalInteger(calculations,toNodeCalc); //finds the nodes with the closest position value to node n-1
	return children[optimalChildIndex];
	
};
