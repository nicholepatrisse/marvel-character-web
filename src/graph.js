import { 
    select, 
    scaleLinear, 
    scaleOrdinal, 
    schemeCategory10,
    max,
    scaleBand
} from 'd3'

const width = 800;
const height = 600;

const svg = select('svg')
svg.style('border', '1px solid lightgray')
svg.attr('height', height).attr('width', width)

function render(data) {
    const comicCount = d => d.comics.available;
    const charName = d => d.name;

    const margin = { top: 100, bottom: 50, left: 50, right: 50 }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const namesArray = data.map(d => charName(d));

    const rScale = scaleLinear()
        .domain([1, max(data, d => comicCount(d))])
        .range([10, 25])

    const colorScale = scaleOrdinal(schemeCategory10);

    const yScale = scaleBand()
        .domain(namesArray)
        .range([0, innerHeight])

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', innerWidth / 2)
        .attr('cy', d => yScale(charName(d)))
        .attr('r', d => rScale(comicCount(d)))
        .attr('fill', d => colorScale(charName(d)))
};

export const drawGraph = data => {
    console.log(data)
    svg.select('g').remove();
    render(data)
};