

var scene, camera, shadowLight, light, backLight, renderer;
var container,
    HEIGHT,
    WIDTH,
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane,
    stats,
    mouseX = 0,
    mouseY = 0,
    windowHalfX,
    windowHalfY,
    distortionAngle = 0,
    shakeAngle = 0,
    shakeAngle2 = 0,
    meteorite, metCore,
    wasteArray = [],
    frequency = 1,
    freqCount = 0,
    metShakeSpeed = .1,
    metRotateSpeed = .1,
    slowMoFactor = 1,
    shakeAmp = 3,
    colorsBright = ['#a3b509', '#79b68a', '#f4da7e', '#ff8f4e', '#9d797d', '#b91b2a', '#b4885c', '#dd6316', '#d9c4b4'],
    colorsDark = ['#000000','#190502', '#1c1005','#23190d', '#380008', '#131913', '#28120a', '#551705', '#471b01'],
    geometryMeteorite;



initDocument();
initTHREE();
//createStats();
createCam();
createLight();
createMeteorite();
animate();
switchFast();

function initDocument() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;
    container = document.getElementById('world');
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', switchSlow, false);
    window.addEventListener('mouseup', switchFast, false);

}

function initTHREE() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    container.appendChild(renderer.domElement);
}

function createStats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.right = '0px';
    container.appendChild(stats.domElement);
}

function createCam() {
    fieldOfView = 75;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 1;
    farPlane = 3000;
    cameraZ = 800;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane);
    camera.position.z = cameraZ;
}

function createLight() {
    shadowLight = new THREE.DirectionalLight(0xffffff, 2);
    shadowLight.position.set(20, 0, 10);
    shadowLight.castShadow = true;
    shadowLight.shadowDarkness = 0.01;
    scene.add(shadowLight);

    light = new THREE.DirectionalLight(0xffffff, .5);
    light.position.set(-20, 0, 20);
    scene.add(light);
    //*
    backLight = new THREE.DirectionalLight(0xffffff, 0.1);
    backLight.position.set(0, 0, -20);
    scene.add(backLight);
    //*/
}

