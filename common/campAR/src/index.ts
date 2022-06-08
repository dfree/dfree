/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import * as BABYLON from "babylonjs";
import * as ZapparBabylon from "@zappar/zappar-babylonjs";
import * as MATERIALS from "babylonjs-materials";
import model from "../assets/van_b.glb";
import "babylonjs-loaders";
import "./index.sass";
// Model from https://sketchfab.com/3d-models/vw-bus-t1-558aa0e9c3d24232a7d62180fa0aa1d6

// The SDK is supported on many different browsers, but there are some that
// don't provide camera access. This function detects if the browser is supported
// For more information on support, check out the readme over at
// https://www.npmjs.com/package/@zappar/zappar-babylonjs
if (ZapparBabylon.browserIncompatible()) {
  // The browserIncompatibleUI() function shows a full-page dialog that informs the user
  // they're using an unsupported browser, and provides a button to 'copy' the current page
  // URL so they can 'paste' it into the address bar of a compatible alternative.
  ZapparBabylon.browserIncompatibleUI();

  // If the browser is not compatible, we can avoid setting up the rest of the page
  // so we throw an exception here.
  throw new Error("Unsupported browser");
}

// Setup BabylonJS in the usual way
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);
// eslint-disable-next-line no-unused-vars
const light = new BABYLON.DirectionalLight(
  "dir02",
  new BABYLON.Vector3(0, -10, 0),
  scene
);
light.intensity = 8;

// Setup a Zappar camera instead of one of Babylon's cameras
const camera = new ZapparBabylon.Camera("zapparCamera", scene);
camera.poseMode = ZapparBabylon.CameraPoseMode.AnchorOrigin;

// Request the necessary permission from the user
ZapparBabylon.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparBabylon.permissionDeniedUI();
});

const instantTracker = new ZapparBabylon.InstantWorldTracker();
// eslint-disable-next-line max-len
const trackerTransformNode = new ZapparBabylon.InstantWorldAnchorTransformNode(
  "tracker",
  camera,
  instantTracker,
  scene
);
light.parent = trackerTransformNode;

const carLift = {
  down: 0.24,
  up: 0.34,
  actual: 0.24,
}

const flameScale = {
  down: 0.6,
  up: 1,
  actual: 0.5,
}

let carModel: BABYLON.AbstractMesh | undefined;
const carMesh = new BABYLON.Mesh("car", scene);
carMesh.rotationQuaternion = null;
carMesh.rotation.y = 0;
carMesh.setEnabled(false);

let readyToShowModel = false;


const ground = BABYLON.Mesh.CreatePlane('ground', 2, scene);
ground.rotation.x = Math.PI / 2;

const shadowMaterial = new MATERIALS.ShadowOnlyMaterial('shadowOnly', scene as any);
(ground as any).material = shadowMaterial;
ground.receiveShadows = true;
ground.parent = carMesh;
shadowMaterial.alpha = 0.5;

const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
shadowGenerator.useBlurExponentialShadowMap = true;
shadowGenerator.blurScale = 2;
shadowGenerator.setDarkness(0.2);

const deltaEdge = {
  min: -1,
  max: 1,
};
const rotationEdge = {
  min: -30,
  max: 30,
};
let deltaX = 0;
let deltaY = 0;

let wheels: BABYLON.Nullable<BABYLON.TransformNode>[] = [];
let flames: BABYLON.Nullable<BABYLON.AbstractMesh>[] = [];
const baseWheelRotation = new BABYLON.Vector3(Math.PI, Math.PI, Math.PI / 2);

BABYLON.SceneLoader.ImportMesh(null, "", model, scene, (meshes) => {
  let mesh: BABYLON.AbstractMesh | undefined;
  [mesh] = meshes;
  shadowGenerator?.getShadowMap()?.renderList?.push(...meshes);

  light.setDirectionToTarget(mesh.absolutePosition);
  mesh.rotationQuaternion = null;
  mesh.rotation.y = 0;
  const scale = 0.2;
  mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
  mesh.parent = carMesh;
  carModel = mesh;
  carMesh.parent = trackerTransformNode;

  wheels = [
    scene.getTransformNodeByName("NOZZLE F L"),
    scene.getTransformNodeByName("NOZZLE F R"),
    scene.getTransformNodeByName("NOZZLE R L"),
    scene.getTransformNodeByName("NOZZLE R R"),
  ];
  wheels.forEach((node: BABYLON.Nullable<BABYLON.TransformNode>) => {
    if (node && node.rotationQuaternion) {
      node.rotationQuaternion = null;
      node.rotation = baseWheelRotation;
    }
  });
  const flameMaterial = new BABYLON.StandardMaterial("flame", scene);
  flameMaterial.emissiveColor = new BABYLON.Color3(0.456, 0.188, 0.799);

  flames = [
    scene.getMeshByName("FLAME FL"),
    scene.getMeshByName("FLAME F R"),
    scene.getMeshByName("FLAME R L"),
    scene.getMeshByName("FLAME R R"),
  ];

  flames.forEach((node: BABYLON.Nullable<BABYLON.AbstractMesh>) => {
    if (node && node.material) {
      node.material = flameMaterial;
    }
  });
  
  // wait one second to get the car model in position
  setTimeout(() => (readyToShowModel = true), 1000);
});

