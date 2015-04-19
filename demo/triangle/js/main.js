$(document).ready(function () {

  var apiKey = 'AIzaSyAZpGD3Fua2rc074DtcUVuSsZH4OUauFy4';

  var no = 2;
  var medialist = {};

  var hasSelected = false;

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

    var mobileRowList = $('.triangle-holder-mobile').find('.row-mobile');
    mobileRowList = mobileRowList[ mobileRowList.length - 1 ];

    $(mobileRowList).append('<a data-id="' + item.contentDetails.videoId + '" class="col-md-3" style="background-image: url(' + thumbnails.url + ');" href="#">' +
      '<span>' + item.snippet.title + '</span></a>');

    if ($(mobileRowList).find('.col-md-3').length === 4) {
      $('.triangle-holder-mobile').append('<div class="row-mobile"></div>');
    }

    medialist[item.contentDetails.videoId] = item.snippet;
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
          $('.triangle-holder').slideDown(2000);

          $( $('.triangle')[0] ).click();
        });
      }
    });
  }

  //getPlaylists('nigahiga');//'lindseystomp');

  $('.triangle-holder').on('click', '.triangle', function () {
    $('#display').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('id') +
      '?autoplay=1&controls=0&showinfo=0&disablekb=0&enablejsapi=1&modestbranding=0&iv_load_policy=0');
    $('#title').find('small').html( 'Playing - ' + medialist[$(this).attr('id')].title + ' <button id="info-btn">More Info . . .</button>');
    $('#content').find('p').html( medialist[$(this).attr('id')].description );
    $('#content').find('h3 small').html( new Date(medialist[$(this).attr('id')].publishedAt).toString() );
  });

  $('.triangle-holder-mobile').on('click', '.col-md-3', function () {
    $('#display').attr('src', 'https://www.youtube.com/embed/' + $(this).attr('data-id') +
      '?autoplay=1&controls=0&showinfo=0&disablekb=0&enablejsapi=1&modestbranding=0&iv_load_policy=0');
    $('#title').find('small').html( 'Playing - ' + medialist[$(this).attr('data-id')].title + ' <button id="info-btn">More Info . . .</button>');
    $('#content').find('p').html( medialist[$(this).attr('data-id')].description );
    $('#content').find('h3 small').html( new Date(medialist[$(this).attr('data-id')].publishedAt).toString() );
    resize();
    $('#title small').addClass('selected');
    $('.triangle-holder-mobile').hide();
  });

  $('#title small').on('click', '#info-btn', function () {
    $(this).html( $('#content').is(':visible') ? 'More Info . . .' : 'Less Info . . .' );
    $('#content').slideToggle();
  });

  $('#menu-btn').click(function () {
    $('.triangle-holder-mobile').slideToggle();
    resize();
  });

  /*$('#get-channel').keyup(function (event) {
    if (event.keyCode == '13') {
       getPlaylists($(this).val());
    }
  });*/
  getPlaylists('lindseystomp');

  function resize () {
    $('#title').css('width', ($(window).innerWidth() - 50) + 'px');

    if ($('#display').css('position') === 'static') {
      $('#display').css('height', ($(window).innerWidth() * 0.565) + 'px');
    } else {
      $('#display').css('height', '100%');
    }

    var titleHeight = $('#title').outerHeight();
    var fixedPx = ($(window).innerHeight() - titleHeight - 50) + 'px';

    $('#content').css('height', fixedPx);
    $('#content').css('max-height', fixedPx);
    $('.triangle-holder-mobile').css('height', fixedPx);
    $('.triangle-holder-mobile').css('max-height', fixedPx);
    $('.triangle-holder-mobile').css('top', titleHeight + 'px');
  }

  $(window).resize(resize);

  $(window).scroll(function() {
    if ($('#display').css('position') === 'static' && $(window).scrollTop() > 0) {
      $('#title.border').show();
    }

    console.log('data', ($(window).innerHeight() - $('#title').outerHeight()));
  });

  resize();

  $('#navigation a').click(function () {
    $('.section').hide();
    $('#display').attr('src', '');
    $('#title small').html('');
    $( '#' + $(this).attr('data-target') ).fadeIn();
    $('#navigation a').removeClass('active');
    $(this).addClass('active');
    $('body').attr('class', '');
    $('body').addClass( $(this).attr('data-target').split('section-')[1] );

    resize();
  })
});