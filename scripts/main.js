//FIXME: Don't know why it does not let me import the state data.
// import {statesData} from "./logicData";
var monthMap = {
  'Jan': 1,
  'Feb': 2,
  'Mar': 3,
  'Apr': 4,
  'May': 5,
  'Jun': 6,
  'Jul': 7,
  'Aug': 8,
  'Sep': 9,
  'Oct': 10,
  'Nov': 11,
  'Dec': 12,
};
var statesData = [
  { label: "Alabama", value: "AL", latitude: 32.318231, longitude: -86.902298},
  { label: "Alaska", value: "AK", latitude: 63.588753, longitude: -154.493062},
  { label: "American Samoa", value: "AS" },
  { label: "Arizona", value: "AZ", latitude: 34.048928, longitude: -111.093731},
  { label: "Arkansas", value: "AR", latitude: 35.20105, longitude: -91.831833},
  { label: "California", value: "CA", latitude: 36.778261, longitude: -119.417932},
  { label: "Colorado", value: "CO", latitude: 39.550051, longitude: -105.782067},
  { label: "Connecticut", value: "CT", latitude: 41.603221, longitude: -73.087749},
  { label: "Delaware", value: "DE", latitude: 38.910832, longitude: -75.52767},
  { label: "District of Columbia", value: "DC", latitude: 38.905985, longitude: -77.033418},
  { label: "States of Micronesia", value: "FM" },
  { label: "Florida", value: "FL", latitude: 27.664827, longitude: -81.515754},
  { label: "Georgia", value: "GA", latitude: 32.157435, longitude: -82.907123},
  { label: "Guam", value: "GU" },
  { label: "Hawaii", value: "HI", latitude: 19.898682, longitude: -155.665857},
  { label: "Idaho", value: "ID", latitude: 44.068202, longitude: -114.742041},
  { label: "Illinois", value: "IL", latitude: 40.633125, longitude: -89.398528},
  { label: "Indiana", value: "IN", latitude: 40.551217, longitude: -85.602364},
  { label: "Iowa", value: "IA", latitude: 41.878003, longitude: -93.097702},
  { label: "Kansas", value: "KS", latitude: 39.011902, longitude: -98.484246},
  { label: "Kentucky", value: "KY", latitude: 37.839333, longitude: -84.270018},
  { label: "Louisiana", value: "LA", latitude: 31.244823, longitude: -92.145024},
  { label: "Maine", value: "ME", latitude: 45.253783, longitude: -69.445469},
  { label: "Marshall Islands", value: "MH" },
  { label: "Maryland", value: "MD", latitude: 39.045755, longitude: -76.641271},
  { label: "Massachusetts", value: "MA", latitude: 42.407211, longitude: -71.382437},
  { label: "Michigan", value: "MI", latitude: 44.314844, longitude: -85.602364},
  { label: "Minnesota", value: "MN", latitude: 46.729553, longitude: -94.6859},
  { label: "Mississippi", value: "MS", latitude: 32.354668, longitude: -89.398528},
  { label: "Missouri", value: "MO", latitude: 37.964253, longitude: -91.831833},
  { label: "Montana", value: "MT", latitude: 46.879682, longitude: -110.362566},
  { label: "Nebraska", value: "NE", latitude: 41.492537, longitude: -99.901813},
  { label: "Nevada", value: "NV", latitude: 38.80261, longitude: -116.419389},
  { label: "New Hampshire", value: "NH", latitude: 43.193852, longitude: -71.572395},
  { label: "New Jersey", value: "NJ", latitude: 40.058324, longitude: -74.405661},
  { label: "New Mexico", value: "NM", latitude: 34.97273, longitude: -105.032363},
  { label: "New York", value: "NY", latitude: 43.299428, longitude: -74.217933},
  { label: "North Carolina", value: "NC", latitude: 35.759573, longitude: -79.0193},
  { label: "North Dakota", value: "ND", latitude: 47.551493, longitude: -101.002012},
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Ohio", value: "OH", latitude: 40.417287, longitude: -82.907123},
  { label: "Oklahoma", value: "OK", latitude: 35.007752, longitude: -97.092877},
  { label: "Oregon", value: "OR", latitude: 43.804133, longitude: -120.554201},
  { label: "Palau", value: "PW" },
  { label: "Pennsylvania", value: "PA", latitude: 41.203322, longitude: -77.194525},
  { label: "Puerto Rico", value: "PR", latitude: 18.220833, longitude: -66.590149},
  { label: "Rhode Island", value: "RI", latitude: 41.580095, longitude: -71.477429},
  { label: "South Carolina", value: "SC", latitude: 33.836081, longitude: -81.163725},
  { label: "South Dakota", value: "SD", latitude: 43.969515, longitude: -99.901813},
  { label: "Tennessee", value: "TN", latitude: 35.517491, longitude: -86.580447},
  { label: "Texas", value: "TX", latitude: 31.968599, longitude: -99.901813},
  { label: "Utah", value: "UT", latitude: 39.32098, longitude: -111.093731},
  { label: "Vermont", value: "VT", latitude: 44.558803, longitude: -72.577841},
  { label: "Virgin Islands", value: "VI" },
  { label: "Virginia", value: "VA", latitude: 37.431573, longitude: -78.656894},
  { label: "Washington", value: "WA", latitude: 47.751074, longitude: -120.740139},
  { label: "West Virginia", value: "WV", latitude: 38.597626, longitude: -80.454903},
  { label: "Wisconsin", value: "WI", latitude: 43.78444, longitude: -88.787868},
  { label: "Wyoming", value: "WY", latitude: 43.075968, longitude: -107.290284},
];