function WasteParticle() {
    this.isFlying = false;
    this.color = hexToRgb(getColor("dark"));
    var threecol = new THREE.Color("rgb("+this.color.r+","+this.color.g+","+this.color.b+")");
    if (Math.random()>.5){
        var w = 110 + Math.random()*30;
        var h = 110 + Math.random()*30;
        var d = 5 + Math.random()*10;

        this.geometry = new THREE.BoxGeometry(w,h,d);
    }else{
        var scale = 20 + Math.random()*20;
        var nLines = Math.floor(Math.random()*3);
        var nRows = Math.floor(Math.random()*3);

        this.geometry = new THREE.SphereGeometry(scale,nLines,nRows);
    }

    this.material = new THREE.MeshLambertMaterial({
        color: threecol, shading: THREE.FlatShading, transparent: true
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    recycleWaste(this);
}

function recycleWaste(p){
    p.mesh.position.x = 0;
    p.mesh.position.y = 0;
    p.mesh.position.z = 0;
    p.mesh.rotation.x = Math.random()*Math.PI*2;
    p.mesh.rotation.y = Math.random()*Math.PI*2;
    p.mesh.rotation.z = Math.random()*Math.PI*2;
    p.mesh.scale.set(.1,.1,.1);
    p.mesh.material.opacity = 0;
    p.color = hexToRgb(getColor("dark"));
    p.mesh.material.color.setRGB(p.color.r/255,p.color.g/255,p.color.b/255);
    p.material.needUpdate = true;
    scene.add(p.mesh);
    wasteArray.push(p);
}
function flyWaste(p){
    var targetPosX, targetPosY, targetSpeed, targetColor;
    p.mesh.material.opacity = 1;
    p.mesh.position.x = -2000;
    p.mesh.position.y = -1500 + Math.random()*2000;
    p.mesh.position.z =  -1000 + Math.random()*1500;
    var s = Math.random()*.2;
    p.mesh.scale.set(s,s,s);
    //*
    targetPosX = 2000;
    targetPosY = p.mesh.position.y + 2500;
    targetSpeed = 2+Math.random()*2;
    targetColor = hexToRgb(getColor("bright"));

    TweenMax.to(p.mesh.rotation, targetSpeed*slowMoFactor, {
        x:Math.random()*Math.PI*6,
        y:Math.random()*Math.PI*6,
        z:Math.random()*Math.PI*6,
        ease : Linear.easeNone,
    });

    TweenMax.to(p.mesh.position, targetSpeed*slowMoFactor, {
        x:targetPosX,
        y:targetPosY,
        ease : Linear.easeNone,
        onComplete:recycleWaste,
        onCompleteParams:[p]
        //onUpdate:updateWaste,
        //onUpdateParams:[p]
    });
    //*/

}


function dropWaste(p){

    var targetPosX,targetPosY, targetSpeed, targetColor;

    p.mesh.material.opacity = 1;
    p.mesh.position.x = metCore.position.x - 40 - Math.random()*20;
    p.mesh.position.y = metCore.position.y - 40 + Math.random()*50;
    p.mesh.position.z = metCore.position.z;
    p.mesh.scale.set(.1,.1,.1);

    targetPosX = p.mesh.position.x + 600 + Math.random()*300;
    targetPosY = p.mesh.position.y + 600 + Math.random()*300;
    targetSpeed = 2+Math.random()*2;
    targetColor = hexToRgb(getColor("bright"));


    TweenMax.to(p.mesh.rotation, targetSpeed*slowMoFactor, {
        x:Math.random()*Math.PI*6,
        y:Math.random()*Math.PI*6,
        z:Math.random()*Math.PI*6
    });
    TweenMax.to(p.mesh.scale, targetSpeed*slowMoFactor, {
        bezier:[{x:1, y:1, z:1}, {x:.01, y:.01, z:.01}]
    });
    TweenMax.to(p.mesh.position, targetSpeed*slowMoFactor, {
        x:targetPosX, z:-100,
        y:targetPosY,

        ease : Strong.easeInOut,
        onComplete:recycleWaste,
        onCompleteParams:[p]
        //onUpdate:updateWaste,
        //onUpdateParams:[p]
    });

    TweenMax.to(p.color, 1*slowMoFactor, {
        r : targetColor.r,
        g : targetColor.g,
        b : targetColor.b,
        ease:Strong.easeIn,
        onUpdate:updateWaste,
        onUpdateParams:[p]
    });

}

function updateWaste(p){
    p.mesh.material.color.setRGB(p.color.r/255,p.color.g/255,p.color.b/255);
    p.material.needUpdate = true;
}

function getWasteParticle(){
    if (wasteArray.length){
        return wasteArray.pop();
    }else{
        return new WasteParticle();
    }
}

function getColor(value){
    if (value=="dark"){
        return colorsDark[Math.floor(Math.random()*colorsDark.length)];
    }else{
        return colorsBright[Math.floor(Math.random()*colorsBright.length)];
    }

}

function createMeteorite() {

    meteorite = new THREE.Object3D();
    geometryCore = new THREE.BoxGeometry(80, 80, 80);
    materialCore = new THREE.MeshLambertMaterial({
        color: 0xd44642,
        shading: THREE.FlatShading
    });
    metCore = new THREE.Mesh(geometryCore, materialCore);
    metCore.geometry.__dirtyVertices = true;
    metCore.geometry.dynamic = true;

    //*
    for (var i = 0; i < metCore.geometry.vertices.length; i++) {
        metCore.geometry.vertices[i].x += -10 + Math.random() * 20;
        metCore.geometry.vertices[i].y += -10 + Math.random() * 20;
        metCore.geometry.vertices[i].z += -10 + Math.random() * 20;
    }

    meteorite.add(metCore);


    //*/
    scene.add(meteorite);

}

function animate() {
    requestAnimationFrame(animate);
    updateCore();
    updateParticlesLoad();
    render();
    if (stats) stats.update();
}

function updateParticlesLoad(){
    if (freqCount % frequency == 0){
        createDroppingWaste();
    }
    if (freqCount % 5 == 0){
        createFlyingWaste();
    }
    freqCount++;
}

function switchSlow(){
    metShakeSpeed = .05;
    metRotateSpeed = .025;
    shakeAmp = 1;
    frequency = 10;
    slowMoFactor = 3;
    /*
 for (var i=0; i<meteorite.children.length; i++){
   var o = meteorite.children[i];
   TweenLite.killTweensOf(o.position);
 }
 */
}

function switchFast(){
    metShakeSpeed = .1;
    metRotateSpeed = .1;
    shakeAmp = 2;
    frequency = 2;
    slowMoFactor = 1;
    /*
    for (var i=0; i<meteorite.children.length; i++){
      var o = meteorite.children[i];
      TweenLite.killTweensOf(o.position);
    }
    */
}

function updateCore(){
    metCore.rotation.z += metRotateSpeed;
    metCore.rotation.x += metRotateSpeed/3;
    shakeAngle += metShakeSpeed;
    metCore.position.x = (Math.cos(shakeAngle) * shakeAmp);
    metCore.position.y = Math.cos(shakeAngle * 1.5) * shakeAmp*2;
    metCore.position.z = Math.cos(shakeAngle * 2) * shakeAmp*3;
}

function createDroppingWaste(){
    var p = getWasteParticle();
    dropWaste(p);
}

function createFlyingWaste(){
    var p = getWasteParticle();
    flyWaste(p);
}


function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
