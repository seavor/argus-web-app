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
                    mouse = new THREE.Vector2(),
                    renderer = new THREE.WebGLRenderer(),
                    raycaster = new THREE.Raycaster(),

                    camera,

                    INTERSECTED,

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

                    // video play
                    selectedEye,
                    idleSince = Date.now(),
                    idling = false,
                    IDLE_AFTER_MS = 1000 * 10,

                    container;

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

                // window resize listener
                window.addEventListener('resize', onWindowResize, false);

                // Clean up event listeners when scope view changes
                scope.$on('$destroy', function() {
                    document.removeEventListener('mousemove', onDocumentMouseMove, false);
                    document.removeEventListener('mousedown', onDocumentMouseDown, false);
                    document.removeEventListener('touchstart', onDocumentTouchStart, false);
                    document.removeEventListener('touchmove', onDocumentTouchMove, false);
                    document.removeEventListener('touchend', onDocumentTouchEnd, false );

                    window.removeEventListener('resize', onWindowResize, false);

                    // void recursive rendering method
                    animate = noop;
                });

                /*************************************************/
                /* Canvas Methods
                /*************************************************/

                function init() {
                    container = elem[0];

                    console.dir(container);

                    CANVAS_WIDTH = container.offsetWidth;
                    CANVAS_HEIGHT = container.offsetHeight;

                    // normalize mouse
                    CANVAS_OFFSETX = container.offsetParent.offsetLeft;
                    CANVAS_OFFSETY = container.offsetParent.offsetTop;

                    windowHalfX = CANVAS_WIDTH / 2;

                    // scene, raycaster, camera, renderer
                    camera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);

                    camera.position.y = 0;
                    camera.position.z = 50;
                    camera.lookAt(scene.position);

                    // initializing mouse off center
                    mouse.x = 1;
                    mouse.y = 1;

                    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.sortObjects = false;

                    container.appendChild(renderer.domElement);

                    loadData(group, scene);

                    animate();
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

                    console.log('Client: ', clientX, clientY);
                    console.log('Mouse: ', mouse.x, mouse.y);
                    console.log('Normalized: ', normalizedX, normalizedY);

                }

                // detect if on canvas
                function isOnCanvas(clientX, clientY) {
                    if ((clientX > CANVAS_OFFSETX && clientX < (CANVAS_OFFSETX + CANVAS_WIDTH)) &&
                        (clientY > CANVAS_OFFSETY && clientY < (CANVAS_OFFSETY + CANVAS_HEIGHT))) {
                        return true;
                    }
                }

                function resetIntersected() {
                    if (( selectedEye ) && (INTERSECTED == selectedEye)) {
                        INTERSECTED = null;
                        // info.innerHTML = '';
                    } else {
                        if ( INTERSECTED ) { INTERSECTED.material.color.setHex( 0x00ff00 ); }
                        INTERSECTED = null;
                        // info.innerHTML = '';
                    }
                }

                function videoPlay() {
                    console.log('Clicked');
                    if (!selectedEye) {
                        INTERSECTED.material.color.setHex(0xff0000);
                        selectedEye = INTERSECTED;
                    }

                    if (( selectedEye ) && (INTERSECTED != selectedEye)) {
                        selectedEye.material.color.setHex(0x00ff00);
                        INTERSECTED.material.color.setHex(0xff0000);
                        selectedEye = INTERSECTED;
                        // togglePlayStatus(selectedEye, INTERSECTED);
                    }

                    console.log('initial playing', selectedEye);
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
                    loader.load('obj/argus2.obj', function(object) {
                        object.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                                child.material = new THREE.MeshBasicMaterial({ color: 0x222222 });
                                child.scale.x = 0.99;
                                child.scale.y = 0.99;
                                child.scale.z = 0.99;
                            }
                        });

                        group.add(object);
                    }, onProgress, onError);

                    // eyes
                    for (i = 0; length > i; i++) {
                        eyeLoader = new THREE.OBJLoader( manager );
                        currentEye = eyes[i];

                        eyeLoader.load( 'obj/eyes/' + eyes[i].filename, function ( object ) {

                            console.log('Current Eye: ', this);

                            object.traverse( function ( child ) {
                                if ( child instanceof THREE.Mesh ) {
                                    child.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                                    child.bodyposition = this.bodyposition;
                                }
                            }.bind(currentEye));

                            group.add(object);
                            scene.add(group);
                        }.bind(currentEye), onProgress, onError );
                    }
                }

                // render scene
                function render() {
                    var intersects,
                        idleTime = Date.now() - idleSince;

                    if (idleTime > IDLE_AFTER_MS) {
                        idling = true;
                        group.rotation.y += 0.01;
                        mouse.x = 1;
                        mouse.y = 1;
                    } else {
                        //horizontal rotation
                        idling = false;
                        group.rotation.y += ( targetRotationX - group.rotation.y ) * 0.1;
                    }

                    // find intersections
                    raycaster.setFromCamera(mouse, camera);

                    // checks intersects for children of children
                    intersects = raycaster.intersectObjects(scene.children, true);

                    if (intersects.length > 0) {
                        resetIntersected();

                        if (INTERSECTED != intersects[0].object) {
                            // find eyes
                            if (intersects[ 0 ].object.name.indexOf('eye') > -1 ) {
                                //change color
                                INTERSECTED = intersects[ 0 ].object;

                                if (touchIsDown) {
                                    console.log('Play it');
                                    videoPlay();
                                } else {
                                    INTERSECTED.material.color.setHex( 0x006ebf );
                                    console.log('Hover it');
                                }

                            }
                        }

                    }

                    renderer.render(scene, camera);

                }

                function animate() {
                    requestAnimationFrame(animate);
                    render();
                }

                /*************************************************/
                /* Event Handlers
                /*************************************************/

                function onWindowResize() {

                    CANVAS_WIDTH = container.offsetWidth;
                    CANVAS_HEIGHT = container.offsetHeight;

                    windowHalfX = CANVAS_WIDTH / 2;

                    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
                    camera.updateProjectionMatrix();

                    renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);

                }

                function onDocumentMouseDown(event) {
                    event.preventDefault();

                    document.addEventListener('mousemove', onDocumentMouseMove, false);
                    document.addEventListener('mouseup', onDocumentMouseUp, false);
                    document.addEventListener('mouseout', onDocumentMouseOut, false);

                    //model rotation
                    mouseIsDown = true;
                    mouseXOnMouseDown = event.clientX - windowHalfX;
                    targetRotationOnMouseDownX = targetRotationX;

                    if (INTERSECTED) { videoPlay(); }

                    idleSince = Date.now();

                    if (idling) { group.rotation.y = 0; }
                }

                function onDocumentMouseMove(event) {

                    // intersection
                    setMousePosition(event.clientX, event.clientY);

                    // model rotation
                    if (mouseIsDown === true) {
                        mouseX = event.clientX - windowHalfX;
                        targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * 0.02;
                        console.log(targetRotationX);
                    }

                }

                function onDocumentMouseUp(event) {

                    document.removeEventListener('mouseup', onDocumentMouseUp, false);
                    document.removeEventListener('mouseout', onDocumentMouseOut, false);

                    // model rotation
                    mouseIsDown = false;

                }

                function onDocumentMouseOut(event) {

                    document.removeEventListener('mouseup', onDocumentMouseUp, false);
                    document.removeEventListener('mouseout', onDocumentMouseOut, false);

                    // model rotation
                    mouseIsDown = false;

                }

                function onDocumentTouchStart(event) {
                    var touch;

                    touchIsDown = true;
                    console.log('touch', touchIsDown);

                    idleSince = Date.now();

                    if (idling) { group.rotation.y = 0; }

                    // intersection
                    if (event.touches.length == 1) {
                        touch = event.touches[0];
                        setMousePosition(touch.clientX, touch.clientY);
                    }

                    if (INTERSECTED) { videoPlay(); }

                    //model rotation
                    if (event.touches.length == 1) {

                        event.preventDefault();

                        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
                        targetRotationOnMouseDownX = targetRotationX;
                    }
                }

                function onDocumentTouchMove(event) {
                    //model rotation
                    if (event.touches.length == 1) {
                        event.preventDefault();

                        mouseX = event.touches[0].pageX - windowHalfX;
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
                        //console.log( Math.round(percentComplete, 2) + '% downloaded' );
                    }
                }

                function onError(xhr) {}

                function noop() {return null; }
            }
        }
    ]);
})();
