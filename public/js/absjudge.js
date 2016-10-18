$(document).ready(function() {
    if(window.location.hash === "#result") {
	mock_result();
	return;
    }
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
	for(var j = 2; j < 10; j += 2) { // test: 4 sessions
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

var timeIntervalArray = [60, 120, 180, 240, 300, 360, 420, 480];
var time_array = [];

// Stimulus presenta 5 times
function gen_time_array(num_option) {
    time_array = [];
    for(var i = 0; i < num_option; i ++) {
	for(var j = 0; j < 5; j ++) {
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

var sessionResult = {};
var real_user_data = {};

function gen_real_data() {
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
	if(val === undefined || val === NaN) {
	    alert("Please select at least one answer!");
	    return;
	}
	var sessionId = session_index;
	if(sessionResult[num_option] === undefined) {
	    sessionResult[num_option] = {};
	}
	if(sessionResult[num_option][color] === undefined) {
	    sessionResult[num_option][color] = {};
	}
	var time1 = time_array[time_index] / 100;
	var time2 = val;
	if(sessionResult[num_option][color][time1] === undefined) {
	    sessionResult[num_option][color][time1] = {};
	}
	if(sessionResult[num_option][color][time1][time2] === undefined) {
	    sessionResult[num_option][color][time1][time2] = 0;
	}
	sessionResult[num_option][color][time1][time2] += 1;
	if(time_index == time_array.length - 1) {
	    if(session_index === (section_array.length - 1)) {
		alert("congrats! you have finished the experiment");
		show_result(sessionResult);
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

// ======================================  Result Page ============================================

var mock_user_data = {};

function gen_mock_session_data(count, color) {
    if(mock_user_data[count] === undefined) {
	mock_user_data[count] = {};
    }
    if(mock_user_data[count][color] === undefined) {
	mock_user_data[count][color] = {};
    }
    // for value, check
    var candidate = [];
    var user_answer = [];
    for (var i = 0; i < count; i ++) {
	for(var j = 0; j < 5; j ++) {
	    candidate.push(timeIntervalArray[i] / 100);
	    user_answer.push(timeIntervalArray[i] / 100);
	}
    }
    shuffle(user_answer);
    for(var i = 0; i < candidate.length; i ++) {
	if(mock_user_data[count][color][candidate[i]] === undefined) {
	    mock_user_data[count][color][candidate[i]] = {};
	}
	if(mock_user_data[count][color][candidate[i]][user_answer[i]] === undefined) {
	    mock_user_data[count][color][candidate[i]][user_answer[i]] = 0;
	}
	mock_user_data[count][color][candidate[i]][user_answer[i]] += 1;
    }
}

function mock_result() {
    // gen mock result
    for(var i = 2; i < 10; i += 2) {
	gen_mock_session_data(i, "red");
	gen_mock_session_data(i, "blue");
    }
    mock_user_data[2]["red"][0.6][0.6] = 3;
    mock_user_data[2]["red"][0.6][1.2] = 2;
    mock_user_data[2]["red"][1.2][0.6] = 2;
    mock_user_data[2]["red"][1.2][1.2] = 3;
    show_result(mock_user_data);
}

var user_matrix = {};

function get_matrix_value(count, color, stimulate, user_choice) {
    var key = [count, color];
    var pair = [stimulate, user_choice];
    return user_matrix[key][pair];
}

function visualize_session(result, count, color) {
    var transformed_result = [];
    var session_result = result[count][color];
    var keys = Object.keys(session_result);
    var clone_keys = [""];
    for(var i = 0; i < keys.length;i ++) {
	clone_keys.push(keys[i]);
    }
    keys.sort();
    transformed_result.push(clone_keys); // title row
    for(var i = 0; i < keys.length; i ++) {
	var column_result = [];
	column_result.push(keys[i]);
	var key2 = Object.keys(session_result[keys[i]]);
	for(var ii = 0; ii < keys.length; ii ++) {
	    for(var j = 0;j < key2.length; j ++) {
		if (key2[j] === keys[i]) {
		    column_result.push(session_result[keys[ii]][key2[j]]);
		}
	    }
	}
	transformed_result.push(column_result);
    }
}

function gen_control_btn(count, color) {
    var btn_slice = '<button style="color:' + color + '">';
    var btn_end = '</button>';
    return (btn_slice + count + btn_end);
}

function gen_control_btns() {
    for(var i = 2; i < 10; i += 2) {
	var btn_red = gen_control_btn(i, "red");
	var btn_blue = gen_control_btn(i, "blue");
	$('#control-btns').append(btn_red);
	$('#control-btns').append(btn_blue);
    }
}

function show_result(result) {
    $('#first-page').hide();
    $('#input-page').hide();
    $('#introduction-page').hide();
    $('#interval-page').hide();
    $('#svg-circle').hide();
    $('#result-display-page').show();
    $('#headcenter h1').css('color', 'white');  
    $('#exp-subtitle2').text("Result");
    // draw matrix in div result-matrix
    // transform reslt
    // gen_control_btns();
    // visualize_session(result, 8, "red");
    show_charts(result);
}

function log2(val) {
    return Math.log2(val);
}

var timeIntervalArraySec = [0.6, 1.2, 1.8, 2.4, 3, 3.6, 4.2, 4.8];

// j is number of time 
function cal_n_i_j(result, L, color, i, j) {
    var time1 = timeIntervalArraySec[i];
    var time2 = timeIntervalArraySec[j];
    var r = result[L][color][time1][time2];
    if(r === NaN || r === undefined)  {
	return 0;
    }
    return r;
}

function cal_nj(result, L, color, j) {
    var timej = timeIntervalArraySec[j];
    var r = 0;
    var key1 = Object.keys(result[L][color]);
    for(var i = 0; i < key1.length; i ++) {
	var k1 = key1[i];
	var key2 = Object.keys(result[L][color][k1]);
	for(var p = 0; p < key2.length; p ++) {
	    if(key2[p] == timej) {
		if (result[L][color][k1][key2[p]] === NaN || result[L][color][k1][key2[p]] === undefined) {
		    r += 0;
		} else {
		    r += result[L][color][k1][key2[p]];
		}
	    }
	}
    }
    return r;
}

function cal_ys(result, L, color) {
    // cal H_R
    var hr = 0;
    for(var j = 0; j < L; j ++) {
	var t = cal_nj(result, L, color, j) / (5.0 * L);
	var p = t * log2(t);
	hr = hr + p;
    }
    hr = hr * (-1);
    // cal H_SR
    var h_sr = 0;
    for(var i = 0; i < L; i ++) {
	for(var j = 0; j < L; j ++) {
	    var t = cal_n_i_j(result, L, color, i, j) / (5.0 * L);
	    if(t > 0) {
		var p = t * log2(t);
		h_sr = h_sr + p;
	    }
	}
    }
    h_sr = h_sr * (-1);
    return (log2(L) + hr - h_sr);
}

function cal_hs(result, color) {
    var r = [];
    for(var i = 2; i < 10; i += 2) {
	var answer = cal_ys(result, i, color);
	r.push([log2(i), answer]);
    }
    return r;
}
var red_result;
var blue_result;

function show_charts(result) {
    red_result = cal_hs(result, "red");
    blue_result = cal_hs(result, "blue");
    var myChart = Highcharts.chart('result-charts',  {
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
            text: 'Information Transmission'
        },
	xAxis: {
	    title: {
		enabled: true,
		text: '<b>H(S)</b>'
	    }
        },
        yAxis: {
            title: {
                text: '<b>H(T)</b>'
            }
        },
	tooltip: {
            headerFormat: '<b>H(S) : H(T)</b><br>',
            pointFormat: '({point.x},{point.y})'
        },  
	series: [
	    {
			name: 'Red',
			showInLegend: false,
			color: 'rgba(223, 83, 83, .5)',
			data: red_result
	    },
	    {
			name: 'Blue',
			showInLegend: false, 
			color: 'rgba(83, 83, 223, .5)',
			data: blue_result
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
		data:[[0,0], [4,4]]
	    }
	]
    });
}