var weatherConditions = [
  "Light Rain",
  "Overcast",
  "Mostly Cloudy",
  "Snow",
  "Light Snow",
  "Cloudy",
  "",
  "Scattered Clouds",
  "Clear",
  "Partly Cloudy",
  "Light Freezing Drizzle",
  "Light Drizzle",
  "Haze",
  "Rain",
  "Heavy Rain",
  "Fair",
  "Drizzle",
  "Fog",
  "Thunderstorms and Rain",
  "Patches of Fog",
  "Light Thunderstorms and Rain",
  "Mist",
  "Rain Showers",
  "Light Rain Showers",
  "Heavy Drizzle",
  "Smoke",
  "Light Freezing Fog",
  "Light Freezing Rain",
  "Blowing Snow",
  "Heavy Thunderstorms and Rain",
  "Heavy Snow",
  "Snow Grains",
  "Squalls",
  "Light Fog",
  "Shallow Fog",
  "Thunderstorm",
  "Light Ice Pellets",
  "Thunder",
  "Thunder in the Vicinity",
  "Fair / Windy",
  "Light Rain with Thunder",
  "Heavy Thunderstorms and Snow",
  "Light Snow Showers",
  "Cloudy / Windy",
  "Ice Pellets",
  "N/A Precipitation",
  "Light Thunderstorms and Snow",
  "T-Storm",
  "Rain / Windy",
  "Wintry Mix",
  "Partly Cloudy / Windy",
  "Heavy T-Storm",
  "Sand",
  "Light Rain / Windy",
  "Widespread Dust",
  "Mostly Cloudy / Windy",
  "Blowing Dust / Windy",
  "Blowing Dust",
  "Volcanic Ash",
  "Freezing Rain / Windy",
  "Small Hail",
  "Wintry Mix / Windy",
  "Light Snow / Windy",
  "Heavy Ice Pellets",
  "Heavy Snow / Windy",
  "Heavy Rain / Windy",
  "Heavy T-Storm / Windy",
  "Fog / Windy",
  "Dust Whirls",
  "Showers in the Vicinity",
  "Funnel Cloud",
  "Haze / Windy",
  "Light Rain Shower",
  "Smoke / Windy",
  "Light Drizzle / Windy",
  "Snow / Windy",
  "Partial Fog",
  "Light Freezing Rain / Windy",
  "Sleet",
  "Blowing Snow / Windy",
  "Snow and Sleet",
  "Snow and Sleet / Windy",
  "Squalls / Windy",
  "Light Sleet / Windy",
  "Freezing Drizzle",
  "Freezing Rain",
  "Thunder / Windy",
  "Drizzle and Fog",
  "Light Sleet",
  "Thunder / Wintry Mix / Windy",
  "Mist / Windy",
  "Light Snow and Sleet",
  "Rain Shower",
  "Sleet / Windy",
  "T-Storm / Windy",
  "Light Snow and Sleet / Windy",
  "Patches of Fog / Windy",
  "Drizzle / Windy",
  "Sand / Dust Whirls Nearby",
  "Light Rain Shower / Windy",
  "Heavy Rain Shower",
  "Thunder and Hail",
  "Drifting Snow",
  "Light Snow Shower",
  "Sand / Dust Whirlwinds",
  "Heavy Blowing Snow",
  "Hail",
  "Heavy Freezing Drizzle",
  "Low Drifting Snow",
  "Light Blowing Snow",
  "Heavy Rain Showers",
  "Light Haze",
  "Heavy Thunderstorms with Small Hail",
  "Light Snow with Thunder",
  "Heavy Snow with Thunder",
  "Thunder and Hail / Windy",
  "Tornado",
];

