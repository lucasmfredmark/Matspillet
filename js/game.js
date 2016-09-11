var timer; // timer that increments the time played
var time = 0; // current time played
var score = 0; // current score
var speed = 15; // current speed (time limit)
var lost = false; // if the player has lost

var number; // first random number
var number2; // second random number
var total; // total of the random numbers
var operator = '+'; // current operator

// center bootstrap modal (popup)
function centerModals() {
	$('.modal').each(function(i) {
		var $clone = $(this).clone().css('display', 'block').appendTo('body');
		var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
		top = top > 0 ? top : 0;
		$clone.remove();
		$(this).find('.modal-content').css('margin-top', top);
	});
}

// generate a random number between min-max
function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// generate two random numbers and calculate the total
function generateNumbers(min, max, min2, max2, operator) {
	number = randomNumber(min, max); // generate the first number between min-max
	number2 = randomNumber(min2, max2); // generate the second number between min2-max2

	if (operator == '+') { // if the operator is addition
		total = number + number2; // calculate the total using addition
	} else if (operator == '-') { // if the operator is subtraction
		total = number - number2; // calculate the total using subtraction
	} else if (operator == '*') { // if the operator is multiplication
		total = number * number2; // calculate the total using multiplication
	} else if (operator == '/') { // if the operator is division
		total = number / number2; // calculate the total using division

		while (total % 1 !== 0 || total < 2) { // while total is not a whole number or total is less than 2
			generateNumbers(min, max, min2, max2, '/'); // generate two new numbers and calculate the new total
		}
	}
}

