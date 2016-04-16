(function() {
    angular.module("app").directive("bodySuit", [ "$q", "$document", "$window", "$state", "$timeout", "suitSrvc", "localStorageService", function($q, $document, $window, $state, $timeout, suitSrvc, localStorageService) {
        var directive = {
            restrict: "E",
            replace: true,
            template: "<div />",
            link: linker
        };
        return directive;
        function linker(scope, elem, attrs) {
            console.info("Initializing Body Suit: ", scope);
            var scene = new THREE.Scene(), group = new THREE.Object3D(), eyeGroup = new THREE.Object3D(), mouse = new THREE.Vector2(), renderer = new THREE.WebGLRenderer({
                antialias: true
            }), raycaster = new THREE.Raycaster(), camera, tween, unselectedEye, intersected, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_OFFSETX, CANVAS_OFFSETY, targetRotationX = 0, targetRotationOnMouseDownX = 0, mouseX = 0, mouseXOnMouseDown = 0, mouseIsDown = false, touchIsDown = false, windowHalfX, selectedEye, idleSince = Date.now(), idling = false, IDLE_AFTER_MS = 1e3 * 8, switchedTime = Date.now(), IDLE_COLOR = 1651583, ACTIVE_COLOR = 3368703, PLAYING_COLOR = 16711680, PLAYING_COLOR_BLINK = 16737894, ROLLOVER_COLOR = 1651583, BASE_EYE_COLOR = ACTIVE_COLOR;
            $timeout(init);
            document.addEventListener("mousemove", onDocumentMouseMove, false);
            document.addEventListener("mousedown", onDocumentMouseDown, false);
            document.addEventListener("touchstart", onDocumentTouchStart, false);
            document.addEventListener("touchmove", onDocumentTouchMove, false);
            document.addEventListener("touchend", onDocumentTouchEnd, false);
            document.addEventListener("scroll", onWindowResize, false);
            window.addEventListener("resize", onWindowResize, false);
            scope.$on("$destroy", function() {
                document.removeEventListener("mousemove", onDocumentMouseMove, false);
                document.removeEventListener("mousedown", onDocumentMouseDown, false);
                document.removeEventListener("touchstart", onDocumentTouchStart, false);
                document.removeEventListener("touchmove", onDocumentTouchMove, false);
                document.removeEventListener("touchend", onDocumentTouchEnd, false);
                document.removeEventListener("scroll", onWindowResize, false);
                window.removeEventListener("resize", onWindowResize, false);
                animate = noop;
            });
            function init() {
                setCanvasSize();
                var light = new THREE.HemisphereLight(16777147, 526368, 5);
                scene.add(light);
                camera = new THREE.PerspectiveCamera(60, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 200);
                camera.position.y = 0;
                camera.position.z = 40;
                camera.lookAt(scene.position);
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
            function render(time) {
                var intersects, idleTime = Date.now() - idleSince;
                if (idleTime > IDLE_AFTER_MS) {
                    if (idling === false) {
                        toggleIdleState();
                    }
                    group.rotation.y += .01;
                } else {
                    group.rotation.y += (targetRotationX - group.rotation.y) * .1;
                }
                if (selectedEye) {
                    blinkEye();
                }
                raycaster.setFromCamera(mouse, camera);
                intersects = raycaster.intersectObjects(scene.children, true);
                if (tween) tween.update(time);
                if (intersects.length > 0) {
                    if (intersected != intersects[0].object) {
                        if (intersects[0].object.name.indexOf("eye") > -1 && intersects[0].object.active === true) {
                            intersected = intersects[0].object;
                            if (touchIsDown && !idling) {
                                videoPlay();
                            } else {}
                        }
                    }
                } else {}
                renderer.render(scene, camera);
            }
            function videoPlay() {
                if (!selectedEye) {
                    intersected.material.color.setHex(PLAYING_COLOR);
                    intersected.playing = true;
                    selectedEye = intersected;
                }
                if (selectedEye && intersected != selectedEye) {
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
                var i, child;
                for (i = 0; i < eyeGroup.children.length; i++) {
                    child = eyeGroup.children[i];
                    if (child.children[0].playing === false) {
                        child.children[0].material.color.setHex(color);
                    }
                }
            }
            function blinkEye() {
                var timeNow, elapsedTime;
                timeNow = Date.now();
                elapsedTime = timeNow - switchedTime;
                if (elapsedTime > 1200) {
                    switchEyeColor();
                    switchedTime = Date.now();
                }
            }
            function switchEyeColor() {
                var color = selectedEye.material.color, hexColor = color.getHex(), targetColor;
                if (hexColor == PLAYING_COLOR) {
                    targetColor = PLAYING_COLOR_BLINK;
                    tweenColor(color, targetColor);
                } else {
                    targetColor = PLAYING_COLOR;
                    tweenColor(color, targetColor);
                }
            }
            function tweenColor(color, targetColor) {
                var rgbTarget;
                rgbTarget = new THREE.Color(targetColor);
                tween = new TWEEN.Tween(color).to({
                    r: rgbTarget.r,
                    g: rgbTarget.g,
                    b: rgbTarget.b
                }, 950).onComplete(handleComplete).easing(TWEEN.Easing.Quartic.In).start();
            }
            function handleComplete() {
                if (unselectedEye) {
                    unselectedEye.material.color.setHex(BASE_EYE_COLOR);
                }
            }
            function viewFeed(selected) {
                suitSrvc.selectFeedByPosition(selected.position, selected.side);
            }
            function incomingFeed(incoming) {
                var i, child;
                for (i = 0; i < eyeGroup.children.length; i++) {
                    child = eyeGroup.children[i];
                    if (child.children[0].side == incoming.side && child.children[0].position == incoming.position) {
                        intersected = child.children[0];
                        videoPlay();
                    }
                }
            }
            function setCanvasSize() {
                CANVAS_WIDTH = elem.width();
                CANVAS_HEIGHT = elem.height();
                CANVAS_OFFSETX = elem.offset().left - (window.scrollX || 0);
                CANVAS_OFFSETY = elem.offset().top - (window.scrollY || 0);
                windowHalfX = CANVAS_WIDTH / 2;
            }
            function setMousePosition(clientX, clientY) {
                var normalizedX, normalizedY;
                if (isOnCanvas(clientX, clientY)) {
                    normalizedX = clientX - CANVAS_OFFSETX;
                    normalizedY = clientY - CANVAS_OFFSETY;
                    mouse.x = normalizedX / CANVAS_WIDTH * 2 - 1;
                    mouse.y = -(normalizedY / CANVAS_HEIGHT) * 2 + 1;
                }
            }
            function isOnCanvas(clientX, clientY) {
                if (clientX > CANVAS_OFFSETX && clientX < CANVAS_OFFSETX + CANVAS_WIDTH && (clientY > CANVAS_OFFSETY && clientY < CANVAS_OFFSETY + CANVAS_HEIGHT)) {
                    return true;
                }
            }
            function resetIntersected() {
                if (selectedEye && intersected == selectedEye) {
                    intersected = null;
                } else {
                    if (intersected) {
                        intersected.material.color.setHex(ACTIVE_COLOR);
                    }
                    intersected = null;
                }
            }
            function loadData(group, scene) {
                var manager = new THREE.LoadingManager(), loader = new THREE.OBJLoader(manager), eyes = suitSrvc.getEyes(), length = eyes.length, i, currentEye, eyeLoader;
                loader.load("obj/argus.obj", function(object) {
                    object.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshBasicMaterial({
                                color: 15592680,
                                wireframe: true,
                                wireframeLinewidth: .5
                            });
                        }
                    });
                    group.add(object);
                }, onProgress, onError);
                loader.load("obj/argus.obj", function(object) {
                    object.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshBasicMaterial({
                                color: 2236962
                            });
                            child.scale.set(.99, .99, .99);
                        }
                    });
                    group.add(object);
                }, onProgress, onError);
                for (i = 0; length > i; i++) {
                    eyeLoader = new THREE.OBJLoader(manager);
                    currentEye = eyes[i];
                    eyeLoader.load("obj/eyes/" + eyes[i].filename, function(object) {
                        object.traverse(function(child) {
                            if (child instanceof THREE.Mesh) {
                                var texture = new THREE.TextureLoader().load("obj/textures/eye.png");
                                child.material = new THREE.MeshPhongMaterial({
                                    color: ACTIVE_COLOR,
                                    emissive: 0,
                                    emissiveIntensity: .9,
                                    map: texture,
                                    shininess: 50
                                });
                                child.position = this.position;
                                child.side = this.side;
                                child.active = this.active;
                                child.playing = false;
                            }
                        }.bind(this));
                        eyeGroup.add(object);
                        group.add(eyeGroup);
                        scene.add(group);
                    }.bind(currentEye), onProgress, onError);
                }
            }
            function onWindowResize() {
                setCanvasSize();
                camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
                camera.updateProjectionMatrix();
                renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            function onDocumentMouseDown(event) {
                event.preventDefault();
                document.addEventListener("mousemove", onDocumentMouseMove, false);
                document.addEventListener("mouseup", onDocumentMouseUp, false);
                document.addEventListener("mouseout", onDocumentMouseUp, false);
                mouseIsDown = true;
                mouseXOnMouseDown = event.clientX - windowHalfX;
                targetRotationOnMouseDownX = targetRotationX;
                if (intersected) {
                    videoPlay();
                }
                idleSince = Date.now();
                if (idling) {
                    toggleIdleState();
                    group.rotation.y = 0;
                }
            }
            function onDocumentMouseMove(event) {
                setMousePosition(event.clientX, event.clientY);
                if (mouseIsDown === true && isOnCanvas(event.clientX, event.clientY)) {
                    mouseX = event.clientX - windowHalfX;
                    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * .02;
                }
            }
            function onDocumentMouseUp(event) {
                document.removeEventListener("mouseup", onDocumentMouseUp, false);
                document.removeEventListener("mouseout", onDocumentMouseUp, false);
                mouseIsDown = false;
            }
            function onDocumentTouchStart(event) {
                var touch = event.touches[0];
                touchIsDown = true;
                idleSince = Date.now();
                if (touch) {
                    setMousePosition(touch.clientX, touch.clientY);
                }
                if (intersected) {
                    videoPlay();
                }
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
                if (touch && isOnCanvas(touch.clientX, touch.clientY)) {
                    event.preventDefault();
                    mouseX = touch.pageX - windowHalfX;
                    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * .05;
                }
            }
            function onDocumentTouchEnd(event) {
                touchIsDown = false;
            }
            function onProgress(xhr) {
                var percentComplete;
                if (xhr.lengthComputable) {
                    percentComplete = xhr.loaded / xhr.total * 100;
                }
            }
            function onError(xhr) {}
            function noop() {
                return null;
            }
        }
    } ]);
})();