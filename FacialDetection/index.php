<?php

 	header("Access-Control-Allow-Origin: *");
 	//var_dump($_ENV["HOME"]);
 	$filePath = $_GET["fileInfo"];
 	if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/')) {
 	  mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/', 0777, true);
 	}
 	$filePath = '/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/'.$filePath;
 	$command = '/usr/local/bin/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 '.$filePath;
 	echo exec($command, $output, $return_var);
 	if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/')) {
 	  mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/', 0777, true);
 	}
 	$command = '/usr/local/bin/ffmpeg  -i '.$filePath.' -vf fps=30 /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/image-%03d.png';
  echo shell_exec($command);
  ?>
