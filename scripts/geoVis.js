class GeoVis {

    constructor(params){
        this.currentData = params.data; 
        this.updateCharts();

        const svg = d3.select("#geographicalmap"),
            width = +svg.attr("width"),
            height = +svg.attr("height");
        

        var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])
				   .scale([1000]);

        var path = d3.geoPath();

        var g = svg.append("g");

        // points
        var aa = [-122.490402, 37.786453];
        var bb = [-122.389809, 37.72728];

        d3.json("https://d3js.org/us-10m.v1.json").then( function(us) {

            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("fill", "lightblue")
                .attr("d", path)
                .style("stroke", "white");
        });

        const pointPixelSize = 3.0;

        // add circles to svg
        svg.selectAll("circle")
		.data([aa,bb]).enter()
		.append("circle")
		.attr("cx", function (d) { console.log(projection(d)); return projection(d)[0]; })
		.attr("cy", function (d) { return projection(d)[1]; })
		.attr("r", "" + pointPixelSize + "px")
		.attr("fill", "red");

        var zoom = d3.zoom()
            .scaleExtent([1, 100])
            .on('zoom', function(event) {
                g.selectAll('path')
                .attr('transform', event.transform);
                svg.selectAll('circle')
                .attr('transform', event.transform)
                .attr("r", "" + (pointPixelSize / (event.transform.k ** 0.8)) + "px");
        });

        svg.call(zoom);
    }

    updateData(filteredData){
        this.currentData = filteredData;
        console.log("GeoVis recieved new data!")
        this.updateCharts();

    }

    updateCharts(){
    }
}