// start a new game
function game() {
	var operators = '+-*/'; // possible operators
	operator = operators.charAt(Math.floor(Math.random() * operators.length)); // pick a random operator

	if (score >= 0 && score <= 9) { // if score is between 0-9
		speed = 15; // set the speed (time limit) to 15 seconds

		if (operator == '+') { // if the operator is addition
			generateNumbers(10, 30, 10, 30, '+'); // generate two numbers between 10-30
		} else if (operator == '-') { // if the operator is subtraction
			generateNumbers(20, 40, 10, 20, '-'); // generate a number between 20-40 and a number between 10-20
		} else if (operator == '*') { // if the operator is multiplication
			generateNumbers(2, 10, 2, 10, '*'); // generate two numbers between 2-10
		} else if (operator == '/') { // if the operator is division
			generateNumbers(20, 50, 2, 20, '/'); // generate a number between 20-50 and a number between 2-20
		}
	} else if (score >= 10 && score <= 24) { // if score is between 10-24
		speed = 10; // set the speed (time limit) to 10 seconds

		if (operator == '+') {
			generateNumbers(50, 100, 50, 100, '+');
		} else if (operator == '-') {
			generateNumbers(100, 200, 50, 100, '-');
		} else if (operator == '*') {
			generateNumbers(10, 20, 10, 20, '*');
		} else if (operator == '/') {
			generateNumbers(50, 100, 2, 50, '/');
		}
	} else if (score >= 25 && score <= 39) { // if score is between 25-39
		speed = 8; // set the speed (time limit) to 8 seconds

		if (operator == '+') {
			generateNumbers(250, 500, 250, 500, '+');
		} else if (operator == '-') {
			generateNumbers(500, 1000, 250, 500, '-');
		} else if (operator == '*') {
			generateNumbers(15, 30, 15, 30, '*');
		} else if (operator == '/') {
			generateNumbers(100, 200, 2, 100, '/');
		}
	} else if (score >= 40) { // if score is bigger than or equal to 40
		speed = 5; // set the speed (time limit) to 5 seconds

		if (operator == '+') {
			generateNumbers(500, 1000, 500, 1000, '+');
		} else if (operator == '-') {
			generateNumbers(1000, 2000, 500, 1000, '-');
		} else if (operator == '*') {
			generateNumbers(20, 40, 20, 40, '*');
		} else if (operator == '/') {
			generateNumbers(200, 400, 2, 200, '/');
		}
	}

	// set a timer that checks if the player answered correctly
	$('#game #progress').progressTimer({
		timeLimit: speed, // time limit in which the player has to answer
		warningThreshold: (speed / 2), // when to warn the player about the time
		onFinish: function() { // when the time limit is over
			var choice = $('#game #options .option.selected').text(); // selected answer
			if (choice == total) { // if the selected answer was correct
				score++; // increment the score by 1
				$('#game #score span').hide().text(score).fadeIn(500); // update the score div with the new score
				game(); // start a new game
			} else { // if the selected answer was not correct
				clearInterval(timer); // stop the timer
				lost = true; // the player has lost
				$('#modal .modal-title span').html(number + ' ' + operator + ' ' + number2 + ' = <span>' + total + '</span>'); // insert equation into the modal
				$('#modal .modal-body span').text(score); // insert score into the modal
				$('#modal').modal(); // show the modal
			}
		}
	});

	$('#game #equation').hide().text(number + ' ' + operator + ' ' + number2 + ' = ?').fadeIn(500); // insert equation into the equation div
	$('#game #options').hide(); // hide the options
	$('#game #options .option').remove(); // remove the options

	var options = new Array(4); // an array that contains the 4 options
	var randOption = randomNumber(1, 4); // pick a random of the 4 options to be the correct answer
	var rand; // the random generated number

	if (operator == '*') { // if the operator is multiplication
		var multiOptions = new Array(8); // an array than contains 8 options for multiplication

		for (var i = 0; i < 8; i++) { // loop 8 times
			if (i < 2) { // if the current iteration is less than 2
				multiOptions[i] = total + ((i - 2) * number); // total + (-2 * number) and total + (-1 * number)
			} else if (i >= 2 && i < 4) { // if the current iteration is between 2-3
				multiOptions[i] = total + ((i - 1) * number); // total + (1 * number) and total + (2 * number)
			} else if (i >= 4 && i < 6) { // if the current iteration is between 4-5
				multiOptions[i] = total + ((i - 6) * number2); // total + (-2 * number2) and total + (-1 * number2)
			} else if (i >= 6 && i < 8) { // if the current iteration is between 6-7
				multiOptions[i] = total + ((i - 5) * number2); // total + (1 * number2) and total + (2 * number2)
			}
		}
	}

	for (var i = 1; i < 5; i++) { // loop 5 times
		if (operator == '*') { // if the operator is multiplication
			if (i == randOption) { // if the current iteration is the correct option
				rand = total; // set the random number to be equal to the correct answer
			} else { // if the current iteration is not the correct option
				rand = multiOptions[randomNumber(0, 7)]; // pick a random number from the multiplication array
			}

			while ($.inArray(rand, options) !== -1) { // while the random number already exists in the array
				rand = multiOptions[randomNumber(0, 7)]; // pick a new random number from the multiplication array
			}
		} else { // if the operator is not multiplication
			if (operator == '/') { // if the operator is division
				var min = total - 2; // the minimum value of the random number
				var max = total + 2; // the maximum value of the random number
			} else { // if the operator is not division
				var min = total - 10; // the minimum value of the random number
				var max = total + 10; // the maximum value of the random number
			}

			if (i == randOption) { // if the current iteration is the correct option
				rand = total; // set the random number to be equal to the correct answer
			} else { // the current iteration is not the correct option
				rand = randomNumber(min, max); // generate a random number between min-max
			}

			while ($.inArray(rand, options) !== -1) { // while the random number already exists in the array
				rand = randomNumber(min, max); // generate a new random number between min-max
			}
		}

		options[i] = rand; // insert the generated number into the options array
		$('#game #options').append('<div id="option' + i + '" class="option">' + rand + '</div>'); // insert an option div with the generated number
	}

	$('#game #options').fadeIn(500); // fade in the options
	$('#game #options #option1').addClass('selected'); // select the first option
}

