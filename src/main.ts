import * as THREE from 'three';
import './style.css';

type Mode = 'menu' | 'playing' | 'paused';
type Act = 'forward'|'back'|'left'|'right'|'sprint'|'jump'|'interact'|'fire'|'brake';
const app = document.querySelector<HTMLDivElement>('#app')!;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bbfc4);
scene.fog = new THREE.FogExp2(0x9bbfc4, 0.0042);
const camera = new THREE.PerspectiveCamera(66, innerWidth/innerHeight, 0.1, 700);
const renderer = new THREE.WebGLRenderer({antialias: true, powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
app.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xc4e8ff, 0x65584d, 2.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe4bd, 3.0); sun.position.set(-45,85,20); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); sun.shadow.camera.left=-95;sun.shadow.camera.right=95;sun.shadow.camera.top=95;sun.shadow.camera.bottom=-95; scene.add(sun);
const mat=(color:number,roughness=0.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const grass=mat(0x6e876d), sidewalk=mat(0xb3b2a4), asphalt=mat(0x343e43,0.95), lineMat=mat(0xe6ddbd), curbMat=mat(0xddd3bc), palmMat=mat(0x79563d), leafMat=mat(0x327c69), glass=mat(0x456772,0.3,0.3), windowLight=mat(0xcdd8c3,0.3), trunkMat=mat(0x6c4730), sandMat=mat(0xd3bf95), waterMat=new THREE.MeshStandardMaterial({color:0x318c9d,roughness:0.24,metalness:0.18});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(650,650), grass); ground.rotation.x=-Math.PI/2;ground.position.y=-0.12;ground.receiveShadow=true;scene.add(ground);
const water = new THREE.Mesh(new THREE.PlaneGeometry(300,300),waterMat); water.rotation.x=-Math.PI/2;water.position.set(176,-0.17,10);scene.add(water);
const beach=new THREE.Mesh(new THREE.PlaneGeometry(30,280),sandMat); beach.rotation.x=-Math.PI/2;beach.position.set(20,-0.06,15);scene.add(beach);

function box(parent:THREE.Object3D, size:[number,number,number], material:THREE.Material, pos:[number,number,number], cast=true, receive=true){
 const m=new THREE.Mesh(new THREE.BoxGeometry(...size),material);m.position.set(...pos);m.castShadow=cast;m.receiveShadow=receive;parent.add(m);return m;
}
const city=new THREE.Group();scene.add(city);
function building(x:number,z:number,w:number,d:number,h:number,seed:number){
 const palette=[0xc5b8a1,0xa5b3b4,0x857f7a,0xd0c1a5,0x899da0,0x9b8a7c,0xe0d3b4,0x6d858d,0xc7c3b4,0x99877d];
 const wall=mat(palette[seed%palette.length],0.87), trim=mat(seed%3===0?0x334951:0xddd1b6), roofMat=mat(0x55595a);
 const g=new THREE.Group();g.position.set(x,0,z);city.add(g);
 box(g,[w,h,d],wall,[0,h/2,0]); box(g,[w+0.25,0.45,d+0.25],trim,[0,h-0.18,0]);
 box(g,[w+0.35,0.22,d+0.35],roofMat,[0,h+0.07,0]);
 // Recessed-looking dark window bays, spaced by facade module
 const floors=Math.max(1,Math.floor((h-1.5)/2.5)), cols=Math.max(1,Math.floor(w/2.6));
 const dark=mat(0x233d4a,0.32,0.22), balcony=mat(0x7d8a89,0.65);
 for(let f=0;f<floors;f++)for(let c=0;c<cols;c++){
  const wx=-w/2+(c+0.5)*w/cols, wy=1.15+f*2.5;
  if(wy>h-1)continue;
  box(g,[Math.min(1.3,w/cols*0.56),1.15,0.035],dark,[wx,wy,d/2+0.018],false,false);
  box(g,[Math.min(1.4,w/cols*0.6),0.075,0.10],balcony,[wx,wy-0.62,d/2+0.04],false,false);
  if(seed%4===0)box(g,[Math.min(1.3,w/cols*0.56),0.04,0.04],trim,[wx,wy,d/2+0.055],false,false);
 }
 // Side windows
 for(let f=0;f<floors;f++)for(let c=0;c<Math.max(1,Math.floor(d/3));c++){
  const wz=-d/2+(c+0.5)*d/Math.max(1,Math.floor(d/3));
  if(f%2===0)box(g,[0.035,1.05,Math.min(1.4,d/4) ],dark,[w/2+0.02,1.2+f*2.5,wz],false,false);
 }
 if(h>16){box(g,[w*0.65,0.15,d*0.65],trim,[0,h+0.22,0]); if(seed%2===0)box(g,[w*.36, Math.min(h*.32,13),d*.38],wall,[0,h+5,0]);}
 // Shop awnings at street level
 if(seed%3===0){box(g,[w*.8,.16,1.0],mat([0xd78f6d,0x4b8c88,0xb5a16a][seed%3]),[0,2.7,d/2+.55],false,false);box(g,[w*.72,1.8,.04],dark,[0,1.3,d/2+.035],false,false);}
}
function palm(x:number,z:number,scale=1){
 const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);city.add(g);
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22,.38,5.8,8),trunkMat);trunk.position.y=2.9;trunk.castShadow=true;g.add(trunk);
 for(let i=0;i<8;i++){const angle=i*Math.PI/4;const leaf=new THREE.Mesh(new THREE.ConeGeometry(.25,4.6,5),leafMat);leaf.position.set(Math.cos(angle)*1.55,5.65+Math.sin(i*3)*.2,Math.sin(angle)*1.55);leaf.rotation.z=-Math.cos(angle)*.75;leaf.rotation.x=Math.sin(angle)*.75;leaf.rotation.y=angle;leaf.castShadow=true;g.add(leaf);}
}
function road(x:number,z:number,w:number,d:number){
 const r=new THREE.Mesh(new THREE.PlaneGeometry(w,d),asphalt);r.rotation.x=-Math.PI/2;r.position.set(x,0.015,z);r.receiveShadow=true;city.add(r);
 // lane dividers
 if(w>d){for(let ix=-w/2+3;ix<w/2-2;ix+=8)box(city,[3,.018,.12],lineMat,[x+ix,.035,z],false,false);}
 else{for(let iz=-d/2+3;iz<d/2-2;iz+=8)box(city,[.12,.018,3],lineMat,[x,.035,z+iz],false,false);}
 box(city,[w,d>.0?.13:.13,.35],curbMat,[x,.06,z+d/2+.28],false,false);
 box(city,[w,.13,.35],curbMat,[x,.06,z-d/2-.28],false,false);
}
const roads:number[]=[-90,-45,0,45,90];
for(const r of roads){road(0,r,260,13);road(r,0,13,260);}
for(let ix=-2;ix<=2;ix++)for(let iz=-2;iz<=2;iz++){
 const x=ix*45,z=iz*45;
 if(Math.abs(x)<0.1&&Math.abs(z)<0.1)continue;
 // city lots, with varied footprints and occasional plazas
 if((ix+iz)%5===0){const park=new THREE.Mesh(new THREE.PlaneGeometry(24,24),mat(0x80936d));park.rotation.x=-Math.PI/2;park.position.set(x+21,-.025,z+20);city.add(park);for(let j=0;j<5;j++)palm(x+12+(j%3)*7,z+12+Math.floor(j/3)*12,.8);continue;}
 const seed=Math.abs((ix+4)*31+(iz+4)*17);
 const w=13+(seed%3)*3,d=14+((seed*7)%3)*3,h=8+((seed*11)%6)*4+(seed%4===0?13:0);
 building(x+21,z+20,w,d,h,seed);
 if(seed%2===0)building(x+8,z+20,9,13,7+(seed%3)*2,seed+4);
 for(let p=0;p<2;p++)palm(x+12+p*16,z+7+(p%2)*2,.68+((seed+p)%3)*.1);
}
for(let i=0;i<22;i++){palm(8+Math.random()*26,-122+i*11,.78+Math.random()*.35);}
for(let i=0;i<12;i++){palm(3+i*2.5,123,.9);}

