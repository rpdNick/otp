// Chart.defaults.RoundedDoughnut = Chart.helpers.clone(Chart.defaults.doughnut);
// Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
//     draw: function (ease) {
//         var ctx = this.chart.ctx;
//         var easingDecimal = ease || 1;
//         var arcs = this.getMeta().data;
//         Chart.helpers.each(arcs, function (arc, i) {
//             arc.transition(easingDecimal).draw();

//             var pArc = arcs[i === 0 ? arcs.length - 1 : i - 1];
//             var pColor = pArc._view.backgroundColor;

//             var vm = arc._view;
//             var radius = (vm.outerRadius + vm.innerRadius) / 2;
//             var thickness = (vm.outerRadius - vm.innerRadius) / 2;
//             var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
//             var angle = Math.PI - vm.endAngle - Math.PI / 2;

//             ctx.save();
//             ctx.translate(vm.x, vm.y);

//             ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
//             ctx.beginPath();
//             ctx.arc(radius * Math.sin(startAngle), radius * Math.cos(startAngle), thickness, 0, 2 * Math.PI);
//             ctx.fill();

//             ctx.fillStyle = vm.backgroundColor;
//             ctx.beginPath();
//             ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
//             ctx.fill();

//             ctx.restore();
//         });
//     }
// });


Chart.pluginService.register({
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            // Get ctx from string
            var ctx = chart.chart.ctx;

            // Get options from the center object in options
            var centerConfig = chart.config.options.elements.center;
            var fontStyle = centerConfig.fontStyle || 'Arial';
            var txt = centerConfig.text;
            var color = centerConfig.color || '#000';
            var maxFontSize = centerConfig.maxFontSize || 75;
            var sidePadding = centerConfig.sidePadding || 20;
            var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
            // Start with a base font of 30px
            ctx.font = "30px " + fontStyle;

            // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
            var stringWidth = ctx.measureText(txt).width;
            var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

            // Find out how much the font can grow in width.
            var widthRatio = elementWidth / stringWidth;
            var newFontSize = Math.floor(30 * widthRatio);
            var elementHeight = (chart.innerRadius * 2);

            // Pick a new font size so it will not be larger than the height of label.
            // var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
            var fontSizeToUse = 35;
            var minFontSize = centerConfig.minFontSize;
            var lineHeight = centerConfig.lineHeight || 25;
            var wrapText = false;

            if (minFontSize === undefined) {
                minFontSize = 20;
            }

            if (minFontSize && fontSizeToUse < minFontSize) {
                fontSizeToUse = minFontSize;
                wrapText = true;
            }

            // Set font settings to draw it correctly.
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
            var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
            ctx.font = fontSizeToUse + "px " + fontStyle;
            ctx.fillStyle = color;

            if (!wrapText) {
                ctx.fillText(txt, centerX, centerY);
                return;
            }

            var words = txt.split(' ');
            var line = '';
            var lines = [];

            // Break words up into multiple lines if necessary
            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > elementWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }

            // Move the center up depending on line height and number of lines
            centerY -= (lines.length / 2) * lineHeight;

            for (var n = 0; n < lines.length; n++) {
                ctx.fillText(lines[n], centerX, centerY);
                centerY += lineHeight;
            }
            //Draw text in center
            ctx.fillText(line, centerX, centerY);
        }
    }
});