// when the page is loaded
$(function() {
	var name = $('#intro .name'); // name input
	name.focus(); // focus the name input

	$('#modal').on('show.bs.modal', function() { // when the modal is showing
		$(window).on('resize', centerModals); // center the modal when the window resizes

		$.post('ajax/save_highscore.php', { name: name.val(), score: score }, function(data) { // insert the name and score into the database
			data = $.parseJSON(data); // parse the received data as json

			for (i = 0; i < data.length; i++) { // loop through the data array
				// insert the name and score into a row in the highscore table
				$('#modal .modal-body tbody').append('<tr><th scope="row">' + (i + 1) + '</th><td>' + data[i].name + '</td><td>' + data[i].score + '</td>');
			}

			centerModals(); // center the modals
		});
	});

	$('#modal').on('hide.bs.modal', function() { // when the modal is hiding
		location.reload(); // refresh the page
	});

	$('#intro form').submit(function(event) { // when the form is submitted
		event.preventDefault(); // prevent event default

		if ($.trim(name.val()).length) { // if the user entered a name
			$('#intro').hide(); // hide the intro
			$('#game-container').animate({ width: '800px', left: '-=100px' }); // animate the width of the game container
			$('#game').fadeIn(500); // fade in the game

			game(); // start the game

			timer = setInterval(function() { // start the timer
				time += 1; // increment the time by 1
				$('#game #timer span').text(time); // update the time div
			}, 1000); // interval of the timer

			$(document).keydown(function(event) { // when a key is pressed
				if (lost == false) { // if the player has not lost
					event.preventDefault(); // prevent event default

					var option = $('#game #options .option'); // option divs
					var selected = $('#game #options .option.selected'); // selected option
					var index = selected.index('#game #options .option'); // index of the selected option

					if (event.which == 38) { // if the player pressed the up arrow key
						if (index == 2) { // if the selected option has an index of 2
							selected.removeClass('selected'); // remove the selected class
							$('#option1').addClass('selected'); // add the selected class to the option with an index of 0
						} else if (index == 3) { // if the selected option has an index of 3
							selected.removeClass('selected'); // remove the selected class
							$('#option2').addClass('selected'); // add the selected class to the option with an index of 1
						}
					} else if (event.which == 40) { // if the player pressed the down arrow key
						if (index == 0) {
							selected.removeClass('selected');
							$('#option3').addClass('selected');
						} else if (index == 1) {
							selected.removeClass('selected');
							$('#option4').addClass('selected');
						}
					} else if (event.which == 37) { // if the player pressed the left arrow key
						if (index == 1) {
							selected.removeClass('selected');
							$('#option1').addClass('selected');
						} else if (index == 3) {
							selected.removeClass('selected');
							$('#option3').addClass('selected');
						}
					} else if (event.which == 39) { // if the player pressed the right arrow key
						if (index == 0) {
							selected.removeClass('selected');
							$('#option2').addClass('selected');
						} else if (index == 2) {
							selected.removeClass('selected');
							$('#option4').addClass('selected');
						}
					} else if (event.which == 13) { // if the player pressed the enter key
						var choice = $('#game #options .option.selected').text(); // selected answer
						if (choice == total) { // if the selected answer was correct
							clearInterval(interval); // stop the progress timer
							score++; // increment the score by 1
							$('#game #score span').hide().text(score).fadeIn(500); // update the score div with the new score
							game(); // start a new game
						} else { // if the selected answer was not correct
							clearInterval(interval); // stop the progress timer
							clearInterval(timer); // stop the timer
							lost = true; // the player has lost
							$('#modal .modal-title span').html(number + ' ' + operator + ' ' + number2 + ' = <span>' + total + '</span>'); // insert equation into the modal
							$('#modal .modal-body span').text(score); // insert score into the modal
							$('#modal').modal(); // show the modal
						}
					}
				}
			});
		} else { // the user did not enter a name
			alert('Du skal udfylde et navn for at spille!'); // prompt the user to type in their name
		}
	});
});