// Asphalt-adjacent sidewalk strips, crosswalks and street lamps
for(const x of roads)for(const z of roads){
 for(let i=-2;i<=2;i++){
  box(city,[.8,.06,.1],lineMat,[x+i*.95,.07,z+4.6],false,false);
  box(city,[.1,.06,.8],lineMat,[x+4.6,.07,z+i*.95],false,false);
 }
}
function streetLamp(x:number,z:number){
 const g=new THREE.Group();g.position.set(x,0,z);city.add(g);
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.07,.11,5,7),mat(0x485459));pole.position.y=2.5;g.add(pole);
 box(g,[.12,.12,1.4],mat(0x485459),[0,4.95,.45],false,false);
 const light=new THREE.Mesh(new THREE.BoxGeometry(.48,.14,.35),new THREE.MeshStandardMaterial({color:0xffe7b2,emissive:0x6b4d23,emissiveIntensity:.55}));light.position.set(0,4.9,1);g.add(light);
}
for(let i=-2;i<=2;i++)for(let z=-2;z<=2;z++){streetLamp(i*45+8,z*45+8);}

// Player is an original stylized but proportioned humanoid assembled with tapered limbs.
const player=new THREE.Group();scene.add(player);
const skin=mat(0xb97c59),shirt=mat(0x243d49),pants=mat(0x242e38),shoe=mat(0xe0d7c5),hair=mat(0x2d2927);
function capsule(parent:THREE.Object3D,r:number,len:number,material:THREE.Material,pos:[number,number,number],rot:[number,number,number]=[0,0,0]){
 const m=new THREE.Mesh(new THREE.CapsuleGeometry(r,len,4,8),material);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;parent.add(m);return m;
}
const body=new THREE.Group();player.add(body);
capsule(body,.35,.58,shirt,[0,1.36,0]);
const torso=new THREE.Mesh(new THREE.CylinderGeometry(.24,.34,.62,10),shirt);torso.position.y=1.36;torso.castShadow=true;body.add(torso);
const head=new THREE.Mesh(new THREE.SphereGeometry(.23,16,12),skin);head.position.set(0,1.92,-.015);head.castShadow=true;body.add(head);
const haircap=new THREE.Mesh(new THREE.SphereGeometry(.235,14,8,0,Math.PI*2,0,Math.PI*.48),hair);haircap.position.copy(head.position);haircap.position.y+=.045;body.add(haircap);
const legL=new THREE.Group(),legR=new THREE.Group();legL.position.set(-.17,.96,0);legR.position.set(.17,.96,0);body.add(legL,legR);
capsule(legL,.13,.53,pants,[0,-.28,0]);capsule(legR,.13,.53,pants,[0,-.28,0]);
box(legL,[.24,.12,.38],shoe,[0,-.57,-.08]);box(legR,[.24,.12,.38],shoe,[0,-.57,-.08]);
const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-.38,1.61,0);armR.position.set(.38,1.61,0);body.add(armL,armR);
capsule(armL,.115,.52,shirt,[0,-.25,0],[0,0,-.15]);capsule(armR,.115,.52,shirt,[0,-.25,0],[0,0,.15]);
capsule(armL,.095,.25,skin,[0,-.59,0]);capsule(armR,.095,.25,skin,[0,-.59,0]);
player.position.set(0,0,7);

