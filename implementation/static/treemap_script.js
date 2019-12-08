

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


var treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(false); //true

// var data = {"id": 0, "name": "root", "value": 0, "children": [{"id": 4, "name": "Clothing, Shoes & Jewelry", "value": 1503384, "children": [{"id": 237, "name": "Men", "value": 371334, "children": [{"id": 1417, "name": "Shoes", "value": 95218, "children": [{"id": 7519, "name": "Boots", "value": 13991, "children": []}]}, {"id": 7479, "name": "Surf, Skate & Street", "value": 27727, "children": [{"id": 7480, "name": "Shoes", "value": 9158, "children": [{"id": 7520, "name": "Boots", "value": 1287, "children": []}]}]}]}, {"id": 1538, "name": "Boys", "value": 60338, "children": [{"id": 8193, "name": "Shoes", "value": 16831, "children": [{"id": 8194, "name": "Boots", "value": 3119, "children": []}]}]}, {"id": 5, "name": "Girls", "value": 78291, "children": [{"id": 5066, "name": "Shoes", "value": 21518, "children": [{"id": 8326, "name": "Boots", "value": 4510, "children": []}]}]}, {"id": 231, "name": "Women", "value": 837929, "children": [{"id": 1648, "name": "Shoes", "value": 245248, "children": [{"id": 8498, "name": "Boots", "value": 58526, "children": []}]}]}, {"id": 992, "name": "Baby", "value": 43271, "children": [{"id": 996, "name": "Baby Boys", "value": 19622, "children": [{"id": 7794, "name": "Shoes", "value": 1172, "children": [{"id": 14470, "name": "Boots", "value": 134, "children": []}]}]}, {"id": 993, "name": "Baby Girls", "value": 28667, "children": [{"id": 7792, "name": "Shoes", "value": 1700, "children": [{"id": 14847, "name": "Boots", "value": 212, "children": []}]}]}]}, {"id": 17190, "name": "Motorcycle & ATV Casual Footwear", "value": 1673, "children": [{"id": 17842, "name": "Boots", "value": 103, "children": []}]}, {"id": 14945, "name": "WF Inheritance Test Women\'s CK Custom Store", "value": 907, "children": [{"id": 19070, "name": "Boots", "value": 174, "children": []}]}]}, {"id": 10, "name": "Sports & Outdoors", "value": 532197, "children": [{"id": 2060, "name": "Snow Sports", "value": 11966, "children": [{"id": 2061, "name": "Skiing", "value": 8355, "children": [{"id": 2062, "name": "Downhill Skiing", "value": 463, "children": [{"id": 9525, "name": "Boots", "value": 125, "children": []}]}, {"id": 6065, "name": "Cross-Country Skiing", "value": 154, "children": [{"id": 9854, "name": "Boots", "value": 71, "children": []}]}, {"id": 12540, "name": "Telemark Skiing", "value": 26, "children": [{"id": 14919, "name": "Boots", "value": 22, "children": []}]}, {"id": 26721, "name": "Alpine Touring", "value": 25, "children": [{"id": 29174, "name": "Boots", "value": 1, "children": []}]}]}, {"id": 8025, "name": "Snowboarding", "value": 2399, "children": [{"id": 18467, "name": "Boots", "value": 173, "children": []}]}]}]}, {"id": 107, "name": "Automotive", "value": 331090, "children": [{"id": 739, "name": "Replacement Parts", "value": 81121, "children": [{"id": 4083, "name": "Transmission & Drive Train", "value": 2950, "children": [{"id": 4084, "name": "Clutches & Parts", "value": 803, "children": [{"id": 11146, "name": "Boots", "value": 75, "children": []}]}]}]}, {"id": 8922, "name": "Performance Parts & Accessories", "value": 22537, "children": [{"id": 11162, "name": "Drive Train", "value": 941, "children": [{"id": 11251, "name": "Clutches & Parts", "value": 388, "children": [{"id": 11252, "name": "Boots", "value": 22, "children": []}]}]}]}, {"id": 422, "name": "Motorcycle & Powersports", "value": 47699, "children": [{"id": 1680, "name": "Protective Gear", "value": 17169, "children": [{"id": 14409, "name": "Footwear", "value": 883, "children": [{"id": 14410, "name": "Boots", "value": 609, "children": []}]}]}]}]}, {"id": 356, "name": "Pet Supplies", "value": 110707, "children": [{"id": 4135, "name": "Horses", "value": 2424, "children": [{"id": 12238, "name": "Boots & Wraps", "value": 205, "children": [{"id": 12239, "name": "Boots", "value": 197, "children": []}]}]}, {"id": 357, "name": "Dogs", "value": 72403, "children": [{"id": 6738, "name": "Apparel & Accessories", "value": 9919, "children": [{"id": 11333, "name": "Boots & Paw Protectors", "value": 933, "children": [{"id": 26798, "name": "Boots", "value": 5, "children": []}]}]}]}]}]};


var chart = d3.select("#chart").append('svg')
      .attr("width", width_svg + margin.left + margin.right)
      .attr("height", height_svg + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
      .style("border", "2px solid orange")
      .append("foreignObject")
      .attr("width", width_svg + margin.left + margin.right)
      .attr("height", height_svg + margin.bottom + margin.top);

// .attr("width", width + margin.right + margin.left)
// .attr("height", height + margin.top + margin.bottom);

function createViz(data){
var nodes = d3.hierarchy(data)
        .sum(function(d) { console.log(d); return d.value ? 1 : 0; });
        //.sort(function(a, b) { return b.height - a.height || b.value - a.value });

var currentDepth = 0;

treemap(nodes);
var cells = chart
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("xhtml:div")
    .attr("class", function(d) { return "node level-" + d.depth; })
    .attr("title", function(d) { return d.data.name ? d.data.name+d.data.value : "null"; });

cells
    .style("left", function(d) { return x(d.x0) + "%"; })
    .style("top", function(d) { return y(d.y0) + "%"; })
    .style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
    .style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; })
    //.style("background-image", function(d) { return d.value ? imgUrl + d.value : ""; })
    //.style("background-image", function(d) { return d.value ? "url(http://placekitten.com/g/300/300)" : "none"; })
    //.style("background-color", function(d) { while (d.depth > 5) d = d.parent; return color(d.data.name); })
    .style("background-color", function(d) { if(d.data.name == cat_searched){return color(d.data.name);} else{return color_bg(d.data.name); }})
    .style("boarder-color", function(d){return color(d.data.name)})
    .on("click", zoom)
    .append("p")
    .attr("class", "label")
    .text(function(d) { return d.data.name ? d.data.name : "---"; });
    //.style("font-size", "")
    //.style("opacity", function(d) { return isOverflowed( d.parent ) ? 1 : 0; });

var parent = d3.select(".up")
    .datum(nodes)
    .on("click", zoom);

    function zoom(d) { // http://jsfiddle.net/ramnathv/amszcymq/

        console.log('clicked: ' + d.data.name + ', depth: ' + d.depth);

        currentDepth = d.depth;
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