window.onload = function () {
    if (circeleChartData1) {
        let labels = new Array();;
        let datasets = new Array();
        let backgroundColor = new Array();
        let sum = 0;

        for (let i = 0; i < circeleChartData1.data.length; i++) {
            labels[i] = circeleChartData1.data[i].label;
            datasets[i] = circeleChartData1.data[i].value;
            backgroundColor[i] = circeleChartData1.data[i].backgroundColor;
            sum += circeleChartData1.data[i].value;
        }
        if (sum > 0) {
            new Chart(document.getElementById('chartCircle-1'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: datasets,
                        backgroundColor: backgroundColor,
                        borderWidth: 0
                    }]
                },
                options: {
                    cutoutPercentage: 60,
                    aspectRatio: 1,
                    maintainAspectRatio: false,
                    tooltips: {
                        enabled: true
                    },
                    elements: {
                        center: {
                            text: Circle_1_CenterTxt,
                            color: '#7D828B', // Default is #000000
                            fontStyle: 'SourceSansBold', // Default is Arial
                            sidePadding: 20, // Default is 20 (as a percentage)
                            minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
                            lineHeight: 25, // Default is 25 (in px), used for when text wraps
                        }
                    },
                    legend: {
                        display: false,
                    },
                    plugins: {
                        labels: {
                            render: 'persentage',
                            precision: 0,
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0;
                                let dataArr = ctx.chart.data.datasets[0].data;
                                dataArr.map(data => {
                                    sum += data;
                                });
                                let percentage = (value * 100 / sum).toFixed(0) * 1;
                                return '';
                                // return percentage + "%";
                                // if (percentage < 8) {
                                //     return '';
                                // } else {

                                // }
                                // let val = value * 100 / sum;
                                // let percentage = value ? Math.round10(val, -1) + "%" : "";
                            },
                            font: {
                                size: '10',
                                weight: "bold"
                            },
                            color: "#000"
                        }
                    }
                },
            });
        }
    }
    if (circeleChartData2) {
        let labels = new Array();;
        let datasets = new Array();
        let backgroundColor = new Array();
        let sum = 0;

        for (let i = 0; i < circeleChartData2.data.length; i++) {
            labels[i] = circeleChartData2.data[i].label;
            datasets[i] = circeleChartData2.data[i].value;
            backgroundColor[i] = circeleChartData2.data[i].backgroundColor;
            sum += circeleChartData2.data[i].value;
        }
        if (sum > 0) {
            new Chart(document.getElementById('chartCircle-2'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: datasets,
                        backgroundColor: backgroundColor,
                        borderWidth: 0
                    }]
                },
                options: {
                    cutoutPercentage: 60,
                    aspectRatio: 1,
                    maintainAspectRatio: false,
                    tooltips: {
                        filter: function (tooltipItem, data) {
                            var label = data.labels[tooltipItem.index];
                            if (label == "") {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    elements: {
                        center: {
                            text: Circle_2_CenterTxt,
                            color: '#A5C3D9', // Default is #000000
                            fontStyle: 'SourceSansBold', // Default is Arial
                            sidePadding: 20, // Default is 20 (as a percentage)
                            minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
                            lineHeight: 25, // Default is 25 (in px), used for when text wraps
                        }
                    },
                    legend: {
                        display: false,
                    },
                    plugins: {
                        labels: {
                            render: 'persentage',
                            precision: 0,
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0;
                                let dataArr = ctx.chart.data.datasets[0].data;
                                dataArr.map(data => {
                                    sum += data;
                                });
                                let percentage = (value * 100 / sum).toFixed(0) * 1;
                                return '';
                                // return percentage + "%";
                                // if (percentage < 8) {
                                //     return '';
                                // } else {

                                // }
                                // let val = value * 100 / sum;
                                // let percentage = value ? Math.round10(val, -1) + "%" : "";
                            },
                            font: {
                                size: '10',
                                weight: "bold"
                            },
                            color: "#000"
                        }
                    }
                },
            });
        }
    }
    if (circeleChartData3) {
        let labels = new Array();;
        let datasets = new Array();
        let backgroundColor = new Array();
        let sum = 0;

        for (let i = 0; i < circeleChartData3.data.length; i++) {
            labels[i] = circeleChartData3.data[i].label;
            datasets[i] = circeleChartData3.data[i].value;
            backgroundColor[i] = circeleChartData3.data[i].backgroundColor;
            sum += circeleChartData3.data[i].value;
        }
        if (sum > 0) {
            new Chart(document.getElementById('chartCircle-3'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: datasets,
                        backgroundColor: backgroundColor,
                        borderWidth: 0
                    }]
                },
                options: {
                    cutoutPercentage: 60,
                    aspectRatio: 1,
                    maintainAspectRatio: false,
                    tooltips: {
                        filter: function (tooltipItem, data) {
                            var label = data.labels[tooltipItem.index];
                            if (label == "") {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    elements: {
                        center: {
                            text: Circle_3_CenterTxt,
                            color: '#9DCC8F', // Default is #000000
                            fontStyle: 'SourceSansBold', // Default is Arial
                            sidePadding: 20, // Default is 20 (as a percentage)
                            minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
                            lineHeight: 25, // Default is 25 (in px), used for when text wraps
                        }
                    },
                    legend: {
                        display: false,
                    },
                    plugins: {
                        labels: {
                            render: 'persentage',
                            precision: 0,
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0;
                                let dataArr = ctx.chart.data.datasets[0].data;
                                dataArr.map(data => {
                                    sum += data;
                                });
                                let percentage = (value * 100 / sum).toFixed(0) * 1;
                                return '';
                                // return percentage + "%";
                                // if (percentage < 8) {
                                //     return '';
                                // } else {

                                // }
                                // let val = value * 100 / sum;
                                // let percentage = value ? Math.round10(val, -1) + "%" : "";
                            },
                            font: {
                                size: '10',
                                weight: "bold"
                            },
                            color: "#000"
                        }
                    }
                },
            });
        }
    }
    if (circeleChartData4) {
        let labels = new Array();;
        let datasets = new Array();
        let backgroundColor = new Array();
        let sum = 0;

        for (let i = 0; i < circeleChartData4.data.length; i++) {
            labels[i] = circeleChartData4.data[i].label;
            datasets[i] = circeleChartData4.data[i].value;
            backgroundColor[i] = circeleChartData4.data[i].backgroundColor;
            sum += circeleChartData4.data[i].value;
        }
        if (sum > 0) {
            new Chart(document.getElementById('chartCircle-4'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: datasets,
                        backgroundColor: backgroundColor,
                        borderWidth: 0
                    }]
                },
                options: {
                    cutoutPercentage: 60,
                    aspectRatio: 1,
                    maintainAspectRatio: false,
                    tooltips: {
                        filter: function (tooltipItem, data) {
                            var label = data.labels[tooltipItem.index];
                            if (label == "") {
                                return false;
                            } else {
                                return true;
                            }
                        }
                    },
                    elements: {
                        center: {
                            text: Circle_4_CenterTxt,
                            color: '#EAC15A', // Default is #000000
                            fontStyle: 'SourceSansBold', // Default is Arial
                            sidePadding: 20, // Default is 20 (as a percentage)
                            minFontSize: 10, // Default is 20 (in px), set to false and text will not wrap.
                            lineHeight: 25, // Default is 25 (in px), used for when text wraps
                        }
                    },
                    legend: {
                        display: false,
                    },
                    plugins: {
                        labels: {
                            render: 'persentage',
                            precision: 0,
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0;
                                let dataArr = ctx.chart.data.datasets[0].data;
                                dataArr.map(data => {
                                    sum += data;
                                });
                                let percentage = (value * 100 / sum).toFixed(0) * 1;
                                return '';
                                // return percentage + "%";
                                // if (percentage < 8) {
                                //     return '';
                                // } else {

                                // }
                                // let val = value * 100 / sum;
                                // let percentage = value ? Math.round10(val, -1) + "%" : "";
                            },
                            font: {
                                size: '10',
                                weight: "bold"
                            },
                            color: "#000"
                        }
                    }
                },
            });
        }
    }
};


