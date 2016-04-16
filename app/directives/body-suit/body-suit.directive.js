(function() {
    angular.module('app').directive('bodySuit', ['$q', '$document', '$window', '$state', '$timeout', 'suitSrvc', 'localStorageService',
        function($q, $document, $window, $state, $timeout, suitSrvc, localStorageService) {
            var directive = {
                restrict: 'E',
                replace: true,
                template: '<div />',
                link: linker
            };

            return directive;

            /*************************************************/

            function linker(scope, elem, attrs) {
                console.info('Initializing Body Suit: ', scope);
                var scene = new THREE.Scene(),
                    group = new THREE.Object3D(),
                    eyeGroup = new THREE.Object3D(),
                    mouse = new THREE.Vector2(),
                    renderer = new THREE.WebGLRenderer( { antialias: true } ),
                    raycaster = new THREE.Raycaster(),


                    camera,

                    tween,
                    unselectedEye,

                    intersected,

                    CANVAS_WIDTH,
                    CANVAS_HEIGHT,

                    CANVAS_OFFSETX,
                    CANVAS_OFFSETY,

                    targetRotationX = 0,
                    targetRotationOnMouseDownX = 0,

                    mouseX = 0,
                    mouseXOnMouseDown = 0,

                    mouseIsDown = false,
                    touchIsDown = false,

                    windowHalfX,

                    selectedEye,
                    idleSince = Date.now(),
                    idling = false,
                    IDLE_AFTER_MS = 1000 * 8,

                    switchedTime = Date.now(),

                    IDLE_COLOR = 0x19337f,
                    ACTIVE_COLOR = 0x3366ff, // if active state 0x3366ff, if not use IDLE_COLOR
                    PLAYING_COLOR = 0xff0000,
                    PLAYING_COLOR_BLINK = 0xff6666,
                    ROLLOVER_COLOR = 0x19337f,
                    BASE_EYE_COLOR = ACTIVE_COLOR;

                $timeout(init);

                /*************************************************/
                /* Scope Event Listeners
                /*************************************************/

                // mouse and touch listeners
                document.addEventListener('mousemove', onDocumentMouseMove, false);
                document.addEventListener('mousedown', onDocumentMouseDown, false);
                document.addEventListener('touchstart', onDocumentTouchStart, false);
                document.addEventListener('touchmove', onDocumentTouchMove, false);
                document.addEventListener('touchend', onDocumentTouchEnd, false );
                document.addEventListener('scroll', onWindowResize, false);

                // window resize listener
                window.addEventListener('resize', onWindowResize, false);

                // Clean up event listeners when scope view changes
                scope.$on('$destroy', function() {
                    document.removeEventListener('mousemove', onDocumentMouseMove, false);
                    document.removeEventListener('mousedown', onDocumentMouseDown, false);
                    document.removeEventListener('touchstart', onDocumentTouchStart, false);
                    document.removeEventListener('touchmove', onDocumentTouchMove, false);
                    document.removeEventListener('touchend', onDocumentTouchEnd, false );
                    document.removeEventListener('scroll', onWindowResize, false);

                    window.removeEventListener('resize', onWindowResize, false);

                    // void recursive rendering method
                    animate = noop;
                });

                /*************************************************/
                /* Canvas Methods
                /*************************************************/

                function init() {
                    setCanvasSize();

                    // var directionalLight = new THREE.DirectionalLight( 0x009999, 0.3 );
                    // directionalLight.position.set( 1.7, 0.1, 1 );
                    // scene.add( directionalLight );

                    // var directionalLight = new THREE.DirectionalLight( 0x009999, 0.3 );
                    // directionalLight.position.set( -1.7, 0.1, 1 );
                    // scene.add( directionalLight );

                    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 5 );
                    scene.add( light );

                    // scene, raycaster, camera, renderer
                    camera = new THREE.PerspectiveCamera(60, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 200);

                    camera.position.y = 0;
                    camera.position.z = 40;
                    camera.lookAt(scene.position);

                    // initializing mouse off center
                    mouse.x = 1;
                    mouse.y = 1;

                    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.sortObjects = false;

                    elem.append(renderer.domElement);

                    loadData(group, scene);

                    animate();
                }

                function animate(time) {
                    requestAnimationFrame(animate);
                    render(time);
                }

                // render scene
                function render(time) {
                    var intersects,
                        idleTime = Date.now() - idleSince;

                    if (idleTime > IDLE_AFTER_MS) {
                        if (idling === false ) {
                            toggleIdleState();
                        }

                        group.rotation.y += 0.01;

                    } else {
                        //horizontal rotation
                        group.rotation.y += ( targetRotationX - group.rotation.y ) * 0.1;
                    }

                    if (selectedEye) {
                        blinkEye();
                    }

                    // find intersections
                    raycaster.setFromCamera(mouse, camera);

                    // checks intersects for children of children
                    intersects = raycaster.intersectObjects(scene.children, true);

                    if(tween) tween.update(time);


                    if (intersects.length > 0) {

                        if (intersected != intersects[0].object) {
                            // resetIntersected();
                            // find eyes
                            if ((intersects[ 0 ].object.name.indexOf('eye') > -1 ) && intersects[0].object.active === true ) {
                                //change color
                                intersected = intersects[ 0 ].object;

                                if (touchIsDown && !idling) {
                                    videoPlay();
                                } else {
                                    // intersected.material.color.setHex( ACTIVE_COLOR );
                                }

                            }
                        }

                    } else {

                         // resetIntersected();
                    }

                    renderer.render(scene, camera);

                }

                function videoPlay() {
                    if (!selectedEye) {
                        intersected.material.color.setHex(PLAYING_COLOR);

                        intersected.playing = true;
                        selectedEye = intersected;
                    }



                    if (( selectedEye ) && (intersected != selectedEye)) {
                        tween.stop();
                        unselectedEye = selectedEye;
                        selectedEye = intersected;
                        unselectedEye.material.color.setHex(ACTIVE_COLOR);
                        unselectedEye.playing = false;
                        selectedEye.material.color.setHex(PLAYING_COLOR);
                        selectedEye.playing = true;

                    }

                    viewFeed(selectedEye);
                }

                function toggleIdleState() {
                    var color;

                    // toggle idle state
                    idling = !idling;

                    if (idling) {
                        targetRotationX = 0;
                        mouse.x = 1;
                        mouse.y = 1;
                    }

                    color = idling ? IDLE_COLOR : ACTIVE_COLOR;
                    BASE_EYE_COLOR = color;
                    setEyeColor(color);
                }

                function setEyeColor(color) {
                    var i,
                        child;

                    for (i = 0; i < eyeGroup.children.length; i++) {

                        child = eyeGroup.children[i];

                        if (child.children[0].playing === false ) {
                            child.children[0].material.color.setHex( color );
                        }
                    }
                }

                function blinkEye() {
                    var timeNow,
                        elapsedTime;

                    timeNow = Date.now();
                    elapsedTime = timeNow - switchedTime;

                    if (elapsedTime > 1200) {
                        switchEyeColor();
                        switchedTime = Date.now();
                    }

                }

                function switchEyeColor() {
                    var color = selectedEye.material.color,
                        hexColor = color.getHex(),
                        targetColor;

                    if (hexColor == PLAYING_COLOR) {
                        targetColor = PLAYING_COLOR_BLINK;
                        tweenColor(color, targetColor);

                    } else {
                        targetColor = PLAYING_COLOR;
                        tweenColor(color, targetColor);
                    }

                }

                function tweenColor (color, targetColor) {
                    var rgbTarget;

                    rgbTarget = new THREE.Color(targetColor);

                    tween = new TWEEN.Tween(color)
                        .to({r: rgbTarget.r, g: rgbTarget.g, b: rgbTarget.b }, 950)
                        .onComplete(handleComplete)
                        .easing(TWEEN.Easing.Quartic.In)
                        .start();

                }

                function handleComplete() {
                    if (unselectedEye) {
                       unselectedEye.material.color.setHex(BASE_EYE_COLOR);
                       // unselectedEye = null;
                    }

                }

                function viewFeed(selected) {
                    suitSrvc.selectFeedByPosition(selected.position, selected.side);
                }

                function incomingFeed(incoming) {
                    var i,
                        child;

                    for (i = 0; i < eyeGroup.children.length; i++) {

                        child = eyeGroup.children[i];

                        if ((child.children[0].side == incoming.side) && (child.children[0].position == incoming.position)) {
                            intersected = child.children[0];
                            videoPlay();
                        }
                    }

                }
                



                /*************************************************/
                /* Helper Methods
                /*************************************************/

                function setCanvasSize() {
                    CANVAS_WIDTH = elem.width();
                    CANVAS_HEIGHT = elem.height();

                    // normalize mouse
                    CANVAS_OFFSETX = elem.offset().left - (window.scrollX || 0);
                    CANVAS_OFFSETY = elem.offset().top - (window.scrollY || 0);

                    windowHalfX = CANVAS_WIDTH / 2;
                }

                // normalize mouse position for intersection
                function setMousePosition(clientX, clientY) {
                    var normalizedX,
                        normalizedY;

                    if (isOnCanvas(clientX, clientY)) {
                        normalizedX = clientX - CANVAS_OFFSETX;
                        normalizedY = clientY - CANVAS_OFFSETY;
                        mouse.x = (normalizedX / CANVAS_WIDTH) * 2 - 1;
                        mouse.y = -(normalizedY / CANVAS_HEIGHT) * 2 + 1;
                    }
                }



                // detect if on canvas
                function isOnCanvas(clientX, clientY) {
                    if ((clientX > CANVAS_OFFSETX && clientX < (CANVAS_OFFSETX + CANVAS_WIDTH)) &&
                        (clientY > CANVAS_OFFSETY && clientY < (CANVAS_OFFSETY + CANVAS_HEIGHT))) {
                        return true;
                    }
                }

                function resetIntersected() {
                    if (( selectedEye ) && (intersected == selectedEye)) {
                        intersected = null;
                        // info.innerHTML = '';
                    } else {
                        if ( intersected ) { intersected.material.color.setHex( ACTIVE_COLOR ); }
                        intersected = null;
                        // info.innerHTML = '';
                    }
                }

                function loadData(group, scene) {
                    var manager = new THREE.LoadingManager(),
                        loader = new THREE.OBJLoader(manager),

                        eyes = suitSrvc.getEyes(),
                        length = eyes.length,
                        i,

                        currentEye,
                        eyeLoader;

                    // wireframe argus
                    loader.load('obj/argus.obj', function(object) {
                        object.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = new THREE.MeshBasicMaterial({ color: 0xedece8, wireframe: true, wireframeLinewidth: 0.5 });
                            }
                        });

                        group.add(object);
                    }, onProgress, onError);

                    // internal solid argus
                    loader.load('obj/argus.obj', function(object) {
                        object.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = new THREE.MeshBasicMaterial({ color: 0x222222 });
                                child.scale.set( 0.99, 0.99, 0.99 );
                            }
                        });

                        group.add(object);
                    }, onProgress, onError);

                    // chest plate -- needs a texture
                    // loader.load('obj/chest.obj', function(object) {
                    //     object.traverse(function(child) {
                    //         if (child instanceof THREE.Mesh) {
                    //             child.material = new THREE.MeshBasicMaterial({ color: 0xedece8 });
                    //         }
                    //     });

                    //     group.add(object);
                    // }, onProgress, onError);


                    // eyes
                    for (i = 0; length > i; i++) {
                        eyeLoader = new THREE.OBJLoader( manager );
                        currentEye = eyes[i];

                        eyeLoader.load( 'obj/eyes/' + eyes[i].filename, function ( object ) {

                            object.traverse( function ( child ) {
                                if ( child instanceof THREE.Mesh ) {
                                    var texture = new THREE.TextureLoader().load("obj/textures/eye.png");
                                    child.material = new THREE.MeshPhongMaterial( {
                                        color: ACTIVE_COLOR,
                                        emissive: 0x000000,
                                        emissiveIntensity: 0.9,
                                        map: texture,
                                        shininess: 50,
                                        // specular: ACTIVE_COLOR,
                                        // envMaps: reflection

                                    } );

                                    child.position = this.position;
                                    child.side = this.side;
                                    child.active = this.active;
                                    child.playing = false;
                                }
                            }.bind(this));


                            eyeGroup.add(object);
                            group.add(eyeGroup);
                            scene.add(group);
                        }.bind(currentEye), onProgress, onError );
                    }
                }

                /*************************************************/
                /* Event Handlers
                /*************************************************/

                function onWindowResize() {
                    setCanvasSize();

                    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
                    camera.updateProjectionMatrix();

                    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
                }

                function onDocumentMouseDown(event) {
                    event.preventDefault();

                    document.addEventListener('mousemove', onDocumentMouseMove, false);
                    document.addEventListener('mouseup', onDocumentMouseUp, false);
                    document.addEventListener('mouseout', onDocumentMouseUp, false);

                    //model rotation
                    mouseIsDown = true;
                    mouseXOnMouseDown = event.clientX - windowHalfX;
                    targetRotationOnMouseDownX = targetRotationX;

                    if (intersected) {
                        videoPlay(); }

                    idleSince = Date.now();

                    if (idling) {
                        toggleIdleState();
                        group.rotation.y = 0;
                    }
                }

                function onDocumentMouseMove(event) {
                    // intersection
                    setMousePosition(event.clientX, event.clientY);

                    // model rotation
                    if (mouseIsDown === true && isOnCanvas(event.clientX, event.clientY)) {
                        mouseX = event.clientX - windowHalfX;
                        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
                    }
                }

                function onDocumentMouseUp(event) {
                    document.removeEventListener('mouseup', onDocumentMouseUp, false);
                    document.removeEventListener('mouseout', onDocumentMouseUp, false);

                    // model rotation
                    mouseIsDown = false;
                }

                function onDocumentTouchStart(event) {
                    var touch = event.touches[0];

                    touchIsDown = true;

                    idleSince = Date.now();

                    // intersection
                    if (touch) {
                        setMousePosition(touch.clientX, touch.clientY);
                    }

                    if (intersected) {
                        videoPlay(); }

                    //model rotation
                    if (touch && isOnCanvas(touch.clientX, touch.clientY)) {
                        event.preventDefault();

                        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
                        targetRotationOnMouseDownX = targetRotationX;
                    }

                    if (idling) {
                        toggleIdleState();
                        group.rotation.y = 0;
                    }

                }

                function onDocumentTouchMove(event) {
                    var touch = event.touches[0];

                    //model rotation
                    if (touch && isOnCanvas(touch.clientX, touch.clientY)) {
                        event.preventDefault();

                        mouseX = touch.pageX - windowHalfX;
                        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.05;
                    }
                }

                function onDocumentTouchEnd( event ) {
                    touchIsDown = false;
                }

                function onProgress(xhr) {
                    var percentComplete;

                    if (xhr.lengthComputable) {
                        percentComplete = xhr.loaded / xhr.total * 100;
                    }
                }

                function onError(xhr) {}

                function noop() {return null; }
            }
        }
    ]);
})();
