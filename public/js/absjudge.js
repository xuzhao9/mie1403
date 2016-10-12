$(document).ready(function() {
    shuffle(timeIntervalArray);
    shuffle(timeIntervalArrayBlue);
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
	first();
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

function first() {
    $('#estimate-page').hide();
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#result-display-page').hide();
    $('#illuHeader').show();
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
var trialSize = 8;

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
	$('#first-page').hide();
	$('#estimate-page').hide();
	$('#input-page').hide();
	$('#svg-circle').hide();
	$('#illuHeader').hide();
	$('#result-display-page').hide();
	$('#interval-page').show();
	$('#image3').click(() => {
	    $('#interval-page').hide();
	    first();
	});
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