let barDataSum = 0;
let barPercentageArr = [];
/* Bar chart config*/
// calculate sum
bar1VallArr.map((v, i) => {
    barDataSum += v
})

//calculate percentage

for (let i = 0; i < bar1VallArr.length; i++) {
    let percentage = Math.round((bar1VallArr[i] / barDataSum) * 100);
    barPercentageArr.push(percentage);
}


// Total percentage
barPercentageArr.map((v, i) => {
    $($('.bar-chart .bar-content')[i]).css('height', `${v}%`);
    $($('.bar-chart .bar-percentage')[i]).text(`${v}` + '%');
});

// Total count
bar1VallArr.map((v, i) => {
    $($('.bar-chart .bar-count')[i]).text(`${v}` + 'шт');
});





/* Drow all elements*/

let circle1Chart2 = $('#chart2-circle1'),
    circle2Chart2 = $('#chart2-circle2'),
    circle3Chart2 = $('#chart2-circle3')

if (isNaN(circleChart2Val1)) {
    circleChart2Val1 = 0;
}
if (isNaN(circleChart2Val2)) {
    circleChart2Val2 = 0;
}
if (isNaN(circleChart2Val3)) {
    circleChart2Val3 = 0;
} else {
    renderMyCircles(circle1Chart2, circleChart2Val1);
    renderMyCircles(circle2Chart2, circleChart2Val2);
    renderMyCircles(circle3Chart2, circleChart2Val3);
}


