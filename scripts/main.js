var promises = [d3.csv("data/preprocessed_dataset.csv"), d3.json("data/counties-albers-10m.json")];
var numericalConditionsOrder = ["=", "&gt;", "≥", "&lt;", "≤", "x"];
var numericalConditionsMap = {
  temperature: "Temperature(F)",
  humidity: "Humidity(%)",
  visibility: "Visibility(mi)",
  windspeed: "Wind_Speed(mph)",
  precipitation: "Precipitation(in)",
};
var weatherConditions;
var currentData = data;
var data;
var geoData;
var activeFilters = [];
var basicVis;
var geoVis;
var mySlider;
var monthMap;
var statesData;

Promise.all(promises).then(function (files) {
  data = files[0];
  geoData = files[1];
  currentData = data;
  init();
});

 /**
   * Initializes the variables with default data, creates visualization modules
   * and initializes filters.
   */
async function init() {
  activeFilters = {
    severity: [],
    states: [],
    causes: [],
    weatherConditions: [],
    humidity: { value: null, condition: "×" },
    temperature: { value: null, condition: "×" },
    visibility: { value: null, condition: "×" },
    windspeed: { value: null, condition: "×" },
    precipitation: { value: null, condition: "×" },
    time: { start: "Jan", end: "Dec", type: "Months" },
  };
  
  await fetch("../data/basicData.json")
  .then((mockResponses) => {
    return mockResponses.json();
  })
  .then((data) => {
    monthMap = data["monthmap"]
    weatherConditions = data["weatherConditions"]
    statesData = data["statesData"]
  });
  
  const params = {
    data: currentData,
    statesData: statesData,
    geoData: geoData,
  };
  
  initFiltersElements();
  basicVis = new BasicVis(params);
  geoVis = new GeoVis(params);
}

 /**
   * Creates the slider element using the rSlider library. Also specifies the function to call when selection changes.
   *
   */
createSlider();
function createSlider(){
mySlider = new rSlider({
  target: "#sampleSlider",
  values: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  range: true,
  width: "1350px",
  tooltip: false,
  scale: true,
  labels: true,
  set: ["Jan", "Dec"],
  onChange: function (values) {
    activeFilters.time.start = values.toString().substring(0, 3);
    activeFilters.time.end = values.toString().substring(4,7);
    applyFilters();
  },
});
}

 /**
   * Sets new filter month, calls for updating data and updates styling.
   *
   * @param {string} month Month to be set in the filter.
   */
function setUniqueMonthFilter(month){
  const buttonMonth = document.getElementById('timebutton'+month);
  const previousButtonMonth = document.getElementById('timebutton'+activeFilters.time.start)
  previousButtonMonth.className ="time-button"
  buttonMonth.className = "time-button time-button-active";
  activeFilters.time.start = month;
  activeFilters.time.end = month;
  applyFilters();
}

 /**
   * Changes the time-filter mode, and updates current time-filter.
   */
function swapTimeFilterMethod(){
  const swapButton = document.getElementById('swaptimebutton');
  const buttonsSet = document.getElementById('timebuttonsset');
  const sliderContainer = document.getElementById('slider-container')
  if(swapButton.innerHTML=="Buttons"){
    [
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].forEach(item=>document.getElementById('timebutton'+item).className="time-button")
    swapButton.innerHTML = "Slider";
    buttonsSet.className = "time-buttons-container"
    sliderContainer.className = "main-slider-item display-none"
    activeFilters.time.start = "Jan"
    activeFilters.time.end = "Jan"
    const buttonMonth = document.getElementById('timebuttonJan');
    buttonMonth.className = "time-button time-button-active";
    applyFilters()
  }
  else{
    swapButton.innerHTML = "Buttons"
    buttonsSet.className = "time-buttons-container display-none"
    sliderContainer.className = "main-slider-item"
    mySlider.setValues('Jan','Dec')
    activeFilters.time.start = "Jan"
    activeFilters.time.end = "Dec"
    applyFilters()
  }
}

 /**
   * Initializes the filters elements inside the filter container.
   */
