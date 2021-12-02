var promises = [d3.csv("data/main2.csv")];
var currentData = data;
var data;
var activeFilters = [];
var basicVis;
var geoVis;
// const width = 1000;
// const height = 600;
// const margin = {top: 20, right: 20, bottom: 100, left: 100};
// const graphWidth = width - margin.left - margin.right;
// const graphHeight = height - margin.top - margin.bottom;

//[
//    {“Period”: “Q1–2020”, “Amount”: 1000000},
 //   {“Period”: “Q2–2020”, “Amount”: 875000},
 //   {“Period”: “Q3–2020”, “Amount”: 920000},
  //  {“Period”: “Q4–2020”, “Amount”: 400000}
  //]
Promise.all(promises).then(function(files){
  data = files[0]
  currentData = data;
  init();
})

function init(){
  activeFilters = {
    severity : [],
    states:[],
    causes: []
  }
  const params = {
    data : currentData
  }
  basicVis = new BasicVis(params);
  geoVis = new GeoVis(params);
}

function initFiltersElements(){
  // TODO: CREATE THIS METHOD TO INITIALIZE THE FILTERS SECTION
}

function changeFilter(type,value){
  if(type=="Severity"){
    if(activeFilters.severity.includes(value)) activeFilters.severity = activeFilters.severity.filter(function(row){return row != value});
    else activeFilters.severity.push(value)
  }
  if(type=="States"){
    if(activeFilters.states.includes(value)) activeFilters.states = activeFilters.states.filter(function(row){return row != value});
    else activeFilters.states.push(value)
  }
  if(type=="Cause"){
    if(activeFilters.causes.includes(value)) activeFilters.causes = activeFilters.causes.filter(function(row){return row != value});
    else activeFilters.causes.push(value)
  }
}

 
function applyFilters(){
  var newData = data;
  if(activeFilters.severity.length > 0)
    newData = newData.filter(function(row){ return activeFilters.severity.includes(row['Severity']) });
  if(activeFilters.states.length > 0)
    newData = newData.filter(function(row){ return activeFilters.states.includes(row['State']) });
  console.log(activeFilters.causes)
  for(let i = 0; i < activeFilters.causes.length; ++i){
    newData = newData.filter(function(row){ return row[activeFilters.causes[i]]=="True"});
  }

  currentData = newData;
  updateData()
}

function updateData(){
  geoVis.updateData(currentData);
  basicVis.updateData(currentData);
}

// const svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height);
// const graph = svg.append('g')
//   .attr('width', graphWidth)
//   .attr('height', graphHeight)
//   .attr('transform', `translate(${margin.left}, ${margin.top})`);
// const gXAxis = graph.append('g')
//   .attr('transform', `translate(0, ${graphHeight})`);
// const gYAxis = graph.append('g')



// d3.csv("data/main.csv").then( function(csv) {
//     csv = csv.filter(function(row) {
//         return row['State'] == 'OH';
//     })
//     var newData = []
//     newData.push({'Severity':'1','Amount': csv.filter(function(row){return row['Severity']==1}).length })
//     newData.push({'Severity':'2','Amount': csv.filter(function(row){return row['Severity']==2}).length })
//     newData.push({'Severity':'3','Amount': csv.filter(function(row){return row['Severity']==3}).length })
//     console.log(newData);
//     const y = d3.scaleLinear()
//       .domain([0, d3.max(newData, d => d.Amount)])
//       .range([graphHeight, 0]);
//     const x = d3.scaleBand()
//       .domain(newData.map(item => item.Severity))
//       .range([0, 500])
//       .paddingInner(0.2)
//       .paddingOuter(0.2);
//     const rects = graph.selectAll('rect')
//       .data(newData);
//     rects.attr('width', x.bandwidth)
//       .attr('class', 'bar-rect')
//       .attr('height', d => graphHeight - y(d.Amount))
//       .attr('x', d => x(d.Severity))
//       .attr('y', d => y(d.Amount));
//     rects.enter()
//       .append('rect')
//       .attr('class', 'bar-rect')
//       .attr('width', x.bandwidth)
//       .attr('height', d => graphHeight - y(d.Amount))
//       .attr('x', d => x(d.Severity))
//       .attr('y', d => y(d.Amount));
//     const xAxis = d3.axisBottom(x);
//     const yAxis = d3.axisLeft(y)
//       .ticks(5)
//       .tickFormat(d => `${d}`);
//     gXAxis.call(xAxis);
//     gYAxis.call(yAxis);
//     gXAxis.selectAll('text')
//       .style('font-size', 14);
   
//     gYAxis.selectAll('text')
//       .style('font-size', 14);
// });
