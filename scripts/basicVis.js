class BasicVis {

    constructor(params) {
        this.currentData = params.data;
        this.marginBarChart = { top: 30, right: 30, bottom: 70, left: 60 };
        this.widthBarChart = 587 - this.marginBarChart.left - this.marginBarChart.right;
        this.heightBarChart = 325 - this.marginBarChart.top - this.marginBarChart.bottom;
        this.xBarChart = null;
        this.yBarChart = null;
        this.xAxisBarChart = null;
        this.yAxisBarChart = null;
        this.createBarChart();

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
        const node = document.getElementById("basic-container");
        this.updateBarChart();
        // node.innerHTML = '';
        // node.innerHTML = "<p class='filters-title'>"+this.currentData.length+" car accidents</p>";
    }
}