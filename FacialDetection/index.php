<?php

  /**
    This file will execute all the processes for breaking the video into images,
    getting the 68 points, drawing the points, and combining the images back to a 
    processed video.
  */
  header("Access-Control-Allow-Origin: *");

  $filePath = $_GET["fileInfo"];  // File name that was passed from typescript file
  $userID = $_GET["userId"];  // User Id that was passed from the typescript file
  $videoID = $_GET["videoId"];  // Uniqueu video Id of the video being processed

  //$currentPython =  "/Users/mohnishkadakia/Library/Enthought/Canopy_64bit/User/bin/python";
  $currentPython = "/usr/bin/python";

  // Create the necessary folders, if not already there
  if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/'.$userID)) {
    mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/'.$userID, 0777, true);
  }

  if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/')) {
    mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/', 0777, true);
  }
  $filePath = '/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/'.$filePath;

  // Execute the command that outputs the metadata of the current video
  $command = '/usr/local/bin/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 '.$filePath;
  exec($command, $output, $return_var);
  if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/')) {
    mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/', 0777, true);
  }

  // Execute the command that breaks the video into frames
  $command = '/usr/local/bin/ffmpeg  -i '.$filePath.' -vf fps=30 /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/'.$videoID.'.%d.png';
  shell_exec($command);

  $count = 1; // Keeps track of the total number of frames
  $all_the_points = array();  // Array of all the points
  $pupilPoints = array(); // Array of all the pupil points
  $posePoints = array();  // Array of all the pose points
  // While the frame exists, run the process
  while(file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/'.$videoID.'.'.$count.'.png')){
    
    // Execute the EyeLike to get the pupil points 
    $command = './eyeLike-master/build/bin/eyeLike transcoded/'.$videoID.'.'.$count.'.png';
    $pupilPoint = shell_exec($command);
    // Append the points to the array
    array_push($pupilPoints, trim($pupilPoint));

    //Execute the OpenFace to get the 68 points and the head position
    $command = './OpenFace-master/bin/FaceLandmarkImg -f transcoded/'.$videoID.'.'.$count.'.png -of resource/test.txt';
    $posePoint = shell_exec($command);

    // Read the data of OpenFace from a text file and parse the necessary information
    $homepage = file_get_contents("/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/resource/test_det_0.txt");
    $final = explode(":", $homepage);
    $final_two = $final[2];
    $final_one = $final[4];
    $final_two = explode("{", $final_two);
    $final_two = str_replace("pose", "", $final_two);
    $final_one = str_replace("au intensities", "", $final_one);
    $brackets = array("{","}");
    $final_two = str_replace($brackets, "", $final_two);
    $final_one = str_replace($brackets, "", $final_one);
    $points = trim($final_two[1]);

    // Append the data to the array
    array_push($all_the_points, trim($points));
    array_push($posePoints, trim($final_one));

    // Execute the command to draw the 68 points
    $command = $currentPython.' /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/example_draw_delaunay_triangles.py '.$videoID.'.'.$count.' "'.$points.'"';
    shell_exec($command);

    // Increment the count of the frame
    $count = $count + 1;
  }

  // Execute the command to create a video from the frames
  $filePath = $_GET["fileInfo"];
  $command = "/usr/local/bin/ffmpeg -r 30 -f image2 -s 1920x1080 -i /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/".$videoID.".%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/".$userID."/".$filePath;
  shell_exec($command);

  // Execute the command to remove all the frames from the directory
  $command = "rm /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/*.png";
  shell_exec($command);

$filePath = '/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/'.$filePath;

// Extract the metadata from the video
$command = "/usr/local/bin/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 " .$filePath. " 2>&1";
$numOfFrames = intval(shell_exec($command));

$command = "/usr/local/bin/ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 " .$filePath. " 2>&1";
$framePerSecond = explode("/",shell_exec($command));

$command = "/usr/local/bin/ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width " .$filePath. " 2>&1";
$resolution = explode("\n", shell_exec($command));

// Echo all the data for the typescript
echo $numOfFrames. "\n";
echo $framePerSecond[0]. "\n";
foreach ($resolution as $elem) {
  echo substr($elem, strpos($elem, '=')+1). "\n";
}
echo ".....\n";
foreach ($pupilPoints as $point) {
  echo "-----\n";
  echo $point;
}
echo ".....\n";
foreach ($all_the_points as $points) {
  echo "-----\n";
  echo $points . "\n";
}
echo ".....\n";
foreach ($posePoints as $points) {
  echo "-----\n";
  echo $points . "\n";
}

  ?>
