import { 
    select, 
    scaleLinear, 
    scaleOrdinal, 
    schemeCategory10,
    json,
    forceSimulation,
    forceCenter,
    forceX,
    forceY,
    forceManyBody,
    forceCollide,
    max
} from 'd3'
import { buildRelatedUrl } from '../util/api_util';

let nodes = [];

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

    const colorScale = scaleOrdinal(schemeCategory10);
    const rScale = scaleLinear()
        .domain([1, max(data, d => comicCount(d))])
        .range([10, 50])

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const simulation = forceSimulation()
        .force('forceX', forceX().strength(.1).x(innerWidth / 2))
        .force('forceY', forceY().strength(.1).y(innerHeight / 2))
        .force('center', forceCenter().x(innerWidth / 2).y(innerHeight / 2))
        .force('charge', forceManyBody().strength(-15))

    const node = g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => rScale(comicCount(d)))
        .attr('fill', d => colorScale(charName(d)))

    simulation.nodes(nodes)
        .force('collide', forceCollide()
            .strength(.5)
            .radius(d => d.radius + 50)
            .iterations(1)
        ).on('tick', d => {
            node.attr('cx', d => d.x)
            node.attr('cy', d => d.y)
        });
};

const store = {};

const formatCharacterData = data => {
    let character = data['data']["results"][0]
    store[character.id] = character;
    store[character.id]['radius'] = 10;
    nodes = Object.values(store);
    console.log(nodes);
};

export const fetchCharacter = resourceURI => {
    json(buildRelatedUrl(resourceURI)).then(data => {
        svg.select('g').remove();
        formatCharacterData(data)
        render(nodes)
    });
};