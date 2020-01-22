<!DOCTYPE html>
<html>
    <title>Musique</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/materialize.css">
    <link rel="stylesheet" href="assets/css/nouislider.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <div style="overflow: auto;">
    <head>
        <nav class="blue-grey">
            <div class="nav-wrapper blue-grey">
                <a href="#" style="margin-left: 20px;" class="brand-logo">Musique</a>
            </div>
        </nav>
    </head>
    <style>
    .outer-div {
        position: absolute;
        padding: 30px;
    }
    .inner-div {
        margin: 0 auto;
        width: 100%; 
    }
    </style>
        <body>
            <audio id="audioGeneral"></audio>
                <div class="container">
                <br /><br />
                    <table id="playlist" style="margin-top: 60px;height:5px; max-height:5px;" class="responsive-table bordered">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Album</th>
                                <th>Année</th>
                                <th>Artiste</th>
                                <th>Temps</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            require_once('api/getid3/getid3.php');
                            $files = glob('musique/*.{mp3,flac}', GLOB_BRACE);
                            $CountMusic = 0;
                            foreach($files as $k => $file):
                                $CountMusic++;
                                $a = "Carotte";
                                $getID3 = new getID3;
                                $ThisFileInfo = $getID3->analyze($file);
                                getid3_lib::CopyTagsToComments($ThisFileInfo);
                                /*echo '<pre>';
                                    print_r($ThisFileInfo);
                                echo '</pre>';*/
                                if(isset($ThisFileInfo['tags']['id3v2']['title']['0'])){
                                    $title = $ThisFileInfo['tags']['id3v2']['title']['0'];
                                }elseif(isset($ThisFileInfo['tags']['vorbiscomment']['title']['0'])){
                                    $title = $ThisFileInfo['tags']['vorbiscomment']['title']['0'];
                                }else{
                                    $nameOfFIle = substr($file, 8, -4);
                                    $title = $nameOfFIle;
                                }
                                if(isset($ThisFileInfo['tags']['id3v2']['album']['0'])){
                                    $album = $ThisFileInfo['tags']['id3v2']['album']['0'];
                                }elseif(isset($ThisFileInfo['tags']['vorbiscomment']['album']['0'])){
                                    $album = $ThisFileInfo['tags']['vorbiscomment']['album']['0'];
                                }else{
                                    $album = "Inconnus";
                                }
                                if(isset($ThisFileInfo['tags']['id3v2']['artist']['0'])){
                                    $artist = $ThisFileInfo['tags']['id3v2']['artist']['0'];
                                }elseif(isset($ThisFileInfo['tags']['vorbiscomment']['artist']['0'])){
                                    $artist = $ThisFileInfo['tags']['vorbiscomment']['artist']['0'];
                                }else{
                                    $nameOfFIle = substr($file, 8, -4);
                                    $artist = 'Inconnus';
                                }
                                if(isset($ThisFileInfo['tags']['id3v2']['year']['0'])){
                                    $year = $ThisFileInfo['tags']['id3v2']['year']['0'];
                                }elseif(isset($ThisFileInfo['tags']['vorbiscomment']['year']['0'])){
                                    $year = $ThisFileInfo['tags']['vorbiscomment']['year']['0'];
                                }else{
                                    $year = 'Date inconnus';
                                }
                                $timeMusic = date('i:s', $ThisFileInfo['playtime_seconds']);
                                $pre_registre[] = array('link' => $file, 'id' => $k, 'title' => $title, 'album' => $album, 'artist' => $artist);
                            ?>
                                <div style="display: none;" id="musicSrcPlaylist-<?= $CountMusic; ?>"><?= $file; ?></div>
                                <tr id="btn_play_for_<?= $CountMusic; ?>" onclick="setModalInfoMusic('<?= str_replace("'", "\'", $title); ?>', '<?= str_replace("'", "\'",  $artist); ?>', '<?= str_replace("'", "\'", $album); ?>', '<?= $year; ?>', '<?= $timeMusic; ?>');playAudio('<?= str_replace("'", "\'", $file); ?>', '<?= str_replace("'", "\'", $title); ?>', '<?= str_replace("'", "\'", $artist); ?>', '<?= str_replace("'", "\'", $album); ?>', '<?= $year; ?>', 'btn_play_for_<?= $CountMusic; ?>', '<?= $CountMusic; ?>');" class="tr-btn ">
                                    <td>
                                        <?php echo $title; ?>
                                    </td>
                                    <td>
                                        <?php echo $album; ?>
                                    </td>
                                    <td>
                                        <?php echo $year; ?>
                                    </td>
                                    <td>
                                        <?php echo $artist; ?>
                                    </td>
                                    <td>
                                        <?php echo $timeMusic; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                            <?php
                            $music_registre = array('music' => $pre_registre);
                            ?>
                        </tbody>
                    </table>
                    <?= str_replace("C", "", $a); ?>
                </div>
            </div>
        </body>
    </div>
    <footer>
        <input style="border:none;position: fixed;width: 100%;margin-bottom: 0px;z-index:3;height: 1em;max-height: 1em;top: 6.5em;" type="range" step="any" id="seekbar"
        onchange="ChangeTheTime()" onclick="ChangeTheTime();">
        <div style="position: fixed;width: 100%;top: -8px;margin-bottom: 0px;z-index:2;max-height: 8em;" id="lecteur" class="card horizontal blue-grey">
            <div id="test-slider"></div>
            <div id="preloaderImgMusic" style="display:none;" class="card-image">
                <div class="preloader-wrapper active" style="font-size: 4em;position: absolute;top: 36px;left: 30px;color: white;">
                    <div class="spinner-layer spinner-red-only" style="border-color: white;">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div><div class="gap-patch">
                            <div class="circle"></div>
                        </div><div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-stacked" id="infoLecteur" >
                <div class="card-content white-text">
                    <div class="row">
                        <div id="setInfoLecteur" style="position: relative;top: -4px;" class="col s9">
                            <span id="title_lecteur" class="card-title">Séléctionnez une musique</span>
                            <span style="position: relative;top: -10px;" id="artiste_and_album_lecteur">Dev By Northen_Flo</span> 
                            <br /> 
                            <label style="color: white;background-color: #26a69a;border-radius: 2px;padding-left: 6px;padding-right: 6px;padding-top: 1px;padding-bottom: 1px;position: relative;top: -8px;" id="lblTime">-:--:--</label>
                            <p id="Duration"></p>
                        </div>
                        <div class="col s3">
                            <div style="position: relative;left: -50px;">
                                <a id="btn_nextMusic" style="margin-left: 1.5em;" onclick="NextMusic();" class="btn-floating waves-effect waves-light blue-grey lighten-1 right"><i class="material-icons">skip_next</i></a>
                                <a id="btn_mute" style="margin-left: 1.5em;" onclick="toggleMute();" class="btn-floating waves-effect waves-light blue-grey lighten-1 right"><i class="material-icons">volume_off</i></a>
                                <a id="btn_play" style="margin-left: 1.5em;position: relative;top: -8px;" onclick="togglePlayPause();" class="disabled btn-floating btn-large waves-effect waves-light blue-grey lighten-1 right"><i class="material-icons">play_arrow</i></a>
                                <a id="btn_stop" style="margin-left: 1.5em;" onclick="toggleStop();" class="disabled btn-floating waves-effect waves-light blue-grey lighten-1 right"><i class="material-icons">stop</i></a>
                                <a id="btn_prevMusic" style="margin-left: 1.5em;" onclick="PrevMusic();" class="btn-floating waves-effect waves-light blue-grey lighten-1 right"><i class="material-icons">skip_previous</i></a>
                            </div>
                            <input style="border:none;border:none;width: 100%;" type="range" min="0" max="1" step="0.1" id="volume" class="active" onclick="ChangeVolume()" onchange="ChangeVolume()">
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </footer>
    <div id="musiqueInfos" class="modal">
        <div class="modal-content">
            <h4 id="TitleMusiqueModal"></h4>
            <table class="responsive-table bordered">
                <thead>
                    <tr>
                        <th>Album</th>
                        <th>Année</th>
                        <th>Artiste</th>
                        <th>Temps</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td id="AlbumMusiqueModal">
                        </td>
                        <td id="YearMusiqueModal">
                        </td>
                        <td id="ArtistMusiqueModal">
                        </td>
                        <td id="TimeMusiqueModal">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-light btn-flat">Fermer</a>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="assets/js/materialize.js"></script>
    <script src="assets/js/nouislider.js"></script>
    <script src="assets/js/rangeInput.js"></script>
    <script src="assets/js/ajax.js"></script>
    <script>
        var CountMusic = <?= $CountMusic ?>;
        $(document).ready(function (){
            $('.modal').modal();
            $('.parallax').parallax();
        });
    </script>
    <script src="assets/js/ajax.js"></script>
 </html>