const vehicle=new THREE.Group();scene.add(vehicle);
const carPaint=new THREE.MeshStandardMaterial({color:0xc75a45,roughness:.34,metalness:.35});
box(vehicle,[2.2,.65,4.2],carPaint,[0,.65,0]);
box(vehicle,[1.65,.7,2.05],mat(0x364b55,.28,.25),[0,1.24,-.12]);
box(vehicle,[1.45,.45,1.3],mat(0x9eb3b9,.2,.2),[0,1.34,.3]);
const windshield=mat(0x263c47,.22,.22);
box(vehicle,[1.55,.48,.08],windshield,[0,1.34,-.85]);box(vehicle,[1.5,.44,.08],windshield,[0,1.31,.82]);
const wheels:THREE.Mesh[]=[];
for(const x of [-1.05,1.05])for(const z of [-1.35,1.35]){
 const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.22,16),mat(0x171d20));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.38,z);wheel.castShadow=true;vehicle.add(wheel);wheels.push(wheel);
 const hub=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.225,12),mat(0x969a96,.35,.75));hub.rotation.z=Math.PI/2;hub.position.set(x*1.005,.38,z);vehicle.add(hub);
}
for(const x of [-.72,.72]){
 box(vehicle,[.34,.18,.06],mat(0xffdf9c,.25),[x,.72,-2.12],false,false);
 box(vehicle,[.34,.18,.06],mat(0xd64136,.25),[x,.72,2.12],false,false);
}
vehicle.position.set(3,0,4);vehicle.rotation.y=Math.PI;

// Character/NPC setup
type Ped={g:THREE.Group;dir:THREE.Vector3;speed:number;phase:number;health:number;flee:number;home:THREE.Vector3};
const peds:Ped[]=[];
const pedMats=[mat(0x4f7b75),mat(0xb88d62),mat(0x8f7086),mat(0xd1b46e),mat(0x52719b),mat(0x9d6a52)];
function spawnPed(x:number,z:number,i:number){
 const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);
 capsule(g,.22,.42,pedMats[i%pedMats.length],[0,1.28,0]);
 const h=new THREE.Mesh(new THREE.SphereGeometry(.16,12,10),skin);h.position.y=1.7;g.add(h);
 const l1=capsule(g,.085,.3,pants,[ -.1,.67,0]),l2=capsule(g,.085,.3,pants,[.1,.67,0]);
 peds.push({g,dir:new THREE.Vector3(Math.sin(i*2.1),0,Math.cos(i*1.3)).normalize(),speed:.6+(i%4)*.12,phase:i,health:100,flee:0,home:g.position.clone()});
}
for(let i=0;i<24;i++){const z=-100+(i*19)%205;const x=(i%2?1:-1)*(9+(i*7)%20);spawnPed(x,z,i);}

// Traffic cars
type Traffic={g:THREE.Group;speed:number;axis:'x'|'z';sign:number;phase:number};
const traffic:Traffic[]=[];
const trafficColors=[0x478d91,0xd6c5a1,0x464f64,0xd8a557,0x8b9d9b];
for(let i=0;i<8;i++){
 const g=new THREE.Group();scene.add(g);const cmat=mat(trafficColors[i%trafficColors.length],.45,.25);
 box(g,[1.8,.58,3.5],cmat,[0,.55,0]);box(g,[1.3,.55,1.7],glass,[0,1,0]);
 for(const x of [-.82,.82])for(const z of [-1.1,1.1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.29,.29,.15,12),mat(0x171b1c));w.rotation.z=Math.PI/2;w.position.set(x,.28,z);g.add(w);}
 const axis=i%2?'x':'z', sign=i%4<2?1:-1;g.position.set(axis==='x'?-115+i*12:(i%2?4:-4),0,axis==='z'?-115+i*14:(i%2?4:-4));if(axis==='x'&&sign<0)g.rotation.y=Math.PI; if(axis==='z')g.rotation.y=sign>0?Math.PI/2:-Math.PI/2;
 traffic.push({g,speed:4.5+i%3,axis,sign,phase:i});
}

const keys=new Set<string>();const acts=new Set<Act>();let mode:Mode='menu';let driving=false,health=100,armor=50,money=1250,wanted=0,ammo=36,mag=12,weapon='SIDEARM',shootCooldown=0,missionStage=0,missionActive=false,missionDone=false, toastTime=0,clock=0,dayTime=.27, speedCar=0, velocity=new THREE.Vector3(),jumpV=0,onGround=true,fireHeld=false,dead=false;
const saveKey='coastal-outlaws-save-v1';
function toast(s:string){const e=document.querySelector<HTMLDivElement>('#toast');if(e){e.textContent=s;e.classList.add('show');toastTime=2.5;}}
function save(){
 try{localStorage.setItem(saveKey,JSON.stringify({v:1,money,health,armor,ammo,mag,missionStage,missionDone,dayTime,position:player.position.toArray(),vehicle:vehicle.position.toArray(),settings:{quality:settings.quality,music:settings.music}}));toast('GAME SAVED');}
 catch{toast('SAVE UNAVAILABLE — STORAGE IS DISABLED');}
}
const settings={quality:'balanced',music:false};
function restore(){
 try{const raw=localStorage.getItem(saveKey);if(!raw)return false;const s=JSON.parse(raw);if(s.v!==1)return false;
 money=Number.isFinite(s.money)?s.money:money;health=Number.isFinite(s.health)?s.health:health;armor=Number.isFinite(s.armor)?s.armor:armor;ammo=Number.isFinite(s.ammo)?s.ammo:ammo;mag=Number.isFinite(s.mag)?s.mag:mag;missionStage=s.missionStage||0;missionDone=!!s.missionDone;dayTime=s.dayTime||.27;
 if(Array.isArray(s.position)&&s.position.length===3)player.position.fromArray(s.position);
 if(Array.isArray(s.vehicle)&&s.vehicle.length===3)vehicle.position.fromArray(s.vehicle);
 return true;
 }catch{return false;}
}

