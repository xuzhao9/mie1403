$(document).ready(function() {
    $('#first-page').hide();
    $('#exp-colortitle').text("0-");
    $('#estimate-page').hide();
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#illuHeader').hide();
    $('#result-display-page').hide();
    $('#interval-page').hide();
    gen_random_section();
    $('#image2').click(() => {
	$('#introduction-page').hide();
	// arrange number of options
	first(0);
    });
});

var section_array = [];

function gen_random_section() {
    // 2,4,6,8 sections, each has two instances
    for(var i = 0; i < 2; i ++) {
	for(var j = 2; j < 10; j += 2) {
	    if(i === 0) {
		section_array.push([j, "red"]);
	    } else if (i === 1) {
		section_array.push([j, "blue"]);
	    }
	}
    }
    shuffle(section_array);
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
var timeIntervalArray = [60, 120, 180, 240, 300, 360, 420, 480];
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
function first(index) {
    var num_option = section_array[index][0];
    var color = section_array[index][1];
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
    // $('#button-container').html('<button id="start-btn" style="padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-right:3%"> Start </button>');
    $('#button-container').html('');
    gen_buttons($('#button-container'), num_option);
    $('#start-btn').off('click');
    $('#start-btn').click(() => {
	second(num_option, 0, color, index); // start first test in time_array
    });
}

function gen_replay_next(element, num_option, time_index, color, session_index) {
    var fir = '<button id="button-REPLAY" style="display: none; padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-top:70px; margin-right:10px" type="button">REPLAY </button>';
    var sec = '<button id="button-NEXT" style="display: none; padding-left: 20px; padding-right: 20px; padding-top:10px; padding-bottom:10px; margin-top:70px; margin-left:10px" type="button">NEXT </button>';
    element.append(fir);
    element.append(sec);
    $('#button-REPLAY').off('click');
    $('#button-REPLAY').click(() => {
	show_circle_audio(time_array[time_index] * 10, [$('#button-REPLAY'), $('#button-NEXT')]);
    });
    $('#button-NEXT').off('click');
    $('#button-NEXT').click(() => {
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
	    if(session_index === (section_array.length - 1)) {
		alert("congrats! you have finished the experiment");
	    } else {
		first(session_index + 1);
	    }
	} else {
	    // session index is the same
	    second(num_option, time_index + 1, color, session_index);    
	}
    });
}

function gen_radios(element, num_option) {
    var fir= '<div class="radio-box"> <label>';
    var ss= '</label><input id="radio-';
    var sec='" type="radio" name="choose" align="right" value="';
    var thi = '"></div>';
    for(var i = 0; i < num_option; i ++) {
	var t = timeIntervalArray[i] / 100;
	if(t === 3) {
	    t = "3.0";
	}
	var html = fir+ t + ss + timeIntervalArray[i] + sec + t + thi;
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
	if(t === 3) {
	    t = "3.0";
	}
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
	    show_circle_audio(vv * 10, [$('#start-btn')]);
	});
    }
}


// option: if element is not undefined, hide it when show and show it when hide
function show_circle_audio(time, elements) {
    genProm(1000).then(() => {
	audioPlay();
	if(elements !== undefined) {
	    for(var i = 0; i < elements.length; i ++) {
		elements[i].hide();
	    }
	}
	showCircle();
	return genProm(time);
    }).then(() => {
	if(elements !== undefined) {
	    for(var i = 0; i < elements.length; i ++) {
		elements[i].show();
	    }
	}
	hideCircle();
    });
}

var userRedArray = [];
var userBlueArray = [];
var trialSize = 8;

function get_color() {
    return $('#svg-circle svg circle').attr('fill');
}

function second(num_option, time, color, session_index) {
    $('#first-page').hide();
    $('#input-page').show();
    // set title
    $('#exp-subtitle').text(time+1);
    // empty input submit container
    $('#input-submit-container').html('<form id="#submit-form" action=""> </form>');
    gen_replay_next($('#input-submit-container'), num_option, time, color, session_index);
    gen_radios($('#input-submit-container form'), num_option);
    show_circle_audio(time_array[time] * 10, [$('#button-REPLAY'), $('#button-NEXT')]);
}

function set_blue_circle() {
    $('#headcenter h1').css('color', 'blue');
    var t = parseInt($('#exp-colortitle').text()[0]) + 1;
    $('#exp-colortitle').text(t + "-");
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
