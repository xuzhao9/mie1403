$(document).ready(function() {
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#first-page').hide();
    $('#illuHeader').hide();
    $('#interval-page').hide();
    $('#image2').click(() => {
	first("red");
    });
    if (window.location.hash === "#result") {
	$('#introduction-page').hide();
	mock();
	return;
    }
});

var red_standard = 1.0;
var blue_arr = [0.5, 0.7, 0.9, 1.1, 1.3, 1.5];

var blue_standard = 3.0;
var red_arr = [2.0, 2.4, 2.8, 3.2, 3.6, 4.0];

function genProm(interval) {
    return new Promise(function(resolve, reject) {
	setTimeout(resolve, interval);
    })
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

var time_array;

function gen_time_array(color) {
    time_array = [];
    for(var i = 0; i < 10; i ++) {
	for(var j = 0; j < blue_arr.length; j ++) {
	    if(color === "red") {
		time_array.push(blue_arr[j]);
	    } else if (color === "blue") {
		time_array.push(red_arr[j]);
	    }
	}
    }
    shuffle(time_array);
}

var standard = 0;

function first(color) {
    $('#introduction-page').hide();
    $('#exp-title').text("Difference Thresholds ");
    standard = 0;
    if(color === "red") {
	$('#exp-colortitle').text("1-");
	$('#sec-indicator').text("1 second.");
	standard = red_standard * 1000;
    }else if(color === "blue") {
	$('#exp-colortitle').text("2-");
	$('#sec-indicator').text("3 seconds.");
	standard = blue_standard * 1000;
    }
    gen_time_array(color);
    $('#exp-subtitle').text("1");
    $('#illuHeader').show();
    $('#first-page').show();
    $('#input-submit-container').hide();
    show_circle_audio(standard, undefined, second, color, 0);
}

var session_result = [];

function second(color, seqno) {
    $("#input-submit-container form input[type='radio']").each(function() {
	$(this).prop("checked", false);
    });
    $('#exp-subtitle').text(seqno+1);
    $('#input-page').show();
    if(color === "red") {
	set_blue_circle();
    } else if (color === "blue") {
	set_red_circle();
    }
    show_circle_audio((time_array[seqno] * 1000),[$('#input-submit-container')], undefined, color, seqno);
    // set replay and next
    $('#button-REPLAY').off('click');
    $('#button-REPLAY').click(() => {
	if(color === "red") {
	    set_red_circle();
	    hide_buttons();
	    show_circle_audio(standard, undefined, show_circle_audio,
			      time_array[seqno] * 1000, [color, $('#input-submit-container')]);
	} else if(color === "blue") {
	    set_blue_circle();
	    hide_buttons();
	    show_circle_audio(standard, undefined, show_circle_audio,
			      time_array[seqno] * 1000, [color, $('#input-submit-container')]);
	}
    });
    $('#button-NEXT').off('click');
    $('#button-NEXT').click(() => {
	var val = $("#input-submit-container form input[type='radio']:checked").val();
	if(val === undefined || val === NaN) {
	    alert("Please select one answer!");
	    return;
	}
	var new_data =[(standard / 1000.0), time_array[seqno], val];
	session_result.push(new_data);
	if(seqno === time_array.length - 1 && color === "red") {
	    first("blue");
	} else if (seqno === time_array.length - 1 && color === "blue") {
	    show_result(session_result);
	} else {
	    $('#exp-subtitle').text(seqno+2);
	    $("#input-submit-container form input[type='radio']").each(function() {
		$(this).prop("checked", false);
	    });
	    hide_buttons();
	    if(color === "red") {
		set_red_circle();
	    } else if (color === "blue") {
		set_blue_circle();
	    }
	    show_circle_audio(standard, undefined, second, color, (seqno + 1));
	}
    });
}

function hide_buttons() {
    $('#input-submit-container').hide();
}

function show_buttons() {
    $('#input-submit-container').show();
}

// option: if element is not undefined, hide it when show and show it when hide
function show_circle_audio(time, elements, cont, color, seqno) {
    genProm(1000).then(() => {
	audioPlay();
	if(elements !== undefined) {
	    for(var i = 0; i < elements.length; i ++) {
		if(typeof(elements[i]) === "object"){
		    elements[i].hide();
		} else if(typeof(elements[i]) === "string") {
		    if(elements[i] === "red") {
			set_blue_circle();
		    } else if (elements[i] === "blue") {
			set_red_circle();
		    }
		}
	    }
	} 
	showCircle();
	return genProm(time);
    }).then(() => {
	if(elements !== undefined) {
	    for(var i = 0; i < elements.length; i ++) {
		if(typeof(elements[i]) === "object") {
		    elements[i].show();
		}
	    }
	}
	hideCircle();
	if(cont !== undefined) {
	    cont(color, seqno);
	}
    });
}

function set_blue_circle() {
    $('#svg-circle svg circle').attr('fill', 'blue');
    $('#svg-circle svg circle').attr('stroke', 'blue');
}

function set_red_circle() {
    $('#svg-circle svg circle').attr('fill', 'red');
    $('#svg-circle svg circle').attr('stroke', 'red');
}

var red_freq = [];
var red_result = [];
var blue_freq = [];
var blue_result = [];

var mock_result = [];

function mock() {
    for(var i = 0; i < 10; i ++) {
	for(var j = 0; j < blue_arr.length; j ++) {
	    var ran = Math.floor(Math.random() * 10 + 1) % 2;
	    if(ran === 0) {
		mock_result.push([red_standard, blue_arr[j], "yes"]);
	    } else if (ran === 1) {
		mock_result.push([red_standard, blue_arr[j], "no"]);
	    }
	}
    }
    for(var i = 0; i < 10; i ++) {
	for(var j = 0; j < red_arr.length; j ++) {
	    var ran = Math.floor(Math.random() * 10 + 1) % 2;
	    if(ran === 0) {
		mock_result.push([blue_standard, red_arr[j], "yes"]);
	    } else if (ran === 1) {
		mock_result.push([blue_standard, red_arr[j], "no"]);
	    }
	}
    }
    show_result(mock_result);
}

function show_result(result) {
    $('#first-page').hide();
    $('#illuHeader').show();
    $('#exp-title').text("Show Result");
    gen_results(result);
    show_red_chart();
    show_blue_chart();
}

function gen_results(result) {
    red_freq = [];
    blue_freq = [];
    red_result = [];
    blue_result = [];
    for(var i = 0; i < result.length; i ++) {
	var one = result[i][0];
	var two = result[i][1];
	var three = result[i][2];
	if (one === red_standard) {
	    if(red_freq[two] === undefined) {
		red_freq[two] = 0;
	    }
	    if(three === "yes") {
		red_freq[two] += 1;
	    }
	} else if (one === blue_standard) {
	    if(blue_freq[two] === undefined) {
		blue_freq[two] = 0;
	    }
	    if(three === "yes") {
		blue_freq[two] += 1;
	    }
	}
    }
    var red_keys = Object.keys(red_freq);
    for(var i = 0; i < red_keys.length; i ++) {
	red_result.push([parseFloat(red_keys[i]), (red_freq[red_keys[i]] / 10.0)]);
    }
    var blue_keys = Object.keys(blue_freq);
    for(var i = 0; i < blue_keys.length; i ++) {
	blue_result.push([parseFloat(blue_keys[i]), (blue_freq[blue_keys[i]] / 10.0)]);
    }
}

//Psychometric Function Charts
// Chart 1
function show_red_chart() {
    var myChart = Highcharts.chart('red-table',  {
	marker: {
            radius: 5
        },
	chart: {
	    type: 'scatter',
	    marginRight: 80,
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
            text: '<b>Psychometric 	Function</b><br>Standard: RED(1s); Comparison: BLUE (0.5~1.5s)'
        },
	xAxis: {
	    title: {
		enabled: true,
		text: '<b>Stimulus Intensity</b>'
	    }
        },
        yAxis: {
            title: {
                text: '<b>Percentage</b>'
            }
        },
	tooltip: {
            headerFormat: '<b>H(S) : H(T)</b><br>',
            pointFormat: '({point.x},{point.y})'
        },  
	series: [
	    {
		name: '1s',
		showInLegend: false, 
		color: 'rgba(83, 83, 223, .5)',
		data: red_result
	    },
		//y=0.25
	    {
		regression: true,
		showInLegend: false,
		regressionSettings: {
		    type: 'linear', 
		    color: '#888888',
		    dashStyle: 'ShortDash',
		    showInLegend: false	
		},			  
		name: 'y=0.25',	  
		marker: {
		    enabled: false
		},	
		data:[[0,0.25], [1.4,0.25]]
	    },
		//y=0.5
		{
		regression: true,
		showInLegend: false,
		regressionSettings: {
		    type: 'linear', 
		    color: '#33FF99',
		    dashStyle: 'ShortDash',
		    showInLegend: false	
		},			  
		name: 'y=0.5',	  
		marker: {
		    enabled: false
		},	
		data:[[0,0.5], [1.4,0.5]]
	    },
		//y=0.75
		{
		regression: true,
		showInLegend: false,
		regressionSettings: {
		    type: 'linear', 
		    color: '#888888',
		    dashStyle: 'ShortDash',
		    showInLegend: false	
		},			  
		name: 'y=0.75',	  
		marker: {
		    enabled: false
		},	
		data:[[0,0.75], [1.4,0.75]]
	    }
		
	]
    });
}

// Chart 2
function show_blue_chart() {
    var myChart = Highcharts.chart('blue-table',  {
	marker: {
            radius: 5
        },
	chart: {
	    type: 'scatter',
	    marginRight: 80,
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
            text: '<b>Psychometric 	Function</b><br>Standard: BLUE(3s); Comparison: RED (2.0~4.0s)'
        },
	xAxis: {
	    title: {
		enabled: true,
		text: '<b>Stimulus Intensity</b>'
	    }
        },
        yAxis: {
            title: {
                text: '<b>Percentage</b>'
            }
        },
	tooltip: {
            headerFormat: '<b>H(S) : H(T)</b><br>',
            pointFormat: '({point.x},{point.y})'
        },  
	series: [
	    
	    {
		name: '3s',
		showInLegend: false, 
		color: 'rgba(223, 83, 83, .5)',
		data: blue_result
	    },
		//y=0.25
	    {
		regression: true,
		showInLegend: false,
		regressionSettings: {
		    type: 'linear', 
		    color: '#888888',
		    dashStyle: 'ShortDash',
		    showInLegend: false	
		},			  
		name: 'y=0.25',	  
		marker: {
		    enabled: false
		},	
		data:[[0,0.25], [3.8,0.25]]
	    },
		//y=0.5
		{
		regression: true,
		showInLegend: false,
		regressionSettings: {
		    type: 'linear', 
		    color: '#33FF99',
		    dashStyle: 'ShortDash',
		    showInLegend: false	
		},			  
		name: 'y=0.5',	  
		marker: {
		    enabled: false
		},	
		data:[[0,0.5], [3.8,0.5]]
	    },
		//y=0.75
		{
		regression: true,
		showInLegend: false,
		regressionSettings: {
		    type: 'linear', 
		    color: '#888888',
		    dashStyle: 'ShortDash',
		    showInLegend: false	
		},			  
		name: 'y=0.75',	  
		marker: {
		    enabled: false
		},	
		data:[[0,0.75], [3.8,0.75]]
	    }
		
	]
    });
}
