import * as BABYLON from "babylonjs";
import * as ZapparBabylon from "@zappar/zappar-babylonjs";
import model from "../assets/headset.glb";
import "babylonjs-loaders";
import "./index.sass";

let modelVisible = false;
// Setup BabylonJS in the usual way
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

export const scene = new BABYLON.Scene(engine);
const light = new BABYLON.HemisphericLight(
  "light1",
  new BABYLON.Vector3(0, 1, 0),
  scene
);

// Setup a Zappar camera instead of one of Babylon's cameras
export const camera = new ZapparBabylon.Camera("camera", scene);

camera.rearCameraMirrorMode = ZapparBabylon.CameraMirrorMode.CSS;

// Request the necessary permission from the user
ZapparBabylon.permissionRequestUI().then((granted) => {
  if (granted) camera.start(true);
  else ZapparBabylon.permissionDeniedUI();
});

// Set up our image tracker transform node


let helmet: BABYLON.Nullable<BABYLON.TransformNode>;

const faceTracker = new ZapparBabylon.FaceTrackerLoader().load();
// faceTracker.onVisible.bind((e: any) => !!helmet && helmet.setEnabled(true));
// faceTracker.onNotVisible.bind((e: any) => !!helmet && helmet.setEnabled(false));

const trackerTransformNode = new ZapparBabylon.FaceTrackerTransformNode(
  "tracker",
  camera,
  faceTracker,
  scene
);

const mask = new ZapparBabylon.HeadMaskMeshLoader("mask mesh", scene).load();
mask.parent = trackerTransformNode;


console.log('MODEL', model)
BABYLON.SceneLoader.ImportMesh(null, "", model, scene, (meshes) => {
  console.log('MMMM', meshes);
  let mesh: BABYLON.AbstractMesh | undefined;

  [mesh] = meshes;
  const scale = 8;
  mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
  mesh.rotation = new BABYLON.Vector3(0, 0, 0);
  mesh.position = new BABYLON.Vector3(-0.016, 0.323, -0.961);
  mesh.parent = trackerTransformNode;
  helmet = scene.getTransformNodeByName("headset");
  
  if(helmet){
    helmet.setEnabled(false);
  }
  
});

window.addEventListener("resize", () => {
  engine.resize();
});

// Set up our render loop
engine.runRenderLoop(() => {
  camera.updateFrame();
  scene.render();
  mask.updateFromFaceAnchorTransformNode(trackerTransformNode);

  console.log(faceTracker.visible.size)
  if (faceTracker.visible.size) {
    if (helmet) {
      helmet.setEnabled(true);
    }
  } else {
    if (helmet) {
     helmet.setEnabled(false);
    }
  }
});

// scene.debugLayer.show();
