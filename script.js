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

    // Add Axes
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g').attr('id', 'y-axis').call(yAxis);

    // Add Title
    svg
      .append('text')
      .attr('id', 'title')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '26px')
      .text('Doping in Professional Bicycle Racing');

    // Add Subtitle
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2 + 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .text("35 Fastest times up Alpe d'Huez");

    // Add Data Points
    const dotSelection = svg
      .selectAll('.dot')
      .data(data)
      .join('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', (d) => x(d.Year))
      .attr('cy', (d) => y(d.Time))
      .attr('data-xvalue', (d) => d.Year)
      .attr('data-yvalue', (d) => d.Time.toISOString())
      .style('fill', (d) => (d.Doping !== '' ? '#ff6969' : '#3fd33f'))
      .style('opacity', 0.9)
      .attr('stroke', '#000')
      .attr('stroke-width', 0.5);

    dotSelection
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 0.9)
          .attr('data-year', d.Year)
          .html(
            `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${timeFormat(
              d.Time
            )}<br>${d.Doping || ''}`
          )
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 75}px`);
      })
      .on('mouseout', () => tooltip.style('opacity', 0));

    // Add Legend
    const legendData = [
      { label: 'Riders with doping allegations', color: '#ff6969' },
      { label: 'No doping allegations', color: '#3fd33f' },
    ];

    const legend = svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width - 10}, ${height / 2})`)
      .selectAll('g')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', (d, i) => `translate(0,${-i * 20})`);

    legend
      .append('circle')
      .attr('r', 7)
      .style('fill', (d) => d.color)
      .style('opacity', 0.9)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);

    legend
      .append('text')
      .attr('x', -14)
      .attr('y', 0)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text((d) => d.label);
  })
  .catch(console.error);
