<?php

 	header("Access-Control-Allow-Origin: *");

 	$filePath = $_GET["fileInfo"];
 	if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/')) {
 	  mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/', 0777, true);
 	}
 	$filePath = '/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/'.$filePath;

 	$command = '/usr/local/bin/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 '.$filePath;
 	exec($command, $output, $return_var);
 	if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/')) {
 	  mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/', 0777, true);
 	}

 	$command = '/usr/local/bin/ffmpeg  -i '.$filePath.' -vf fps=30 /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/image-%d.png';
  shell_exec($command);

  $count = 1;
  while(file_exists("/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/image-".$count.".png")){
    $command = '/Users/mohnishkadakia/Library/Enthought/Canopy_64bit/User/bin/python /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/test.py '.$count;
    $points = shell_exec($command);
    
    $command = '/Users/mohnishkadakia/Library/Enthought/Canopy_64bit/User/bin/python /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/example_draw_delaunay_triangles.py '.$count.' "'.$points.'"';
    shell_exec($command);

    $count = $count + 1;
  }

  $filePath = $_GET["fileInfo"];
  $command = "/usr/local/bin/ffmpeg -r 30 -f image2 -s 1920x1080 -i /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/image-%d.png -vcodec libx264 -crf 25 /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/".$filePath;
  shell_exec($command);
  	
    

  	// $img_count = explode("END\n", $out);
  	// for($x = 0; $x < $img_count; $x++)
  	// {
  	// 	echo $img_count[$x];
  	// 	// $command = '/Users/mohnishkadakia/Library/Enthought/Canopy_64bit/User/bin/python /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/sample.py "'.$img_count[$x].'"';
  	// 	// echo shell_exec($command);
  	// }		
  ?>
