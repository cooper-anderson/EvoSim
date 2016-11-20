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
			//tickmarks: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100']
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
		series: generateSeries(datas)
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
		}]
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
})

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

setInterval(function() {
	if (cont) {
		time += 1/500;
		for (var series in fitness.series) {
			var previous = fitness.series[series].data[fitness.series[series].data.length - 1].y;
			var random = Math.round((Math.random() * 2)) - 1;
			//datas[country].push((previous + random >= 0 && previous > 0) ? datas[country][i-1] + random : previous)
			fitness.series[series].addPoint((previous + random >= 0 && previous > 0) ? previous + random : previous);
			//fitness.series[series].addPoint(previous + (Math.sin(time * 90) * (random)));
		}
		for (var series in diversity.series) {
			var previous = diversity.series[series].data[diversity.series[series].data.length - 1].y;
			var random = Math.round((Math.random() * 2)) - 1;
			//datas[country].push((previous + random >= 0 && previous > 0) ? datas[country][i-1] + random : previous)
			diversity.series[series].addPoint((previous + random >= 0 && previous > 0) ? previous + random : previous)
		}
		//$("#generationSlider").slider("setAttribute", "max", sliderData.max + 1);
		generationSlider.max++;
		if (generationSlider.value == generationSlider.max - 1) {
			generationSlider.value++;
		}
		$("#generationSlider").slider("refresh");
		/*if (sliderData.value == sliderData.max - 1) {
			sliderData.value ++;
		} else {
			sliderData.value = $("#generationSlider").slider("getAttribute").value;
		}*/
		//$("#generationSlider").slider("refresh");
		//if (sliderData)
		//$("#generationSlider").slider("refresh");
	}
}, 1000);

a = new Creature();
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

interval = setInterval(function() {
	if (play) {
		norm();
		if (![a.IsGrounded(), b.IsGrounded(), c.IsGrounded()].includes(false) || reset) {
			reset = false;
			a = new Creature();
			b = new Creature();
			c = new Creature();
		}

	}
}, 1000 / simulator.frameRate)

/*for (var i = 0; i < simulator.frameRate * 15 * 100; i++) {
	b.Update();
	b.Draw(bSigma);
}*/