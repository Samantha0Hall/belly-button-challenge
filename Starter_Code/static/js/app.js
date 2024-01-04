// URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// JSON data and console log
d3.json(url).then(function(data) {
    console.log(data);
  });
  
// Initialize the dashboard at start up
  function init() {
  
// Use D3 to select dropdown menu
      let dropdownMenu = d3.select("#selDataset");
  
// Use D3 to get sample names
      d3.json(url).then((data) => {
          
// Set a variable for the sample names and add to dropdown menu
          let names = data.names;
          names.forEach((id) => {
  
// Log the value of id
              console.log(id);
  
              dropdownMenu.append("option")
              .text(id)
              .property("value",id);
          });
// Set the first sample from the list and log
        let sample_one = names[0];
        console.log(sample_one);

// Build plots
        buildMetadata(sample_one);
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);

    });
};

// Metadata
function buildMetadata(sample) {

// Use D3 to retrieve data
    d3.json(url).then((data) => {

// Retrieve data, filter, log
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        console.log(value)

// Get the first index
        let valueData = value[0];

// Clear metadata for input, add entry, log
        d3.select("#sample-metadata").html("");
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Barchart
function buildBarChart(sample) {

// Use D3 to retrieve data
    d3.json(url).then((data) => {

// Retrieve data, filter
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

// Get the first index
        let valueData = value[0];

// Get the otu_ids, lables, and sample values, log
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        console.log(otu_ids,otu_labels,sample_values);

// Set top ten items, display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
// Set trace, layout
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"
        };

// Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Bubblechart
function buildBubbleChart(sample) {

// Use D3 to retrieve data
    d3.json(url).then((data) => {
        
// Retrieve data, filter
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

// Get the first index
        let valueData = value[0];

// Get the otu_ids, lables, and sample values, log
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        console.log(otu_ids,otu_labels,sample_values);
        
    // Set trace, layout
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

// Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Initialize function
init();