function initFiltersElements() {

  // Inits states elements and sets a changeFilter function.
  var parentNode = document.getElementById("statesfilters");
  for (let i = 0; i < statesData.length; ++i) {
    var div = document.createElement("div");
    div.className = "filters-conditional-item filters-conditional-item--states";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = "f_" + statesData[i].value;
    input.value = "f_" + statesData[i].value;
    input.onclick = function () {
      changeFilter("States", statesData[i].value);
    };
    var label = document.createElement("label");
    label.htmlFor = "f_" + statesData[i].value;
    label.className = "filter-label";
    label.innerHTML = statesData[i].label;
    div.appendChild(input);
    div.appendChild(label);
    parentNode.appendChild(div);
  }

  // Inits weatherConditions elements and sets a changeFilter function.
  parentNode = document.getElementById("weatherconditions");
  for (let i = 0; i < weatherConditions.length; ++i) {
    var div = document.createElement("div");
    div.className = "filters-conditional-item filters-conditional-item--states";
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = "f_" + weatherConditions[i];
    input.value = "f_" + weatherConditions[i];
    input.onclick = function () {
      changeFilter("Weather Conditions", weatherConditions[i]);
    };
    var label = document.createElement("label");
    label.htmlFor = "f_" + weatherConditions[i];
    label.className = "filter-label";
    label.innerHTML = weatherConditions[i];
    div.appendChild(input);
    div.appendChild(label);
    parentNode.appendChild(div);
  }
}

 /**
   * Changes the current filters.
   *
   * @param {string} type Type of filter to be changed.
   * @param {any} value New value to be set in the filter.
   * 
   */
function changeFilter(type, value) {
  if (type == "Severity") {
    if (activeFilters.severity.includes(value))
      activeFilters.severity = activeFilters.severity.filter(function (row) {
        return row != value;
      });
    else activeFilters.severity.push(value);
  } else if (type == "States") {
    if (activeFilters.states.includes(value))
      activeFilters.states = activeFilters.states.filter(function (row) {
        return row != value;
      });
    else activeFilters.states.push(value);
  } else if (type == "Cause") {
    if (activeFilters.causes.includes(value))
      activeFilters.causes = activeFilters.causes.filter(function (row) {
        return row != value;
      });
    else activeFilters.causes.push(value);
  } else if (type == "Weather Conditions") {
    if (activeFilters.weatherConditions.includes(value))
      activeFilters.weatherConditions = activeFilters.weatherConditions.filter(
        function (row) {
          return row != value;
        }
      );
    else activeFilters.weatherConditions.push(value);
  } else {
    activeFilters[type].value = value;
    const nodeSlider = document.getElementById(type + "Slide");
    const nodeInput = document.getElementById(type + "Input");
    if (!isNaN(Number(value))) {
      if (nodeSlider.max >= Number(value) && nodeSlider.min <= Number(value)) {
        nodeInput.value = value;
        nodeSlider.value = value;
      } else {
        nodeInput.value = nodeSlider.min;
        nodeSlider.value = nodeSlider.min;
      }
    }
  }
}

/**
   * Changes the weather numerical condition between <,<=,>,>=,=,x
   *
   * @param {string} filtertype Type of weather condition.
   */
function changeNumericalCondition(filtertype) {
  var node = document.getElementById(filtertype + "condition");
  const currentCondition = node.innerHTML;
  const index = numericalConditionsOrder.indexOf(currentCondition);
  if (index == numericalConditionsOrder.length - 1) {
    node.innerHTML = numericalConditionsOrder[0].toString();
    node.className = "numerical-condition-button";
    activeFilters[filtertype].condition = numericalConditionsOrder[0];
  } else {
    node.innerHTML = numericalConditionsOrder[index + 1];
    node.className =
      index == numericalConditionsOrder.length - 2
        ? "numerical-condition-button numerical-condition-button--off"
        : "numerical-condition-button";
    activeFilters[filtertype].condition = numericalConditionsOrder[index + 1];
  }
}

/**
   * Apply weather conditions using the active filters and calls for updating the data in the charts.
   */
