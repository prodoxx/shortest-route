


var app  = {};
app.pointsData = new Array();
app.aMatrixData = new Array();
app.nodes = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'];

app.readPointsData = function(evt){
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
	  //Retrieve the first (and only!) File from the FileList object
	    var f = evt.target.files[0]; 
	
	    if (f) {
	      var r = new FileReader();
	      r.onload = function(e) { 
		     var content = e.target.result;
		     content = content.split("\r\n");
		     for(var i = 0; i < content.length;i++){
		      	var p = content[i].split(",");
		      	var ptObject = new Object();
		      	ptObject.x = parseInt(p[0]);
		      	ptObject.y = parseInt(p[1]);
		      	
		      	app.pointsData[i] = ptObject;
		     }     
		    console.log(app.pointsData);
		      
	     };
	      r.readAsText(f);
	    } else { 
	      alert("Failed to load file");
	    }
	} else {
	  alert('The File APIs are not fully supported by your browser.');
	}
};

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
		     
		    console.log(app.aMatrixData);
		      
	     };
	      r.readAsText(f);
	    } else { 
	      alert("Failed to load file");
	    }
	} else {
	  alert('The File APIs are not fully supported by your browser.');
	}
};

//http://stackoverflow.com/questions/20798477/how-to-find-index-of-all-occurrences-of-an-element-in-array
app.getChildNodes = function(arr){
	 var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === "1")
            indexes.push(i);
    return indexes;
};

app.getPathToShortestNode = function(arr){
	//var xValues = new Array();
	
	var xValues = _.map(arr,function(n){ return app.pointsData[n].x});
	
	var min = _.min(xValues);
	console.log("Min: " + min);
	
	for(var i = 0; i < arr.length; i++){
		var x = app.pointsData[arr[i]].x;
		
		if(x == min){
			return arr[i];
		}
	}
};

app.parentHasChild = function(arr,childIndex){
	var childNodes = app.getChildNodes(arr);
	var index = _.indexOf(childNodes,childIndex);
	
	if(index = -1)
		return false;
		
	return true;
	
};

app.createAdjacencyMatrixTable = function() {
	var p = $("#points").val();
	var m = $("#matrix").val();
	var mte = $("#matrixTable tbody");
	var mteTr = $("#matrixTable tbody > tr");
	
	if(p != "" && m != ""){
		var firstNode = app.pointsData[0];
		var lastNode = app.pointsData[app.pointsData.length - 1];
		
		for(var i = 0; i < app.aMatrixData.length;i++){
			if(i == 0){
				mteTr.append("<td> </td>");
			}
			mteTr.append("<th>" + app.nodes[i] + "</th>");
		}
		
		for(var k = 0; k < app.aMatrixData.length;k++){
			var lineData = app.aMatrixData[k];
			mte.append("<tr>");
			mte.append("<th>" + app.nodes[k] + "</th>");
			for(var j = 0; j < lineData.length;j++){
				mte.append("<td>" + lineData[j] + "</td>");
			}
			mte.append("</tr>");
		}
		
		
		var currentNode = firstNode;
		var pointer = 0;
		var path = new Array();
		while(!_.isEqual(currentNode,lastNode)) {
			console.log(currentNode);
			path.push(currentNode);
			var childNodesIndex = app.getChildNodes(app.aMatrixData[pointer]);
			pointer = app.getPathToShortestNode(childNodesIndex);
			var currentNode = app.pointsData[pointer];
			
			
			if(app.parentHasChild(app.aMatrixData[pointer],app.pointsData.length - 1)){
				path.add(app.pointsData.length - 1);
				break;
			}
		} 
	
			
		
	//	console.log(app.getPathToShortestNode(app.pointsData[1],app.pointsData[3],lastNode));
		
		
		
		
	} else {
		alert("You are missing a file(s)!");
	}
};


$(function() {
	$("#points").val("");
	$("#matrix").val("");
	
	var pointsFileElement = document.getElementById('points');
	var maxtrixFileElement = document.getElementById('matrix');
	
	pointsFileElement.addEventListener('change', app.readPointsData, false);
	maxtrixFileElement.addEventListener('change', app.readMatrixData, false);
	
	$("#startButton").on("click",app.createAdjacencyMatrixTable);
	
});


