var id = "#plane";

var width = 960;
var height = 960;
var bg_color = "#000000";
var default_dimension = 50;
var planes = [];
var posx = 0;
var fromPlane = 30;
var toPlane = 180;
var fromPosition = 80;
var toPosition = 800;

d3.json("data-points.json", function (error, data) {
    if (error) throw error;

    var svg = d3.select(id)
        .append("svg")
        .on("click", click)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 " + width + " " + height);

    data.forEach(function (d, i) {

        planes[i] = svg.append("g")
            .attr("class", "plane" + i)
            .attr("transform", "translate(" + data[i][0]['value'] + ", " + data[i][1]['value'] + ")");

        planes[i].append("svg:image")
            .attr("xlink:href", "airplaneWings.svg")
            .attr("class", "wings" + i)
            .attr("width", data[i][3]['value'])
            .attr("height", default_dimension)
            .attr("fill", bg_color)
            .attr("preserveAspectRatio", "none")
            .attr("x", (default_dimension - data[i][3]['value']) / 2);

        planes[i].append("svg:image")
            .attr("xlink:href", "airplaneTail.svg")
            .attr("class", "tail" + i)
            .attr("width", data[i][4]['value'])
            .attr("height", default_dimension)
            .attr("fill", bg_color)
            .attr("preserveAspectRatio", "none")
            .attr("x", (default_dimension - data[i][4]['value']) / 2);

        planes[i].append("svg:image")
            .attr("xlink:href", "airplaneFuselage.svg")
            .attr("class", "fuselage" + i)
            .attr("width", default_dimension)
            .attr("height", data[i][2]['value'])
            .attr("fill", bg_color)
            .attr("preserveAspectRatio", "none")
            .attr("y", (default_dimension - data[i][2]['value']) / 1.8);
    })

    function scaleUp(num) {
        return(num - fromPlane) / (toPlane - fromPlane) * (toPosition - fromPosition) + fromPosition;
    }
    function scaleDown(num) {
        return(num - fromPosition) / (toPosition - fromPosition) * (toPlane - fromPlane) + fromPlane;
    }


    function click() {
        window.posx++;
        window.posx = window.posx % 5;
        
        for (i = 0; i < data.length; i++) {
            let positionX = data[i][posx]['value'];
            let positionY = data[i][(posx + 1) % 5]['value'];
            let dimFuselage = data[i][(posx + 2) % 5]['value'];
            let dimWings = data[i][(posx + 3) % 5]['value'];
            let dimTail = data[i][(posx + 4) % 5]['value'];
            let finalPosX, finalPosY, finalDimFuselage, finalDimTail, finalDimWings;

            // Scale posx and posy up, scale airplane dimension down
            if(posx == 0) {
                finalPosX = positionX
                finalPosY = positionY
                finalDimFuselage = dimFuselage
                finalDimWings = dimWings
                finalDimTail = dimTail
            }
            if(posx == 1) {
                finalPosX = positionX
                finalPosY = scaleUp(positionY)
                finalDimFuselage = dimFuselage
                finalDimWings = dimWings
                finalDimTail = scaleDown(dimTail)
            }
            if(posx == 2) {
                finalPosX = scaleUp(positionX)
                finalPosY = scaleUp(positionY)
                finalDimFuselage = dimFuselage
                finalDimWings = scaleDown(dimWings)
                finalDimTail = scaleDown(dimTail)
            }
            if(posx == 3) {
                finalPosX = scaleUp(positionX)
                finalPosY = scaleUp(positionY)
                finalDimFuselage = scaleDown(dimFuselage)
                finalDimWings = scaleDown(dimWings)
                finalDimTail = dimTail
            }
            if(posx == 4) {
                finalPosX = scaleUp(positionX)
                finalPosY = positionY
                finalDimFuselage = scaleDown(dimFuselage)
                finalDimWings = dimWings
                finalDimTail = dimTail
            }
            console.log("WE UAGLIO'" + posx)
            console.log("posx   " + finalPosX)
            console.log("posy   " + finalPosY)
            console.log("fuselage   " + finalDimFuselage)
            console.log("wings  " + finalDimWings)
            console.log("tail   " + finalDimTail)

            d3.select(".plane" + i)
                .transition()
                .duration(2000)
                .attr("transform", "translate(" + finalPosX + ", " + finalPosY + ")");
            d3.select(".fuselage" + i)
                .transition()
                .duration(2000)
                .attr("height", finalDimFuselage)
                .attr("y", (default_dimension - finalDimFuselage) / 1.8);
            d3.select(".wings" + i)
                .transition()
                .duration(2000)
                .attr("width", finalDimWings)
                .attr("x", (default_dimension - finalDimWings) / 2);
            d3.select(".tail" + i)
                .transition()
                .duration(2000)
                .attr("width", finalDimTail)
                .attr("x", (default_dimension - finalDimTail) / 2);
        }
    }
})


