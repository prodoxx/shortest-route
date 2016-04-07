var app  = {};
app.nodes = [];
app.coords = [];
app.aMatrixData = [];
app.nodesLabel = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];

var canvas, ctx, numNodes, boxWidth, initX, startX, startY;

/*
* Reads the list of points file, creates and stores nodes in the nodes array
 */
app.readPointsData = function(evt){
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  //Retrieve the first (and only!) File from the FileList object
	    var f = evt.target.files[0]; 
	
	    if (f) {
	      var r = new FileReader();
	      r.onload = function(e) { 
		     var content = e.target.result;
		     app.coords = content.split("\r\n");
		     for(var i = 0; i < app.coords.length;i++){
		      	var p = app.coords[i].split(",");
		      	
		      	var newNode = new Node(parseInt(p[0]),parseInt(p[1]),i); // creates a new node object
		      	app.nodes.push(newNode); //inserts the node on the node array
		      
		     }
	     };
	      r.readAsText(f);
	    } else { 
	      alert("Failed to load file");
	    }
	} else {
	  alert('The File APIs are not fully supported by your browser.');
	}
};

/*
* Reads the Adjacency Matrix File and stores the data on the aMatrixData array
 */
app.readMatrixData = function(evt){
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  //Retrieve the first (and only!) File from the FileList object
	    var f = evt.target.files[0]; 
	
	    if (f) {
	      var r = new FileReader();
	      r.onload = function(e) { 
		     var content = e.target.result;
		     app.aMatrixData = content.split("\r\n");
		      
	     };
	      r.readAsText(f);
	    } else { 
	      alert("Failed to load file");
	    }
	} else {
	  alert('The File APIs are not fully supported by your browser.');
	}
};

/*
* Creates the Adjacency Matrix Table
 */
app.createAdjacencyMatrixTable = function() {

	var p = $("#points").val();
	var m = $("#matrix").val();
	var mte = $("#matrixTable tbody");
	var mteTr = $("#matrixTable tbody > tr");
	$("#computePath").show();
	
	if(p != "" && m != ""){ //checks to see that the file inputs are not empty and have a file selected
		app.changeView(2);

		app.displayListOfPoints(); //displays list of points

		//Displays the first row labels in the table
		for(var i = 0; i < app.aMatrixData.length;i++){
			if(i == 0){
				mteTr.append("<td> </td>");
			}
			mteTr.append("<th>" + app.nodesLabel[i] + "</th>");
		}

		//displays the matrix data ono the data
		for(var k = 0; k < app.aMatrixData.length;k++){
			var lineData = app.aMatrixData[k];
			mte.append("<tr>");
			mte.append("<th>" + app.nodesLabel[k] + "</th>");
			for(var j = 0; j < lineData.length;j++){
				mte.append("<td>" + lineData[j] + "</td>");
			}
			mte.append("</tr>");
		}


	} else {
		alert("You are missing a file(s)!");
	}
};

/*
* Outputs the List of Points in the page
 */
app.displayListOfPoints = function() {
	var pointsList = $("#listOfPoints");

	for(var i = 0 ; i < app.coords.length; i++){
		pointsList.append("<li><b>" + app.nodesLabel[i] + "</b>:  " + app.coords[i] + "</li>");
	}
};

app.createNodeGraph = function() {
	app.changeView(3);
	numNodes = app.nodes.length;

	//gets the node with the max X value
	var maxX = _.max(app.nodes,function(n){
		return n.x;
	});
	//gets the node with the max Y value
	var maxY = _.max(app.nodes,function(n){
		return n.y;
	});


	boxWidth = 30;
	initX = 30,initY =30,lw= numNodes * boxWidth;
	var w= maxX.x * boxWidth;
	var l = maxY.y * boxWidth
	startX = initX;  //translate to x = 0;
	startY = initX + l; //translate to y  = 0;
	ctx.strokeRect(initX,initY,w,l);

	// creates the graph's vertical lines
	for(var i = 1; i <= maxX.x; i++){
		var lineSpacer = (initX + (boxWidth * i));
		var lineLength = l + initX;
		ctx.beginPath();
		ctx.moveTo(lineSpacer,initY);
		ctx.lineTo(lineSpacer,lineLength);
		ctx.closePath();
		ctx.stroke();
		ctx.font = "normal 12pt Arial";
		ctx.fillText(i.toString(),lineSpacer - ((boxWidth + 5) /2),lineLength + 20);



	}
	//creates thee graph's horizontal lines
	for(var i =0; i< maxY.y; i++){
		var lineSpacer = (initX + (boxWidth * i));
		var lineLength = w + initX;
		ctx.beginPath();
		ctx.moveTo(initX,lineSpacer);
		ctx.lineTo(lineLength,lineSpacer);
		ctx.closePath();
		ctx.stroke();

		ctx.fillText(((maxY.y) - i).toString(),initX - 24,(lineSpacer - (boxWidth / 2)) + 30);

	}

	//create the paths from node to node (it was created before the nodes so the path appears below of the nodes)
	for(var i = 0; i < numNodes; i++){
		app.createPaths(ctx,i,boxWidth,startX,startY);
	}

	//the nodes are created in the graph.
	for(var i = 0; i < numNodes; i++){
		app.insertNodeInGraph(ctx,i,boxWidth,startX,startY);
	}

};

/*
* Inserts a node in the graph
 */
