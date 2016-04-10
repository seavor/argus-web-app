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
            var scene = new THREE.Scene(), group = new THREE.Object3D(), mouse = new THREE.Vector2(), renderer = new THREE.WebGLRenderer(), raycaster = new THREE.Raycaster(), camera, INTERSECTED, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_OFFSETX, CANVAS_OFFSETY, targetRotationX = 0, targetRotationOnMouseDownX = 0, mouseX = 0, mouseXOnMouseDown = 0, mouseIsDown = false, touchIsDown = false, windowHalfX, selectedEye, idleSince = Date.now(), idling = false, IDLE_AFTER_MS = 1e3 * 5, container;
            $timeout(init);
            document.addEventListener("mousemove", onDocumentMouseMove, false);
            document.addEventListener("mousedown", onDocumentMouseDown, false);
            document.addEventListener("touchstart", onDocumentTouchStart, false);
            document.addEventListener("touchmove", onDocumentTouchMove, false);
            document.addEventListener("touchend", onDocumentTouchEnd, false);
            window.addEventListener("resize", onWindowResize, false);
            scope.$on("$destroy", function() {
                document.removeEventListener("mousemove", onDocumentMouseMove, false);
                document.removeEventListener("mousedown", onDocumentMouseDown, false);
                document.removeEventListener("touchstart", onDocumentTouchStart, false);
                document.removeEventListener("touchmove", onDocumentTouchMove, false);
                document.removeEventListener("touchend", onDocumentTouchEnd, false);
                window.removeEventListener("resize", onWindowResize, false);
                animate = noop;
            });
            function init() {
                container = elem[0];
                CANVAS_WIDTH = container.offsetParent.offsetWidth;
                CANVAS_HEIGHT = container.offsetParent.offsetHeight;
                CANVAS_OFFSETX = container.offsetParent.offsetLeft + container.offsetParent.offsetParent.offsetLeft;
                CANVAS_OFFSETY = container.offsetParent.offsetTop + container.offsetParent.offsetParent.offsetTop;
                windowHalfX = CANVAS_WIDTH / 2;
                camera = new THREE.PerspectiveCamera(50, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1e3);
                camera.position.y = 0;
                camera.position.z = 50;
                camera.lookAt(scene.position);
                mouse.x = 1;
                mouse.y = 1;
                renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.sortObjects = false;
                container.appendChild(renderer.domElement);
                loadData(group, scene);
                animate();
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
                if (selectedEye && INTERSECTED == selectedEye) {
                    INTERSECTED = null;
                } else {
                    if (INTERSECTED) {
                        INTERSECTED.material.color.setHex(65280);
                    }
                    INTERSECTED = null;
                }
            }
            function videoPlay() {
                if (!selectedEye) {
                    INTERSECTED.material.color.setHex(16711680);
                    selectedEye = INTERSECTED;
                }
                if (selectedEye && INTERSECTED != selectedEye) {
                    selectedEye.material.color.setHex(65280);
                    INTERSECTED.material.color.setHex(16711680);
                    selectedEye = INTERSECTED;
                }
                viewFeed(selectedEye);
            }
            function viewFeed(selected) {
                console.log(selected.bodyposition);
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
                loader.load("obj/argus2.obj", function(object) {
                    object.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshBasicMaterial({
                                color: 2236962
                            });
                            child.scale.x = .99;
                            child.scale.y = .99;
                            child.scale.z = .99;
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
                                child.material = new THREE.MeshBasicMaterial({
                                    color: 65280
                                });
                                child.bodyposition = this.bodyposition;
                            }
                        }.bind(this));
                        group.add(object);
                        scene.add(group);
                    }.bind(currentEye), onProgress, onError);
                }
            }
            function render() {
                var intersects, idleTime = Date.now() - idleSince;
                if (idleTime > IDLE_AFTER_MS) {
                    idling = true;
                    group.rotation.y += .01;
                    mouse.x = 1;
                    mouse.y = 1;
                } else {
                    idling = false;
                    group.rotation.y += (targetRotationX - group.rotation.y) * .1;
                }
                raycaster.setFromCamera(mouse, camera);
                intersects = raycaster.intersectObjects(scene.children, true);
                if (intersects.length > 0) {
                    if (INTERSECTED != intersects[0].object) {
                        resetIntersected();
                        if (intersects[0].object.name.indexOf("eye") > -1) {
                            INTERSECTED = intersects[0].object;
                            if (touchIsDown) {
                                videoPlay();
                            } else {
                                INTERSECTED.material.color.setHex(28351);
                            }
                        }
                    }
                } else {
                    resetIntersected();
                }
                renderer.render(scene, camera);
            }
            function animate() {
                requestAnimationFrame(animate);
                render();
            }
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
                document.addEventListener("mousemove", onDocumentMouseMove, false);
                document.addEventListener("mouseup", onDocumentMouseUp, false);
                document.addEventListener("mouseout", onDocumentMouseOut, false);
                mouseIsDown = true;
                mouseXOnMouseDown = event.clientX - windowHalfX;
                targetRotationOnMouseDownX = targetRotationX;
                if (INTERSECTED) {
                    videoPlay();
                }
                idleSince = Date.now();
                if (idling) {
                    group.rotation.y = 0;
                }
            }
            function onDocumentMouseMove(event) {
                setMousePosition(event.clientX, event.clientY);
                if (mouseIsDown === true) {
                    mouseX = event.clientX - windowHalfX;
                    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * .02;
                }
            }
            function onDocumentMouseUp(event) {
                document.removeEventListener("mouseup", onDocumentMouseUp, false);
                document.removeEventListener("mouseout", onDocumentMouseOut, false);
                mouseIsDown = false;
            }
            function onDocumentMouseOut(event) {
                document.removeEventListener("mouseup", onDocumentMouseUp, false);
                document.removeEventListener("mouseout", onDocumentMouseOut, false);
                mouseIsDown = false;
            }
            function onDocumentTouchStart(event) {
                var touch;
                touchIsDown = true;
                idleSince = Date.now();
                if (idling) {
                    group.rotation.y = 0;
                }
                if (event.touches.length == 1) {
                    touch = event.touches[0];
                    setMousePosition(touch.clientX, touch.clientY);
                }
                if (INTERSECTED) {
                    videoPlay();
                }
                if (event.touches.length == 1) {
                    event.preventDefault();
                    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
                    targetRotationOnMouseDownX = targetRotationX;
                }
            }
            function onDocumentTouchMove(event) {
                if (event.touches.length == 1) {
                    event.preventDefault();
                    mouseX = event.touches[0].pageX - windowHalfX;
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