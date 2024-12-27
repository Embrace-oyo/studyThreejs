class Game {
    constructor() {
        this.container;
        this.stats;
        this.camera;
        this.scene;
        this.renderer;
        this.debug = true;
        this.debugPhysics = true;
        this.fixedTimeStep = 1.0 / 60.0;

        this.container = document.createElement("div");
        this.container.style.height = "100%";
        document.body.appendChild(this.container);

        const game = this;

        this.js = { forward: 0, turn: 0 };
        this.clock = new THREE.Clock();

        this.init();

        window.onError = function (error) {
            console.error(JSON.stringify(error));
        };
    }

    init() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            100000
        );
        this.camera.position.set(
            window.innerWidth < 800 ? -2 : -10,
            1,
            window.innerWidth < 800 ? -10 : -1
        );

        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        this.helper = new CannonHelper(this.scene);
        this.helper.addLights(this.renderer);

        window.addEventListener(
            "resize",
            function () {
                game.onWindowResize();
            },
            false
        );

        this.joystick = new JoyStick({
            game: this,
            onMove: this.joystickCallback
        });

        this.initPhysics();
    }

    initPhysics() {
        this.physics = {};

        const game = this;
        const world = new CANNON.World();
        this.world = world;

        world.broadphase = new CANNON.SAPBroadphase(world);
        world.gravity.set(0, -10, 0);
        world.defaultContactMaterial.friction = 0;

        const groundMaterial = new CANNON.Material("groundMaterial");
        const wheelMaterial = new CANNON.Material("wheelMaterial");
        const wheelGroundContactMaterial = new CANNON.ContactMaterial(
            wheelMaterial,
            groundMaterial,
            {
                friction: 0.3,
                restitution: 0,
                contactEquationStiffness: 1000
            }
        );

        // We must add the contact materials to the world
        world.addContactMaterial(wheelGroundContactMaterial);

        const chassisShape = new CANNON.Box(new CANNON.Vec3(1.25, 1, 3));
        const chassisBody = new CANNON.Body({ mass: 150 });
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 40, 0);
        chassisBody.angularVelocity.set(0, 0, 0);
        chassisBody.initPosition = new CANNON.Vec3(0, 40, 0); // Store initial position
        this.helper.addVisual(chassisBody, "car");

        var loader = new THREE.GLTFLoader();
        loader.load(
            "https://raw.githubusercontent.com/Data-Bee38/models/main/space_discoverer.glb",
            function (gltf) {
                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        node.material.side = THREE.DoubleSide;
                    }
                });

                var model = gltf.scene;
                model.scale.set(1, 1, 1);
                model.position.set(0, -1.5, 0);
                chassisBody.threemesh.add(model);
                //flagLocation.add(model);
            }
        );

        this.followCam = new THREE.Object3D();
        this.followCam.position.copy(this.camera.position);
        this.scene.add(this.followCam);
        this.followCam.parent = chassisBody.threemesh;
        this.helper.shadowTarget = chassisBody.threemesh;

        const options = {
            radius: 0.65,
            directionLocal: new CANNON.Vec3(0, -1.1, 0),
            suspensionStiffness: 30,
            suspensionRestLength: 0.3,
            frictionSlip: 10,
            dampingRelaxation: 2.3,
            dampingCompression: 4.4,
            maxSuspensionForce: 100000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        };

        // Create the vehicle
        const vehicle = new CANNON.RaycastVehicle({
            chassisBody: chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 1,
            indexForwardAxis: 2
        });

        const axlewidth = 2;
        const backwheel = -0.95;
        const frontwheel = 2.35;
        const wheelheight = -0.65;
        options.chassisConnectionPointLocal.set(axlewidth, wheelheight, backwheel);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-axlewidth, wheelheight, backwheel);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(axlewidth, wheelheight, frontwheel);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(
            -axlewidth,
            wheelheight,
            frontwheel
        );
        vehicle.addWheel(options);

        vehicle.addToWorld(world);

        const wheelBodies = [];

        vehicle.wheelInfos.forEach(function (wheel, index) {
            // Set the radius for the first two wheels
            let radius = wheel.radius;
            /*if (index === 0 || index === 1) {
              radius = wheel.radius * 1.5; // Example: Increase the radius by 1.5 times
            }*/

            // Create the cylinder shape with the modified radius
            const cylinderShape = new CANNON.Cylinder(radius, radius, radius / 2, 20);

            const wheelBody = new CANNON.Body({ mass: 1, material: wheelMaterial });
            const q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2);
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);

            wheelBodies.push(wheelBody);
            game.helper.addVisual(wheelBody, "wheel");
        });

        var loader = new THREE.GLTFLoader();
        loader.load(
            "https://raw.githubusercontent.com/Data-Bee38/models/main/space_discoverer_wheel.glb",
            function (gltf) {
                // Compute the bounding box of the entire model
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = new THREE.Vector3();
                box.getCenter(center);

                // Reposition the model so its center aligns with the origin
                gltf.scene.position.sub(center);

                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        node.material.side = THREE.DoubleSide;
                    }
                });

                /*var model = gltf.scene;
              model.scale.set(1,1,1);
              model.position.set(0, -1.5, 0);
              chassisBody.threemesh.add( model );*/
                //flagLocation.add(model);

                var models = gltf.scene;
                wheelBodies.map((d, i) => {
                    var model = models.clone();
                    model.scale.set(1, 1, 1);
                    model.castShadow = true;
                    //model.rotation.y = Math.PI;
                    if (i == 1 || i == 3) model.rotateY(Math.PI);
                    wheelBodies[i].threemesh.add(model);
                });
            }
        );

        // Update wheels
        world.addEventListener("postStep", function () {
            for (var i = 0; i < game.vehicle.wheelInfos.length; i++) {
                game.vehicle.updateWheelTransform(i);
                var t = game.vehicle.wheelInfos[i].worldTransform;
                wheelBodies[i].threemesh.position.copy(t.position);
                wheelBodies[i].threemesh.quaternion.copy(t.quaternion);
            }

            const upVector = new CANNON.Vec3(0, 1, 0);
            const vehicleUp = new CANNON.Vec3();
            chassisBody.quaternion.vmult(upVector, vehicleUp);

            if (vehicleUp.y < 0.05) {
                // Vehicle is flipped
                //chassisBody.position.set(0, 10, 0); // Reset position
                chassisBody.position.set(
                    chassisBody.initPosition.x,
                    chassisBody.initPosition.y,
                    chassisBody.initPosition.z
                ); // Reset to initial position
                chassisBody.velocity.set(0, 0, 0); // Stop velocity
                chassisBody.angularVelocity.set(0, 0, 0); // Stop rotation
                chassisBody.quaternion.set(0, 0, 0, 1); // Reset orientation
            }

            /*let index = 0;
            game.vehicle.wheelInfos.forEach(function(wheel){
                    game.vehicle.updateWheelTransform(index);
                      const t = wheel.worldTransform;
                      wheelBodies[index].threemesh.position.copy(t.position);
                      wheelBodies[index].threemesh.quaternion.copy(t.quaternion);
              index++;
            });*/
        });

        this.vehicle = vehicle;

        //========================================================================================= add Terrain
        var sizeX = 128,
            sizeY = 128,
            minHeight = 0,
            maxHeight = 80;
        var startPosition = new CANNON.Vec3(0, maxHeight - 3, sizeY * 0.5 - 10);
        var img2matrix = (function () {
            "use strict";
            return {
                fromImage: fromImage,
                fromUrl: fromUrl
            };

            function fromImage(image, width, depth, minHeight, maxHeight) {
                width = width | 0;
                depth = depth | 0;

                var i, j;
                var matrix = [];
                var canvas = document.createElement("canvas"),
                    ctx = canvas.getContext("2d");
                var imgData,
                    pixel,
                    channels = 4;
                var heightRange = maxHeight - minHeight;
                var heightData;
                canvas.width = width;
                canvas.height = depth;

                // document.body.appendChild( canvas );
                ctx.drawImage(image, 0, 0, width, depth);
                imgData = ctx.getImageData(0, 0, width, depth).data;

                for (i = 0 | 0; i < depth; i = (i + 1) | 0) {
                    //row
                    matrix.push([]);

                    for (j = 0 | 0; j < width; j = (j + 1) | 0) {
                        //col
                        pixel = i * depth + j;
                        heightData =
                            (imgData[pixel * channels] / 255) * heightRange + minHeight;
                        matrix[i].push(heightData);
                    }
                }
                return matrix;
            }

            function fromUrl(url, width, depth, minHeight, maxHeight) {
                return function () {
                    return new Promise(function (onFulfilled, onRejected) {
                        var image = new Image();
                        image.crossOrigin = "anonymous";

                        image.onload = function () {
                            var matrix = fromImage(image, width, depth, minHeight, maxHeight);
                            onFulfilled(matrix);
                        };

                        image.src = url;
                    });
                };
            }
        })();

        //load terrain image url
        //load terrain image url
        Promise.all( [
            img2matrix.fromUrl( 'https://raw.githubusercontent.com/Data-Bee38/images/main/terrain3.png', sizeX, sizeY, minHeight, maxHeight )(),
        ] ).then( function ( data ) {
            var matrix = data[ 0 ];
            const terrainShape = new CANNON.Heightfield(matrix, {elementSize: 10});
            const terrainBody = new CANNON.Body({mass: 0});

            terrainBody.addShape(terrainShape);
            terrainBody.position.set(-sizeX * terrainShape.elementSize / 2, -10, sizeY * terrainShape.elementSize / 2);
            terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
            world.add(terrainBody);
            game.helper.addVisual(terrainBody, 'landscape');






// Store all terrain bodies for raycasting
            const terrainBodies = [terrainBody];
            // Function to clone terrain
            function cloneTerrain(offsetX, offsetZ) {
                const clonedTerrainBody = new CANNON.Body({ mass: 0 });
                clonedTerrainBody.addShape(terrainShape);
                clonedTerrainBody.position.set(
                    -sizeX * terrainShape.elementSize / 2 + offsetX,
                    -10,
                    sizeY * terrainShape.elementSize / 2 + offsetZ
                );
                clonedTerrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
                world.add(clonedTerrainBody);
                game.helper.addVisual(clonedTerrainBody, 'landscape');
                terrainBodies.push(clonedTerrainBody);
            }

            // Duplicate the terrain on all four sides
            const offset = (sizeX - 2) * terrainShape.elementSize;
            cloneTerrain(-offset, 0); // Left
            cloneTerrain(offset, 0);  // Right
            cloneTerrain(0, -offset); // Back
            cloneTerrain(0, offset);  // Front

            // Duplicate the terrain on all four corners
            cloneTerrain(-offset, -offset); // Bottom-left corner
            cloneTerrain(-offset, offset);  // Top-left corner
            cloneTerrain(offset, -offset);  // Bottom-right corner
            cloneTerrain(offset, offset);   // Top-right corner
            // Raycast to position the cube on the terrain
            function raycastCheck() {
                const raycaster = new THREE.Raycaster(mesh.position, new THREE.Vector3(0, -1, 0));

                let closestIntersection = null;
                terrainBodies.forEach((terrain) => {
                    const intersects = raycaster.intersectObject(terrain.threemesh.children[0]);
                    if (intersects.length > 0) {
                        if (!closestIntersection || intersects[0].distance < closestIntersection.distance) {
                            closestIntersection = intersects[0];
                        }
                    }
                });

                if (closestIntersection) {
                    // Align the helper mesh
                    raycastHelperMesh.position.set(0, 0, 0);
                    raycastHelperMesh.lookAt(closestIntersection.face.normal);
                    raycastHelperMesh.position.copy(closestIntersection.point);

                    // Position the cube on top of the terrain
                    mesh.position.y = closestIntersection.point.y + 0.5; // Offset slightly above terrain
                } else {
                    // Default height if no intersection
                    mesh.position.y = 30;
                }
            }


            // Update loop to call raycastCheck
            function update() {
                raycastCheck();
                requestAnimationFrame(update);
            }
            update();
        }); //end Promise

        //===================================================== model
        /*var groundShape = new CANNON.Plane();
        var groundBody = new CANNON.Body({
          mass: 0
        });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        world.add(groundBody);
        this.helper.addVisual(groundBody, 'ground');*/

        //===================================================== add snow shaders
        var particleSystemHeight = 100,
            numParticles = 2000,
            width = 500,
            height = particleSystemHeight,
            depth = 500,
            parameters = {
                color: 0xffffff,
                height: particleSystemHeight,
                radiusX: 2.5,
                radiusZ: 2.5,
                size: 100,
                scale: 0.25
            },
            systemGeometry = new THREE.Geometry(),
            //##systemMaterial.material.uniforms.elapsedTime.value##
            systemMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    //f is for float
                    color: { type: "c", value: new THREE.Color(parameters.color) },
                    height: { type: "f", value: parameters.height },
                    elapsedTime: { type: "f", value: 0 },
                    radiusX: { type: "f", value: parameters.radiusX },
                    radiusZ: { type: "f", value: parameters.radiusZ },
                    size: { type: "f", value: parameters.size },
                    scale: { type: "f", value: parameters.scale }
                },
                vertexShader: `
            uniform float radiusX;
            uniform float radiusZ;
            uniform float size;
            uniform float scale;
            uniform float height;
            uniform float elapsedTime;

            void main() {
              vec3 pos = position;
              pos.x += cos((elapsedTime + position.z) * 0.25) * radiusX;
              pos.y = mod(pos.y - elapsedTime, height);
              pos.z += sin((elapsedTime + position.x) * 0.25) * radiusZ;

              vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

              gl_PointSize = size * ( scale / length( mvPosition.xyz ) );

              gl_Position = projectionMatrix * mvPosition;
            }
          `,
                fragmentShader: `
            uniform vec3 color;

            void main() {
              gl_FragColor = vec4( color, 1.0 );
            }
          `
            });
        for (let i = 0; i < numParticles; i++) {
            let vertex = new THREE.Vector3(
                (Math.random() - 0.5) * width,
                Math.random() * height,
                (Math.random() - 0.5) * depth
            );
            systemGeometry.vertices.push(vertex);
        }
        this.particleSystem = new THREE.ParticleSystem(
            systemGeometry,
            systemMaterial
        );
        this.particleSystem.position.y = -height / 2;
        this.scene.add(this.particleSystem);

        this.animate();
    }

    joystickCallback(forward, turn) {
        this.js.forward = -forward;
        this.js.turn = -turn;
    }

    updateDrive(forward = this.js.forward, turn = this.js.turn) {
        const maxSteerVal = 0.6;
        const maxForce = 150;
        const brakeForce = 5;

        const force = maxForce * forward;
        const steer = maxSteerVal * turn;
        console.log(force, forward)
        if (forward != 0) {
            this.vehicle.setBrake(0, 0);
            this.vehicle.setBrake(0, 1);
            this.vehicle.setBrake(0, 2);
            this.vehicle.setBrake(0, 3);

            this.vehicle.applyEngineForce(force, 0);
            this.vehicle.applyEngineForce(force, 1);
        } else {
            this.vehicle.setBrake(brakeForce, 0);
            this.vehicle.setBrake(brakeForce, 1);
            this.vehicle.setBrake(brakeForce, 2);
            this.vehicle.setBrake(brakeForce, 3);
        }

        this.vehicle.setSteeringValue(steer, 2);
        this.vehicle.setSteeringValue(steer, 3);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateCamera() {
        this.camera.position.lerp(
            this.followCam.getWorldPosition(new THREE.Vector3()),
            0.015
        );
        this.camera.lookAt(this.vehicle.chassisBody.threemesh.position);
        if (this.helper.sun != undefined) {
            this.helper.sun.position.copy(this.camera.position);
            this.helper.sun.position.y += 10;
        }
    }

    animate() {
        const game = this;
        var clock = new THREE.Clock();

        requestAnimationFrame(function () {
            game.animate();
        });

        const now = Date.now();
        if (this.lastTime === undefined) this.lastTime = now;
        const dt = (Date.now() - this.lastTime) / 1000.0;
        this.FPSFactor = dt;
        this.lastTime = now;

        this.world.step(this.fixedTimeStep, dt);
        this.helper.updateBodies(this.world);

        //snow
        let delta = clock.getDelta(),
            elapsedTime = clock.getElapsedTime(),
            t = 0;
        this.particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 10;
        console.log('animation')
        this.updateDrive();
        this.updateCamera();

        this.renderer.render(this.scene, this.camera);

        if (this.stats != undefined) this.stats.update();
    }
}