const overlay=document.createElement('div');overlay.id='overlay';app.appendChild(overlay);
overlay.innerHTML=`
 <div class="topbar ui"><div class="brand"><div class="brand-mark">COASTAL OUTLAWS<small>AN OPEN-WORLD EXPERIMENT</small></div></div><div class="top-right"><div class="chip">DISTRICT <b>01 / COAST</b></div><button class="help ui" id="pause-top">Ⅱ &nbsp; MENU</button></div></div>
 <div class="hud hidden" id="hud"><div class="objective"><small id="objective-label">CURRENT OBJECTIVE</small><div id="objective-text">Explore the city. Find your own way.</div></div><div class="stats"><div class="stat-row"><span>VITALS</span><span id="health-num">100 / 100</span></div><div class="bar"><span id="health-bar"></span></div><div class="stat-row"><span>ARMOR</span><span id="armor-num">50 / 50</span></div><div class="bar armor"><span id="armor-bar"></span></div><div class="money"><small>CASH</small><span id="money">$1,250</span></div></div><div class="right-hud"><div class="wanted" id="wanted">WANTED &nbsp; <span>◇ ◇ ◇ ◇ ◇</span></div><div class="speedbox" id="speedbox">ON FOOT<div class="speed">— <small>KM/H</small></div></div></div><div class="crosshair hidden" id="crosshair"></div><div class="toast" id="toast"></div><div class="hint" id="hint">PRESS <b>W A S D</b> TO MOVE &nbsp; · &nbsp; <b>E</b> INTERACT &nbsp; · &nbsp; <b>F</b> DRIVE</div></div>
 <div class="panel" id="main-menu"><div class="menu-card"><div class="eyebrow">A NEW COASTLINE AWAITS</div><h1>MAKE<br>YOUR <em>MARK.</em></h1><div class="intro-copy">A city of sun-bleached streets, restless engines, and second chances. Explore freely, take the wheel, and write your own story in this original browser-based sandbox.</div><div class="menu-actions"><button class="primary" id="new-game">ENTER THE CITY <span>↗</span></button><button class="secondary" id="continue-game">CONTINUE JOURNEY <span>→</span></button><button class="secondary" id="settings-btn">SETTINGS <span>＋</span></button><button class="secondary" id="controls-btn">FIELD GUIDE <span>⌘</span></button></div><div class="menu-foot">INDEPENDENT GAME STUDY &nbsp; / &nbsp; CREDIT <strong>@SuryaPrabhas</strong><br>WEBGL · SINGLE PLAYER · AUTOSAVE ENABLED</div></div></div>
 <div class="modal hidden" id="pause-modal"><div class="modal-card"><div class="eyebrow">TAKE A BREATHER</div><h2>PAUSED</h2><p>The city will be waiting. Progress is stored locally on this browser.</p><div class="modal-buttons"><button class="primary" id="resume-btn">RESUME <span>▶</span></button><button class="secondary" id="save-btn">SAVE GAME</button></div><div class="modal-buttons"><button class="secondary" id="pause-settings">SETTINGS</button><button class="secondary" id="quit-btn">MAIN MENU</button></div></div></div>
 <div class="modal hidden" id="settings-modal"><div class="modal-card"><div class="eyebrow">TUNE YOUR EXPERIENCE</div><h2>SETTINGS</h2><p>Changes apply immediately where supported.</p><label class="setting-row">RENDER QUALITY <select id="quality"><option value="performance">Performance</option><option value="balanced" selected>Balanced</option><option value="high">High</option></select></label><label class="setting-row">SHOW TOUCH CONTROLS <input id="touch-option" type="checkbox" checked></label><label class="setting-row">CAMERA SENSITIVITY <input id="sensitivity" type="range" min=".4" max="2" value="1" step=".1"></label><label class="setting-row">REDUCED MOTION <input id="motion-option" type="checkbox"></label><div class="modal-buttons"><button class="primary" id="settings-back">DONE <span>✓</span></button><button class="secondary" id="reset-save">RESET SAVE</button></div></div></div>
 <div class="modal hidden" id="controls-modal"><div class="modal-card"><div class="eyebrow">FIELD GUIDE</div><h2>CONTROLS</h2><p><b>W A S D</b> — Move / steer<br><b>SHIFT</b> — Sprint · <b>SPACE</b> — Jump / handbrake<br><b>E</b> — Interact / enter or exit vehicle<br><b>F</b> — Start mission / context action<br><b>Mouse</b> — Look around · <b>Left click</b> — Fire<br><b>R</b> — Reload · <b>1</b> — Sidearm · <b>M</b> — Save<br><b>ESC</b> — Pause · <b>G</b> — Switch camera distance<br><br>On touch devices, use the virtual stick and action buttons. This build is a playable early slice: some city systems are simplified and not every activity is implemented yet.</p><div class="modal-buttons"><button class="primary" id="guide-back">GOT IT <span>✓</span></button></div></div></div>
 <div class="mobile-controls" id="mobile-controls"><div class="stick" id="stick"><div class="stick-knob" id="stick-knob"></div></div><div class="mobile-top"><button id="touch-interact">INTERACT</button><button id="touch-pause">PAUSE</button></div><div class="mobile-buttons"><button id="touch-jump">JUMP</button><button id="touch-enter">ENTER</button><button id="touch-fire">FIRE</button><button class="big" id="touch-sprint">RUN / GAS</button></div></div>`;
