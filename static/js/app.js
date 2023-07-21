// use D3 library to read in samples.json from the url provided 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"; 
 
let data = {};
//let selDataset = d3.select("#selDataset");

// Fetch the JSON data and console log it
d3.json(url).then(

   function(response){
      console.log(response);
      data = response; 
      populateDropdown();
      updateDashboard(data.names[0]);
      
   }
); 

d3.json(url).then(function(data) {
   console.log(data);
});


// function to intialize dropdown
function init() {

   let selDataset = d3.select("#selDataset");

   d3.json(url).then((data)=> {
      // names from dropdown list
      let names = data.names;
      console.log(names);
      //parse through each name(id) using forEach
         for (id of names){
            selDataset.append("option").attr("value", id).text(id);
         };
      //names.forEach((id) => {
        // console.log(id);

         //selDataset.append("option").text(id).property("value", id);
      //});
      //for (let i=0; i < names.length, i++){
         //let sampleNames = names[i];
         //selector.append('option').text(sampleNames).property('value', sampleNames);
      //};
      
      let firstSample = names[0];
     
      console.log(firstSample);

      // build initial plots
      updateDemographicInfo(firstSample);
      plotBarChart(firstSample);
      plotBubbleChart(firstSample);
      
   });
};

// bar chart function
function plotBarChart(sample) {

   // retrieve all of the data
   d3.json(url).then((data) => {

       // Sample Data
       let sampleData = data.samples;

       let value = sampleData.filter(result => result.id == sample);

       // First index (value) from array
       let valueData = value[0];

       let otu_ids = valueData.otu_ids;
       let otu_labels = valueData.otu_labels;
       let sample_values = valueData.sample_values;

       // Log the data to the console
       console.log(otu_ids);
       console.log(otu_labels);
       console.log(sample_values);

       let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
       let xticks = sample_values.slice(0,10).reverse();
       let labels = otu_labels.slice(0,10).reverse();
       
       console.log(yticks);
       console.log(xticks);
       console.log(labels); 

       // Set up the trace for the bar chart
       let trace = {
           x: xticks,
           y: yticks,
           text: labels,
           type: "bar",
           orientation: "h"
       };

       // layout
       let layout = {
           title: "Top 10 OTUs Present"
       };

       // Plotly to plot the bar chart
       Plotly.newPlot("bar", [trace], layout)
   });
};

// bubble chart function
function plotBubbleChart(sample) {

   // retrieve all of the data
   d3.json(url).then((data) => {
       
       // Sample Data
       let sampleInfo = data.samples;

       let value = sampleInfo.filter(result => result.id == sample);

       // Retrieve first index (value) from array
       let valueData = value[0];

       // Get the otu_ids, lables, and sample values
       let otu_ids = valueData.otu_ids;
       let otu_labels = valueData.otu_labels;
       let sampleValues = valueData.sample_values;

       // Log the data to the console
       console.log(otu_ids, otu_labels, sampleValues);
       
       // trace for bubble chart
       let trace1 = {
           x: otu_ids,
           y: sampleValues,
           text: otu_labels,
           mode: "markers",
           marker: {
               size: sampleValues,
               color: otu_ids,
               colorscale: "Earth"
           }
       };

       // layout
       let layout = {
           title: "Bacteria Per Sample",
           hovermode: "closest",
           xaxis: {title: "OTU ID"},
       };

       // Plotly to plot the bubble chart
       Plotly.newPlot("bubble", [trace1], layout)
   });
};

// Function that populates metadata info
function updateDemographicInfo(sample) {

   // Use D3 to retrieve all of the data
   d3.json(url).then((data) => {

       // Retrieve all metadata
       let metadata = data.metadata;

       // Filter based on the value of the sample
       let value = metadata.filter(result => result.id == sample);
       

       // Get the first index(value) from the array
       let valueData = value[0];
       console.log(valueData);

       // Clear out metadata
       d3.select("#sample-metadata").html("");

       // Use Object.entries to add each key/value pair
       Object.entries(valueData).forEach(([key,value]) => {

           // Log the individual key/value pairs as they are being appended to the metadata panel
           console.log(key,value);

           d3.select("#sample-metadata").append("h3").text(`${key}: ${value}`);
       });
   });

};



function optionChanged(value) {
   console.log(value);

   plotBubbleChart(value);
   updateDemographicInfo(value);
   plotBarChart(value);



};

// Function that updates dashboard when sample is changed
function updateDashboard(value) { 

   // Log the new value
   console.log(value); 

   // Call all functions 
   updateDemographicInfo(value);
   plotBarChart(value);
   plotBubbleChart(value);
};

// Call the initialize function
init();

