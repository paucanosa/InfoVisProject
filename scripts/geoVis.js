class GeoVis {

    constructor(params){
        this.currentData = params.data;

        //this.createGeographicalChart();
        this.createGeographicalChart()
        this.updateCharts();
    }

    updateData(filteredData){
        this.currentData = filteredData;
        console.log("GeoVis recieved new data!")
        this.updateCharts();

    }

    updateCharts(){
    }

    createGeographicalChart(){
        const svg = d3.select("#geographicalchart"),
            width = +svg.attr("width"),
            height = +svg.attr("height");
        
        var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])
				   .scale([1000]);

        var path = d3.geoPath();
        var g = svg.append("g");

        // Load states
        d3.json("https://d3js.org/us-10m.v1.json").then( function(us) {
            g.attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("fill", "lightblue")
                .attr("d", path)
                .style("stroke", "white");
        });

        var points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);
        const pointPixelSize = 3.0;

        // add circles to svg
        svg.selectAll("circle")
            .data(points).enter()
            .append("circle")
            .attr("cx", function (d) { return projection(d)[0]; })
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




    // createGeographicalChartCanvas(){
    //     const svg = d3.select("#geographicalchartcanvas"),
    //         width = +svg.attr("width"),
    //         height = +svg.attr("height");
        

    //     // var projection = d3.geoAlbersUsa()
	// 	// 		   .translate([width/2, height/2])
	// 	// 		   .scale([1000]);
        
    //     const projection = d3.geoNaturalEarth1()
    //     .scale(width / 1.3 / Math.PI)
    //     .translate([width / 2, height / 2])

    //     var path = d3.geoPath();

    //     var g = svg.append("g");

    //     const canvas = document.getElementById('geographicalchartcanvas');
    //     // Get the 'context'
    //     const ctx = canvas.getContext('2d');

    //     // geographic path generator for given projection and canvas context
    //     const pathGenerator = d3.geoPath(projection, ctx);

    //     // Load states
    //     //d3.json("https://d3js.org/us-10m.v1.json").then( function(us) {
    //     d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data){
    //         // initialize the path
    //         ctx.beginPath();

    //         // Got the positions of the path
    //         data.features = data.features.filter(function(d){ return d.properties.name=="USA"})
    //         pathGenerator(data);

    //         // Fill the paths
    //         ctx.fillStyle = "#999";
    //         ctx.fill();

    //         // Add stroke
    //         ctx.strokeStyle = "#69b3a2";
    //         ctx.stroke()

    //     });

    //     var points = this.currentData.map(d => [parseFloat(d['Start_Lng']), parseFloat(d['Start_Lat'])]);
    //     const pointPixelSize = 3.0;

    //     // // add circles to svg
    //     // svg.selectAll("circle")
    //     //     .data(points).enter()
    //     //     .append("circle")
    //     //     .attr("cx", function (d) { return projection(d)[0]; })
    //     //     .attr("cy", function (d) { return projection(d)[1]; })
    //     //     .attr("r", "" + pointPixelSize + "px")
    //     //     .attr("fill", "red");
        
    //     const r = 1.5;

    //     d3.select(ctx.canvas).call(d3.zoom()
    //         .scaleExtent([1, 8])
    //         .on("zoom", ({transform}) => zoomed(transform)));

    //     function zoomed(transform) {
    //         ctx.save();
    //         //ctx.clearRect(0, 0, width, height);
    //         ctx.translate(transform.x, transform.y);
    //         ctx.scale(transform.k, transform.k);
    //         ctx.beginPath();

    //         // for (const [x, y] of points) {
    //         //     ctx.moveTo(x + r, y);
    //         //     ctx.arc(x, y, r, 0, 2 * Math.PI);
    //         // }

    //         ctx.fill();
    //         ctx.restore();
    //     }

    //     zoomed(d3.zoomIdentity);

    //     // var zoom = d3.zoom()
    //     //     .scaleExtent([1, 100])
    //     //     .on('zoom', function(event) {
    //     //         g.selectAll('path')
    //     //         .attr('transform', event.transform);
    //     //         svg.selectAll('circle')
    //     //         .attr('transform', event.transform)
    //     //         .attr("r", "" + (pointPixelSize / (event.transform.k ** 0.8)) + "px");
    //     // });

    //     // svg.call(zoom);
    // }
}