//========================================================================================= Joystick
class JoyStick {
    constructor(options) {
        const circle = document.createElement("div");
        circle.style.cssText =
            "position:absolute; bottom:35px; width:80px; height:80px; background:rgba(126, 126, 126, 0.5); border:#444 solid medium; border-radius:50%; left:50%; transform:translateX(-50%);";
        const thumb = document.createElement("div");
        thumb.style.cssText =
            "position: absolute; left: 20px; top: 20px; width: 40px; height: 40px; border-radius: 50%; background: #fff;";
        circle.appendChild(thumb);
        document.body.appendChild(circle);
        this.domElement = thumb;
        this.maxRadius = options.maxRadius || 40;
        this.maxRadiusSquared = this.maxRadius * this.maxRadius;
        this.onMove = options.onMove;
        this.game = options.game;
        this.origin = {
            left: this.domElement.offsetLeft,
            top: this.domElement.offsetTop
        };
        this.rotationDamping = options.rotationDamping || 0.06;
        this.moveDamping = options.moveDamping || 0.01;
        if (this.domElement != undefined) {
            const joystick = this;
            if ("ontouchstart" in window) {
                this.domElement.addEventListener("touchstart", function (evt) {
                    joystick.tap(evt);
                });
            } else {
                this.domElement.addEventListener("mousedown", function (evt) {
                    joystick.tap(evt);
                });
            }
        }
    }

