window.onload = init;
////////GLOBAL VARS
    var renderer, scene, camera, control, mouseControls;

    function init() {
////////SCENE
        scene = new THREE.Scene();
////////CAMERA
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        //positions
        camera.position.x = -30;
        camera.position.y = -45;
        camera.position.z = 0;

        camera.lookAt(scene.position);
        //mouseControls = new THREE.OrbitControls( camera );//remove in final
////////RENDERER
        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000066CC, 1.0);
        renderer.setSize(window.innerWidth, window.innerHeight);
////////SHAPES
    //Plane
        var planeGeometry = new THREE.PlaneGeometry(500,500, 150,150);
        var planeMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, wireframe: true } );
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        //positions
        plane.rotation.y = 90 * Math.PI / 180;
        plane.position.y = 3;
        plane.position.z = 3.5;

        scene.add(plane);  
    //colors
    colors = [0x99FF99, 0x06f066CC, 0xFFCC00];
    //Waves
    createWave("waveMain");
    waveAmount = 215;
    for(var c = 0; c < waveAmount; c++){
        createWave("wave"+c);
        //spacing between waves
        scene.getObjectByName( 'wave'+c ).rotation.z = c*0.03;
    }
////////OUTPUT
        document.body.appendChild(renderer.domElement);
        control = new function () {
            this.Scale = 360;
            this.AutoScale = false;
            this.Camera = 360;
            this.CameraRotation = false;
        };
////////FUNCTION CALLINGS
        addControls(control);
        render();
    }
//GUI CONTROLLS
	direction = 0;
    function addControls(controlObject) {
        gui = new dat.GUI();
        gui.add(controlObject, 'Scale', 0, 360).listen();
        gui.add(controlObject, 'Camera', 0, 360).listen();
        gui.add(controlObject,'AutoScale');
        gui.add(controlObject,'CameraRotation');
    }
//ANIMATION
    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        //mouseControls.update();//remove in final
    //auto wave rotation
    	if( control.AutoScale == true ){
	    	control.Scale += direction;
	    	if(control.Scale >= 360){
	    		direction = -1;
	    	}
	    	else if(control.Scale <= 0){
	    		direction = 1;
	    	}
	    }
    //wave rotation
        //leader wave
        scene.getObjectByName('waveMain').rotation.z = control.Scale * Math.PI/180;
        //follower waves
        for(var i = 0; i < waveAmount; i++){
        	//follows waveMain in delays
            scene.getObjectByName('wave'+i).rotation.z = scene.getObjectByName('waveMain').rotation.z-i*0.03;
            //prevents -deg
            if(scene.getObjectByName('wave'+i).rotation.z > 0){
                scene.getObjectByName('wave'+i).rotation.z = 0;
            }
            //fixes left over waves at 0deg
            if(scene.getObjectByName('waveMain').rotation.z == 360 * Math.PI/180){
                scene.getObjectByName('wave'+i).rotation.z = 0;
            }
        }
    	//camera rotation
	    	//auto
	    	if(control.CameraRotation == true){scene.getObjectById(1, true).rotation.x += 0.005;}
	        //manual
	        else{scene.getObjectById(1, true).rotation.x = control.Camera * Math.PI/180;}
    }

//WAVE CREATOR *UPDATED*
    function createWave(waveName,lineName){
        var lines = [];
        var increase = 0;
    //lines to form wave
        //geometry for waves
        var combined = new THREE.Geometry();
        //loop for adding lines
        for(var i = 0; i <= 500; i++){
            //changing the geometry
            var geometry = new THREE.PlaneGeometry(Math.sin(increase*3)*5, 0.1);
            increase += 0.01;
            //allows the array to be used as a name
            lineName = lines[i];
            var lineName = new THREE.Mesh( geometry );
            //positions
            lineName.position.x = (Math.sin(increase)*5/2);
            lineName.position.y = 0;
            lineName.position.z = (i*0.03)-10;
            lineName.rotation.x = 90 * Math.PI / 180;
            //merging to the wave
            THREE.GeometryUtils.merge( combined, lineName );
        }
        //adding the wave
        var wave = new THREE.Mesh( combined, new THREE.MeshBasicMaterial( { color: colorPick(), side: THREE.DoubleSide } ) );
        wave.name = waveName;
        scene.add( wave );
    }
//color picker
function colorPick(){
    return colors[Math.floor(Math.random() * 3)];
}



