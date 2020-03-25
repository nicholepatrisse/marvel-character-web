const d3 = require('d3');
const getRelated = require('../util/api_util').getRelated

let data; 

const fetchRelated = async(resouceURI) => {
  await getRelated(resouceURI).then(res => {
    data = res["data"]["results"];
    console.log(data);
  });
};

const buildBubbles = async(resouceURI) => {
    await fetchRelated(resouceURI);
    let width = 500;
    let height = 500;

    let svg = d3
    .select("chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(0,0)");
};;

module.exports = buildBubbles;