$(document).ready(function () {

  var apiKey = 'AIzaSyAZpGD3Fua2rc074DtcUVuSsZH4OUauFy4';

  var no = 2;

  function populateItems (item) {
    // Gets the latest row's row-items length
    var getRowItemsLength = $( $('.row')[ $('.row').length - 1 ] ).find('.row-item').length;

    if (getRowItemsLength === 0) {
      $( $('.row')[ $('.row').length - 1 ] ).append('<div class="row-item' +
        ($('.row').length % 2 !== 0 ? ' flip' : '') + '"></div>');
      getRowItemsLength = 1;

    }

    console.log(getRowItemsLength);

    // Gets the latest row's row-item
    var latestRowItemTriangles = $( $('.row')[ $('.row').length - 1 ] ).find('.row-item')[ getRowItemsLength - 1 ];
    var latestRowItemTrianglesLength = $(latestRowItemTriangles).find('.triangle').length;

    console.log(latestRowItemTriangles);
    console.log(latestRowItemTrianglesLength);

    var thumbnails = (item.snippet.thumbnails.maxres || item.snippet.thumbnails.high || item.snippet.thumbnails.medium || item.snippet.thumbnails.default);
    var dataInfo = ' title="' + item.snippet.title + '"> <span>' + item.snippet.title + '</span> <img src="' + thumbnails.url + '">';

    if (latestRowItemTrianglesLength === 0) {
      var triClass = getRowItemsLength === no && $('.row').length % 2 !== 0 ? 'triangle-right' : 'triangle-left';

      $(latestRowItemTriangles).append('<div id="' + item.contentDetails.videoId + '" class="triangle ' + triClass + '" ' + dataInfo + ' </div>');

      if (getRowItemsLength === no) {
        $('.triangle-holder').append('<div id="' + ($('.row').length + 1) + '" class="row"></div>');

        console.log('next');
      }

    } else {
      $(latestRowItemTriangles).append('<div id="' + item.contentDetails.videoId + '" class="triangle triangle-right" ' + dataInfo + ' </div>');

      var flip = $('.row').length % 2 === 1 ? (getRowItemsLength  % 2 === 1 ? '' : ' flip') :
         (getRowItemsLength % 2 === 1 ? ' flip' : '');

      $( $('.row')[ $('.row').length - 1 ] ).append('<div class="row-item' + flip + '"></div>');
      console.log('new');
    }
  }

  function getPlaylists (channelName, defer) {
    $.get('https://www.googleapis.com/youtube/v3/channels', {
      part: 'contentDetails',
      forUsername: channelName,
      key: apiKey

    }, function (info) {

      var i, j;

      console.info(info)

      for (i = 0; i < info.items.length; i += 1) {
        var item = info.items[i];

        console.log(item.contentDetails.relatedPlaylists.uploads);

        $.get('https://www.googleapis.com/youtube/v3/playlistItems', {
          part: 'snippet,contentDetails',
          maxResults: 50,
          playlistId: item.contentDetails.relatedPlaylists.uploads,
          key: apiKey

        }, function (data) {
          console.log(data.items);

          for (j = 0; j < data.items.length; j += 1) {
            var video = data.items[j];

            console.log(video);

            populateItems(video);
          }

          $('.row:last-child').remove();

          $('#title').html('Select a video on the right to play');
          $('.triangle-holder').slideDown(2000);
          $('#title').addClass('border');
        });
      }
    });
  }

  //getPlaylists('nigahiga');//'lindseystomp');

  $('.triangle-holder').on('click', '.triangle', function () {
    $('#display').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('id') +
      '?autoplay=1&controls=0&showinfo=0&disablekb=0');
    $('#title').html( '<span class="play-button"></span><span class="play-button right"></span> Playing - ' + $(this).attr('title') );

    if ($('#display').css('position') === 'static') {
      $('#display').slideDown();
      $('#title').removeClass('border');
    }
  });

  $('#get-channel').keyup(function (event) {
    if (event.keyCode == '13') {
       getPlaylists($(this).val());
    }
  });

  function resize () {
    $('#title').css('width', ($(window).innerWidth - 50) + 'px');

    if ($('#display').css('position') === 'static') {
      $('#display').css('height', ($(window).innerWidth() * 0.565) + 'px');
    } else {
      $('#display').css('height', '100%');
    }
  }

  $(window).resize(resize);

  $(window).scroll(function() {
    if ($('#display').css('position') === 'static' && $(window).scrollTop() > 0) {
      $('#title.border').show();
    }
  });

  resize();
});