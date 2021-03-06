var player;
var currentUrl = '';
var playList =[];

$(function() {
  player = new CastPlayer();
  var url = getUrlParameter("url")
  if (url) {
    $('#url').val(url);
  }
});

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return decodeURIComponent(sParameterName[1]);
    }
  }
}


function launchApp() {
  player.launchApp();
}

function getContentType(url) {
  var ext = url.split('.').pop();
  var formats = [
    {ext: 'mkv', type: 'video'},
    {ext: 'webm', type: 'video'},
    {ext: 'mp4', type: 'video'},
    {ext: 'm4v', type: 'video'},
    {ext: 'm4a', type: 'audio'},
    {ext: 'jpeg', type: 'image'},
    {ext: 'jpg', type: 'image'},
    {ext: 'gif', type: 'image'},
    {ext: 'png', type: 'image'},
    {ext: 'bmp', type: 'image'},
    {ext: 'webp', type: 'image'}
  ];
  for (var i = 0; i < formats.length; i++) {
    if (formats[i].ext == ext) {
      return formats[i].type + "/" + ext;
    }
  }
  // it doesn't matter now, as it's unsupported.
  return "";
}

function displayQueue() {
    
    if(playList.length == 0) {
        $('#playlistarea').hide();
        return;
    }

    var playListStr = "";

    playListStr = playList.join("\r\n");

    /* for(var i in playList) {
            playListStr = playListStr + playList[i] + '\n';
    }
    */
    $('#playlist').val(playListStr);
    $('#playlistarea').show();

}
function addToQueue() {
  if ($('#url').val().trim() == "") {
    return;
  }
  playList.push($('#url').val());
  $('#url').val("");
  displayQueue();
}

function startPlayback() {
  var url;
    
  if (playList.length > 0) {
    url = decodeURIComponent(playList.shift());      
  } else {
      if($('#url').val().trim() == "")
        return;
      url = decodeURIComponent($('#url').val());
  }

  if (player.session == null) {
    return;
  }

  var contentType = getContentType(url);
  console.log("Playing media at " + url);
  player.loadMedia(url, contentType);
  displayQueue();
  $('#player_now_playing').html(url.split(/[\\/]/).pop());
  $('#controls').show();

}

function pause() {
  if (player.session != null) {
    player.pauseMedia();
  }
}

function resume() {
  if (player.session != null) {
    player.playMedia();
  }
}

function seek(is_forward) {
  if (player.session != null) {
    player.seekMedia(parseInt($("#player_seek").val()), is_forward);
  }
}

function seekTo() {	
  if (player.session != null) {
    player.seekTo(parseInt($("#player_seek_range").val()));
  }
}

function stop() {
  var reply = confirm("This will stop playback on the TV. Are you sure?");
  if (reply == true) {
    player.stopApp();
    $('#controls').hide();
  }
}

function volumeDown() {
  if (player.session != null) {
      player.volumeControl(false, false);
  }
}

function volumeUp() {
  if (player.session != null) {
    player.volumeControl(true, false);
  }
}

function volumeMute() {
  if (player.session != null) {
    player.volumeControl(false, true);
  }
}
