var audio = document.getElementById("audioGeneral");
var volumeRange = document.getElementById('volume');
var seekbar = document.getElementById('seekbar');
var MusicActualId = null;
window.onload = function () {
    //$('#lblTime').hide();
    audio.addEventListener('timeupdate', UpdateTheTime, false);
    audio.addEventListener('durationchange', SetSeekBar, false);
    audio.addEventListener('volumechange', UpdateVolume, false);
    audio.volume = 0.5;
    volumeRange.value = audio.volume;
    $( "body" ).keydown(function( event ) {
        if ( event.which == 32 ) {
            togglePlayPause();
        }else if( event.which == 77) {
            toggleMute();
        }
    });
    seekbar.min = 0;
    seekbar.value = 0;
}
function UpdateVolume() {
    if(audio.volume == 0){
        audio.muted = true;
        volumeRange.value = audio.volume;
        document.getElementById('btn_mute').innerHTML = '<i class="material-icons">volume_up</i>';
    }else{
        audio.muted = false;
        volumeRange.value = audio.volume;
        document.getElementById('btn_mute').innerHTML = '<i class="material-icons">volume_off</i>';
    }
}
function ChangeTheTime() {
    audio.currentTime = seekbar.value;
}
function ChangeVolume() {
    var myVol = volumeRange.value;
    audio.volume = myVol;
}
function SetSeekBar() {
    seekbar.min = 0;
    seekbar.max = audio.duration;
}
function UpdateTheTime() {
    var sec = audio.currentTime;
    var h = Math.floor(sec / 3600);
    sec = sec % 3600;
    var min = Math.floor(sec / 60);
    sec = Math.floor(sec % 60);
    if (sec.toString().length < 2) sec = "0" + sec;
    if (min.toString().length < 2) min = "0" + min;
    if(audio.duration > 0 && !audio.paused) {
        $('#lblTime').html(""+ h + ":" + min + ":" + sec + "");
    }
    seekbar.min = audio.startTime;
    seekbar.max = audio.duration;
    seekbar.value = audio.currentTime;
    if(audio.duration == audio.currentTime){
        NextMusic();
    }
}
function PrevMusic()
{
    var IdAddNext = parseInt(MusicActualId) - 1;
    var GetSrcNextMusic = $('#musicSrcPlaylist-'+IdAddNext).html();
    $('#btn_play_for_'+IdAddNext).trigger('click');
}
function NextMusic()
{
    var IdAddNext = parseInt(MusicActualId) + 1;
    if(CountMusic < IdAddNext){
        toggleStop();
    }else{
        var GetSrcNextMusic = $('#musicSrcPlaylist-'+IdAddNext).html();
        $('#btn_play_for_'+IdAddNext).trigger('click');
    }
}
function VerifPrevious()
{
    if(MusicActualId == 1){
        $('#btn_prevMusic').addClass('disabled');
    }else{
        $('#btn_prevMusic').removeClass('disabled');
    }
}
function VerifNext()
{
    if(CountMusic == MusicActualId){
        $('#btn_nextMusic').addClass('disabled');
    }else{
        $('#btn_nextMusic').removeClass('disabled');
    }
}
function setModalInfoMusic(title, artist, album, year, time)
{
    $('#TitleMusiqueModal').html(title);
    $('#AlbumMusiqueModal').html(album);
    $('#YearMusiqueModal').html(year);
    $('#ArtistMusiqueModal').html(artist);
    $('#TimeMusiqueModal').html(time);
}
function playAudio(src, title, artist, album, year, srcClick, idMusic){
    setModalInfoMusic();
    MusicActualId = idMusic;
    VerifPrevious();
    VerifNext();
    MusicActualId = idMusic;
    Materialize.Toast.removeAll();
    var $toastContent = $('<span><i class="material-icons left">music_note</i> <span>Vous écoutez, '+title+' de '+artist+' </span></span>');
    Materialize.toast($toastContent, 6000, 'rounded');
    audio.currentTime = 0;
    var PresentationMusicPlayer = title+' - Par '+artist+' - '+album+' - '+year;
    $('title').html('Musique - '+PresentationMusicPlayer);
    $('.tr-btn').css('background-color', 'white');
    $('#'+srcClick).css('background-color', '#eaeaea');
    $('#title_lecteur').html(title+' <i class="material-icons" onclick="$(\'#musiqueInfos\').modal(\'open\');" style="cursor: pointer;position: relative;top: 6px;">info_outline</i>');
    $('#artiste_and_album_lecteur').html(PresentationMusicPlayer);
    var player = $('#audioGeneral').get(0);
    player.src = src;
    player.play();
    $('#progress').removeClass('indeterminate');
    $('#progress').addClass('determinate');
    player.addEventListener('play', function() {
        $('#btn_play').html('<i class="material-icons">pause</i>').removeClass('disabled');
        $('#btn_stop').removeClass('disabled');
    }, false);
    player.addEventListener('pause', function() {
        document.getElementById('btn_play').innerHTML = '<i class="material-icons">play_arrow</i>';
    }, false);
    $('#lblTime').show();
    $('#infoLecteur').animate({
        "margin-left": "90px",  //go right
   }, 500);
   $('#preloaderImgMusic').show();
   setTimeout(function(){
    $('#preloaderImgMusic').html('<i style="font-size: 4em;position: absolute;top: 36px;left: 30px;color: white;" class="material-icons">music_note</i>');
   }, 1000);
}
function togglePlayPause() {
    var player = document.getElementById('audioGeneral');
    if (player.src != ""){
        if (player.paused || player.ended) {
            player.play();
        }
        else {
            player.pause();
        }
    }
}
function toggleStop() {
    $('#lblTime').html('-:--:--');
    var player = document.getElementById('audioGeneral');
    player.src = "";
    window.parent.document.title = 'Musique';
    $('#btn_play').addClass('disabled');
    $('#btn_stop').addClass('disabled');
    $('.btn_play_lect').html('<i class="material-icons left">play_arrow</i> Lire');
    $('#preloaderImgMusic').html('');
    $('#preloaderImgMusic').hide();
    $('#infoLecteur').animate({
        "margin-left": "0px",
    }, 500);
    $('#title_lecteur').html("Séléctionnez une musique");
    $('#artiste_and_album_lecteur').html("Dev By Northen_Flo");
}
function pause(audio){
	var player = document.getElementById(audio);
	player.pause();
	document.getElementById('btn_play').innerHTML = '<i class="material-icons">play_arrow</i>';
}
function toggleMute() {
    var player = document.getElementById('audioGeneral');
    if(player.volume == 0){
        player.volume = 0.5;
    }else{
        player.volume = 0.0;
    }
}
function setMuteParam(booleanIsMuted)
{
    var player = document.getElementById('audioGeneral');
    player.muted = booleanIsMuted;
}
function toggleVolumeDown()
{
	var player = document.getElementById('audioGeneral');
	var volume = player.volume;
	var volumeF = volume;
	player.volume = volumeF - 0.1;
}
function toggleVolumeUp()
{
	var player = document.getElementById('audioGeneral');
	var volume = player.volume;
	var volumeF = volume;
	player.volume = volumeF + 0.1;
}
