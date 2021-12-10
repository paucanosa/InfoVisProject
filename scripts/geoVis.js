class GeoVis {

    constructor(params){
        this.currentData = params.data;
        this.statesData = params.statesData;
        this.stateMapping = {};
        this.stateCounts = {};
        this.stateCountStats = {};

        this.statesData.forEach(state => this.stateMapping[state.value] = state.label)

        this.projection = null;
        this.pointPixelSize = 3.0;

        this.createGeographicalChart();
    }

    updateData(filteredData){
        this.currentData = filteredData;
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

        // var geoVis = this;
        // var samplePoints = [[-80, 30]];
        // add circles to svg
        // svg.selectAll("circle")
        //     .data(samplePoints).enter()
        //     .append("circle")
        //     .attr("cx", d => this.projection(d)[0])
        //     .attr("cy", d => this.projection(d)[1])
        //     .attr("r", "" + this.pointPixelSize + "px")
        //     .attr("fill", "black");

        this.updateGeographicalChart();
    }


    updateGeographicalChart(){
        const svg = d3.select("#geographicalchart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var path = d3.geoPath();
        var g = svg.append("g");

        this.points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);

        this.statesData.forEach(stateData => this.stateCounts[stateData.label] = 0);
        this.currentData.forEach(row => this.stateCounts[this.stateMapping[row.State]] += 1);
        
        this.stateCountStats = {
            'min': 0,
            'max': 0,
            'total': 0,
            'mean': 0.0
        };

        for (let [state, count] of Object.entries(this.stateCounts)) {
            this.stateCountStats.total += count;
            if (count < this.stateCountStats.min) {
                this.stateCountStats.min = count;
            }
            if (count > this.stateCountStats.max) {
                this.stateCountStats.max = count;
            }
        };

        this.stateCountStats.mean = parseFloat(this.stateCountStats.total) / Object.entries(this.stateCounts).length

        var colorScale = d3.scaleLinear()
            .domain([-0.000001,this.stateCountStats.max])
            .range(["lightblue", "darkblue"]);

        var stateCounts = this.stateCounts;

        svg.selectAll("path")
            .data([])
            .exit()
            .remove();

        d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json").then( us => {
            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("fill", d => colorScale(stateCounts[d.properties.name]-0.000001))
                .attr("d", path)
                .style("stroke", "white");
        });

        // // Remove points from svg that aren't present
        // svg.selectAll("circle")
        //     .data(this.points)
        //     .exit()
        //     .remove();

        // // add circles to svg
        // svg.selectAll("circle")
        //     .data(this.points).enter()
        //     .append("circle")
        //     .attr("cx", d => this.projection(d)[0])
        //     .attr("cy", d => this.projection(d)[1])
        //     .attr("r", "" + this.pointPixelSize + "px")
        //     .attr("fill", "red");

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
    }
}