class BasicVis {

    constructor(params) {
        this.currentData = params.data;

        // Severity bar chart data
        this.marginBarChart = { top: 30, right: 30, bottom: 70, left: 60 };
        this.widthBarChart = 587 - this.marginBarChart.left - this.marginBarChart.right;
        this.heightBarChart = 325 - this.marginBarChart.top - this.marginBarChart.bottom;
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
            top: 10, right: 30, bottom: 30, left: 40
        }
        this.widthHistogram = 700 - this.marginHistogram.left - this.marginHistogram.right;
        this.heightHistogram = 175 - this.marginHistogram.top - this.marginHistogram.bottom;

        //Boxplot data
        this.xBoxplot = null;
        this.yBoxplot = null;
        this.lineBoxplot = null;
        this.rectBoxplot = null;
        this.marginBoxplot = {
            top: 10, right: 30, bottom: 30, left: 40
        }
        this.widthBoxplot = 700 - this.marginBoxplot.left - this.marginBoxplot.right;
        this.heightBoxplot = 175 - this.marginBoxplot.top - this.marginBoxplot.bottom;

        this.createBarChart();
        this.createHistogramChart();
        //this.createBoxPlotChart();
    }

    updateData(filteredData) {
        this.currentData = filteredData;
        this.updateCharts();

    }

    createBarChart() {
        var svg = d3.select("#severitychart")
            .append("svg")
            .attr("width", this.widthBarChart + this.marginBarChart.left + this.marginBarChart.right)
            .attr("height", this.heightBarChart + this.marginBarChart.top + this.marginBarChart.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.marginBarChart.left + "," + this.marginBarChart.top + ")")

        this.xBarChart = d3.scaleBand().range([0, this.widthBarChart]).padding(0.2);
        this.xAxisBarChart = svg.append("g").attr("transform", "translate(0," + this.heightBarChart + ")")

        this.yBarChart = d3.scaleLinear().range([this.heightBarChart, 0]);
        this.yAxisBarChart = svg.append("g").attr("class", "myYaxis")

        this.updateBarChart(svg)
    }

    updateBarChart(svg) {
        var chartData = [{ severity: 1, accidents: this.currentData.filter(function (d) { return d['Severity'] == 1 }).length },
        { severity: 2, accidents: this.currentData.filter(function (d) { return d['Severity'] == 2 }).length },
        { severity: 3, accidents: this.currentData.filter(function (d) { return d['Severity'] == 3 }).length },
        { severity: 4, accidents: this.currentData.filter(function (d) { return d['Severity'] == 4 }).length }];

        this.xBarChart.domain(chartData.map(function (d) { return d.severity; }))
        this.xAxisBarChart.call(d3.axisBottom(this.xBarChart))
        this.yBarChart.domain([0, d3.max(chartData, function (d) { return d.accidents })]);
        this.yAxisBarChart.transition().duration(1000).call(d3.axisLeft(this.yBarChart));

        if (!svg) var svg = d3.select("#severitychart").select("svg")

        var u = svg.selectAll("rect").data(chartData)

        const heightBarChart = this.heightBarChart;
        const xBarChart = this.xBarChart;
        const yBarChart = this.yBarChart;


        u.enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", function (d) { return xBarChart(d.severity); })
            .attr("y", function (d) { return yBarChart(d.accidents); })
            .attr("width", xBarChart.bandwidth())
            .attr("height", function (d) { return heightBarChart - yBarChart(d.accidents) })
            .attr("fill", "#69b3a2")


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
        this.updateBarChart();
        this.updateHistogramChart();
        //this.createBoxPlotChart()
    }


    createHistogramChart() {
        var svg = d3.select("#histogramchart").append("svg")
            .attr("width", this.widthHistogram + this.marginHistogram.left + this.marginHistogram.right)
            .attr("height", this.heightHistogram + this.marginHistogram.top + this.marginHistogram.bottom)
            .append("g")
            .attr("transform",
                "translate(" + this.marginHistogram.left + "," + this.marginHistogram.top + ")");

        // set the ranges
        this.xHistogram = d3.scaleTime()
            .domain([new Date(2019, 0), new Date(2020, 0)])
            .rangeRound([0, this.widthHistogram]);
        this.yHistogram = d3.scaleLinear()
            .range([this.heightHistogram, 0]);

        this.yAxisHistogram = svg.append("g");
        this.xAxisHistogram = svg.append("g").attr("transform", "translate(0," + this.heightHistogram + ")")
        // set the parameters for the histogram
        this.histogramFormatter = d3.bin()
            .value(function (d) { return d; })
            .domain(this.xHistogram.domain())
            .thresholds(this.xHistogram.ticks(d3.timeMonth));
        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin


        // format the data
        this.updateHistogramChart(svg)
    }

    updateHistogramChart(svgInput) {
        //Data extraction and formatted
        var chartData = this.currentData.map(function (d) { return d.Start_Time.slice(0, 7) });
        var parseDate = d3.timeParse("%Y-%m");
        chartData = chartData.map(function (d) {
            return parseDate(d);
        })

        //Histogram bins creation
        var bins = this.histogramFormatter(chartData)
        this.yHistogram.domain([0, d3.max(bins, function (d) { return d.length; })]);

        if (!svgInput) var svg = d3.select("#histogramchart").select("svg")
        else var svg = svgInput

        //Axis data updated
        this.yAxisHistogram.transition().duration(1000).call(d3.axisLeft(this.yHistogram));
        this.xAxisHistogram.call(d3.axisBottom(this.xHistogram));


        const xHistogram = this.xHistogram;
        const yHistogram = this.yHistogram;
        const heightHistogram = this.heightHistogram

        var u = svg.selectAll("rect").data(bins);
        u.enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("class", "bar")
            .attr("x", 1)
            .attr("transform", function (d) {
                return "translate(" + xHistogram(d.x0) + "," + yHistogram(d.length) + ")";
            })
            .attr("width", function (d) { const width = xHistogram(d.x1) - xHistogram(d.x0) - 1; if (width > 0) return width; else return 0; })
            .attr("height", function (d) { return heightHistogram - yHistogram(d.length); })
            .attr("fill", "#69b3a2");
    }

    createBoxPlotChart() {
        // append the svg object to the body of the page
        var node = document.getElementById('#boxplotchart');
        if(node)node.innerHTML = '';

        d3.select("#boxplotchart").select('svg')?.remove();

        var svg = d3.select("#boxplotchart")
            .append("svg")
            .attr("width", this.widthBoxplot + this.marginBoxplot.left + this.marginBoxplot.right)
            .attr("height", this.heightBoxplot + this.marginBoxplot.top + this.marginBoxplot.bottom)
            .append("g")
            .attr("transform",
                "translate(649 , -120) rotate(" + (90) + ")");

        this.lineBoxplot = svg.append("line");
        this.rectBoxplot = svg.append("rect")
        this.updateBoxplotChart(svg);

    }

    updateBoxplotChart(svgInput) {
       
        // create dummy data
        var chartData = this.currentData.map(function (d) { return d.Start_Time.slice(0, 7) });
        var parseDate = d3.timeParse("%Y-%m");
        chartData = chartData.map(function (d) {
            return parseDate(d).getTime();
        })


        // Compute summary statistics used for the box:
        var data_sorted = chartData.sort(d3.ascending)
        var q1 = d3.quantile(data_sorted, .25)
        var median = d3.quantile(data_sorted, .5)
        var q3 = d3.quantile(data_sorted, .75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q1 + 1.5 * interQuantileRange

        var y = d3.scaleLinear()
            .domain([d3.min(chartData), d3.max(chartData)])
            .range([this.widthBoxplot - 172, 0]);

        // svg.call(d3.axisRight(y))

        // a few features for the box
        var center = 200
        var width = 100

        if (!svgInput) var svg = d3.select("#boxplotchart").select("svg")
        else var svg = svgInput
        // Show the main vertical line
        this.lineBoxplot
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", y(min))
            .attr("y2", y(max))
            .attr("stroke", "black")

        // Show the box
        this.rectBoxplot
            .attr("x", center - width / 2)
            .attr("y", y(q3))
            .attr("height", (y(q1) - y(q3)))
            .attr("width", width)
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

        // show median, min and max horizontal lines
        var u = svg.selectAll("toto").data([min, median, max]);
        u
            .enter()
            .append("line")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x1", center - width / 2)
            .attr("x2", center + width / 2)
            .attr("y1", function (d) { return (y(d)) })
            .attr("y2", function (d) { return (y(d)) })
            .attr("stroke", "black")
    }
}