$(document).ready(function() {
    shuffle(timeIntervalArray);
    shuffle(timeIntervalArrayBlue);
	$('#exp-colortitle').text("1-");
    first();
});

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function audioPlay() {
    var audio = new Audio('media/di.wav');
    audio.play();
}


function showCircle() {
    $('#svg-circle').show();
}

function hideCircle() {
    $('#svg-circle').hide();
}

function genProm(interval) {
    return new Promise(function(resolve, reject) {
	setTimeout(resolve, interval);
    })
}

function first() {
    $('#estimate-page').hide();
    $('#input-page').hide();
    $('#svg-circle').hide();
	$('#result-display-page').hide();
    $('#first-page').show();
	$('#exp-title').text("Direct Scaling ");

    $('#exp-subtitle').text("0");
    // after 1 second, play the sound, 500ms => show circle, 1000ms => hideCircle
    genProm(1000).then(() => {
	audioPlay();
	return genProm(500);
    }).then(() => {
	showCircle();
	return genProm(1000);
    }).then(() => {
    	hideCircle();
	return genProm(1000);
    }).then(() => { // wait 1 second, then show next page
	second();
    }).catch(function() {
    });
}

var timeIntervalArray = [618, 1236, 1854, 2472, 3090, 3708, 4326, 4944];
var userRedArray = [];
var timeIntervalArrayBlue = [618, 1236, 1854, 2472, 3090, 3708, 4326, 4944];
var userBlueArray = [];
var trialSize = 2;

function get_color() {
    return $('#svg-circle svg circle').attr('fill');
}

function second() {
    $('#first-page').hide();
    $('#estimate-page').show();
    $('#estimate-replay').off('click');
    $('#estimate-replay').click(() => {
	first();
    });
    $('#estimate-start').off('click');
    $('#estimate-start').click(() => {
	if(get_color() === "red") {
	    third(timeIntervalArray, 0);
	} else if(get_color() === "blue") {
	    third(timeIntervalArrayBlue, 0);
	}

    });
}

function third(arr, interval) {
    if (interval >= trialSize && arr === timeIntervalArray) {
	set_blue_circle();
	first();
	return;
    } else if (interval >= trialSize && arr === timeIntervalArrayBlue) {
	show_result();
	return;
    }
    $('#estimate-page').hide();
    $('#input-page').show();
    $('#input-submit-container').hide();
    $('#exp-subtitle').text(interval+1);
    genProm(1000).then(() => {
	audioPlay();
	return genProm(500);
    }).then(() => {
	showCircle();
	// TODO: this array should be randomized
	return genProm(arr[interval]); 
    }).then(() => {
	hideCircle();
	$('#input-submit-container').show();
	$('#submit-replay').off('click');
	$('#submit-replay').click(() => {
	    third(arr, interval);
	});
	$('#submit-next').off('click');
	$('#submit-next').click(() => {
	    // TODO: check answer valid and store answer in local array
	    if(valid_check(arr)) {
		third(arr, interval + 1);
	    }
	});
    }).catch(() => {});
}

// forth
function set_blue_circle() {
    $('#headcenter h1').css('color', 'blue');
	$('#exp-colortitle').text("2-");
    var v = $('#estimate-page h2').html();
    v = v.replace('red', 'blue');
    $('#estimate-page h2').html(v);
    $('#svg-circle svg circle').attr('fill', 'blue');
    $('#svg-circle svg circle').attr('stroke', 'blue');
}

function valid_check(arr) {
    var v = $('#input-box').val();
    var vv = parseFloat(v);
    var r = !isNaN(vv);
    if(r && vv < 6 && vv > 0) {
	if(arr === timeIntervalArray) {
	    userRedArray.push(vv);
	} else if (arr == timeIntervalArrayBlue) {
	    userBlueArray.push(vv);
	}
    } else {
	alert("Please input a float number n, n is smaller than 6 but larger than 0.");
	r = false;
    }
    $('#input-box').val("");
    return r;
}

var redResult = [];
var blueResult = [];

