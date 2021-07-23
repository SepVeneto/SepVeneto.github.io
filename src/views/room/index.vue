<template>
  <section ref="sectionDom" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import * as Three from 'three';
import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'dat.gui';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Event } from 'three';

import { Character, AllActions, BaseActions, AdditiveActions } from './Character';

const keyMap: Record<number, string> = Object.freeze({
  87: 'w',
  65: 'a',
  83: 's',
  68: 'd',
});

export default defineComponent({
  setup () {
    let renderer: THREE.WebGLRenderer;
    let clock: THREE.Clock;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let stats: Stats;
    let panelSettings: Record<string, unknown>;
    let character: Character;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const crossFadeControls: any[] = []

    const sectionDom = ref<HTMLElement | null>(null);


    async function init() {
      const container = sectionDom.value;
      clock = new THREE.Clock();

      scene = new THREE.Scene();
      scene.background = new THREE.Color( 0xa0a0a0 );
      scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
      hemiLight.position.set( 0, 20, 0 );
      scene.add( hemiLight );

      const dirLight = new THREE.DirectionalLight( 0xffffff );
      dirLight.position.set( 3, 10, 10 );
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 2;
      dirLight.shadow.camera.bottom = - 2;
      dirLight.shadow.camera.left = - 2;
      dirLight.shadow.camera.right = 2;
      dirLight.shadow.camera.near = 0.1;
      dirLight.shadow.camera.far = 40;
      scene.add( dirLight );

      // ground

      const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
      mesh.rotation.x = - Math.PI / 2;
      mesh.receiveShadow = true;
      scene.add( mesh );
      
      const gltf = await loadModel('/static/Xbot.glb');
      character = new Character(gltf);
      character.bindToScene(scene);
      // character.generateActions();

      const temp = new Character(await loadModel('/static/Xbot.glb'));
      temp.bindToScene(scene);

      renderer = new Three.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.outputEncoding = Three.sRGBEncoding;
      renderer.shadowMap.enabled = true;
      container?.appendChild(renderer.domElement);

      camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
      camera.position.set(-1, 2, 3);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.target.set(0, 1, 0);
      controls.update();

      stats = Stats();
      container?.appendChild(stats.dom);

      createPanel();
      animate();

      window.addEventListener('resize', onWindowResize);
      window.addEventListener('keydown', onKeydown);
      window.addEventListener('keyup', onKeyup);
    }

    function loadModel(path: string):Promise<GLTF>  {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(path, (gltf) => {
          resolve(gltf);
        }, (process) => {
          console.log(process);
        }, (err) => {
          reject(err);
        })
      })
    }

    function onKeyup(event: Event) {
      keyOperate(event.keyCode, 'up');
    }

    function onKeydown(event: Event) {
      keyOperate(event.keyCode, 'down');
    }

    function keyOperate(code: number, action: 'down' | 'up') {
      const key = keyMap[code];
      switch (key) {
        case 'w':
          if (action === 'down') {
            character.currentBaseAction = 'walk';
            character.model.position.z += 0.05;
          } else if (action === 'up') {
            character.currentBaseAction = 'idle';
          }
          break;
        case 'a':
          if (action === 'down') {
            character.currentBaseAction = 'walk';
            character.model.position.x = 0.05;
          } else if (action === 'up') {
            character.currentBaseAction = 'idle';
          }
          break;
        case 's':
          if (action === 'down') {
            character.currentBaseAction = 'walk';
            character.model.position.z -= 0.05;
          } else if (action === 'up') {
            character.currentBaseAction = 'idle';
          }
          break;
        case 'd':
          if (action === 'down') {
            character.currentBaseAction = 'walk';
            character.model.position.x -= 0.05;
          } else if (action === 'up') {
            character.currentBaseAction = 'idle';
          }
          break;
      }
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function createPanel() {
      const panel = new GUI({ width: 310 });

      const folder1 = panel.addFolder('Base Actions');
      const folder2 = panel.addFolder('Additive Action Weights');
      const folder3 = panel.addFolder('General Speed');
      panelSettings = {
        'modify time scale': 1.0
      }

      const baseNames = ['None', ...Object.keys(character.getBaseActions())];

      for (let i = 0, l = baseNames.length; i !== l; ++i ) {
        const name = baseNames[i];
        const settings = character.getActionSetting(name as AllActions);
        panelSettings[name] = function() {
          const currentSettings = character.getActionSetting();
          const currentAction = currentSettings.action || null;
          console.log(name)
          const action = settings?.action || null;

          prepareCrossFade(currentAction, action, 0.35);
        }

        crossFadeControls.push(folder1.add(panelSettings, name));
      }

      Object.keys(character.getAdditiveActions()).forEach(name => {
        const settings = character.getAdditiveActions()[name as AdditiveActions];

        panelSettings[name] = settings.weight;
        folder2.add(panelSettings, name, 0, 1, 0.01).listen().onChange((weight: number) => {
          character.setWeight(settings.action as THREE.AnimationAction, weight);
          settings.weight = weight;
        });
      });

      folder3.add(panelSettings, 'modify time scale', 0, 1.5, 0.01).onChange(modifyTimeScale)

      folder1.open();
      folder2.open();
      folder3.open();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      crossFadeControls.forEach((control: any) => {
        control.classList1 = control.domElement.parentElement.classList;
        control.classList2 = control.domElement.previousElementSibling.classList;

        control.setInactive = () => {
          control.classList2.add('control-inactive');
        }
        control.setActive = () => {
          control.classList2.remove('control-inactive');
        }

        const settings = character.getBaseActions()[control.property as BaseActions];
        if (!settings || !settings.weight) {
          control.setInactive();
        }
      })
      character.setControls(crossFadeControls)
    }

    function prepareCrossFade(
      startAction: THREE.AnimationAction | null,
      endAction: THREE.AnimationAction | null,
      duration: number
    ): void {
      if (character.currentBaseAction === 'idle' || !startAction || !endAction) {
        character.executeCrossFade(startAction, endAction, duration);
      } else {
        character.synchronizeCrossFade(startAction, endAction, duration);
      }

      if (endAction) {
        const clip = endAction.getClip();
        character.currentBaseAction = clip.name as AllActions
      } else {
        character.currentBaseAction = 'idle';
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      crossFadeControls.forEach((control: any) => {
        const name = control.property;
        if (name === character.currentBaseAction) {
          control.setActive();
        } else {
          control.setInactive();
        }
      })
    }

    function modifyTimeScale(speed: number) {
      character.getMixer().timeScale = speed
    }

    function animate() {
      requestAnimationFrame(animate);
      character.upateWeight();

      character.animate(clock.getDelta());

      stats.update();

      renderer.render(scene, camera);

    }

    onMounted(() => {
      init();
    })
    return {
      sectionDom,
    }
  },
})
</script>

<style>
a {
  color: blue;
}
.control-inactive {
  color: #888;
}
</style>

