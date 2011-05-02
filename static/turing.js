
var Turing = function (steps, start, end) {
	this.steps = steps;
	this.start = start;
	this.end = end;
	this.tape = [];
	this.length = 40;
	this.speed = 100;
	this.stop = true;
	this.count = 0;
}

/**
 * Method to run the Turing machine.
 */
Turing.prototype.run = function () {

	if (this.stop) {

		$('#run').val("Pause");
		$('#step').attr('disabled', 'disabled');
		$('#reset').attr('disabled', 'disabled');

		this.stop = false;

		// start machine
		this.machine();

	} else {

		// Pause
		this.stop = true;
		$('#run').val("Pause…").attr('disabled', 'disabled');
	}
};

Turing.prototype.reset = function () {

	$('.turing').text('');

	for (var i = 0; i < this.length; i++) {

		$('.turing').append(this.field());
	}

	var start = 3;
	for (var i in this.tape) {

		$('.turing li:eq(' + (start + parseInt(i)) + ') input').val(this.tape[i]);
	}

	$('.turing li:eq(' + start + ')').addClass('active');

	this.current = this.start;
	this.count = 0;

	$('#run').val("Run").attr('disabled', '');
	$('#step').attr('disabled', '');
	$('#calc').text(this.calc);

	this.info();
};

Turing.prototype.info = function () {
	$('#count').text(this.count);
	$('#state').text(this.current);
	$('#canvas .state').attr({fill: 'none', stroke: '#000'});
	$('#canvas .state.' + this.current).attr({fill: '#7d9cec', stroke: '#0a3268'});
	$('#canvas .text').attr({fill: '#000'});
	$('#canvas .text.' + this.current).attr({fill: '#fff'});
	
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
Turing.prototype.machine = function () {

	var value = $('.turing .active input').val();

	console.log('Evaluate ' + this.current + ' with value ' + value);

	var step = this.steps[this.current + ':' + value];

	if (typeof step != 'undefined') {

		this.current = step.state;
		this.count++;

		this.timeout = setTimeout(function (that) {
			that.write(step);
		}, 1, this);

	} else {
		console.log('Undefined state ' + this.current + ' with value ' + value);
	}
};

/**
 * Method to write value.
 */
Turing.prototype.write = function (step) {

	console.log("Write value " + step.value);

	// write
	$('.turing .active input').val(step.value);

	this.timeout = setTimeout(function (that) {
		that.move(step);
	}, this.speed, this);
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

	this.info();

	if (this.stop == false) {

		this.timeout = setTimeout(function (that) {
			that.check();
		}, this.speed, this);

	} else {

		// stopped
		$('#run').val("Run").attr('disabled', '');
		$('#step').attr('disabled', '');
		$('#reset').attr('disabled', '');	
	}
};

/**
 * Check if we keep it running.
 */
Turing.prototype.check = function () {

	if (this.current != this.end) {

		// all good
		this.machine();

	} else {

		console.log("Final " + this.current);

		var result = [];
		$('.turing input').each(function () {
			result[result.length] = $(this).val()
		});
		var sum = result.lastIndexOf('1') > result.indexOf('=') ? result.lastIndexOf('1') - result.indexOf('=') : 0;
		$('#calc').text($('#calc').text() + " " + sum);

		// end of machine
		this.stop = true;

		$('#run').val("Run").attr('disabled', 'disabled');
		$('#step').attr('disabled', 'disabled');
		$('#reset').attr('disabled', '');
	}
};

Turing.prototype.step = function () {

	$('#run').attr('disabled', 'disabled')
	$('#step').attr('disabled', 'disabled');
	$('#reset').attr('disabled', 'disabled');

	this.stop = true;

	// start for one step machine
	this.check();
};