var redLogResult = [];
var blueLogResult = [];

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function show_result() {
    $('#input-page').hide();
    $('#svg-circle').hide();
	$('#headcenter h1').css('color', 'black');
	$('#exp-title').text("Results");
	$('#exp-colortitle').text("");
    $('#exp-subtitle').text("");
    for(var i = 0; i < userRedArray.length; i ++) {
	var t = [(timeIntervalArray[i] / 1000), userRedArray[i]];
	redResult.push(t);
    }
    for(var i = 0; i < userBlueArray.length; i ++) {
	var t = [(timeIntervalArrayBlue[i] / 1000), userBlueArray[i]];
	blueResult.push(t);
    }
    for(var i = 0; i < userRedArray.length; i ++) {
	var t = [getBaseLog(2, (timeIntervalArray[i] / 1000.0)), getBaseLog(2, userRedArray[i])];
	redLogResult.push(t);
    }
    for(var i = 0; i < userBlueArray.length; i ++) {
	var t = [getBaseLog(2, (timeIntervalArrayBlue[i] / 1000.0)), getBaseLog(2, userBlueArray[i])];
	blueLogResult.push(t);
    }
	$('#result-display-page').show();
    show_chart();
}

function power_regression(data) {
    var sum = [0, 0, 0, 0], n = 0, results = [];
    
    for (len = data.length; n < len; n++) {
        if (data[n][1] != null) {
            sum[0] += Math.log(data[n][0]);
            sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
            sum[2] += Math.log(data[n][1]);
            sum[3] += Math.pow(Math.log(data[n][0]), 2);
        }
    }
    
    var B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
    var A = Math.pow(Math.E, (sum[2] - B * sum[0]) / n);

    for (var i = 0, len = data.length; i < len; i++) {
        var coordinate = [data[i][0], A * Math.pow(data[i][0] , B)];
        results.push(coordinate);
    }
    
    var string = 'y = ' + Math.round(A*100) / 100 + 'x^' + Math.round(B*100) / 100;
    
    return {equation: [A, B], points: results, string: string};

}

function show_chart() {
    var myChart = Highcharts.chart('result-chart',  {
	type: 'scatter',
	marker: {
                radius: 5
            },
	chart: {
		    marginRight: 100,
		    paddingRight: 20
	       },
	 legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            floating: true,
			x: 70,
            y: 50,
        },
        title: {
            text: 'Power law'
        },
        xAxis: {
	    title: {
		enabled: true,
		text: 'Stimulus intensity (s)'
	    }
        },
        yAxis: {
            title: {
                text: 'Sensation magnitude (s)'
            }
        },
	tooltip: {
            headerFormat: '<b>I : S</b><br>',
            pointFormat: '({point.x} , {point.y})'
        },               
		
	series: [{
	    regression: true,
	    enableMouseTracking: false,
	    regressionSettings: {
		type: 'power',
		order: 1, 
		color: 'rgba(223, 83, 83, .9)',
		marker: {
                enabled: false
            },		
	    },
	    name: 'Red',
		showInLegend: false,
	    color: 'rgba(223, 83, 83, .5)',
        data: redResult
        }, {
	    regression: true,
	    regressionSettings: {
		type: 'power',
		order: 1,
		color: 'rgba(83, 83, 223, .9)',
		marker: {
                enabled: false
            },

	    },
	    name: 'Blue',
		showInLegend: false, 
	    color: 'rgba(83, 83, 223, .5)',
        data: blueResult
        }]
    });
	
	
    var myLogChart = Highcharts.chart('logresult-chart',  {
	type: 'scatter',
	marker: {
                radius: 5
            },
	chart: {
		    marginLeft:100,
		    paddingLeft: 20
	       },
	 legend: {
            layout: 'vertical',
            backgroundColor: '#FFFFFF',
            align: 'left',
            verticalAlign: 'top',
            floating: true,  
            x: 100,
            y: 50,			
        },
        title: {
            text: 'Power law in log scale'
        },
        xAxis: {
	    title: {
		enabled: true,
		text: 'Log stimulus intensity (s)'
	    }
        },
        yAxis: {
            title: {
                text: 'Log sensation magnitude (s)'
            }
        },
	
	 plotOptions: {
            series: {
                enableMouseTracking: false
            }
        },
	
	series: [{
	    regression: true,
		enableMouseTracking: false,
	    regressionSettings: {
		type: 'linear',
		color: 'rgba(223, 83, 83, .9)',
		marker: {
                enabled: false
            },
		
	    },
	    name: 'Red',
		showInLegend: false,
	    color: 'rgba(223, 83, 83, .5)',
            data: redLogResult
        }, {
	    regression: true,
	    regressionSettings: {
		type: 'linear',
		color: 'rgba(83, 83, 223, .9)',
		marker: {
                enabled: false
            },
		
	    },
	    name: 'Blue',
		showInLegend: false,
	    color: 'rgba(83, 83, 223, .5)',
            data: blueLogResult
        }]
    });
}
