
var Turing = function (start, end) {
	this.start = start;
	this.end = end;
	this.speed = 500;
	this.stop = true;
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
			if (!active.prev().length) {
				active.before('<li><input type="text" size="1" maxlength="1" disabled="disabled" /></li>');
			}
			active.prev().addClass('active');
			break;

		default:
			// move right
			if (!active.next().length) {
				active.after('<li><input type="text" size="1" maxlength="1" disabled="disabled" /></li>');
			}
			active.next().addClass('active');
	}

	this.timeout = setTimeout(function (that) {
		that.machine(step.state);
	}, this.speed, this);
};

Turing.prototype.cancel = function (stop) {
	this.stop = stop;
};
