class BasicVis {
  constructor(params) {
    this.currentData = params.data;
    this.weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    this.accidentCondition = [
      "Amenity",
      "Bump",
      "Crossing",
      "Give_Way",
      "Junction",
      "No_Exit",
      "Railway",
      "Roundabout",
      "Station",
      "Stop",
      "Traffic_Calming",
      "Traffic_Signal",
      "Turning_Loop",
    ];

    this.numberToWeek = {
      0: this.weekDays[6],
      1: this.weekDays[0],
      2: this.weekDays[1],
      3: this.weekDays[2],
      4: this.weekDays[3],
      5: this.weekDays[4],
      6: this.weekDays[5],
    };

    // Severity bar chart data
    this.marginBarChart = { top: 30, right: 30, bottom: 70, left: 60 };
    this.widthBarChart =
      300 - this.marginBarChart.left - this.marginBarChart.right;
    this.heightBarChart =
      275 - this.marginBarChart.top - this.marginBarChart.bottom;
    this.xBarChart = null;
    this.yBarChart = null;
    this.xAxisBarChart = null;
    this.yAxisBarChart = null;

    // Histogram chart variables.
    this.xHistogram = null;
    this.yHistogram = null;
    this.xAxisHistogram = null;
    this.yAxisHistogram = null;
    this.histogramFormatter = null;
    this.marginHistogram = {
      top: 10,
      right: 30,
      bottom: 30,
      left: 50,
    };
    this.widthHistogram =
      500 - this.marginHistogram.left - this.marginHistogram.right;
    this.heightHistogram =
      275 - this.marginHistogram.top - this.marginHistogram.bottom;

    //Boxplot data
    this.xConditionsplot = null;
    this.yConditionsplot = null;
    this.xAxisConditionsplot = null;
    this.yAxisConditionsplot = null;
    this.lineConditionsplot = null;
    this.rectConditionsplot = null;
    this.marginConditionsplot = {
      top: 10,
      right: 5,
      bottom: 30,
      left: 40,
    };
    this.widthConditionsplot =
      925 - this.marginConditionsplot.left - this.marginConditionsplot.right;
    this.heightConditionsplot =
      275 - this.marginConditionsplot.top - this.marginConditionsplot.bottom;


    //Boxplot data
    this.xWeatherplot = null;
    this.yWeatherplot = null;
    this.xAxisWeatherplot = null;
    this.yAxisWeatherplot = null;
    this.lineWeatherplot = null;
    this.rectWeatherplot = null;
    this.marginWeatherplot = {
      top: 10,
      right: 5,
      bottom: 30,
      left: 40,
    };
    this.widthWeatherplot =
      925 - this.marginWeatherplot.left - this.marginWeatherplot.right;
    this.heightWeatherplot =
      275 - this.marginWeatherplot.top - this.marginWeatherplot.bottom;

    this.createPieChart();
    this.createHistogramChart();
    this.createConditionsplot();
    this.createWeatherPlot();
  }

  updateData(filteredData) {
    this.currentData = filteredData;
    this.updateCharts();
  }

  createPieChart() {
    // set the dimensions and margins of the graph
    const width = 250,
      height = 250,
      margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3
      .select("#severitychart")
      .append("svg")
      .attr("id", "piechartsvg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const legend = d3
      .select("#severitychart")
      .append("svg")
      .attr("width", 300)
      .attr("height", 50);

    legend
      .append("circle")
      .attr("cx", 60)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "#ffbaba");
    legend
      .append("text")
      .attr("x", 70)
      .attr("y", 27)
      .text("Low")
      .style("font-size", "8px")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif")
      .attr("alignment-baseline", "middle");

    legend
      .append("circle")
      .attr("cx", 120)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "#ff0000");
    legend
      .append("text")
      .attr("x", 130)
      .attr("y", 27)
      .text("Medium")
      .style("font-size", "8px")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif")
      .attr("alignment-baseline", "middle");

