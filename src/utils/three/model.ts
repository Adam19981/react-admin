import { ThreeBase } from "./scene";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { Group, Object3D } from "three/src/Three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { Mesh, TextureLoader } from "three";

export class ModelLoader {
	private base: ThreeBase;
	private gltfLoader: GLTFLoader;
	private textureLoader: TextureLoader;

	constructor(threeBase: ThreeBase) {
		this.base = threeBase;
		this.gltfLoader = new GLTFLoader();
		this.textureLoader = new TextureLoader();
	}

	initExternalModel(path: string): Promise<GLTF> {
		//倒入外部模型
		return new Promise(resolve => {
			const url = new URL(path, import.meta.url).href;
			this.gltfLoader.load(url, res => {
				// this.setModelSize(res.scene);
				//
				// this.calcMeshCenter(res.scene);
				resolve(res);
			});
		});
	}

	initTextureLoader(path: string): Promise<Mesh> {
		return new Promise(resolve => {
			const url = new URL(path, import.meta.url).href;
			this.textureLoader.load(url, res => {
				const size = 50;
				const img = res.image;
				let height = (img && img.height) || size;
				let width = (img && img.width) || size;
				height = (size / width) * height;

				width = size;
				const material = new THREE.MeshBasicMaterial({
					map: res,
					transparent: true,
					side: THREE.DoubleSide
				});
				const geom = new THREE.PlaneGeometry(width, height);
				const mesh = new THREE.Mesh(geom, material);
				resolve(mesh);
			});
		});
	}

	initMesh() {
		//初始化模型
		const geometry = new THREE.BoxGeometry(50, 50, 50);
		const material = new THREE.MeshBasicMaterial({
			color: 0x000000,
			wireframe: true
		});
		return new THREE.Mesh(geometry, material);
	}

	initGridHelper() {
		return new THREE.GridHelper(this.base.element.offsetWidth, 10, 0xc6c6c6, 0xc6c6c6);
	}

	initOrbitControls() {
		//初始化轨道控制器
		const orbit = new OrbitControls(this.base.camera, this.base.renderer.domElement);
		orbit.update();
		orbit.addEventListener("change", () => {
			this.base.render();
		});

		return orbit;
	}

	initTransformControls() {
		//初始化变换控制器
		return new TransformControls(this.base.camera, this.base.renderer.domElement);
	}

	initDragControls(objects: Object3D[]) {
		//拖拽控制器
		return new DragControls(objects, this.base.camera, this.base.renderer.domElement);
	}

	initLight() {
		const LIGHT_LIST = [
			[100, 100, 100],
			[-100, 100, 100],
			[100, -100, 100],
			[100, 100, -100]
		];
		LIGHT_LIST.forEach(([x, y, z]) => {
			const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
			directionalLight.position.set(x, y, z);
			this.base.scene.add(directionalLight);
		});
	}

	calcMeshCenter(group: Group) {
		//模型居中 y轴为0
		const box3 = new THREE.Box3();

		box3.expandByObject(group);

		const center = new THREE.Vector3(0, 0, 0);

		box3.getCenter(center);

		group.position.x = group.position.x - center.x;

		group.position.y = 0;

		group.position.z = group.position.z - center.z;
	}

	setModelSize(group: Group) {
		//模型大小自适应
		const box3 = new THREE.Box3().setFromObject(group);

		const x = box3.max.x - box3.min.x;
		const y = box3.max.y - box3.min.y;
		const z = box3.max.z - box3.min.z;

		const maxDim = Math.max(x, y, z);
		const scale = this.base.element.offsetWidth / maxDim;

		group.scale.set(scale, scale, scale);
	}
}