    getMousePosition(evt) {
        let clientX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.clientX;
        let clientY = evt.targetTouches ? evt.targetTouches[0].pageY : evt.clientY;
        return { x: clientX, y: clientY };
    }

    tap(evt) {
        evt = evt || window.event;
        // get the mouse cursor position at startup:
        this.offset = this.getMousePosition(evt);
        const joystick = this;
        if ("ontouchstart" in window) {
            document.ontouchmove = function (evt) {
                joystick.move(evt);
            };
            document.ontouchend = function (evt) {
                joystick.up(evt);
            };
        } else {
            document.onmousemove = function (evt) {
                joystick.move(evt);
            };
            document.onmouseup = function (evt) {
                joystick.up(evt);
            };
        }
    }

    move(evt) {
        evt = evt || window.event;
        const mouse = this.getMousePosition(evt);
        // calculate the new cursor position:
        let left = mouse.x - this.offset.x;
        let top = mouse.y - this.offset.y;
        //this.offset = mouse;

        const sqMag = left * left + top * top;
        if (sqMag > this.maxRadiusSquared) {
            //Only use sqrt if essential
            const magnitude = Math.sqrt(sqMag);
            left /= magnitude;
            top /= magnitude;
            left *= this.maxRadius;
            top *= this.maxRadius;
        }
        // set the element's new position:
        this.domElement.style.top = `${top + this.domElement.clientHeight / 2}px`;
        this.domElement.style.left = `${left + this.domElement.clientWidth / 2}px`;

        const forward =
            -(top - this.origin.top + this.domElement.clientHeight / 2) /
            this.maxRadius;
        const turn =
            (left - this.origin.left + this.domElement.clientWidth / 2) /
            this.maxRadius;

        if (this.onMove != undefined) this.onMove.call(this.game, forward, turn);
    }