const el=<T extends HTMLElement>(id:string)=>overlay.querySelector<T>('#'+id)!;
const hide=(id:string)=>el(id).classList.add('hidden'),show=(id:string)=>el(id).classList.remove('hidden');
function setMode(next:Mode){
 mode=next;
 if(next==='menu'){show('main-menu');hide('hud');hide('pause-modal');}
 if(next==='playing'){hide('main-menu');hide('pause-modal');hide('settings-modal');hide('controls-modal');show('hud');}
 if(next==='paused'){show('pause-modal');}
 document.exitPointerLock?.();
}
function freshGame(){
 player.position.set(0,0,7);player.rotation.y=0;vehicle.position.set(4,0,3);vehicle.rotation.y=Math.PI;
 health=100;armor=50;money=1250;wanted=0;ammo=36;mag=12;driving=false;speedCar=0;missionStage=0;missionActive=false;missionDone=false;dead=false;
 peds.forEach((p,i)=>{p.g.position.copy(p.home);p.health=100;p.flee=0;});
 setMode('playing');toast('WELCOME TO THE COAST. TAKE A LOOK AROUND.');refreshHUD();
}
function continueGame(){const ok=restore();setMode('playing');toast(ok?'JOURNEY RESTORED. PICK UP WHERE YOU LEFT OFF.':'NO SAVE FOUND — STARTING A NEW JOURNEY.');if(!ok)freshGame();refreshHUD();}
el('new-game').addEventListener('click',freshGame);el('continue-game').addEventListener('click',continueGame);
el('pause-top').addEventListener('click',()=>{if(mode==='playing'){setMode('paused')}else if(mode==='paused')setMode('playing')});
el('resume-btn').addEventListener('click',()=>setMode('playing'));
el('save-btn').addEventListener('click',save);
el('quit-btn').addEventListener('click',()=>{save();setMode('menu')});
el('settings-btn').addEventListener('click',()=>show('settings-modal'));
el('pause-settings').addEventListener('click',()=>show('settings-modal'));
el('controls-btn').addEventListener('click',()=>show('controls-modal'));
el('settings-back').addEventListener('click',()=>hide('settings-modal'));
el('guide-back').addEventListener('click',()=>hide('controls-modal'));
el('reset-save').addEventListener('click',()=>{if(confirm('Delete the local save for this game?')){localStorage.removeItem(saveKey);toast('LOCAL SAVE CLEARED');}});
el<HTMLSelectElement>('quality').addEventListener('change',e=>{settings.quality=(e.target as HTMLSelectElement).value;applyQuality();});
el<HTMLInputElement>('sensitivity').addEventListener('input',e=>cameraSensitivity=Number((e.target as HTMLInputElement).value));
el<HTMLInputElement>('touch-option').addEventListener('change',e=>el('mobile-controls').classList.toggle('hidden',!(e.target as HTMLInputElement).checked));
let cameraSensitivity=1;let cameraDistance=7.6;let cameraYaw=0;let cameraPitch=.24;let pointerDown=false,lastX=0,lastY=0;
function applyQuality(){
 const q=settings.quality;renderer.setPixelRatio(Math.min(devicePixelRatio,q==='performance'?1:q==='high'?2:1.5));
 sun.castShadow=q!=='performance';sun.shadow.mapSize.set(q==='high'?2048:1024,q==='high'?2048:1024);
 scene.fog!.density=q==='performance'?.0055:q==='high'?.0033:.0042;
 renderer.setSize(innerWidth,innerHeight);
}
el('controls-modal').addEventListener('click',e=>{if(e.target===el('controls-modal'))hide('controls-modal')});
renderer.domElement.addEventListener('click',()=>{if(mode==='playing'&&!isTouch())renderer.domElement.requestPointerLock?.()});
function isTouch(){return matchMedia('(pointer: coarse)').matches||innerWidth<760;}
document.addEventListener('pointerlockchange',()=>{pointerDown=document.pointerLockElement===renderer.domElement;});
document.addEventListener('mousemove',e=>{if(mode!=='playing'||!pointerDown)return;cameraYaw-=e.movementX*.0023*cameraSensitivity;cameraPitch=THREE.MathUtils.clamp(cameraPitch+e.movementY*.0018*cameraSensitivity,-.13,.78);});
renderer.domElement.addEventListener('pointerdown',e=>{if(isTouch()||mode!=='playing')return; if(e.button===0){fireHeld=true;}});
document.addEventListener('pointerup',()=>fireHeld=false);
document.addEventListener('keydown',e=>{
 if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 keys.add(e.code);
 if(e.repeat)return;
 if(e.code==='Escape'){if(mode==='playing')setMode('paused');else if(mode==='paused')setMode('playing');}
 if(mode!=='playing')return;
 if(e.code==='KeyE')interact();if(e.code==='KeyF')contextAction();
 if(e.code==='KeyR'){if(ammo>=mag){ammo-=mag;mag=12;toast('RELOADED');}else if(ammo>0){mag=ammo;ammo=0;toast('RELOADED — LOW AMMO');}else toast('NO AMMUNITION');}
 if(e.code==='Digit1'){weapon='SIDEARM';toast('SIDEARM EQUIPPED');}
 if(e.code==='KeyM')save();
 if(e.code==='KeyG')cameraDistance=cameraDistance===7.6?11.5:7.6;
});
document.addEventListener('keyup',e=>{keys.delete(e.code);});
const touchAct=(id:string,act:Act)=>{const b=el<HTMLButtonElement>(id);const on=(e:Event)=>{e.preventDefault();acts.add(act);};const off=(e:Event)=>{e.preventDefault();acts.delete(act);};b.addEventListener('pointerdown',on);['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,off));};
touchAct('touch-jump','jump');touchAct('touch-sprint','sprint');touchAct('touch-fire','fire');touchAct('touch-enter','interact');
el('touch-interact').addEventListener('click',interact);el('touch-pause').addEventListener('click',()=>setMode('paused'));

let stickPointer:number|null=null,stickX=0,stickY=0;
const stick=el<HTMLDivElement>('stick'),knob=el<HTMLDivElement>('stick-knob');
stick.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);updateStick(e);});
stick.addEventListener('pointermove',e=>{if(stickPointer===e.pointerId)updateStick(e);});
const resetStick=()=>{stickPointer=null;stickX=0;stickY=0;knob.style.transform='translate(-50%,-50%)';};
stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);
function updateStick(e:PointerEvent){const r=stick.getBoundingClientRect();let x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),lim=r.width*.34;const len=Math.hypot(x,y);if(len>lim){x=x/len*lim;y=y/len*lim;}stickX=x/lim;stickY=y/lim;knob.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;}
function down(a:Act){return acts.has(a)||({forward:keys.has('KeyW')||keys.has('ArrowUp'),back:keys.has('KeyS')||keys.has('ArrowDown'),left:keys.has('KeyA')||keys.has('ArrowLeft'),right:keys.has('KeyD')||keys.has('ArrowRight'),sprint:keys.has('ShiftLeft')||keys.has('ShiftRight'),jump:keys.has('Space'),interact:false,fire:fireHeld||keys.has('KeyK'),brake:keys.has('Space')} as Record<Act,boolean>)[a];}
function dist2(a:THREE.Vector3,b:THREE.Vector3){return a.distanceTo(b);}
function interact(){
 if(mode!=='playing')return;
 if(driving){driving=false;player.position.copy(vehicle.position).add(new THREE.Vector3(2,0,0).applyAxisAngle(new THREE.Vector3(0,1,0),vehicle.rotation.y));player.rotation.y=vehicle.rotation.y;speedCar*=.45;toast('EXITED VEHICLE');return;}
 if(dist2(player.position,vehicle.position)<4.4){driving=true;toast('VEHICLE ACQUIRED — DRIVE CAREFULLY');return;}
 if(!missionActive&&!missionDone&&dist2(player.position,new THREE.Vector3(-41,0,-40))<8){startMission();return;}
 if(dist2(player.position,new THREE.Vector3(-41,0,-40))<9&&missionDone){toast('THE DOCKS ARE QUIET. MORE CONTRACTS SOON.');return;}
 const near=peds.find(p=>p.health>0&&dist2(p.g.position,player.position)<3.2);
 if(near){toast('CITIZEN: “KEEP MOVING, FRIEND.”');return;}
 toast('NOTHING TO INTERACT WITH HERE.');
}
function contextAction(){
 if(!missionActive&&!missionDone)startMission();
 else if(missionActive&&missionStage===1&&dist2(player.position,new THREE.Vector3(18,0,-98))<10){missionStage=2;toast('PACKAGE SECURED. GET BACK TO THE DOCKS.');refreshHUD();}
 else if(missionActive&&missionStage===2&&dist2(player.position,new THREE.Vector3(-41,0,-40))<10){missionActive=false;missionDone=true;money+=750;toast('CONTRACT COMPLETE · +$750');save();refreshHUD();}
 else toast('NO AVAILABLE ACTION HERE.');
}
function startMission(){missionActive=true;missionStage=1;toast('NEW CONTRACT: LOST PARCEL. HEAD TO THE BEACH ROAD.');refreshHUD();}

