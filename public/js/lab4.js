$(document).ready(function() {
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
var blue_arr = [0.84,  0.87,  0.90,  0.93,  0.96, 1.04];
var red_signal_result = [0, 0, 0, 0, 0];
var red_noise_result = [0, 0, 0, 0, 0];

var blue_standard = 3.0;
var red_arr = [2.78,  2.83,  2.88,  2.93,  2.98, 3.18];
var blue_signal_result = [0, 0, 0, 0, 0];
var blue_noise_result = [0, 0, 0, 0, 0];


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
    // red: 5 * 5 + 1 * 25 = 50, 1.04
    // blue: 5 * 5 + 1 * 25 = 50, 3.18
    for(var i = 0; i < blue_arr.length; i ++) {
	var t = 0;
	if (i !== (blue_arr.length - 1)) {
	    t = 5; // 5 times if it is not the last one
	} else {
	    t = 25; // 25 times if the last one
	}
	for(var j = 0; j < t; j ++) {
	    if(color === "red") {
		time_array.push(blue_arr[i]);
	    } else if (color === "blue") {
		time_array.push(red_arr[i]);
	    }
	}
    }
    shuffle(time_array);
}

var standard = 0;

function first(color) {
    $('#introduction-page').hide();
    $('#interval-page').hide();
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
	// Check if val= 1~5
	var val = $("#input-submit-container form input[type='radio']:checked").val()-1;
	if(val === undefined || val === NaN) {
	    alert("Please select one answer!");
	    return;
	}
	var index = parseInt(val);
	var highest = 0;
	if(color === "red") {
	    highest = blue_arr[blue_arr.length - 1];
	}
	if(color === "blue") {
	    highest = red_arr[red_arr.length - 1];
	}
	if(time_array[seqno] === highest) {
	    if(color === "red") {
		red_signal_result[val] += 1;
	    } else if (color === "blue") {
		blue_signal_result[val] += 1;
	    }
	} else {
	    if(color === "red") {
		red_noise_result[val] += 1;
	    } else if (color === "blue") {
		blue_noise_result[val] += 1;
	    }
	}
	if((seqno === (time_array.length - 1)) && color === "red") {
	    // jump to blue
	    $('#interval-page').show();
	    $('#image3').off('click');
	    $('#first-page').hide();
	    $('#illuheader').hide();
	    $('#image3').click(function() {
		first("blue");
	    });
	} else if ((seqno === (time_array.length - 1)) && color === "blue") {
	    show_result("red", red_signal_result, red_noise_result);
	    show_result("blue", blue_signal_result, blue_noise_result);
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

var mock_signal_result = [];
var mock_noise_result = [];
var mock_blue_signal_result = [];
var mock_blue_noise_result = [];

function mock() {
    mock_signal_result = [3, 4, 3, 7, 8]; //[4, 6, 3, 5, 7];
    mock_noise_result = [9, 7, 5, 3, 1]; //[7, 6, 5, 3, 4];
    mock_blue_signal_result = [3, 3, 2, 9, 8]; //[4, 6, 3, 5, 7];
    mock_blue_noise_result = [5, 5, 4, 8, 3]; //[7, 6, 5, 3, 4];
    show_result("red", mock_signal_result, mock_noise_result);
    show_result("blue", mock_blue_signal_result, mock_blue_noise_result);
}

var p_h = [];
var p_fa = [];

var z_pairs = [];
var d_pairs = [];

var p_h_blue = [];
var p_fa_blue = [];
var z_pairs_blue = [];
var d_pairs_blue = [];

function cal_p(array, result_array) {
    var sum_arr = 0;
    for(var i = 0; i < array.length; i ++) {
	sum_arr += array[i];
    }
    for(var i = 1; i < array.length; i ++) {
	var subsum = 0;
	for(var j = i; j < array.length;  j ++) {
	    subsum += array[j];
	}
	if (subsum === 0) {
	    subsum = 0.01 * sum_arr;
	}
	if (subsum === sum_arr) {
	    subsum = 0.99 * sum_arr;
	}
	result_array.push(subsum / sum_arr);
    }
}

function get_z_pairs(ph_val, pfa_val) {
    var r = [];
    var vm = new SDTViewModel(redraw, ph_val, pfa_val);
    r.push(vm.z.hit());
    r.push(vm.z.fa());
    r.push(vm.d_prime());
    r.push(vm.c());
    return r;
}

function convert_array(arr) {
    var r = [];
    for(var i = 0; i < arr.length; i ++) {
	r.push(arr[i].toFixed(2));
    }
    return r;
}

function show_result(color, signal_result, noise_result) {
    var e1;
    if(color === "red") {
	e1 = $('#data-red');
    }
    if(color === "blue") {
	e1 = $('#data-blue');
    }
    var z_pp;
    var p_hh;
    var p_ffaa;
    if(color === "red") {
	z_pp = z_pairs;
	p_hh = p_h;
	p_ffaa = p_fa;
    }
    if(color === "blue") {
	z_pp = z_pairs_blue;
	p_hh = p_h_blue;
	p_ffaa = p_fa_blue;
    }
    $('#first-page').hide();
    $('#result-display-page').show();
    $('#illuHeader').show();
	$('#headcenter h1').css('color', 'white');
    $('#exp-title').text("Result");
    $('#exp-colortitle').text("");
    $('#exp-subtitle').text("");
    e1.text("");
    e1.append("Signal:" + signal_result + "------------------");
    e1.append("Noise:" + noise_result + "<br/>");
    cal_p(signal_result, p_hh);
    cal_p(noise_result, p_ffaa);
    e1.append("P(H):   " + convert_array(p_hh) + "-------");
    e1.append("P(FA):   " + convert_array(p_ffaa) + "<br/>");
    var z_h = [];
    var z_fa = [];
    var d_prime = [];
    var c = [];
	var beta = [];
    for(var i = 0; i < p_hh.length; i ++) {
	var phval = p_hh[i];
	var pfaval = p_ffaa[i];
	var zp = get_z_pairs(phval, pfaval);
	z_h.push(zp[0].toFixed(2));
	z_fa.push(zp[1].toFixed(2));
	d_prime.push(zp[2].toFixed(2));
	c.push(zp[3]);
	beta.push(Math.exp(zp[2]*zp[3]).toFixed(2));
	z_pp.push([zp[1], zp[0]]);
    }
    e1.append("Z(H):   " + z_h + "----");
    e1.append("Z(FA):   " + z_fa + "<br/>");
    e1.append("d':   " + d_prime + "----------");
    e1.append("beta:   " + beta + "<br/>");

    if(color === "red") {
	show_red_chart();
    }
    if (color === "blue") {
	show_blue_chart();
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
	     x: 80,
             y: 100,
        },
	title: {
            text: '<b>Tesing SDT Assumptions in Z-score</b>'
        },
	subtitle: {
            text: '<b>Standard:</b> RED (1.0s) ; <b>Comparison:</b> BLUE (0.5~1.5s)'
	    },
        
	xAxis: {
	    title: {
		enabled: true,		
		text: '<b>Z(FA)</b>'
	    }
        },
        yAxis: {
       
            title: {
                text: '<b>Z(H)</b>'
            }
        },
	tooltip: {
            headerFormat: '</b>Z(FA) : Z(H)</b><br>',
            pointFormat: '({point.x:.2f},{point.y:.2f})'
        },  
	series: [
	    {
		 
		     regression: true,
		     regressionSettings: {
			 type: 'linear',
			 color: 'rgba(83, 83, 223, .5)',
			 marker: {
			     enabled: false
			 }
		     },
		name: '1s',
		showInLegend: false, 
		color: 'rgba(83, 83, 223, .9)',
		data: z_pairs
	    },
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
	         x: 80,
             y: 100,
        },
	title: {
            text: '<b>Tesing SDT Assumptions in Z-score</b>'
        },
	subtitle: {
            text: '<b>Standard:</b> RED (1.0s) ; <b>Comparison:</b> BLUE (0.5~1.5s)'
	    },
	xAxis: {
		
	    title: {
		enabled: true,
		text: '<b>Z(FA)</b>'
	    }
        },
        yAxis: {
			
            title: {
                text: '<b>Z(H)</b>'
            }
        },
	tooltip: {
            
            headerFormat: '</b>Z(FA) : Z(H)</b><br>',
            pointFormat: '({point.x:.2f},{point.y:.2f})'
        },  
	series: [
	    
	    {
		regression: true,
		regressionSettings: {
		    type: 'linear',
		    color: 'rgba(223, 83, 83, .5)',
		    marker: {
			enabled: false
		    }
		},
		name: '3s',
		showInLegend: false, 
		color: 'rgba(223, 83, 83, .9)',
		data: z_pairs_blue
	    }	
	]
    });
}


