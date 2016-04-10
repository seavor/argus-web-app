(function() {
    angular.module("app").directive("bodySuit", [ "$document", "$window", "$state", "$timeout", "localStorageService", function($document, $window, $state, $timeout, localStorageService) {
        var directive = {
            restrict: "E",
            replace: true,
            template: "<canvas />",
            link: linker
        };
        return directive;
        function linker(scope, elem, attrs) {
            console.info("Initializing Body Suit: ", scope);
            var scene = new THREE.Scene(), group = new THREE.Object3D(), mouse = new THREE.Vector2(), renderer = new THREE.WebGLRenderer(), raycaster = new THREE.Raycaster(), camera, mesh, container, INTERSECTED, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_OFFSETX, CANVAS_OFFSETY, targetRotationX = 0, targetRotationOnMouseDownX = 0, mouseX = 0, mouseXOnMouseDown = 0, mouseIsDown = false, windowHalfX;
            document.addEventListener("mousemove", onDocumentMouseMove, false);
            document.addEventListener("mousedown", onDocumentMouseDown, false);
            document.addEventListener("touchstart", onDocumentTouchStart, false);
            document.addEventListener("touchmove", onDocumentTouchMove, false);
            window.addEventListener("resize", onWindowResize, false);
            scope.$on("$destroy", function() {
                document.removeEventListener("mousemove", onDocumentMouseMove, false);
                document.removeEventListener("mousedown", onDocumentMouseDown, false);
                document.removeEventListener("touchstart", onDocumentTouchStart, false);
                document.removeEventListener("touchmove", onDocumentTouchMove, false);
                window.removeEventListener("resize", onWindowResize, false);
                animate = noop;
            });
            function init() {
                container = elem[0];
                CANVAS_WIDTH = container.offsetWidth;
                CANVAS_HEIGHT = container.offsetHeight;
                windowHalfX = CANVAS_WIDTH / 2;
                CANVAS_OFFSETX = container.offsetLeft;
                CANVAS_OFFSETY = container.offsetTop;
                camera = new THREE.PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1e3);
                camera.position.y = 0;
                camera.position.z = 35;
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
            function loadData(group, scene) {
                var manager = new THREE.LoadingManager(), loader = new THREE.OBJLoader(manager);
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
                    object.position.y = 8;
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
                    object.position.y = 8;
                    group.add(object);
                }, onProgress, onError);
                loader.load("obj/eyes.obj", function(object) {
                    object.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.material = new THREE.MeshBasicMaterial({
                                color: 16777215
                            });
                            child.scale.x = 1.1;
                            child.scale.y = 1.1;
                            child.scale.z = 1.1;
                        }
                    });
                    object.position.y = 3;
                    object.position.z = .5;
                    group.add(object);
                    scene.add(group);
                }, onProgress, onError);
            }
            function render() {
                console.info("Render..");
                var intersects;
                group.rotation.y += (targetRotationX - group.rotation.y) * .1;
                raycaster.setFromCamera(mouse, camera);
                intersects = raycaster.intersectObjects(scene.children, true);
                if (intersects.length > 0) {
                    if (INTERSECTED != intersects[0].object) {
                        if (intersects[0].object.name == "eyes") {
                            INTERSECTED = intersects[0].object;
                            INTERSECTED.material.color.setHex(28351);
                            container.innerHTML = "contact";
                        }
                    }
                } else {
                    if (INTERSECTED) INTERSECTED.material.color.setHex(16777215);
                    INTERSECTED = null;
                    container.innerHTML = "";
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
            }
            function onDocumentMouseMove(event) {
                setMousePosition(event.clientX, event.clientY);
                if (mouseIsDown === true) {
                    mouseX = event.clientX - windowHalfX;
                    targetRotationX = targetRotationOnMouseDownX + (mouseX - mouseXOnMouseDown) * .02;
                    console.log(targetRotationX);
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
                if (event.touches.length == 1) {
                    touch = event.touches[0];
                    setMousePosition(touch.clientX, touch.clientY);
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