function fire(){
 if(shootCooldown>0||mag<=0){if(mag<=0&&ammo===0)toast('OUT OF AMMO — PRESS R TO RELOAD');shootCooldown=.18;return;}
 mag--;shootCooldown=.22;
 const target=peds.filter(p=>p.health>0&&dist2(p.g.position,player.position)<32).sort((a,b)=>dist2(a.g.position,player.position)-dist2(b.g.position,player.position))[0];
 if(target){
  const to=target.g.position.clone().sub(player.position);const facing=new THREE.Vector3(Math.sin(player.rotation.y),0,-Math.cos(player.rotation.y));
  if(to.normalize().dot(facing)>.25){
   target.health=Math.max(0,target.health-35);target.flee=3.8;wanted=Math.min(5,wanted+1);toast(target.health===0?'TARGET DOWN — POLICE ALERT':'HIT CONFIRMED — CITIZENS PANIC');
  }else toast('SHOT MISSED — LINE UP YOUR AIM');
 }else toast('SHOT FIRED — NO TARGET IN SIGHT');
 refreshHUD();
}
function refreshHUD(){
 el('health-num').textContent=`${Math.max(0,Math.round(health))} / 100`;el<HTMLDivElement>('health-bar').style.width=Math.max(0,health)+'%';
 el('armor-num').textContent=`${Math.round(armor)} / 50`;el<HTMLDivElement>('armor-bar').style.width=Math.max(0,armor/50*100)+'%';el('money').textContent='$'+money.toLocaleString('en-US');
 el('wanted').innerHTML='WANTED &nbsp; <span>'+Array.from({length:5},(_,i)=>i<wanted?'◆':'◇').join(' ')+'</span>';el('wanted').querySelector('span')!.className=wanted?'lit':'';
 el('speedbox').innerHTML=driving?`VEHICLE / ${weapon}<div class="speed">${Math.round(Math.abs(speedCar)*7.4)} <small>KM/H</small></div>`:`ON FOOT / ${weapon}<div class="speed">— <small>KM/H</small></div>`;
 el('objective-label').textContent=missionDone?'CONTRACT COMPLETE':missionActive?'ACTIVE CONTRACT':'CURRENT OBJECTIVE';
 el('objective-text').textContent=missionDone?'The city is yours to explore.':missionActive?(missionStage===1?'Reach the beach road and locate the parcel.':'Return to the docks to finish the contract.'):'Explore the city. Find your own way.';
 el('hint').innerHTML=driving?'PRESS <b>E</b> TO EXIT &nbsp; · &nbsp; <b>W A S D</b> DRIVE &nbsp; · &nbsp; <b>SPACE</b> BRAKE':'PRESS <b>W A S D</b> TO MOVE &nbsp; · &nbsp; <b>E</b> INTERACT &nbsp; · &nbsp; <b>F</b> CONTRACT';
 el('crosshair').classList.toggle('hidden',!fireHeld&&!keys.has('KeyK'));
}
let saveTimer=0,policeTimer=0,refreshTimer=0,fireWasHeld=false;
function update(dt:number){
 clock+=dt;shootCooldown=Math.max(0,shootCooldown-dt);if(toastTime>0){toastTime-=dt;if(toastTime<=0)el('toast').classList.remove('show');}
 if(mode!=='playing')return;
 dayTime=(dayTime+dt*.00065)%1;
 const sunAngle=dayTime*Math.PI*2; sun.position.set(Math.cos(sunAngle)*80,Math.sin(sunAngle)*90,18);
 const daylight=THREE.MathUtils.clamp(Math.sin(sunAngle)*.7+.5,.1,1);
 hemi.intensity=.6+daylight*1.5;sun.intensity=.2+daylight*3;
 scene.background!.setHSL(.53,.22,.16+daylight*.48);(scene.fog as THREE.FogExp2).color.copy(scene.background as THREE.Color);
 if(driving){
  const acc=(down('forward')?1:0)-(down('back')?1:0);
  speedCar+=acc*dt*13;speedCar*=Math.pow(down('brake')?.88:.965,dt*60);speedCar=THREE.MathUtils.clamp(speedCar,-8,22);
  const steer=(down('left')?1:0)-(down('right')?1:0);
  vehicle.rotation.y+=steer*dt*(.8+Math.abs(speedCar)*.035)*Math.sign(speedCar||1);
  const fwd=new THREE.Vector3(Math.sin(vehicle.rotation.y),0,Math.cos(vehicle.rotation.y));
  vehicle.position.addScaledVector(fwd,speedCar*dt);
  vehicle.position.x=THREE.MathUtils.clamp(vehicle.position.x,-124,124);vehicle.position.z=THREE.MathUtils.clamp(vehicle.position.z,-124,124);
  wheels.forEach(w=>w.rotation.x+=speedCar*dt*1.5);
  player.position.lerp(new THREE.Vector3(vehicle.position.x,0,vehicle.position.z),.25);player.rotation.y=vehicle.rotation.y;body.visible=false;
  traffic.forEach(t=>{if(dist2(t.g.position,vehicle.position)<2.5){speedCar*=-.32;health=Math.max(0,health-2);toast('COLLISION — TAKE CARE');}});
 }else{
  body.visible=true;
  let f=(down('forward')?1:0)-(down('back')?1:0),s=(down('right')?1:0)-(down('left')?1:0);
  const inputLen=Math.hypot(f,s);if(inputLen>1){f/=inputLen;s/=inputLen;}
  const speed=down('sprint')?8.0:4.4;
  const move=new THREE.Vector3(Math.sin(cameraYaw),0,-Math.cos(cameraYaw)).multiplyScalar(f).add(new THREE.Vector3(Math.cos(cameraYaw),0,Math.sin(cameraYaw)).multiplyScalar(s)).multiplyScalar(speed);
  velocity.x=THREE.MathUtils.damp(velocity.x,move.x,9,dt);velocity.z=THREE.MathUtils.damp(velocity.z,move.z,9,dt);
  player.position.x+=velocity.x*dt;player.position.z+=velocity.z*dt;
  if(inputLen>.06)player.rotation.y=Math.atan2(velocity.x,-velocity.z);
  if(down('jump')&&onGround){jumpV=6.2;onGround=false;}
  jumpV-=18*dt;player.position.y+=jumpV*dt;if(player.position.y<=0){player.position.y=0;jumpV=0;onGround=true;}
  player.position.x=THREE.MathUtils.clamp(player.position.x,-126,126);player.position.z=THREE.MathUtils.clamp(player.position.z,-126,126);
  const walking=inputLen>.1;const swing=walking?Math.sin(clock*(down('sprint')?13:8))*.48:0;
  legL.rotation.x=swing;legR.rotation.x=-swing;armL.rotation.x=-swing*.8;armR.rotation.x=swing*.8;
 }
 if((down('fire')||fireHeld)&&!fireWasHeld)fire();
 fireWasHeld=down('fire')||fireHeld;
 // Civilians meander, flee from the player/weapon, and recover after panic.
 for(const p of peds){
  if(p.health<=0){p.g.rotation.z=THREE.MathUtils.damp(p.g.rotation.z,Math.PI/2,2,dt);continue;}
  const d=dist2(p.g.position,player.position);
  if(p.flee>0)p.flee-=dt;
  if(d<7&&(wanted>0||fireHeld||keys.has('KeyK'))){p.flee=Math.max(p.flee,2.5);wanted=Math.min(5,wanted+dt*.06);}
  if(p.flee>0&&d<18){p.dir.copy(p.g.position).sub(player.position).setY(0).normalize();p.speed=2.8;}
  else{p.speed=.55+(p.phase%3)*.12;if(Math.sin(clock*.35+p.phase)>.985)p.dir.applyAxisAngle(new THREE.Vector3(0,1,0),.6);}
  p.g.position.addScaledVector(p.dir,p.speed*dt);
  p.g.position.x=THREE.MathUtils.clamp(p.g.position.x,-119,119);p.g.position.z=THREE.MathUtils.clamp(p.g.position.z,-119,119);
  if(Math.abs(p.g.position.x-p.home.x)>13||Math.abs(p.g.position.z-p.home.z)>13){p.dir.copy(p.home).sub(p.g.position).setY(0).normalize();}
  p.g.rotation.y=Math.atan2(p.dir.x,p.dir.z);
 }
 for(const t of traffic){
  if(t.axis==='x')t.g.position.x+=t.speed*t.sign*dt;else t.g.position.z+=t.speed*t.sign*dt;
  if(t.axis==='x'&&Math.abs(t.g.position.x)>128)t.g.position.x=-128*Math.sign(t.g.position.x);
  if(t.axis==='z'&&Math.abs(t.g.position.z)>128)t.g.position.z=-128*Math.sign(t.g.position.z);
 }
 // Tiny pursuit loop, deliberately scoped to lightweight ambient police pressure.
 if(wanted>0){policeTimer+=dt;if(policeTimer>13){wanted=Math.max(0,wanted-1);policeTimer=0;toast(wanted?'POLICE SEARCH CONTINUES':'YOU LOST THE PURSUIT');}}
 else policeTimer=0;
 if(missionActive&&missionStage===1&&dist2(player.position,new THREE.Vector3(18,0,-98))<7){missionStage=2;toast('PARCEL FOUND. PRESS F TO COLLECT IT.');}
 if(missionActive&&missionStage===2&&dist2(player.position,new THREE.Vector3(-41,0,-40))<7){toastTime=Math.max(toastTime,.05);}
 saveTimer+=dt;if(saveTimer>30){saveTimer=0;try{localStorage.setItem(saveKey,JSON.stringify({v:1,money,health,armor,ammo,mag,missionStage,missionDone,dayTime,position:player.position.toArray(),vehicle:vehicle.position.toArray(),settings}));}catch{}}
 refreshTimer+=dt;if(refreshTimer>.25){refreshTimer=0;refreshHUD();}
}

