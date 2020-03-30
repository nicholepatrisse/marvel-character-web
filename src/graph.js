import { 
    select, 
    scaleLinear, 
    scaleOrdinal, 
    schemeCategory10,
    max,
    scaleBand,
    json
} from 'd3'
import { buildRelatedUrl } from '../util/api_util';

const nodes = [];

let width = document.querySelector('.chart-area').offsetWidth;
let height = document.querySelector('.chart-area').offsetHeight;

const svg = select('svg')
svg.attr('width', width).attr('height', height)

window.addEventListener('resize', () => {
    width = document.querySelector('.chart-area').offsetWidth;
    height = document.querySelector('.chart-area').offsetHeight;
    svg.attr('width', width).attr('height', height);
    resizeGraph()
});

const resizeGraph = () => {
    svg.select('g').remove();
    render(nodes)
};

function render(data) {
    const comicCount = d => d.comics.available;
    const charName = d => d.name;

    const margin = { top: 100, bottom: 50, left: 50, right: 50 }
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const namesArray = data.map(d => charName(d));

    const rScale = scaleLinear()
        .domain([1, max(data, d => comicCount(d))])
        .range([10, 50])

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

const store = {};
const formatCharacterData = data => {
    let character = data['data']["results"][0]
    store[character.id] = character;
    nodes.push(store[character.id]);
    console.log(nodes);
};

export const fetchCharacter = resourceURI => {
    json(buildRelatedUrl(resourceURI)).then(data => {
        svg.select('g').remove();
        formatCharacterData(data)
        render(nodes)
    });
};