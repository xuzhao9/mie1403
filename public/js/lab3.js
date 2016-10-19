$(document).ready(function() {
    $('#input-page').hide();
    $('#svg-circle').hide();
    $('#first-page').hide();
    $('#illuHeader').hide();
    $('#interval-page').hide();
    $('#image2').click(() => {
	first("red");
    });
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
	$('#sec-indicator').text("one second.");
	standard = red_standard * 1000;
    }else if(color === "blue") {
	$('#exp-colortitle').text("2-");
	$('#sec-indicator').text("three seconds.");
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
	if(seqno === time_array.length - 1) {
	    first("blue");
	} else {
	    // check if valid
	    $('#exp-subtitle').text(seqno+2);
	    var val = $("#input-submit-container form input[type='radio']:checked").val();
	    if(val === undefined || val === NaN) {
		alert("Please select at least one answer!");
		return;
	    } else {
		var new_data =[(standard / 1000.0), time_array[seqno], val];
		session_result.push(new_data);
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
	}
    });
}

function hide_buttons() {
    $('#input-button-container').hide();
}

function show_buttons() {
    $('#input-button-container').show();
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

