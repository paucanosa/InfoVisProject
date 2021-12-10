//FIXME: Don't know why it does not let me import the state data.
// import {statesData} from "./logicData";

var statesData = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "American Samoa", value: "AS" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "District of Columbia", value: "DC" },
  { label: "States of Micronesia", value: "FM" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Guam", value: "GU" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Palau", value: "PW" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virgin Islands", value: "VI" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
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

var promises = [d3.csv("data/main3.csv")];
var numericalConditionsOrder = ['=', '&gt;', '≥', '&lt;', '≤', 'x'];

var numericalConditionsMap = {
  temperature: "Temperature(F)",
  humidity: "Humidity(%)",
  visibility: "Visibility(mi)",
  windspeed: "Wind_Speed(mph)",
  precipitation: "Precipitation(in)",
};
var currentData = data;
var data;
var activeFilters = [];
var basicVis;
var geoVis;

Promise.all(promises).then(function (files) {
  data = files[0];
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
  };

  const params = {
    data: currentData,
    statesData: statesData,
  };

  initFiltersElements();
  basicVis = new BasicVis(params);
  geoVis = new GeoVis(params);
}

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
  console.log(activeFilters);
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
    console.log(index);
    console.log(numericalConditionsOrder[index + 1]);
  }
  console.log(activeFilters);
}

function applyFilters() {
  var newData = data;
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
      console.log(activeFilters[numericalConditions[i]].condition);

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
          // console.log('Greater than')
          // console.log(Number(activeFilters[numericalConditions[i]].value))
          // console.log(numericalConditionsMap[numericalConditions[i]])
          console.log(newData);
          newData = newData.filter(function (row) {
            // console.log(parseInt(row[numericalConditionsMap[numericalConditions[i]]]),Number(activeFilters[numericalConditions[i]].value))
            // console.log(parseInt(row[numericalConditionsMap[numericalConditions[i]]]) > parseInt(activeFilters[numericalConditions[i]].value))
            return (
              parseInt(row[numericalConditionsMap[numericalConditions[i]]]) >
              Number(activeFilters[numericalConditions[i]].value)
            );
          });
          console.log(newData);
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
      console.log(numericalConditionsMap[numericalConditions[i]]);
    }
  }
  currentData = newData;
  updateData();
}

function updateData() {
  geoVis.updateData(currentData);
  basicVis.updateData(currentData);
}

function changeFilterAccordion(){
  const node = document.getElementById('filteraccordionicon');
  const parentNode = document.getElementById('mainfilters');
  if(node.innerHTML=='+'){
    parentNode.className = "filters"
    node.innerHTML = '-'
  }
  else {
    node.innerHTML = '+'
    parentNode.className = "filters filters-disabled"
  }
  
}