window.addEventListener("resize", () => {
  engine.resize();
});
const hideButton = (element: HTMLElement) => element.classList.add("hidden");
const showButton = (element: HTMLElement) => element.classList.remove("hidden");

let hasPlaced = false;
const placeButton =
  document.getElementById("tap-to-place") || document.createElement("div");
const resetButton =
  document.getElementById("reset") || document.createElement("div");

placeButton.addEventListener("click", () => {
  hasPlaced = true;
  hideButton(placeButton);
  showButton(resetButton);
  enableJoystick();
});

resetButton.addEventListener("click", () => {
  hasPlaced = false;
  carMesh.position = new BABYLON.Vector3(0, 0, 0);
  carMesh.rotation = new BABYLON.Vector3(0, 0, 0);
  hideButton(resetButton);
  showButton(placeButton);
  disableJoystick();
});

const leftJoystick = new BABYLON.VirtualJoystick(true);
const rightJoystick = new BABYLON.VirtualJoystick(false);

const enableJoystick = () => {
  if (BABYLON.VirtualJoystick.Canvas) {
    BABYLON.VirtualJoystick.Canvas.style.pointerEvents = "auto";
  }
};

const disableJoystick = () => {
  if (BABYLON.VirtualJoystick.Canvas) {
    BABYLON.VirtualJoystick.Canvas.style.pointerEvents = "none";
  }
};

disableJoystick();

scene.onBeforeRenderObservable.add(() => {
  if (leftJoystick.pressed) {
    deltaX = leftJoystick.deltaPosition.x;
    deltaY = leftJoystick.deltaPosition.y;
  } else if (rightJoystick.pressed) {
    deltaX = rightJoystick.deltaPosition.x;
    deltaY = rightJoystick.deltaPosition.y;
  } else {
    deltaX = 0;
    deltaY = 0;
  }
});

let actualMomentum = new BABYLON.Vector2(0, 0);

engine.runRenderLoop(() => {
  if (readyToShowModel && !carMesh.isEnabled(false)) {
    carMesh.setEnabled(true);
    showButton(placeButton);
  }
  if (scene.isReady()) {
    placeButton.innerHTML = "Tap to place";
  }
  if (!hasPlaced) {
    instantTracker.setAnchorPoseFromCameraOffset(0, 0, -3);
  }
  let targetRotationZ = 0;
  let targetWheelRotationZ = 0;
  let targetRotationX = 0;
  let targetWheelRotationX = 0;

  let targetMomentum = new BABYLON.Vector2(0, 0);

  if (deltaX) {
    targetRotationZ =
      (deltaX - deltaEdge.min) / (deltaEdge.max - deltaEdge.min) +
      deltaEdge.min;
    targetWheelRotationZ =
      targetRotationZ * (rotationEdge.max - rotationEdge.min) -
      rotationEdge.min;
    targetMomentum.y = deltaX * engine.getDeltaTime() * 0.65;
  }

  if (deltaY) {
    targetRotationX =
      (deltaY - deltaEdge.min) / (deltaEdge.max - deltaEdge.min) +
      deltaEdge.min;
    targetWheelRotationX =
      targetRotationX * (rotationEdge.max - rotationEdge.min) -
      rotationEdge.min;
    targetMomentum.x = deltaY * engine.getDeltaTime() * 0.65;
  }

  wheels.forEach(
    (node: BABYLON.Nullable<BABYLON.TransformNode>, idx: number) => {
      if (node) {
        node.rotation = BABYLON.Vector3.Lerp(
          node.rotation,
          new BABYLON.Vector3(
            BABYLON.Tools.ToRadians(targetWheelRotationX * -1 + 180),
            node.rotation.y,
            BABYLON.Tools.ToRadians(
              targetWheelRotationZ * (idx < 2 ? -1 : 1) + 90
            )
          ),
          0.05
        );
      }
    }
  );

  actualMomentum = BABYLON.Vector2.Lerp(
    actualMomentum,
    targetMomentum,
    !deltaX && !deltaY ? 0.03 : 0.02
  );

  carMesh.rotate(
    BABYLON.Axis.Y,
    BABYLON.Tools.ToRadians(actualMomentum.y / 4),
    BABYLON.Space.LOCAL
  );

  if (carModel) {
    carModel.rotation.x = actualMomentum.x / 80;
    carModel.rotation.z = actualMomentum.y / 50;
    const liftRatio = 0.025;
    const flameRatio = 0.1;

    if(deltaX || deltaY){
      carLift.actual = carLift.actual + (carLift.up - carLift.actual) * liftRatio;
      flameScale.actual = flameScale.actual + (flameScale.up - flameScale.actual) * flameRatio;
    }else{
      carLift.actual = carLift.actual + (carLift.down - carLift.actual) * liftRatio;
      flameScale.actual = flameScale.actual + (flameScale.down - flameScale.actual) * flameRatio;
    }
    carModel.position.y = carLift.actual;
    if(flames){
      flames.forEach((flame: BABYLON.Nullable<BABYLON.AbstractMesh>) => {
        if(flame){
          flame.scaling = new BABYLON.Vector3(flameScale.actual + Math.random() * 0.08, 1, 1);
        }
      })
    }
  }

  carMesh.movePOV(0, 0, actualMomentum.x / -500);



  // envMap.update();
  camera.updateFrame();
  scene.render();
});

// scene.debugLayer.show();