app.insertNodeInGraph = function(context,index,boxWidth,x,y){

	var node = app.nodes[index]; //gets a node object from app.nodes

	var centerX = x + ((boxWidth  * (node.x -1 ) + (boxWidth/2)));
	var centerY = y - ((boxWidth  * (node.y - 1) + (boxWidth /2)));

	context.beginPath();
	context.arc(centerX,centerY,boxWidth /2,0, 2 * Math.PI);
	context.fillStyle = "white";
	context.fill();
	context.strokeStyle = "black";
	context.stroke();
	context.closePath();

	context.fillStyle = "purple";
	context.fillText(app.nodesLabel[index],centerX - 4,centerY + 4);

};


/*
* Draws the edges between the nodes
 */
app.createPaths = function(context,index,boxWidth,x,y) {
	var node = app.nodes[index];
	var centerX = x + ((boxWidth  * (node.x -1 ) + (boxWidth/2)));
	var centerY = y - ((boxWidth  * (node.y - 1) + (boxWidth /2)));
	var childrenNodes = node.getChildren();

	for(var i = 0; i < childrenNodes.length; i++){
		var cNode = childrenNodes[i];
		var cNodeCenterX = x + ((boxWidth  * (cNode.x -1 ) + (boxWidth/2)));
		var cNodeCenterY =  y - ( (boxWidth  * (cNode.y - 1) + (boxWidth /2) ));
		context.beginPath();
		context.moveTo(centerX,centerY);
		context.lineTo(cNodeCenterX,cNodeCenterY);
		context.strokeStyle = "black";
		context.stroke();
		context.closePath();
	}

};

//returns the shortest path to the business man
app.getOptimalPath = function(){
	var firstNode = _.first(app.nodes);
	var lastNode = _.last(app.nodes);
	var pointer = 0; // points initially to the first node
	var path = new Array(); // holds the path that it takes to reach the last node.
	path.push(firstNode); //push in the first node initially.

	if(firstNode.hasChild(lastNode.nodeIndex)){ //if the current node has the last node as a child then end this loop
		path.push(lastNode); //push in the last node to the path meaning, that we are done
		pointer = -1; //assign pointer -1 to end the while loop
	}

	if(pointer != -1){
		while(pointer != -1){

			var optimalNode = app.nodes[pointer].getOptimalChildNode(lastNode);
			pointer = optimalNode.nodeIndex;
			path.push(optimalNode);
			if(optimalNode.hasChild(lastNode.nodeIndex)){ //if the current node has the last node as a child then end this loop
				path.push(lastNode); //push in the last node to the path meaning, that we are done
				pointer = -1; //assign pointer -1 to end the while loop
			}
		}
	}


	return path;

};


app.drawPath = function() {
	$("#computePath").hide();
	$("#loading").show();


	var path = app.getOptimalPath(); //gets the shortest path
	var i = 0;


	/*
	* Highlights the optimal path step by step every 4 seconds
	 */

	var interval = setInterval(function(){
		var nextNodeIndex  = i + 1;

		if(nextNodeIndex < path.length){
			var node = path[i];
			var cNode = path[nextNodeIndex];

			var nextNodeCenterX = startX + ((boxWidth  * (cNode.x -1 ) + (boxWidth/2)));
			var nextNodeCenterY =  startY - ( (boxWidth  * (cNode.y - 1) + (boxWidth /2) ));

			var centerX = startX + ((boxWidth  * (node.x -1 ) + (boxWidth/2)));
			var centerY = startY - ((boxWidth  * (node.y - 1) + (boxWidth /2)));

			ctx.beginPath();
			ctx.moveTo(centerX,centerY);
			ctx.lineTo(nextNodeCenterX,nextNodeCenterY);
			ctx.strokeStyle = "red";
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();

		}

		i = nextNodeIndex;
		if(i == (path.length -1)){
			$("#loading").hide();
			$("#foundPath").show();
			for(var j = 0 ; j < path.length; j++){
				var pathIndex = path[j].nodeIndex;
				$("#path").append("<div class='arrow_box'>" + app.nodesLabel[pathIndex] + "</div>");
			}

			clearInterval(interval);
		}
	},4000);



};

app.changeView = function(viewIndex){

	$("#view_container").viewstack({
		selectedIndex : viewIndex
	});
};


app.optimalInteger = function(arr,n){
	var optimal = _.indexOf(arr,_.max(arr,function(o){
		if(o > n)
			return 0;
		else
			return n;
	}));

	return optimal;
};

$(function() {
	$("#points").val("");
	$("#matrix").val("");

	app.changeView(0);
	var changer = 0;

	
	setInterval(function() {
		if(changer == 0){
			$("#graghNodesButton").css("border","1px dashed blue");
			changer = 1;
		} else {
			$("#graghNodesButton").css("border","1px dashed red");
			changer = 0;
		}
	},1000);

	canvas = document.getElementById('nodesCanvas'), ctx = canvas.getContext('2d');

	var pointsFileElement = document.getElementById('points');
	var maxtrixFileElement = document.getElementById('matrix');

	
	pointsFileElement.addEventListener('change', app.readPointsData, false);
	maxtrixFileElement.addEventListener('change', app.readMatrixData, false);
	
	$("#readFilesButton").on("click",app.createAdjacencyMatrixTable);
	$("#graghNodesButton").on("click",app.createNodeGraph);
	$("#computePath").on("click",app.drawPath);

});


