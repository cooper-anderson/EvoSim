/**
 * Created by Cooper Anderson on 11/6/16 AD.
 */

datas = {
	C3: [Math.round(Math.random() * 100)],
	C6: [Math.round(Math.random() * 100)],
	D4: [Math.round(Math.random() * 100)],
	D5: [Math.round(Math.random() * 100)],
	D6: [Math.round(Math.random() * 100)],
	F6: [Math.round(Math.random() * 100)]
};
function generateSeries(data) {
	var series = [];
	for (var name in data) {
		series.push({name: name, data: data[name]});
	}
	return series;
}
$(function () {
	$("#diversityGraph").highcharts({
		chart: {
			type: 'area',
			animation: true,
			zoomType: 'x'
		},
		title: {
			enabled: false,
			text: 'Diversity'//'Random Numbers That go Up and Down'
		},
		xAxis: {
			allowDecimals: false,
			tickmarkPlacement: 'on',
			title: {
				enabled: false
			}
		},
		yAxis: {
			labels: {
				rotation: -90
			},
			title: {
				text: ''
			}
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color};">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>',
			split: true
		},
		plotOptions: {
			area: {
				stacking: 'percent',
				lineColor: '#ffffff',
				lineWidth: 1,
				marker: {
					lineWidth: 1,
					lineColor: '#ffffff',
					enabled: false
				},
				animationLimit: 50
			}
		},
		series: []
	});
});
$(function () {
	$("#fitnessGraph").highcharts({
		title: {
			text: 'Fitness',
			enabled: false
		},
		xAxis: {
			allowDecimals: false
		},
		yAxis: {
			title: {
				text: ''
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			allowDecimals: true
		},
		tooltip: {
			valueSuffix: 'm',
			split: true
		},
		plotOptions: {
			line: {
				marker: {
					enabled: false
				}
			}
		},
		series: [{
			name: 'a',
			data: [0]
		}, {
			name: 'b',
			data: [0]
		}, {
			name: 'c',
			data: [0]
		}]
		/*series: [{
			name: '100%',
			data: [7.0]
		}, {
			name: '75%',
			data: [5.0]
		}, {
			name: '50%',
			data: [4]
		}, {
			name: '25%',
			data: [3]
		}, {
			name: '0%',
			data: [1]
		}]*/
	});
});
$(function() {
	$("#historyGraph").highcharts({
		chart: {
			type: 'column'
		},
		title: {
			text: "Histogram"
		},
		xAxis: {
			categories: ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0', '1.1', '1.2']
		},
		yAxis: {
			title: {
				text: null
			}
		},
		//tooltip: {
		//	pointFormat: '<span style="color:{series.color};">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>'
		//},
		plotOptions: {
			column: {
				pointPadding: 0,//-.001,
				groupPadding: -.001,
				borderWidth: 0,
			}
		},
		series: [{
			name: "Creatures",
			data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
		}]
	})
});

removal = setInterval(function() {if ($(".highcharts-credits").length) {$(".highcharts-credits").remove(); clearInterval(removal)}});
var fitness, diversity, histogram, cont = false, play = false, reset = false;
fitnessInverval = setInterval(function() {
	if ($("#fitnessGraph").children().length) {
		fitness = $("#fitnessGraph").highcharts();
		fitness.options.chart.animation = true;
		clearInterval(fitnessInverval);
		cont = false;
	}
});
diversityInverval = setInterval(function() {
	if ($("#diversityGraph").children().length) {
		diversity = $("#diversityGraph").highcharts();
		clearInterval(diversityInverval);
		cont = false;
	}
});
historyInterval = setInterval(function() {
	if ($("#historyGraph").children().length) {
		histogram = $("#historyGraph").highcharts();
		clearInterval(historyInterval);
		cont = false;
	}
});
time = 0

$("#run").on("click", function(event) {
	play = !play;
	create();
});

$("#loop").on("click", function(event) {
	cont = !cont;
	generationSlider.enabled = !generationSlider.enabled;
	$("#generationSlider").slider("refresh");
	$("#loop").toggleClass("active");
});

$("#fast").on("click", function(event) {
	reset = true;
})

$(".btn").on("click", function(event) {
	$(this).blur();
})

var prev;
$(".preview").on("mouseover", function() {
	if (simulator.creatures.length > 0) {
		prev = this;
		createViewWindow(this);
	}
})

$(".preview").on("mouseout", function() {
	clearInterval(viewWindow.interval);
	$("#viewWindow").remove();
})

var scale = true;
aSigma = new sigma({
	renderer: {
		container: document.getElementById('canvas1'),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		autoRescale: scale
	}
});

bSigma = new sigma({
	renderer: {
		container: document.getElementById('canvas2'),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		autoRescale: scale
	}
});

cSigma = new sigma({
	renderer: {
		container: document.getElementById('canvas3'),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		autoRescale: scale
	}
});

/*a = new Creature();
aSigma = new sigma({
	renderer: {
		container: document.getElementById('canvas1'),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		autoRescale: false
	}
});
a.Draw(aSigma);

b = new Creature();
bSigma = new sigma({
	renderer: {
		container: document.getElementById('canvas2'),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		autoRescale: false
	}
});
b.Draw(bSigma);

c = new Creature();
cSigma = new sigma({
	renderer: {
		container: document.getElementById('canvas3'),
		type: 'canvas'
	},
	settings: {
		doubleClickEnabled: false,
		autoRescale: false
	}
});
c.Draw(cSigma);

function norm() {
	a.Update();
	a.Draw(aSigma);
	b.Update();
	b.Draw(bSigma);
	c.Update();
	c.Draw(cSigma);
}

function run() {
	a.RunSimulation();
	a.Draw(aSigma);
	b.RunSimulation();
	b.Draw(bSigma);
	c.RunSimulation();
	c.Draw(cSigma);
}

interval = setInterval(function() {
	if (play) {
		norm();
		if (![a.data.flatGrounded, b.data.flatGrounded, c.data.flatGrounded].includes(false) || reset) {
			if (!reset) {
				fitness.series[0].addPoint(a.GetFitness());
				fitness.series[1].addPoint(b.GetFitness());
				fitness.series[2].addPoint(c.GetFitness());
			}
			reset = false;
			a = new Creature();
			b = new Creature();
			c = new Creature();
		}

	}
}, 1000 / simulator.frameRate)*/

var viewWindow = {
	sigma: undefined,
	interval: undefined,
	creature: undefined
};
function createViewWindow(preview) {
	var mode = "big";
	if (mode == "small") {
		$("body").append(`<div style="
	position: absolute;
	color: white;
	background-color: #2a2a2b;
	width: ${$(preview).outerWidth()}px;
	height: ${$(preview).outerHeight()}px;
	left: ${$(preview).offset().left}px;
	top: ${$(preview).offset().top + $(preview).outerHeight()}px;
	margin-top: 1%;
	border: dashed 1px black;
" id="viewWindow" data-id="${$(preview).data().id}"></div>`);
	} else {
		$("body").append(`
			<div id="viewWindow" style="position: absolute; background-color: #2a2a2b; color: #E0E0E3; font-size: 20px; font-family: 'Unica One', sans-serif;
					width: ${$("#historyGraph").outerWidth()}px;
					height: ${$("#historyGraph").outerHeight()}px;
					left: ${$("#historyGraph").offset().left}px;
					top: ${$("#historyGraph").offset().top}px;
					padding: 0px 10px 90px 0px;">
				<style>
					.circles {
						top: 6px;
						left: 13px;
						text-align: center;
						cursor: default !important;
					}
					.circles button {
						outline:none !important;
						border: none !important;
						width: 12px;
						height: 12px;
						-webkit-border-radius: 6px;
						border-radius: 6px;
						-webkit-background-clip: padding;
						-moz-background-clip: padding;
						background-clip: padding-box;
						background-color: #535559;
						-webkit-transition: background-color .2s;
						-moz-transition: background-color .2s;
						-o-transition: background-color .2s;
						-ms-transition: background-color .2s;
						transition: background-color .2s;
						opacity: .7;
						-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)";
						filter: alpha(opacity=70);
						border: 0;
					}
					.circles button:hover {
						opacity: 1;
						-ms-filter: none;
						filter: none;
					}
					.circles button + button {
						margin-left: 4px;
					}
					.circles>button {
						margin-top: 16px;
						margin-left: 15px;
						margin-right: 7px;
					}
					.circles>span {
						position: relative;
						bottom: -2px;
						margin-right: 10px;
					}
				</style>
				<p align="center" style="margin: 5px;">CREATURE PREVIEW</p>
				<div style="
					margin: 8px 0px 0px;
					width: 100%; height: 100%;
					border: dashed 1px black;" id="viewWindowCanvas" data-id="${$(preview).data().id}">
				</div>
				<div align="center" style="width: 100%; height: 100%; font-size: 12px; font-weight: bold;" class="circles">
					<button style="background-color: #36db47"></button><span>origin</span>
					<button style="background-color: #fb615b"></button><span>mass</span>
					<button style="background-color: #256fdb"></button><span>major</span>
					<button style="background-color: #dbbe25"></button><span>minor</span>
				</div>
			</div>
		`);
	}
	viewWindow.sigma = new sigma({
		renderer: {
			container: document.getElementById('viewWindowCanvas'),
			type: 'canvas'
		},
		settings: {
			doubleClickEnabled: false,
			autoRescale: false
		}
	})
	viewWindow.creature = clone(simulator.creatures[$(preview).data().id]);
	viewWindow.creature.ResetScores();
	viewWindow.creature.Normalize();
	viewWindow.interval = setInterval(function() {
		viewWindow.creature.Update();
		viewWindow.creature.Draw(viewWindow.sigma);
	}, 1000 / simulator.frameRate);
}

function getSeriesNames(graph) {
	var names = []
	for (var series in graph.series) {
		names.push(graph.series[series].name);
	}
	return names;
}

function getSeries(graph, name) {
	if (getSeriesNames(graph).includes(name)) {
		for (var series in graph.series) {
			if (graph.series[series].name == name) {
				return graph.series[series];
			}
		}
	} else {
		return false;
	}
}

function updateCreatures() {
	var fit = {
		element: $(".highcharts-axis.highcharts-xaxis")[0],
		first: $(".highcharts-axis.highcharts-xaxis")[0].children[0].getBoundingClientRect().left,
		last: $(".highcharts-plot-background")[0].width.baseVal.value
	}
	var div = {
		element: $(".highcharts-axis.highcharts-xaxis")[1],
		first: $(".highcharts-axis.highcharts-xaxis")[1].children[0].getBoundingClientRect().left,
		last: $(".highcharts-plot-background")[1].width.baseVal.value
	}
	var gen = $("#generationSlider").slider("getValue") - 1, c, max = $("#generationSlider").slider("getAttribute").max;
	$(".separator.top").width(`${(fit.first + ((gen+1) / max * (fit.last - 9)))}px`);
	$(".separator.bottom").width(`${(div.first + ((gen+1) / max * (div.last - 7)))}px`);
	if (gen != -1) {
		c = clone(simulator.generations[gen].creatures[0]);
		c.Normalize();
		$("#canvas3").data().id = c.id;
		c.Draw(cSigma, false, false, false, 1000000);
		c = clone(simulator.generations[gen].creatures[Math.round(simulator.creature.count / 2)]);
		c.Normalize();
		$("#canvas2").data().id = c.id;
		c.Draw(bSigma, false, false, false, 1000000);
		c = clone(simulator.generations[gen].creatures[simulator.creature.count - 1]);
		c.Normalize();
		$("#canvas1").data().id = c.id;
		c.Draw(aSigma, false, false, false, 1000000);
	}
}

function create() {
	if (typeof g == "undefined") {
		g = new Generation();
	} else {
		g = g.Reproduce();
	}
	for (var key in g.species) {
		if (!getSeriesNames(diversity).includes(key)) {
			diversity.addSeries({name: key, data: [0]});
		}
	}
	for (var series in diversity.series) {
		if (diversity.series[series].name in g.species) {
			var key = diversity.series[series].name;
			getSeries(diversity, key).addPoint(g.species[key]);
		} else {
			diversity.series[series].addPoint(0);
		}
	}
	fitness.series[0].addPoint(Number(g.creatures[0].GetFitness().toFixed(2)));
	fitness.series[1].addPoint(Number(g.creatures[Math.round(simulator.creature.count / 2)].GetFitness().toFixed(2)));
	fitness.series[2].addPoint(Number(g.creatures[simulator.creature.count - 1].GetFitness().toFixed(2)));
	generationSlider.max++;
	if (generationSlider.value == generationSlider.max - 1) {
		generationSlider.value++;
	}
	$("#generationSlider").slider("refresh");
	updateCreatures();
}

setInterval(function() {
	if ($(".highcharts-plot-background").length != 0) {
		$(".separator.top").height($(".highcharts-plot-background")[1].height.baseVal.value + 21);
		$(".separator.bottom").height($(".highcharts-plot-background")[0].height.baseVal.value + 21);
	}
});

setInterval(function() {
	if (cont) {
		create();
	}
}, 1000);