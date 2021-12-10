class GeoVis {

    constructor(params){
        this.currentData = params.data;
        this.statesData = params.statesData;
        this.points = [];
        this.projection = null;
        this.pointPixelSize = 3.0;

        this.createGeographicalChart()
        this.updateCharts();
    }

    updateData(filteredData){
        this.currentData = filteredData;
        console.log("GeoVis recieved new data!")
        this.updateCharts();
    }

    updateCharts(){
        this.updateGeographicalChart();
    }

    createGeographicalChart(){
        const svg = d3.select("#geographicalchart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        // The scale and translation are recommended by the albers-10m dataset creators
        this.projection = d3.geoAlbersUsa()
            .scale(1300)
            .translate([487.5, 305])

        var path = d3.geoPath();
        var g = svg.append("g");

        // Load states
        d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json").then( us => {
            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("fill", "lightblue")
                .attr("d", path)
                .style("stroke", "white");
        });

        var zoom = d3.zoom()
            .scaleExtent([1, 100])
            .on('zoom', event => {
                g.selectAll('path')
                    .attr('transform', event.transform);
                
                svg.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize / (event.transform.k ** 0.8)) + "px");
            });

        svg.call(zoom);

        this.updateGeographicalChart();
    }


    updateGeographicalChart(){
        const svg = d3.select("#geographicalchart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var path = d3.geoPath();
        var g = svg.append("g");

        this.points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);

        // Remove points from svg that aren't present
        svg.selectAll("circle")
            .data(this.points)
            .exit()
            .remove();

        // add circles to svg
        svg.selectAll("circle")
            .data(this.points).enter()
            .append("circle")
            .attr("cx", d => this.projection(d)[0])
            .attr("cy", d => this.projection(d)[1])
            .attr("r", "" + this.pointPixelSize + "px")
            .attr("fill", "red");
    }
}