function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  // console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var Array=data.samples ;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleIDArray=Array.filter(data=>data.id===sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample=sampleIDArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
    // if firstSample=Array.id
        var outIds=firstSample.otu_ids;
        var outLabels=firstSample.otu_labels;
        var sampleValues=firstSample.sample_values;
        console.log(sample);
        console.log(Array);
        console.log(sampleValues);
        console.log(outIds);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = outIds.slice(0,10).map(x =>`OTU ${x}` ).reverse();
    // console.log(yticks);
    // var ref_x=sampleValues.slice(0,10).reverse();
    // console.log(ref_x);
    // console.log(outLabels.slice(0,10).reverse());
//     // 8. Create the trace for the bar chart. 
    var barData = [{
      y: yticks,
      x: sampleValues.slice(0,10).reverse(),
      // y:yticks,
      text: outLabels.slice(0,10).reverse(),
      type: "bar",
      orientation:"h"
    }];
//  // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      font: { color: "lightblack", size:14 },
    };
// // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

// -------------------bubble chart-----------------------
      // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
      // Plotly.bubblePlot(); 
      // 1. Create the trace for the bubble chart.
    var trace1= {
      x:outIds,
      y:sampleValues,
      text: outLabels,
      mode:"markers",
      marker:{
      size:sampleValues,
      color:outIds,
      colorscale:"Earth"}};
    var bubbleData = [trace1];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: "<b>Bacteria Cultures Per Sample</b>",
        showlegend: false,
        hovermode: 'closest',
        font: { color: "lightblack", size:14 },
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  });
};  
// -------------------Gauge Chart-------------------------------
// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    // 3. Create a variable that holds the washing frequency.
    var guagevalue= result.wfreq
    // console.log(guagevalue)
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value:guagevalue,
      type:"indicator",
      mode:"gauge+number",
      marker: {size: 28, color:'black'},
      gauge: {
              axis: { range: [null, 10],tickwidth: 1 },
              bar: { color: "black" },
              steps:[
                { range: [0, 2], color: "red" },
                { range: [2, 4], color: "orange" },
                { range: [4, 6], color: "yellow" },
                { range: [6, 8], color: "lightgreen" },
                { range: [8, 10], color: "green" }]
            }
    }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: '<b>Belly Button Washing Frequency</b><br> Scrubs per Week',
      width: 460,
      height: 400,
      margin: { t: 160, r: 10, l: 25, b: 50 },
      line: { color: 'black'},
      font: { color: "lightblack", size:14 }
    };
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

