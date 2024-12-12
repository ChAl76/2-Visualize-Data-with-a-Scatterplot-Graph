const url =
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const margin = { top: 100, right: 40, bottom: 50, left: 60 };
const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Scales and Axes
const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleTime().range([0, height]);
const color = d3.scaleOrdinal(d3.schemeCategory10);
const timeFormat = d3.timeFormat('%M:%S');
const xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));
const yAxis = d3.axisLeft(y).tickFormat(timeFormat);

// Tooltip setup
const tooltip = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

// SVG Container
const svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'graph')
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Fetch and Process Data
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Parse data
    data.forEach((d) => {
      d.Place = Number(d.Place);
      const [minutes, seconds] = d.Time.split(':').map(Number);
      d.Time = new Date(1970, 0, 1, 0, minutes, seconds);
    });

    // Set domains
    x.domain(
      d3.extent(data, (d) => d.Year).map((v, i) => (i === 0 ? v - 1 : v + 1))
    );
    y.domain(d3.extent(data, (d) => d.Time));
  })
  .catch(console.error);