var promises = [d3.csv("data/preprocessed_dataset.csv"), d3.json("data/counties-albers-10m.json")];
var numericalConditionsOrder = ["=", "&gt;", "≥", "&lt;", "≤", "x"];

var numericalConditionsMap = {
  temperature: "Temperature(F)",
  humidity: "Humidity(%)",
  visibility: "Visibility(mi)",
  windspeed: "Wind_Speed(mph)",
  precipitation: "Precipitation(in)",
};
var currentData = data;
var data;
var geoData;
var activeFilters = [];
var basicVis;
var geoVis;

Promise.all(promises).then(function (files) {
  data = files[0];
  geoData = files[1];
  currentData = data;
  init();
});

function init() {
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

  const params = {
    data: currentData,
    statesData: statesData,
    geoData: geoData,
  };

  initFiltersElements();
  basicVis = new BasicVis(params);
  geoVis = new GeoVis(params);
}

var mySlider = new rSlider({
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
  width: "1250px",
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

function initFiltersElements() {
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

function setNumericalFiltersMinAndMax() {
  const visibilityValues = data.map(function (row) {
    return row["Visibility(mi)"];
  });
  document.getElementById("visibilitySlider").min = Math.min(visibilityValues);
  document.getElementById("visibilitySlider").max = Math.max(visibilityValues);

  const windspeedValues = data.map(function (row) {
    return row["Wind_Speed(mph)"];
  });
  document.getElementById("windspeedSlider").min = Math.min(windspeedValues);
  document.getElementById("windspeedSlider").max = Math.max(windspeedValues);

  const precipitationValues = data.map(function (row) {
    return row["Precipitation(in)"];
  });
  document.getElementById("visibilitySlider").min =
    Math.min(precipitationValues);
  document.getElementById("visibilitySlider").max =
    Math.max(precipitationValues);
}

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

function applyFilters() {
  var newData = data;
  if (activeFilters.time.start != "" && activeFilters.time.end != "") {
    var parseDate = d3.timeParse("%Y-%m");
    newData = newData.filter(function (row) {
      var month = new Date(parseDate(row["Start_Time"].slice(0,7))).getMonth() + 1;
      return month >= monthMap[activeFilters.time.start] && month <= monthMap[activeFilters.time.end];
    });
  }
  if (activeFilters.severity.length > 0)
    newData = newData.filter(function (row) {
      return activeFilters.severity.includes(row["Severity"]);
    });

  if (activeFilters.states.length > 0)
    newData = newData.filter(function (row) {
      return activeFilters.states.includes(row["State"]);
    });

  for (let i = 0; i < activeFilters.causes.length; ++i) {
    newData = newData.filter(function (row) {
      return row[activeFilters.causes[i]] == "True";
    });
  }

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

function updateData() {
  geoVis.updateData(currentData);
  basicVis.updateData(currentData);
}

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
