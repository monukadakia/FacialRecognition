<?php
  header("Access-Control-Allow-Origin: *");

  $filePath = $_GET["fileInfo"];
  $userID = $_GET["userId"];
  $videoID = $_GET["videoId"];

  //$currentPython =  "/Users/mohnishkadakia/Library/Enthought/Canopy_64bit/User/bin/python";
  $currentPython = "/usr/bin/python";

  if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/'.$userID)) {
    mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/'.$userID, 0777, true);
  }

  if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/')) {
    mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/', 0777, true);
  }
  $filePath = '/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/'.$filePath;

  $command = '/usr/local/bin/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 '.$filePath;
  exec($command, $output, $return_var);
  if (!file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/')) {
    mkdir('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/', 0777, true);
  }

  $command = '/usr/local/bin/ffmpeg  -i '.$filePath.' -vf fps=30 /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/'.$videoID.'.%d.png';
  shell_exec($command);

  $count = 1;
  $all_the_points = array();
  $pupilPoints = array();
  $posePoints = array();
  while(file_exists('/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/'.$videoID.'.'.$count.'.png')){
    //$command = $currentPython.' /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/test.py '.$videoID.'.'.$count;
    //$points = shell_exec($command);
    $command = './eyeLike-master/build/bin/eyeLike transcoded/'.$videoID.'.'.$count.'.png';
    $pupilPoint = shell_exec($command);
    array_push($pupilPoints, trim($pupilPoint));
    $command = './OpenFace-master/bin/FaceLandmarkImg -f transcoded/'.$videoID.'.'.$count.'.png -of resource/test.txt';
    $posePoint = shell_exec($command);

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
    array_push($all_the_points, trim($points));
    array_push($posePoints, trim($final_one));
    $command = $currentPython.' /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/example_draw_delaunay_triangles.py '.$videoID.'.'.$count.' "'.$points.'"';
    shell_exec($command);

    $count = $count + 1;
  }

  $filePath = $_GET["fileInfo"];
  $command = "/usr/local/bin/ffmpeg -r 30 -f image2 -s 1920x1080 -i /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/".$videoID.".%d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_out/".$userID."/".$filePath;
  shell_exec($command);

  $command = "rm /Applications/MAMP/htdocs/FacialRecognition/FacialDetection/transcoded/*.png";
  shell_exec($command);

$filePath = '/Applications/MAMP/htdocs/FacialRecognition/FacialDetection/video_in/'.$filePath;

$command = "/usr/local/bin/ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nokey=1:noprint_wrappers=1 " .$filePath. " 2>&1";
$numOfFrames = intval(shell_exec($command));

$command = "/usr/local/bin/ffprobe -v error -select_streams v:0 -show_entries stream=avg_frame_rate -of default=noprint_wrappers=1:nokey=1 " .$filePath. " 2>&1";
$framePerSecond = explode("/",shell_exec($command));

$command = "/usr/local/bin/ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width " .$filePath. " 2>&1";
$resolution = explode("\n", shell_exec($command));

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
