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

        // Get points and counts per state
        this.points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);

        this.statesData.forEach(stateData => this.stateCounts[stateData.label] = 0);
        this.currentData.forEach(row => this.stateCounts[this.stateMapping[row.State]] += 1);
        
        // Calculate stats
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

        // Remove all states
        svg.selectAll("path")
            .data([])
            .exit()
            .remove();

        // Add states with updated colors
        d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json").then( us => {
            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("fill", d => colorScale(stateCounts[d.properties.name]-0.000001))
                .attr("d", path)
                .style("stroke", "white");
        });
        
        // Add gradient object
        var colorScaleGradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'colorScaleGradient')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%');
            
        colorScaleGradient.selectAll('stop')
            .data([colorScale(0), colorScale(this.stateCountStats.max)])
            .enter()
            .append('stop')
            .style('stop-color', d => d)
            .attr('offset', (_, index) => {
                return index * 100 + '%';
            })

        svg.selectAll('rect')
            .data([])
            .exit()
            .remove();
        
        svg.selectAll('text')
            .data([])
            .exit()
            .remove();
        
        // Add legend and min max text
        svg.append("rect")
            .attr("class", "legendRect")
            .attr("x", width - width / 4)
            .attr("y", 10)
            .attr("width", width / 4)
            .attr("height", 10)
            .style("fill", "url(#colorScaleGradient)")
            .style("stroke", "black")
            .style("stroke-width", "0.5px");

        svg.append("text")
            .data([0])
            .attr("text-anchor", "start")
            .attr("x", width - width / 4)
            .attr("y", 30)
            .attr("dy", ".35em")
            .text(d => d);

        svg.append("text")
            .data([this.stateCountStats.max])
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", 30)
            .attr("dy", ".35em")
            .text(d => d);

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
                svg.selectAll('path')
                    .attr('transform', event.transform);
                
                svg.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize / (event.transform.k ** 0.8)) + "px");
            });

        svg.call(zoom);
    }
}