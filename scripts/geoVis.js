class GeoVis {

    constructor(params){
        this.currentData = params.data;
        this.statesData = params.statesData;
        this.stateMapping = {};
        this.stateCounts = {};
        this.stateCountStats = {};

        this.selectedState = null;
        this.selectedStatePoints = [];

        this.statesData.forEach(state => this.stateMapping[state.value] = state.label)

        this.projection = null;
        this.pointPixelSize = 3.0;

        this.createGeographicalChart();
        this.createSideChart();
    }

    updateData(filteredData){
        this.currentData = filteredData;
        this.updateCharts();
    }

    updateCharts(){
        this.updateGeographicalChart();
        this.updateSideChart();
    }

    createSideChart(){
        const svg = d3.select("#geographicalsidechart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");
        
        // // The scale and translation are recommended by the albers-10m dataset creators
        // this.projection = d3.geoAlbersUsa()
        //     .scale(1300)
        //     .translate([487.5, 305])

        var path = d3.geoPath();
        var g = svg.append("g");

        this.updateSideChart();
    }

    updateSideChart(){
        const svg = d3.select("#geographicalsidechart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        var path = d3.geoPath();
        var g = svg.append("g");
        
        var projection = this.projection;

        svg.selectAll("path")
            .data([])
            .exit()
            .remove();

        // Add states with updated colors
        d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json").then( us => {
            var state = null;

            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features.filter(d => d.properties.name == this.selectedState))
                .enter().append("path")
                .attr("fill", "lightblue")
                .attr("id", d => {state = d; return d})
                .attr("d", path)
                .style("stroke", "grey");

            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features.filter(d => d.properties.name != this.selectedState))
                .enter().append("path")
                .attr("fill", "rgb(240,240,240)")
                .attr("d", path)
                .style("stroke", "white");

            // var centroid = d3.geoCentroid(state);
            // var invertedCentroid = this.projection.invert(centroid);
            // var bounds = d3.geoBounds(state);
            // var invertedBounds = bounds.map(d => this.projection.invert(d));

            // console.log(invertedCentroid);
            // console.log(invertedBounds);

            // svg.selectAll("circle")
            //     .data(invertedBounds).enter()
            //     .append("circle")
            //     .attr("cx", d => this.projection(d)[0])
            //     .attr("cy", d => this.projection(d)[1])
            //     .attr("r", "" + this.pointPixelSize + "px")
            //     .attr("fill", "black");

            // var k = 1;

            // g.transition()
            //     .duration(750)
            //     .attr("transform", "translate(" + -width / 2 + "," + -height / 2 + ")scale(" + k + ")translate(" + invertedBounds[0][0] *5 + "," + invertedBounds[0][1] *5 + ")")
            //     .style("stroke-width", 1.5 / k + "px");

            // var dx = bounds[1][0] - bounds[0][0],
            //     dy = bounds[1][1] - bounds[0][1],
            //     x = (bounds[0][0] + bounds[1][0]) / 2,
            //     y = (bounds[0][1] + bounds[1][1]) / 2,
            //     scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            //     translate = [width / 2 - scale * x, height / 2 - scale * y];

            // g.transition()
            //      .duration(750)
            // .call( zoom.transform, d3.zoomIdentity.translate(invertedBounds[0][0] + 200, invertedBounds[0][1]) );

            // // Create interpolators
            // var interpolateTranslate = d3.interpolate(t0, projection.translate()),
            // interpolateScale = d3.interpolate(s0, projection.scale());

            // var interpolator = function(t) {
            //     projection.scale(interpolateScale(t))
            //         .translate(interpolateTranslate(t));
            //     svg.attr("d", path);
            // };

            // d3.transition()
            //     .duration(750)
            //     .tween("projection", function() {
            //     return interpolator;
            // });
        });

        // Get points and counts per state
        this.points = this.currentData
            .filter(d => this.stateMapping[d.State] == this.selectedState)
            .map(d => [
                parseFloat(parseFloat(d.Start_Lng).toFixed(1)),
                parseFloat(parseFloat(d.Start_Lat).toFixed(1))
            ]);
        
        var accidentCount = this.points.length;
        var accidentPercentage = parseFloat(this.points.length) / this.currentData.length * 100;

        var pointCoordinatesBitmap = {};

        this.points = this.points.filter(d => {
            pointCoordinatesBitmap[d[0]] = pointCoordinatesBitmap[d[0]] || {};

            if (pointCoordinatesBitmap[d[0]][d[1]] === true) {
                return false;
            } else {
                pointCoordinatesBitmap[d[0]][d[1]] = true;
                return true;
            }
        });

        // Remove text from svg
        svg.selectAll("text")
            .data([])
            .exit()
            .remove();

        var infoTexts = [
            "Accidents: " + accidentCount,
            "Accident percentage: " + (isFinite(accidentPercentage) ? accidentPercentage.toFixed(1) : 0) + "%",
        ]

        infoTexts.forEach((infoText, index) => {
            svg.append("text")
                .data([infoText])
                .attr("text-anchor", "start")
                .attr("x",30)
                .attr("y", 30 + index * 20)
                .attr("dy", ".35em")
                .text(d => d);
        })

        // Remove points from svg that aren't present
        svg.selectAll("circle")
            .data([])
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
        
        var zoom = d3.zoom()
            .scaleExtent([1, 100])
            .on('zoom', event => {
                svg.selectAll('path')
                    .attr('transform', event.transform);
                
                svg.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize / (event.transform.k ** 0.4)) + "px");
            });
        
        // Zoom to the first point if present, else go towards the center of the map
        if (this.points.length > 0) {
            svg.transition()
                .duration(750)
                .call( zoom.translateTo, + width * 2 + this.points[0][0], height / 2 + this.points[0][1] );
        } else {
            svg.transition()
                .duration(750)
                .call( zoom.translateTo, width, height / 2 )
        }

        svg.call(zoom);
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
                .style("stroke", "white")
                .on('click', event => {
                    this.selectedState = event.path[0].__data__.properties.name;
                    this.updateSideChart();
                });
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