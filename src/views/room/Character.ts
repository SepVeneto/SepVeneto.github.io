import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

type Action = {
  weight: number,
  action?: THREE.AnimationAction,
}

export type BaseActions = 'idle' | 'walk' | 'run';
export type AdditiveActions = 'sneak_pose' | 'sad_pose' | 'agree' | 'headShake';
export type AllActions = BaseActions | AdditiveActions;

export class Character {
  public currentBaseAction: AllActions;
  private model: THREE.Group;
  private skeleton: THREE.SkeletonHelper;
  private mixer: THREE.AnimationMixer;
  private gltf: GLTF;
  private baseActions: Record<BaseActions, Action>;
  private additiveActions: Record<AdditiveActions, Action>;
  private allActions: THREE.AnimationAction[];
  constructor(gltf: GLTF) {
    this.currentBaseAction = 'idle';
    this.gltf = gltf;
    this.model = gltf.scene;

    this.skeleton = new THREE.SkeletonHelper(this.model);
    this.skeleton.visible = false;

    this.mixer = new THREE.AnimationMixer(this.model);
    this.baseActions = {
      idle: { weight: 1 },
      walk: { weight: 0 },
      run: { weight: 0 },
    }
    this.additiveActions = {
      sneak_pose: { weight: 0 },
      sad_pose: { weight: 0 },
      agree: { weight: 0 },
      headShake: { weight: 0 },
    }
    this.allActions = [];
    this.setShadow();
    this.generateActions();
  }
  setShadow(): void {
    this.model.traverse(object => {
      if ( (object as THREE.Object3D & THREE.SkinnedMesh).isMesh ) object.castShadow = true;
    })
  }
  bindToScene(scene: THREE.Scene): void {
    scene.add(this.model);
    scene.add(this.skeleton);
  }
  generateActions(): void {
    const animations = this.gltf.animations;
    animations.forEach(item=> {
      let clip = item
      const name = clip.name;
      if (this.baseActions[name as BaseActions]) {
        const action = this.mixer.clipAction(clip);
        this.baseActions[name as BaseActions].action = action;
        this.activateAction(action);
        this.allActions.push(action);
      } else if (this.additiveActions[name as AdditiveActions]) {
        THREE.AnimationUtils.makeClipAdditive(clip);

        if (clip.name.endsWith('_pose')) {
          clip = THREE.AnimationUtils.subclip(clip, clip.name, 2, 3, 30);
        }

        const action = this.mixer.clipAction(clip);
        this.additiveActions[name as AdditiveActions].action = action;
        this.activateAction(action);
        this.allActions.push(action);
      }
    })
  }
  activateAction(action: THREE.AnimationAction): void {
    const clip = action.getClip();
    const settings = this.baseActions[clip.name as BaseActions] || this.additiveActions[clip.name as AdditiveActions];
    this.setWeight(action, settings.weight);
    action.play();
  }
  setWeight(action: THREE.AnimationAction, weight: number): void {
    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );
  }
  upateWeight(): void {
    this.allActions.forEach(action => {
      const clip = action.getClip();
      const name = clip.name;
      const setting = this.baseActions[name as BaseActions] || this.additiveActions[name as AdditiveActions];
      setting.weight = action.getEffectiveWeight();
    })
  }
  animate(clock: number): void {
    this.mixer.update(clock);
  }
  executeCrossFade(
    startAction: THREE.AnimationAction | null,
    endAction: THREE.AnimationAction | null,
    duration: number
  ): void {
    if (endAction) {
      this.setWeight(endAction, 1);
      endAction.time = 0;
      if (startAction) {
        startAction.crossFadeTo(endAction, duration, true);
      } else {
        endAction.fadeIn(duration);
      }
    } else {
      startAction?.fadeOut(duration);
    }
  }
  synchronizeCrossFade(
    startAction: THREE.AnimationAction,
    endAction: THREE.AnimationAction,
    duration: number,
  ): void {
    const onLoopFinished = (event: THREE.Event) => {
      if (event.action === startAction) {
        this.mixer.removeEventListener('loop', onLoopFinished);
        this.executeCrossFade(startAction, endAction, duration);
      }
    }
    this.mixer.addEventListener('loop', onLoopFinished)
  }
  getMixer(): THREE.AnimationMixer {
    return this.mixer;
  }
  getBaseActions(): Record<BaseActions, Action> {
    return this.baseActions;
  }
  getActionSetting(actionName?: AllActions): Action {
    const name = actionName || this.currentBaseAction;
    return this.baseActions[name as BaseActions] || this.additiveActions[name as AdditiveActions];
  }
  getAdditiveActions(): Record<AdditiveActions, Action> {
    return this.additiveActions;
  }
}