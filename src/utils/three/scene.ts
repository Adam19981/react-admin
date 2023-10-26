import * as THREE from "three";
import type { Object3D } from "three/src/Three";

export class ThreeBase {
	scene: THREE.Scene;
	element: HTMLElement;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;

	constructor(element: HTMLElement) {
		this.element = element;
		this.scene = this.initScene();
		this.camera = this.initCamera(this.element);
		this.renderer = this.initRenderer(this.element);
		this.surroundCamera = this.surroundCamera.bind(this)
	}

	private initScene() {
		//初始化场景
		return new THREE.Scene();
	}

	private initCamera(element: HTMLElement) {
		//初始化相机
		const fov = 90	;
		const near = 0.1;
		const far = 10000;
		const aspect = element.offsetWidth / element.offsetHeight;
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 3, 20);
		return camera;
	}

	private initRenderer(element: HTMLElement) {
		//渲染
		const renderer = new THREE.WebGLRenderer();
		renderer.setClearColor("#E6E6E6");
		renderer.setSize(element.offsetWidth, element.offsetHeight);
		element.appendChild(renderer.domElement);
		return renderer;
	}

	add(objects: Object3D | Object3D[]) {
		if (Array.isArray(objects)) {
			this.scene.add(...objects);
			return;
		}
		this.scene.add(objects);
	}

	remove(objects: Object3D | Object3D[]) {
		if (Array.isArray(objects)) {
			this.scene.remove(...objects);
			return;
		}
		this.scene.remove(objects);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
	}

	surroundCamera(){
		requestAnimationFrame(this.surroundCamera)
		const r = Date.now() * 0.0001;
		this.camera.position.x = 20 * Math.cos(r) + this.scene.position.x;
		this.camera.position.z = 20 * Math.sin(r) + this.scene.position.z;
		this.camera.lookAt(this.scene.position)
		this.render()
	}
}
