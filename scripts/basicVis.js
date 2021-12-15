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
    ]
    this.numberToWeek = {
      0: this.weekDays[0],
      1: this.weekDays[1],
      2: this.weekDays[2],
      3: this.weekDays[3],
      4: this.weekDays[4],
      5: this.weekDays[5],
      6: this.weekDays[6],
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
      700 - this.marginHistogram.left - this.marginHistogram.right;
    this.heightHistogram =
      275 - this.marginHistogram.top - this.marginHistogram.bottom;

    //Boxplot data
    this.xBoxplot = null;
    this.yBoxplot = null;
    this.lineBoxplot = null;
    this.rectBoxplot = null;
    this.marginBoxplot = {
      top: 10,
      right: 30,
      bottom: 30,
      left: 40,
    };
    this.widthBoxplot =
      700 - this.marginBoxplot.left - this.marginBoxplot.right;
    this.heightBoxplot =
      175 - this.marginBoxplot.top - this.marginBoxplot.bottom;

    this.createPieChart();
    this.createHistogramChart();
    this.createBoxPlot();
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
      .style("fill", "#FFFF00");
    legend
      .append("text")
      .attr("x", 70)
      .attr("y", 27)
      .text("1")
      .style("font-size", "10px")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif")
      .attr("alignment-baseline", "middle");

    legend
      .append("circle")
      .attr("cx", 120)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "#FFA500");
    legend
      .append("text")
      .attr("x", 130)
      .attr("y", 27)
      .text("2")
      .style("font-size", "10px")
      .style("font-family", "Verdana, Geneva, Tahoma, sans-serif")
      .attr("alignment-baseline", "middle");

    legend
      .append("circle")
      .attr("cx", 180)
      .attr("cy", 25)
      .attr("r", 6)
      .style("fill", "#FF0000");
    legend
      .append("text")
      .attr("x", 190)
      .attr("y", 27)
      .text("3")
      .style("font-size", "10px")
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
      .text("4")
      .style("font-size", "10px")
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

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .range(["#FFFF00", "#FFA500", "#FF0000", "#000000"]);

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
        if (d.data[1] > 0) return d.data[1];
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
  }

  createBarChart() {
    var svg = d3
      .select("#severitychart")
      .append("svg")
      .attr(
        "width",
        this.widthBarChart +
          this.marginBarChart.left +
          this.marginBarChart.right
      )
      .attr(
        "height",
        this.heightBarChart +
          this.marginBarChart.top +
          this.marginBarChart.bottom
      )
      .append("g")
      .attr(
        "transform",
        "translate(" +
          this.marginBarChart.left +
          "," +
          this.marginBarChart.top +
          ")"
      );

    this.xBarChart = d3.scaleBand().range([0, this.widthBarChart]).padding(0.2);
    this.xAxisBarChart = svg
      .append("g")
      .attr("transform", "translate(0," + this.heightBarChart + ")");

    this.yBarChart = d3.scaleLinear().range([this.heightBarChart, 0]);
    this.yAxisBarChart = svg.append("g").attr("class", "myYaxis");

    this.updateBarChart(svg);
  }

  updateBarChart(svg) {
    var chartData = [
      {
        severity: 1,
        accidents: this.currentData.filter(function (d) {
          return d["Severity"] == 1;
        }).length,
      },
      {
        severity: 2,
        accidents: this.currentData.filter(function (d) {
          return d["Severity"] == 2;
        }).length,
      },
      {
        severity: 3,
        accidents: this.currentData.filter(function (d) {
          return d["Severity"] == 3;
        }).length,
      },
      {
        severity: 4,
        accidents: this.currentData.filter(function (d) {
          return d["Severity"] == 4;
        }).length,
      },
    ];

    this.xBarChart.domain(
      chartData.map(function (d) {
        return d.severity;
      })
    );
    this.xAxisBarChart.call(d3.axisBottom(this.xBarChart));
    this.yBarChart.domain([
      0,
      d3.max(chartData, function (d) {
        return d.accidents;
      }),
    ]);
    this.yAxisBarChart.call(d3.axisLeft(this.yBarChart));

    if (!svg) var svg = d3.select("#severitychart").select("svg");

    var u = svg.selectAll("rect").data(chartData);

    const heightBarChart = this.heightBarChart;
    const xBarChart = this.xBarChart;
    const yBarChart = this.yBarChart;

    u.enter()
      .append("rect")
      .merge(u)
      .attr("x", function (d) {
        return xBarChart(d.severity);
      })
      .attr("y", function (d) {
        return yBarChart(d.accidents);
      })
      .attr("width", xBarChart.bandwidth())
      .attr("height", function (d) {
        return heightBarChart - yBarChart(d.accidents);
      })
      .attr("fill", "#69b3a2");
  }

  updateCharts() {
    //this.updateBarChart();
    this.updateHistogramChart();
    this.updatePieChart();
    this.updateBoxPlot();
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
    var chartData =this.weekDays.map(function (day) {
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

  createBoxPlot() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select("#durationchart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // create dummy data
    var data = this.currentData.map((d) => parseFloat(d["Duration"]));

    var minimum = data[0];
    var maximum = data[0];
    for (var i = 1; i < data.length; ++i) {
      if (data[i] < minimum) {
        minimum = data[i];
      }
      if (data[i] > maximum) {
        maximum = data[i];
      }
    }

    // Compute summary statistics used for the box:
    var data_sorted = data.sort(d3.ascending);
    var q1 = d3.quantile(data_sorted, 0.25);
    var median = d3.quantile(data_sorted, 0.5);
    var q3 = d3.quantile(data_sorted, 0.75);
    var interQuantileRange = q3 - q1;
    var min = q1 - 1.5 * interQuantileRange;
    var max = q1 + 1.5 * interQuantileRange;

    // Show the Y scale
    var y = d3.scaleLinear().domain([min, max]).range([height, 0]);
    svg.call(d3.axisLeft(y));

    // a few features for the box
    var center = 200;
    var width = 100;

    // Show the main vertical line
    svg
      .append("line")
      .attr("x1", center)
      .attr("x2", center)
      .attr("y1", y(min))
      .attr("y2", y(max))
      .attr("stroke", "black");

    // Show the box
    svg
      .append("rect")
      .attr("id", "boxplot_box")
      .attr("x", center - width / 2)
      .attr("y", y(q3))
      .attr("height", y(q1) - y(q3))
      .attr("width", width)
      .attr("stroke", "black")
      .style("fill", "#69b3a2");

    // show median, min and max horizontal lines
    svg
      .selectAll("toto")
      .data([min, median, max])
      .enter()
      .append("line")
      .attr("x1", center - width / 2)
      .attr("x2", center + width / 2)
      .attr("y1", function (d) {
        return y(d);
      })
      .attr("y2", function (d) {
        return y(d);
      })
      .attr("stroke", "black");

    var tooltip = d3
      .select("#durationchart")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "black")
      .style("padding", "15px")
      .style("border-radius", "5px")
      .style("color", "white");

    tooltip.append("div").text("median: " + median);
    tooltip.append("div").text("q1: " + q1);
    tooltip.append("div").text("q3: " + q3);
    tooltip.append("div").text("min: " + minimum);
    tooltip.append("div").text("max: " + maximum);

    var boxplot_box = document
      .getElementById("boxplot_box")
      .getBoundingClientRect();
    var right = boxplot_box.right + 15;
    var top = boxplot_box.top;

    d3.select("#boxplot_box")
      .on("mouseover", function () {
        return tooltip.style("visibility", "visible");
      })
      .on("mousemove", function () {
        return tooltip.style("top", top + "px").style("left", right + "px");
      })
      .on("mouseout", function () {
        return tooltip.style("visibility", "hidden");
      });
  }

  updateBoxPlot() {
    d3.select("#durationchart").select("svg").remove();
    this.createBoxPlot();
  }
}