async function applyFilters() {
  var newData = data;
  // Time filter
  if (activeFilters.time.start != "" && activeFilters.time.end != "") {
    var parseDate = d3.timeParse("%Y-%m");
    if(monthMap==undefined)
    await fetch("../data/basicData.json")
    .then((mockResponses) => {
      return mockResponses.json();
    })
    .then((data) => {
      monthMap = data["monthmap"]
    });
    newData = newData.filter(function (row) {
      var month = new Date(parseDate(row["Start_Time"].slice(0,7))).getMonth() + 1;
      return month >= monthMap[activeFilters.time.start] && month <= monthMap[activeFilters.time.end];
    });
  }
  // Severity filter
  if (activeFilters.severity.length > 0)
    newData = newData.filter(function (row) {
      return activeFilters.severity.includes(row["Severity"]);
    });

  // States filter
  if (activeFilters.states.length > 0)
    newData = newData.filter(function (row) {
      return activeFilters.states.includes(row["State"]);
    });

  // Accidents conditions filter
  for (let i = 0; i < activeFilters.causes.length; ++i) {
    newData = newData.filter(function (row) {
      return row[activeFilters.causes[i]] == "True";
    });
  }

  // Weather conditions filter
  for (let i = 0; i < activeFilters.weatherConditions.length; ++i) {
    newData = newData.filter(function (row) {
      return activeFilters.weatherConditions.includes(row["Weather_Condition"]);
    });
  }

  const numericalConditions = [
    "temperature",
    "visibility",
    "humidity",
    "windspeed",
    "precipitation",
  ];
  for (let i = 0; i < numericalConditions.length; ++i) {
    if (activeFilters[numericalConditions[i]].condition != "×") {
      switch (activeFilters[numericalConditions[i]].condition) {
        case "=":
          newData = newData.filter(function (row) {
            return (
              row[numericalConditionsMap[numericalConditions[i]]] ==
              Number(activeFilters[numericalConditions[i]].value)
            );
          });
          break;
        case "&gt;":
          newData = newData.filter(function (row) {
            return (
              parseInt(row[numericalConditionsMap[numericalConditions[i]]]) >
              Number(activeFilters[numericalConditions[i]].value)
            );
          });
          break;
        case "≥":
          newData = newData.filter(function (row) {
            return (
              row[numericalConditionsMap[numericalConditions[i]]] >=
              Number(activeFilters[numericalConditions[i]].value)
            );
          });
          break;
        case "&lt;":
          newData = newData.filter(function (row) {
            return (
              row[numericalConditionsMap[numericalConditions[i]]] <
              Number(activeFilters[numericalConditions[i]].value)
            );
          });
          break;
        case "≤":
          newData = newData.filter(function (row) {
            return (
              row[numericalConditionsMap[numericalConditions[i]]] <=
              Number(activeFilters[numericalConditions[i]].value)
            );
          });
          break;
      }
    }
  }
  currentData = newData;
  updateData();
}

/**
   * Updates data in the geographical and basic visualization modules.
   */
function updateData() {
  geoVis.updateData(currentData);
  basicVis.updateData(currentData);
}

/**
   * NOT ACTIVE (for performance issues)
   * 
   * Generates a time animation given the current range of time.
   */
async function time(ms) { return new Promise(res => setTimeout(res, ms)); }
async function generateTimeProgress(){
  var parseDate = d3.timeParse("%Y-%m-%d");
  var currentDay = new Date(activeFilters.time.start+" 1, 2019")
  var dataBeforeProgress = currentData;
  var newData = currentData
  while(currentDay.getMonth() < (monthMap[activeFilters.time.end])){
    newData = dataBeforeProgress.filter(function (row) {
      var date = new Date(parseDate(row["Start_Time"].slice(0,10)));
      return date.getTime()<=currentDay.getTime();
    });
    currentData = newData;
    updateData();
    await time(50);
    currentDay.setDate(currentDay.getDate()+1);
  }
}

/**
   * Updates the classes in the filter container to hide/show the panel with an accordion animation.
   */
function changeFilterAccordion() {
  const node = document.getElementById("filteraccordionicon");
  const parentNode = document.getElementById("mainfilters");
  if (node.innerHTML == "+") {
    parentNode.className = "filters";
    node.innerHTML = "-";
  } else {
    node.innerHTML = "+";
    parentNode.className = "filters filters-disabled";
  }
}
