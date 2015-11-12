<?php
//    shell_exec('../ffmpeg/bin/ffmpeg.exe -i rj_01.mp4 teste.avi');
//    shell_exec('ffmpeg/bin/ffmpeg.exe -i php/rj_01.mp4 php/teste.avi');
//    exec('../ffmpeg/bin/ffmpeg.exe -i rj_01.mp4 teste.avi');
//    exec('ffmpeg/bin/ffmpeg.exe -i php/rj_01.mp4 php/teste.avi');
//    shell_exec('ffmpeg/bin/ffmpeg.exe -i rj_01.mp4 teste.avi');
    try {
        $result = shell_exec('ffmpeg/bin/ffmpeg.exe -i rj_01.mp4 teste.avi');
        echo $result;
    } catch (Exception $e) {
        echo 'falhou';
    }
//    echo "<p>ok</p>";
?>
