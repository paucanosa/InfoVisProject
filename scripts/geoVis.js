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

        this.geographicalSvg = null;
        this.sideSvg = null;
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
        this.sideSvg = d3.select("#geographicalsidechart");
        
        const width = +this.sideSvg.attr("width"),
            height = +this.sideSvg.attr("height");

        this.updateSideChart();
    }

    updateSideChart(){
        this.sideSvg = d3.select("#geographicalsidechart");
        
        const width = +this.sideSvg.attr("width"),
            height = +this.sideSvg.attr("height");

        var path = d3.geoPath();
        var g = this.sideSvg.append("g");
        
        var projection = this.projection;

        this.sideSvg.selectAll("path")
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
        });

        // Get points and counts per state
        var dataForState = this.currentData
            .filter(d => this.stateMapping[d.State] == this.selectedState);
        
        this.points = dataForState.map(d => [
            parseFloat(parseFloat(d.Start_Lng).toFixed(1)),
            parseFloat(parseFloat(d.Start_Lat).toFixed(1))
        ]);
        
        // Calculate data for info text
        var accidentCount = this.points.length;
        var accidentPercentage = parseFloat(this.points.length) / this.currentData.length * 100;
        var dataForStateWithSeverity = dataForState.filter(d => d["Severity"] != "");
        var totalSeverity = dataForStateWithSeverity.map(d => d["Severity"]).reduce((a, b) => a + parseInt(b), 0);
        var averageSeverity = dataForStateWithSeverity.length > 0 ? totalSeverity / dataForStateWithSeverity.length : 0;
        
        var dataForStateWithTemperature = dataForState.filter(d => d["Temperature(F)"] != "");
        var totalTemperature = dataForStateWithTemperature.map(d => d["Temperature(F)"]).reduce((a, b) => a + parseFloat(b), 0);
        var averageTemperature = dataForStateWithTemperature.length > 0 ? totalTemperature / dataForStateWithTemperature.length : 0;

        var dataForStateWithHumidity = dataForState.filter(d => d["Humidity(%)"] != "");
        var totalHumidity = dataForStateWithHumidity.map(d => d["Humidity(%)"]).reduce((a, b) => a + parseFloat(b), 0);
        var averageHumidity = dataForStateWithHumidity.length > 0 ? totalHumidity / dataForStateWithHumidity.length : 0;

        var dataForStateWithPrecipitation = dataForState.filter(d => d["Precipitation(in)"] != "");
        var totalPrecipitation = dataForStateWithPrecipitation.map(d => d["Precipitation(in)"]).reduce((a, b) => a + parseFloat(b), 0);
        var averagePrecipitation = dataForStateWithPrecipitation.length > 0 ? totalPrecipitation / dataForStateWithPrecipitation.length : 0;

        var dataForStateWithWindSpeed = dataForState.filter(d => d["Wind_Speed(mph)"] != "");
        var totalWindSpeed = dataForStateWithWindSpeed.map(d => d["Wind_Speed(mph)"]).reduce((a, b) => a + parseFloat(b), 0);
        var averageWindSpeed = dataForStateWithWindSpeed.length > 0 ? totalWindSpeed / dataForStateWithWindSpeed.length : 0;

        // Quantize point coordinates and remove duplicates for performance
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

        // Remove points from this.sideSvg that aren't present
        this.sideSvg.selectAll("circle")
            .data([])
            .exit()
            .remove();

        // add circles to this.sideSvg
        this.sideSvg.selectAll("circle")
            .data(this.points).enter()
            .append("circle")
            .attr("cx", d => this.projection(d)[0])
            .attr("cy", d => this.projection(d)[1])
            .attr("r", "" + this.pointPixelSize + "px")
            .attr("fill", "red");

        // Remove text from this.sideSvg
        this.sideSvg.selectAll("text")
            .data([])
            .exit()
            .remove();

        // Render current info text
        var infoTexts = [];

        if (this.selectedState != undefined) {
            infoTexts = [
                "State: " + this.selectedState,
                "Accidents: " + accidentCount,
                "Accident percentage (with regard to US total): " + (isFinite(accidentPercentage) ? accidentPercentage.toFixed(1) : 0) + "%",
                "Delta from mean: " + (accidentCount - this.stateCountStats.mean).toFixed(1),
                "Delta from max: " + (accidentCount - this.stateCountStats.max).toFixed(1),
                "Avg. Severity : " + averageSeverity.toFixed(1),
                "Avg. T° : " + averageTemperature.toFixed(1) + " °F",
                "Avg. Humidity : " + averageHumidity.toFixed(1) + "%",
                "Avg. precipitation: " + averagePrecipitation.toFixed(2) + " inches",
                "Avg. wind speed: " + averageWindSpeed.toFixed(1) + " mph",
            ]
        }

        infoTexts.forEach((infoText, index) => {
            this.sideSvg.append("text")
                .data([infoText])
                .attr("text-anchor", "start")
                .attr("x",15)
                .attr("y", 15 + index * 18)
                .attr("dy", ".30em")
                .attr("font-size","14px")
                .attr("font-family","Verdana, Geneva, Tahoma, sans-serif")
                .text(d => d);
        })
        
        // Calculate numbers for pan location and translation boundaries
        var translateLongLat = null;
        var translateBounds = null;
        var translatePoint = null;

        if (this.selectedState != undefined) {
            var stateData = this.statesData.filter(d => d.label == this.selectedState)[0];

            translateLongLat = [stateData.longitude, stateData.latitude];
            translatePoint = [this.projection(translateLongLat)[0], this.projection(translateLongLat)[1] - 25];
            translateBounds = [[this.projection(translateLongLat)[0], this.projection(translateLongLat)[1]],
                               [this.projection(translateLongLat)[0], this.projection(translateLongLat)[1]]];
        } else {
            translateBounds = [[-width, -height], [width * 2, height * 2]];
        }

        // Define zoom behavior for the sideSvg
        var zoom = d3.zoom()
            .scaleExtent([1, 25])
            .translateExtent(translateBounds)
            .on('zoom', event => {
                this.sideSvg = d3.select("#geographicalsidechart");

                this.sideSvg.selectAll('path')
                    .attr('transform', event.transform);
                
                this.sideSvg.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize / (event.transform.k ** 0.4)) + "px");
            });
        
        // Zoom and pan to the first point if present, else go towards the center of the map
        if (translatePoint != undefined) {
            var transformScale = 2;
            var transformParams = d3.zoomIdentity;
            transformParams.k = transformScale;
            transformParams.x = (transformScale * -translatePoint[0]) + width / 2;
            transformParams.y = (transformScale * -translatePoint[1]) + height / 2;

            this.sideSvg.transition()
                .duration(750)
                .call(zoom.transform, transformParams)
                //.call( zoom.translateTo, translatePoint[0], translatePoint[1] );
        } else {
            var transformScale = 1;
            var transformParams = d3.zoomIdentity;
            transformParams.k = transformScale;
            transformParams.x = width / 2;
            transformParams.y = height / 2;

            this.sideSvg.transition()
                .duration(750)
                .call(zoom.transform, transformParams)
        }

        this.sideSvg.call(zoom);
    }

    createGeographicalChart(){
        this.geographicalSvg = d3.select("#geographicalchart");

        // The scale and translation are recommended by the albers-10m dataset creators
        this.projection = d3.geoAlbersUsa()
            .scale(1300)
            .translate([487.5, 305]);

        this.updateGeographicalChart();
    }


    updateGeographicalChart(){
        this.geographicalSvg = d3.select("#geographicalchart");
        
        const width = +this.geographicalSvg.attr("width"),
            height = +this.geographicalSvg.attr("height");

        var path = d3.geoPath();
        var g = this.geographicalSvg.append("g");

        // Get points and counts per state
        this.points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);

        this.statesData.forEach(stateData => this.stateCounts[stateData.label] = 0);
        this.currentData.forEach(row => this.stateCounts[this.stateMapping[row.State]] += 1);
        
        // Calculate global stats
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

        // Create color scale for heatmap.
        // Min is slightly below zero to color states without accidents lightblue.
        // The max darkness is for the state with the highest number of accidents.
        var colorScale = d3.scaleLinear()
            .domain([-0.000001,this.stateCountStats.max])
            .range(["lightblue", "darkblue"]);

        var stateCounts = this.stateCounts;

        // Remove all outdated states
        this.geographicalSvg.selectAll("path")
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
                    this.selectedState = event.target.__data__.properties.name;
                    this.updateSideChart();
                });
        });
        
        // Add gradient objects with gradient CSS (to be used for the legend)
        var colorScaleGradient = this.geographicalSvg.append('defs')
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

        // Remove outdated legend
        this.geographicalSvg.selectAll('rect')
            .data([])
            .exit()
            .remove();
        
        // Remove outdated legend min and max value texts
        this.geographicalSvg.selectAll('text')
            .data([])
            .exit()
            .remove();
        
        // Add legend and min max value texts
        this.geographicalSvg.append("rect")
            .attr("class", "legendRect")
            .attr("x", width - width / 4)
            .attr("y", 10)
            .attr("width", width / 4)
            .attr("height", 10)
            .style("fill", "url(#colorScaleGradient)")
            .style("stroke", "black")
            .style("stroke-width", "0.5px");

        this.geographicalSvg.append("text")
            .data([0])
            .attr("text-anchor", "start")
            .attr("x", width - width / 4)
            .attr("y", 30)
            .attr("dy", ".35em")
            .text(d => d);

        this.geographicalSvg.append("text")
            .data([this.stateCountStats.max])
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", 30)
            .attr("dy", ".35em")
            .text(d => d);

        // Define zoom behavior for the geographicalSvg
        var zoom = d3.zoom()
            .scaleExtent([1, 25])
            .on('zoom', event => {
                this.geographicalSvg = d3.select("#geographicalchart");

                this.geographicalSvg.selectAll('path')
                    .attr('transform', event.transform);
                
                this.geographicalSvg.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize / (event.transform.k ** 0.8)) + "px");
            });

        this.geographicalSvg.call(zoom);
    }
}