/*** Nested Doughnuts ***/

function renderMyCircles(circle, persentage) {
    let r = circle.attr('r');
    let c = Math.PI * (r * 2);


    if (persentage < 0) {
        persentage = 0;
    }
    if (persentage > 100) {
        persentage = 100;
    }

    // var pctMedium = ((100 - persentage) / 100) * c;
    // console.log(pctMedium)

    roundDraw = persentage * c / 100 + ' 999';

    circle.attr('stroke-dasharray', roundDraw)

}


//Circles tooltip data




//Circles tooltip settings


/* Tooltip position and data */


$('.circle-container').on('mouseover', function (e) {

    /* Second circles-chart tooltip */

    let tooltipCount = $('.doughnutTip .doughnut-count');
    let tooltipPercentage = $('.doughnutTip .doughnut-percentage');
    let circleEl = e.target.getAttribute('data-circle');
    // console.log(e.target)

    if (circleEl === 'c-2-1') {
        // tooltipPercentage.text(circleChart2Val1 + '%');
        tooltipCount.text(nestedDoughnutsValues[0] + ' шт');
        tooltipPercentage.text(nestedDoughnutsPercentage[0] + '%');

        $('.doughnutTip').css({
            'opacity': '1',
            'top': '1px',
            'right': '42px',
        })
    }

    if (circleEl === 'c-2-2') {
        // tooltipPercentage.text(circleChart2Val2 + '%');
        tooltipCount.text(nestedDoughnutsValues[1] + ' шт');
        tooltipPercentage.text(nestedDoughnutsPercentage[1] + '%');
        $('.doughnutTip').css({
            'opacity': '1',
            'top': '46px',
            'right': '42px',
        })
    }

    if (circleEl === 'c-2-3') {
        // tooltipPercentage.text(circleChart2Val3 + '%');
        tooltipCount.text(nestedDoughnutsValues[2] + ' шт');
        tooltipPercentage.text(nestedDoughnutsPercentage[2] + '%');
        $('.doughnutTip').css({
            'opacity': '1',
            'top': '80px',
            'right': '83px',
        })
    }
})


/**
 * Hide Tooltips
 */

let circleCharts = document.querySelectorAll('.circle-box');
$(circleCharts).on('mouseout', function (e) {
    let el = e.target.getAttribute('class');
    // console.log(el)
    for (let i = 0; i < circleCharts.length; i++) {
        if (el !== 'bar' && el !== 'tooltip' && el !== 'svg-box') {
            $('.doughnutTip').css({
                'opacity': '0',
                'top': '0',
                'right': '0'
            })
        }
    }
});

$(circleCharts).on('touchstart', function (e) {
    let el = e.target.getAttribute('class');
    for (let i = 0; i < circleCharts.length; i++) {
        for (let i = 0; i < circleCharts.length; i++) {
            if (el !== 'bar' && el !== 'tooltip' && el !== 'svg-box') {
                $('.doughnutTip').css({
                    'opacity': '0',
                    'top': '0',
                    'right': '0'
                })
            }
        }
    }
})





// Progress Bars drow

// Total count
progressBarsData.map((v, i) => {
    $($('.percentage-count .progress-count')[i]).text(`${v}` + 'шт');
});

let progressDataSum = 0;
let progressPercentageArr = [];

// calculate sum
progressBarsData.map((v, i) => {
    progressDataSum += v
})



//calculate percentage

for (let i = 0; i < progressBarsData.length; i++) {
    let percentage = Math.round((progressBarsData[i] / progressDataSum) * 100);
    progressPercentageArr.push(percentage);
}


// Total percentage
progressPercentageArr.map((v, i) => {
    $($('.progress-loader-color')[i]).css('width', `${v}%`);
    $($('.percentage-count .progress-percentage')[i]).text(`${v}` + '%');
});