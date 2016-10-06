$(document).ready(function() {
    first();
});

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

function second() {
    $('#first-page').hide();
    $('#estimate-page').show();
    $('#estimate-replay').click(() => {
	first();
    });
    $('#estimate-start').click(() => {
	third(200);
    });
}

function third(interval) {
    alert(interval);
    if (interval == 5600) {
	return;
    }
    $('#estimate-page').hide();
    $('#input-page').show();
    $('#input-submit-container').hide();
    genProm(1000).then(() => {
	audioPlay();
	return genProm(500);
    }).then(() => {
	showCircle();
	return genProm(interval);
    }).then(() => {
	hideCircle();
	$('#input-submit-container').show();
	$('#submit-replay').off('click');
	$('#submit-replay').click(() => {
	    third(interval);
	});
	$('#submit-next').off('click');
	$('#submit-next').click(() => {
	    third(interval + 700);
	});
    }).catch(() => {});
}
