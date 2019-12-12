

var cat_searched;

function updateViz(){
  var catName = document.getElementById('cat_name').value;
  cat_searched = catName;
if(catName !== null && catName !== ""){
    var request = new XMLHttpRequest();
    const url='/getnodes?catName='+catName;
    console.log(url);
    request.open("GET", url);
    request.send();
    loading();
    request.onreadystatechange = (e) => {
      treeData = JSON.parse(request.responseText);
      //console.log(treeData);
      if(!treeData["error"]){
        loading();
        document.getElementById("loader").style.display = "none";
        createViz(treeData);
      }else{
        loading();
        document.getElementById("loader").style.display = "none";
        alert("Sorry!! Product Not Found");
      }
    }
  }
}

  document.getElementById("loader").style.display = "none";
  var loading = function() {
      var x = document.getElementById("loader");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    }

// https://codepen.io/znak/pen/qapRkQ
// https://codepen.io/znak/details/qapRkQ/

var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width_svg = 1260 - margin.left - margin.right,
    height_svg = 600 - margin.top - margin.bottom;


var width = height = 100; // % of the parent element

var x = d3.scaleLinear().domain([0, width]).range([0, width]);
var y = d3.scaleLinear().domain([0, height]).range([0, height]);

var color = d3.scaleOrdinal()
        .range(d3.schemeDark2
            .map(function(c) {
                c = d3.rgb(c);
                //c.opacity = 0.5;
                return c;
            })
        )

var color_bg = d3.scaleOrdinal()
        .range(d3.schemeSet3
            .map(function(c) {
                c = d3.rgb(c);
                return c;
            })
        );

  // var d3_category20 = ['#00d618', '#02b72e', '#0cc0aa', '#0db293', '#35afa6', '#4c93e9',
  //      '#59d13e', '#5ac4f8', '#6895bc', '#6cbe55', '#6ec1f8', '#7487fb',
  //      '#769d31', '#8cb3ab', '#8e80fb', '#a08d7f', '#a88c65', '#abc34d',
  //      '#ac8bf8', '#b98829', '#ba865c', '#ca9519', '#cc9cc7', '#d759f3',
  //      '#d783b9', '#d85ee1', '#d9acc2', '#dc58ea', '#e0819f', '#e2712e',
  //      '#e76cef', '#e9af2a', '#ef6268', '#f2ac18', '#f37e2f', '#f5603a',
  //      '#fa1bfc', '#fb4e93', '#fb7810', '#fe16f4', '#ff4d82'].map(function(c) {
  //           c = d3.rgb(c);
  //           return c;
  //       });
// var color_bg_more = d3.scaleOrdinal().range(d3_category20);

var menu = [
    {
    	title: 'Move Up',
    	action: function(elm, d, i) {
        document.getElementById("up").click();
    	}
    },
    {
    	title: 'Show All Children',
    	action: function(elm, d, i) {
        create_subViz(d.data.id);
    	}
    }
  ]

var treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true); //true

