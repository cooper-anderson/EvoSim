/**
 * Created by Cooper Anderson on 11/6/16 AD.
 */

function getSpecies() {
	let series = []
	for (let nodeCount = simulator.creature.node.minimum; nodeCount <= simulator.creature.node.maximum; nodeCount++) {
		for (let muscleCount = nodeCount; muscleCount <= (nodeCount * (nodeCount - 1)) / 2; muscleCount++) {
			if (muscleCount <= simulator.creature.muscle.maximum) {
				series.push({name: simulator.species[nodeCount-1] + muscleCount, data: [0], visible: false})
			}
		}
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
			text: 'Diversity'
		},
		xAxis: {
			allowDecimals: false,
			tickmarkPlacement: 'on',
			plotLines: [{
				value: 0,
				width: 1,
				color: '#ccbb16',
				zIndex: 100
			}],
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
		series: getSpecies()/*{
			name: "C3",
			data: [0]
		}, {
			name: "D4",
			data: [0]
		}, {
			name: "D5",
			data: [0]
		}, {
			name: "D6",
			data: [0]
		}, {
			name: "E5",
			data: [0]
		}, {
			name: "E6",
			data: [0]
		}*/
	});
});
$(function () {
	$("#fitnessGraph").highcharts({
		chart: {
			zoomType: 'x'
		},
		title: {
			text: 'Fitness',
			enabled: false
		},
		xAxis: {
			plotLines: [{
				value: 0,
				width: 1,
				color: '#ccbb16',
				zIndex: 100
			}],
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
		/*series: [{
			name: 'a',
			data: [0]
		}, {
			name: 'b',
			data: [0]
		}, {
			name: 'c',
			data: [0]
		}]*/
		series: [{
			name: '100%',
			data: [0],
			color: "#90ee7e"
		}, {
			name: '75%',
			data: [0],
			color: "#ca7a3d"
		}, {
			name: '50%',
			data: [0],
			color: "#2b908f"
		}, {
			name: '25%',
			data: [0],
			color: "#ca7a3d"
		}, {
			name: '0%',
			data: [0],
			color: "#f45b5b"
		}]
		/*series: [{
			name: '100%',
			data: [0],
			color: "#90ee7e"
		}, {
			name: '90%',
			data: [0]
		}, {
			name: '80%',
			data: [0]
		}, {
			name: '70%',
			data: [0]
		}, {
			name: '60%',
			data: [0]
		}, {
			name: '50%',
			data: [0],
			color: "#2b908f"
		}, {
			name: '40%',
			data: [0]
		}, {
			name: '30%',
			data: [0]
		}, {
			name: '20%',
			data: [0]
		}, {
			name: '10%',
			data: [0]
		}, {
			name: '0%',
			data: [0],
			color: "#f45b5b"
		}]*/
	});
});
$(function() {
	$("#historyGraph").highcharts({
		chart: {
			type: 'column',
			animation: false,
			zoomType: 'x'
		},
		title: {
			text: "Histogram"
		},
		xAxis: {
			plotLines: [{
				value: 0,
				width: 1,
				color: '#ccbb16',
				zIndex: 100/*,
				label: {
					text: 'Median',
					verticalAlign: 'middle',
					textAlign: 'center'
				}*/
			}]
		},
		yAxis: {
			title: {
				text: null
			}
		},
		//tooltip: {pointFormat: '<span style="color:{series.color};">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f})<br/>'},
		plotOptions: {
			column: {
				pointPadding: 0,//-.001,
				groupPadding: -.001,
				borderWidth: 0,
				animation: false
			},
			animation: false
		},
		series: [{
			name: "Creatures",
			data: [/*29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4*/]
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
	if (cont == true) {
		create();
	}
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

var viewWindow = {
	sigma: undefined,
	interval: undefined,
	creature: undefined,
	time: 0
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
		$("body").append(`<div id="viewWindow" style="position: absolute; background-color: #2a2a2b; color: #E0E0E3; font-size: 20px; font-family: 'Unica One', sans-serif;
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
					<div style="position: absolute; font-size: 12px; z-index: 100; width: 100%; padding: 8px;">
						<div style="position: absolute">
							<span>id: #<span id="creature-id">0</span></span><br>
							<span>species: <span id="creature-species">0</span></span><br>
							<span>fitness: <span id="creature-fitness">0</span></span><br>
							<span>rank: <span id="creature-rank">NaN</span></span>
						</div>
						<div style="position: absolute; right: 18px;">
							<span>time: <span id="creature-time" style="float: right;">0</span></span><br>
							<span>fitness: <span id="creature-currentfitness" style="float: right;">0</span></span><br>
							<span>grounded: <span id="creature-grounded" style="float: right;">true</span></span><br>
							<span>alive: <span id="creature-alive" style="float: right;">false</span></span>
						</div>
					</div>
				</div>
				<div align="center" style="width: 100%; height: 100%; font-size: 12px; font-weight: bold;" class="circles">
					<button style="background-color: #36db47"></button><span>origin</span>
					<button style="background-color: #fb615b"></button><span>mass</span>
					<button style="background-color: #256fdb"></button><span>major</span>
					<button style="background-color: #dbbe25"></button><span>minor</span>
				</div>
			</div>`);
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
	viewWindow.time = 0;
	$("#creature-id").html(viewWindow.creature.id);
	$("#creature-species").html(viewWindow.creature.species);
	$("#creature-fitness").html(viewWindow.creature.GetFitness().toFixed(2));
	viewWindow.creature.ResetScores();
	viewWindow.creature.Normalize();
	viewWindow.interval = setInterval(function() {
		viewWindow.creature.Update();
		viewWindow.creature.Draw(viewWindow.sigma);
		viewWindow.time += 1 / simulator.frameRate;
		$("#creature-time").html(viewWindow.time.toFixed(2));
		$("#creature-currentfitness").html(viewWindow.creature.GetFitness().toFixed(2));
		$("#creature-grounded").html(viewWindow.creature.data.grounded ? "yes" : "no");
		$("#creature-alive").html(viewWindow.creature.data.flatGrounded ? "no" : "yes");
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
	var gen = $("#generationSlider").slider("getValue") - 1, c, max = $("#generationSlider").slider("getAttribute").max;
	var fit = fitness.axes[0].plotLinesAndBands[0].options.value;
	fitness.axes[0].plotLinesAndBands[0].options.value = gen + 1;
	if (fit != fitness.axes[0].plotLinesAndBands[0].options.value) {
		fitness.axes[0].plotLinesAndBands[0].render();
	}
	var div = diversity.axes[0].plotLinesAndBands[0].options.value;
	diversity.axes[0].plotLinesAndBands[0].options.value = gen + 1;
	if (div != diversity.axes[0].plotLinesAndBands[0].options.value) {
		diversity.axes[0].plotLinesAndBands[0].render();
	}
	if (gen != -1) {
		c = clone(simulator.generations[gen].creatures[0]);
		c.Normalize();
		//c.Update();
		$("#canvas3").data().id = c.id;
		c.Draw(cSigma, false, false, false, 1000000);
		c = clone(simulator.generations[gen].creatures[Math.round(simulator.creature.count / 2)]);
		c.Normalize();
		//c.Update();
		$("#canvas2").data().id = c.id;
		c.Draw(bSigma, false, false, false, 1000000);
		c = clone(simulator.generations[gen].creatures[simulator.creature.count - 1]);
		c.Normalize();
		//c.Update();
		$("#canvas1").data().id = c.id;
		c.Draw(aSigma, false, false, false, 1000000);

		var fitnesses = {}
		for (var creature in simulator.generations[gen].creatures) {
			var fit = simulator.generations[gen].creatures[creature].GetFitness().toFixed(2);
			if (!(fit/*.toString()*/ in fitnesses)) {
				fitnesses[fit/*.toString()*/] = 0
			}
			fitnesses[fit/*.toString()*/]++;
		}
		var history = {
			fitness: [],
			count: [],
			data: []
		}
		function ReverseObject(Obj){
			var TempArr = [];
			var NewObj = [];
			for (var Key in Obj){
				TempArr.push(Key);
			}
			for (var i = TempArr.length-1; i >= 0; i--){
				NewObj[TempArr[i]] = [];
			}
			return NewObj;
		}
		for (var key in ReverseObject(fitnesses)) {
			history.fitness.push(key);
			history.count.push(fitnesses[key]);
			history.data.push([Number(key), fitnesses[key]]);
		}
		histogram.series[0].remove();
		histogram.axes[0].categories = history.fitness;
		let series = histogram.addSeries({name: "Creatures", data: history.count, animation: false, color: "#2b908f"});
		/*for (let i in history.count) {
			series.addPoint([history.fitness[i], history.count[i]]);
		}*/
		histogram.render();
		histogram.axes[0].plotLinesAndBands[0].options.value = history.fitness.findIndex(function(item, index, array) {
			if (array.length == 1) {
				return 1;
			}
			if (item == simulator.generations[gen].creatures[Math.round(simulator.creature.count / 2)].GetFitness().toFixed(2)) {
				return index;
			}
		});
		histogram.axes[0].plotLinesAndBands[0].render();
	}
}

function create() {
	window.requestAnimationFrame(function(resolve, reject) {
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
				if (getSeries(diversity, key).data[getSeries(diversity, key).data.length - 1].y == 0) {
					getSeries(diversity, key).setVisible(true);
				}
				getSeries(diversity, key).addPoint(g.species[key]);
			} else {
				diversity.series[series].addPoint(0);
			}
		}
		fitness.series[0].addPoint(Number(g.creatures[0].GetFitness().toFixed(2)));
		fitness.series[1].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .25)].GetFitness().toFixed(2)));
		fitness.series[2].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .5)].GetFitness().toFixed(2)));
		fitness.series[3].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .75)].GetFitness().toFixed(2)));
		fitness.series[4].addPoint(Number(g.creatures[simulator.creature.count - 1].GetFitness().toFixed(2)));
		/*fitness.series[0].addPoint(Number(g.creatures[0].GetFitness().toFixed(2)));
		 fitness.series[1].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .1)].GetFitness().toFixed(2)));
		 fitness.series[2].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .2)].GetFitness().toFixed(2)));
		 fitness.series[3].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .3)].GetFitness().toFixed(2)));
		 fitness.series[4].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .4)].GetFitness().toFixed(2)));
		 fitness.series[5].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .5)].GetFitness().toFixed(2)));
		 fitness.series[6].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .6)].GetFitness().toFixed(2)));
		 fitness.series[7].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .7)].GetFitness().toFixed(2)));
		 fitness.series[8].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .8)].GetFitness().toFixed(2)));
		 fitness.series[9].addPoint(Number(g.creatures[Math.round(simulator.creature.count * .9)].GetFitness().toFixed(2)));
		 fitness.series[10].addPoint(Number(g.creatures[simulator.creature.count - 1].GetFitness().toFixed(2)));*/
		generationSlider.max++;
		if (generationSlider.value == generationSlider.max - 1) {
			generationSlider.value++;
		}
		$("#generationSlider").slider("refresh");
		updateCreatures();
		if (cont) {
			setTimeout(function () {
				create();
			}, 1000);
		}
	});
}

setInterval(function() {
	if ($(".highcharts-plot-background").length != 0) {
		$(".separator.top").height($(".highcharts-plot-background")[1].height.baseVal.value + 21);
		$(".separator.bottom").height($(".highcharts-plot-background")[0].height.baseVal.value + 21);
	}
});

/*setInterval(function() {
	if (cont) {
		create();
	}
}, 1000);*/
//create();