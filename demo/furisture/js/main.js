$(document).ready(function () {
  // Set up the scene, camera, and renderer as global variables.
  var scene, camera, renderer, light;
  var texture, manager, color = '#55B663';
  var controls;
  var WIDTH = $('#sofa-displayer').innerWidth();
  var HEIGHT = window.innerHeight; //- $('.navbar-fixed-top').innerHeight();


  // Sets up the scene.
  function init(type) {
    // Create the scene and set the scene size.
    scene = new THREE.Scene();

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor( 0xffffff, 0);
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.domElement.id = 'context';
    //renderer.setPixelRatio( window.devicePixelRatio );
    renderer.domElement.style.position = 'relative';

    $('#sofa-displayer').append(renderer.domElement);

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(65, WIDTH / HEIGHT, 1, 1000);
    camera.position.z = 250;
    scene.add(camera);

    // Create a light, set its position, and add it to the scene.
    light = new THREE.PointLight(0xffffff);
    light.position.set(-100,200,100);
    scene.add(light);

    var ambient = new THREE.AmbientLight(0x101030);
    scene.add(ambient);

    var dirlight = new THREE.DirectionalLight(0x111111);
    dirlight.position.set(0, 0, 1);
    scene.add(dirlight);

    manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
    };

    texture = new THREE.Texture();

    // Add a white PointLight to the scene.

    setTexture('textures/texture1.jpg');
    setObject('models/sofa1.obj');
    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  }

  function setTexture (url) {
    var loader = new THREE.ImageLoader( manager );
    loader.load(url, function (image) {
      texture.image = image;
      texture.needsUpdate = true;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.x = 10;
      texture.repeat.y = 10;
    });
  }

  function setObject (url, settings) {
    settings = settings || {};

    var loader = new THREE.OBJLoader();
    loader.load(url, function(data){
      object = data;
      /*console.info(geometry);
      var material = new THREE.MeshLambertMaterial({color: 0x55B663});
      mesh = new THREE.Mesh( geometry, material);
      scene.add(mesh);*/
      object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.material.map = texture;
          //child.material.color.setRGB(1, 0, 0);
          //child.material = new THREE.MeshLambertMaterial({color: 0x000000});
          child.material.color = new THREE.Color(color);
        }
      });
      object.position.x = settings.positionX || -145;
      object.position.y = settings.positionY || -115;
      object.position.z = settings.positionZ || 35;
      object.rotation.x = settings.rotateX || 0;
      object.rotation.y = settings.rotateY || 0.35;
      scene.add(object);
    });
  }

  // Renders the scene and updates the render as needed.
  function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls.update();
  }

  function setContentHeight () {
    WIDTH = $('#sofa-displayer').innerWidth();
    WEIGHT = window.innerHeight;
    $('#sofa-info').css('max-height', HEIGHT + 'px');
    renderer.setSize(WIDTH, HEIGHT);
  }

  window.onresize = setContentHeight;

  init();
  animate();
  setContentHeight();


  var content = {
    'sofa1.obj': {
      model: 'Model Sofa 1',
      price: 9999,
      origin: 'Lorem Ipsum',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc id dictum ante, vel porta urna. Nam sed condimentum massa. Nulla sapien odio, elementum et nisl ac, faucibus fermentum ex'
    },

    'sofa3.obj': {
      model: 'Model Sofa 3',
      price: 5999,
      origin: 'Lorem Ipsum',
      desc: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus efficitur nisi et lacinia elementum.'
    },

    'sofa4.obj': {
      model: 'Model Sofa 4',
      price: 2999,
      origin: 'Lorem Ipsum',
      desc: 'Morbi condimentum iaculis ullamcorper. Quisque tincidunt nibh eget mi congue pharetra. Integer facilisis dolor vitae magna posuere, in semper erat hendrerit.'
    }
  };

  $(window).resize(function () {
    WIDTH = $('#sofa-displayer').innerWidth();
    HEIGHT = window.innerHeight - $('.navbar-fixed-top').innerHeight();
    renderer.setSize(WIDTH, HEIGHT);
  });

  $('#sofa-picker li').click(function () {
    $('#sofa-picker li').removeClass('active');
    $(this).addClass('active');

    var settings = {};
    var selected = $(this).attr('select');
    var data = content[selected] || {};

    scene.remove(object);

    $('#sofa-content').find('.title').html('<span> <em>$</em>' + data.price +
      '</span> ' + data.model + '<small>Made in ' + data.origin + '</small>');

    $('#sofa-content').find('.content').html(data.desc);

    if (selected === 'sofa3.obj') {
      settings.positionY = -125;
    }

    setObject('models/' + selected, settings);
  });

  $('#sofa-texture-picker li').click(function () {
    $('#sofa-texture-picker li').removeClass('active');
    $(this).addClass('active');

    setTexture('textures/' + $(this).attr('select'));
  });

  $('#sofa-color-picker').change(function () {
    color = $(this).val();
    $('#sofa-picker li.active').click();
  });

  $('.navbar-toggle').click(function () {
    $('#sofa-info').toggleClass('active');
    $(this).toggleClass('active');
    $('.navbar-no-mobile').toggleClass('active');
  });
});