var chart = d3.select("#chart").append('svg')
      .attr("width", width_svg + margin.left + margin.right)
      .attr("height", height_svg + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
      .append("foreignObject")
      .attr("width", width_svg + margin.left + margin.right)
      .attr("height", height_svg + margin.bottom + margin.top);

var div = d3.select("#maintooltip")
          .attr("class", "tooltip")
          .style("opacity", 0);

function makePath(d){
  var path="";
  var parent_data = d.parent;
  while(parent_data){
    path = parent_data.data.name+" > "+path;
    parent_data = parent_data.parent;
  }
  path = path+d.data.name;
  return path;
}

function createViz(data){
var nodes = d3.hierarchy(data)
        .sum(function(d) {return d.value ? 1 : 0; });
        //.sort(function(a, b) { return b.height - a.height || b.value - a.value });

var currentDepth = 0;

treemap(nodes);
chart.selectAll(".node")
      .remove()
      .exit()
      .transition()
      .duration(700);

var cells = chart
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("xhtml:div")
    .attr("class", function(d) { return "node level-" + d.depth; })
    // .attr("title", function(d) { return d.data.name ? d.data.name+d.data.value : "null"; })
    .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            var full_path = makePath(d);
            div.html(full_path+"<br>"+
                    "Items: "+d.data.value+"<br/>")
                .style("left", (d3.event.pageX+10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on('contextmenu', d3.contextMenu(menu));

cells
    .style("left", function(d) { return x(d.x0) + "%"; })
    .style("top", function(d) { return y(d.y0) + "%"; })
    .style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
    .style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; })
    .style("background-color", function(d) { if(d.data.name == cat_searched){return color(d.data.name);} else{return color_bg(d.data.name); }})
    .style("boarder-color", function(d){return color(d.data.name)})
    .on("click", zoom)
    .append("p")
    .attr("class", "label")
    .text(function(d) { return d.data.name ? d.data.name : "---"; });
    //.style("font-size", "")
    //.style("opacity", function(d) { return isOverflowed( d.parent ) ? 1 : 0; });

cells.append("p")
    .attr("class", "vals")
    .text(function(d) { return d.data.value ? d.data.value : ""; });

var parent = d3.select(".up")
    .datum(nodes)
    .on("click", zoom);

    function zoom(d) { // http://jsfiddle.net/ramnathv/amszcymq/

        console.log('clicked: ' + d.data.name + ', depth: ' + d.depth);
        currentDepth = d.depth;
        console.log(d);

        var path="";
        var parent_data = d.parent;
        while(parent_data){
          path = parent_data.data.name+" > "+path;
          parent_data = parent_data.parent;
        }
        path = path+d.data.name;
        console.log(path);
        document.getElementById("guide").innerHTML = path;

        parent.datum(d.parent || nodes);

        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);

        var t = d3.transition()
            .duration(800)
            .ease(d3.easeCubicOut);

        cells
            .transition(t)
            .style("left", function(d) { return x(d.x0) + "%"; })
            .style("top", function(d) { return y(d.y0) + "%"; })
            .style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
            .style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; });

        cells // hide this depth and above
            .filter(function(d) { return d.ancestors(); })
            .classed("hide", function(d) { return d.children ? true : false });

        cells // show this depth + 1 and below
            .filter(function(d) { return d.depth > currentDepth; })
            .classed("hide", false);

    }
}


function create_subViz(catId){
  if(catId !== null && catId !== ""){
      var request = new XMLHttpRequest();
      const url='/getChildren?catId='+catId;
      console.log(url);
      request.open("GET", url);
      request.send();
      loading();
      request.onreadystatechange = (e) => {
        var subVizData = JSON.parse(request.responseText);
        console.log(subVizData);
        create_subViz_map(subVizData);
        if(!subVizData["error"]){
          loading();
          document.getElementById("loader").style.display = "none";
          // createViz(treeData);
        }else{
          loading();
          document.getElementById("loader").style.display = "none";
          alert("Sorry!! Product Not Found");
        }
      }
    }
}

var subViz_width = 960,
    subViz_height = 500;

var subdiv = d3.select("#subChart").append("svg")
        .style("position", "relative")
        .style("width", subViz_width + "px")
        .style("height", subViz_height + "px")
        .append("foreignObject")
        .style("width", subViz_width + "px")
        .style("height", subViz_height + "px");

function create_subViz_map(subVizData){
  var sub_x = d3.scaleLinear().domain([0, subViz_width]).range([0, subViz_width]);
  var sub_y = d3.scaleLinear().domain([0, subViz_height]).range([0, subViz_height]);

  var sub_treemap = d3.treemap()
      .size([subViz_width, subViz_height])
      .padding(4)
      .round(true);

  subdiv.selectAll("div")
          .remove()
          .exit()
          .transition()
          .duration(700);

  var sub_nodes = d3.hierarchy(subVizData)
                  .sum(function(d) {return d.value ? 1 : 0; });

  treemap(sub_nodes);
  console.log(sub_nodes);

  subdiv.selectAll(".node")
        .data(sub_nodes.descendants())
        .enter()
        .append("xhtml:div")
        .attr("class","nodeSubtree")
        .style("left", function(d) { return d.x0 + "%"; })
        .style("top", function(d) { return d.y0 + "%"; })
        .style("width", function(d) { return sub_x(d.x1) - sub_x(d.x0) + "%"; })
        .style("height", function(d) { return sub_y(d.y1) - sub_y(d.y0) + "%"; })
        .style("background", function(d) {return color_bg(d.data.name)})
        .text(function(d) { return d.data.name; });
      }
