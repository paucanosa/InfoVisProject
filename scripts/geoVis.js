class GeoVis {

    constructor(params){
        this.currentData = params.data; 
        this.updateCharts();
    }

    updateData(filteredData){
        this.currentData = filteredData;
        console.log("GeoVis recieved new data!")
        this.updateCharts();

    }

    updateCharts(){
    }
}