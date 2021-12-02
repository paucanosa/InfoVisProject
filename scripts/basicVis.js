class BasicVis {

    constructor(params){
        this.currentData = params.data; 
        this.updateCharts();
    }

    updateData(filteredData){
        this.currentData = filteredData;
        this.updateCharts();

    }

    updateCharts(){
        const node = document.getElementById("basic-container");
        node.innerHTML = '';
        node.innerHTML = "<p class='filters-title'>"+this.currentData.length+" car accidents</p>";
    }
}