$(document).ready(function() {
    shuffle(timeIntervalArray);
    shuffle(timeIntervalArrayBlue);
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
    $('#first-page').show();
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

var timeIntervalArray = [200, 900, 1600, 2300, 3000, 3700, 4200, 4900];
var userRedArray = [];
var timeIntervalArrayBlue = [200, 900, 1600, 2300, 3000, 3700, 4200, 4900];
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
    if(r && vv < 10 && vv > 0) {
	if(arr === timeIntervalArray) {
	    userRedArray.push(vv);
	} else if (arr == timeIntervalArrayBlue) {
	    userBlueArray.push(vv);
	}
    } else {
	alert("Please input a float number n, n is smaller than 10 but larger than 0.");
	r = false;
    }
    $('#input-box').val("");
    return r;
}

function show_result() {
    alert("Lab 1 finishes!");
    alert(userRedArray);
    alert(userBlueArray);
}
