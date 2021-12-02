var promises = [d3.csv("data/main2.csv")];
var currentData = data;
var data;
var activeFilters = [];
var basicVis;
var geoVis;

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
