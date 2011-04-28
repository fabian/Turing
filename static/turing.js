
var Turing = function (start, end, tape) {
	this.start = start;
	this.end = end;
	this.tape = tape;
	this.length = 34;
	this.speed = 500;
	this.stop = true;

	this.reset();

	window.scroll(($(document).width() - $(window).width()) / 2, 0);
}

/**
 * Method to run the Turing machine.
 */
Turing.prototype.run = function (state) {

	// lock Turing
	$('input').attr('disabled', 'disabled');

	this.stop = false;

	// start machine
	this.machine(this.start);
};

Turing.prototype.reset = function () {

	$('.turing').text('');

	for (var i = 0; i < this.length; i++) {

		$('.turing').append(this.field());
	}

	var center = this.length / 2 - 1;
	for (var i in this.tape) {

		$('.turing li:eq(' + (center + parseInt(i)) + ') input').val(this.tape[i]);
	}

	$('.turing li:eq(' + center + ')').addClass('active');

	$('#canvas .state').attr({fill: 'none'});
};

Turing.prototype.field = function (value) {
	if (!value) {
		value = '';
	}
	return $('<li><input type="text" size="1" maxlength="1" disabled="disabled" /></li>');
};

/**
 * Method to read value and run state to get next step.
 */
Turing.prototype.machine = function (state) {

	var value = $('.turing .active input').val();

	console.log("Evaluate " + (state.toString()).match(/function\s+([^\s\(]+)/)[1] + " with value " + value);

	var step = state(value);

	this.timeout = setTimeout(function (that) {
		that.write(step);
	}, 1, this);
};

/**
 * Method to write value.
 */
Turing.prototype.write = function (step) {

	console.log("Write value " + step.value);

	// write
	$('.turing .active input').val(step.value);

	this.timeout = setTimeout(function (that) {
		that.check(step);
	}, this.speed, this);
};

/**
 * Check if we keep it running.
 */
Turing.prototype.check = function (step) {

	if (this.stop == false) {

		if (step.state != this.end) {

			// all good
			this.move(step);

		} else {

			console.log("Final " + (step.state.toString()).match(/function\s+([^\s\(]+)/)[1]);

			// end of machine
			$('input').attr('disabled', '');	
		}

	} else {
		
		// stopped
		this.stop();
		$('input').attr('disabled', '');	
	}
};

/**
 * Method to move Turing to next step.
 */
Turing.prototype.move = function (step) {

	console.log("Move " + step.move);

	var active = $('.turing .active');

	// move
	active.removeClass('active');
	switch (step.move) {

		case 'left':
			// move left
			if (!active.prev().prev().length) {
				active.before(this.field());
			}
			active.prev().addClass('active');
			break;

		default:
			// move right
			if (!active.next().next().length) {
				active.after(this.field());
			}
			active.next().addClass('active');
	}

	$('#canvas .state').attr({fill: 'none'});
	$('#canvas .' + (step.state.toString()).match(/function\s+([^\s\(]+)/)[1]).attr({fill: '#fff8de'});

	this.timeout = setTimeout(function (that) {
		that.machine(step.state);
	}, this.speed, this);
};

Turing.prototype.cancel = function (stop) {
	this.stop = stop;
};