const camTarget=new THREE.Vector3(),camPos=new THREE.Vector3();
function updateCamera(dt:number){
 const subject=driving?vehicle:player;
 const yaw=driving?vehicle.rotation.y+cameraYaw*.25:cameraYaw;
 const height=driving?2.8:2.2;
 const offset=new THREE.Vector3(Math.sin(yaw)*cameraDistance, height+cameraPitch*4, Math.cos(yaw)*cameraDistance);
 camPos.copy(subject.position).add(offset);camTarget.copy(subject.position).add(new THREE.Vector3(0,driving?1.2:1.45,0));
 // soft collision raycast against world props keeps the camera out of walls
 const ray=new THREE.Raycaster(camTarget,camPos.clone().sub(camTarget).normalize(),0.2,cameraDistance+2);
 const hits=ray.intersectObjects(city.children,true).filter(h=>h.object instanceof THREE.Mesh);
 if(hits.length){const safe=hits[0].distance-.35;camPos.copy(camTarget).add(camPos.sub(camTarget).normalize().multiplyScalar(Math.max(1.2,safe)));}
 camera.position.lerp(camPos,1-Math.exp(-dt*5));camera.lookAt(camTarget);
}
let last=performance.now();
function frame(now:number){
 requestAnimationFrame(frame);
 const dt=Math.min(.04,Math.max(0,(now-last)/1000));last=now;
 update(dt);
 const stickMove= Math.hypot(stickX,stickY);
 if(mode==='playing'&&stickMove>.08){
  if(!driving){cameraYaw+=stickX*dt*1.7*cameraSensitivity;cameraPitch=THREE.MathUtils.clamp(cameraPitch+stickY*dt*.7,-.13,.7);}
  else {if(stickX>.1)keys.add('KeyD');else keys.delete('KeyD');if(stickX<-.1)keys.add('KeyA');else keys.delete('KeyA');if(stickY<-.12)keys.add('KeyW');else keys.delete('KeyW');if(stickY>.2)keys.add('KeyS');else keys.delete('KeyS');}
 }
 updateCamera(dt);
 renderer.render(scene,camera);
}
requestAnimationFrame(frame);