    up(evt) {
        if ("ontouchstart" in window) {
            document.ontouchmove = null;
            document.touchend = null;
        } else {
            document.onmousemove = null;
            document.onmouseup = null;
        }
        this.domElement.style.top = `${this.origin.top}px`;
        this.domElement.style.left = `${this.origin.left}px`;

        this.onMove.call(this.game, 0, 0);
    }
}

//========================================================================================= add canon
class CannonHelper {
    constructor(scene) {
        this.scene = scene;
    }

    addLights(renderer) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        // LIGHTS
        //===================================================== add Light
        var light = new THREE.DirectionalLight(0xefefff, 1.5);
        light.position.set(1, 0, 1).normalize();
        this.scene.add(light);
        var light = new THREE.DirectionalLight(0xffefef, 1.5);
        light.position.set(-1, 0, -1).normalize();
        this.scene.add(light);

        var light = new THREE.DirectionalLight(0xdddddd);
        light.position.set(3, 10, 4);
        light.target.position.set(0, 0, 0);

        light.castShadow = true;

        this.sun = light;
        this.scene.add(light);
    }

    set shadowTarget(obj) {
        if (this.sun !== undefined) this.sun.target = obj;
    }

    createCannonTrimesh(geometry) {
        if (!geometry.isBufferGeometry) return null;

        const posAttr = geometry.attributes.position;
        const vertices = geometry.attributes.position.array;
        let indices = [];
        for (let i = 0; i < posAttr.count; i++) {
            indices.push(i);
        }

        return new CANNON.Trimesh(vertices, indices);
    }

    createCannonConvex(geometry) {
        if (!geometry.isBufferGeometry) return null;

        const posAttr = geometry.attributes.position;
        const floats = geometry.attributes.position.array;
        const vertices = [];
        const faces = [];
        let face = [];
        let index = 0;
        for (let i = 0; i < posAttr.count; i += 3) {
            vertices.push(new CANNON.Vec3(floats[i], floats[i + 1], floats[i + 2]));
            face.push(index++);
            if (face.length == 3) {
                faces.push(face);
                face = [];
            }
        }

        return new CANNON.ConvexPolyhedron(vertices, faces);
    }

    addVisual(body, name, castShadow = false, receiveShadow = true) {
        body.name = name;
        if (this.currentMaterial === undefined)
            this.currentMaterial = new THREE.MeshLambertMaterial({
                color: 0x888888,
                wireframe: true,
                transparent: true,
                opacity: 0
            });
        if (this.settings === undefined) {
            this.settings = {
                stepFrequency: 60,
                quatNormalizeSkip: 2,
                quatNormalizeFast: true,
                gx: 0,
                gy: 0,
                gz: 0,
                iterations: 3,
                tolerance: 0.0001,
                k: 1e6,
                d: 3,
                scene: 0,
                paused: false,
                rendermode: "solid",
                constraints: false,
                contacts: false, // Contact points
                cm2contact: false, // center of mass to contact points
                normals: false, // contact normals
                axes: false, // "local" frame axes
                particleSize: 0.1,
                shadows: false,
                aabbs: false,
                profiling: false,
                maxSubSteps: 3
            };
            this.particleGeo = new THREE.SphereGeometry(1, 16, 8);
            this.particleMaterial = new THREE.MeshLambertMaterial({
                color: 0xff0000
            });
        }
        // What geometry should be used?
        let mesh;
        if (body instanceof CANNON.Body)
            mesh = this.shape2Mesh(body, castShadow, receiveShadow);

        if (mesh) {
            // Add body
            body.threemesh = mesh;
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            this.scene.add(mesh);
        }
    }

    shape2Mesh(body, castShadow, receiveShadow) {
        const obj = new THREE.Object3D();
        const material = this.currentMaterial;
        const game = this;
        let index = 0;

        body.shapes.forEach(function (shape) {
            let mesh;
            let geometry;
            let v0, v1, v2;
            switch (shape.type) {
                case CANNON.Shape.types.SPHERE:
                    const sphere_geometry = new THREE.SphereGeometry(shape.radius, 8, 8);
                    mesh = new THREE.Mesh(sphere_geometry, material);
                    break;

                case CANNON.Shape.types.PARTICLE:
                    mesh = new THREE.Mesh(game.particleGeo, game.particleMaterial);
                    const s = this.settings;
                    mesh.scale.set(s.particleSize, s.particleSize, s.particleSize);
                    break;

                case CANNON.Shape.types.PLANE:
                    geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
                    mesh = new THREE.Object3D();
                    const submesh = new THREE.Object3D();
                    const ground = new THREE.Mesh(geometry, material);
                    ground.scale.set(100, 100, 100);
                    submesh.add(ground);

                    mesh.add(submesh);
                    break;

                case CANNON.Shape.types.BOX:
                    const box_geometry = new THREE.BoxGeometry(
                        shape.halfExtents.x * 2,
                        shape.halfExtents.y * 2,
                        shape.halfExtents.z * 2
                    );
                    mesh = new THREE.Mesh(box_geometry, material);
                    break;

                case CANNON.Shape.types.CONVEXPOLYHEDRON:
                    const geo = new THREE.Geometry();

                    // Add vertices
                    shape.vertices.forEach(function (v) {
                        geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
                    });

                    shape.faces.forEach(function (face) {
                        // add triangles
                        const a = face[0];
                        for (let j = 1; j < face.length - 1; j++) {
                            const b = face[j];
                            const c = face[j + 1];
                            geo.faces.push(new THREE.Face3(a, b, c));
                        }
                    });
                    geo.computeBoundingSphere();
                    geo.computeFaceNormals();
                    mesh = new THREE.Mesh(geo, material);
                    break;

                case CANNON.Shape.types.HEIGHTFIELD:
                    geometry = new THREE.Geometry();

                    v0 = new CANNON.Vec3();
                    v1 = new CANNON.Vec3();
                    v2 = new CANNON.Vec3();
                    for (let xi = 0; xi < shape.data.length - 1; xi++) {
                        for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
                            for (let k = 0; k < 2; k++) {
                                shape.getConvexTrianglePillar(xi, yi, k === 0);
                                v0.copy(shape.pillarConvex.vertices[0]);
                                v1.copy(shape.pillarConvex.vertices[1]);
                                v2.copy(shape.pillarConvex.vertices[2]);
                                v0.vadd(shape.pillarOffset, v0);
                                v1.vadd(shape.pillarOffset, v1);
                                v2.vadd(shape.pillarOffset, v2);
                                geometry.vertices.push(
                                    new THREE.Vector3(v0.x, v0.y, v0.z),
                                    new THREE.Vector3(v1.x, v1.y, v1.z),
                                    new THREE.Vector3(v2.x, v2.y, v2.z)
                                );
                                var i = geometry.vertices.length - 3;
                                geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
                            }
                        }
                    }
                    geometry.computeBoundingSphere();
                    geometry.computeFaceNormals();

                    //https://stackoverflow.com/questions/52614371/apply-color-gradient-to-material-on-mesh-three-js
                    var rev = true;
                    var cols = [
                        {
                            stop: 0,
                            color: new THREE.Color("#B0E0E6")
                        },
                        {
                            stop: 0.25,
                            color: new THREE.Color("#CD853F")
                        },
                        {
                            stop: 0.5,
                            color: new THREE.Color("#EEE8AA")
                        },
                        {
                            stop: 0.75,
                            color: new THREE.Color("#bf8040")
                        },
                        {
                            stop: 1,
                            color: new THREE.Color("#666")
                        }
                    ];

                    setGradient(geometry, cols, "z", rev);

                function setGradient(geometry, colors, axis, reverse) {
                    geometry.computeBoundingBox();

                    var bbox = geometry.boundingBox;
                    var size = new THREE.Vector3().subVectors(bbox.max, bbox.min);

                    var vertexIndices = ["a", "b", "c"];
                    var face,
                        vertex,
                        normalized = new THREE.Vector3(),
                        normalizedAxis = 0;

                    for (var c = 0; c < colors.length - 1; c++) {
                        var colorDiff = colors[c + 1].stop - colors[c].stop;

                        for (var i = 0; i < geometry.faces.length; i++) {
                            face = geometry.faces[i];
                            for (var v = 0; v < 3; v++) {
                                vertex = geometry.vertices[face[vertexIndices[v]]];
                                normalizedAxis = normalized
                                    .subVectors(vertex, bbox.min)
                                    .divide(size)[axis];
                                if (reverse) {
                                    normalizedAxis = 1 - normalizedAxis;
                                }
                                if (
                                    normalizedAxis >= colors[c].stop &&
                                    normalizedAxis <= colors[c + 1].stop
                                ) {
                                    var localNormalizedAxis =
                                        (normalizedAxis - colors[c].stop) / colorDiff;
                                    face.vertexColors[v] = colors[c].color
                                        .clone()
                                        .lerp(colors[c + 1].color, localNormalizedAxis);
                                }
                            }
                        }
                    }
                }

                    var mat = new THREE.MeshLambertMaterial({
                        vertexColors: THREE.VertexColors,
                        wireframe: false
                    });

                    //Set a different color on each face
                    /*for (var i = 0, j = geometry.faces.length; i < j; i++) {
                    geometry.faces[i].color = new THREE.Color(
                      "hsl(" + Math.floor(Math.random() * 360) + ",50%,50%)"
                    );
                  }*/

                    /*  var mat = new THREE.MeshLambertMaterial({
                    side: THREE.BackSide,
                    vertexColors: THREE.FaceColors,
                    side: THREE.DoubleSide,
                    wireframe: false,
                    color: new THREE.Color('wheat')
                  });*/
                    mesh = new THREE.Mesh(geometry, mat);

                    break;

                case CANNON.Shape.types.TRIMESH:
                    geometry = new THREE.Geometry();

                    v0 = new CANNON.Vec3();
                    v1 = new CANNON.Vec3();
                    v2 = new CANNON.Vec3();
                    for (let i = 0; i < shape.indices.length / 3; i++) {
                        shape.getTriangleVertices(i, v0, v1, v2);
                        geometry.vertices.push(
                            new THREE.Vector3(v0.x, v0.y, v0.z),
                            new THREE.Vector3(v1.x, v1.y, v1.z),
                            new THREE.Vector3(v2.x, v2.y, v2.z)
                        );
                        var j = geometry.vertices.length - 3;
                        geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
                    }
                    geometry.computeBoundingSphere();
                    geometry.computeFaceNormals();
                    mesh = new THREE.Mesh(geometry, MutationRecordaterial);
                    break;

                default:
                    throw "Visual type not recognized: " + shape.type;
            }

            mesh.receiveShadow = receiveShadow;
            mesh.castShadow = castShadow;

            mesh.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = castShadow;
                    child.receiveShadow = receiveShadow;
                }
            });

            var o = body.shapeOffsets[index];
            var q = body.shapeOrientations[index++];
            mesh.position.set(o.x, o.y, o.z);
            mesh.quaternion.set(q.x, q.y, q.z, q.w);

            obj.add(mesh);
        });

        return obj;
    }

    updateBodies(world) {
        world.bodies.forEach(function (body) {
            if (body.threemesh != undefined) {
                body.threemesh.position.copy(body.position);
                body.threemesh.quaternion.copy(body.quaternion);
            }
        });
    }
}



document.addEventListener("DOMContentLoaded", function(){
    const game = new Game();
    window.game = game;//For debugging only
});
