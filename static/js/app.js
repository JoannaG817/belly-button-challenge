// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// display the data
d3.json(url).then(function(data) {
  console.log(data);
})

function init() {

  // check that the initial function runs
  console.log("The Init() function ran");

  // create dropdown/select
  
  let menuOption = d3.select("#selDataset");

  //list all the ids in the 'names' section
  d3.json(url).then(function(data) {

    let idSelection = data.names;
    idSelection.forEach((sample) => {menuOption.append("option").text(sample).property("value",sample)});
    let chosenSample = idSelection[0];
    buildBarChart(chosenSample);
    buildBubbleChart(chosenSample);
    createSummary(chosenSample);

    }); 

};
// function that runs whenever the dropdown is changed
function optionChanged(newID) {
  buildBarChart(newID);
  buildBubbleChart(newID);
  createSummary(newID);
};

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function buildBarChart(sample){
  d3.json(url).then(function(data){
    let samples = data.samples;
    let resultArray = samples.filter(sampleOBJ => sampleOBJ.id == sample);
    let result = resultArray[0];
    
    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;
    let otu_labels = result.otu_labels;
    
    //set range for x, y, text
    let xAxis = sample_values.slice(0,10);
    let yAxis= otu_ids.slice(0,10).map(id => `OTU${id}`);
    let labelText = otu_labels.slice(0,10);

    //plot the bar chart
    let barChart = {
      x: xAxis.reverse(),
      y: yAxis.reverse(),
      text: labelText.reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: xAxis,
        colorscale: 'rgb(142,124,195)'
      }
    };

    let layout = {
      title: 'Top 10 OTUs Found in a Person',
      margin: {
        l: 65,
        r: 25,
        b: 25,
        t: 55,
      }
    };

    var config = {responsive: true}

    Plotly.newPlot("bar", [barChart], layout, config);

  });
};

// function for bubble chart
function buildBubbleChart(sample){
  d3.json(url).then(function(data){
    let samples = data.samples;
    let resultArray = samples.filter(sampleOBJ => sampleOBJ.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;
    let otu_labels = result.otu_labels;

    //plot bubble chart
    let bubbleChart = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'rgb(142,124,195)'
      }
    };

    let layout = {
      title: 'Bacteria in Each Sample ',
      margin: {
        l: 55,
        r: 35,
        b: 65,
        t: 55,
      },
      xaxis:{title:"OTU ID"},
      yaxis:{title:"Sample Value"}

    };

    var config = {responsive: true}

    Plotly.newPlot("bubble", [bubbleChart], layout, config);

  });
};

//demographic information
function createSummary(sample){
  d3.json(url).then(function(data) {
    //locate the metadata
    let metaData = data.metadata;
    let resultArray = metaData.filter(sampleOBJ => sampleOBJ.id == sample);
    let result = resultArray[0];
    //select the "sample-metadata" in the html
    d3.select("#sample-metadata").html();
    //Mapping the value: using the object.keys, value, entries to return an arry of [key, value] pairs.
    Object.entries(result).forEach(function([key,value]){
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
    })
  })

};

init();