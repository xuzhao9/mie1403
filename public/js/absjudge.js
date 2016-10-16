$(document).ready(function() {
    $('#first-page').hide();
    $('#exp-colortitle').text("1-");
    $('#estimate-page').hide();
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#illuHeader').hide();
    $('#result-display-page').hide();
    $('#interval-page').hide();
    $('#image2').click(() => {
	$('#introduction-page').hide();
	// arrange number of options
	first(8, "red");
    });
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

var sessionResult = [];
var timeIntervalArray = [240, 300, 180, 360, 420, 120, 60, 480];
var time_array = [];

function gen_time_array(num_option) {
    time_array = [];
    for(var i = 0; i < num_option; i ++) {
	for(var j = 0; j < 1; j ++) {
	    time_array.push(timeIntervalArray[i]);
	}
    }
    time_array = shuffle(time_array);
}

// num_option: number of options
function first(num_option, color) {
    // generate time array for this num_option;
    if(color == "blue") {
	set_blue_circle();
    } else if (color == "red") {
	set_red_circle();
    }
    gen_time_array(num_option);
    $('#estimate-page').hide();
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#result-display-page').hide();
    $('#illuHeader').show();
    $('#first-page').show();
    $('#exp-title').text("Absolute Judgement ");
    $('#exp-subtitle').text("0");
    // generate buttons
    $('#button-container').html('<button id="start-btn" style="padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-right:3%"> Start </button>');
    gen_buttons($('#button-container'), num_option);
    $('#start-btn').off('click');
    $('#start-btn').click(() => {
	second(num_option, 0, color); // start first test in time_array
    });
}

function gen_replay_next(element, num_option, time_index, color) {
    var fir = '<button id="button-replay" style="padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-right:3%" type="button">Replay </button>';
    var sec = '<button id="button-next" style="padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-right:3%" type="button">Next </button>';
    element.append(fir);
    element.append(sec);
    $('#button-replay').off('click');
    $('#button-replay').click(() => {
	show_circle_audio(time_array[time_index] * 10);
    });
    $('#button-next').off('click');
    $('#button-next').click(() => {
	var val = $("#input-submit-container form input[type='radio']:checked").val();
	var sessionId = num_option / 2 - 1;
	if(color == "red") {
	    sessionId = sessionId * 2;
	    if(sessionResult[sessionId] === undefined) {
		sessionResult[sessionId] = [];
	    }
	    sessionResult[sessionId].push([time_array[time_index], val]);
	} else if (color == "blue") {
	    sessionId = sessionId * 2 + 1;
	    if(sessionResult[sessionId] === undefined) {
		sessionResult[sessionId] = [];
	    }
	    sessionResult[sessionId].push([time_array[time_index], val]);
	}
	if(time_index == time_array.length - 1) {
	    alert(sessionResult[sessionId]);
	    if(num_option === 8 && color === "blue") {
		alert("congrats! you have finished the experiment");
	    } else {
		if(color == "red") {
		    first(num_option, "blue");
		} else {
		    first(num_option + 2, "red");
		}
	    }
	} else {
	    second(num_option, time_index + 1, color);    
	}
    });
}

function gen_radios(element, num_option) {
    var fir= '<input id=radio-';
    var sec='" style="margin-right: 5px;" type="radio" name="choose" align="right" value="';
    var thi = '">';
    for(var i = 0; i < num_option; i ++) {
	var t = timeIntervalArray[i] / 100;
	var html = fir + timeIntervalArray[i] + sec + t + thi + t;
	element.append(html);
    }
    element.append('<br/>');
}

function gen_buttons(element, cnt) {
    var fir = '<button id="button' + '-';
    var sec = '" style="padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-right:3%" type="button">';
    var third = '</button>';
    var button_arr = [];
    for(var i = 0; i < cnt; i ++) {
	var t = timeIntervalArray[i] / 100;
	var html = fir + timeIntervalArray[i] + sec + t + third;
	element.append(html);
	button_arr.push(i);
    }
    for(var i = 0; i < button_arr.length; i ++) {
	var t = timeIntervalArray[i];
	$('#button-' + t).off('click');
	$('#button-' + t).attr('vv', t);
	$(document).on('click', ("#button-" + t), function() {
	    var vv = parseInt($(this).attr('vv'));
	    show_circle_audio(vv * 10);
	});
    }
}

function show_circle_audio(time) {
    genProm(1000).then(() => {
	audioPlay();
	showCircle();
	return genProm(time);
    }).then(() => {
	hideCircle();
    });
}

var userRedArray = [];
var userBlueArray = [];
var trialSize = 8;

function get_color() {
    return $('#svg-circle svg circle').attr('fill');
}

function second(num_option, time, color) {
    $('#first-page').hide();
    $('#input-page').show();
    // set title
    $('#exp-subtitle').text(time+1);
    // empty input submit container
    $('#input-submit-container').html('<form id="#submit-form" action=""> </form>');
    show_circle_audio(time_array[time] * 10);
    gen_replay_next($('#input-submit-container'), num_option, time, color);
    gen_radios($('#input-submit-container form'), num_option);
}

function set_blue_circle() {
    $('#headcenter h1').css('color', 'blue');
    $('#exp-colortitle').text("2-");
    $('#svg-circle svg circle').attr('fill', 'blue');
    $('#svg-circle svg circle').attr('stroke', 'blue');
}

function set_red_circle() {
    $('#headcenter h1').css('color', 'red');
    var t = parseInt($('#exp-colortitle').text()[0]) + 1;
    $('#exp-colortitle').text(t + "-");
    $('#svg-circle svg circle').attr('fill', 'red');
    $('#svg-circle svg circle').attr('stroke', 'red');
}


var redResult = [];
var blueResult = [];

var redLogResult = [];
var blueLogResult = [];

// ======================================  Result Page ============================================
function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function show_result() {
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#headcenter h1').css('color', 'white');
    $('#exp-title').text("Results");
    $('#exp-colortitle').text("");
    $('#exp-subtitle').text("");
    //redResult.push([0, 0]);
    for(var i = 0; i < userRedArray.length; i ++) {
	var t = [parseFloat((timeIntervalArray[i] / 1000).toFixed(2)), parseFloat(userRedArray[i].toFixed(2))];
	redResult.push(t);
    }
    //blueResult.push([0, 0]);
    for(var i = 0; i < userBlueArray.length; i ++) {
	var t = [parseFloat((timeIntervalArrayBlue[i] / 1000).toFixed(2)), parseFloat(userBlueArray[i].toFixed(2))];
	blueResult.push(t);
    }
    // Log graph
    //redLogResult.push([0, 0]);
    for(var i = 0; i < userRedArray.length; i ++) {
	var t = [parseFloat(getBaseLog(2, (timeIntervalArray[i] / 1000.0)).toFixed(2)), parseFloat(getBaseLog(2, userRedArray[i]).toFixed(2))];
	redLogResult.push(t);
    }
    //blueLogResult.push([0, 0]);
    for(var i = 0; i < userBlueArray.length; i ++) {
	var t = [parseFloat(getBaseLog(2, (timeIntervalArrayBlue[i] / 1000.0)).toFixed(2)), parseFloat(getBaseLog(2, userBlueArray[i]).toFixed(2))];
	blueLogResult.push(t);
    }
    $('#result-display-page').show();
    show_chart();
}

function show_chart() {
    var myChart = Highcharts.chart('result-chart',  {
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
            pointFormat: '({point.x},{point.y})'
        },  
	navigation: {
            menuItemStyle: {
                fontWeight: 'normal',
                background: 'none'
            },
            menuItemHoverStyle: {
                fontWeight: 'bold',
                background: 'none',
                color: 'black'
            }
        }, 
		
	series: [
	   {
	    regression: true,
	    regressionSettings: {
		type: 'power', 
		color: 'rgba(223, 83, 83, .9)',
		marker: {
                enabled: false
            },		
	    },
	    name: 'Red',
	    showInLegend: false,
	    color: 'rgba(223, 83, 83, .5)',
        data: redResult
        }, 
		
		{
	    regression: true,
	    regressionSettings: {
		type: 'power',
		color: 'rgba(83, 83, 223, .9)',
		marker: {
                enabled: false
            },

	    },
	    name: 'Blue',
		showInLegend: false, 
	    color: 'rgba(83, 83, 223, .5)',
        data: blueResult
        },
		
		{
		   regression: true,
		   showInLegend: false,
			regressionSettings: {
			type: 'linear', 
			color: '#888888',
			dashStyle: 'ShortDash',
			showInLegend: false	
		  },			  
		    name: 'x=y',	  
			marker: {
					enabled: false
			},	
		  data:[[0,0], [5,5]]
		}
		]
    });
	
	
    var myLogChart = Highcharts.chart('logresult-chart',  {
	marker: {
            radius: 5
        },
	chart: {
	    type: 'scatter',
	    marginLeft:80,
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
	
	tooltip: {
            headerFormat: '<b>log I : log S</b><br>',
            pointFormat: '({point.x},{point.y})'
        },
	navigation: {
            menuItemStyle: {
                fontWeight: 'normal',
                background: 'none'
            },
            menuItemHoverStyle: {
                fontWeight: 'bold',
                background: 'none',
                color: 'black'
            }
        },
	series: [
	  {
	    regression: true,
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
       }, 
		
	  {
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
      },
	  
		  
		  {
		   regression: true,
		   showInLegend: false,
			regressionSettings: {
			type: 'linear', 
			color: '#888888',
			dashStyle: 'ShortDash',
			showInLegend: false
		  },
			marker: {
					enabled: false
			},			  
		  name: 'x=y',
		  data:[[-0.5,-0.5], [2.3,2.3]]
		}
	  ]
    });
}

//Update 10.11
function show_introduction() 
{
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#headcenter h1').css('color', 'white');
    $('#exp-title').text("");
    $('#exp-colortitle').text("");
    $('#exp-subtitle').text("");
}

function show_interval() 
{
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#headcenter h1').css('color', 'white');
    $('#exp-title').text("");
    $('#exp-colortitle').text("");
    $('#exp-subtitle').text("");
}
