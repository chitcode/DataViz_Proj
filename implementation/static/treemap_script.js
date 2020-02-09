
document.getElementById("up").innerHTML = "&nbsp;";
var cat_searched;
function updateViz(){
  var catName = document.getElementById('cat_name').value;
  cat_searched = catName;
if(catName !== null && catName !== ""){
    var request = new XMLHttpRequest();
    const url='/getnodes?catName='+encodeURIComponent(catName);
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
    	title:'Search This Category',
    	action: function(elm, d, i) {
        document.getElementById('cat_name').value = d.data.name;
        updateViz();
    	}
    },
    {
    	title: 'Show All Sub-Categories',
    	action: function(elm, d, i) {
        create_subViz(d.data.id);
    	}
    }
  ];

var menu_sub = [
  {
    title:'Search This Category',
    action: function(elm, d, i) {
      document.getElementById('cat_name').value = d.data.name;
      updateViz();
    }
  },
    {
    	title: 'Show All Sub-Categories',
    	action: function(elm, d, i) {
        create_subViz(d.data.id);
    	}
    }
];

var format = d3.format(",");

var treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(false); //true

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
  var path="<b>"+d.data.name+" ["+d.data.value+"]</b>";
  var parent_data = d.parent;
  var space_counter = 1
  while(parent_data){
    path = path+"</br>"+"&nbsp;&nbsp;".repeat(space_counter)+"&rdsh;" + parent_data.data.name+
      " ["+parent_data.data.value+"]";
    parent_data = parent_data.parent;
    space_counter = space_counter+1;
  }
  return path;
}

function createViz(data){

  var paths = document.getElementById("guide").innerHTML;
  if(paths !== null && paths !== "" && paths != 'All Categories'){
    document.getElementById("up").innerHTML = "&#8682; UP";
  }else{
    document.getElementById("up").innerHTML = "&nbsp;";
  }
var nodes = d3.hierarchy(data);
        // .sum(function(d) {return d.value ? 1 : 0; });
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
            div.html("<div class='mover'>"+full_path+"<br/><br/>"+
                    "Number of Children: "+d.data.numChildren+"<br/>"+
                    d.data.morefound+" "+d.data.name+" Cetegories Found </div>")
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

cells.append("p")
    .attr("class", "vals")
    .text(function(d) { return d.data.value ? format(d.data.value) : ""; });

var parent = d3.select(".up")
    .datum(nodes)
    .on("click", zoom);

    function zoom(d) { // http://jsfiddle.net/ramnathv/amszcymq/
        currentDepth = d.depth;

        var path="";
        var parent_data = d.parent;
        while(parent_data){
          path = parent_data.data.name+" &#10144; "+path;
          parent_data = parent_data.parent;
        }
        path = path+d.data.name;
        document.getElementById("guide").innerHTML = path;
        if(path !== null && path !== "" && path != 'All Categories'){
          document.getElementById("up").innerHTML = "&#8682; UP";
        }else{
          document.getElementById("up").innerHTML = "&nbsp;";
        }
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

var sub_x = d3.scaleLinear().domain([0, subViz_width]).range([0, subViz_width]);
var sub_y = d3.scaleLinear().domain([0, subViz_height]).range([0, subViz_height]);

var sub_treemap = d3.treemap()
    .size([subViz_width, subViz_height])
    .padding(4)
    .round(false);

function create_subViz_map(subVizData){

  subdiv.selectAll("div")
          .remove()
          .exit()
          .transition()
          .duration(700);

  var txt = "All Products";
  subVizData.pathName.forEach(pathBuilder);
  document.getElementById("nodePath").innerHTML = txt;
  function pathBuilder(value, index, array) {
        txt = txt + " &#10144; "+value;
  }

d3.select("#nodeDesc").selectAll("text").remove();
d3.select("#nodeDesc")
    .append("text")
    .style("font-size", "16px")
    .text("Num of Children: "+subVizData.numChildren+
        ",     Sub Tree Product Count: "+subVizData.value+
        ",     Products Count :"+subVizData.product_count);

  var sub_nodes = d3.hierarchy(subVizData)
                  .sum(function(d) {return d.value? 1:0;});

  treemap(sub_nodes);

  var subcells = subdiv.selectAll(".node")
        .data(sub_nodes.descendants())
        .enter()
        .append("xhtml:div")
        .attr("class","nodeSubtree")
        .style("left", function(d) { return d.x0 + "%"; })
        .style("top", function(d) { return d.y0 + "%"; })
        .style("width", function(d) { return sub_x(d.x1) - sub_x(d.x0) + "%"; })
        .style("height", function(d) { return sub_y(d.y1) - sub_y(d.y0) + "%"; })
        .style("background", function(d) {return color_bg(d.data.name)})
        .on("mouseover", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                var full_path = makePath(d);
                div.html("<div class='mover'>"+full_path+"<br/><br/>"+
                        "Number of Children: "+d.data.numChildren+"<br/>"+
                        d.data.morefound+" "+d.data.name+" Cetegories Found </div>")
                    .style("left", (d3.event.pageX+10) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on('contextmenu', d3.contextMenu(menu_sub));

      subcells.append("p")
        .attr("class", "label")
        .text(function(d) { return d.data.name; });
      subcells.append("p")
        .attr("class", "vals")
            .text(function(d) { return d.data.value ? format(d.data.value) : ""; });
      }
