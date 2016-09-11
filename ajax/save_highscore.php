<?php
$db = new mysqli('localhost', 'root', '', 'matspillet'); // connect to the database

if ($db->connect_errno > 0) // if there was an error connecting
	die('Unable to connect to database [' . $db->connect_error . ']'); // print the error

if (isset($_POST['name']) && isset($_POST['score'])) { // if name and score variables are set
	$stmt = $db->prepare("INSERT INTO highscores (name, score) VALUES (?, ?)"); // prepare insert query
	$stmt->bind_param('si', $name, $score); // bind parameters

	$name = $_POST['name']; // set name parameter
	$score = $_POST['score']; // set score parameter

	$stmt->execute(); // execute query

	$result = $db->query("SELECT * FROM highscores ORDER BY score DESC LIMIT 10"); // get 10 highest scores
	$rows = array(); // result array

	while ($row = $result->fetch_assoc()) { // loop through the results
		$rows[] = $row; // insert results into the array
	}

	echo json_encode($rows); // print the json encoded array
}
?>