function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,settings.quality==='performance'?1:settings.quality==='high'?2:1.5));}
window.addEventListener('resize',resize);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='playing'){setMode('paused');}});
window.addEventListener('beforeunload',()=>{try{localStorage.setItem(saveKey,JSON.stringify({v:1,money,health,armor,ammo,mag,missionStage,missionDone,dayTime,position:player.position.toArray(),vehicle:vehicle.position.toArray(),settings}));}catch{}});
function addMissionMarker(){
 const g=new THREE.Group();g.position.set(-41,0,-40);scene.add(g);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.12,24),mat(0x74e5d3,.45,.15));base.position.y=.08;g.add(base);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.4,.075,8,32),new THREE.MeshStandardMaterial({color:0x74e5d3,emissive:0x1a5c58,emissiveIntensity:.6}));ring.rotation.x=Math.PI/2;ring.position.y=.28;g.add(ring);
 const beacon=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,3,8),new THREE.MeshBasicMaterial({color:0x74e5d3,transparent:true,opacity:.35}));beacon.position.y=1.7;g.add(beacon);
 const tick=(t:number)=>{if(!g.parent)return;g.position.y=Math.sin(t*.002)*.15;ring.rotation.z=t*.0006;requestAnimationFrame(tick);};requestAnimationFrame(tick);
}
addMissionMarker();

// Skip title load after the first frame, allowing assets to appear behind the menu.
setTimeout(()=>{const b=document.querySelector<HTMLDivElement>('#boot');if(b){b.style.opacity='0';setTimeout(()=>b.remove(),750);}},650);
setMode('menu');
try{if(localStorage.getItem(saveKey))el('continue-game').style.opacity='1';else el('continue-game').style.opacity='.58';}catch{el('continue-game').style.opacity='.7';}
