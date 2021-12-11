class BasicVis {
  constructor(params) {
    this.currentData = params.data;

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
    const width = 300,
    height = 300,
    margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#severitychart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);

    this.updatePieChart(svg)
  }

  updatePieChart(svg) {
    // set the dimensions and margins of the graph
    const width = 300,
    height = 300,
    margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - margin;

    if (!svg) var svg = d3.select("#severitychart").select("svg");

    const data = {1: this.currentData.filter(function (d) {return d["Severity"] == 1;}).length,
                  2: this.currentData.filter(function (d) {return d["Severity"] == 2;}).length,
                  3: this.currentData.filter(function (d) {return d["Severity"] == 3;}).length,
                  4: this.currentData.filter(function (d) {return d["Severity"] == 4;}).length}

    // set the color scale
    const color = d3.scaleOrdinal()
    .range(["#ff7b7b", "#ff5252", "#ff0000", "#a70000"])

    // Compute the position of each group on the pie:
    const pie = d3.pie()
    .value(function(d) {return d[1]; })
    .sort(function(a, b) { return d3.ascending(a.key, b.key);} ) // This make sure that group order remains the same in the pie chart
    const data_ready = pie(Object.entries(data))

    // map to data
    const u = svg.selectAll("path")
      .data(data_ready)

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u
      .join('path')
      .transition()
      .duration(1000)
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(radius)
      )
      .attr('fill', function(d){ return(color(d.data[0])) })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
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
    this.yAxisBarChart
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yBarChart));

    if (!svg) var svg = d3.select("#severitychart").select("svg");

    var u = svg.selectAll("rect").data(chartData);

    const heightBarChart = this.heightBarChart;
    const xBarChart = this.xBarChart;
    const yBarChart = this.yBarChart;

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
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

    // const elements = document.getElementsByClassName('labels');
    // while (elements.length > 0) {
    //     elements[0].parentNode.removeChild(elements[0]);
    // }
    // var bar = svg.selectAll(".bar")
    //     .data(chartData)
    //     .enter().append("g").attr('class', 'labels');

    // bar.append("text")
    //     .attr("x", function (d) {
    //         return xBarChart(d.severity) + 62;
    //     })
    //     .attr("text-anchor", "end")
    //     .attr("y", function (d) {
    //         return yBarChart(d.accidents) + 10;
    //     })
    //     .attr("dy", ".35em")
    //     .text(function (d) {
    //         return d.accidents <= 0 ? '' : d.accidents;
    //     });
  }

  updateCharts() {
    //this.updateBarChart();
    this.updateHistogramChart();
    this.updatePieChart();
    this.updateBoxPlot()
  }

  createHistogramChart() {
    var svg = d3
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
        "translate(" +
          this.marginHistogram.left +
          "," +
          this.marginHistogram.top +
          ")"
      );

    // set the ranges
    this.xHistogram = d3
      .scaleTime()
      .domain([new Date(2019, 0), new Date(2020, 0)])
      .rangeRound([0, this.widthHistogram]);
    this.yHistogram = d3.scaleLinear().range([this.heightHistogram, 0]);

    this.yAxisHistogram = svg.append("g");
    this.xAxisHistogram = svg
      .append("g")
      .attr("transform", "translate(0," + this.heightHistogram + ")");
    // set the parameters for the histogram
    this.histogramFormatter = d3
      .bin()
      .value(function (d) {
        return d;
      })
      .domain(this.xHistogram.domain())
      .thresholds(this.xHistogram.ticks(d3.timeMonth));
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin

    // format the data
    this.updateHistogramChart(svg);
  }

  updateHistogramChart(svgInput) {
    //Data extraction and formatted
    var chartData = this.currentData.map(function (d) {
      return d.Start_Time.slice(0, 7);
    });
    var parseDate = d3.timeParse("%Y-%m");
    chartData = chartData.map(function (d) {
      return parseDate(d);
    });

    //Histogram bins creation
    var bins = this.histogramFormatter(chartData);
    this.yHistogram.domain([
      0,
      d3.max(bins, function (d) {
        return d.length;
      }),
    ]);

    if (!svgInput) var svg = d3.select("#histogramchart").select("svg");
    else var svg = svgInput;

    //Axis data updated
    this.yAxisHistogram
      .transition()
      .duration(1000)
      .call(d3.axisLeft(this.yHistogram));
    this.xAxisHistogram.call(d3.axisBottom(this.xHistogram));

    const xHistogram = this.xHistogram;
    const yHistogram = this.yHistogram;
    const heightHistogram = this.heightHistogram;

    var u = svg.selectAll("rect").data(bins);
    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("class", "bar")
      .attr("x", 1)
      .attr("transform", function (d) {
        return (
          "translate(" + xHistogram(d.x0) + "," + yHistogram(d.length) + ")"
        );
      })
      .attr("width", function (d) {
        const width = xHistogram(d.x1) - xHistogram(d.x0) - 1;
        if (width > 0) return width;
        else return 0;
      })
      .attr("height", function (d) {
        return heightHistogram - yHistogram(d.length);
      })
      .attr("fill", "#69b3a2");
  }

  createBoxPlot() {
    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#durationchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // create dummy data
    var data = this.currentData.map(d => parseFloat(d['Start_Lng']))
    
    // Compute summary statistics used for the box:
    var data_sorted = data.sort(d3.ascending)
    var q1 = d3.quantile(data_sorted, .25)
    var median = d3.quantile(data_sorted, .5)
    var q3 = d3.quantile(data_sorted, .75)
    var interQuantileRange = q3 - q1
    var min = q1 - 1.5 * interQuantileRange
    var max = q1 + 1.5 * interQuantileRange

    // Show the Y scale
    var y = d3.scaleLinear()
    .domain([-200,0])
    .range([height, 0]);
    svg.call(d3.axisLeft(y))

    // a few features for the box
    var center = 200
    var width = 100

    // Show the main vertical line
    svg
    .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min) )
    .attr("y2", y(max) )
    .attr("stroke", "black")

    // Show the box
    svg
    .append("rect")
    .attr("x", center - width/2)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", width )
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

    // show median, min and max horizontal lines
    svg
    .selectAll("toto")
    .data([min, median, max])
    .enter()
    .append("line")
    .attr("x1", center-width/2)
    .attr("x2", center+width/2)
    .attr("y1", function(d){ return(y(d))} )
    .attr("y2", function(d){ return(y(d))} )
    .attr("stroke", "black")
  }

  updateBoxPlot() {
    d3.select('#durationchart').select('svg').remove()
    this.createBoxPlot()
  }
}
