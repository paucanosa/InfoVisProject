class GeoVis {

    constructor(params){
        this.currentData = params.data;
        this.statesData = params.statesData;
        this.geoData = params.geoData;
        this.censusData = params.censusData;

        this.weightedByPopulation = false;

        this.stateMapping = {};
        this.stateCounts = {};
        this.weightedStateCounts = {};
        this.stateCountStats = {};

        this.selectedState = null;
        this.selectedStatePoints = [];

        this.statesData.forEach(state => this.stateMapping[state.value] = state.label)

        this.projection = null;
        this.pointPixelSize = 1.5;

        this.geographicalSvg = null;
        this.sideSvg = null;

        this.capitalPointsLayer = null;
        this.pointsLayer = null;
        this.infoLayer = null;

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
        this.sideSvg = d3.select("#geographicalsidechart");
        this.pointsLayer = this.sideSvg.append("g");
        this.infoLayer = this.sideSvg.append("g");
        this.capitalPointsLayer = this.sideSvg.append("g");

        this.updateSideChart();
    }

    updateSideChart(){
        const width = +this.sideSvg.attr("width"),
            height = +this.sideSvg.attr("height");

        var path = d3.geoPath();
        
        var projection = this.projection;
        var sideSvg = this.sideSvg;

        // Add states with updated colors
        if (this.selectedState != undefined) {
            var states = sideSvg
                .selectAll("path")
                .data(topojson.feature(this.geoData, this.geoData.objects.states).features, d => {return d.properties.name});
            
            states.join(
                enter => { 
                    return enter.append("path").merge(states)
                        .attr("fill", d => d.properties.name == this.selectedState ? "lightblue" : "rgb(240,240,240)")
                        .attr("d", path)
                        .style("stroke", d => d.properties.name == this.selectedState ? "grey" : "white");
                },
                update =>{return update;},
                exit => {return exit.remove();}
            );

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

            // add state capital point to the side panel
            var censusStateInfo = this.censusData.filter(dataPoint => dataPoint["STATE"] == this.selectedState)[0];
            var statePopulation = parseInt(censusStateInfo["POPESTIMATE2019"]);
            var stateCapitalCoordinates = [censusStateInfo["long"], censusStateInfo["lat"]];

            var capitalPoints = this.capitalPointsLayer
                .selectAll("circle")
                .data([stateCapitalCoordinates], d => d)

            capitalPoints.join(
                enter => {
                    return enter.append("circle").merge(capitalPoints)
                        .attr("cx", d => this.projection(d)[0])
                        .attr("cy", d => this.projection(d)[1])
                        .attr("r", "" + this.pointPixelSize * 4 + "px")
                        .attr("fill", "black");
                },
                update => {return update;},
                exit => {return exit.remove();}
            )

            // add accident points to the side panel
            var accidentPoints = this.pointsLayer
                .selectAll("circle")
                .data(this.points, d => d)

            accidentPoints.join(
                enter => {
                    return enter.append("circle").merge(accidentPoints)
                        .attr("cx", d => this.projection(d)[0])
                        .attr("cy", d => this.projection(d)[1])
                        .attr("r", "" + this.pointPixelSize + "px")
                        .attr("fill", "red");
                },
                update => {return update;},
                exit => {return exit.remove();}
            )

            // Render current info text
            var infoTexts = [];

            infoTexts = [
                ["State", "State: " + this.selectedState],
                ["Population", "Population: " + statePopulation.toLocaleString()],
                ["Accidents", "Accidents: " + accidentCount.toLocaleString()],
                ["Accidents per million inhabitants", "Accidents per million inhabitants: " + parseInt(accidentCount / statePopulation * 1_000_000).toLocaleString()],
                ["Accident percentage", "Accident % (regarding US total): " + (isFinite(accidentPercentage) ? accidentPercentage.toFixed(1) : 0) + "%"],
                ["Delta from mean", "Delta from mean: " + parseInt(accidentCount - this.stateCountStats.absolute_mean).toLocaleString()],
                ["Delta from max", "Delta from max: " + parseInt(accidentCount - this.stateCountStats.absolute_max).toLocaleString()],
                ["Avg. Severity", "Avg. Severity : " + averageSeverity.toFixed(1)],
                ["Avg. T", "Avg. T° : " + averageTemperature.toFixed(1) + " °F"],
                ["Avg. Humidity", "Avg. Humidity : " + averageHumidity.toFixed(1) + "%"],
                ["Avg. precipitation", "Avg. precipitation: " + averagePrecipitation.toFixed(2) + " inches"],
                ["Avg. wind speed", "Avg. wind speed: " + averageWindSpeed.toFixed(1) + " mph"],
            ]

            var textBackground = this.infoLayer
                .selectAll("rect")
                .data(['rect'], d => d)
            
            textBackground.join(
                enter => {
                    return enter.append("rect").merge(textBackground)
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", width)
                        .attr("height", 15 + infoTexts.length * 18)
                        .style("opacity", 0.85)
                        .style("fill", "rgb(240,240,240)")
                },
                update => {return update;},
                exit => {return exit.remove();}
            )

            var textLines = this.infoLayer
                .selectAll("text")
                .data(infoTexts, d => d[0])

            textLines.join(
                enter => {
                    return enter.append("text").merge(textLines)
                        .attr("text-anchor", "start")
                        .attr("x",15)
                        .attr("y", (d,i) => 15 + i * 18)
                        .attr("dy", ".35em")
                        .attr("font-size","14px")
                        .attr("font-family","Verdana, Geneva, Tahoma, sans-serif")
                        .text(d => d[1]);
                },
                update => {return update;},
                exit => {return exit.remove();}
            )
            
            // Set the order of the elements, so that accident points are always above the state,
            // the capital point is always above the accident points and
            // the info text is always on top.
            this.pointsLayer.raise();
            this.capitalPointsLayer.raise();
            this.infoLayer.raise();
            
            // Calculate numbers for pan location and translation boundaries
            var translateLongLat = null;
            var translateBounds = null;
            var translatePoint = null;
        }

        if (this.selectedState != undefined) {
            var stateData = this.statesData.filter(d => d.label == this.selectedState)[0];

            translateLongLat = [stateData.longitude, stateData.latitude];
            translatePoint = [this.projection(translateLongLat)[0], this.projection(translateLongLat)[1] - 32];
            translateBounds = [[this.projection(translateLongLat)[0], this.projection(translateLongLat)[1] - 32],
                               [this.projection(translateLongLat)[0], this.projection(translateLongLat)[1] - 32]];
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
                
                this.pointsLayer.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize / (event.transform.k ** 0.4)) + "px");
                
                this.capitalPointsLayer.selectAll('circle')
                    .attr('transform', event.transform)
                    .attr("r", "" + (this.pointPixelSize * 2 / (event.transform.k ** 0.4)) + "px");
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
        const width = +this.geographicalSvg.attr("width"),
            height = +this.geographicalSvg.attr("height");

        var path = d3.geoPath();

        // Get points and counts per state
        this.points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);

        this.statesData.forEach(stateData => this.stateCounts[stateData.label] = 0);
        this.statesData.forEach(stateData => this.weightedStateCounts[stateData.label] = 0);
        
        this.currentData.forEach(row => this.stateCounts[this.stateMapping[row.State]] += 1);
        this.censusData.forEach(row => {
            this.weightedStateCounts[row["STATE"]] =
                this.stateCounts[row["STATE"]] / row["POPESTIMATE2019"] * 1_000_000;
        });

        var counts = this.weightedByPopulation ? this.weightedStateCounts : this.stateCounts;
        
        
        // Calculate global stats
        this.stateCountStats = {
            'min': 0,
            'max': 0,
            'total': 0,
            'mean': 0.0,
            'absolute_max': 0,
            'absolute_min': 0,
            'absolute_total': 0,
            'absolute_mean': 0.0,
        };

        for (let [state, count] of Object.entries(counts)) {
            this.stateCountStats.total += count;
            if (count < this.stateCountStats.min) {
                this.stateCountStats.min = parseInt(count);
            }
            if (count > this.stateCountStats.max) {
                this.stateCountStats.max = parseInt(count);
            }
        };

        // Also store the absolute counts as we need them in the sidepanel later
        for (let [state, count] of Object.entries(this.stateCounts)) {
            this.stateCountStats.absolute_total += count;
            if (count < this.stateCountStats.absolute_min) {
                this.stateCountStats.absolute_min = parseInt(count);
            }
            if (count > this.stateCountStats.absolute_max) {
                this.stateCountStats.absolute_max = parseInt(count);
            }
        };

        this.stateCountStats.mean = parseFloat(this.stateCountStats.total) / Object.entries(counts).length
        this.stateCountStats.absolute_mean = parseFloat(this.stateCountStats.absolute_total) / Object.entries(this.stateCounts).length

        // Create color scale for heatmap.
        // Min is slightly below zero to color states without accidents lightblue.
        // The max darkness is for the state with the highest number of accidents.
        var colorScale = d3.scaleLinear()
            .domain([-0.000001,this.stateCountStats.max])
            .range(["lightblue", "darkblue"]);

        var geographicalSvg = this.geographicalSvg;

        // Add states with updated colors
        var states = geographicalSvg
            .selectAll("path")
            .data(topojson.feature(this.geoData, this.geoData.objects.states).features, d => {return d.properties.name});

        states.join(
            enter => { 
                return enter.append("path").merge(states)
                    .attr("fill", d => colorScale(counts[d.properties.name]-0.000001))
                    .attr("d", path)
                    .style("stroke", "white")
                    .on('click', event => {
                        this.selectedState = event.target.__data__.properties.name;
                        this.updateSideChart();
                    })
            },
            update =>{return update;},
            exit => {return exit.remove();}
        );
        
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

        // Add legend using the gradient objects
        var legend = this.geographicalSvg
            .selectAll("rect")
            .data(['legend'], d => d)
        
        legend.join(
            enter => {
                return enter.append("rect").merge(legend)
                    .attr("class", "legendRect")
                    .attr("x", width - width / 4)
                    .attr("y", 10)
                    .attr("width", width / 4)
                    .attr("height", 10)
                    .style("fill", "url(#colorScaleGradient)")
                    .style("stroke", "black")
                    .style("stroke-width", "0.5px");
            },
            update => {return update;},
            exit => {return exit.remove();}
        )

        // Add min and max values in legend
        var legendText = this.geographicalSvg
            .selectAll("text")
            .data(["start", "end"], d => d)
        legendText.join(
            enter => {
                return enter.append("text").merge(legendText)
                    .attr("class", "legendRectText")
                    .attr("text-anchor", d => d)
                    .attr("x", (d, i) => width - (1 - i) * (width / 4))
                    .attr("y", 30)
                    .attr("dy", ".35em")
                    .text(d => d == "start" ? 0 : this.stateCountStats.max);
            },
            update => {return update;},
            exit => {return exit.remove();}
        )
    }
}