    legend
      .append("circle")
      .attr("cx", 180)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "#a70000");
    legend
      .append("text")
      .attr("x", 190)
      .attr("y", 27)
      .text("High")
      .style("font-size", "8px")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif")
      .attr("alignment-baseline", "middle");

    legend
      .append("circle")
      .attr("cx", 240)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "#000000");
    legend
      .append("text")
      .attr("x", 250)
      .attr("y", 27)
      .text("Critical")
      .style("font-size", "8px")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif")
      .attr("alignment-baseline", "middle");

    this.updatePieChart(svg);
  }

  updatePieChart(svg) {
    // set the dimensions and margins of the graph
    const width = 300,
      height = 300,
      margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    if (!svg) var svg = d3.select("#severitychart").select("svg");

    const data = {
      1: this.currentData.filter(function (d) {
        return d["Severity"] == 1;
      }).length,
      2: this.currentData.filter(function (d) {
        return d["Severity"] == 2;
      }).length,
      3: this.currentData.filter(function (d) {
        return d["Severity"] == 3;
      }).length,
      4: this.currentData.filter(function (d) {
        return d["Severity"] == 4;
      }).length,
    };

    var total_accidents = data[1] + data[2] + data[3] + data[4];

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .range(["#ffbaba", "#ff0000", "#a70000", "#000000"]);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .value(function (d) {
        return d[1];
      })
      .sort(function (a, b) {
        return d3.ascending(a.key, b.key);
      }); // This make sure that group order remains the same in the pie chart
    const data_ready = pie(Object.entries(data));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("path")
      .data(data_ready)
      .join("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1);

    svg
      .selectAll("text")
      .data(data_ready)
      .join("text")
      .text(function (d) {
        if (d.data[1] > 0)
          return ((d.data[1] * 100) / total_accidents).toFixed(2) + "%";
        else return "";
      })
      .attr("transform", function (d) {
        return `translate(${d3
          .arc()
          .innerRadius(0)
          .outerRadius(radius)
          .centroid(d)})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#FFFFFF")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif");
    
    d3.select('#piechart_tooltip').remove()

    var tooltip = d3
      .select("#severitychart")
      .append("div")
      .attr("id", "piechart_tooltip")
      .style("position", "fixed")
      .style("visibility", "hidden")
      .style("background", "black")
      .style("padding", "15px")
      .style("border-radius", "5px")
      .style("color", "white");

      tooltip.append("div").text("Low: " + data[1]);
      tooltip.append("div").text("Medium: " + data[2]);
      tooltip.append("div").text("High: " + data[3]);
      tooltip.append("div").text("Critical: " + data[4]);

    svg
    .on("mouseover", function(event){
      var severitychart_rect = document
      .getElementById("severitychart")
      .getBoundingClientRect();
      var right = severitychart_rect.right - 420;
      var top = severitychart_rect.top + 100;
      tooltip
      .style("visibility", "visible")
      .style("left", right + "px")
      .style("top", top + "px")
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });
  }

  updateCharts() {
    this.updateHistogramChart();
    this.updatePieChart();
    this.updateConditionsplot();
    this.updateWeatherPlot();
  }

  createHistogramChart() {
    // Creates the svg node and initializes the sizes.
    const svg = d3
      .select("#histogramchart")
      .append("svg")
      .attr(
        "width",
        this.widthHistogram +
          this.marginHistogram.left +
          this.marginHistogram.right
      )
      .attr(
        "height",
        this.heightHistogram +
          this.marginHistogram.top +
          this.marginHistogram.bottom
      )
      .append("g")
      .attr(
        "transform",
        `translate(${this.marginHistogram.left}, ${this.marginHistogram.top})`
      );

    // Defines X axis
    this.xHistogram = d3
      .scaleBand()
      .range([0, this.widthHistogram])
      .domain([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ])
      .padding(0.2);
    this.xAxisHistogram = svg
      .append("g")
      .attr("transform", "translate(0," + this.heightHistogram + ")");
    this.xAxisHistogram.call(d3.axisBottom(this.xHistogram));

    // Defines Y axis
    this.yHistogram = d3.scaleLinear().range([this.heightHistogram, 0]);
    this.yAxisHistogram = svg.append("g").attr("class", "myYaxis");

    this.updateHistogramChart(svg);
  }

  updateHistogramChart(svgInput) {
    //Retrieves the day of each accident
    var parseDate = d3.timeParse("%Y-%m-%d");
    const numberToWeek = this.numberToWeek;
    var filteredData = this.currentData.map(function (d) {
      const date = new Date(parseDate(d.Start_Time.slice(0, 10)));
      return numberToWeek[date.getDay()];
    });

    //Computes accidents per each day of the week in a processable manner.
    var chartData = this.weekDays.map(function (day) {
      return {
        day: day,
        value: filteredData.filter(function (d) {
          return day == d;
        }).length,
      };
    });

    if (!svgInput) var svg = d3.select("#histogramchart").select("svg");
    else var svg = svgInput;

    // Updates y Axis for the new range of values
    this.yHistogram.domain([
      0,
      Math.max.apply(
        Math,
        chartData.map(function (d) {
          return d.value;
        })
      ),
    ]);
    this.yAxisHistogram
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yHistogram));

    // Updates the bars
    var bars = svg.selectAll("rect").data(chartData);
    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => this.xHistogram(d.day))
      .attr("y", (d) => this.yHistogram(d.value))
      .attr("width", this.xHistogram.bandwidth())
      .attr("height", (d) => this.heightHistogram - this.yHistogram(d.value))
      .attr("fill", "#69b3a2");
  }

  createConditionsplot() {
    // Creates the svg node and initializes the sizes.
    const svg = d3
      .select("#durationchart")
      .append("svg")
      .attr(
        "width",
        this.widthConditionsplot +
          this.marginConditionsplot.left +
          this.marginConditionsplot.right
      )
      .attr(
        "height",
        this.heightConditionsplot +
          this.marginConditionsplot.top +
          this.marginConditionsplot.bottom
      )
      .append("g")
      .attr(
        "transform",
        `translate(${this.marginConditionsplot.left}, ${this.marginConditionsplot.top})`
      );

    // Defines X axis
    this.xConditionsplot = d3
      .scaleBand()
      .range([0, this.widthConditionsplot])
      .domain(this.accidentCondition)
      .padding(0.2);
    this.xAxisConditionsplot = svg
      .append("g")
      .attr("transform", "translate(0," + this.heightConditionsplot + ")");
    this.xAxisConditionsplot.call(d3.axisBottom(this.xConditionsplot));

    // Defines Y axis
    this.yConditionsplot = d3
      .scaleLinear()
      .range([this.heightConditionsplot, 0]);
    this.yAxisConditionsplot = svg.append("g").attr("class", "myYaxis");

    this.updateConditionsplot(svg);
  }

  updateConditionsplot(svgInput) {
    const currentData = this.currentData;
    //Adds the number of conditions on each accident
    var chartData = [
      { cause: "Amenity", value: 0 },
      { cause: "Bump", value: 0 },
      { cause: "Crossing", value: 0 },
      { cause: "Give_Way", value: 0 },
      { cause: "Junction", value: 0 },
      { cause: "No_Exit", value: 0 },
      { cause: "Railway", value: 0 },
      { cause: "Roundabout", value: 0 },
      { cause: "Station", value: 0 },
      { cause: "Stop", value: 0 },
      { cause: "Traffic_Calming", value: 0 },
      { cause: "Traffic_Signal", value: 0 },
      { cause: "Turning_Loop", value: 0 },
    ];
    currentData.forEach((element) => {
      this.accidentCondition.forEach((condition) =>
        element[condition] == "True"
          ? (chartData[
              chartData.findIndex((item) => item.cause == condition)
            ].value += 1)
          : ""
      );
    });

    if (!svgInput) var svg = d3.select("#durationchart").select("svg");
    else var svg = svgInput;

    // Updates y Axis for the new range of values
    this.yConditionsplot.domain([
      0,
      Math.max.apply(
        Math,
        chartData.map(function (d) {
          return d.value;
        })
      ),
    ]);
    this.yAxisConditionsplot
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yConditionsplot));

    // Updates the bars
    var bars = svg.selectAll("rect").data(chartData);
    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => this.xConditionsplot(d.cause))
      .attr("y", (d) => this.yConditionsplot(d.value))
      .attr("width", this.xConditionsplot.bandwidth())
      .attr(
        "height",
        (d) => this.heightConditionsplot - this.yConditionsplot(d.value)
      )
      .attr("fill", "#69b3a2");
  }

  createWeatherPlot() {
    // Creates the svg node and initializes the sizes.
    const svg = d3
      .select("#weatherchart")
      .append("svg")
      .attr(
        "width",
        this.widthWeatherplot +
          this.marginWeatherplot.left +
          this.marginWeatherplot.right
      )
      .attr(
        "height",
        this.heightWeatherplot +
          this.marginWeatherplot.top +
          this.marginWeatherplot.bottom
      )
      .append("g")
      .attr(
        "transform",
        `translate(${this.marginWeatherplot.left}, ${this.marginWeatherplot.top})`
      );

    // Defines X axis
    this.xWeatherplot = d3
      .scaleBand()
      .range([0, this.widthWeatherplot])
      .padding(0.2);
    this.xAxisWeatherplot = svg
      .append("g")
      .attr("transform", "translate(0," + this.heightWeatherplot + ")");
    this.xAxisWeatherplot.call(d3.axisBottom(this.xWeatherplot));

    // Defines Y axis
    this.yWeatherplot = d3
      .scaleLinear()
      .range([this.heightWeatherplot, 0]);
    this.yAxisWeatherplot = svg.append("g").attr("class", "myYaxis");

    this.updateWeatherPlot(svg);
  }

  async updateWeatherPlot(svgInput) {
    const currentData = this.currentData;
    //Adds the number of conditions on each accident
    var chartData = [];
    var weatherConditions = [];

    await fetch("../data/basicData.json")
      .then((mockResponses) => {
        return mockResponses.json();
      })
      .then((data) => {
        weatherConditions = data["weatherConditions"]
      });
    
    weatherConditions.forEach((condition) => {
      chartData.push({ weather: condition, value: 0 });
    });
    currentData.forEach((element) => {
      chartData[
        chartData.findIndex((item) => item.weather == element['Weather_Condition'])
      ].value += 1
    });
    chartData.sort((a, b) => {
      return b.value - a.value;
    });
    chartData = chartData.splice(0,15);

    if (!svgInput) var svg = d3.select("#weatherchart").select("svg");
    else var svg = svgInput;

    //Updates x Axis for the new 15 categories of weather
    this.xWeatherplot.domain(chartData.map(item=>{return item.weather}));
    this.xAxisWeatherplot.call(d3.axisBottom(this.xWeatherplot));

    // Updates y Axis for the new range of values
    this.yWeatherplot.domain([
      0,
      Math.max.apply(
        Math,
        chartData.map(function (d) {
          return d.value;
        })
      ),
    ]);
    this.yAxisWeatherplot
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yWeatherplot));

    // Updates the bars
    var bars = svg.selectAll("rect").data(chartData);
    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => this.xWeatherplot(d.weather))
      .attr("y", (d) => this.yWeatherplot(d.value))
      .attr("width", this.xWeatherplot.bandwidth())
      .attr(
        "height",
        (d) => this.heightWeatherplot - this.yWeatherplot(d.value)
      )
      .attr("fill", "#69b3a2");
  }
}
