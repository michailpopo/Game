(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={slug:`storm-grid`,title:`Storm Grid`,saveVersion:4,firstMidgameLevel:4},t={revivesPerSession:1,reviveMinProgress:.85,reviveCountdownSec:5,boostAfterRuns:2,boostEveryRuns:2,boostCooldownSec:120,boostStrikes:2,freeUpgradeCooldownSec:180,cashCooldownSec:180,cashShare:.22,trySkinFromRuns:4,giftVideoFactor:2,maxVideoOffersPerScreen:2},n={city:{buildings:24,growth:1.1,maxBuildings:300,themeRelief:.85,themeEvery:5,themes:8,rampCities:70,districtMax:4,lotPitch:9,jitter:1.2,avenue:[4,12],park:[.1,.25],heightMin:12,heightMax:[24,60],footprint:[.58,.8],visualGrow:1.1,maxVisual:7.6,capOverhang:.7,clearance:1,footprintMin:3.6,antenna:3,goldFrom:3},strike:{fillSec:1.2,band:[.8,.95],capacitorStep:.015,firstCity:{fillSec:1.6,bandLo:.6},weakBelow:.4,weakShare:.5,superShare:1.3,superBolts:2,overSec:.35,fizzleEnergy:3,strikes:3,maxStrikeLevels:4},chain:{e0:8,e0PerVoltage:1,range:16,rangePerVoltage:.25,fork:.05,forkPerLevel:.01,forkShare:.6,hopFast:.08,hopSlow:.07,maxBolts:64},gold:{pay:10,energy:4},payout:{floorM:4,floorsDiv:8,cityGrowth:1.04,depthStep:.02,depthCap:2,districtShare:.25,plates:[[1,10],[.95,5],[.8,3],[.6,2]],passAt:.6,passTo:.7,passRampFrom:8,passRampCities:35},input:{snapPx:80}},r={upgrades:{voltage:{max:30,base:60,growth:1.25,lateFrom:10,lateGrowth:1.06},fork:{max:30,base:90,growth:1.25,lateFrom:10,lateGrowth:1.06},strikes:{max:4,base:1500,growth:8},capacitor:{max:10,base:150,growth:1.9,lateFrom:4,lateGrowth:1.25},gold:{max:5,base:400,growth:4.3}},skins:{base:250,growth:1.45},gift:{runs:2,runCoins:[[1,150],[5,250],[10,440],[20,770],[40,3800],[60,10500],[80,24e3]],streak:[1,1.15,1.3,1.45,1.6,1.8,2]}},i=new Set;function a(e,t){i.has(e)||(i.add(e),console.warn(`[platform] ${e} failed:`,t?.code||t?.message||t))}function o(){let e=typeof matchMedia==`function`&&matchMedia(`(pointer: coarse)`).matches;return{countryCode:null,locale:navigator.language||`en-US`,device:{type:e?`mobile`:`desktop`},os:{name:null,version:null},browser:{name:null,version:null},applicationType:`web`}}var s=class{name=`none`;environment=`none`;sdkAvailable=!1;#e={muteAudio:!1,disableChat:!1};async init(){let e=new URLSearchParams(location.search);return this.#e={muteAudio:e.get(`muteAudio`)===`true`,disableChat:e.get(`disableChat`)===`true`},this}get settings(){return{...this.#e}}onSettingsChange(){return()=>{}}gameplayStart(){}gameplayStop(){}loadingStart(){}loadingStop(){}happytime(){}reportCompletion(){}setGameContext(){}clearGameContext(){}async requestAd(){return{shown:!1,reason:`no-sdk`}}async hasAdblock(){return!1}async showBanner(){return{shown:!1,reason:`no-sdk`}}clearBanner(){}clearAllBanners(){}get dataAvailable(){return!1}dataGet(){return null}dataSet(){return!1}dataRemove(){return!1}get userAccountsAvailable(){return!1}async getUser(){return null}async getUserToken(){return null}async showAuthPrompt(){return null}onAuth(){return()=>{}}get systemInfo(){return o()}get isCrazyGamesApp(){return[`google_play_store`,`apple_store`].includes(this.systemInfo.applicationType)}get isInstantMultiplayer(){return!1}get inviteParams(){return null}updateRoom(){}leftRoom(){}inviteLink(){return null}onJoinRoom(){return()=>{}}async submitScore(){return!1}},c=class extends s{name=`crazygames`;sdkAvailable=!0;#e;#t=!0;constructor(e){super(),this.#e=e}async init(){return await super.init(),await this.#e.init(),this.environment=this.#e.environment||`crazygames`,this}get settings(){try{return{...this.#e.game.settings}}catch(e){return a(`settings`,e),super.settings}}onSettingsChange(e){try{return this.#e.game.addSettingsChangeListener(e),()=>{try{this.#e.game.removeSettingsChangeListener(e)}catch{}}}catch(e){return a(`addSettingsChangeListener`,e),()=>{}}}gameplayStart(){try{this.#e.game.gameplayStart()}catch(e){a(`gameplayStart`,e)}}gameplayStop(){try{this.#e.game.gameplayStop()}catch(e){a(`gameplayStop`,e)}}loadingStart(){try{this.#e.game.loadingStart()}catch(e){a(`loadingStart`,e)}}loadingStop(){try{this.#e.game.loadingStop()}catch(e){a(`loadingStop`,e)}}happytime(){try{this.#e.game.happytime()}catch(e){a(`happytime`,e)}}reportCompletion(e){let t=Math.max(0,Math.min(100,Math.round(e)));try{this.#e.game.reportGameCompletedPercentage(t)}catch(e){a(`reportGameCompletedPercentage`,e)}}setGameContext(e){try{this.#e.game.setGameContext(e)}catch(e){a(`setGameContext`,e)}}clearGameContext(){try{this.#e.game.clearGameContext()}catch(e){a(`clearGameContext`,e)}}requestAd(e,{onStarted:t}={}){return new Promise(n=>{let r=!1,i=e=>{r||(r=!0,clearTimeout(o),n(e))},o=setTimeout(()=>i({shown:!1,reason:`timeout`}),6e4);try{this.#e.ad.requestAd(e,{adStarted:()=>{try{t?.()}catch(e){console.error(e)}},adFinished:()=>i({shown:!0,reason:`finished`}),adError:e=>i({shown:!1,reason:e?.code||`other`,error:e})})}catch(e){a(`requestAd`,e),i({shown:!1,reason:`threw`})}})}async hasAdblock(){try{return!!await this.#e.ad.hasAdblock()}catch(e){return a(`hasAdblock`,e),!1}}async showBanner(e,t,n){try{return await this.#e.banner.requestBanner({id:e,width:t,height:n}),{shown:!0}}catch(e){return{shown:!1,reason:e?.code||`other`}}}clearBanner(e){try{this.#e.banner.clearBanner(e)}catch{}}clearAllBanners(){try{this.#e.banner.clearAllBanners()}catch{}}get dataAvailable(){return this.#t&&!!this.#e.data}dataGet(e){try{return this.#e.data.getItem(e)}catch(e){return this.#n(`getItem`,e),null}}dataSet(e,t){try{return this.#e.data.setItem(e,t),!0}catch(e){return this.#n(`setItem`,e),!1}}dataRemove(e){try{return this.#e.data.removeItem(e),!0}catch(e){return this.#n(`removeItem`,e),!1}}#n(e,t){t?.code===`dataModuleDisabled`&&(this.#t=!1,console.error(`[platform] Data module disabled: enable 'Progress Save' (Data Module) in the CrazyGames submission.`)),a(`data.${e}`,t)}get userAccountsAvailable(){try{return!!this.#e.user.isUserAccountAvailable}catch{return!1}}async getUser(){if(!this.userAccountsAvailable)return null;try{return await this.#e.user.getUser()??null}catch(e){return a(`getUser`,e),null}}async getUserToken(){try{return await this.#e.user.getUserToken()}catch(e){return e?.code!==`userNotAuthenticated`&&a(`getUserToken`,e),null}}async showAuthPrompt(){try{return await this.#e.user.showAuthPrompt()}catch{return null}}onAuth(e){try{return this.#e.user.addAuthListener(e),()=>{try{this.#e.user.removeAuthListener(e)}catch{}}}catch(e){return a(`addAuthListener`,e),()=>{}}}get systemInfo(){try{return{...o(),...this.#e.user.systemInfo}}catch{return o()}}get isInstantMultiplayer(){try{return!!this.#e.game.isInstantMultiplayer}catch{return!1}}get inviteParams(){try{return this.#e.game.inviteParams??null}catch{return null}}updateRoom(e){try{this.#e.game.updateRoom(e)}catch(e){a(`updateRoom`,e)}}leftRoom(){try{this.#e.game.leftRoom()}catch(e){a(`leftRoom`,e)}}inviteLink(e){try{return this.#e.game.inviteLink(e)}catch(e){return a(`inviteLink`,e),null}}onJoinRoom(e){try{return this.#e.game.addJoinRoomListener(e),()=>{try{this.#e.game.removeJoinRoomListener(e)}catch{}}}catch(e){return a(`addJoinRoomListener`,e),()=>{}}}async submitScore(e,t){try{return await this.#e.user.submitScore({encryptedScore:e,score:t}),!0}catch(e){return a(`submitScore`,e),!1}}},l=new s;async function u({timeoutMs:e=8e3}={}){let t=globalThis.CrazyGames?.SDK;if(!t)return console.info(`[platform] CrazyGames SDK not present - local mode`),await l.init(),l;let n=new c(t);try{await Promise.race([n.init(),new Promise((t,n)=>setTimeout(()=>n(Error(`SDK init timed out`)),e))]),n.environment===`disabled`?(console.info(`[platform] SDK environment 'disabled' - running without SDK`),await l.init()):(l=n,console.info(`[platform] SDK ready (environment: ${n.environment}${t.__isMock?`, MOCK`:``})`))}catch(e){console.warn(`[platform] SDK init failed, continuing without it:`,e?.message||e),await l.init()}return l}var d=Object.freeze({AD:`ad`,MENU:`menu`,DIALOG:`dialog`,HIDDEN:`hidden`,BOOT:`boot`}),f=class{#e=new Set;#t=new Set;constructor(e=[d.BOOT]){for(let t of e)this.#e.add(t)}get running(){return this.#e.size===0}get reasons(){return[...this.#e]}has(e){return this.#e.has(e)}hold(e){if(!e)throw Error(`hold() needs a reason`);return this.#e.has(e)||(this.#e.add(e),this.#n()),this}release(e){return this.#e.delete(e)&&this.#n(),this}onChange(e){return this.#t.add(e),()=>this.#t.delete(e)}#n(){let e={running:this.running,reasons:this.reasons};for(let t of this.#t)try{t(e)}catch(e){console.error(`[pause] listener threw`,e)}}};function p(e,{onHide:t,interactionTarget:n}={}){let r=()=>e.hold(d.HIDDEN),i=()=>e.release(d.HIDDEN);document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`?(r(),t?.()):i()}),window.addEventListener(`blur`,r),window.addEventListener(`focus`,()=>{document.visibilityState===`visible`&&i()}),window.addEventListener(`pagehide`,()=>{r(),t?.()}),n?.addEventListener(`pointerdown`,i,{passive:!0}),document.visibilityState===`hidden`&&r()}var m=class{#e;#t;#n;#r;#i=0;#a=0;#o=0;#s=!1;#c=!1;#l=0;#u=16.7;#d={frames:0,steps:0,longFrames:0,spiralGuards:0};timeScale=1;constructor({update:e,render:t,step:n=1/60,maxStepsPerFrame:r=5}){this.#e=e,this.#t=t,this.#n=n,this.#r=r}get step(){return this.#n}get frameMs(){return this.#u}get stats(){return{...this.#d,frameMs:+this.#u.toFixed(2),fps:Math.round(1e3/this.#u)}}start(){this.#s||(this.#s=!0,this.#a=performance.now(),this.#o=0,this.#i=requestAnimationFrame(this.#f))}stop(){this.#s=!1,cancelAnimationFrame(this.#i)}setSimPaused(e){this.#c&&!e&&(this.#o=0),this.#c=e}freeze(e){this.#l=Math.max(this.#l,e)}#f=e=>{if(!this.#s)return;this.#i=requestAnimationFrame(this.#f);let t=Math.min(e-this.#a,250);if(this.#a=e,this.#d.frames++,this.#u+=(t-this.#u)*.05,t>34&&this.#d.longFrames++,this.#l>0)this.#l-=t;else if(!this.#c){this.#o+=Math.min(t/1e3*this.timeScale,this.#n*this.#r);let e=0;for(;this.#o>=this.#n;)if(this.#e(this.#n),this.#o-=this.#n,this.#d.steps++,++e>=this.#r){this.#o=0,this.#d.spiralGuards++;break}}this.#t(this.#c?1:this.#o/this.#n,t/1e3)}},h={left:[`KeyA`,`ArrowLeft`],right:[`KeyD`,`ArrowRight`],up:[`KeyW`,`ArrowUp`],down:[`KeyS`,`ArrowDown`],action:[`Space`,`Enter`]},g=new Set([`Escape`]),_=new Set([`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`Space`]),v=class{#e;#t={};#n=new Set;#r=new Set;#i={id:null,down:!1,x:0,y:0,dragX:0,dragY:0};#a=new Set;#o=!1;#s;#c=null;constructor(e,{bindings:t={},pointerLock:n=!1}={}){this.#e=e,this.#s=n;for(let[e,n]of Object.entries({...h,...t})){let t=n.filter(e=>!g.has(e));t.length!==n.length&&console.warn(`[input] refused browser-reserved key for "${e}"`),this.#t[e]=t}}attach(){let e=this.#e;e.style.touchAction=`none`,window.addEventListener(`keydown`,e=>{e.ctrlKey||e.metaKey||e.altKey||(_.has(e.code)&&e.preventDefault(),this.#n.has(e.code)||this.#r.add(e.code),this.#n.add(e.code),this.#l(e))},{passive:!1}),window.addEventListener(`keyup`,e=>this.#n.delete(e.code)),e.addEventListener(`pointerdown`,t=>{(this.#i.id===null||t.pointerId===this.#i.id)&&(this.#i.id=t.pointerId,this.#i.down=!0,this.#i.x=t.clientX,this.#i.y=t.clientY,e.setPointerCapture?.(t.pointerId),this.#s&&t.pointerType===`mouse`&&e.requestPointerLock?.()?.catch?.(()=>{}),this.#l(t),t.preventDefault())},{passive:!1}),e.addEventListener(`pointermove`,t=>{let n=document.pointerLockElement===e;if(!n&&(!this.#i.down||t.pointerId!==this.#i.id))return;let r=e.clientWidth||1,i=n?t.movementX:t.clientX-this.#i.x,a=n?t.movementY:t.clientY-this.#i.y;this.#i.dragX+=i/r,this.#i.dragY+=a/r,this.#i.x=t.clientX,this.#i.y=t.clientY},{passive:!0});let t=e=>{e.pointerId===this.#i.id&&(this.#i.down=!1,this.#i.id=null)};window.addEventListener(`pointerup`,t),window.addEventListener(`pointercancel`,t);let n=()=>{this.#n.clear(),this.#i.down=!1,this.#i.id=null};return window.addEventListener(`blur`,n),document.addEventListener(`visibilitychange`,()=>{document.hidden&&n()}),window.addEventListener(`wheel`,e=>e.preventDefault(),{passive:!1}),document.addEventListener(`contextmenu`,e=>e.preventDefault()),navigator.keyboard?.getLayoutMap?.().then(e=>{this.#c=[`KeyW`,`KeyA`,`KeyS`,`KeyD`].map(t=>(e.get(t)||``).toUpperCase()).join(``)}).catch(()=>{}),this}onFirstInteraction(e){this.#o?e():this.#a.add(e)}held(e){return(this.#t[e]||[]).some(e=>this.#n.has(e))}justPressed(e){return(this.#t[e]||[]).some(e=>this.#r.has(e))}axis(e,t){return+!!this.held(t)-!!this.held(e)}consumeDragX(){let e=this.#i.dragX;return this.#i.dragX=0,e}consumeDragY(){let e=this.#i.dragY;return this.#i.dragY=0,e}get pointerDown(){return this.#i.down}endStep(){this.#r.clear()}exitPointerLock(){document.pointerLockElement&&document.exitPointerLock?.()}get movementLabel(){return/^[A-Z]{4}$/.test(this.#c||``)?this.#c:`WASD`}get isTouch(){return matchMedia(`(pointer: coarse)`).matches}#l(){if(!this.#o){this.#o=!0;for(let e of this.#a)try{e()}catch(e){console.error(e)}this.#a.clear()}}},y=1048576,b=class{name=`memory`;#e=new Map;get(e){return this.#e.has(e)?this.#e.get(e):null}set(e,t){return this.#e.set(e,t),!0}remove(e){return this.#e.delete(e),!0}},x=class{name=`localStorage`;static available(){try{return localStorage.setItem(`__probe__`,`1`),localStorage.removeItem(`__probe__`),!0}catch{return!1}}get(e){try{return localStorage.getItem(e)}catch{return null}}set(e,t){try{return localStorage.setItem(e,t),!0}catch(e){return console.warn(`[save] localStorage write failed`,e),!1}}remove(e){try{return localStorage.removeItem(e),!0}catch{return!1}}},S=class{name=`crazygames-data`;#e;constructor(e){this.#e=e}get(e){return this.#e.dataGet(e)}set(e,t){return this.#e.dataSet(e,t)}remove(e){return this.#e.dataRemove(e)}},C=class{#e;#t;#n;#r;#i;#a=new b;#o=null;#s;#c=!1;#l=0;status={provider:`memory`,loadedFrom:null,lastWriteOk:null,lastError:null,bytes:0,recovered:!1};constructor({key:e,version:t,defaults:n,migrations:r={},debounceMs:i=1e3}){if(!e||!Number.isInteger(t))throw Error(`SaveService needs a key and an integer version`);this.#e=e,this.#t=t,this.#n=n,this.#r=r,this.#i=i,this.#s=structuredClone(n)}get data(){return this.#s}init(e){return this.#o=e,this.#u(),this.load(),this.#a instanceof S&&!e.dataAvailable&&(this.#u(),this.load()),this}#u(){this.#o?.dataAvailable?this.#a=new S(this.#o):x.available()?this.#a=new x:(this.#a=new b,console.warn(`[save] no persistent storage - progress will not survive a reload`)),this.status.provider=this.#a.name}load(){let e=null;try{e=this.#a.get(this.#e)}catch(e){console.warn(`[save] read failed`,e)}if(e==null)return this.#s=structuredClone(this.#n),this.status.loadedFrom=`defaults`,this.#s;let t;try{if(t=JSON.parse(e),!t||typeof t!=`object`)throw Error(`not an object`)}catch(t){return console.error(`[save] corrupted save quarantined`,t),this.#a.set(`${this.#e}.broken`,e),this.#s=structuredClone(this.#n),this.status.loadedFrom=`defaults (corrupted save quarantined)`,this.status.recovered=!0,this.#s}let n=Number(t.__v??0);if(n>this.#t)return console.warn(`[save] save is v${n}; this build understands v${this.#t}. Not downgrading.`),this.#s=structuredClone(this.#n),this.#d=!0,this.status.loadedFrom=`defaults (save from newer build v${n}, left untouched)`,this.status.recovered=!0,this.#s;let r=t;for(let e=n;e<this.#t;e++){let t=this.#r[e+1];if(!t){console.warn(`[save] no migration to v${e+1}; using defaults`),r=structuredClone(this.#n);break}try{r=t(r)}catch(t){console.error(`[save] migration to v${e+1} failed`,t),r=structuredClone(this.#n);break}}return delete r.__v,this.#s={...structuredClone(this.#n),...r},this.status.loadedFrom=this.#a.name+(n<this.#t?` (migrated v${n}->v${this.#t})`:``),this.#s}#d=!1;update(e){let t=e(this.#s);return t&&typeof t==`object`&&(this.#s=t),this.#c=!0,clearTimeout(this.#l),this.#l=setTimeout(()=>this.flush(),this.#i),this.#s}flush(){if(clearTimeout(this.#l),!this.#c||this.#d)return!0;let e=JSON.stringify({...this.#s,__v:this.#t});if(this.status.bytes=e.length,e.length>y)return this.status.lastWriteOk=!1,this.status.lastError=`payload ${e.length} B exceeds the 1 MB Data module cap`,console.error(`[save]`,this.status.lastError),!1;let t=this.#a.set(this.#e,e);return!t&&this.#a instanceof S&&!this.#o.dataAvailable&&(this.#u(),t=this.#a.set(this.#e,e)),this.#c=!t,this.status.lastWriteOk=t,t||(this.status.lastError=`write to ${this.#a.name} failed`),t}reset(){return this.#s=structuredClone(this.#n),this.#d=!1,this.#c=!0,this.flush()}};function w(e=1,t=.05,n=220,r=0,i=0,a=.1,o=0,s=1,c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=1,v=0,y=0,b=0,x=44100){let S=Math.PI*2,C=Math.abs,w=e=>e<0?-1:1,T=c*=500*S/x/x,E=n*=(1+t*2*Math.random()-t)*S/x,D=0,O=0,k=0,A=1,j,M=[],N=0,P=0,F=0,ee,I=S*C(b)*2/x,L=Math.cos(I),R=Math.sin(I)/2/2,te=1+R,z=-2*L/te,ne=(1-R)/te,B=(1+w(b)*L)/2/te,V=-(w(b)+L)/te,re=B,ie=0,H=0,ae=0,U=0;for(r=r*x||9,v*=x,i*=x,a*=x,g*=x,l*=500*S/x**3,m*=S/x,u*=S/x,d*=x,f=f*x|0,j=r+v+i+a+g|0;P<j;M[P++]=F*e)++k%(h*100|0)||(F=o?o>1?o>2?o>3?o>4?(N/S%1<s/2)*2-1:Math.sin(N**3):Math.max(Math.min(Math.tan(N),1),-1):1-(2*N/S%2+2)%2:1-4*C(Math.round(N/S)-N/S):Math.sin(N),F=(f?1-y+y*Math.sin(S*P/f):1)*(o>4?F:w(F)*C(F)**s)*(P<r?P/r:P<r+v?1-(P-r)/v*(1-_):P<r+v+i?_:P<j-g?(j-P-g)/a*_:0),F=g?F/2+(g>P?0:(P<j-g?1:(j-P)/g)*M[P-g|0]/2/e):F,b&&(F=U=re*ie+V*(ie=H)+B*(H=F)-ne*ae-z*(ae=U))),ee=(n+=c+=l)*Math.cos(m*D++),N+=ee+ee*p*Math.sin(P**5),A&&++A>d&&(n+=u,E+=u,A=0),f&&!(++O%f)&&(n=E,c=T,A||=1);return M}var T={gateGood:[1,0,523,.01,.06,.2,1,1.6,0,0,262,.06,0,0,0,0,0,.7,.03],gateBad:[.9,0,196,.01,.08,.25,2,1.2,-3,0,0,0,0,.1,0,0,0,.5,.05,0,900],pop:[.35,.15,620,0,.01,.05,1,2.2,0,0,0,0,0,0,0,0,0,.4],hit:[1,.05,110,.005,.04,.25,4,1.6,-1.5,0,0,0,0,.6,0,.1,0,.5,.08,0,1400],coin:[.6,0,1318,0,.02,.12,1,1.5,0,0,659,.04,0,0,0,0,0,.6],win:[.9,0,523,.02,.22,.45,1,1.1,0,0,262,.12,.12,0,0,0,.04,.7,.08],fail:[.9,0,294,.02,.18,.5,2,1.4,-2.5,0,0,0,0,.1,0,0,0,.6,.12,0,1100],click:[.45,0,880,0,.01,.04,1,1.5,0,0,0,0,0,0,0,0,0,.4],tier:[.7,0,659,.005,.04,.14,1,1.4,0,0,330,.03,0,0,0,0,0,.6],clash:[.4,.25,150,0,.02,.07,4,1.8,0,0,0,0,0,.7,0,0,0,.4,0,0,2e3]},E=class{#e;#t=null;#n=null;#r=null;#i=!1;#a=!1;#o=!1;#s=!1;#c=new Map;#l=new Map;#u=new Map;#d=new Set;#f;#p=new Map;#m=new Map;constructor({sounds:e=T,samples:t={},userMuted:n=!1}={}){this.#e=e,this.#f=t,this.#s=n}preload(){for(let[e,t]of Object.entries(this.#f))this.#p.has(e)||this.#p.set(e,fetch(t.url).then(e=>e.ok?e.arrayBuffer():null).catch(()=>null));return this}#h(){this.preload();for(let[e,t]of this.#p)t.then(e=>e?this.#t.decodeAudioData(e.slice(0)):null).then(t=>{if(!t)return;this.#c.set(e,t);let n=this.#f[e];this.#m.set(e,{gain:n.gain??1,pitchExp:n.pitchExp??1})}).catch(()=>{})}get muted(){return this.#i||this.#a||this.#o||this.#s}get userMuted(){return this.#s}get lockedByPlatform(){return this.#i}get state(){return{platformMute:this.#i,adMute:this.#a,hiddenMute:this.#o,userMute:this.#s,effectiveMuted:this.muted,context:this.#t?.state??`none`,samplesDecoded:this.#m.size}}onChange(e){return this.#d.add(e),()=>this.#d.delete(e)}bindPlatform(e){return this.#i=!!e.settings?.muteAudio,e.onSettingsChange(e=>{this.#i=!!e?.muteAudio,this.#_()}),this.#_(),this}setAdMute(e){this.#a=!!e,this.#_()}setHiddenMute(e){this.#o=!!e,this.#_()}setUserMute(e){this.#s=!!e,this.#_()}toggleUserMute(){return this.#s=!this.#s,this.#_(),{userMute:this.#s,effectiveMuted:this.muted,lockedByPlatform:this.#i}}unlock(){if(!this.#t){let e=window.AudioContext||window.webkitAudioContext;if(!e)return!1;this.#t=new e,this.#n=this.#t.createGain(),this.#n.connect(this.#t.destination),this.#r=this.#t.createGain(),this.#r.gain.value=.9,this.#r.connect(this.#n);for(let[e,t]of Object.entries(this.#e))this.#g(e,t);this.#h(),this.#_()}return this.#t.state!==`running`&&this.#t.resume().catch(()=>{}),!0}installUnlockHandlers(e=window){let t=()=>this.unlock();for(let n of[`pointerdown`,`touchend`,`keydown`,`click`])e.addEventListener(n,t,{passive:!0});return this}play(e,{volume:t=1,pitch:n=1,minGap:r=.03,maxVoices:i=6}={}){let a=this.#t;if(!a||a.state!==`running`||this.muted)return!1;let o=this.#c.get(e);if(!o)return!1;let s=a.currentTime;if(s-(this.#l.get(e)??-1)<r||(this.#u.get(e)??0)>=i)return!1;this.#l.set(e,s);let c=this.#m.get(e),l=a.createBufferSource();l.buffer=o,l.playbackRate.value=c?n**c.pitchExp:n;let u=a.createGain();return u.gain.value=c?t*c.gain:t,l.connect(u).connect(this.#r),this.#u.set(e,(this.#u.get(e)??0)+1),l.onended=()=>this.#u.set(e,Math.max(0,(this.#u.get(e)??1)-1)),l.start(),!0}#g(e,t){let n=this.#t.sampleRate,r=[...t];for(;r.length<21;)r.push(void 0);let i=w(...r,n);if(!i.length)return;let a=this.#t.createBuffer(1,i.length,n);a.getChannelData(0).set(i),this.#c.set(e,a)}#_(){let e=+!this.muted;if(this.#n){let t=this.#t.currentTime;this.#n.gain.cancelScheduledValues(t),this.#n.gain.setTargetAtTime(e,t,.015)}window.__GS_AUDIO_GAIN__=e;let t=this.state;for(let e of this.#d)try{e(t)}catch{}}},D=new Set([`adsDisabledBasicLaunch`,`adblock`,`no-sdk`]),O=class{#e;#t;#n;#r=!1;#i=null;#a=null;log=[];constructor(e,t,n){this.#e=e,this.#t=t,this.#n=n}get busy(){return this.#r}get rewardedAvailability(){return l.sdkAvailable?this.#a?{ok:!1,reason:this.#a}:{ok:!0,reason:null}:{ok:!1,reason:`no-sdk`}}async detectAdblock(){await l.hasAdblock()&&(this.#a=`adblock`)}beginBreak(e){this.#i={name:e,midgame:!1,continueRewarded:!1}}endBreak(){this.#i=null}offer(e,t=`shown`){this.log.push({type:`offer`,context:e,outcome:t,t:Date.now()})}async midgame({context:e,gameplayActive:t=!1}){if(!e)return this.#o(`midgame`,`no break context (CG-ADS-002)`);if(t)return this.#o(`midgame`,`gameplay active (CG-ADS-002)`);if(this.#i?.continueRewarded)return this.#o(`midgame`,`continue-rewarded already used at this break (CG-ADS-015)`);let n=await this.#s(`midgame`,e);return this.#i&&(this.#i.midgame=!0),n}async rewarded({context:e,grant:t,gameplayActive:n=!1,isContinue:r=!1}){if(typeof t!=`function`)throw Error(`rewarded() needs a grant callback`);if(!e)return this.#o(`rewarded`,`no context`);if(n)return this.#o(`rewarded`,`active gameplay screen (CG-ADS-009)`);if(r&&this.#i?.midgame)return this.#o(`rewarded`,`midgame already used at this break (CG-ADS-015)`);let i=await this.#s(`rewarded`,e);if(i.shown){r&&this.#i&&(this.#i.continueRewarded=!0);try{t()}catch(e){console.error(`[ads] grant threw`,e)}}else D.has(i.reason)&&(this.#a=i.reason);return i}#o(e,t){return console.warn(`[ads] refused ${e}: ${t}`),this.log.push({type:e,outcome:`refused`,why:t,t:Date.now()}),{shown:!1,reason:`refused`}}async#s(e,t){if(this.#r)return this.#o(e,`another ad in flight (CG-ADS-010)`);this.#r=!0,this.#e.hold(d.AD),this.#n.show();let n=!1,r=performance.now(),i;try{i=await l.requestAd(e,{onStarted:()=>{n=!0,this.#t.setAdMute(!0)}})}catch(e){console.error(`[ads] requestAd rejected unexpectedly`,e),i={shown:!1,reason:`threw`}}finally{n&&this.#t.setAdMute(!1),this.#n.hide(),this.#e.release(d.AD),this.#r=!1}return this.log.push({type:e,context:t,outcome:i.shown?`shown`:i.reason,ms:Math.round(performance.now()-r),t:Date.now()}),i}},k=[d.AD,d.MENU,d.DIALOG,d.BOOT];function A(e,t){let n=!1,r=!1,i=null,a=[],o=()=>{let o=n&&!k.some(e=>t.has(e));o!==r&&(r=o,o?(i===null&&(i=performance.now()),e.gameplayStart()):e.gameplayStop(),a.push({event:o?`gameplayStart`:`gameplayStop`,t:Math.round(performance.now())}))};return t.onChange(o),{setPlaying(e){n=!!e,o()},get reported(){return r},get firstStartMs(){return i},get history(){return a.slice()}}}var j=new WeakMap,M=[{name:`low`,dpr:1,shadows:!1,shadowMapSize:0,bloom:!1,msaa:0},{name:`medium`,dpr:1.25,shadows:!0,shadowMapSize:1024,bloom:!1,msaa:0},{name:`high`,dpr:1.5,shadows:!0,shadowMapSize:1024,bloom:!0,msaa:4},{name:`ultra`,dpr:2,shadows:!0,shadowMapSize:2048,bloom:!0,msaa:4}],N=class{#e;#t;#n;#r=2;#i=2;#a=!1;#o=0;#s=0;#c=0;#l=[];static of(e){return j.get(e)??null}subscribe(e){return this.#l.push(e),e(this.tier),()=>{this.#l=this.#l.filter(t=>t!==e)}}constructor(e,{onChange:t,onTier:n}={}){this.#e=e,this.#t=t,this.#n=n,j.set(e,this);let r=new URLSearchParams(location.search),i=window.devicePixelRatio||1,a=(navigator.deviceMemory||8)<=4,o=matchMedia(`(pointer: coarse)`).matches;this.#i=Math.min(i,a?1.25:2),this.#r=a?0:o?1:2;let s=M.findIndex(e=>e.name===r.get(`quality`)),c=Number(r.get(`dpr`));if(s>=0&&(this.#a=!0,this.#r=s,this.#i=Math.max(this.#i,M[s].dpr)),c>0){this.#a=!0,this.#u(c);return}this.#u()}get pixelRatio(){return this.#e.getPixelRatio()}get tier(){return{...M[this.#r],index:this.#r,dpr:this.#e.getPixelRatio()}}setLevel(e){let t=typeof e==`number`?e:M.findIndex(t=>t.name===e);t<0||t>=M.length||t===this.#r||(this.#r=t,this.#u())}update(e,t){this.#a||(this.#c-=t,e>21?(this.#o+=t,this.#s=0):e<12.5?(this.#s+=t,this.#o=0):(this.#o=0,this.#s=0),!(this.#c>0)&&(this.#o>1.5&&this.#r>0?(this.#r--,this.#c=3,this.#o=0,this.#u()):this.#s>6&&this.#r<M.length-1&&(this.#r++,this.#c=6,this.#s=0,this.#u())))}#u(e){let t=e??Math.min(M[this.#r].dpr,this.#i);t===this.#e.getPixelRatio()?e!==void 0&&this.#t?.(t):(this.#e.setPixelRatio(t),this.#t?.(t));let n=this.tier;this.#n?.(n);for(let e of this.#l)e(n)}},P={en:{title:`Storm Grid`,loading:`Loading…`,city_n:`CITY {n}`,city_mode:`CITY {n} · {theme}`,theme_downtown:`DOWNTOWN`,theme_harbour:`HARBOUR`,theme_oldtown:`OLD TOWN`,theme_hills:`HILL TOWERS`,theme_neonbay:`NEON BAY`,theme_snowpeak:`SNOW PEAK`,theme_desert:`DESERT SPIRES`,theme_skyport:`SKY PORT`,hint_hold:`Hold to charge, release to strike`,hint_sub_pointer:`Let go in the gold band: SUPERCHARGE`,hint_sub_keys:`Space: charge · Arrows / {keys}: aim`,pill_band:`Let go in the GOLD band!`,powered:`POWERED`,strikes:`Strikes`,blocks:`Blocks`,best_chain:`Best chain`,supercharge:`SUPERCHARGE!`,fizzle:`FIZZLE…`,fork_x:`FORK ×{n}`,chain_x:`CHAIN ×{n}`,block_powered:`BLOCK POWERED`,full_power:`FULL POWER!`,city_cleared:`{p}% POWERED`,city_dark:`{p}% POWERED`,so_close:`SO CLOSE!`,near_full_1:`{p}% - one building from FULL POWER`,near_full_n:`{p}% - {k} buildings from FULL POWER`,near_pass:`{p}% - {d}% short of the next city`,near_plate_1:`{p}% - one building short of ×{m}`,near_plate_n:`{p}% - {k} buildings short of ×{m}`,retry_note:`Power {p}% to reach the next city`,jackpot:`JACKPOT ×{m}`,stat_lit:`Lit {a}/{b}`,stat_blocks:`Blocks {a}/{b}`,stat_chain:`Best chain {n}`,one_more_strike:`One more strike`,finish:`Finish`,claim:`Claim`,claim_x:`Claim ×{m}`,next:`Next city`,retry:`Retry`,paused:`Paused`,click_resume:`Click to resume`,tap_resume:`Tap to resume`,pause_keys:`P: pause · M: sound`,up_voltage:`Voltage`,up_fork:`Fork`,up_capacitor:`Capacitor`,up_strikes:`Strikes`,up_gold:`Gold rods`,up_fx_voltage:`+1 hop`,up_fx_fork:`+1% forks`,up_fx_capacitor:`Wider band`,up_fx_strikes:`+1 strike`,up_fx_gold:`+1 gold rod`,lvl:`LV {n}`,max:`MAX`,no_video:`No video available right now. Try again later.`,adblock_notice:`Unavailable with an ad blocker`,sound_on:`Sound on`,sound_off:`Sound off`,muted_by_platform:`Muted by CrazyGames settings`,start_boost:`+{n} strikes`,boost_title:`SUPERCHARGED START`,boosted:`+{n} STRIKES!`,skins:`Bolts`,unlock_random:`Random`,new_skin:`New bolt!`,all_skins:`All bolts unlocked!`,need_coins:`Not enough coins`,free_coins_in:`Free coins again in {t}`,try_it:`Try it`,try_once:`Try it free for one city`,tried_already:`Already tried - unlock it with coins`,trying:`Trying {name} for one city!`,trial_over:`{name} trial over`,locked:`Locked`,owned_count:`{a}/{b} bolts`,gift_title:`DAILY GIFT`,gift_mode:`DAY {n} STREAK · ×{m}`,gift_note:`Come back tomorrow for day {n}`,collect:`Collect`,collect_x:`Collect ×{m}`,skin_cyan:`Storm Cyan`,skin_magenta:`Magenta`,skin_solar:`Solar Gold`,skin_plasma:`Plasma Green`,skin_ember:`Ember`,skin_frost:`Frost`,skin_violet:`Violet`,skin_ruby:`Ruby`,skin_rainbow:`Neon Rainbow`,skin_void:`Void`,skin_aurora:`Aurora`,skin_legend:`Legend White-Gold`}},F=`en`;function ee(e){let t=(new URLSearchParams(location.search).get(`lang`)||e||`en`).slice(0,2).toLowerCase();return F=P[t]?t:`en`,document.documentElement.lang=F,F}function I(e,t={}){return(P[F][e]??P.en[e]??e).replace(/\{(\w+)\}/g,(e,n)=>t[n]??`{${n}}`)}Object.keys(P);var L=1e3,R=1001,te=1002,z=1003,ne=1004,B=1005,V=1006,re=1007,ie=1008,H=1009,ae=1010,U=1011,W=1012,oe=1013,se=1014,ce=1015,le=1016,G=1017,K=1018,ue=1020,de=35902,fe=35899,pe=1021,me=1022,he=1023,ge=1026,_e=1027,ve=1028,ye=1029,q=1030,be=1031,xe=1033,Se=33776,Ce=33777,we=33778,J=33779,Te=35840,Ee=35841,De=35842,Oe=35843,ke=36196,Ae=37492,je=37496,Me=37488,Ne=37489,Pe=37490,Fe=37491,Ie=37808,Le=37809,Re=37810,ze=37811,Be=37812,Ve=37813,He=37814,Ue=37815,We=37816,Ge=37817,Ke=37818,qe=37819,Je=37820,Ye=37821,Xe=36492,Ze=36494,Qe=36495,$e=36283,et=36284,tt=36285,nt=36286,rt=2300,it=2301,at=2302,ot=2303,st=2400,ct=2401,lt=2402,ut=3200,dt=`srgb`,ft=`srgb-linear`,pt=`linear`,mt=`srgb`,ht=7680,gt=35044,_t=35048,vt=2e3;function yt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function bt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function xt(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function St(){let e=xt(`canvas`);return e.style.display=`block`,e}var Ct={};function wt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Tt(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function Y(...e){e=Tt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Et(...e){e=Tt(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Dt(...e){let t=e.join(` `);t in Ct||(Ct[t]=!0,Y(...e))}function Ot(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var kt={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},At=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},jt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Mt=1234567,Nt=Math.PI/180,Pt=180/Math.PI;function Ft(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(jt[e&255]+jt[e>>8&255]+jt[e>>16&255]+jt[e>>24&255]+`-`+jt[t&255]+jt[t>>8&255]+`-`+jt[t>>16&15|64]+jt[t>>24&255]+`-`+jt[n&63|128]+jt[n>>8&255]+`-`+jt[n>>16&255]+jt[n>>24&255]+jt[r&255]+jt[r>>8&255]+jt[r>>16&255]+jt[r>>24&255]).toLowerCase()}function It(e,t,n){return Math.max(t,Math.min(n,e))}function Lt(e,t){return(e%t+t)%t}function Rt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function zt(e,t,n){return e===t?0:(n-e)/(t-e)}function Bt(e,t,n){return(1-n)*e+n*t}function Vt(e,t,n,r){return Bt(e,t,1-Math.exp(-n*r))}function Ht(e,t=1){return t-Math.abs(Lt(e,t*2)-t)}function Ut(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Wt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Gt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function Kt(e,t){return e+Math.random()*(t-e)}function qt(e){return e*(.5-Math.random())}function Jt(e){e!==void 0&&(Mt=e);let t=Mt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Yt(e){return e*Nt}function Xt(e){return e*Pt}function Zt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Qt(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function $t(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function en(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:Y(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function tn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function nn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var rn={DEG2RAD:Nt,RAD2DEG:Pt,generateUUID:Ft,clamp:It,euclideanModulo:Lt,mapLinear:Rt,inverseLerp:zt,lerp:Bt,damp:Vt,pingpong:Ht,smoothstep:Ut,smootherstep:Wt,randInt:Gt,randFloat:Kt,randFloatSpread:qt,seededRandom:Jt,degToRad:Yt,radToDeg:Xt,isPowerOfTwo:Zt,ceilPowerOfTwo:Qt,floorPowerOfTwo:$t,setQuaternionFromProperEuler:en,normalize:nn,denormalize:tn},X=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=It(this.x,e.x,t.x),this.y=It(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=It(this.x,e,t),this.y=It(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(It(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(It(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},an=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:Y(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(It(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Z=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=It(this.x,e.x,t.x),this.y=It(this.y,e.y,t.y),this.z=It(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=It(this.x,e,t),this.y=It(this.y,e,t),this.z=It(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(It(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return on.copy(this).projectOnVector(e),this.sub(on)}reflect(e){return this.sub(on.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(It(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},on=new Z,sn=new an,cn=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Dt(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(ln.makeScale(e,t)),this}rotate(e){return Dt(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(ln.makeRotation(-e)),this}translate(e,t){return Dt(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(ln.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},ln=new cn,un=new cn().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),dn=new cn().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function fn(){let e={enabled:!0,workingColorSpace:ft,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n?e:(this.spaces[t].transfer===`srgb`&&(e.r=mn(e.r),e.g=mn(e.g),e.b=mn(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=hn(e.r),e.g=hn(e.g),e.b=hn(e.b)),e)},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?pt:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Dt(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Dt(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[ft]:{primaries:t,whitePoint:r,transfer:pt,toXYZ:un,fromXYZ:dn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:dt},outputColorSpaceConfig:{drawingBufferColorSpace:dt}},[dt]:{primaries:t,whitePoint:r,transfer:mt,toXYZ:un,fromXYZ:dn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:dt}}}),e}var pn=fn();function mn(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function hn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var gn,_n=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{gn===void 0&&(gn=xt(`canvas`)),gn.width=e.width,gn.height=e.height;let t=gn.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=gn}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=xt(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=mn(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(mn(t[e]/255)*255):t[e]=mn(t[e]);return{data:t,width:e.width,height:e.height}}return Y(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},vn=0,yn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:vn++}),this.uuid=Ft(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(bn(r[t].image)):e.push(bn(r[t]))}else e=bn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function bn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?_n.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Y(`Texture: Unable to serialize Texture.`),{})}var xn=0,Sn=new Z,Cn=class e extends At{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=R,i=R,a=V,o=ie,s=he,c=H,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:xn++}),this.uuid=Ft(),this.name=``,this.source=new yn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new X(0,0),this.repeat=new X(1,1),this.center=new X(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new cn,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Sn).x}get height(){return this.source.getSize(Sn).y}get depth(){return this.source.getSize(Sn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Y(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Y(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case L:e.x-=Math.floor(e.x);break;case R:e.x=e.x<0?0:1;break;case te:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case L:e.y-=Math.floor(e.y);break;case R:e.y=e.y<0?0:1;break;case te:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Cn.DEFAULT_IMAGE=null,Cn.DEFAULT_MAPPING=300,Cn.DEFAULT_ANISOTROPY=1;var wn=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=It(this.x,e.x,t.x),this.y=It(this.y,e.y,t.y),this.z=It(this.z,e.z,t.z),this.w=It(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=It(this.x,e,t),this.y=It(this.y,e,t),this.z=It(this.z,e,t),this.w=It(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(It(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Tn=class extends At{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:V,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new wn(0,0,e,t),this.scissorTest=!1,this.viewport=new wn(0,0,e,t),this.textures=[];let r=new Cn({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:V,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new yn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},En=class extends Tn{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Dn=class extends Cn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=z,this.minFilter=z,this.wrapR=R,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},On=class extends Cn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=z,this.minFilter=z,this.wrapR=R,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},kn=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/An.setFromMatrixColumn(e,0).length(),i=1/An.setFromMatrixColumn(e,1).length(),a=1/An.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mn,e,Nn)}lookAt(e,t,n){let r=this.elements;return In.subVectors(e,t),In.lengthSq()===0&&(In.z=1),In.normalize(),Pn.crossVectors(n,In),Pn.lengthSq()===0&&(Math.abs(n.z)===1?In.x+=1e-4:In.z+=1e-4,In.normalize(),Pn.crossVectors(n,In)),Pn.normalize(),Fn.crossVectors(In,Pn),r[0]=Pn.x,r[4]=Fn.x,r[8]=In.x,r[1]=Pn.y,r[5]=Fn.y,r[9]=In.y,r[2]=Pn.z,r[6]=Fn.z,r[10]=In.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],ee=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*ee,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*ee,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*ee,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*ee,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=An.set(r[0],r[1],r[2]).length(),o=An.set(r[4],r[5],r[6]).length(),s=An.set(r[8],r[9],r[10]).length();i<0&&(a=-a),jn.copy(this);let c=1/a,l=1/o,u=1/s;return jn.elements[0]*=c,jn.elements[1]*=c,jn.elements[2]*=c,jn.elements[4]*=l,jn.elements[5]*=l,jn.elements[6]*=l,jn.elements[8]*=u,jn.elements[9]*=u,jn.elements[10]*=u,t.setFromRotationMatrix(jn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=vt,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=vt,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},An=new Z,jn=new kn,Mn=new Z(0,0,0),Nn=new Z(1,1,1),Pn=new Z,Fn=new Z,In=new Z,Ln=new kn,Rn=new an,zn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(It(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-It(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(It(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-It(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(It(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-It(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:Y(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Ln.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ln,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Rn.setFromEuler(this),this.setFromQuaternion(Rn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};zn.DEFAULT_ORDER=`XYZ`;var Bn=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&(1<<e|0))}},Vn=0,Hn=new Z,Un=new an,Wn=new kn,Gn=new Z,Kn=new Z,qn=new Z,Jn=new an,Yn=new Z(1,0,0),Xn=new Z(0,1,0),Zn=new Z(0,0,1),Qn={type:`added`},$n={type:`removed`},er={type:`childadded`,child:null},tr={type:`childremoved`,child:null},nr=class e extends At{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vn++}),this.uuid=Ft(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Z,n=new zn,r=new an,i=new Z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new kn},normalMatrix:{value:new cn}}),this.matrix=new kn,this.matrixWorld=new kn,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Un.setFromAxisAngle(e,t),this.quaternion.multiply(Un),this}rotateOnWorldAxis(e,t){return Un.setFromAxisAngle(e,t),this.quaternion.premultiply(Un),this}rotateX(e){return this.rotateOnAxis(Yn,e)}rotateY(e){return this.rotateOnAxis(Xn,e)}rotateZ(e){return this.rotateOnAxis(Zn,e)}translateOnAxis(e,t){return Hn.copy(e).applyQuaternion(this.quaternion),this.position.add(Hn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Yn,e)}translateY(e){return this.translateOnAxis(Xn,e)}translateZ(e){return this.translateOnAxis(Zn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Gn.copy(e):Gn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),Kn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wn.lookAt(Kn,Gn,this.up):Wn.lookAt(Gn,Kn,this.up),this.quaternion.setFromRotationMatrix(Wn),r&&(Wn.extractRotation(r.matrixWorld),Un.setFromRotationMatrix(Wn),this.quaternion.premultiply(Un.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(Et(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qn),er.child=e,this.dispatchEvent(er),er.child=null):Et(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent($n),tr.child=e,this.dispatchEvent(tr),tr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qn),er.child=e,this.dispatchEvent(er),er.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Kn,e,qn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Kn,Jn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};nr.DEFAULT_UP=new Z(0,1,0),nr.DEFAULT_MATRIX_AUTO_UPDATE=!0,nr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var rr=class extends nr{constructor(){super(),this.isGroup=!0,this.type=`Group`}},ir={type:`move`},ar=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ir)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new rr;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},or={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},sr={h:0,s:0,l:0},cr={h:0,s:0,l:0};function lr(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=dt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,pn.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=pn.workingColorSpace){return this.r=e,this.g=t,this.b=n,pn.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=pn.workingColorSpace){if(e=Lt(e,1),t=It(t,0,1),n=It(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=lr(i,r,e+1/3),this.g=lr(i,r,e),this.b=lr(i,r,e-1/3)}return pn.colorSpaceToWorking(this,r),this}setStyle(e,t=dt){function n(t){t!==void 0&&parseFloat(t)<1&&Y(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:Y(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);Y(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=dt){let n=or[e.toLowerCase()];return n===void 0?Y(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=mn(e.r),this.g=mn(e.g),this.b=mn(e.b),this}copyLinearToSRGB(e){return this.r=hn(e.r),this.g=hn(e.g),this.b=hn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=dt){return pn.workingToColorSpace(ur.copy(this),e),Math.round(It(ur.r*255,0,255))*65536+Math.round(It(ur.g*255,0,255))*256+Math.round(It(ur.b*255,0,255))}getHexString(e=dt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=pn.workingColorSpace){pn.workingToColorSpace(ur.copy(this),t);let n=ur.r,r=ur.g,i=ur.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=pn.workingColorSpace){return pn.workingToColorSpace(ur.copy(this),t),e.r=ur.r,e.g=ur.g,e.b=ur.b,e}getStyle(e=dt){pn.workingToColorSpace(ur.copy(this),e);let t=ur.r,n=ur.g,r=ur.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(sr),this.setHSL(sr.h+e,sr.s+t,sr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(sr),e.getHSL(cr);let n=Bt(sr.h,cr.h,t),r=Bt(sr.s,cr.s,t),i=Bt(sr.l,cr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ur=new Q;Q.NAMES=or;var dr=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new Q(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},fr=class extends nr{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new zn,this.environmentIntensity=1,this.environmentRotation=new zn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},pr=new Z,mr=new Z,hr=new Z,gr=new Z,_r=new Z,vr=new Z,yr=new Z,br=new Z,xr=new Z,Sr=new Z,Cr=new wn,wr=new wn,Tr=new wn,Er=class e{constructor(e=new Z,t=new Z,n=new Z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),pr.subVectors(e,t),r.cross(pr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){pr.subVectors(r,t),mr.subVectors(n,t),hr.subVectors(e,t);let a=pr.dot(pr),o=pr.dot(mr),s=pr.dot(hr),c=mr.dot(mr),l=mr.dot(hr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,gr)!==null&&gr.x>=0&&gr.y>=0&&gr.x+gr.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,gr)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,gr.x),s.addScaledVector(a,gr.y),s.addScaledVector(o,gr.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Cr.setScalar(0),wr.setScalar(0),Tr.setScalar(0),Cr.fromBufferAttribute(e,t),wr.fromBufferAttribute(e,n),Tr.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Cr,i.x),a.addScaledVector(wr,i.y),a.addScaledVector(Tr,i.z),a}static isFrontFacing(e,t,n,r){return pr.subVectors(n,t),mr.subVectors(e,t),pr.cross(mr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pr.subVectors(this.c,this.b),mr.subVectors(this.a,this.b),pr.cross(mr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;_r.subVectors(r,n),vr.subVectors(i,n),br.subVectors(e,n);let s=_r.dot(br),c=vr.dot(br);if(s<=0&&c<=0)return t.copy(n);xr.subVectors(e,r);let l=_r.dot(xr),u=vr.dot(xr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(_r,a);Sr.subVectors(e,i);let f=_r.dot(Sr),p=vr.dot(Sr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(vr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return yr.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(yr,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(_r,a).addScaledVector(vr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Dr=class{constructor(e=new Z(1/0,1/0,1/0),t=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(kr.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(kr.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=kr.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,kr):kr.fromBufferAttribute(r,t),kr.applyMatrix4(e.matrixWorld),this.expandByPoint(kr);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Ar.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Ar.copy(e.boundingBox)),Ar.applyMatrix4(e.matrixWorld),this.union(Ar)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kr),kr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Lr),Rr.subVectors(this.max,Lr),jr.subVectors(e.a,Lr),Mr.subVectors(e.b,Lr),Nr.subVectors(e.c,Lr),Pr.subVectors(Mr,jr),Fr.subVectors(Nr,Mr),Ir.subVectors(jr,Nr);let t=[0,-Pr.z,Pr.y,0,-Fr.z,Fr.y,0,-Ir.z,Ir.y,Pr.z,0,-Pr.x,Fr.z,0,-Fr.x,Ir.z,0,-Ir.x,-Pr.y,Pr.x,0,-Fr.y,Fr.x,0,-Ir.y,Ir.x,0];return!Vr(t,jr,Mr,Nr,Rr)||(t=[1,0,0,0,1,0,0,0,1],!Vr(t,jr,Mr,Nr,Rr))?!1:(zr.crossVectors(Pr,Fr),t=[zr.x,zr.y,zr.z],Vr(t,jr,Mr,Nr,Rr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Or[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Or[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Or[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Or[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Or[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Or[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Or[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Or[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Or),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Or=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],kr=new Z,Ar=new Dr,jr=new Z,Mr=new Z,Nr=new Z,Pr=new Z,Fr=new Z,Ir=new Z,Lr=new Z,Rr=new Z,zr=new Z,Br=new Z;function Vr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Br.fromArray(e,a);let o=i.x*Math.abs(Br.x)+i.y*Math.abs(Br.y)+i.z*Math.abs(Br.z),s=t.dot(Br),c=n.dot(Br),l=r.dot(Br);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Hr=new Z,Ur=new X,Wr=0,Gr=class extends At{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Wr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=gt,this.updateRanges=[],this.gpuType=ce,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyMatrix3(e),this.setXY(t,Ur.x,Ur.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Hr.fromBufferAttribute(this,t),Hr.applyMatrix3(e),this.setXYZ(t,Hr.x,Hr.y,Hr.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Hr.fromBufferAttribute(this,t),Hr.applyMatrix4(e),this.setXYZ(t,Hr.x,Hr.y,Hr.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Hr.fromBufferAttribute(this,t),Hr.applyNormalMatrix(e),this.setXYZ(t,Hr.x,Hr.y,Hr.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Hr.fromBufferAttribute(this,t),Hr.transformDirection(e),this.setXYZ(t,Hr.x,Hr.y,Hr.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=tn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=nn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=tn(t,this.array)),t}setX(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=tn(t,this.array)),t}setY(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=tn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=tn(t,this.array)),t}setW(e,t){return this.normalized&&(t=nn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),n=nn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),n=nn(n,this.array),r=nn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=nn(t,this.array),n=nn(n,this.array),r=nn(r,this.array),i=nn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},Kr=class extends Gr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},qr=class extends Gr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Jr=class extends Gr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Yr=new Dr,Xr=new Z,Zr=new Z,Qr=class{constructor(e=new Z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Yr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Xr.subVectors(e,this.center);let t=Xr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Xr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Xr.copy(e.center).add(Zr)),this.expandByPoint(Xr.copy(e.center).sub(Zr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},$r=0,ei=new kn,ti=new nr,ni=new Z,ri=new Dr,ii=new Dr,ai=new Z,oi=class e extends At{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$r++}),this.uuid=Ft(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(yt(e)?qr:Kr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new cn().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ei.makeRotationFromQuaternion(e),this.applyMatrix4(ei),this}rotateX(e){return ei.makeRotationX(e),this.applyMatrix4(ei),this}rotateY(e){return ei.makeRotationY(e),this.applyMatrix4(ei),this}rotateZ(e){return ei.makeRotationZ(e),this.applyMatrix4(ei),this}translate(e,t,n){return ei.makeTranslation(e,t,n),this.applyMatrix4(ei),this}scale(e,t,n){return ei.makeScale(e,t,n),this.applyMatrix4(ei),this}lookAt(e){return ti.lookAt(e),ti.updateMatrix(),this.applyMatrix4(ti.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ni).negate(),this.translate(ni.x,ni.y,ni.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Jr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&Y(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Et(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ri.setFromBufferAttribute(n),this.morphTargetsRelative?(ai.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(ai),ai.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(ai)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Et(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qr);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Et(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Z,1/0);return}if(e){let n=this.boundingSphere.center;if(ri.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ii.setFromBufferAttribute(n),this.morphTargetsRelative?(ai.addVectors(ri.min,ii.min),ri.expandByPoint(ai),ai.addVectors(ri.max,ii.max),ri.expandByPoint(ai)):(ri.expandByPoint(ii.min),ri.expandByPoint(ii.max))}ri.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)ai.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(ai));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)ai.fromBufferAttribute(a,t),o&&(ni.fromBufferAttribute(e,t),ai.add(ni)),r=Math.max(r,n.distanceToSquared(ai))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Et(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Et(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Gr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new Z,s[e]=new Z;let c=new Z,l=new Z,u=new Z,d=new X,f=new X,p=new X,m=new Z,h=new Z;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new Z,y=new Z,b=new Z,x=new Z;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Gr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Z,i=new Z,a=new Z,o=new Z,s=new Z,c=new Z,l=new Z,u=new Z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)ai.fromBufferAttribute(e,t),ai.normalize(),e.setXYZ(t,ai.x,ai.y,ai.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Gr(a,r,i)}if(this.index===null)return Y(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},si=new Z,ci=new Z,li=new cn,ui=class{constructor(e=new Z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=si.subVectors(n,t).cross(ci.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(si),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||li.getNormalMatrix(e),r=this.coplanarPoint(si).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},di=0,fi=class extends At{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:di++}),this.uuid=Ft(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ht,this.stencilZFail=ht,this.stencilZPass=ht,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Y(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Y(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new ui().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new X().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new X().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},pi=new Z,mi=new Z,hi=new Z,gi=new Z,_i=class{constructor(e=new Z,t=new Z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=pi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pi.copy(this.origin).addScaledVector(this.direction,t),pi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){mi.copy(e).add(t).multiplyScalar(.5),hi.copy(t).sub(e).normalize(),gi.copy(this.origin).sub(mi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(hi),o=gi.dot(this.direction),s=-gi.dot(hi),c=gi.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(mi).addScaledVector(hi,d),f}intersectSphere(e,t){if(e.radius<0)return null;pi.subVectors(e.center,this.origin);let n=pi.dot(this.direction),r=pi.dot(pi)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,pi)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,ee=1/w,I=T-P*D,L=E-F*D,R=O-P*A,te=k-F*A,z=j-P*N,ne=M-F*N,B=z*te-ne*R,V=I*ne-L*z,re=R*L-te*I;if(r){if(B<0||V<0||re<0)return null}else if((B<0||V<0||re<0)&&(B>0||V>0||re>0))return null;let ie=B+V+re;if(ie===0)return null;let H=ee*(B*D+V*A+re*N);return(ie>0?H<0:H>0)?null:this.at(H/ie,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},vi=class extends fi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},yi=new kn,bi=new _i,xi=new Qr,Si=new Z,Ci=new Z,wi=new Z,Ti=new Z,Ei=new Z,Di=new Z,Oi=new Z,ki=new Z,Ai=class extends nr{constructor(e=new oi,t=new vi){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Di.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Ei.fromBufferAttribute(s,e),a?Di.addScaledVector(Ei,r):Di.addScaledVector(Ei.sub(t),r))}t.add(Di)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xi.copy(n.boundingSphere),xi.applyMatrix4(i),bi.copy(e.ray).recast(e.near),!(xi.containsPoint(bi.origin)===!1&&(bi.intersectSphere(xi,Si)===null||bi.origin.distanceToSquared(Si)>(e.far-e.near)**2))&&(yi.copy(i).invert(),bi.copy(e.ray).applyMatrix4(yi),(n.boundingBox===null||bi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,bi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Mi(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Mi(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Mi(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Mi(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ji(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ki.copy(s),ki.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ki);return l<n.near||l>n.far?null:{distance:l,point:ki.clone(),object:e}}function Mi(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Ci),e.getVertexPosition(c,wi),e.getVertexPosition(l,Ti);let u=ji(e,t,n,r,Ci,wi,Ti,Oi);if(u){let e=new Z;Er.getBarycoord(Oi,Ci,wi,Ti,e),i&&(u.uv=Er.getInterpolatedAttribute(i,s,c,l,e,new X)),a&&(u.uv1=Er.getInterpolatedAttribute(a,s,c,l,e,new X)),o&&(u.normal=Er.getInterpolatedAttribute(o,s,c,l,e,new Z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Z,materialIndex:0};Er.getNormal(Ci,wi,Ti,t.normal),u.face=t,u.barycoord=e}return u}var Ni=class extends Cn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=z,l=z,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Pi=class extends Gr{constructor(e,t,n,r=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Fi=new kn,Ii=new kn,Li=[],Ri=new Dr,zi=new kn,Bi=new Ai,Vi=new Qr,Hi=class extends Ai{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Pi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let e=0;e<n;e++)this.setMatrixAt(e,zi)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Dr),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fi),Ri.copy(e.boundingBox).applyMatrix4(Fi),this.boundingBox.union(Ri)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Fi),Vi.copy(e.boundingSphere).applyMatrix4(Fi),this.boundingSphere.union(Vi)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,r=this.morphTexture.source.data.data,i=e*(n.length+1)+1;for(let e=0;e<n.length;e++)n[e]=r[i+e]}raycast(e,t){let n=this.matrixWorld,r=this.count;if(Bi.geometry=this.geometry,Bi.material=this.material,Bi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vi.copy(this.boundingSphere),Vi.applyMatrix4(n),e.ray.intersectsSphere(Vi)!==!1))for(let i=0;i<r;i++){this.getMatrixAt(i,Fi),Ii.multiplyMatrices(n,Fi),Bi.matrixWorld=Ii,Bi.raycast(e,Li);for(let e=0,n=Li.length;e<n;e++){let n=Li[e];n.instanceId=i,n.object=this,t.push(n)}Li.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Pi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ni(new Float32Array(r*this.count),r,this.count,ve,ce));let i=this.morphTexture.source.data.data,a=0;for(let e=0;e<n.length;e++)a+=n[e];let o=this.geometry.morphTargetsRelative?1:1-a,s=r*e;return i[s]=o,i.set(n,s+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ui=new Qr,Wi=new X(.5,.5),Gi=new Z,Ki=class{constructor(e=new ui,t=new ui,n=new ui,r=new ui,i=new ui,a=new ui){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vt,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ui.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ui.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ui)}intersectsSprite(e){return Ui.center.set(0,0,0),Ui.radius=.7071067811865476+Wi.distanceTo(e.center),Ui.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ui)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Gi.x=r.normal.x>0?e.max.x:e.min.x,Gi.y=r.normal.y>0?e.max.y:e.min.y,Gi.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Gi)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},qi=class extends Cn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ji=class extends Cn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Yi=class extends Cn{constructor(e,t,n=se,r,i,a,o=z,s=z,c,l=ge,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new yn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Xi=class extends Yi{constructor(e,t=se,n=301,r,i,a=z,o=z,s,c=ge){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Zi=class extends Cn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Qi=class e extends oi{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Jr(c,3)),this.setAttribute(`normal`,new Jr(l,3)),this.setAttribute(`uv`,new Jr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},$i=class e extends oi{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new Jr(u,3)),this.setAttribute(`normal`,new Jr(d,3)),this.setAttribute(`uv`,new Jr(f,2));function _(){let a=new Z,_=new Z,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new X,m=new Z,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ea=class e extends $i{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ta=class e extends oi{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new Jr(i,3)),this.setAttribute(`normal`,new Jr(i.slice(),3)),this.setAttribute(`uv`,new Jr(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new Z,r=new Z,i=new Z;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new Z;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new Z;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new Z,t=new Z,n=new Z,r=new Z,o=new X,s=new X,c=new X;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},na=class e extends ta{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=1/n,i=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-n,0,-r,n,0,r,-n,0,r,n,-r,-n,0,-r,n,0,r,-n,0,r,n,0,-n,0,-r,n,0,-r,-n,0,r,n,0,r];super(i,[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9],e,t),this.type=`DodecahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},ra=class e extends ta{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},ia=class e extends ta{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},aa=class e extends oi{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Jr(p,3)),this.setAttribute(`normal`,new Jr(m,3)),this.setAttribute(`uv`,new Jr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},oa=class e extends oi{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new Z,p=new X;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new Jr(s,3)),this.setAttribute(`normal`,new Jr(c,3)),this.setAttribute(`uv`,new Jr(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},sa=class e extends oi{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new Z,d=new Z,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new Jr(p,3)),this.setAttribute(`normal`,new Jr(m,3)),this.setAttribute(`uv`,new Jr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},ca=class extends fi{constructor(e){super(),this.isShadowMaterial=!0,this.type=`ShadowMaterial`,this.color=new Q(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function la(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(da(i))i.isRenderTargetTexture?(Y(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(da(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function ua(e){let t={};for(let n=0;n<e.length;n++){let r=la(e[n]);for(let e in r)t[e]=r[e]}return t}function da(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function fa(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function pa(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:pn.workingColorSpace}var ma={clone:la,merge:ua},ha=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ga=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,_a=class extends fi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ha,this.fragmentShader=ga,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=la(e.uniforms),this.uniformsGroups=fa(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new X().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new wn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new cn().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new kn().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},va=class extends _a{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},ya=class extends fi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new Q(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},ba=class extends ya{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:``,PHYSICAL:``},this.type=`MeshPhysicalMaterial`,this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new X(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return It(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Q(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Q(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Q(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:``,PHYSICAL:``},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}},xa=class extends fi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new Q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new zn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Sa=class extends fi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=ut,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ca=class extends fi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function wa(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Ta(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ea=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Da=class extends Ea{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:st,endingEnd:st}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case ct:i=e,o=2*t-n;break;case lt:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case ct:a=e,s=2*n-t;break;case lt:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Oa=class extends Ea{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},ka=class extends Ea{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Aa=class extends Ea{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Na(n,t,g,y,r);i[p]=ja(x,o,_,b,m)}return i}};function ja(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Ma(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Na(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=ja(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Ma(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Pa=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=wa(t,this.TimeBufferType),this.values=wa(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:wa(e.times,Array),values:wa(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Ta(e.settings)&&(n.settings={inTangents:wa(e.settings.inTangents,Array),outTangents:wa(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new ka(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Oa(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Da(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Aa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case rt:t=this.InterpolantFactoryMethodDiscrete;break;case it:t=this.InterpolantFactoryMethodLinear;break;case at:t=this.InterpolantFactoryMethodSmooth;break;case ot:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return Y(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return rt;case this.InterpolantFactoryMethodLinear:return it;case this.InterpolantFactoryMethodSmooth:return at;case this.InterpolantFactoryMethodBezier:return ot}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Ta(this.settings)&&(Fa(this.settings.inTangents,e),Fa(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Et(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(Et(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){Et(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){Et(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&bt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){Et(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===at,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Ta(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Fa(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Pa.prototype.ValueTypeName=``,Pa.prototype.TimeBufferType=Float32Array,Pa.prototype.ValueBufferType=Float32Array,Pa.prototype.DefaultInterpolation=it;var Ia=class extends Pa{constructor(e,t,n){super(e,t,n)}};Ia.prototype.ValueTypeName=`bool`,Ia.prototype.ValueBufferType=Array,Ia.prototype.DefaultInterpolation=rt,Ia.prototype.InterpolantFactoryMethodLinear=void 0,Ia.prototype.InterpolantFactoryMethodSmooth=void 0;var La=class extends Pa{constructor(e,t,n,r){super(e,t,n,r)}};La.prototype.ValueTypeName=`color`;var Ra=class extends Pa{constructor(e,t,n,r){super(e,t,n,r)}};Ra.prototype.ValueTypeName=`number`;var za=class extends Ea{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)an.slerpFlat(i,0,a,c-o,a,c,s);return i}},Ba=class extends Pa{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new za(this.times,this.values,this.getValueSize(),e)}};Ba.prototype.ValueTypeName=`quaternion`,Ba.prototype.InterpolantFactoryMethodSmooth=void 0;var Va=class extends Pa{constructor(e,t,n){super(e,t,n)}};Va.prototype.ValueTypeName=`string`,Va.prototype.ValueBufferType=Array,Va.prototype.DefaultInterpolation=rt,Va.prototype.InterpolantFactoryMethodLinear=void 0,Va.prototype.InterpolantFactoryMethodSmooth=void 0;var Ha=class extends Pa{constructor(e,t,n,r){super(e,t,n,r)}};Ha.prototype.ValueTypeName=`vector`;var Ua=class extends nr{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new Q(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},Wa=class extends Ua{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(nr.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Q(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Ga=new kn,Ka=new Z,qa=new Z,Ja=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new X(512,512),this.mapType=H,this.map=null,this.mapPass=null,this.matrix=new kn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ki,this._frameExtents=new X(1,1),this._viewportCount=1,this._viewports=[new wn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Ka.setFromMatrixPosition(e.matrixWorld),t.position.copy(Ka),qa.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qa),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Ga.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ga,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ga)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Ya=new Z,Xa=new an,Za=new Z,Qa=class extends nr{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new kn,this.projectionMatrix=new kn,this.projectionMatrixInverse=new kn,this.coordinateSystem=vt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Ya,Xa,Za),Za.x===1&&Za.y===1&&Za.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ya,Xa,Za.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Ya,Xa,Za),Za.x===1&&Za.y===1&&Za.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ya,Xa,Za.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},$a=new Z,eo=new X,to=new X,no=class extends Qa{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Pt*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Nt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Pt*2*Math.atan(Math.tan(Nt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){$a.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set($a.x,$a.y).multiplyScalar(-e/$a.z),$a.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set($a.x,$a.y).multiplyScalar(-e/$a.z)}getViewSize(e,t){return this.getViewBounds(e,eo,to),t.subVectors(to,eo)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Nt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},ro=class extends Ja{constructor(){super(new no(90,1,.5,500)),this.isPointLightShadow=!0}},io=class extends Ua{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new ro}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},ao=class extends Qa{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},oo=class extends Ja{constructor(){super(new ao(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},so=class extends Ua{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(nr.DEFAULT_UP),this.updateMatrix(),this.target=new nr,this.shadow=new oo}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},co=class extends oi{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type=`InstancedBufferGeometry`,this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}},lo=-90,uo=1,fo=class extends nr{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new no(lo,uo,e,t);r.layers=this.layers,this.add(r);let i=new no(lo,uo,e,t);i.layers=this.layers,this.add(i);let a=new no(lo,uo,e,t);a.layers=this.layers,this.add(a);let o=new no(lo,uo,e,t);o.layers=this.layers,this.add(o);let s=new no(lo,uo,e,t);s.layers=this.layers,this.add(s);let c=new no(lo,uo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},po=class extends no{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},mo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=ho.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function ho(){this._document.hidden===!1&&this.reset()}var go=`\\[\\]\\.:\\/`,_o=RegExp(`[\\[\\]\\.:\\/]`,`g`),vo=`[^\\[\\]\\.:\\/]`,yo=`[^`+go.replace(`\\.`,``)+`]`,bo=`((?:WC+[\\/:])*)`.replace(`WC`,vo),xo=`(WCOD+)?`.replace(`WCOD`,yo),So=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,vo),Co=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,vo),wo=RegExp(`^`+bo+xo+So+Co+`$`),To=[`material`,`materials`,`bones`,`map`],Eo=class{constructor(e,t,n){let r=n||Do.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Do=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(_o,``)}static parseTrackName(e){let t=wo.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);To.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Y(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){Et(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){Et(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){Et(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){Et(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){Et(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){Et(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){Et(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;Et(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){Et(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){Et(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Do.Composite=Eo,Do.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Do.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Do.prototype.GetterByBindingType=[Do.prototype._getValue_direct,Do.prototype._getValue_array,Do.prototype._getValue_arrayElement,Do.prototype._getValue_toArray],Do.prototype.SetterByBindingTypeAndVersioning=[[Do.prototype._setValue_direct,Do.prototype._setValue_direct_setNeedsUpdate,Do.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Do.prototype._setValue_array,Do.prototype._setValue_array_setNeedsUpdate,Do.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Do.prototype._setValue_arrayElement,Do.prototype._setValue_arrayElement_setNeedsUpdate,Do.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Do.prototype._setValue_fromArray,Do.prototype._setValue_fromArray_setNeedsUpdate,Do.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Oo(e,t,n,r){let i=ko(r);switch(n){case pe:return e*t;case ve:return e*t/i.components*i.byteLength;case ye:return e*t/i.components*i.byteLength;case q:return e*t*2/i.components*i.byteLength;case be:return e*t*2/i.components*i.byteLength;case me:return e*t*3/i.components*i.byteLength;case he:return e*t*4/i.components*i.byteLength;case xe:return e*t*4/i.components*i.byteLength;case Se:case Ce:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case we:case J:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ee:case Oe:return Math.max(e,16)*Math.max(t,8)/4;case Te:case De:return Math.max(e,8)*Math.max(t,8)/2;case ke:case Ae:case Me:case Ne:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case je:case Pe:case Fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Ie:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Le:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Re:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case ze:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Be:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ve:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case He:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Ue:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case We:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case Ge:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Ke:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case qe:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Je:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Ye:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Xe:case Ze:case Qe:return Math.ceil(e/4)*Math.ceil(t/4)*16;case $e:case et:return Math.ceil(e/4)*Math.ceil(t/4)*8;case tt:case nt:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function ko(e){switch(e){case H:case ae:return{byteLength:1,components:1};case W:case U:case le:return{byteLength:2,components:1};case G:case K:return{byteLength:2,components:4};case se:case oe:case ce:return{byteLength:4,components:1};case de:case fe:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?Y(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function Ao(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function jo(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Mo={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},$={common:{diffuse:{value:new Q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new cn},alphaMap:{value:null},alphaMapTransform:{value:new cn},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new cn}},envmap:{envMap:{value:null},envMapRotation:{value:new cn},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new cn}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new cn}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new cn},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new cn},normalScale:{value:new X(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new cn},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new cn}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new cn}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new cn}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Z},probesMax:{value:new Z},probesResolution:{value:new Z}},points:{diffuse:{value:new Q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new cn},alphaTest:{value:0},uvTransform:{value:new cn}},sprite:{diffuse:{value:new Q(16777215)},opacity:{value:1},center:{value:new X(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new cn},alphaMap:{value:null},alphaMapTransform:{value:new cn},alphaTest:{value:0}}},No={basic:{uniforms:ua([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.fog]),vertexShader:Mo.meshbasic_vert,fragmentShader:Mo.meshbasic_frag},lambert:{uniforms:ua([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new Q(0)},envMapIntensity:{value:1}}]),vertexShader:Mo.meshlambert_vert,fragmentShader:Mo.meshlambert_frag},phong:{uniforms:ua([$.common,$.specularmap,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.fog,$.lights,{emissive:{value:new Q(0)},specular:{value:new Q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Mo.meshphong_vert,fragmentShader:Mo.meshphong_frag},standard:{uniforms:ua([$.common,$.envmap,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.roughnessmap,$.metalnessmap,$.fog,$.lights,{emissive:{value:new Q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Mo.meshphysical_vert,fragmentShader:Mo.meshphysical_frag},toon:{uniforms:ua([$.common,$.aomap,$.lightmap,$.emissivemap,$.bumpmap,$.normalmap,$.displacementmap,$.gradientmap,$.fog,$.lights,{emissive:{value:new Q(0)}}]),vertexShader:Mo.meshtoon_vert,fragmentShader:Mo.meshtoon_frag},matcap:{uniforms:ua([$.common,$.bumpmap,$.normalmap,$.displacementmap,$.fog,{matcap:{value:null}}]),vertexShader:Mo.meshmatcap_vert,fragmentShader:Mo.meshmatcap_frag},points:{uniforms:ua([$.points,$.fog]),vertexShader:Mo.points_vert,fragmentShader:Mo.points_frag},dashed:{uniforms:ua([$.common,$.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Mo.linedashed_vert,fragmentShader:Mo.linedashed_frag},depth:{uniforms:ua([$.common,$.displacementmap]),vertexShader:Mo.depth_vert,fragmentShader:Mo.depth_frag},normal:{uniforms:ua([$.common,$.bumpmap,$.normalmap,$.displacementmap,{opacity:{value:1}}]),vertexShader:Mo.meshnormal_vert,fragmentShader:Mo.meshnormal_frag},sprite:{uniforms:ua([$.sprite,$.fog]),vertexShader:Mo.sprite_vert,fragmentShader:Mo.sprite_frag},background:{uniforms:{uvTransform:{value:new cn},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Mo.background_vert,fragmentShader:Mo.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new cn}},vertexShader:Mo.backgroundCube_vert,fragmentShader:Mo.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Mo.cube_vert,fragmentShader:Mo.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Mo.equirect_vert,fragmentShader:Mo.equirect_frag},distance:{uniforms:ua([$.common,$.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Mo.distance_vert,fragmentShader:Mo.distance_frag},shadow:{uniforms:ua([$.lights,$.fog,{color:{value:new Q(0)},opacity:{value:1}}]),vertexShader:Mo.shadow_vert,fragmentShader:Mo.shadow_frag}};No.physical={uniforms:ua([No.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new cn},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new cn},clearcoatNormalScale:{value:new X(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new cn},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new cn},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new cn},sheen:{value:0},sheenColor:{value:new Q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new cn},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new cn},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new cn},transmissionSamplerSize:{value:new X},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new cn},attenuationDistance:{value:0},attenuationColor:{value:new Q(0)},specularColor:{value:new Q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new cn},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new cn},anisotropyVector:{value:new X},anisotropyMap:{value:null},anisotropyMapTransform:{value:new cn}}]),vertexShader:Mo.meshphysical_vert,fragmentShader:Mo.meshphysical_frag};var Po={r:0,b:0,g:0},Fo=new kn,Io=new cn;Io.set(-1,0,0,0,1,0,0,0,1);function Lo(e,t,n,r,i,a){let o=new Q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new Ai(new Qi(1,1,1),new _a({name:`BackgroundCubeMaterial`,uniforms:la(No.backgroundCube.uniforms),vertexShader:No.backgroundCube.vertexShader,fragmentShader:No.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Fo.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Io),l.material.toneMapped=pn.getTransfer(i.colorSpace)!==mt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Ai(new aa(2,2),new _a({name:`BackgroundMaterial`,uniforms:la(No.background.uniforms),vertexShader:No.background.vertexShader,fragmentShader:No.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=pn.getTransfer(i.colorSpace)!==mt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Po,pa(e)),n.buffers.color.setClear(Po.r,Po.g,Po.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function Ro(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function zo(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Bo(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(Y(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&Y(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Vo(e){let t=this,n=null,r=0,i=!1,a=!1,o=new ui,s=new cn,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Ho=4,Uo=6,Wo=20,Go=256,Ko=new ao,qo=new Q,Jo=null,Yo=0,Xo=0,Zo=!1,Qo=new Z,$o=new Z,es=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=Qo}=i;Jo=this._renderer.getRenderTarget(),Yo=this._renderer.getActiveCubeFace(),Xo=this._renderer.getActiveMipmapLevel(),Zo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ss(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=os(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Jo,Yo,Xo),this._renderer.xr.enabled=Zo,e.scissorTest=!1,rs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jo=this._renderer.getRenderTarget(),Yo=this._renderer.getActiveCubeFace(),Xo=this._renderer.getActiveMipmapLevel(),Zo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:V,minFilter:V,generateMipmaps:!1,type:le,format:he,colorSpace:ft,depthBuffer:!1},r=ns(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ns(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ts(r)),this._blurMaterial=as(r,e,t),this._ggxMaterial=is(r,e,t)}return r}_compileMaterial(e){let t=new Ai(new oi,e);this._renderer.compile(t,Ko)}_sceneToCubeUV(e,t,n,r,i){let a=new no(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(qo),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ai(new Qi,new vi({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(qo),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;rs(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ss()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=os());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;rs(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,Ko)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Ho?n-d+Ho:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,rs(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,Ko),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,rs(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,Ko)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];rs(t,3*l*(r>this._lodMax-Ho?r-this._lodMax+Ho:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,Ko)}};function ts(e){let t=[],n=[],r=e,i=e-Ho+1+Uo;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?$o.set(1,r,n):e===1?$o.set(-n,1,-r):e===2?$o.set(-n,r,1):e===3?$o.set(-1,r,-n):e===4?$o.set(-n,-1,r):$o.set(n,r,-1),$o.toArray(l,(e*6+t)*3)}}let u=new oi;u.setAttribute(`position`,new Gr(c,3)),u.setAttribute(`outputDirection`,new Gr(l,3)),n.push(new Ai(u,null)),r>Ho&&r--}return{lodMeshes:n,sizeLods:t}}function ns(e,t,n){let r=new En(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function rs(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function is(e,t,n){return new _a({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:Go,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:cs(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function as(e,t,n){return new _a({name:`SphericalGaussianBlur`,defines:{SAMPLES:Wo,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:cs(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function os(){return new _a({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:cs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function ss(){return new _a({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cs(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function cs(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ls=class extends En{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new qi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Qi(5,5,5),i=new _a({name:`CubemapFromEquirect`,uniforms:la(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Ai(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=V),new fo(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function us(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new ls(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new es(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new es(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function ds(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Dt(`WebGLRenderer: `+e+` extension not supported.`),t}}}function fs(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0?t:(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++,t)}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?qr:Kr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function ps(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function ms(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Et(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function hs(e,t,n){let r=new WeakMap,i=new wn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Dn(h,p,m,u);g.type=ce,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new X(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function gs(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var _s={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function vs(e,t,n,r,i,a){let o=new En(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new oi;l.setAttribute(`position`,new Jr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Jr([0,2,0,0,2,0],2));let u=new va({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Ai(l,u),f=new ao(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new En(t,n,{type:le,depthBuffer:!1,stencilBuffer:!1}),c=new En(t,n,{type:le,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},pn.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=_s[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var ys=new Cn,bs=new Yi(1,1),xs=new Dn,Ss=new On,Cs=new qi,ws=[],Ts=[],Es=new Float32Array(16),Ds=new Float32Array(9),Os=new Float32Array(4);function ks(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=ws[i];if(a===void 0&&(a=new Float32Array(i),ws[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function As(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function js(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Ms(e,t){let n=Ts[t];n===void 0&&(n=new Int32Array(t),Ts[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Ns(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Ps(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(As(n,t))return;e.uniform2fv(this.addr,t),js(n,t)}}function Fs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(As(n,t))return;e.uniform3fv(this.addr,t),js(n,t)}}function Is(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(As(n,t))return;e.uniform4fv(this.addr,t),js(n,t)}}function Ls(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(As(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),js(n,t)}else{if(As(n,r))return;Os.set(r),e.uniformMatrix2fv(this.addr,!1,Os),js(n,r)}}function Rs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(As(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),js(n,t)}else{if(As(n,r))return;Ds.set(r),e.uniformMatrix3fv(this.addr,!1,Ds),js(n,r)}}function zs(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(As(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),js(n,t)}else{if(As(n,r))return;Es.set(r),e.uniformMatrix4fv(this.addr,!1,Es),js(n,r)}}function Bs(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Vs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(As(n,t))return;e.uniform2iv(this.addr,t),js(n,t)}}function Hs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(As(n,t))return;e.uniform3iv(this.addr,t),js(n,t)}}function Us(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(As(n,t))return;e.uniform4iv(this.addr,t),js(n,t)}}function Ws(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function Gs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(As(n,t))return;e.uniform2uiv(this.addr,t),js(n,t)}}function Ks(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(As(n,t))return;e.uniform3uiv(this.addr,t),js(n,t)}}function qs(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(As(n,t))return;e.uniform4uiv(this.addr,t),js(n,t)}}function Js(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(bs.compareFunction=n.isReversedDepthBuffer()?518:515,a=bs):a=ys,n.setTexture2D(t||a,i)}function Ys(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Ss,i)}function Xs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Cs,i)}function Zs(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||xs,i)}function Qs(e){switch(e){case 5126:return Ns;case 35664:return Ps;case 35665:return Fs;case 35666:return Is;case 35674:return Ls;case 35675:return Rs;case 35676:return zs;case 5124:case 35670:return Bs;case 35667:case 35671:return Vs;case 35668:case 35672:return Hs;case 35669:case 35673:return Us;case 5125:return Ws;case 36294:return Gs;case 36295:return Ks;case 36296:return qs;case 35678:case 36198:case 36298:case 36306:case 35682:return Js;case 35679:case 36299:case 36307:return Ys;case 35680:case 36300:case 36308:case 36293:return Xs;case 36289:case 36303:case 36311:case 36292:return Zs}}function $s(e,t){e.uniform1fv(this.addr,t)}function ec(e,t){let n=ks(t,this.size,2);e.uniform2fv(this.addr,n)}function tc(e,t){let n=ks(t,this.size,3);e.uniform3fv(this.addr,n)}function nc(e,t){let n=ks(t,this.size,4);e.uniform4fv(this.addr,n)}function rc(e,t){let n=ks(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function ic(e,t){let n=ks(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ac(e,t){let n=ks(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function oc(e,t){e.uniform1iv(this.addr,t)}function sc(e,t){e.uniform2iv(this.addr,t)}function cc(e,t){e.uniform3iv(this.addr,t)}function lc(e,t){e.uniform4iv(this.addr,t)}function uc(e,t){e.uniform1uiv(this.addr,t)}function dc(e,t){e.uniform2uiv(this.addr,t)}function fc(e,t){e.uniform3uiv(this.addr,t)}function pc(e,t){e.uniform4uiv(this.addr,t)}function mc(e,t,n){let r=this.cache,i=t.length,a=Ms(n,i);As(r,a)||(e.uniform1iv(this.addr,a),js(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?bs:ys;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function hc(e,t,n){let r=this.cache,i=t.length,a=Ms(n,i);As(r,a)||(e.uniform1iv(this.addr,a),js(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Ss,a[e])}function gc(e,t,n){let r=this.cache,i=t.length,a=Ms(n,i);As(r,a)||(e.uniform1iv(this.addr,a),js(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Cs,a[e])}function _c(e,t,n){let r=this.cache,i=t.length,a=Ms(n,i);As(r,a)||(e.uniform1iv(this.addr,a),js(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||xs,a[e])}function vc(e){switch(e){case 5126:return $s;case 35664:return ec;case 35665:return tc;case 35666:return nc;case 35674:return rc;case 35675:return ic;case 35676:return ac;case 5124:case 35670:return oc;case 35667:case 35671:return sc;case 35668:case 35672:return cc;case 35669:case 35673:return lc;case 5125:return uc;case 36294:return dc;case 36295:return fc;case 36296:return pc;case 35678:case 36198:case 36298:case 36306:case 35682:return mc;case 35679:case 36299:case 36307:return hc;case 35680:case 36300:case 36308:case 36293:return gc;case 36289:case 36303:case 36311:case 36292:return _c}}var yc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Qs(t.type)}},bc=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=vc(t.type)}},xc=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Sc=/(\w+)(\])?(\[|\.)?/g;function Cc(e,t){e.seq.push(t),e.map[t.id]=t}function wc(e,t,n){let r=e.name,i=r.length;for(Sc.lastIndex=0;;){let a=Sc.exec(r),o=Sc.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Cc(n,l===void 0?new yc(s,e,t):new bc(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new xc(s),Cc(n,e)),n=e}}}var Tc=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);wc(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Ec(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Dc=37297,Oc=0;function kc(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Ac=new cn;function jc(e){pn._getMatrix(Ac,pn.workingColorSpace,e);let t=`mat3( ${Ac.elements.map(e=>e.toFixed(4))} )`;switch(pn.getTransfer(e)){case pt:return[t,`LinearTransferOETF`];case mt:return[t,`sRGBTransferOETF`];default:return Y(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Mc(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+kc(e.getShaderSource(t),r)}return i}function Nc(e,t){let n=jc(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Pc={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Fc(e,t){let n=Pc[t];return n===void 0?(Y(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ic=new Z;function Lc(){return pn.getLuminanceCoefficients(Ic),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ic.x.toFixed(4)}, ${Ic.y.toFixed(4)}, ${Ic.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Rc(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Vc).join(`
`)}function zc(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Bc(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Vc(e){return e!==``}function Hc(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Uc(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Wc=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gc(e){return e.replace(Wc,qc)}var Kc=new Map;function qc(e,t){let n=Mo[t];if(n===void 0){let e=Kc.get(t);if(e!==void 0)n=Mo[e],Y(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return Gc(n)}var Jc=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yc(e){return e.replace(Jc,Xc)}function Xc(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function Zc(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var Qc={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function $c(e){return Qc[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var el={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function tl(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:el[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var nl={302:`ENVMAP_MODE_REFRACTION`};function rl(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:nl[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var il={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function al(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:il[e.combine]||`ENVMAP_BLENDING_NONE`}function ol(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function sl(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=$c(n),l=tl(n),u=rl(n),d=al(n),f=ol(n),p=Rc(n),m=zc(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Vc).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Vc).join(`
`),_.length>0&&(_+=`
`)):(g=[Zc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Vc).join(`
`),_=[Zc(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Mo.tonemapping_pars_fragment,n.toneMapping===0?``:Fc(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Mo.colorspace_pars_fragment,Nc(`linearToOutputTexel`,n.outputColorSpace),Lc(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Vc).join(`
`)),o=Gc(o),o=Hc(o,n),o=Uc(o,n),s=Gc(s),s=Hc(s,n),s=Uc(s,n),o=Yc(o),s=Yc(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Ec(i,i.VERTEX_SHADER,y),S=Ec(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Mc(i,x,`vertex`),n=Mc(i,S,`fragment`);Et(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):Y(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Tc(i,h),T=Bc(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Dc)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Oc++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var cl=0,ll=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new ul(e),t.set(e,n)),n}},ul=class{constructor(e){this.id=cl++,this.code=e,this.usedTimes=0}};function dl(e){return e===1030||e===37490||e===36285}function fl(e,t,n,r,i,a){let o=new Bn,s=new ll,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&Y(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=No[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,ee=!!i.matcap,I=!!x,L=!!i.aoMap,R=!!i.lightMap,te=!!i.bumpMap&&i.wireframe===!1,z=!!i.normalMap,ne=!!i.displacementMap,B=!!i.emissiveMap,V=!!i.metalnessMap,re=!!i.roughnessMap,ie=i.anisotropy>0,H=i.clearcoat>0,ae=i.dispersion>0,U=i.retroreflectivity>0,W=i.iridescence>0,oe=i.sheen>0,se=i.transmission>0,ce=ie&&!!i.anisotropyMap,le=H&&!!i.clearcoatMap,G=H&&!!i.clearcoatNormalMap,K=H&&!!i.clearcoatRoughnessMap,ue=W&&!!i.iridescenceMap,de=W&&!!i.iridescenceThicknessMap,fe=oe&&!!i.sheenColorMap,pe=oe&&!!i.sheenRoughnessMap,me=!!i.specularMap,he=!!i.specularColorMap,ge=!!i.specularIntensityMap,_e=se&&!!i.transmissionMap,ve=se&&!!i.thicknessMap,ye=!!i.gradientMap,q=!!i.alphaMap,be=i.alphaTest>0,xe=!!i.alphaHash,Se=!!i.extensions,Ce=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Ce=e.toneMapping);let we={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:pn.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:ee,envMap:I,envMapMode:I&&x.mapping,envMapCubeUVHeight:S,aoMap:L,lightMap:R,bumpMap:te,normalMap:z,displacementMap:ne,emissiveMap:B,normalMapObjectSpace:z&&i.normalMapType===1,normalMapTangentSpace:z&&i.normalMapType===0,packedNormalMap:z&&i.normalMapType===0&&dl(i.normalMap.format),metalnessMap:V,roughnessMap:re,anisotropy:ie,anisotropyMap:ce,clearcoat:H,clearcoatMap:le,clearcoatNormalMap:G,clearcoatRoughnessMap:K,dispersion:ae,retroreflection:U,iridescence:W,iridescenceMap:ue,iridescenceThicknessMap:de,sheen:oe,sheenColorMap:fe,sheenRoughnessMap:pe,specularMap:me,specularColorMap:he,specularIntensityMap:ge,transmission:se,transmissionMap:_e,thicknessMap:ve,gradientMap:ye,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:q,alphaTest:be,alphaHash:xe,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:L&&m(i.aoMap.channel),lightMapUv:R&&m(i.lightMap.channel),bumpMapUv:te&&m(i.bumpMap.channel),normalMapUv:z&&m(i.normalMap.channel),displacementMapUv:ne&&m(i.displacementMap.channel),emissiveMapUv:B&&m(i.emissiveMap.channel),metalnessMapUv:V&&m(i.metalnessMap.channel),roughnessMapUv:re&&m(i.roughnessMap.channel),anisotropyMapUv:ce&&m(i.anisotropyMap.channel),clearcoatMapUv:le&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:G&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:ue&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:de&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:fe&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:pe&&m(i.sheenRoughnessMap.channel),specularMapUv:me&&m(i.specularMap.channel),specularColorMapUv:he&&m(i.specularColorMap.channel),specularIntensityMapUv:ge&&m(i.specularIntensityMap.channel),transmissionMapUv:_e&&m(i.transmissionMap.channel),thicknessMapUv:ve&&m(i.thicknessMap.channel),alphaMapUv:q&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(z||ie),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||q),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&z===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Ce,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&pn.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:B&&i.emissiveMap.isVideoTexture===!0&&pn.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Se&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Se&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return we.vertexUv1s=c.has(1),we.vertexUv2s=c.has(2),we.vertexUv3s=c.has(3),c.clear(),we}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=No[t];n=ma.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new sl(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function pl(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function ml(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function hl(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function gl(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||ml),r.length>1&&r.sort(t||hl),i.length>1&&i.sort(t||hl)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function _l(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new gl,e.set(t,[i])):n>=r.length?(i=new gl,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function vl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new Z,color:new Q};break;case`SpotLight`:n={position:new Z,direction:new Z,color:new Q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Z,color:new Q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Z,skyColor:new Q,groundColor:new Q};break;case`RectAreaLight`:n={color:new Q,position:new Z,halfWidth:new Z,halfHeight:new Z}}return e[t.id]=n,n}}}function yl(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var bl=0;function xl(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Sl(e){let t=new vl,n=yl(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Z);let i=new Z,a=new kn,o=new kn;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(xl);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=$.LTC_FLOAT_1,r.rectAreaLTC2=$.LTC_FLOAT_2):(r.rectAreaLTC1=$.LTC_HALF_1,r.rectAreaLTC2=$.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=bl++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Cl(e){let t=new Sl(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function wl(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Cl(e),t.set(n,[a])):r>=i.length?(a=new Cl(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Tl=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,El=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Dl=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],Ol=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],kl=new kn,Al=new Z,jl=new Z;function Ml(e,t,n){let r=new Ki,i=new X,a=new X,o=new wn,s=new Sa,c=new Ca,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new _a({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new X},radius:{value:4}},vertexShader:Tl,fragmentShader:El}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new oi;m.setAttribute(`position`,new Gr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Ai(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(Y(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){Y(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){Y(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new En(i.x,i.y,{format:q,type:le,minFilter:V,magFilter:V,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Yi(i.x,i.y,ce),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ge,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=z,d.map.depthTexture.magFilter=z}else l.isPointLight?(d.map=new ls(i.x),d.map.depthTexture=new Xi(i.x,se)):(d.map=new En(i.x,i.y),d.map.depthTexture=new Yi(i.x,i.y,se)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ge,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=V,d.map.depthTexture.magFilter=V):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=z,d.map.depthTexture.magFilter=z);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Al.setFromMatrixPosition(l.matrixWorld),e.position.copy(Al),jl.copy(e.position),jl.add(Dl[t]),e.up.copy(Ol[t]),e.lookAt(jl),e.updateMatrixWorld(),n.makeTranslation(-Al.x,-Al.y,-Al.z),kl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(kl,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new En(i.x,i.y,{format:q,type:le}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Nl(e,t){function n(){let t=!1,n=new wn,r=null,i=new wn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?V(e.DEPTH_TEST):re(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=kt[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?V(e.STENCIL_TEST):re(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let ee=null,I={},L=e.getParameter(e.SCISSOR_BOX),R=e.getParameter(e.VIEWPORT),te=new wn().fromArray(L),z=new wn().fromArray(R);function ne(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let B={};B[e.TEXTURE_2D]=ne(e.TEXTURE_2D,e.TEXTURE_2D,1),B[e.TEXTURE_CUBE_MAP]=ne(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),B[e.TEXTURE_2D_ARRAY]=ne(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),B[e.TEXTURE_3D]=ne(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),V(e.DEPTH_TEST),o.setFunc(3),ce(!1),le(1),V(e.CULL_FACE),oe(0);function V(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function re(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function ie(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function H(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ae(t){return h!==t&&(e.useProgram(t),h=t,!0)}let U={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};U[103]=e.MIN,U[104]=e.MAX;let W={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function oe(t,n,r,i,a,o,s,c,l,u){if(t===0){g===!0&&(re(e.BLEND),g=!1);return}if(g===!1&&(V(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Et(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Et(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Et(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Et(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}return}a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(U[n],U[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(W[r],W[i],W[o],W[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function se(t,n){t.side===2?re(e.CULL_FACE):V(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ce(r),t.blending===1&&t.transparent===!1?oe(0):oe(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),K(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?V(e.SAMPLE_ALPHA_TO_COVERAGE):re(e.SAMPLE_ALPHA_TO_COVERAGE)}function ce(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function le(t){t===0?re(e.CULL_FACE):(V(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function G(t){t!==k&&(N&&e.lineWidth(t),k=t)}function K(t,n,r){t?(V(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):re(e.POLYGON_OFFSET_FILL)}function ue(t){t?V(e.SCISSOR_TEST):re(e.SCISSOR_TEST)}function de(t){t===void 0&&(t=e.TEXTURE0+M-1),ee!==t&&(e.activeTexture(t),ee=t)}function fe(t,n,r){r===void 0&&(r=ee===null?e.TEXTURE0+M-1:ee);let i=I[r];i===void 0&&(i={type:void 0,texture:void 0},I[r]=i),(i.type!==t||i.texture!==n)&&(ee!==r&&(e.activeTexture(r),ee=r),e.bindTexture(t,n||B[t]),i.type=t,i.texture=n)}function pe(){let t=I[ee];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function me(){try{e.compressedTexImage2D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function he(){try{e.compressedTexImage3D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function ge(){try{e.texSubImage2D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function _e(){try{e.texSubImage3D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function ve(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function ye(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function q(){try{e.texStorage2D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function be(){try{e.texStorage3D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function xe(){try{e.texImage2D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function Se(){try{e.texImage3D(...arguments)}catch(e){Et(`WebGLState:`,e)}}function Ce(t){return d[t]===void 0?e.getParameter(t):d[t]}function we(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function J(t){te.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),te.copy(t))}function Te(t){z.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),z.copy(t))}function Ee(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function De(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function Oe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},ee=null,I={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,te.set(0,0,e.canvas.width,e.canvas.height),z.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:V,disable:re,bindFramebuffer:ie,drawBuffers:H,useProgram:ae,setBlending:oe,setMaterial:se,setFlipSided:ce,setCullFace:le,setLineWidth:G,setPolygonOffset:K,setScissorTest:ue,activeTexture:de,bindTexture:fe,unbindTexture:pe,compressedTexImage2D:me,compressedTexImage3D:he,texImage2D:xe,texImage3D:Se,pixelStorei:we,getParameter:Ce,updateUBOMapping:Ee,uniformBlockBinding:De,texStorage2D:q,texStorage3D:be,texSubImage2D:ge,texSubImage3D:_e,compressedTexSubImage2D:ve,compressedTexSubImage3D:ye,scissor:J,viewport:Te,reset:Oe}}function Pl(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new X,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):xt(`canvas`)}function g(e,t,n){let r=1,i=Ce(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),Y(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&Y(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];Y(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||Y(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?pt:pn.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,Y(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function M(){let e=O;return e>=i.maxTextures&&Y(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function N(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,i){let a=r.get(t);if(t.isVideoTexture&&xe(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)Y(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)Y(`WebGLRenderer: Texture marked for update but image is incomplete`);else{le(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function F(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){le(a,t,i);return}t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i)}function ee(t,i){let a=r.get(t);if(t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version){le(a,t,i);return}n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function I(t,i){let a=r.get(t);if(t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version){G(a,t,i);return}n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let H={[L]:e.REPEAT,[R]:e.CLAMP_TO_EDGE,[te]:e.MIRRORED_REPEAT},ae={[z]:e.NEAREST,[ne]:e.NEAREST_MIPMAP_NEAREST,[B]:e.NEAREST_MIPMAP_LINEAR,[V]:e.LINEAR,[re]:e.LINEAR_MIPMAP_NEAREST,[ie]:e.LINEAR_MIPMAP_LINEAR},U={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function W(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&Y(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,H[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,H[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,H[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ae[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ae[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,U[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function oe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=N(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function se(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ce(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=se(n.start,r.width,4),c=se(t.start,r.width,4);n.start<=i+1&&a===c&&se(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function le(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=oe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=pn.getPrimaries(pn.workingColorSpace),r=o.colorSpace===``?null:pn.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=Se(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);W(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===_e,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ce(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=Oo(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Oo(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Ce(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Ce(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function G(t,o,s){if(o.image.length!==6)return;let c=oe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=pn.getPrimaries(pn.workingColorSpace),r=o.colorSpace===``?null:pn.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=Se(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);W(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Ce(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function K(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),be(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,q(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ue(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;be(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,q(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,q(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);be(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,q(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,q(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function de(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,(!l.__webglTexture||i.depthTexture.image.width!==i.width||i.depthTexture.image.height!==i.height)&&(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),W(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else P(i.depthTexture,0);let u=l.__webglTexture,d=q(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)be(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)be(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function fe(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)de(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?de(i.__webglFramebuffer[0],t,0):de(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ue(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ue(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function pe(t,n,i){let a=r.get(t);n!==void 0&&K(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&fe(t)}function me(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&be(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=q(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ue(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),W(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)K(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else K(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),W(c,a),K(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),W(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)K(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else K(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&fe(t)}function he(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let ge=[],ve=[];function ye(t){if(t.samples>0){if(be(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ge.length=0,ve.length=0,ge.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(ge.push(l),ve.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ve)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ge))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function q(e){return Math.min(i.maxSamples,e.samples)}function be(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function xe(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function Se(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(pn.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&Y(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Et(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ce(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=M,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=P,this.setTexture2DArray=F,this.setTexture3D=ee,this.setTextureCube=I,this.rebindTextures=pe,this.setupRenderTarget=me,this.updateRenderTargetMipmap=he,this.updateMultisampleRenderTarget=ye,this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=K,this.useMultisampledRTT=be,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Fl(e,t){function n(n,r=``){let i,a=pn.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Il=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ll=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Rl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Zi(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new _a({vertexShader:Il,fragmentShader:Ll,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ai(new aa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},zl=class extends At{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Rl,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new X,C=null,w=null,T=new no;T.viewport=new wn;let E=new no;E.viewport=new wn;let D=[T,E],O=new po,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new ar,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new ar,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new ar,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,z.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?_e:ge,a=_.stencil?ue:se);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new En(d.textureWidth,d.textureHeight,{format:he,type:H,depthTexture:new Yi(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new En(f.framebufferWidth,f.framebufferHeight,{format:he,type:H,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),z.setContext(r),z.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let P=new Z,F=new Z;function ee(e,t,n){P.setFromMatrixPosition(t.matrixWorld),F.setFromMatrixPosition(n.matrixWorld);let r=P.distanceTo(F),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function I(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;I(O,i);for(let e=0;e<a.length;e++)I(a[e],i);a.length===2?ee(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),L(e,O,i)};function L(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Pt*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let R=null;function te(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new no,o.layers.enable(n),o.viewport=new wn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Zi,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}R&&R(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let z=new Ao;z.setAnimationLoop(te),this.setAnimationLoop=function(e){R=e},this.dispose=function(){}}},Bl=new kn,Vl=new cn;Vl.set(-1,0,0,0,1,0,0,0,1);function Hl(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,pa(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Bl.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Vl),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Ul(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return Et(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?Y(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):Y(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var Wl=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Gl=null;function Kl(){return Gl===null&&(Gl=new Ni(Wl,16,16,q,le),Gl.name=`DFG_LUT`,Gl.minFilter=V,Gl.magFilter=V,Gl.wrapS=R,Gl.wrapT=R,Gl.generateMipmaps=!1,Gl.needsUpdate=!0),Gl}var ql=class{constructor(e={}){let{canvas:t=St(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=H}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([xe,be,ye]),g=new Set([H,se,W,ue,G,K]),_=new Uint32Array(4),v=new Int32Array(4),y=new Z,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=dt;let j=0,M=0,N=null,P=-1,F=null,ee=new wn,I=new wn,L=null,R=new Q(0),te=0,z=t.width,ne=t.height,B=1,V=null,re=null,ae=new wn(0,0,z,ne),U=new wn(0,0,z,ne),oe=!1,ce=new Ki,de=!1,fe=!1,pe=new kn,me=new Z,he=new wn,ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},_e=!1;function ve(){return N===null?B:1}let q=n;function Se(e,n){return t.getContext(e,n)}let Ce,we,J,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,qe,!1),t.addEventListener(`webglcontextrestored`,Je,!1),t.addEventListener(`webglcontextcreationerror`,Ye,!1),q===null){let t=`webgl2`;if(q=Se(t,e),q===null)throw Se(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ge()}catch(e){throw t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),Et(`WebGLRenderer: `+e.message),e}function Ge(){Ce=new ds(q),Ce.init(),He=new Fl(q,Ce),we=new Bo(q,Ce,e,He),J=new Nl(q,Ce),we.reversedDepthBuffer&&d&&J.buffers.depth.setReversed(!0),O=q.createFramebuffer(),k=q.createFramebuffer(),A=q.createFramebuffer(),Te=new ms(q),Ee=new pl,De=new Pl(q,Ce,J,Ee,we,He,Te),Oe=new us(T),ke=new jo(q),Ue=new Ro(q,ke),Ae=new fs(q,ke,Te,Ue),je=new gs(q,Ae,ke,Ue,Te),ze=new hs(q,we,De),Ie=new Vo(Ee),Me=new fl(T,Oe,Ce,we,Ue,Ie),Ne=new Hl(T,Ee),Pe=new _l,Fe=new wl(Ce),Re=new Lo(T,Oe,J,je,p,s),Le=new Ml(T,je,we),We=new Ul(q,Te,we,J),Be=new zo(q,Ce,Te),Ve=new ps(q,Ce,Te),Te.programs=Me.programs,T.capabilities=we,T.extensions=Ce,T.properties=Ee,T.renderLists=Pe,T.shadowMap=Le,T.state=J,T.info=Te}m!==1009&&(w=new vs(m,t.width,t.height,o,r,i));let Ke=new zl(T,q);this.xr=Ke,this.getContext=function(){return q},this.getContextAttributes=function(){return q.getContextAttributes()},this.forceContextLoss=function(){let e=Ce.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ce.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(e){e!==void 0&&(B=e,this.setSize(z,ne,!1))},this.getSize=function(e){return e.set(z,ne)},this.setSize=function(e,n,r=!0){if(Ke.isPresenting){Y(`WebGLRenderer: Can't change size while VR device is presenting.`);return}z=e,ne=n,t.width=Math.floor(e*B),t.height=Math.floor(n*B),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n)},this.getDrawingBufferSize=function(e){return e.set(z*B,ne*B).floor()},this.setDrawingBufferSize=function(e,n,r){z=e,ne=n,B=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009){Et(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);return}if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){Y(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])},this.getCurrentViewport=function(e){return e.copy(ee)},this.getViewport=function(e){return e.copy(ae)},this.setViewport=function(e,t,n,r){e.isVector4?ae.set(e.x,e.y,e.z,e.w):ae.set(e,t,n,r),J.viewport(ee.copy(ae).multiplyScalar(B).round())},this.getScissor=function(e){return e.copy(U)},this.setScissor=function(e,t,n,r){e.isVector4?U.set(e.x,e.y,e.z,e.w):U.set(e,t,n,r),J.scissor(I.copy(U).multiplyScalar(B).round())},this.getScissorTest=function(){return oe},this.setScissorTest=function(e){J.setScissorTest(oe=e)},this.setOpaqueSort=function(e){V=e},this.setTransparentSort=function(e){re=e},this.getClearColor=function(e){return e.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Re.getClearColor(),r=Re.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,q.clearBufferuiv(q.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,q.clearBufferiv(q.COLOR,0,v))}else r|=q.COLOR_BUFFER_BIT}t&&(r|=q.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&q.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),Re.dispose(),Pe.dispose(),Fe.dispose(),Ee.dispose(),Oe.dispose(),je.dispose(),Ue.dispose(),We.dispose(),Me.dispose(),Ke.dispose(),Ke.removeEventListener(`sessionstart`,nt),Ke.removeEventListener(`sessionend`,rt),it.stop()};function qe(e){e.preventDefault(),wt(`WebGLRenderer: Context Lost.`),E=!0}function Je(){wt(`WebGLRenderer: Context Restored.`),E=!1;let e=Te.autoReset,t=Le.enabled,n=Le.autoUpdate,r=Le.needsUpdate,i=Le.type;Ge(),Te.autoReset=e,Le.enabled=t,Le.autoUpdate=n,Le.needsUpdate=r,Le.type=i}function Ye(e){Et(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Xe(e){let t=e.target;t.removeEventListener(`dispose`,Xe),Ze(t)}function Ze(e){Qe(e),Ee.remove(e)}function Qe(e){let t=Ee.get(e).programs;t!==void 0&&(t.forEach(function(e){Me.releaseProgram(e)}),e.isShaderMaterial&&Me.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ge);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ht(e,t,n,r,i);J.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ae.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ue.setup(i,r,s,n,c);let h,g=Be;if(c!==null&&(h=ke.get(c),g=Ve,g.setIndex(h)),i.isMesh)r.wireframe===!0?(J.setLineWidth(r.wireframeLinewidth*ve()),g.setMode(q.LINES)):g.setMode(q.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),J.setLineWidth(e*ve()),i.isLineSegments?g.setMode(q.LINES):i.isLineLoop?g.setMode(q.LINE_LOOP):g.setMode(q.LINE_STRIP)}else i.isPoints?g.setMode(q.POINTS):i.isSprite&&g.setMode(q.TRIANGLES);if(i.isBatchedMesh){if(Ce.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ke.get(c).bytesPerElement:1,o=Ee.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(q,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function $e(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),de===!0&&Ie.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ut(e,t,r),e.side=0,e.needsUpdate=!0,ut(e,t,r),e.side=2):ut(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Fe.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),fe=this.localClippingEnabled,de=Ie.init(this.clippingPlanes,fe),de===!0&&Ie.setGlobalState(this.clippingPlanes,t),D!==null&&Le.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];$e(o,n,t,e),r.add(o)}else $e(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){if(r.forEach(function(e){let t=Ee.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0){t(e);return}setTimeout(n,10)}Ce.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let et=null;function tt(e){et&&et(e)}function nt(){it.stop()}function rt(){it.start()}let it=new Ao;it.setAnimationLoop(tt),typeof self<`u`&&it.setContext(self),this.setAnimationLoop=function(e){et=e,Ke.setAnimationLoop(e),e===null?it.stop():it.start()},Ke.addEventListener(`sessionstart`,nt),Ke.addEventListener(`sessionend`,rt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Et(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ke.enabled===!0&&Ke.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ke.enabled===!0&&Ke.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ke.cameraAutoUpdate===!0&&Ke.updateCamera(t),t=Ke.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Fe.get(e,C.length),x.init(t),x.state.textureUnits=De.getTextureUnits(),C.push(x),pe.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),ce.setFromProjectionMatrix(pe,vt,t.reversedDepth),fe=this.localClippingEnabled,de=Ie.init(this.clippingPlanes,fe),b=Pe.get(e,S.length),b.init(),S.push(b),Ke.enabled===!0&&Ke.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&at(e,t,-1/0,T.sortObjects)}at(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(V,re),_e=Ke.enabled===!1||Ke.isPresenting===!1||Ke.hasDepthSensing()===!1,_e&&Re.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),de===!0&&Ie.beginShadows();let i=x.state.shadowsArray;if(Le.render(i,e,t),de===!0&&Ie.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];st(n,r,e,a)}_e&&Re.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];ot(b,e,n,n.viewport)}}else r.length>0&&st(n,r,e,t),_e&&Re.render(e),ot(b,e,t)}N!==null&&M===0&&(De.updateMultisampleRenderTarget(N),De.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ue.resetDefaultState(),P=-1,F=null,C.pop(),C.length>0?(x=C[C.length-1],De.setTextureUnits(x.state.textureUnits),de===!0&&Ie.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function at(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(ce)){r&&he.setFromMatrixPosition(e.matrixWorld).applyMatrix4(pe);let i=je.update(e),a=e.material;a.visible&&b.push(e,i,a,n,he.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(ce))){let i=je.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),he.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),he.copy(e.boundingSphere.center)),he.applyMatrix4(e.matrixWorld).applyMatrix4(pe)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,he.z,s,t)}}else a.visible&&b.push(e,i,a,n,he.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)at(i[e],t,n,r)}function ot(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),de===!0&&Ie.setGlobalState(T.clippingPlanes,n),r&&J.viewport(ee.copy(r)),i.length>0&&ct(i,t,n),a.length>0&&ct(a,t,n),o.length>0&&ct(o,t,n),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),J.setPolygonOffset(!1)}function st(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Ce.has(`EXT_color_buffer_half_float`)||Ce.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new En(1,1,{generateMipmaps:!0,type:e?le:H,minFilter:ie,samples:Math.max(4,we.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:pn.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||ee;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(R),te=T.getClearAlpha(),te<1&&T.setClearColor(16777215,.5),T.clear(),_e&&Re.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),de===!0&&Ie.setGlobalState(T.clippingPlanes,r),ct(e,n,r),De.updateMultisampleRenderTarget(a),De.updateRenderTargetMipmap(a),Ce.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,lt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(De.updateMultisampleRenderTarget(a),De.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(R,te),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&lt(o,t,n,s,l,c)}}function lt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ut(e,t,n){t.isScene!==!0&&(t=ge);let r=Ee.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Me.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Me.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Oe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Xe),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return pt(e,s),d}else s.uniforms=Me.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Me.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ie.uniform),pt(e,s),r.needsLights=_t(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function ft(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Tc.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function pt(e,t){let n=Ee.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function mt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function ht(e,t,n,r,i){t.isScene!==!0&&(t=ge),De.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:pn.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Oe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=Ee.get(r),y=x.state.lights;if(de===!0&&(fe===!0||e!==F)){let t=e===F&&r.id===P;Ie.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ie.numPlanes||v.numIntersection!==Ie.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=ut(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(J.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==P&&(P=r.id,w=!0),v.needsLights){let e=mt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||F!==e){J.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(q,`projectionMatrix`,e.projectionMatrix),O.setValue(q,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(q,me.setFromMatrixPosition(e.matrixWorld)),we.logarithmicDepthBuffer&&O.setValue(q,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(q,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(q,`sunShadowMap`,y.state.sunShadowMap,De),y.state.directionalShadowMap.length>0&&O.setValue(q,`directionalShadowMap`,y.state.directionalShadowMap,De),y.state.spotShadowMap.length>0&&O.setValue(q,`spotShadowMap`,y.state.spotShadowMap,De),y.state.pointShadowMap.length>0&&O.setValue(q,`pointShadowMap`,y.state.pointShadowMap,De)),i.isSkinnedMesh){O.setOptional(q,i,`bindMatrix`),O.setOptional(q,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(q,`boneTexture`,e.boneTexture,De))}i.isBatchedMesh&&(O.setOptional(q,i,`batchingTexture`),O.setValue(q,`batchingTexture`,i._matricesTexture,De),O.setOptional(q,i,`batchingIdTexture`),O.setValue(q,`batchingIdTexture`,i._indirectTexture,De),O.setOptional(q,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(q,`batchingColorTexture`,i._colorsTexture,De));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&ze.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(q,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=Kl()),w){if(O.setValue(q,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&gt(k,E),a&&r.fog===!0&&Ne.refreshFogUniforms(k,a),Ne.refreshMaterialUniforms(k,r,B,ne,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}Tc.upload(q,ft(v),k,De)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Tc.upload(q,ft(v),k,De),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(q,`center`,i.center),O.setValue(q,`modelViewMatrix`,i.modelViewMatrix),O.setValue(q,`normalMatrix`,i.normalMatrix),O.setValue(q,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];We.update(n,S),We.bind(n,S)}}return S}function gt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function _t(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=Ee.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),Ee.get(e.texture).__webglTexture=t,Ee.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=Ee.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=Ee.get(e);if(o.__useDefaultFramebuffer!==void 0){J.bindFramebuffer(q.FRAMEBUFFER,o.__webglFramebuffer),ee.copy(e.viewport),I.copy(e.scissor),L=e.scissorTest,J.viewport(ee),J.scissor(I),J.setScissorTest(L),P=-1;return}if(o.__webglFramebuffer===void 0)De.setupRenderTarget(e);else if(o.__hasExternalTextures)De.rebindTextures(e,Ee.get(e.texture).__webglTexture,Ee.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&Ee.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);De.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=Ee.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&De.useMultisampledRTT(e)===!1?Ee.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,ee.copy(e.viewport),I.copy(e.scissor),L=e.scissorTest}else ee.copy(ae).multiplyScalar(B).floor(),I.copy(U).multiplyScalar(B).floor(),L=oe;if(n!==0&&(r=O),J.bindFramebuffer(q.FRAMEBUFFER,r)&&J.drawBuffers(e,r),J.viewport(ee),J.scissor(I),J.setScissorTest(L),i){let r=Ee.get(e.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=Ee.get(e.textures[t]);q.framebufferTextureLayer(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=Ee.get(e.texture);q.framebufferTexture2D(q.FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_2D,t.__webglTexture,n)}P=-1};function yt(e){let t=Ee.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=we.textureFormatReadable(e.format),t.__typeReadable=we.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Et(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=Ee.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){J.bindFramebuffer(q.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&q.readBuffer(q.COLOR_ATTACHMENT0+s);let u=yt(o);if(u.__formatReadable===!1){Et(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){Et(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&q.readPixels(t,n,r,i,He.convert(c),He.convert(l),a)}finally{let e=N===null?null:Ee.get(N).__webglFramebuffer;J.bindFramebuffer(q.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=Ee.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){J.bindFramebuffer(q.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&q.readBuffer(q.COLOR_ATTACHMENT0+s);let d=yt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=q.createBuffer();q.bindBuffer(q.PIXEL_PACK_BUFFER,f),q.bufferData(q.PIXEL_PACK_BUFFER,a.byteLength,q.STREAM_READ),q.readPixels(t,n,r,i,He.convert(l),He.convert(u),0),q.bindBuffer(q.PIXEL_PACK_BUFFER,null);let p=N===null?null:Ee.get(N).__webglFramebuffer;J.bindFramebuffer(q.FRAMEBUFFER,p);let m=q.fenceSync(q.SYNC_GPU_COMMANDS_COMPLETE,0);return q.flush(),await Ot(q,m,4),q.bindBuffer(q.PIXEL_PACK_BUFFER,f),q.getBufferSubData(q.PIXEL_PACK_BUFFER,0,a),q.bindBuffer(q.PIXEL_PACK_BUFFER,null),q.deleteBuffer(f),q.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;De.setTexture2D(e,0),q.copyTexSubImage2D(q.TEXTURE_2D,n,0,0,o,s,i,a),J.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=He.convert(t.format),_=He.convert(t.type),v;t.isData3DTexture?(De.setTexture3D(t,0),v=q.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(De.setTexture2DArray(t,0),v=q.TEXTURE_2D_ARRAY):(De.setTexture2D(t,0),v=q.TEXTURE_2D),J.activeTexture(q.TEXTURE0),J.pixelStorei(q.UNPACK_FLIP_Y_WEBGL,t.flipY),J.pixelStorei(q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),J.pixelStorei(q.UNPACK_ALIGNMENT,t.unpackAlignment);let y=J.getParameter(q.UNPACK_ROW_LENGTH),b=J.getParameter(q.UNPACK_IMAGE_HEIGHT),x=J.getParameter(q.UNPACK_SKIP_PIXELS),S=J.getParameter(q.UNPACK_SKIP_ROWS),C=J.getParameter(q.UNPACK_SKIP_IMAGES);J.pixelStorei(q.UNPACK_ROW_LENGTH,h.width),J.pixelStorei(q.UNPACK_IMAGE_HEIGHT,h.height),J.pixelStorei(q.UNPACK_SKIP_PIXELS,l),J.pixelStorei(q.UNPACK_SKIP_ROWS,u),J.pixelStorei(q.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=Ee.get(e),r=Ee.get(t),h=Ee.get(n.__renderTarget),g=Ee.get(r.__renderTarget);J.bindFramebuffer(q.READ_FRAMEBUFFER,h.__webglFramebuffer),J.bindFramebuffer(q.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(q.framebufferTextureLayer(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,Ee.get(e).__webglTexture,i,d+n),q.framebufferTextureLayer(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,Ee.get(t).__webglTexture,a,m+n)),q.blitFramebuffer(l,u,o,s,f,p,o,s,q.DEPTH_BUFFER_BIT,q.NEAREST);J.bindFramebuffer(q.READ_FRAMEBUFFER,null),J.bindFramebuffer(q.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||Ee.has(e)){let n=Ee.get(e),r=Ee.get(t);J.bindFramebuffer(q.READ_FRAMEBUFFER,k),J.bindFramebuffer(q.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?q.framebufferTextureLayer(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):q.framebufferTexture2D(q.READ_FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_2D,n.__webglTexture,i),T?q.framebufferTextureLayer(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):q.framebufferTexture2D(q.DRAW_FRAMEBUFFER,q.COLOR_ATTACHMENT0,q.TEXTURE_2D,r.__webglTexture,a),i===0?T?q.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):q.copyTexSubImage2D(v,a,f,p,l,u,o,s):q.blitFramebuffer(l,u,o,s,f,p,o,s,q.COLOR_BUFFER_BIT,q.NEAREST);J.bindFramebuffer(q.READ_FRAMEBUFFER,null),J.bindFramebuffer(q.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?q.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?q.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):q.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?q.texSubImage2D(q.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?q.compressedTexSubImage2D(q.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):q.texSubImage2D(q.TEXTURE_2D,a,f,p,o,s,g,_,h);J.pixelStorei(q.UNPACK_ROW_LENGTH,y),J.pixelStorei(q.UNPACK_IMAGE_HEIGHT,b),J.pixelStorei(q.UNPACK_SKIP_PIXELS,x),J.pixelStorei(q.UNPACK_SKIP_ROWS,S),J.pixelStorei(q.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&q.generateMipmap(v),J.unbindTexture()},this.initRenderTarget=function(e){Ee.get(e).__webglFramebuffer===void 0&&De.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?De.setTextureCube(e,0):e.isData3DTexture?De.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?De.setTexture2DArray(e,0):De.setTexture2D(e,0),J.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,J.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return vt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=pn._getDrawingBufferColorSpace(e),t.unpackColorSpace=pn._getUnpackColorSpace()}},Jl=class extends fr{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let e=new Qi;e.deleteAttribute(`uv`);let t=new ya({side:1}),n=new ya,r=new io(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);let i=new Ai(e,t);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);let a=new Hi(e,n,6),o=new nr;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);let s=new Ai(e,Yl(50));s.position.set(-16.116,14.37,8.208),s.scale.set(.1,2.428,2.739),this.add(s);let c=new Ai(e,Yl(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let l=new Ai(e,Yl(17));l.position.set(14.904,12.198,-1.832),l.scale.set(.15,4.265,6.331),this.add(l);let u=new Ai(e,Yl(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new Ai(e,Yl(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new Ai(e,Yl(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function Yl(e){return new xa({color:0,emissive:16777215,emissiveIntensity:e})}function Xl(e){let t=new ql({canvas:e,antialias:!0,powerPreference:`high-performance`,stencil:!1});t.toneMapping=7,t.toneMappingExposure=1;let n=new fr,r=new no(50,16/9,.1,600),i=new Wa(16777215,5592439,2.1),a=new so(16777215,1.9);a.position.set(-6,14,8),n.add(i,a);let o=new es(t),s=new Jl;n.environment=o.fromScene(s,.04).texture,s.traverse(e=>{e.geometry?.dispose(),e.material?.dispose?.()}),o.dispose(),`environmentIntensity`in n&&(n.environmentIntensity=.5);let c=document.createElement(`canvas`);c.width=4,c.height=256;let l=new Ji(c);l.colorSpace=dt,n.background=l,n.fog=new dr(9344220,38,150);function u(e){let t=c.getContext(`2d`),r=t.createLinearGradient(0,0,0,256);r.addColorStop(0,e.skyTop),r.addColorStop(.62,e.fog),r.addColorStop(1,e.skyBottom),t.fillStyle=r,t.fillRect(0,0,4,256),l.needsUpdate=!0,n.fog.color.set(e.fog),i.color.set(e.hemiSky),i.groundColor.set(e.hemiGround)}let d={width:0,height:0,aspect:1};function f(){let n=Math.max(1,e.clientWidth),i=Math.max(1,e.clientHeight);if(n===d.width&&i===d.height)return!1;d.width=n,d.height=i,d.aspect=n/i,t.setSize(n,i,!1);let a=64*Math.PI/180,o=2*Math.atan(Math.tan(a/2)/d.aspect)*180/Math.PI;return r.fov=Math.min(78,Math.max(46,o)),r.aspect=d.aspect,r.updateProjectionMatrix(),!0}return{renderer:t,scene:n,camera:r,size:d,setTheme:u,resize:f,lights:{hemi:i,sun:a},sky:l,render:()=>t.render(n,r)}}async function Zl(e=2500){if(!document.fonts?.load)return!1;try{return await Promise.race([document.fonts.load(`64px "Lilita One"`),new Promise((t,n)=>setTimeout(()=>n(Error(`font timeout`)),e))]),!0}catch{return!1}}function Ql(e){let t=-1,n=-1;for(let r of e.city.buildings){if(e.lit[r.id])continue;let i=e.near[r.id],a=0;for(let t=0;t<i.length&&t<14;t++)e.lit[i[t]]||a++;a>n&&(n=a,t=r.id)}return t}function $l(e,t){return t.aimX=0,t.aimZ=0,e.phase!==`run`||e.strikesLeft<=0?(t.hold=!1,t):e.holding?(t.hold=e.charge<(e.params.bandLo+e.params.bandHi)/2,t):e.bolts.length>0?(t.hold=!1,t):(t.aim=Ql(e),t.hold=t.aim>=0,t)}function eu(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}function tu(e){let t=(typeof e==`string`?eu(e):e)>>>0,n=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};return{next:n,range:(e,t)=>e+(t-e)*n(),int:(e,t)=>Math.floor(e+(t-e+1)*n()),chance:e=>n()<e,pick:e=>e[Math.floor(n()*e.length)]}}var nu=(e,t,n)=>e<t?t:e>n?n:e,ru=(e,t,n)=>e+(t-e)*n;function iu(){return{hold:!1,aim:-1,aimX:0,aimZ:0}}var au=iu();function ou(e=1,t={}){let r=n.strike,i=n.chain,a=t.voltage|0,o=t.fork|0,s=t.capacitor|0,c=t.strikes|0,l=t.gold|0,u=e===1?r.firstCity:null,d=Math.max(.05,Math.min(u?u.bandLo:1,r.band[0]-r.capacitorStep*s));return{e0:i.e0+i.e0PerVoltage*a,range:i.range+i.rangePerVoltage*a,fork:Math.min(1,i.fork+i.forkPerLevel*o),fillSec:u?u.fillSec:r.fillSec,bandLo:d,bandHi:r.band[1],strikes:r.strikes+Math.min(r.maxStrikeLevels,c),gold:e>=n.city.goldFrom?l:0}}function su(e){let t=n.city,r=nu((e-1)/(t.rampCities-1),0,1),i=Math.min(t.maxBuildings,Math.round(t.buildings*t.growth**(e-1)));e>1&&(e-1)%t.themeEvery==0&&(i=Math.round(i*t.themeRelief));let a=ru(t.park[0],t.park[1],r),o=Math.max(Math.ceil(Math.sqrt(i)),Math.round(Math.sqrt(i/(1-a)))),s=Math.max(1,Math.ceil(o/t.districtMax)),c=Array.from({length:s},(e,t)=>Math.floor(o/s)+ +(t<o%s));return{n:i,park:a,grid:o,per:s,sizes:c,avenue:ru(t.avenue[0],t.avenue[1],r),heightMax:ru(t.heightMax[0],t.heightMax[1],r),theme:Math.floor((e-1)/t.themeEvery)%t.themes}}function cu(e,t){let n=e=>Math.min(t.maxVisual,e*t.visualGrow),r=e=>n(e)+t.capOverhang,i=t.footprintMin*t.visualGrow,a=r(t.lotPitch*t.footprint[1])+t.clearance,o=(e,r,a,o)=>{let s=e=>Math.max(0,n(e)-i),c=Math.min(o/2,s(e[a])),l=Math.min(o-c,s(r[a]));c=Math.min(s(e[a]),o-l),e[a]=(n(e[a])-c)/t.visualGrow,r[a]=(n(r[a])-l)/t.visualGrow};for(let n=0;n<8;n++){let n=!1;for(let i=0;i<e.length;i++)for(let s=i+1;s<e.length;s++){let c=e[i],l=e[s],u=Math.abs(c.x-l.x),d=Math.abs(c.z-l.z);if(u>=a||d>=a)continue;let f=(r(c.w)+r(l.w))/2+t.clearance-u,p=(r(c.d)+r(l.d))/2+t.clearance-d;f<=1e-6||p<=1e-6||(f<=p?o(c,l,`w`,2*f):o(c,l,`d`,2*p),n=!0)}if(!n)break}}function lu(e,t,r=0){let i=n.city,a=su(e),o=tu(`${t}:city:${e}`),s=i.lotPitch,c=a.grid*s+(a.per-1)*a.avenue,l=c/2,u=[];for(let e=0,t=-l;e<a.per;e++)u.push({x0:t,w:a.sizes[e]*s}),t+=a.sizes[e]*s+a.avenue;let d=[];for(let e=0;e<a.per;e++)for(let t=0;t<a.per;t++)for(let n=0;n<a.sizes[e];n++)for(let r=0;r<a.sizes[t];r++){let c=u[t].x0+(r+.5)*s+o.range(-i.jitter,i.jitter),f=u[e].x0+(n+.5)*s+o.range(-i.jitter,i.jitter),p=o.chance(a.park),m=Math.hypot(c,f)/Math.max(1,l)+o.range(0,.35);d.push({i:d.length,district:e*a.per+t,x:c,z:f,park:p,key:m})}let f=(e,t)=>e.key-t.key||e.i-t.i,p=d.filter(e=>!e.park).sort(f).slice(0,a.n);p.length<a.n&&p.push(...d.filter(e=>e.park).sort(f).slice(0,a.n-p.length)),p.sort((e,t)=>e.i-t.i);let m=[],h=new Map;for(let e of p){let t=Math.round(o.range(i.heightMin,a.heightMax)*2)/2,r={id:m.length,district:e.district,x:e.x,z:e.z,w:s*o.range(i.footprint[0],i.footprint[1]),d:s*o.range(i.footprint[0],i.footprint[1]),h:t,tipY:t+i.antenna,floors:Math.floor(t/n.payout.floorM),roof:`flat`,gold:!1,seed:o.next()};m.push(r),h.has(e.district)||h.set(e.district,[]),h.get(e.district).push(r.id)}cu(m,i);let g=[];for(let[e,t]of[...h.entries()].sort((e,t)=>e[0]-t[0])){let n=e%a.per,r=Math.floor(e/a.per),i={id:g.length,members:t,x:u[n].x0+u[n].w/2,z:u[r].x0+u[r].w/2,w:u[n].w,d:u[r].w};for(let e of t)m[e].district=i.id;g.push(i)}let _=tu(`${t}:roof:${e}`);for(let e of m){let t=_.next();e.roof=e.h>.75*a.heightMax&&t<.5?`spire`:t<.35?`stepped`:`flat`}if(r>0){let n=tu(`${t}:gold:${e}`),i=m.map(e=>e.id).sort((e,t)=>m[t].h-m[e].h||e-t),a=i.slice(0,Math.max(4,Math.ceil(i.length*.6))),o=new Set,s=0;for(let e=0;e<400&&s<Math.min(r,m.length);e++){let e=m[a[Math.floor(n.next()*a.length)]];e.gold||o.has(e.district)&&o.size<g.length||(e.gold=!0,o.add(e.district),s++)}}let v=u.map(e=>({c:e.x0+e.w/2,w:e.w}));return{level:e,theme:a.theme,width:c,depth:c,plan:a,buildings:m,districts:g,grid:{xs:v,zs:v}}}function uu(e,t){let n=e.x-t.x,r=e.z-t.z,i=e.tipY-t.tipY;return Math.sqrt(n*n+i*i+r*r)}function du(e,t){let n=e.buildings;return n.map(e=>{let r=[];for(let i of n){if(i===e)continue;let n=uu(e,i);n<=t&&r.push([i.id,n])}return r.sort((e,t)=>e[1]-t[1]||e[0]-t[0]),Int32Array.from(r.map(e=>e[0]))})}function fu({level:e=1,seed:t=`storm`,up:n={},extraStrikes:r=0,params:i=null}={}){let a={...ou(e,n),...i||{}},o=lu(e,t,a.gold),s=o.buildings.length,c=a.strikes+r;return{level:e,seed:t,city:o,params:a,near:du(o,a.range),phase:`ready`,t:0,rng:tu(`${t}:bolts:${e}`),lit:new Uint8Array(s),litAt:new Float32Array(s).fill(-1),litGen:new Uint8Array(s),paid:new Int32Array(s),litCount:0,districtLit:new Int32Array(o.districts.length),districtDone:new Uint8Array(o.districts.length),districtsDone:0,strikesLeft:c,strikesMax:c,strikeCount:0,nextFull:!1,holding:!1,holdT:0,needRelease:!1,charge:0,lastRelease:null,bolts:[],boltSeq:0,cascadeHops:0,cascadeValue:0,bestChain:0,score:0,events:[]}}function pu(e){return e.city.buildings.length?e.litCount/e.city.buildings.length:0}function mu(e){for(let[t,r]of n.payout.plates)if(e>=t-1e-9)return{at:t,mult:r};return{at:0,mult:1}}function hu(e){return Math.max(0,Math.round(e.score*mu(pu(e)).mult))}function gu(e){return e.phase===`ready`&&(e.phase=`run`,e.t=0,e.events.push({type:`runStart`}),!0)}function _u(e,t){return e.strikeCount>0||e.phase!==`ready`&&e.phase!==`run`?!1:(e.strikesLeft+=t,e.strikesMax+=t,!0)}function vu(e){return e.phase!==`won`&&e.phase!==`failed`||e.litCount>=e.city.buildings.length?!1:(e.strikesLeft+=1,e.strikesMax+=1,e.nextFull=!0,e.phase=`run`,e.events.push({type:`extraStrike`}),!0)}function yu(e,t,n,r=!1){let i=-1,a=1/0;for(let o of e.city.buildings){if(r&&e.lit[o.id])continue;let s=(o.x-t)**2+(o.z-n)**2;s<a&&(a=s,i=o.id)}return i}function bu(e,t){let r=e.params;return t>1?`over`:t>=r.bandLo&&t<=r.bandHi?`super`:t>r.bandHi?`hot`:t<n.strike.weakBelow?`weak`:`charged`}function xu(e,t,r=!1){let i=n.strike,a=e.params.e0;if(r)return{band:`super`,energy:Math.floor(i.superShare*a),bolts:i.superBolts};let o=bu(e,t);if(o===`super`)return{band:o,energy:Math.floor(i.superShare*a),bolts:i.superBolts};if(o===`hot`||o===`over`)return{band:`hot`,energy:a,bolts:1};if(o===`weak`)return{band:o,energy:Math.max(1,Math.round(i.weakShare*a)),bolts:1};let s=Math.min(1,i.weakShare+1.25*(t-i.weakBelow));return{band:o,energy:Math.max(1,Math.round(a*s)),bolts:1}}function Su(e,t,n=au){let r=e.t,i=e.t+t;if(e.phase===`run`){Cu(e,t,n,r),Du(e,i);let a=e.litCount===e.city.buildings.length;e.bolts.length===0&&!e.holding&&(e.strikesLeft===0||a)&&Nu(e)}e.t=i}function Cu(e,t,r,i){if(e.strikesLeft<=0||e.litCount===e.city.buildings.length){e.holding=!1,e.charge=0;return}if(r.hold||(e.needRelease=!1),r.hold&&!e.needRelease){let a=e.params;e.holding||(e.holding=!0,e.holdT=i,e.charge=0,e.events.push({type:`chargeStart`}));let o=e.holdT+a.fillSec+n.strike.overSec;if(i+t>=o-1e-9){e.charge=(o-e.holdT)/a.fillSec,e.needRelease=!0,wu(e,r,o,!0);return}let s=e.charge;e.charge=(i+t-e.holdT)/a.fillSec,s<a.bandLo&&e.charge>=a.bandLo?e.events.push({type:`band`,band:`super`}):s<=1&&e.charge>1&&e.events.push({type:`band`,band:`over`});return}e.holding&&wu(e,r,i,!1)}function wu(e,t,r,i){let a=e.charge;e.holding=!1,e.charge=0;let o=i?{band:`fizzle`,energy:n.strike.fizzleEnergy,bolts:1}:xu(e,a,e.nextFull);e.nextFull=!1;let s=e.city.buildings.length,c=t.aim>=0&&t.aim<s?t.aim:yu(e,t.aimX,t.aimZ,!0);if(c<0)return;e.strikesLeft--,e.strikeCount++,e.cascadeHops=0,e.cascadeValue=0,e.lastRelease={charge:a,band:o.band,energy:o.energy,bolts:o.bolts,target:c};let l=e.city.buildings[c];e.events.push({type:`strike`,n:e.strikeCount,target:c,band:o.band,energy:o.energy,bolts:o.bolts,charge:a,x:l.x,y:l.tipY,z:l.z,t:r}),e.lit[c]||Au(e,c,0,0,r,-1);let u=+(o.bolts>1),d=null;for(let t=0;t<o.bolts;t++){let t=Eu(e,c,o.energy,u,r,o.band===`fizzle`);d?e.events.push({type:`fork`,bolt:d.id,child:t.id,at:c,gen:u,bolts:e.bolts.length,forced:!0,t:r}):d=t}}function Tu(e){let t=n.chain;return t.hopFast+t.hopSlow*nu(1-e.e/e.eStrike,0,1)}function Eu(e,t,n,r,i,a){let o={id:e.boltSeq++,at:t,e:n,eStrike:Math.max(1,n),gen:r,depth:0,next:0,strike:e.strikeCount,noFork:a};return o.next=i+Tu(o),e.bolts.push(o),o}function Du(e,t){let r=n.chain;for(;;){let i=-1,a=1/0;for(let t=0;t<e.bolts.length;t++){let n=e.bolts[t];(n.next<a||n.next===a&&n.id<e.bolts[i].id)&&(a=n.next,i=t)}if(i<0||a>t)break;let o=e.bolts[i],s=o.at,c=o.e>0?Ou(e,s):-1;if(c<0){e.bolts.splice(i,1),e.events.push({type:`boltEnd`,bolt:o.id,at:s,t:a,grounded:o.e>0}),e.bolts.length===0&&ju(e,a);continue}o.e--,o.depth++,o.at=c,e.cascadeHops++,e.events.push({type:`hop`,bolt:o.id,from:s,to:c,gen:o.gen,depth:o.depth,chain:e.cascadeHops,t:a}),Au(e,c,o.gen,o.depth,a,o.id);let l=e.city.buildings[c].gold;if(l&&(o.e+=n.gold.energy),o.e>0&&!o.noFork&&e.bolts.length<r.maxBolts&&(l||e.rng.next()<e.params.fork)){let t=Math.ceil(r.forkShare*o.e);o.e=t,o.gen=Math.min(12,o.gen+1);let n=Eu(e,c,t,o.gen,a,!1);n.eStrike=o.eStrike,n.depth=o.depth,n.next=a+Tu(n),e.events.push({type:`fork`,bolt:o.id,child:n.id,at:c,gen:o.gen,bolts:e.bolts.length,forced:l,t:a})}o.next=a+Tu(o)}}function Ou(e,t){let n=e.near[t];for(let t=0;t<n.length;t++)if(!e.lit[n[t]])return n[t];return-1}function ku(e,t,r){let i=n.payout,a=Math.round((1+t.floors/i.floorsDiv)*i.cityGrowth**(e-1)*Math.min(i.depthCap,1+i.depthStep*r));return Math.max(1,a)*(t.gold?n.gold.pay:1)}function Au(e,t,r,i,a,o){let s=e.city.buildings[t];e.lit[t]=1,e.litAt[t]=a,e.litGen[t]=r,e.litCount++;let c=ku(e.level,s,i);e.paid[t]=c,e.score+=c,e.cascadeValue+=c,e.events.push({type:`light`,b:t,value:c,gen:r,depth:i,gold:s.gold,bolt:o,x:s.x,y:s.tipY,z:s.z,t:a});let l=s.district;e.districtLit[l]++;let u=e.city.districts[l].members;if(!e.districtDone[l]&&e.districtLit[l]===u.length){e.districtDone[l]=1,e.districtsDone++;let t=0;for(let n of u)t+=e.paid[n];let r=Math.max(1,Math.round(n.payout.districtShare*t));e.score+=r,e.cascadeValue+=r,e.events.push({type:`district`,d:l,bonus:r,x:e.city.districts[l].x,z:e.city.districts[l].z,t:a})}}function ju(e,t){e.bestChain=Math.max(e.bestChain,e.cascadeHops),e.events.push({type:`cascadeEnd`,hops:e.cascadeHops,value:e.cascadeValue,lit:e.litCount,t})}function Mu(e){let t=n.payout;return ru(t.passAt,t.passTo,nu((e-t.passRampFrom)/(t.passRampCities-t.passRampFrom),0,1))}function Nu(e){let t=pu(e);e.phase=t>=Mu(e.level)-1e-9?`won`:`failed`,e.events.push({type:`runEnd`,share:t,plate:mu(t),phase:e.phase})}function Pu(e){if(e.phase!==`run`)return!1;for(let t of e.city.buildings)e.lit[t.id]||Au(e,t.id,0,0,e.t,-1);return e.bolts.length=0,e.strikesLeft=0,e.holding=!1,Nu(e),!0}function Fu(e,t=0){if(e.phase!==`run`)return!1;let n=e.city.buildings.length,r=Math.min(n-1,Math.round(nu(t,0,1)*n));for(let t of e.city.buildings){if(e.litCount>=r)break;e.lit[t.id]||Au(e,t.id,0,0,e.t,-1)}return e.bolts.length=0,e.strikesLeft=0,e.holding=!1,Nu(e),!0}var Iu={level:1,bestLevel:1,coins:0,upVoltage:0,upFork:0,upStrikes:0,upCapacitor:0,upGold:0,runs:0,wins:0,fullPowers:0,bestShare:0,bestChain:0,plates:{},userMuted:!1,lastFreeUpgradeAt:0,lastBoostAt:0,lastBoostRun:-99,lastCashAt:0,lastGiftDay:-1,giftStreak:0,lastSeenAt:0,skin:`cyan`,owned:[`cyan`],tried:[]},Lu={2:e=>({coins:Math.max(0,e.coins|0),userMuted:!!e.userMuted}),3:e=>({...e,tried:Array.isArray(e.tried)?e.tried:[],lastGiftDay:Number.isFinite(e.lastGiftDay)?e.lastGiftDay:-1,giftStreak:Number.isFinite(e.giftStreak)?e.giftStreak:0,lastBoostRun:Number.isFinite(e.lastBoostRun)?e.lastBoostRun:-99,owned:Array.isArray(e.owned)&&e.owned.length?e.owned:[`cyan`]}),4:e=>({...e,upVoltage:Math.min(r.upgrades.voltage.max,(e.upVoltage|0)*2),upFork:Math.min(r.upgrades.fork.max,(e.upFork|0)*3),upCapacitor:Math.min(r.upgrades.capacitor.max,(e.upCapacitor|0)*2)})},Ru=[{id:`cyan`,glow:`#4df3ff`,core:`#ffffff`},{id:`magenta`,glow:`#ff3fd8`,core:`#ffe6fa`},{id:`solar`,glow:`#ffcc33`,core:`#fff8d6`},{id:`plasma`,glow:`#6dff7a`,core:`#eaffea`},{id:`ember`,glow:`#ff7a2f`,core:`#fff0e0`},{id:`frost`,glow:`#bfe8ff`,core:`#ffffff`},{id:`violet`,glow:`#a66bff`,core:`#f1e8ff`},{id:`ruby`,glow:`#ff3355`,core:`#ffe0e6`},{id:`rainbow`,glow:`#ff9ad5`,core:`#ffffff`},{id:`void`,glow:`#5b3fe0`,core:`#d8ccff`},{id:`aurora`,glow:`#5dffc8`,core:`#e8fff8`},{id:`legend`,glow:`#fff1b0`,core:`#ffffff`}],zu=e=>Ru.find(t=>t.id===e)||Ru[0];function Bu(e,t=null){return zu(t||e.skin)}var Vu=e=>e>=1e3?Math.round(e/50)*50:Math.round(e/5)*5;function Hu(e){let t=e.owned.length;if(t>=Ru.length)return null;let n=r.skins;return Math.round(n.base*n.growth**(t-1)/5)*5}function Uu(e,t){let n=Ru.filter(t=>!e.owned.includes(t.id));return n.length?n[Math.min(n.length-1,Math.floor(t()*n.length))].id:null}var Wu={voltage:{key:`upVoltage`,...r.upgrades.voltage},fork:{key:`upFork`,...r.upgrades.fork},strikes:{key:`upStrikes`,...r.upgrades.strikes,max:Math.min(r.upgrades.strikes.max,n.strike.maxStrikeLevels)},capacitor:{key:`upCapacitor`,...r.upgrades.capacitor},gold:{key:`upGold`,...r.upgrades.gold}};function Gu(e,t){let n=Wu[e],r=t[n.key];return r>=n.max?null:Vu(n.base*n.growth**r*(n.lateGrowth??1)**Math.max(0,r-(n.lateFrom??n.max)))}function Ku(e){return{voltage:e.upVoltage,fork:e.upFork,strikes:e.upStrikes,capacitor:e.upCapacitor,gold:e.upGold}}function qu(e){let t=Wu.voltage;return Gu(`voltage`,e)??Vu(t.base*t.growth**(t.max-1))}function Ju(e){let t=new Date(e);return Math.floor((e-t.getTimezoneOffset()*6e4)/864e5)}function Yu(e,t){let n=r.gift.streak.length;if(e.lastGiftDay<0||e.giftStreak<=0)return 1;let i=t-e.lastGiftDay;return i<=0?Math.max(1,e.giftStreak):Math.max(1,Math.min(n,e.giftStreak+1-(i-1)))}function Xu(e){let t=r.gift.runCoins,i=Math.max(1,e);if(i<=t[0][0])return t[0][1];for(let e=1;e<t.length;e++){let[n,r]=t[e-1],[a,o]=t[e];if(i<=a)return r*(o/r)**((i-n)/(a-n))}let[a,o]=t[t.length-1];return o*n.payout.cityGrowth**(i-a)}function Zu(e,t){let n=Ju(t),i=Yu(e,n),a=r.gift.streak[i-1];return{day:n,streak:i,mult:a,amount:Vu(r.gift.runs*Xu(e.bestLevel)*a)}}function Qu(e){return Math.min(100,Math.round((Math.max(1,e)-1)/n.city.rampCities*100))}var $u=(e,t,n)=>Math.max(0,Math.ceil((e+t*1e3-n)/1e3)),ed=e=>e>=100?Math.round(e/10)*10:Math.max(5,Math.round(e/5)*5);function td({available:e,revivesUsed:n,progress:r}){return e&&n<t.revivesPerSession&&r>=t.reviveMinProgress&&r<1}function nd(e,n){return e.runs<t.boostAfterRuns?!1:e.runs-e.lastBoostRun>=t.boostEveryRuns||n-e.lastBoostAt>=t.boostCooldownSec*1e3}function rd(e,{available:n,due:r,boostedThisRun:i}){let a=r&&!i,o=qu(e);return{visible:a&&n,coin:a,cost:o,affordable:e.coins>=o,strikes:t.boostStrikes}}function id(e,n,{available:r,now:i}){let a=Gu(e,n),o=$u(n.lastFreeUpgradeAt,t.freeUpgradeCooldownSec,i)>0;return{visible:r&&a!==null&&n.coins<a&&!o}}function ad(e,{available:n,now:r}){let i=Hu(e),a=$u(e.lastCashAt,t.cashCooldownSec,r),o=i===null?0:ed(i*t.cashShare),s=i!==null&&e.coins<i;return{visible:n&&s&&a===0,amount:o,cooldown:s?a:0}}function od(e,n,{available:r,trialActive:i}){return!!n&&r&&!i&&e.runs>=t.trySkinFromRuns&&!e.owned.includes(n)&&!e.tried.includes(n)}function sd(e,{available:n,now:r,resultsThisSession:i}){let a=Zu(e,r),o=i>0&&e.lastGiftDay!==a.day;return{visible:o,video:o&&n,factor:t.giftVideoFactor,...a}}var cd=new URL(`buzz-C26l8mKy.mp3`,import.meta.url).href,ld=new URL(`charge-CUKWOUmy.mp3`,import.meta.url).href,ud=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAGHwBVVVVVVVVVVVVVVVVVVVVVVVVVgICAgICAgICAgICAgICAgICAgICqqqqqqqqqqqqqqqqqqqqqqqqqqtXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJASWAAAAAAAABh8d3sm3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAAC3SPMlRhgAIcp6z3HoACAAErJgMBk6IEEN7GAgAAAREREKuBgYAAACIWiAYGBiziBEd3DgYGBgYGACC3f/64cDAwMPRACAIA+D4Ph/wQB8HwfB8CAgCG/WBAQDH1g4CDv/4nB8HHfxICAIMnVxxtuFMNlMNuNRqRAWGwuc5iOYA7GsEKBXIoPtaRbTONtGCw6ihoKDArBIeA8rAIGIM5KLMEwcA0MHLmpjhQOzHEdgXl283/LDjFcUpzKPpkThh3F9h46MHgLDLuHm4not6T/OFBQYHhib3X9TLt86zUd/9tFCnnh5CjrUovAh/YxLShyB0gaT2cggEABBBSDEVK//tixAaADqTdb5j1gAGXF6lvnpAArBpHijXE+3wqlGxynHMkGmK9EGBAaCDdBxAuLQRQ/G3ggj0dOFZGfDncPRIiA72pG65zdPQJipbK5q5YvJjLc6a83/dPMs2PObW/xsVdNfnXH/5EQIDSIJtiMl9KBOYE4pyhkAvv1cqELFGAABAqgpSWIchyqIVHQlSqGRzSTEl25/Fkqh6QqbYWLGpNPeJXF4oYYSqNLMxi6eL5+TNNPSXQoUW3VLsim4JSuMYs+t8n/N/uLJgiVXHDAmc/hhzrjXljwdW4b+dJ5K5HqAoLTOIAFEoS8ph8StUnqdhYjKZnJJLbc3uPiIlPOHyQzNTEvP/7YMQRgM8lcTqHsLGB+CflkYSN+IOj0dmJgToh2WlZMNI8GzSmZOktYJ5gtKjmBocjZCPZ1ahJaFZHH5wZb2QxDBbNEn2cpijHV0Z5hhyEFhZr26fEisYVLzqVv+Uvkcrf/oaj+qxoLIfIgwxIgAxKSzbq7NA0Vrk0/7r0kehmG35s2XZZGicQh88dEoVqBdVIyMpNkTWNLIpvF6SVc9XCyyza8ZkpYmlDaTZRPqSpCnNR6TTNuKyzopkQIKY8DHg4tmsBHRMHI9ASeOGKAKgytQ9IC4PJ/7aib6MQImL1Swx9bw0mIVpL1QoUkyAQ7U0U3piEXx1LYoHUut2TLS2YDUNHAf/7YMQNgM7hRyqMMMNJ5KqlIYYYMJM0YVBJMMogbXDNMIuhtkZrTTdaM+ZeyNk5qOyTkZzx2RkiVP0/qRL7bDYiyWLI7N3D2jT+dVzn2vWn96iZLI1k79aC9/TeL3/lL6/tQg0858HBS368z8aylXX9Lf4Ab8pSJbYXGg6CAOgJlMdx+HceyckRgqRMW4GTFJCsPSTs+PAjSKQFtpdtxjUN/ObTN6RmFulReflnlOioW3E1igK6lNoqmpLaNVcbk4Y3Z37vHerZNaDXJVUBv+bqRW90mi8/Z+377C8r5vvPqAbcty9AfGuJTKoAWQAACwwUVMVIlYrEQAhlDLVRSKQCgBDIVP/7YMQNA8zA/R8MJGXAAAA0gAAABFQqRb7IUMViImk2pBiDAQrgE3f/jMq/tqUOqqrVNV8MarhV2FMBNs2zMd+r/xSjfVVv+gIlSowOgqCwFcHTpH53IiUJnQ5Wd6ip3h1MQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==`,dd=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAALAAAMPwAqKioqKioqKipAQEBAQEBAQEBVVVVVVVVVVVVqampqampqamp/f39/f39/f3+VlZWVlZWVlZWqqqqqqqqqqqq/v7+/v7+/v7/V1dXV1dXV1dXq6urq6urq6ur///////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJAMtAAAAAAAADD/wT+mxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAAzAERGAewY8HBMORRhgx4CQFgeRQTAOB8nvsEgmOUowscXr169e+2vF/EQAABCOBgYs6++iIibm/9c3FoiIV/304IV0zzCACI+iV3d0CACaJwOLfru7/ET4j+59dxAIAhycHw9lAQP+CAIXS4fq1OADKiIAAEGNV2raIpBCQD68aiiZgYF50ZLz9Ststbfo5KzDhBw5kAuhiigeQF/VKWL0sLRjTrnMO5nQQcKkGDVgK+ZuDUZ6Y8tTDxFOaBR81HCFiOEjEgTLLLFoXpvpCLTS+h+w/+fG/dYX9PP3g34RUFi1AABHjCEMNNjRRyQy2otOMqWblwpEQwxn07VEu5//tixA+ATwGHIQeYU8G4MORtgwnwsh0nVR7aO86UxmFPGX+aW8Oxy7ZijuZOxG40bu5hm67NZkoVZ+EaQ1yKi3dj8iSVJKLK5/K7w2SqgmcrOwIdHxxssswKNchipMNBo9CR6E1VwfgggA+zn4oFouJAIdYSSxXF0otDD5SGXPTKIKh2PxehhtlICHEo4VPX4/NWokVHxld8/g0tppO7Du0Rdm65MURr2qdbinMcUUPUGZHSEQymcwlKVM4oMyjtONsp5jIVJ+wcfGHqKdHVtfVtG6NkN+MwhtCPxhKAAHeikNMEZTOoScp+PZTDzPRGmhQMwlXk0s2fWeVNRNVX0yEkLD/10P/7YMQVANDphxynsM2CCy/j4rBgAMsXxO+22Ws9W4rCaSVhURoomxxr6bpKDSP8n7FHtJAlq0MtfSzkYQhgW07GGTV80G5Zc81bYwLr44FVPEfHVR/IHRKCRWl73S/9l6z1LRys7nItn/JpFlwq9PMzssGhgAuZhjHGdXG4tEZ3BzjVaXtFRw/M2yKAsStEkmCH2MJhYDkiQEDjA9GDxhUoFmExqBboOjYtJKVhsNzBApO1hhv/5+pndjWnhDT0jyrQIVYsHJoJtm3iJf8fm7y+XngDz8hnKaec35iKLF/5Xc7ur91/tcdr//S6BWfuU3cgiZ0Ltu13u3+/01lrleitYEZIZP/7YMQIAA+BN1W49YAR3a4wPxKAAMWE8E2gU6tqhbrFZCTSQaG85sO0BM6UjakfQJIwtYnEo8+DxRRZByThaq1yENTjzQtuoUvPW6thmehi/3Hb2NdOaWpsOPa95wuJxzdEt073U+Ga29nxV838z/Etazp13LeanPr//828uUcC6blrqrl7qaiKVLYyIhCKxqJzBASA5uzaJyGU9VBvxcsCQCsuePFBGBUIe10Jh6Dg5KDn9hRbMkVD08Jw8+VNuXTcgOQ6LcU//4FDERBcYPJswX//4l/q/Gh2Re/8r//v9eiVvFjq5XeY////fu0TSv/YWJKOOGxZqjK9zMmFTkACP4uQdf/7YMQGAA201Vvc8wAJ6KypuPSqOLLCMIvJlKU3i6zPlQaTOhjGFlpIaRdzENR3Hx/cW7F1G/vFZW+Gxis35iRFLCboO2//4OQRqcXj06NGxfo2uYmCBYIyQDmv///b7hkfTkXwlf3+nmd9UYtp/B0iQMd+qaBalVTcy4kgAAFGBlAyORvsZfF80JFyYZusytndtWIjizShnQMK3cYXUo1kIqwWq/nnrldXb50MvPZR3tixCRG+2zv/D4iWJlTrKbMq1TdSZNeAFDJUH4gQFgoxyiPi//5nUsVVy72TU2dzXVJ5rOc/Mu8wx1bQ46Rd3k4xeKqJRRAAAQ1D0a3gqHof7l8dh//7YsQKAE+VY0nGLHPB1iEoeMSKeMCoyOyqVlae1uL6RauXHnfH+j1dKzpSnTXnmpucgc7Hii2EUT5DmBNGk1GwbimM0QJixKJa5OHaiYWlZKrcddpGpNuToJRSDlAs2/o75v5f7/5rGN1UtVW/szKUrGX+92yh+xZj1yKPWIxES8mIkANcIPeSx/CZIKy6UlaoQFojKTK8nR2seW2lP+fztMZU9yVr7N1vxzLpMzEkiYLR5MWXgbkTg+CIZJDPJyI4TOFZvUEk/3urwd8SaM7ygXPpclLhL/+2Lf+CH/yiSJShagWJXhGfdQkYdYQcVAK1dFUVeIZjIQAAAQREIKSWI50WlJP/+2DECQCPWR09xiVRweOhpzjzJbABscqTqTZyM7tA3zpl3Y1P+8pOrkipWPIUEY4ydQqziVmcWqezvh6CgdNmjhoRMoHKjenGwfAkIsItT/T6WJIZHELkgggPhTxmNwvSL49Y5J39LmHm10dWKNchADskywSNJOnBYQqWP6ROGV1QhIBWMrhbHM2DqcUq1n+o1SdfYhRoG2MDUOQNlMkk3bMlo3EyRhQjFH4qbSpJiyVYaasEXyEwMtg2CI41J5WoKPEVUyNXWHc6FuTaRNB8yc80BoTjpwnQosz//+P////q4SktoCSNOIeKwS41ZISkqRKY8t9SM5eXhVIyAAAVAMDWHKj/+2DEBwAOYVk95hixycEaprjzMegohR41g2Iw5FcrDFSTpODtc6v8UapyKP157PDy1nYa+6Zm5fo16NMz4UBwkddg24DaVcY14P2GwtD7uL/s1jjhoqKgWyFZ2fzdvO56KQhh1u5ZET3T0medtCK8SFhXxiToP/x3GANGWGZQEAABJYdRYmEYiZPdWHjcv59p8w4tUiwJhgQF7pJolLIfDY/L02ZnvZx2O8MStKCVGG9YeT22oTH6xS0mgfUJbKmDlN6av9taa0wq2826L0uHy40EMJH6jJKggeIhMQLx6kCVbN/sQe1FZ3uqRWWGZkEsABsIxBzj0btMul74PI3Sy/ecDQf/+2DEDQAN2Xs1zBixibebZVGEpJjEpLLpFFL1xjZN5cN7Yzdk/5kvEPOYf6X1IJlJJF7jonCzAsJMn5QqB5I7EFxrjefVBEORos0saFBYGTuLfk6MNO2m10f0fq+rbc/St3e16b/43DdwSItpgNbUiJedBdrbLnRSu0YmLA+TojCy468zU1qpfPUaSRZlGsQkK/kZxb7yyTPWLIcksosCRAkyaSRImx/ZpPVFQlJxQKZK7VsYVpZWk4s/nRIXERG91OE3aoSDnqW8RVoTbImttDTQydcU+K0A0KREDxkDTeAvYDIk+bnq5aYpzRgTikgIkmkXSb/rnrKliLaQhRUxbVvmlCP/+2LEFoDMiN0qjDDBQaebZRGHpBCxJMiyaMFYCUagTpOkCKBdIgqK4/699DPr0h/YMeofhHlv+FXLJtOkUDqrRewJEbEvWy3IKV2axI2jEgY0ukVZKT3QZd2QbDQfGti2KDQpMkT3MRpqcMd1vNZZKtei68dtNImSTbtI75eTCCWMauUGCqEl3bxZdzE101pmP/V4nsMmzH0q2S3asouCPa6QMVJW1ERkVqpSLSs9ccWKvs8P9ioBJqMJiulkebwzU1CNJTqp7Cb1CkmNlitZFE6ziRpcVbXBKn/7XF45HKLR+ovJx+Goubpo04kWgsjueuSsqlQCHLlWHr/7HQEMwYwyqfhV//tgxCeAzEDbJIeYb8GOFN8AkaYZ0WJrMqPBJHPaWSMXZPYardklERCgPmSYUiIPjBAfQrJsPQkSS7DxLWU1axyPyZQVQUsaTUbcTCkRB4jYeytdbsVlUpuajdXCbmlVkpkRLv//yhogaoeiqWK35/K4aoNVK70tFUyUrf/+sSiBqobv7Rf/qpEq8rpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`,fd=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAIAAAJLwA4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVxcXFxcXFxcXFxcXFxjo6Ojo6Ojo6Ojo6OqqqqqqqqqqqqqqqqqsfHx8fHx8fHx8fHx+Pj4+Pj4+Pj4+Pj4+P///////////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJASJAAAAAAAACS/lI0xqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAACuUjJyYMS0muL2Uhhgx5AAZV75qA3bmHGDA8WH69ee4t3Tib4RN356EjZKnc57HP7yEI2hAAAb+QQSQh3RjnchDnfyNU/6Eb5DnOc53qRj+yk/nEO4AGET/APEfwz82gBG07CORHi1coAAoKJMMYsSBGFwSDgOykahyE83UIzw4daSv0ePyNRThgorB0DziJxEiqzmZGfxe5wr0R8xRZObyAyzMuJxAnaWPdA7hGC6bgpC/+JAH3zuHP/9VL2O1XrHz+dpkOH8smBX8Ef+FMV8maCKjjRDAACcMszRXy4okm51nwl1Mf5bC+IiCrVQEHEEhTlbBb1aniIy0F6VCT//tixBaAThWNK2eYb0HmruVSnoABFTMHlYWYiaJ/lQwwLOt9S+0VXkrCFLFNFYu1zCImdE67IhNCy/xmCJB87KP7fmznn3iAiDHf8fRy18ohtP4f/yfzwZBFO2QgAuIaixaz0LodLYkFGWxDVGjk+g37oCLwH6icaSzqsEzA5UQYPGxRDjnluyYvQQjTSqmEE95OP6v74RIg3xjOapqSMhiEqYw+tVIZ1aCpHWPmrqYUokoeSYk2rQVc8xdLFPFz010ZY/2grWX/qq5lJt/z1Hi2KodoVHRHRHQ4U+iABECQQCRnQIgCmHGABVbzjqVEe92NzIg/k6I4wNY0U1lMcYmYgAWkef/7YMQZgBPdkXP49oAR2aBs+56wAiZTQRLR5Hi+FmOIJmbMddSzQzKZJiXmZAHYMko/pkuYMaMOYUh1HicJX+S8uIGx0pmSRKLGcLWOD/ol9yXdnVNRGCWJIvG5abED/6CKZfTc3fQYmlRmfSU+h//2TuX30EPmaTDsPEIe5sbGrK8PDKqEEAABCPG48TERB1NKQG6aKGsJ+q1OoahpsuiW7nXMOdoDcTjzm//TUUnOc6HGxs1jrYbG1gkgJAJAJATFxqamrPumtbzfTkjznX7tre/c5x5yTvd/y1F1/8Qkamp1AROqf5MtTA2kQCIGjpaAQWfUDQTqftzMyGQYAAAAAfrAE//7YMQGgE5xS1XnmLxB1SspeMWh+GXIsaPMptOyi2vqA92WtZNwWXGdYjbxNH1mF6Zp/90tbNtesuv/11uV1/4BU7hqGBP5HvBHfyJxpFrI8QakaLYokSJHoDRosUcQaoeD//6C3jEEXbiQ//s6u8SHxqk+IgA9Y2Rc7rRqm7ekYpAGOkc4EUmmQ4gWJ0BVYu/CV1mVmzfla5iWS1d5133tVOw07B49+0eSVonfZYIBoGIBpsB08ov48Jr8DuRLFAbfsUWLQzOIzEmi6g8FxBE4Qnkn9f///tve8HNMVzD/bT3/i/ZN5JtMs18RNaG8sGpnd7mlZikAAjSQKQVkdJLRzJ5IJ//7YMQKAA71RUXHpFyJ86dnrMwvQJVGU5OUVxmiM6/Hpfwr4i6xebe8RdfNXG1/JbtcS/7A8VMT/ynWA9lesmxQRFx1si2cFmuluJjNZ722jqc/EqOe1VQwQCd56XhrP////4VZZTo6bdjK5fQru/nEq1wJdke//iqT+VsgASSBgzwnD2BoEDsR3+YLq+W0fQtLGt9vMsxO9Xq2mbNxMUnulbSCYGyxOyn/+DV5jiSYTfLLjZNLgkbDa+AST35ith+H2uR9ReI4gTaCpMcUqRSBMCSPRPOrZh/////D7zkM2X3F9VzMu/03Oi9RwLFjy2zTmV7+ijVYWGZiNQAHEbH+TpRJo//7YsQHgA7VXz/HoFyB2StnOPSLkPzoKc/HJXrbVCUESindTu77i6pBhzxdb+ab3v199a+6e0KXeLw4TF/1yhJtm4aMUmo0MByQhNEjvxvn7+cg+hFXKG0hN2OMD0QA2OZ6////M181l59auX1oQ8yItGIhkfdjlFHat6dZG0MzuQgAABCuIKxK0aW6Gh5otyEq4mSGwm1Vr0eO91HxrG7akxuS1cVp7+Dvf+fArmN4LP23/5VyIPpRjfJjEIkxC9VhuP6RfFItHWLYthKj/69HYtOIwXBElxkPt////931NR7FvovTVLbproiN5jLqPOfp1xZv80ggABKwdBcA3DoLmbZ6luX/+2DECYAOKNk1h5mPQe4ipez0H8CkY2KI81fCQ5gkbIMc/uK14MeEtVnejSvh6X0lmg4SNsu+ZQB5CIPRugHhVEItsdXIDH5Ye1Mfuat5pC22QTv2/HU5y5h1Hid/rZUkDMDsiTwk66NoxmBi2li3xxSIw45KymAIEykTzLqURKkiZKsSWmdwfqLx2aEwP9vIe2xxvDlzTFKZxny6zaJnXn8GIzw38Nz9KNinSRDCykqNWKdyiYWLd3zyfsVKCOoxPcgxzwhkugeSOFw8RxYEwXEgbn/+iP0WrOpvUcCq1vIKjSxVdVMFeVOqfSZcWSnZbYwAAEaOIEQagdJokk1a0JRkZGT/+2DECwPLHM0rhixzAAAANIAAAAS46Mly1g+Z72Xf2tbW53/y3uHfuuSSeltU550Mh0mpqoBMBCjoUBLVVWqv6r1S1ARMaARhoqCoNeS/4iwVdyUrLBQeTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=`,pd=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAHAAAIKgA/Pz8/Pz8/Pz8/Pz8/P2BgYGBgYGBgYGBgYGBggICAgICAgICAgICAgICfn5+fn5+fn5+fn5+fn5+/v7+/v7+/v7+/v7+/v+Dg4ODg4ODg4ODg4ODg//////////////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJAPpAAAAAAAACCojgKnNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAACZxZVdQRgAJPn64/MYACMAVFpCAAAJVkQAVmON8Ze9f93/67oiIEAAAQUBAEAx8Ew+UBAMf8H/8u/+D4Pv/8ufwfBAEAQOVg/ggCDv/+f6OGAfB8HwfBwEAQBBxANRExBmSopIf2cckkrDQAOvTFA+jYthtUEpNm6sF6NoWC3UgTHVhZhxJpa9SBmXSmGab/n//HWml3YIZGpC7K0t4FESmJt3apxH2MU7/ROM/HsU9PrNDq69yBUEiy7xmGPf/9fNt+/2X/k8Mp/n2GGP1r+f/cqGe3ll3/3Lu97/1XbfnHWP5UkOAqIjx3+j8qdERVAljd2QBQAAU5TgC4FByo//tixAeAj2zLU/23gAHOmit9lJWjn9SJeVlTLlvtlWLFceV5ZOsTgh1oxXPv//ikD014irPc8w1KzG+62///vZjV5pqI8S3K7wY9q/e/f5fsbPJFfPYude2Pn/Xve9K2iwYoCfGVoaVPCUNCYKmQk53EITExI8zvvRCydnEREb+tIKzRDgKIpJTjZd4yhy1xcVFJnMPPzEndjVWPMxoKBAYNR4VPb9vQqB1KIAwDYGgN9vIpwoOgZDOXfs5zuRRAvb3dznMKHYRLKW+xCFEwEJxBQXcbW8f9lnhTQKK/9/r/6K5/Hej8mCghKpGXw/wUUCFkYfsCZ5sQEwAAAWrNz0k/WRPqrf/7YMQIgI8kq0Xt4YvBzpNn/cwxsM4LtSmpLV3L9uUqN7HwyUBQLLt//xx1K7+TKGZjSOkSpStmJd9FPay376SCUpVrabmmCmK12WX98w84fiOrHgVF8dWrnLmTVufbfSQwOtLnj2t6ioNB3v/WeTkUMJfklU+d/3FU+mRIgKNDgCgBvwP3HcWJKQTqr2dVtpDL47LnA4h4GE1DaJzskguBcN1+JLlrxBYyNXDGWC1reF2pqKLTL/oVlwEwwANIZz5LN0P5S+MP2NQ2FwERFOSb1KM399emZW8uXPNYB0AoBQWDvNPcoKLV0v/ez6fqfkkAPQBAAAA4AH0auZfFRg4CoAl0u//7YMQKAI84oTWuaYvB5ZKl8e3oIcwF0ndcAKgsKjIHCSzbLICr4TMipUljDAm8ACY4Ccz7AxwNN6D0hYw8lhh7B2iGMJCo8FHYFLkqsYVYhEPMWfFQ9S5JFHpIZUotXNoBrAsJBIO0RkTl11uVzuvVq0SkTbPbyRbaOAawAAGAGjGMEYHIA6lkDtMnngeyCACPgEpMPjDjmBoM+sQm4s6zqmNTm3hnhCGqgm0GhUci0mm/DQUdTHjTHnwimUVTPojNI1uI9SZYdQOCUqwEHFQKMBZYu077ayu3WhhxIBgyFv67sVuayyqY2t6pqXHbW8UQU2oqPxpQNEiHNNKjIBMBBxfFK//7YMQIA86UiSIO70HJ5w/jAe5sMJCTmOFpi8GbQal7HPgmPkgSCRQzNHOXYzziA3lkDES5komKl+ACFMepMW+Ok7MiuM+ACgsaAoJVqNuoYYw8FU4OSGRIAY0nrAz6PEtBmig6oWdLGhmSTUOwRBvxnClxs4Vk3pSZ3pF8mGgAYNGIaCKZzBVzBQZmhxOepjBm8RIzskiQUBxggIGES+aCgBsjucFBi0CYsLAwtMSKDGhIwpaCOw6ynNwXTVjkwAOQBgZMBgAZARCApEROZwQmVDoOBH2S4LmLlKwMIAkeUHVLWfQ08r7yiJWsatBTXcbwtTUQD9qPzPUSDCYKzBcCAUAqK//7YsQIgA0gcRg13QASAYviCzuwACfJguNpocZYGH4aBVQJKgRAgYMAeZUmiZoFCYoBiDmybzqkBYwTc8pQ3FE3B0EgguWRSGiBCXMmiBokxwlC1XywkFJKqON8/s7bgvOvQS7PlNnVtVYSe2wBCWChQ2BL0BHcfThGYbiGfZisIAlMRSVMCBGMDyAJgWM7gNEAjmLyzGXITFEHAoQDJgCBgDU7jx0YzZyNZFDdR4wESLtmcnyG4gLDCgUiCTAyZmyL5CEssjcYXk6MTiqIs5I8cKSDS0nH2t96USl2vU2tTPo+UzV17Uv1L/trZQoEKAENBwSjYRhEAAAAA/TkNBACjT/jTMb/+2DEDAAPkKstuZeAAAAANIOAAAQBoUp/1u0E0/3+IwdMJXfmGUiLUSmUX/JejSdo9csUcvv/5Ix/wBM1dtOltbUN//6gR6kUD5DKwYsKuP//6QIl3mY54GhF4DC58P1zvy4gAgw4c1WfoJgMe8+ZZr/+gopzjRMuukxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=`,md=new URL(`ding-BCf_n9pd.mp3`,import.meta.url).href,hd=new URL(`district-D9ZYBtFW.mp3`,import.meta.url).href,gd=new URL(`fail-C7xedx0k.mp3`,import.meta.url).href,_d=new URL(`fanfare-cv_oUgAX.mp3`,import.meta.url).href,vd=new URL(`fizzle-BYJhczOt.mp3`,import.meta.url).href,yd=new URL(`fork-NXtcED3L.mp3`,import.meta.url).href,bd=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAJAAAKNAAzMzMzMzMzMzMzM0xMTExMTExMTExMZmZmZmZmZmZmZmaAgICAgICAgICAgJmZmZmZmZmZmZmZs7Ozs7Ozs7Ozs7PMzMzMzMzMzMzMzObm5ubm5ubm5ubm//////////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJAUtAAAAAAAACjSNeshAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAAC7xpWjTBgBIOnm53HvAAAEGhMc297nYlgQAgDQSDA8WLHBbu7u7uAAAAAAAAIRHd3d3d0REQAEAgD4Pg+D5qCAIAgD4Ph/ygIA+D/4gB8Hz/0A+D4P/xOD4f/icH/y4Pg+DgIO+XBwMf4IO/0FIAcpRoDycv21OpkkAAeVaBJm4EGViROuVPLhCa2dT3v6qJWw38FJRcN2btnlh1ZXkSeJO8iYYhnH1StZc1xROY3iDRDiDzR39op1PoMSPc8ZX/3JGTeNfGaT71f+0bXpuErN7/xn/FM51v01DQfWytMCsrffk9Xd9aevu0a+79H/9GpQYVABJQCE5FB4VCaJUM//tixAcADtUvYT2FgAGoL+y09Yo4QYbVKpnpdTKQ5wzuDYQXpdVeXKHgWN2nri30vu0tSZpIVNay4rrbzs26rg/IquzaV5iW97nxbCCNt2pxcVFRsfV5JU+Y5/5+pv1Yv2cccf8R6sHu97WRZouhHZFa/kYVrxfbENWvbCtQEgjbRSbcRCGyCJiGKUB3twopyMFqZelFhJWiaU2mpeV0ahcRjOVs7x1o76c5WsWENwezsPz3F3pcOIhHn15uazvGdhu8iEbVbdJaMjJmpBjGpan9Oo32+mvVv//1b3brbXoPv9r0/9P/SgBQCiACLApSi7WwPzNMWYGrJPiMQRHGiTxLcHLbxP/7YMQPAA55V1eMMOlB+zUqFYQWoF62xtxbGNSqbJOs6Uc2sdqCgFnkmedato7OhYElaer2MzUPNOmCoMWlTUZFshx6y00ES1TUOsm+r2YW37061TyPv/WnkSN7CuwqJlqsj7ot/fFvXv+hzAGvuRxTcV2wNj1MqyIFQS/5XSQ1K5mXw32S7rWMKazOV9NggdjpVxmTNoQ5cLeDgJXxY96idtkTmhIFklInitiPd1yAU6ITZG5jonAotadSq6kTGPYYInykaqoRpK6K93/ahFbGPemjq17OqoNFOlPd7P1HaasbWG6PK51JqgIYRNaBAAEUKX7Dm4EBKlrorCOlDDtP/K4w/v/7YMQNgBAVYU1MvK3B2KmpqYYV6A23encjiw7hJhCYMFtkbsw8ol5AYEezuCNZ0cNBAQIrC+s6lukUH4nj4p6LqHZGO7WKOVmreUHeR0VUCRV5Lyii1mrj9atdG9NVO6V722vaV9OtH9747ZTWSs8SV6c/6ZH0YvFs4A/khpAJIAFwtRfMXSdUJeOsyCCHAf+Nu5KGP/YYRL1Ti0ejzs5uWNuXTSh4Jbg6Pm6wJChX87fyrIuqIqpYYPs9rXDGWlFlHnopD2GD7Kp9VBGWrJld9CXo90rSo92r3RuidW9fHv6KmyWyl/Rtktkg7p22bKIOhgIAFZ08lFHBITxYClhuAKN/Jf/7YMQKAA8NsUbMsK9Bzywo6YSJ8HL4crq10nFC95RrwoPY7tc3lGymRIHD9ZEf4oQSL+VvSu4nMslySCQaS5FehAU1ZEnGkPI5XaYGZ7kahBVJL9W7LZTC2tqYt73o/r46u3U3+j+lMdf3qbq3R/+ORxLuo2RNvr3ALRAIAAAAIfJgs7aIOJTxcCA77/uxdi7uOmx6ctqmjy8nA9COWtk6s6DFHhWYsfJFxWehe5OWWVhCdVcPDT+Oyu1gwy6vqDEd3e8fsdMEXTZZRtlNoo/v0Tu2yC/J0L78rbovj/3RJslmz8V207KN8ptpyFUAEiFAIgF3sGfFp60U1X+dR227u/PwxP/7YsQLgAy4rUlsGE9B9SXpdYesIIXgfalrDkNBJYCJmFSTrPyxqGxO5dGo1liBls5oyvPVHj9QNHm7W0CjS4bCKm8jLn0lU72rHHJDzNB+zyUu+2hMUrP0e3DFOn1yOLT9KbQVAGkiSmo2EITyxJi+jCrUwRvZZCJMWGyJPaQbiA1FsyTWUsWkLR3W36u3bxKtKiETXa8nHsebSezjkHR2Oe4dFx0215Poq6IihLtpi1WpqVupdMZAnG8XFzEujizTlyh3uvdLruXzx/r1bnTslF6Su+JFKtUiceV/sp/tlBGEgYekQFZX+fFr0fba2wAos7vw78Vtzt6/O5mUmSKyS4PjTB//+2DEEoAQVe1ArCyxwhG/KBmFlniE9DU0tKEsptEFkV5Xatra3Xe/fBFIaeLjjuZdLnOhzRrtt1fdlazDlaJgiuqrSalLvcYL3mVrWsteNes3qviVKBn3um1itqGVr0pNd+gu+nt87UUn+61oIPUGkpyAEAU4EwxJoMJaBEWgUre7XMTOi2n+yiWo9nQ8ob129tbMxWOM9paunp76e+l2ikT15tSXPcfc+Fr5bZFXniY4uLatJadOyiYAahTMLc+GdbO9tQMWbGx3H5Ogba17zUqi6jmv379a0e9Lq6q6u5lugruqtSjJlMyqP22Sl+20d7f8/QfpBdQbaDcc1YQOcRBhLRX/+2DEBwAOFYFJp6xTwZ0b5/GGCPiElOwXWxPCPi9O5XdX872O2+Wb1NmJCUczuloaz2vVcofxSEHaLHXumJZu41MQzjaUpz7uXQrZ8uNslCgR9zDxwqdC0U6nVa+SCbNvUPU2123yKKtW1uv9v/9PdP+/XoP/LVgxAJsDSa+YmLFbDFXwgp5o88CwDkZWeXK0BOdL4PrNXfnTEmqcz122MZHomYMBHbLKytt7hQFLob76llhgFlVsydJnShgJ6Fyra0NIlnkWNBZLiTnIsfngaruO+IpYdyoKyv9sRf8qAgABiuCgBzkvSYDYrh6ExgIyUslZWATAo5ZEpI1RIvTYJOicsiX/+2DEEwPK1E8crDDDCAAANIAAAASiclhTEglFMMKokqKUk2inmKsJYsprbO5jmMtWuUS7v/81Kaw3/3f//Z35bv////3VTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=`,xd=new URL(`gold-BbTw38YW.mp3`,import.meta.url).href,Sd=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAIAAAJLwA4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVxcXFxcXFxcXFxcXFxjo6Ojo6Ojo6Ojo6OqqqqqqqqqqqqqqqqqsfHx8fHx8fHx8fHx+Pj4+Pj4+Pj4+Pj4+P///////////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJAK+AAAAAAAACS8Du0D7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAACag5EFW0gAJSn2q3M4ACAWXzb18z0LMQRDaIA4qIN+ajUjoyIOCABa9+67bW2HrvYnPiMNtqIBQKCRjlwfB96gQBCDkHz9P+GP8H35R3/4f6PB+XD/BB3b+J//oABQbX91Vi1VrtlsEgAAgjBBmAHKJ3D4Jfi0FF3IGw6aA4PcFAY1woQgJoIiuyZbCs654o0QNGvaAFPzuT8dj8vZpAs3Rwme5ah+OUjqV2XTFV/cKL8aPXz+H3s5ialc3XllyTY50eX5Yf//csT++zuqlFLc+y7X9/XP3387W7GNS3qv2zvlrXbx35wE0kBpoDPDQCJgAAG8CAW03LTjFcc16o//tixAcADIifR722gAHzreex3Cj4HgYJBgiYkWgq2S+ZajahRDsBIchCAiQDLQW4DKCFJqygLBJJZefTLrTpi9bn84b9Hni49VqzZHQS1Jn9Z7bDtUS9R7hqunZxL71Yauqp6y3W5VDJ2iRAIIQgQALWyAwTQw3PgJCtbqAox+IoSVpSL1JkGoMFZlVR0q0PlwQqdWtkokovrsyodO899Gb/9CEjiyKWkYFnHr1FYUduJRbQtoKnKG6DTio/bjR9uhK+zZRdDWzHyhH25hP25pfmchfObn8o3fUg/yR5RqnQzZEL1Vf/9FUAQMAAAheBgSlB81KpQNiwY6FBhuuxjSFSyWxv0P/7YMQOgg8hMTcu5OfB+SlnGdwo+D82TQ6SpDOzlZ1U5Idt1EOwjCp/vQdCc8HeXt3kdAibUGglMA8LoyEi84TmpMR7iws9XfGjOp7/0OzD8oU/od3Xd9E7von847+76+XNi9RGMhCj/1dXp6X9/Z+YoAK0s1MKxgOH2QJgqUi/5jCnBjYACY7viI5xI/9QqiP81w/1MqR48bsEJ1242O9+1G3U/7oJF8TRSzCSF1xW1EgT9F4ii2VINRLbJB3Qa8VjdH0H7ZvQWeU5Uzk77F8oPedypJ15pfVOU5hfvyI7w9ytVbJqmV63dNVW/iHl1QAAIIAAAkL5MAxvPkkrGhRUZFgFMP/7YMQKgI08rzeO5OmB/SHmUdy06GA6EmwSDYeCDAeYHAtgLvEorF5xrDcEg5jb7qXW/zcu3/XcaDSfgECUCcElUsNWqYbi8PehlIkDGq1Ubvu+icgZD0vsshGAYnpfZzHS9ec65Q4nP9QABEBAAgBmEqJnjJgGDIAPKSgEYlqyZxASpy8INsNQdWCDUJ5y+R631Mpt8tovk0vESeJgOtgKYa1TgRVsgDrTGgUuO2thNTDUnVLSjnClqH58moaijz57WvWVPrfkr3fOH9ZxtF+a9fOPyr56HpKWlvDPK1b5m2V9/bVTu4r0KggAAykFlRdT54DgMKKlQjBsxTWkkB9AQ2ha8P/7YMQNgA8M0TLO5WfBsiZnKd2cePbk9AVCTZjcXWpQ0Le0pQwef1cZxWz4z9cdvUkAkqYG8c+IQJlcJ30QA0VcVXBIMvUOVqIV6hz4U96C3si+UK9ndJqINNLkV5+Tl5d/P8vKOWfghynUc5Cr2f///SAYFIJIIEawJAY5wKQaP1ESgJq0iDr8t4l4VAdANjgn+UBDZ+UjtMX/abqGHZQBxGgkg+xMJZbGge8eFPHnuTEnR+VGOvHW1N5vHS2jcat+pvXq3N69Tf6t/N6Hci8Owclm3zXFfO0UVu///9UAAkQeMSGbPWmoL05DIWGOgGE05pQKOIMkxIPZbGBST5SFvOEse//7YsQTA5B9SyxO5OuB5RxlQdytOH7+GGPc+hbPJu3HCSYx7BTk3/98Xz5gB4KLNChjnA8B3obsJQdlSWVFJfERdBziW3P0LPpyo9z+YfyHchlRl9nxQRXP43M0M5j6l9X447n+Uqct8P8p1n+QrrznJ9Sq5hsFJ/C3ZgYBiT4FCQyDZYztCpgMFrRMhWGsRgE1vULbXXKUljcVkAI0/jKVywLq6+K1cL71Lmtf2mhX8FoBq2xFbwShNfCVxh5IX0TvySj3mx74R+TU78u9QlX/Xqmte39Q9EUq5Z2eh3lXc9xLT53ket3////1KgAMAE4EhAaBh3LhGGQ2qgFgWDbMYBBCmbj/+2DEDIIPBQ0pDmVHwa0Z5LHGClhsUDbk429eITYULwwcF896SeL287caTR966DF+7jwE7YXInZCEXGegeitoR6hfijQn4rNml9CDi/25O2zZUfc1tSTQj5zcu+nKnrIeiSWddZZRKP52iyr3ch1baaevySFACGRXKBEIPf0sxEDg4BjwIMJkIDNRGtraZBgUDQDXIAMBQVEs42/5a6FevJFK3LR8qnBCA1spl29J8qrqRY72+9NT0ZtNAEbQ2CARqGfQK13XRWqFX8KdvgrI7vo6HazvX+ziLqf////9dQCIwARKCULUGjsBv8gaKGlpF9EBeaAIqxWXXRRNSOhwLEifVQv/+2DEEoAKtIMhTbzqwUuKn4msJKDr9fITNiMSwhFuUErU1MRibZz7kdH46RlYhlXKcs7xZ/PdP1P6/d208t7+t107bbEoANeaFsYCmbBUdUQb5yYNkYdm4A9NfztMpgqSwQ866WZBgClVEYZBYnJZofFZtmtlFJ7MiQUArKAkalhd3WAsUf606gKR+tOP9nFvOjK0//+ssRVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=`,Cd=`data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//tgwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAGHwBVVVVVVVVVVVVVVVVVVVVVVVVVgICAgICAgICAgICAgICAgICAgICqqqqqqqqqqqqqqqqqqqqqqqqqqtXV1dXV1dXV1dXV1dXV1dXV1dXV//////////////////////////8AAAAATGF2YzYwLjMxAAAAAAAAAAAAAAAAJAMbAAAAAAAABh86W048AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tgxAAAC3EDZpQRgAIepPI3HsACcRAAIDkCbgGMYxjGPX4iIn/Xdz3d/////R3//0T/0R3d3dz3c+IiI7u7u/13d3/REL/dERETrgAAgY/LvWD8Tg/EBnwQiAEHROfnPrB8Pu1AmD75cEHA+D//4Y12ltlku1ttsskktcjYOoRfnrpSi3HhOvNKKZxJIQ5pkWVwbIIpoYB7Gyyc3QSVgPPLWQddeYHqOL0G5uUkNxmBpBW6gXVM/RH0wvQILU7+fkoSpHSkoV3ktfmFD6n1li8X3rFjKVy/ZjNoyn+TWXp9K73blvrar3zO9X89o3a1jQsF1H4SmMsqjTORUGFKAJ8dMw3i//tixAYADv07X9z2gAHNpan5hRbg7wQWApSqBzHQxEDFxQ00XpuhuBMB6kgWAoiKaoqJoYSVNVmpgAzRymx9IyL7aZUf6Ruao5iSiXUl5wpJPu1aJiRl6jI+roJdI3JVJKktHpH62RMX60a1ozJK/9Fvb1HWdSJiedK8k6IoiNYo9gjgoIBiAZajFtpCP9RG5pkum3KyTuanWlVt/AcldUDwYpsOiuUer9WBHv5vGsgmo9lpwUy0LhkJ1kPCS3MEW2hEW6CUJ3chNpKClu4tPxkX8LkUZbiT6MeUscBtZjaIUtvzX/6CRtoSHsO43PFp7Zrs+yonAaBQQABACkwhOUMsqmRkkv/7YMQIgI81QT/sxRNJdBon9YeqSmBvp4MOskhaeFutVIRiuVZgcFmykdQnL/HUH5E9yZA1y0gV2KZQ2PiRD0+oZwktaxnH1JER8Z4kvQfUsin8CUym1CYRv4AcJ3q1Nv4XWLgQh9c0SK1ayLNP//DSv//qgtcRdFOKwV/QUmHRBC23JCdZyjNCalW/jD3R6ncLLaYzvCGwcoWyjg+beDMHMtauwiXGpP/CCRT5JHIQUtlwrE3QRSeMW6v5E/nfKkz4kgpZ8ZHPmk5Kj0Hzyp7Pa3I/1+dqf///RQASxWndaIpbGBOQY7O7IrTBTBnkoAIVLVpARpO6AE+w4q4zLTE/iiIr6f/7YMQVApAwxxpN6i9BuJSjZay14G4x8KJWC1KtZLU7EtVseafGWfMNrbqQeIyTrW8cpkgGrNy9RJgPhXasdIg7sGpJJtOkehscEdFVKpEcL8yQ8irV/6aver8XxqqpX/6fRQ+oq6oikfaoiNSI7Xy7cp3QMu8VJP2bEDAl4rXL4hD6Gh6GY8czuYg0Q8FDsXlsuhovAnHRZVWxHOw81eMZxxi1/mrYJZj+mF5KbVkiCmnn0EkePzPrRX49Xqf6gKprhGq9fXtT+2XoTtp//XsZUk1S7GsMvZC0yhCBAOIpZkq/YAxQdLna9wYJiP2xfAmgIyFJ6DFFePlFPWd+b0ed5dThIf/7YMQVABCExyLnpNYJHQniyDCNCJo5QhaDwrScTpblxICp/sJbmx52HpAmVKrKlaB5RyB5yKZhqSBhdIHlSnEFJUjII6ViyQ/dO6fP3zbNm5Gp0d0dklero6dkdVaurSsR019ts2DLf/f+3///bYMtfSZY4woKDAw2stJqgoBDAw4woKg4kMFBjMEgKFQ8FTLYsaCoCFTIsgKGlxhF2x/tf7bdIunHkn7RjX7HewYxNAoikJERlUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==`,wd=new URL(`powerSweep-B8pF7aDP.mp3`,import.meta.url).href,Td=new URL(`thunder-RKaDQ1xg.mp3`,import.meta.url).href,Ed=new URL(`tier-mde4KKH8.mp3`,import.meta.url).href,Dd=new URL(`win-BSMJ21Ae.mp3`,import.meta.url).href,Od={charge:[.5,0,180,.05,.1,.2,2,1,6,0,0,0,0,.3,0,0,0,.6,.05,0,1200],hum:[.3,0,110,.02,.08,.06,2,1,0,0,0,0,0,0,3,0,0,.8,0,.1,900],ding:[.7,0,1568,0,.04,.4,0,2,0,0,784,.03,0,0,0,0,.05,.5,.06],buzz:[.5,0,140,0,.12,.08,2,1,0,0,0,0,.04,.2,0,.3,0,.7,0,.3],thunder:[1,.1,60,.005,.12,.7,4,1,-.4,0,0,0,0,.9,0,.2,0,.7,.1,0,800],crackle:[.5,.05,660,0,.015,.06,2,1.6,-8,0,0,0,0,.35,0,.1,0,.5,.01],fork:[.6,.05,880,0,.02,.06,2,1.4,-6,0,0,0,.05,.3,0,.1,0,.5],gold:[.7,0,1318,0,.02,.5,0,2.2,0,0,659,.05,0,0,0,0,.06,.4,.1],district:[.8,0,523,.01,.25,.5,1,1.2,0,0,132,.08,.16,0,0,0,.05,.7,.05],fizzle:[.6,.3,300,0,.15,.2,4,1,-4,0,0,0,.03,.8,0,.5,0,.5,0,.5,1500],powerSweep:[.65,0,220,.04,.45,.35,2,1,9,0,0,0,0,.05,0,0,0,.7,.06,0,2400],fanfare:[.9,0,523,.03,.4,.6,1,1,0,0,262,.15,.2,0,0,0,.06,.8,.08],coinTick:[.35,0,1760,0,.005,.05,1,2,0,0,0,0,0,0,0,0,0,.5,.01],click:[.4,0,740,0,.012,.035,1,1.8,0,0,-220,.012,0,0,0,0,0,.45]},kd=e=>new URL(Object.assign({"../assets/sfx/buzz.mp3":cd,"../assets/sfx/charge.mp3":ld,"../assets/sfx/click.mp3":ud,"../assets/sfx/coin.mp3":dd,"../assets/sfx/coinTick.mp3":fd,"../assets/sfx/crackle.mp3":pd,"../assets/sfx/ding.mp3":md,"../assets/sfx/district.mp3":hd,"../assets/sfx/fail.mp3":gd,"../assets/sfx/fanfare.mp3":_d,"../assets/sfx/fizzle.mp3":vd,"../assets/sfx/fork.mp3":yd,"../assets/sfx/gateBad.mp3":bd,"../assets/sfx/gold.mp3":xd,"../assets/sfx/hum.mp3":Sd,"../assets/sfx/pop.mp3":Cd,"../assets/sfx/powerSweep.mp3":wd,"../assets/sfx/thunder.mp3":Td,"../assets/sfx/tier.mp3":Ed,"../assets/sfx/win.mp3":Dd})[`../assets/sfx/${e}.mp3`],import.meta.url).href,Ad={thunder:1,fanfare:.85,win:.75,fail:.65,charge:.5,hum:.35,ding:.7,buzz:.45,fizzle:.55,crackle:.4,fork:.45,gold:.65,district:.6,powerSweep:.55,coin:.6,coinTick:.4,click:.5,pop:.45,tier:.6,gateBad:.45},jd={crackle:.5,fork:.5,hum:.6},Md=Object.fromEntries(Object.entries(Ad).map(([e,t])=>[e,{url:kd(e),gain:t,pitchExp:jd[e]??1}])),Nd=`http://www.w3.org/2000/svg`,Pd=`#0b1446`,Fd=`#050a2e`,Id=[[[0,`#ffffff`],[.55,`#ffffff`],[1,`#cfe9ff`]],[[0,`#c8fdff`],[.35,`#5ef0ff`],[1,`#1c8dff`]]];function Ld(e,t=`landscape`){let[n,...r]=e.toUpperCase().split(` `),i=[n,r.join(` `)].filter(Boolean),a=document.createElementNS(Nd,`svg`);a.setAttribute(`viewBox`,`0 0 1000 600`),a.setAttribute(`aria-label`,e),a.classList.add(`cover-logo`,t);let o=t===`landscape`?`start`:`middle`,s=o===`start`?40:500,c=[[i[0],250,262],[i[1],530,292]];return a.innerHTML=`
    <defs>
      ${Id.map((e,t)=>`<linearGradient id="cl-face${t}" x1="0" y1="0" x2="0" y2="1">${e.map(([e,t])=>`<stop offset="${e}" stop-color="${t}"/>`).join(``)}</linearGradient>`).join(``)}
      <linearGradient id="cl-shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
      ${c.map(([,e,t],n)=>`<clipPath id="cl-upper${n}"><rect x="-100" y="${e-t*.72}" width="1200" height="${t*.3}"/></clipPath>`).join(``)}
    </defs>
    ${c.map(([e,t,n],r)=>{if(!e)return``;let i=r=>`<text x="${s}" y="${t}" font-size="${n}" text-anchor="${o}" ${r}>${e}</text>`,a=``;for(let e=22;e>0;e-=2)a+=i(`transform="translate(${e*.35} ${e})" fill="${Fd}" stroke="${Fd}" stroke-width="26" stroke-linejoin="round"`);return`<g>${a}
      ${i(`fill="${Pd}" stroke="${Pd}" stroke-width="26" stroke-linejoin="round"`)}
      ${i(`fill="url(#cl-face${r})"`)}
      ${i(`fill="url(#cl-shine)" opacity="0.55" clip-path="url(#cl-upper${r})"`)}</g>`}).join(``)}`,a}var Rd={storm:{top:`#030620`,bottom:`#0f0a33`,horizon:`#9c1175`,horizonAt:.72,horizonWidth:.1,glow:`#ff2fb0`,glowAt:[.62,.72],glowSize:.24,glow2:`#2433ff`,glow2At:[.15,.98],glow2Size:.5,vignette:.6,stars:.4,fog:`#3a0c55`,fogNear:40,fogFar:150,hemiSky:`#3346c8`,hemiGround:`#0a0618`,hemi:.45,key:`#9fb2ff`,keyIntensity:1.35,rim:`#ff3fbf`,rimIntensity:.8,env:[`#0a1040`,`#4a0c50`,`#05040f`],envPanels:[`#5fd9ff`,`#ff58c8`,`#c9d4ff`],envPanelIntensity:.3,envIntensity:.4},dusk:{top:`#23398f`,bottom:`#5a4f9e`,horizon:`#ffb48c`,horizonAt:.72,horizonWidth:.13,glow:`#ffd9a8`,glowAt:[.28,.73],glowSize:.2,glow2:`#ff86b8`,glow2At:[.78,.74],glow2Size:.2,vignette:.25,stars:.12,fog:`#9b94c4`,fogNear:110,fogFar:420,hemiSky:`#c0cbf0`,hemiGround:`#626a84`,hemi:1.15,key:`#ffcfa8`,keyIntensity:2.1,rim:`#9fb0ff`,rimIntensity:.5,env:[`#3a50b0`,`#f0a890`,`#3a3050`],envPanels:[`#ffffff`,`#ffd0a0`,`#a0b8ff`],envPanelIntensity:.5,envIntensity:.55},space:{top:`#0a0730`,bottom:`#04020d`,horizon:`#3a1a9e`,horizonAt:.45,horizonWidth:.22,glow:`#7a3cff`,glowAt:[.5,.62],glowSize:.42,glow2:`#0090ff`,glow2At:[.88,.2],glow2Size:.35,vignette:.65,stars:.6,fog:`#120a38`,fogNear:20,fogFar:60,hemiSky:`#8f9dff`,hemiGround:`#1a0f3a`,hemi:.7,key:`#fff1e6`,keyIntensity:1.8,rim:`#45d8ff`,rimIntensity:1.6,env:[`#1a1460`,`#4a24b0`,`#0a0620`],envPanels:[`#ffffff`,`#7fe6ff`,`#ff7ad9`],envPanelIntensity:.6,envIntensity:.8},sunset:{top:`#3a0f6e`,bottom:`#ff7a45`,horizon:`#ff3d6e`,horizonAt:.4,horizonWidth:.22,glow:`#ffd36b`,glowAt:[.5,.35],glowSize:.5,glow2:`#ff2d95`,glow2At:[.1,.6],glow2Size:.5,vignette:.4,stars:0,fog:`#b8356e`,fogNear:30,fogFar:110,hemiSky:`#ffb38a`,hemiGround:`#4a1a6b`,hemi:1.3,key:`#ffe2b8`,keyIntensity:2.6,rim:`#ff4fa0`,rimIntensity:2,env:[`#4a1a8a`,`#ff6a5a`,`#2a0a3a`],envPanels:[`#fff1d6`,`#ffb35a`,`#ff5ab4`],envIntensity:1},candy:{top:`#ff4fb4`,bottom:`#5a2bd6`,horizon:`#ff8ad8`,horizonAt:.55,horizonWidth:.2,glow:`#ffe0f4`,glowAt:[.5,.5],glowSize:.5,glow2:`#40d8ff`,glow2At:[.9,.1],glow2Size:.4,vignette:.35,stars:0,fog:`#b03ab8`,fogNear:30,fogFar:110,hemiSky:`#ffd6f2`,hemiGround:`#4a2a9e`,hemi:1.5,key:`#ffffff`,keyIntensity:2.4,rim:`#6ff0ff`,rimIntensity:1.6,env:[`#ff6ac8`,`#ffc2ea`,`#5a2bd6`],envPanels:[`#ffffff`,`#fff0a8`,`#8ae8ff`],envIntensity:1},ocean:{top:`#00a6e8`,bottom:`#0a1a6e`,horizon:`#38f0ff`,horizonAt:.5,horizonWidth:.2,glow:`#b8fbff`,glowAt:[.5,.6],glowSize:.45,glow2:`#3a5bff`,glow2At:[.1,.1],glow2Size:.5,vignette:.45,stars:0,fog:`#0a4aa0`,fogNear:30,fogFar:110,hemiSky:`#aef4ff`,hemiGround:`#0a1a5e`,hemi:1.4,key:`#ffffff`,keyIntensity:2.3,rim:`#7affd9`,rimIntensity:1.8,env:[`#0090e0`,`#5ef2ff`,`#081a5a`],envPanels:[`#ffffff`,`#b8fff0`,`#7aa6ff`],envIntensity:1}},zd=[`#ff2e63`,`#2f7bff`,`#19e38a`,`#b04dff`,`#ffb31f`,`#22e5ff`,`#ff5cc8`],Bd={fogNear:1.7,fogFar:5.5,hotFlash:`#ffffff`,pole:`#c9cfe4`,tipDark:`#e9edff`,tipLit:`#fff2b8`,gold:`#ffc21a`,goldGlow:`#ffd766`,cloud:`#5d6592`,cloudGlow:`#9fe8ff`,boltCore:`#ffffff`,boltGlow:`#4df3ff`,boltOutline:`#0b1446`,super:`#ffcf3a`,over:`#ff4f5a`,spark:`#dffbff`,plates:{2:`#4df3ff`,3:`#7cff7a`,5:`#ffcc33`,10:`#ff3fa4`}},Vd=[{id:`downtown`,window:`#ffd166`,accent:`#4df3ff`,fog:`#9b94c4`,world:{scenery:`meadow`,park:`#86cf63`,field:`#7cc463`,asphalt:`#6a71a0`,pad:`#e4dde6`,padLit:`#fff1c9`,unlit:`#8690b6`,unlitWin:`#474f73`,trim:`#9aa3c6`,dash:`#f2f4ff`,trees:[`#58c25a`,`#7fd65a`,`#3fae6a`]},lit:[`#ffc21a`,`#ff5e57`,`#ff6fb5`,`#3fd07a`,`#ff8c2a`,`#9d6bff`],sky:{}},{id:`harbour`,window:`#ffc07a`,accent:`#7cf3ff`,fog:`#8fb0d8`,world:{scenery:`sea`,park:`#86cb64`,field:`#3f93d6`,asphalt:`#56607f`,pad:`#ece6dc`,padLit:`#fff0cf`,unlit:`#8b99b0`,unlitWin:`#4a5873`,trim:`#a3b0c6`,dash:`#f4f6ff`,trees:[`#4fbf6a`,`#6fd07a`,`#3aa36a`],water:{land:`#86cb64`,sand:`#f2e3b6`,shallow:`#6bb8ee`,foam:`#eaf7ff`}},lit:[`#ff5e57`,`#ffc21a`,`#ff8c2a`,`#ff6fb5`,`#3fd07a`,`#ffe6a0`],sky:{top:`#1f4aa0`,horizon:`#ffc49a`,glow:`#ffe0b0`,glow2:`#ff9ec0`,fog:`#8fb0d8`,hemiSky:`#bcd6ff`}},{id:`oldtown`,window:`#ffb35c`,accent:`#ff8a5b`,fog:`#b89aa8`,world:{scenery:`farm`,park:`#9cc95a`,field:`#8cbf5a`,asphalt:`#6a6080`,pad:`#efe2d0`,padLit:`#fff0d0`,unlit:`#9a90a8`,unlitWin:`#554b66`,trim:`#b1a7bd`,dash:`#fff6ea`,trees:[`#6fb84a`,`#8fcf5a`,`#4f9f4a`]},lit:[`#ff7a45`,`#ffb81c`,`#ff6f91`,`#3fbf8f`,`#e85a8a`,`#ffd166`],sky:{top:`#3a3a8f`,horizon:`#ffb080`,glow:`#ffd09a`,glow2:`#ff8aa0`,fog:`#b89aa8`,key:`#ffc08a`}},{id:`hills`,window:`#ffe08a`,accent:`#9dff9a`,fog:`#a7b3d6`,world:{scenery:`hills`,park:`#7ac86a`,field:`#6cb85a`,asphalt:`#58668a`,pad:`#e6e6ea`,padLit:`#fff4cc`,unlit:`#8594a8`,unlitWin:`#44516b`,trim:`#9fadc2`,dash:`#f4f6ff`,trees:[`#3fae5a`,`#5fc46a`,`#2f9a5a`]},lit:[`#ffcf3a`,`#ff6fb5`,`#9dff3a`,`#ff8c2a`,`#ff5e57`,`#b58bff`],sky:{top:`#2a4aa8`,horizon:`#ffd09a`,glow:`#fff0c0`,glow2:`#ffa0b0`,fog:`#a7b3d6`}},{id:`neonbay`,window:`#ff9ad5`,accent:`#ff3fa4`,fog:`#6a5aa8`,world:{scenery:`sea`,park:`#3fae8c`,field:`#3552a8`,asphalt:`#474c7e`,pad:`#d3cdef`,padLit:`#ffe3f4`,unlit:`#7a80b0`,unlitWin:`#3c4170`,trim:`#9095c4`,dash:`#e8e4ff`,trees:[`#3fc48a`,`#5fd49a`,`#2fa47a`],water:{land:`#3d9c8c`,sand:`#e6d9f6`,shallow:`#5573c9`,foam:`#c6cdff`}},lit:[`#ff4fb4`,`#9d6bff`,`#ff8c2a`,`#9dff3a`,`#ffcf3a`,`#ff5e57`],sky:{top:`#1a1f6e`,horizon:`#ff8ac8`,glow:`#ffb0e0`,glow2:`#9a7aff`,fog:`#6a5aa8`,hemiSky:`#a8b0ff`,key:`#ffb8d8`}},{id:`snowpeak`,window:`#fff2c4`,accent:`#bfe8ff`,fog:`#c9d6f0`,world:{scenery:`snow`,park:`#e4eef9`,field:`#eef2fb`,asphalt:`#7a86a8`,pad:`#ffffff`,padLit:`#fff4d6`,unlit:`#98a4c2`,unlitWin:`#56617f`,trim:`#b8c2dc`,dash:`#ffffff`,trees:[`#3f9a6a`,`#4fae7a`,`#2f8a5a`]},lit:[`#ff4f5a`,`#ffc21a`,`#ff8c2a`,`#ff6fb5`,`#3fd07a`,`#9d6bff`],sky:{top:`#3a5ab8`,horizon:`#ffd8c0`,glow:`#fff0e0`,glow2:`#ffb8c8`,fog:`#c9d6f0`,hemiSky:`#d6e2ff`,hemiGround:`#8a8aa8`}},{id:`desert`,window:`#ffc46b`,accent:`#ff8a5b`,fog:`#d8a890`,world:{scenery:`desert`,park:`#cdb46c`,field:`#e6c186`,asphalt:`#8a7a8f`,pad:`#f5e6cc`,padLit:`#fff0d0`,unlit:`#a8969a`,unlitWin:`#5f5060`,trim:`#bfaeb0`,dash:`#fff8ea`,trees:[`#8fbf4a`,`#a8cf5a`,`#6f9f3a`]},lit:[`#ff5e57`,`#ff8c2a`,`#ff6fb5`,`#ffc21a`,`#9d6bff`,`#3fd07a`],sky:{top:`#3a4aa0`,horizon:`#ffb070`,glow:`#ffd890`,glow2:`#ff8a70`,fog:`#d8a890`,key:`#ffc890`,hemiGround:`#8a6a5a`}},{id:`skyport`,window:`#9ff8ff`,accent:`#c86bff`,fog:`#b8c4ee`,world:{scenery:`sky`,park:`#9fdcb4`,field:`#8fb0f0`,asphalt:`#5d6aa0`,pad:`#e8ecfb`,padLit:`#fff1f8`,unlit:`#8793c0`,unlitWin:`#434c7a`,trim:`#a4aed6`,dash:`#ffffff`,trees:[`#6fd08a`,`#8fe09a`,`#4fb87a`]},lit:[`#ff6fb5`,`#9d6bff`,`#ffc21a`,`#ff8c2a`,`#ff5e57`,`#3fd07a`],sky:{top:`#2f5ad0`,horizon:`#ffd0e8`,glow:`#fff0fa`,glow2:`#c8a8ff`,fog:`#b8c4ee`,hemiSky:`#d0dcff`}}],Hd=e=>Vd[(e?.theme??0)%Vd.length];function Ud(e){return{...Rd.dusk,...e.sky}}var Wd=class{trauma=0;offset={x:0,y:0,z:0,roll:0};#e=0;constructor({maxOffset:e=.55,maxRoll:t=.03,decay:n=1.6,frequency:r=22}={}){this.maxOffset=e,this.maxRoll=t,this.decay=n,this.frequency=r}add(e){this.trauma=Math.min(1,this.trauma+e)}update(e){this.#e+=e*this.frequency,this.trauma=Math.max(0,this.trauma-this.decay*e);let t=this.trauma*this.trauma,n=e=>Math.sin(this.#e*1+e)*.6+Math.sin(this.#e*2.3+e*1.7)*.4;this.offset.x=this.maxOffset*t*n(1.1),this.offset.y=this.maxOffset*t*n(4.7),this.offset.z=this.maxOffset*.5*t*n(9.3),this.offset.roll=this.maxRoll*t*n(13.1)}},Gd=new kn,Kd=new an;new zn;var qd=new Z,Jd=new Z,Yd=new Q,Xd=`
attribute vec3 iPos;
attribute vec4 iVel;    // xyz velocity (world) for the streak direction, w stretch (s per unit speed)
attribute vec4 iNrm;    // xyz: normal for flat sprites (0 = face the camera), w: shape 0 glow 1 ring 2 spark
attribute vec4 iCol;    // rgb (linear, HDR), a alpha
attribute vec2 iSize;   // x radius (world), y ring thickness (fraction of the radius)
varying vec2 vUv;
varying vec4 vCol;
varying float vShape;
varying float vThick;
#include <common>
#include <fog_pars_vertex>
void main() {
  vUv = position.xy * 2.0;
  vCol = iCol;
  vShape = iNrm.w;
  vThick = iSize.y;
  float s = iSize.x;
  vec4 mvPosition;
  if ( dot( iNrm.xyz, iNrm.xyz ) > 0.01 ) {
    vec3 n = normalize( iNrm.xyz );
    vec3 t = normalize( cross( n, abs( n.y ) < 0.99 ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 ) ) );
    vec3 b = cross( n, t );
    vec3 wp = iPos + ( t * position.x + b * position.y ) * 2.0 * s;
    mvPosition = viewMatrix * vec4( wp, 1.0 );
  } else {
    mvPosition = modelViewMatrix * vec4( iPos, 1.0 );
    vec3 vv = ( modelViewMatrix * vec4( iVel.xyz, 0.0 ) ).xyz;
    float sp = length( vv.xy );
    vec2 ax = sp > 1e-4 ? vv.xy / sp : vec2( 1.0, 0.0 );
    vec2 pp = vec2( - ax.y, ax.x );
    float len = s * ( 1.0 + sp * iVel.w );
    mvPosition.xy += ax * position.x * 2.0 * len + pp * position.y * 2.0 * s;
  }
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Zd=`
varying vec2 vUv;
varying vec4 vCol;
varying float vShape;
varying float vThick;
#include <common>
#include <fog_pars_fragment>
void main() {
  float d = length( vUv );
  if ( d > 1.0 ) discard;
  vec3 c = vCol.rgb;
  float peak = max( c.r, max( c.g, c.b ) );
  float a;
  if ( vShape < 0.5 ) {                 // glow: soft halo + white-hot core
    float g = 1.0 - d;
    a = g * g;
    c += vec3( peak ) * smoothstep( 0.32, 0.0, d ) * 0.9;
  } else if ( vShape < 1.5 ) {          // ring
    float w = max( vThick, 0.02 ) * 0.5;
    float band = 1.0 - smoothstep( 0.0, w, abs( d - ( 1.0 - w ) ) );
    a = band * band + ( 1.0 - smoothstep( 0.0, 1.0, 1.0 - d ) ) * 0.12;
    c += vec3( peak ) * band * band * 0.5;
  } else {                              // spark streak: tight bright core
    float g = 1.0 - d;
    a = g * g * g * 1.6;
    c += vec3( peak ) * smoothstep( 0.45, 0.0, d ) * 0.8;
  }
  gl_FragColor = vec4( c, clamp( a, 0.0, 1.0 ) * vCol.a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  #include <fog_fragment>
}`,Qd=26,$d={glow:0,ring:1,spark:2},ef=Object.freeze({}),tf=class{mesh;#e;#t=0;#n=0;#r=0;#i;#a;#o;#s;#c;#l;#u;#d=0;constructor(e,{max:t=1500,additive:n=!0,fog:r=!1}={}){this.#e=t,this.#i=new Float32Array(t*Qd);let i=new co;i.setAttribute(`position`,new Jr([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),i.setIndex([0,1,2,0,2,3]);let a=e=>new Pi(new Float32Array(t*e),e).setUsage(_t);this.#a=a(3),this.#o=a(4),this.#s=a(4),this.#c=a(4),this.#l=a(2),i.setAttribute(`iPos`,this.#a),i.setAttribute(`iVel`,this.#o),i.setAttribute(`iNrm`,this.#s),i.setAttribute(`iCol`,this.#c),i.setAttribute(`iSize`,this.#l),this.#u=[this.#a,this.#o,this.#s,this.#c,this.#l],i.instanceCount=0;let o=new _a({vertexShader:Xd,fragmentShader:Zd,transparent:!0,depthWrite:!1,blending:n?2:1,fog:r,uniforms:r?{fogColor:{value:new Q},fogNear:{value:1},fogFar:{value:2e3},fogDensity:{value:0}}:{}});this.mesh=new Ai(i,o),this.mesh.name=n?`fx-sprites`:`fx-puffs`,this.mesh.frustumCulled=!1,this.mesh.visible=!1,e.add(this.mesh)}get live(){return this.#t}emit(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b=0){let x=this.#t;x>=this.#e?(x=this.#n,this.#n=(this.#n+1)%this.#e):this.#t++;let S=this.#i,C=x*Qd;return Yd.set(p).multiplyScalar(m),S[C]=t,S[C+1]=n,S[C+2]=r,S[C+3]=i,S[C+4]=a,S[C+5]=o,S[C+6]=s,S[C+7]=c,S[C+8]=l,S[C+9]=l,S[C+10]=u,S[C+11]=d,S[C+12]=f,S[C+13]=Yd.r,S[C+14]=Yd.g,S[C+15]=Yd.b,S[C+16]=h,S[C+17]=e,S[C+18]=g,S[C+19]=_,S[C+20]=v,S[C+21]=y,S[C+22]=b,S[C+23]=Math.random()*6.283,S[C+24]=0,S[C+25]=0,x}spark(e,t,n,r,i,a,o=ef){return this.emit($d.spark,e,t,n,r,i,a,o.gravity??9,o.drag??1.5,o.life??.6,o.size??.08,(o.size??.08)*(o.endScale??.3),o.stretch??.05,o.color??16777215,o.intensity??2,o.alpha??1,0,0,0,0)}glow(e,t,n,r=ef){let i=r.size??1,a=r.normal;return this.emit($d.glow,e,t,n,0,0,0,0,0,r.life??.35,i,i*(r.grow??1.4),0,r.color??16777215,r.intensity??2,r.alpha??1,a?a[0]:0,a?a[1]:0,a?a[2]:0,0,r.pulse??0)}ring(e,t,n,r=ef){let i=r.normal;return this.emit($d.ring,e,t,n,0,0,0,0,0,r.life??.45,r.from??.2,r.to??3,0,r.color??16777215,r.intensity??2.5,r.alpha??1,i?i[0]:0,i?i[1]:0,i?i[2]:0,r.thickness??.18)}sparkBurst(e,t=ef){let n=t.count??24,r=t.speed??8,i=t.up??2,a=t.spread??.2,o=t.colors;for(let s=0;s<n;s++){let n=Math.random()*2-1,c=Math.random()*6.283,l=Math.sqrt(1-n*n),u=r*(.35+Math.random()*.65),d=o?o[s%o.length]:t.color??16777215;this.emit($d.spark,e.x+(Math.random()-.5)*a,e.y+(Math.random()-.5)*a,e.z+(Math.random()-.5)*a,l*Math.cos(c)*u,n*u+i*Math.random(),l*Math.sin(c)*u,t.gravity??9,t.drag??1.6,(t.life??.6)*(.6+Math.random()*.7),(t.size??.07)*(.7+Math.random()*.6),(t.size??.07)*.25,t.stretch??.05,d,t.intensity??2.5,1,0,0,0,0)}}halo(e,t=ef){let n=t.size??1.6;this.glow(e.x,e.y,e.z,{color:t.color??16777215,intensity:t.intensity??2.2,size:n,grow:1.6,life:t.life??.4}),this.glow(e.x,e.y,e.z,{color:16777215,intensity:(t.intensity??2.2)*1.2,size:n*.45,grow:1.2,life:(t.life??.4)*.6})}update(e){this.#r+=e;let t=this.#i,n=this.#t;for(let r=0;r<n;){let i=r*Qd;if(t[i+8]-=e,t[i+8]<=0){n--,r!==n&&t.copyWithin(i,n*Qd,n*Qd+Qd);continue}let a=Math.exp(-t[i+7]*e);t[i+3]*=a,t[i+5]*=a,t[i+4]=t[i+4]*a-t[i+6]*e,t[i]+=t[i+3]*e,t[i+1]+=t[i+4]*e,t[i+2]+=t[i+5]*e,r++}this.#t=n,this.#n>=n&&(this.#n=0),this.#f()}#f(){let e=this.#i,t=this.#t,n=this.#r,r=this.#a.array,i=this.#o.array,a=this.#s.array,o=this.#c.array,s=this.#l.array;for(let c=0;c<t;c++){let t=c*Qd,l=e[t+8],u=e[t+9],d=u===1/0?1:l/u,f=e[t+17],p=1-d,m,h=e[t+16];if(f===1){let n=1-(1-p)*(1-p)*(1-p);m=e[t+10]+(e[t+11]-e[t+10])*n,h*=d}else f===0?(m=e[t+10]+(e[t+11]-e[t+10])*(1-(1-p)*(1-p)),h*=u===1/0?1:d*d):(m=e[t+11]+(e[t+10]-e[t+11])*d,h*=Math.min(1,d*1.6));e[t+22]>0&&(h*=.55+.45*Math.sin(n*e[t+22]*6.283+e[t+23])),r[c*3]=e[t],r[c*3+1]=e[t+1],r[c*3+2]=e[t+2],i[c*4]=e[t+3],i[c*4+1]=e[t+4],i[c*4+2]=e[t+5],i[c*4+3]=e[t+12],a[c*4]=e[t+18],a[c*4+1]=e[t+19],a[c*4+2]=e[t+20],a[c*4+3]=f,o[c*4]=e[t+13],o[c*4+1]=e[t+14],o[c*4+2]=e[t+15],o[c*4+3]=h,s[c*2]=m,s[c*2+1]=e[t+21]}if(t||this.#d)for(let e=0;e<this.#u.length;e++)this.#u[e].needsUpdate=!0;this.#d=t,this.mesh.geometry.instanceCount=t,this.mesh.visible=t>0}clear(){this.#t=0,this.#f()}},nf=18,rf=new Z,af=class{mesh;target=new Z;onArrive=null;#e;#t=0;#n=0;#r;#i;#a;#o;constructor(e,t,n,{max:r=160,castShadow:i=!1,floorY:a=0,bounce:o=.35,gravity:s=16,name:c=`fx-debris`}={}){this.#e=r,this.#r=new Float32Array(r*nf),this.#i=a,this.#a=o,this.#o=s,this.mesh=new Hi(t,n,r),this.mesh.name=c,this.mesh.frustumCulled=!1,this.mesh.castShadow=i,this.mesh.count=0,this.mesh.instanceMatrix.setUsage(_t);for(let e=0;e<r;e++)this.mesh.setColorAt(e,Yd.set(16777215));e.add(this.mesh)}get live(){return this.#t}burst(e,t=ef){let n=t.count??20,r=t.colors,i=t.speed??7,a=t.up??5,o=t.spread??.3,s=t.cone??1,c=t.dir;for(let l=0;l<n;l++){let n=this.#t;n>=this.#e?(n=this.#n,this.#n=(this.#n+1)%this.#e):this.#t++;let u=this.#r,d=n*nf,f=Math.random()*2-1,p=Math.random()*6.283,m=Math.sqrt(1-f*f),h=m*Math.cos(p),g=f,_=m*Math.sin(p);if(c){h=c.x+h*s,g=c.y+g*s,_=c.z+_*s;let e=Math.sqrt(h*h+g*g+_*_)||1;h/=e,g/=e,_/=e}let v=i*(.45+Math.random()*.55);u[d]=e.x+(Math.random()-.5)*o,u[d+1]=e.y+(Math.random()-.5)*o,u[d+2]=e.z+(Math.random()-.5)*o,u[d+3]=h*v,u[d+4]=g*v+a*(.5+Math.random()*.5),u[d+5]=_*v,rf.set(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),u[d+6]=rf.x,u[d+7]=rf.y,u[d+8]=rf.z,u[d+9]=Math.random()*6.283,u[d+10]=(t.spin??12)*(.5+Math.random()),u[d+11]=(t.life??1.4)*(.75+Math.random()*.5),u[d+12]=u[d+11],u[d+13]=(t.size??.3)*(.6+Math.random()*.8),u[d+14]=t.home?(t.homeDelay??.45)+l*.02:-1,u[d+15]=0,u[d+16]=0,u[d+17]=0,this.mesh.setColorAt(n,Yd.set(r?r[l%r.length]:t.color??16777215))}this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}update(e){let t=this.#r,n=this.#o,r=this.#i,i=this.#a,a=this.target,o=this.#t,s=!1;for(let c=0;c<o;){let l=c*nf;t[l+11]-=e,t[l+15]+=e;let u=t[l+11]<=0;if(!u&&t[l+14]>=0&&t[l+15]>t[l+14]){let n=a.x-t[l],r=a.y-t[l+1],i=a.z-t[l+2],o=Math.sqrt(n*n+r*r+i*i);if(o<.35)u=!0,this.onArrive?.(c);else{let a=10+(t[l+15]-t[l+14])*40,s=1-Math.exp(-9*e);t[l+3]+=(n/o*a-t[l+3])*s,t[l+4]+=(r/o*a-t[l+4])*s,t[l+5]+=(i/o*a-t[l+5])*s,t[l+11]=Math.max(t[l+11],.2)}}else u||(t[l+4]-=n*e);if(u){o--,c!==o&&(t.copyWithin(l,o*nf,o*nf+nf),this.mesh.getColorAt(o,Yd),this.mesh.setColorAt(c,Yd),s=!0);continue}t[l]+=t[l+3]*e,t[l+1]+=t[l+4]*e,t[l+2]+=t[l+5]*e;let d=t[l+13]*.5;t[l+14]<0&&t[l+1]<r+d&&t[l+4]<0&&(t[l+1]=r+d,t[l+4]=-t[l+4]*i,t[l+3]*=.7,t[l+5]*=.7,t[l+10]*=.6),t[l+9]+=t[l+10]*e;let f=t[l+11]/t[l+12],p=t[l+13]*Math.min(1,t[l+15]/.06)*(f<.25?f/.25:1);qd.set(t[l],t[l+1],t[l+2]),Kd.setFromAxisAngle(rf.set(t[l+6],t[l+7],t[l+8]),t[l+9]),Jd.set(p,p,p),Gd.compose(qd,Kd,Jd),this.mesh.setMatrixAt(c,Gd),c++}this.#t=o,this.#n>=o&&(this.#n=0),this.mesh.count=o,this.mesh.instanceMatrix.needsUpdate=!0,s&&this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}clear(){this.#t=0,this.mesh.count=0}},of=`
attribute float aSide;
attribute vec2 aInfo;     // x: u along (0 tail/start .. 1 head/end), y: core amount
attribute vec4 aCol;      // rgb linear HDR, a alpha
varying float vSide;
varying float vCore;
varying vec4 vCol;
#include <common>
void main() {
  vSide = aSide;
  vCore = aInfo.y;
  vCol = aCol;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,sf=`
varying float vSide;
varying float vCore;
varying vec4 vCol;
#include <common>
void main() {
  float s = min( abs( vSide ), 1.0 );                        // clamp: interpolation can overshoot 1 -> NaN
  float glow = exp( - s * s * 2.5 ) * sqrt( 1.0 - s );      // wide coloured glow
  float core = smoothstep( 0.14, 0.0, s );                   // white-hot centre line
  vec3 c = vCol.rgb * glow + vec3( vCore ) * core;           // vCore = absolute core brightness (HDR)
  gl_FragColor = vec4( c, clamp( glow + core * step( 0.001, vCore ), 0.0, 1.0 ) * vCol.a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,cf=`
uniform vec3 olColor;
uniform float olAlpha;
varying float vSide;
varying vec4 vCol;
#include <common>
void main() {
  float s = min( abs( vSide ), 1.0 );
  float a = ( 1.0 - smoothstep( 0.72, 1.0, s ) ) * olAlpha * clamp( vCol.a, 0.0, 1.0 );
  gl_FragColor = vec4( olColor, a );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,lf=new Q,uf=new Z,df=new Z,ff=new Z,pf=new Z,mf=Object.freeze({}),hf=16,gf=class{mesh;#e;#t;#n;#r;#i;#a;#o;#s;#c=0;outline=null;constructor(e,{max:t=30,points:n=33,outline:r=null}={}){this.#e=t,this.#t=n,this.#n=new Float32Array(t*hf),this.#r=new Float32Array(t*n*3),this.#s=new Uint8Array(t);let i=t*n*2,a=new oi;this.#i=new Gr(new Float32Array(i*3),3).setUsage(_t),this.#a=new Gr(new Float32Array(i*2),2).setUsage(_t),this.#o=new Gr(new Float32Array(i*4),4).setUsage(_t);let o=new Float32Array(i);for(let e=0;e<i;e++)o[e]=e%2?1:-1;let s=new Uint32Array(t*(n-1)*6),c=0;for(let e=0;e<t;e++)for(let t=0;t<n-1;t++){let r=(e*n+t)*2;s[c++]=r,s[c++]=r+1,s[c++]=r+2,s[c++]=r+1,s[c++]=r+3,s[c++]=r+2}a.setIndex(new Gr(s,1)),a.setAttribute(`position`,this.#i),a.setAttribute(`aSide`,new Gr(o,1)),a.setAttribute(`aInfo`,this.#a),a.setAttribute(`aCol`,this.#o),a.setDrawRange(0,0);let l=new _a({vertexShader:of,fragmentShader:sf,transparent:!0,depthWrite:!1,blending:2});if(this.mesh=new Ai(a,l),this.mesh.name=`fx-ribbons`,this.mesh.frustumCulled=!1,this.mesh.visible=!1,this.mesh.renderOrder=10,e.add(this.mesh),r){let t=new _a({vertexShader:of,fragmentShader:cf,transparent:!0,depthWrite:!1,blending:1,uniforms:{olColor:{value:new Q(r.color??`#0b1446`)},olAlpha:{value:r.alpha??.6}}});this.outline=new Ai(a,t),this.outline.name=`fx-ribbon-outline`,this.outline.frustumCulled=!1,this.outline.visible=!1,this.outline.renderOrder=9,e.add(this.outline)}}get maxPoints(){return this.#t}alloc(e=mf,t=0){let n=this.#n,r=-1;for(let e=0;e<this.#e;e++)if(!n[e*hf]){r=e;break}if(r<0)return-1;let i=r*hf;return lf.set(e.color??`#4df3ff`).multiplyScalar(e.intensity??1.8),n[i]=1,n[i+1]=t,n[i+2]=0,n[i+3]=e.life??1/0,n[i+4]=n[i+3],n[i+5]=e.width??.4,n[i+6]=e.w0??1,n[i+7]=e.w1??1,n[i+8]=lf.r,n[i+9]=lf.g,n[i+10]=lf.b,n[i+11]=e.alpha??1,n[i+12]=e.core??2.5,n[i+13]=e.flicker??0,n[i+14]=0,n[i+15]=0,r+1>this.#c&&(this.#c=r+1),r}setPoints(e,t,n){if(e<0)return;let r=this.#t,i=Math.min(n,r),a=this.#r,o=e*r*3;for(let e=0;e<i*3;e++)a[o+e]=t[e];this.#n[e*hf+2]=i}trail(e=mf){let t=this.alloc({w0:0,w1:1,core:1.5,...e},1);return t>=0&&(this.#n[t*hf+2]=0),t}push(e,t,n,r){if(e<0)return;let i=e*hf,a=this.#t,o=this.#n,s=this.#r,c=o[i+2];if(c<a){let l=(e*a+c)*3;s[l]=t,s[l+1]=n,s[l+2]=r,o[i+2]=c+1;return}let l=e*a*3;s.copyWithin(l,l+3,l+a*3),s[l+(a-1)*3]=t,s[l+(a-1)*3+1]=n,s[l+(a-1)*3+2]=r}release(e,t=.25){if(e<0)return;let n=e*hf;this.#n[n+14]=1,this.#n[n+3]=Math.min(this.#n[n+3],t),this.#n[n+4]=t}kill(e){e>=0&&(this.#n[e*hf]=0,this.#s[e]=1)}isAlive(e){return e>=0&&this.#n[e*hf]===1}update(e,t){uf.setFromMatrixPosition(t.matrixWorld);let n=this.#n,r=this.#r,i=this.#t,a=this.#i.array,o=this.#a.array,s=this.#o.array,c=0;for(let t=0;t<this.#c;t++){let l=t*hf;if(!n[l]){this.#s[t]&&(this.#l(t),this.#s[t]=0);continue}if(n[l+3]-=e,n[l+3]<=0){n[l]=0,this.#l(t);continue}c=t+1;let u=n[l+2],d=n[l+1]===1,f=n[l+4],p=f===1/0?1:n[l+3]/f,m=n[l+11]*(n[l+14]?p:f===1/0?1:Math.sqrt(p));n[l+13]>0&&(m*=1-n[l+13]*Math.random());let h=n[l+5],g=n[l+6],_=n[l+7],v=n[l+8],y=n[l+9],b=n[l+10],x=n[l+12],S=t*i;for(let e=0;e<i;e++){let t=Math.min(e,Math.max(0,u-1)),n=(S+t)*3,i=u>1?t/(u-1):1,c=0;if(u>1&&e<u){let e=(S+Math.max(0,t-1))*3,a=(S+Math.min(u-1,t+1))*3;df.set(r[a]-r[e],r[a+1]-r[e+1],r[a+2]-r[e+2]),ff.set(uf.x-r[n],uf.y-r[n+1],uf.z-r[n+2]),pf.crossVectors(df,ff);let o=pf.length();c=o>1e-6?h*.5*(g+(_-g)*i)/o:0}let l=(S+e)*2,f=r[n],p=r[n+1],C=r[n+2],w=pf.x*c,T=pf.y*c,E=pf.z*c;a[l*3]=f-w,a[l*3+1]=p-T,a[l*3+2]=C-E,a[l*3+3]=f+w,a[l*3+4]=p+T,a[l*3+5]=C+E;let D=d?m*i*i:m;o[l*2]=i,o[l*2+1]=x,o[l*2+2]=i,o[l*2+3]=x,s[l*4]=v,s[l*4+1]=y,s[l*4+2]=b,s[l*4+3]=D,s[l*4+4]=v,s[l*4+5]=y,s[l*4+6]=b,s[l*4+7]=D}}let l=c>0||this.#c>0;this.#c=c,l&&(this.#i.needsUpdate=!0,this.#a.needsUpdate=!0,this.#o.needsUpdate=!0),this.mesh.geometry.setDrawRange(0,c*(i-1)*6),this.mesh.visible=c>0,this.outline&&(this.outline.visible=c>0)}#l(e){let t=this.#t,n=this.#i.array,r=this.#o.array;n.fill(0,e*t*6,(e+1)*t*6),r.fill(0,e*t*8,(e+1)*t*8)}clear(){for(let e=0;e<this.#e;e++)this.#n[e*hf]&&this.kill(e)}},_f=16,vf=6,yf=new Z,bf=new Z,xf=new Z,Sf=new Z,Cf=new Z,wf=new Z(0,1,0),Tf=new Float32Array(195);function Ef(e,t,n,r,i,a,o){let s=(1<<r)+1;xf.subVectors(n,t);let c=xf.length()||1;xf.divideScalar(c),Sf.crossVectors(xf,Math.abs(xf.y)>.95?ff.set(1,0,0):wf).normalize(),Cf.crossVectors(xf,Sf).normalize();let l=(s-1)*3;e[0]=t.x,e[1]=t.y,e[2]=t.z,e[l]=n.x,e[l+1]=n.y,e[l+2]=n.z;let u=s-1,d=i*c;for(;u>1;){let t=u>>1;for(let n=t;n<s;n+=u){let r=(n-t)*3,i=(n+t)*3,a=n*3,s=(o()-.5)*2*d,c=(o()-.5)*2*d;e[a]=(e[r]+e[i])*.5+Sf.x*s+Cf.x*c,e[a+1]=(e[r+1]+e[i+1])*.5+Sf.y*s+Cf.y*c,e[a+2]=(e[r+2]+e[i+2])*.5+Sf.z*s+Cf.z*c}d*=.55,u=t}if(a)for(let t=1;t<s-1;t++){let n=t/(s-1);e[t*3+1]+=a*4*n*(1-n)}return s}var Df=class{#e;#t;#n=Array.from({length:_f},()=>({alive:!1,a:new Z,b:new Z,depth:5,jag:.12,arc:0,flicker:.06,t:0,progress:1,main:-1,forks:new Int16Array(vf).fill(-1),forkN:0,forkAt:new Float32Array(vf),forkDir:new Float32Array(18),forkLen:new Float32Array(vf),forkProgress:1}));constructor(e,{rand:t=Math.random}={}){this.#e=e,this.#t=t}strike(e,t,n=mf){let r=this.#n.findIndex(e=>!e.alive);if(r<0)return-1;let i=this.#n[r],a=this.#e,o=n.life??.35;if(i.main=a.alloc({color:n.color??`#4df3ff`,intensity:n.intensity??1.8,width:n.width??.45,w0:.85,w1:1,core:n.core??3,life:o,flicker:.25}),i.main<0)return-1;i.alive=!0,i.a.copy(e),i.b.copy(t),i.depth=Math.min(6,n.depth??5),i.jag=n.jag??.12,i.arc=n.arc??0,i.flicker=n.flicker??.06,i.t=0,i.progress=n.progress??1,i.forkProgress=n.forkProgress??1,i.forkN=Math.min(vf,n.forks??2);let s=this.#t;for(let e=0;e<i.forkN;e++)i.forks[e]=a.alloc({color:n.forkColor??n.color??`#4df3ff`,intensity:(n.intensity??1.8)*.85,width:(n.width??.45)*.6,w0:1,w1:.15,core:(n.core??3)*.8,life:o,flicker:.35}),i.forkAt[e]=.2+s()*.6,xf.set(s()-.5,(s()-.5)*.8-.25,s()-.5).normalize(),i.forkDir.set([xf.x,xf.y,xf.z],e*3),i.forkLen[e]=(n.forkLength??.4)*(.6+s()*.7);return this.#r(i),r}kill(e){let t=this.#n[e];if(t?.alive){t.alive=!1,this.#e.kill(t.main);for(let e=0;e<t.forkN;e++)this.#e.kill(t.forks[e])}}#r(e){let t=this.#e,n=this.#t,r=Ef(Tf,e.a,e.b,e.depth,e.jag,e.arc,n),i=Math.max(2,Math.min(r,Math.ceil(e.progress*(r-1))+1));t.setPoints(e.main,Tf,i);let a=e.a.distanceTo(e.b);for(let o=0;o<e.forkN;o++){let s=Math.min(i-1,Math.round(e.forkAt[o]*(r-1)));yf.set(Tf[s*3],Tf[s*3+1],Tf[s*3+2]),xf.subVectors(e.b,e.a).normalize(),bf.set(e.forkDir[o*3],e.forkDir[o*3+1],e.forkDir[o*3+2]).addScaledVector(xf,.8).normalize(),bf.multiplyScalar(e.forkLen[o]*a*e.forkProgress).add(yf);let c=Ef(Of,yf,bf,Math.max(2,e.depth-2),e.jag*1.2,0,n);t.setPoints(e.forks[o],Of,c)}}update(e){for(let t=0;t<_f;t++){let n=this.#n[t];if(n.alive){if(!this.#e.isAlive(n.main)){this.kill(t);continue}n.flicker<=0||(n.t+=e,n.t>=n.flicker&&(n.t=0,this.#r(n)))}}}clear(){for(let e=0;e<_f;e++)this.kill(e)}},Of=new Float32Array(195),kf=(e,t)=>new Q(e).multiplyScalar(t),Af=`
#include <emissivemap_fragment>
{
  vec3 gsView = normalize( vViewPosition );
  float gsFres = pow( 1.0 - clamp( abs( dot( normal, gsView ) ), 0.0, 1.0 ), gsRimPower );
  vec3 gsTint = mix( gsRimColor, diffuseColor.rgb, gsRimTint );
  totalEmissiveRadiance += gsTint * gsFres * gsRim + diffuseColor.rgb * gsInner * ( 1.0 - 0.7 * gsFres );
}
`;function jf(e,{rim:t=.5,rimPower:n=3,rimColor:r=`#ffffff`,rimTint:i=.5,inner:a=0}={}){let o={gsRim:{value:t},gsRimPower:{value:n},gsRimColor:{value:new Q(r)},gsRimTint:{value:i},gsInner:{value:a}};e.userData.gs=o;let s=e.onBeforeCompile;e.onBeforeCompile=(t,n)=>{s?.call(e,t,n),Object.assign(t.uniforms,o),t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>
uniform float gsRim;
uniform float gsRimPower;
uniform vec3 gsRimColor;
uniform float gsRimTint;
uniform float gsInner;`).replace(`#include <emissivemap_fragment>`,Af)};let c=e.customProgramCacheKey.bind(e);return e.customProgramCacheKey=()=>`gs-rim|${c()}`,e}var Mf=`
uniform vec2 fcCell;        // window cell size in world units (width, storey height)
uniform vec2 fcMargin;      // empty border inside a cell (fraction)
uniform vec3 fcLit;         // lit window colour (linear, HDR via fcLitIntensity)
uniform float fcLitIntensity;
uniform vec3 fcGlass;       // unlit window glass
uniform float fcDim;        // fraction of windows faintly lit in a dark building
uniform float fcSpill;      // warm glow on the walls of a lit building
varying vec3 vFcLocal;
varying vec3 vFcNormal;
varying vec3 vFcScale;
varying float vFcLit;
varying float vFcSeed;
float fcHash( vec2 p ) { p = fract( p * vec2( 123.34, 456.21 ) ); p += dot( p, p + 45.32 ); return fract( p.x * p.y ); }
// x: window mask 0..1, y: lit 0..1, z: per-window brightness variation
vec3 fcWindows() {
  if ( abs( vFcNormal.y ) > 0.5 ) return vec3( 0.0 );
  float u = abs( vFcNormal.x ) > 0.5 ? vFcLocal.z : vFcLocal.x;
  float faceW = abs( vFcNormal.x ) > 0.5 ? vFcScale.z : vFcScale.x;
  // centre the column grid on the face so windows never get cut at a corner
  float cols = max( 1.0, floor( faceW / fcCell.x ) );
  float cw = faceW / cols;
  vec2 g = vec2( ( u + faceW * 0.5 ) / cw, vFcLocal.y / fcCell.y );
  vec2 cell = floor( g );
  vec2 f = fract( g );
  vec2 aa = max( fwidth( g ) * 1.1, vec2( 0.001 ) );
  vec2 lo = smoothstep( fcMargin - aa, fcMargin + aa, f );
  vec2 hi = 1.0 - smoothstep( 1.0 - fcMargin - aa, 1.0 - fcMargin + aa, f );
  float storeys = floor( vFcScale.y / fcCell.y );
#ifdef FC_STREAK
  float m = lo.x * hi.x * step( cell.y, storeys - 1.5 );           // reflections: vertical light streaks
#else
  float m = lo.x * lo.y * hi.x * hi.y;
  m *= step( 0.5, cell.y ) * step( cell.y, storeys - 1.5 );       // no ground floor, no parapet storey
#endif
  vec2 key = cell + vec2( vFcSeed * 97.0 + vFcNormal.x * 13.0, vFcNormal.z * 7.0 );
  float h = fcHash( key );
  float lit = step( h, vFcLit * 1.0001 );
  float dim = step( fcHash( key + 3.7 ), fcDim ) * 0.22 * ( 1.0 - lit );
  return vec3( m, max( lit, dim ), 0.7 + 0.6 * fcHash( key + 9.1 ) );
}
`,Nf=`
attribute float aLit;
attribute float aSeed;
varying vec3 vFcLocal;
varying vec3 vFcNormal;
varying vec3 vFcScale;
varying float vFcLit;
varying float vFcSeed;
`,Pf=`
#include <begin_vertex>
#ifdef USE_INSTANCING
  vFcScale = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
#else
  vFcScale = vec3( 1.0 );
#endif
vFcLocal = position * vFcScale;
vFcNormal = normal;
vFcLit = aLit;
vFcSeed = aSeed;
`;function Ff({litColor:e,litIntensity:t,glass:n,cell:r,margin:i,dim:a,spill:o}){return{fcCell:{value:new X(r[0],r[1])},fcMargin:{value:new X(i[0],i[1])},fcLit:{value:new Q(e)},fcLitIntensity:{value:t},fcGlass:{value:new Q(n)},fcDim:{value:a},fcSpill:{value:o}}}function If({litColor:e=`#ffd166`,litIntensity:t=1.8,glass:n=`#0b1030`,cell:r=[.5,.62],margin:i=[.2,.22],dim:a=.05,spill:o=.06,rim:s=.18,roughness:c=.78,metalness:l=.1,envMapIntensity:u=.35}={}){let d=new ya({color:16777215,roughness:c,metalness:l,envMapIntensity:u}),f=Ff({litColor:e,litIntensity:t,glass:n,cell:r,margin:i,dim:a,spill:o});return d.userData.facade=f,d.onBeforeCompile=e=>{Object.assign(e.uniforms,f),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Nf}`).replace(`#include <begin_vertex>`,Pf),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${Mf}`).replace(`#include <color_fragment>`,`#include <color_fragment>
        vec3 fcW = fcWindows();
        float fcRoof = step( 0.5, vFcNormal.y );
        diffuseColor.rgb = mix( diffuseColor.rgb, diffuseColor.rgb * 1.35 + 0.02, fcRoof );
        diffuseColor.rgb = mix( diffuseColor.rgb, fcGlass, fcW.x );`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = mix( roughnessFactor, 0.18, fcW.x );`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        totalEmissiveRadiance += fcLit * fcLitIntensity * fcW.x * fcW.y * fcW.z;
        totalEmissiveRadiance += fcLit * fcSpill * vFcLit * ( 1.0 - fcW.x ) * ( 1.0 - fcRoof );`)},d.customProgramCacheKey=()=>`gs-facade`,s>0&&jf(d,{rim:s,rimPower:3.5,rimColor:`#ff4fc4`,rimTint:.1}),d}function Lf(e,{strength:t=.55,depthFade:n=.35,body:r=`#04040c`}={}){return e.userData.facade,new _a({uniforms:ma.merge([$.fog,{rfStrength:{value:t},rfFade:{value:n},rfBody:{value:new Q(r)}}]),vertexShader:`
      ${Nf}
      varying float vRfY;
      #include <common>
      #include <fog_pars_vertex>
      void main() {
        #include <begin_vertex>
        #ifdef USE_INSTANCING
          vFcScale = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
          vec4 wp = modelMatrix * instanceMatrix * vec4( transformed, 1.0 );
        #else
          vFcScale = vec3( 1.0 );
          vec4 wp = modelMatrix * vec4( transformed, 1.0 );
        #endif
        vFcLocal = position * vFcScale;
        vFcNormal = normal;
        vFcLit = aLit;
        vFcSeed = aSeed;
        vRfY = wp.y;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Mf}
      uniform float rfStrength;
      uniform float rfFade;
      uniform vec3 rfBody;
      varying float vRfY;
      #include <common>
      #include <fog_pars_fragment>
      void main() {
        vec3 w = fcWindows();
        float fade = exp( vRfY * rfFade );
        vec3 c = rfBody + fcLit * fcLitIntensity * w.x * w.y * w.z * rfStrength * fade;
        c += fcLit * fcSpill * vFcLit * rfStrength * fade * 0.6;
        gl_FragColor = vec4( c, 1.0 );
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,fog:!0,defines:{FC_STREAK:``}})}function Rf(e,t){return Object.assign(e.uniforms,t.userData.facade),e}var zf={candy(e=`#ff2d95`,{roughness:t=.28,rim:n=.35,inner:r=.05,flatShading:i=!1}={}){return jf(new ba({color:e,roughness:t,metalness:0,clearcoat:1,clearcoatRoughness:.08,flatShading:i}),{rim:n,rimPower:3,rimColor:`#ffffff`,rimTint:.3,inner:r})},crystal(e=16777215,{inner:t=.45,rim:n=1.1,roughness:r=.12,iridescence:i=.35}={}){return jf(new ba({color:e,roughness:r,metalness:.05,flatShading:!0,clearcoat:1,clearcoatRoughness:.04,iridescence:i,iridescenceIOR:1.6}),{rim:n,rimPower:2.4,rimColor:`#ffffff`,rimTint:.7,inner:t})},glass(e=`#bff6ff`,{opacity:t=.42,rim:n=1.4,inner:r=.12}={}){return jf(new ba({color:e,roughness:.04,metalness:0,flatShading:!0,transparent:!0,opacity:t,depthWrite:!0,clearcoat:1,clearcoatRoughness:.02,specularIntensity:1,ior:1.8}),{rim:n,rimPower:2.2,rimColor:`#ffffff`,rimTint:.6,inner:r})},core(e=`#4df3ff`,t=4){return new vi({color:kf(e,t)})},metal(e=`#c9d3ff`,{roughness:t=.22,rim:n=.25}={}){return jf(new ya({color:e,metalness:1,roughness:t}),{rim:n,rimPower:3,rimColor:`#ffffff`,rimTint:.8})},gold({roughness:e=.24,rim:t=.4}={}){return jf(new ya({color:`#ffd84a`,metalness:.6,roughness:e,emissive:`#ff9a00`,emissiveIntensity:.32}),{rim:t,rimPower:2.5,rimColor:`#fff2b0`,rimTint:.2})},neon(e=`#ff2d95`,t=3,{additive:n=!1,doubleSided:r=!1}={}){let i=new vi({color:kf(e,t),transparent:n,depthWrite:!n});return n&&(i.blending=2),r&&(i.side=2),i},facade:If,facadeReflection(e,t){return Rf(Lf(e,t),e)},wetStreet({color:e=`#0b0d22`,roughness:t=.3,metalness:n=.25,opacity:r=.8,envMapIntensity:i=.6}={}){return new ya({color:e,roughness:t,metalness:n,transparent:r<1,opacity:r,depthWrite:!0,envMapIntensity:i})}};function Bf(){return new $i(0,.5,1.5,3,1).scale(1,1,.32)}function Vf(){return new $i(.5,.5,.12,14,1).rotateX(Math.PI/2)}function Hf(){return new ia(.5,0).scale(1,1.3,1)}var Uf=Object.freeze({}),Wf=Object.freeze([0,1,0]),Gf=12,Kf=class{constructor(e,{sprites:t=1500,shards:n=160,coins:r=48,gems:i=48,ribbons:a=30,unit:o=1,outline:s=null,castShadow:c=!1,floorY:l=0,rand:u=Math.random}={}){this.unit=o;let d=16*o;this.sprites=new tf(e,{max:t}),this.shards=new af(e,Bf(),zf.crystal(16777215,{inner:.5,rim:1.2}),{max:n,castShadow:c,floorY:l,gravity:d,name:`fx-shards`}),this.coins=new af(e,Vf(),zf.gold(),{max:r,castShadow:c,floorY:l,bounce:.45,gravity:d,name:`fx-coins`}),this.gems=new af(e,Hf(),zf.crystal(16777215,{inner:.6}),{max:i,castShadow:c,floorY:l,gravity:d,name:`fx-gems`}),this.ribbons=new gf(e,{max:a,points:33,outline:s}),this.bolts=new Df(this.ribbons,{rand:u}),this.rand=u,this.streaks=Array.from({length:Gf},()=>({slot:-1,x:0,y:0,z:0,vx:0,vy:0,vz:0,life:0,g:0}))}bolt(e,t,n=Uf){let r=this.unit,i=n.color??`#4df3ff`,a=this.bolts.strike(e,t,{color:i,width:(n.width??.5)*r,forks:n.forks??2,forkLength:n.forkLength??.45,arc:(n.arc??.8)*r,life:n.life??.4,jag:n.jag??.11,intensity:n.intensity??1.6,core:n.core??3,progress:n.progress??1,forkProgress:n.forkProgress??1,flicker:n.flicker??.05,depth:n.depth}),o=(n.haloSize??1.6)*r;n.fromHalo!==!1&&this.sprites.glow(e.x,e.y,e.z,{color:i,intensity:2.2,size:o*.6,grow:1.2,life:(n.life??.4)*1.1});let s=n.beads??3,c=n.progress??1,l=(n.arc??.8)*r;for(let r=1;r<=s;r++){let a=r/(s+1)*c,u=l*4*a*(1-a);this.sprites.glow(e.x+(t.x-e.x)*a,e.y+(t.y-e.y)*a+u,e.z+(t.z-e.z)*a,{color:i,intensity:.8,size:o*.8,grow:1.1,life:(n.life??.4)*1.2})}return a}strike(e,t,n=Uf){let r=this.bolt(e,t,n);return(n.progress??1)>=1&&this.impact(t,{color:n.color??`#4df3ff`,size:n.haloSize??1.6,sparks:n.sparks??26,ringDrop:n.ringDrop}),r}impact(e,t=Uf){let n=this.unit,r=t.color??`#ffffff`,i=(t.size??1.2)*n;this.sprites.halo(e,{color:r,size:i,intensity:t.intensity??2.4,life:t.life??.4}),t.ring!==!1&&this.sprites.ring(e.x,e.y-(t.ringDrop??0),e.z,{color:r,from:i*.3,to:i*1.9,life:.5,thickness:.35,intensity:1.8,normal:t.ringNormal??Wf}),(t.sparks??18)>0&&this.sparks(e,{count:t.sparks??18,color:r,colors:t.colors,speed:7*(t.power??1),up:3,size:t.sparkSize??.08,life:.55})}sparks(e,t=Uf){let n=this.unit;this.sprites.sparkBurst(e,{count:t.count??12,color:t.color??`#ffffff`,colors:t.colors,speed:(t.speed??6)*n,up:(t.up??2.5)*n,size:(t.size??.07)*n,life:t.life??.5,intensity:t.intensity??2.8,stretch:(t.stretch??.06)/n,gravity:(t.gravity??9)*n,spread:.2*n})}glow(e,t=Uf){let n=this.unit;return this.sprites.glow(e.x,e.y,e.z,{...t,size:(t.size??1)*n})}ring(e,t=Uf){let n=this.unit;return this.sprites.ring(e.x,e.y,e.z,{...t,from:(t.from??.2)*n,to:(t.to??3)*n})}shatter(e,t=Uf){let n=this.unit,r=t.colors??zd,i=t.power??1,a=t.color??r[0];this.sprites.halo(e,{color:a,size:2.4*i*n,intensity:2.6,life:.5}),this.sprites.ring(e.x,e.y,e.z,{color:`#ffffff`,from:.3*n,to:3.4*i*n,life:.35,thickness:.07,intensity:1.1}),this.sprites.ring(e.x,e.y,e.z,{color:a,from:.2*n,to:2.4*i*n,life:.6,thickness:.3,intensity:1.6}),this.shards.burst(e,{count:t.count??36,colors:r,speed:11*i*n,up:4*n,size:.5*i*n,life:1.6,spin:14}),this.sparks(e,{count:(t.count??36)*2,colors:r,speed:14*i,up:3,size:.09,life:.8,intensity:3.2,stretch:.07});for(let a=0;a<(t.streaks??6);a++){let t=this.rand()*Math.PI*2,o=this.rand()*.9+.1,s=(10+this.rand()*6)*i*n;this.streak(e,Math.cos(t)*s*(1-o*.5),o*s,Math.sin(t)*s*(1-o*.5),{color:r[a%r.length],width:.28*i})}}streak(e,t,n,r,i=Uf){let a=this.streaks.find(e=>e.slot<0);a&&(a.slot=this.ribbons.trail({color:i.color??`#ffffff`,width:(i.width??.28)*this.unit,intensity:i.intensity??2.2,core:1.8}),!(a.slot<0)&&(a.x=e.x,a.y=e.y,a.z=e.z,a.vx=t,a.vy=n,a.vz=r,a.life=i.life??.7,a.g=(i.gravity??14)*this.unit))}coinBurst(e,t=Uf){let n=this.unit;t.target&&this.coins.target.copy(t.target),this.coins.burst(e,{count:t.count??12,color:`#ffffff`,speed:(t.speed??6)*n,up:7*n,size:(t.size??.55)*n,life:t.life??2.2,spin:9,home:!!t.target,homeDelay:t.delay??.5}),this.sparks(e,{count:12,color:`#ffd166`,speed:6,up:4,size:.07,life:.5,intensity:2.6})}gemBurst(e,t=Uf){let n=this.unit;this.gems.burst(e,{count:t.count??10,colors:t.colors??zd,speed:(t.speed??6)*n,up:7*n,size:(t.size??.5)*n,life:1.8,spin:8}),this.sprites.glow(e.x,e.y,e.z,{color:`#ffffff`,size:n,life:.25,intensity:2})}sparkle(e,t=Uf){let n=t.color??`#ffffff`;this.sprites.glow(e.x,e.y,e.z,{color:n,size:(t.size??.6)*this.unit,life:.22,intensity:2.2}),this.sparks(e,{count:t.count??8,color:n,speed:4,up:2.5,size:.06,life:.4,intensity:2.6})}update(e,t){for(let t=0;t<Gf;t++){let n=this.streaks[t];if(n.slot<0)continue;n.life-=e,n.vy-=n.g*e;let r=Math.exp(-1.2*e);n.vx*=r,n.vz*=r,n.x+=n.vx*e,n.y+=n.vy*e,n.z+=n.vz*e,this.ribbons.push(n.slot,n.x,n.y,n.z),n.life<=0&&(this.ribbons.release(n.slot,.2),n.slot=-1)}this.bolts.update(e),this.sprites.update(e),this.shards.update(e),this.coins.update(e),this.gems.update(e),this.ribbons.update(e,t)}clear(){for(let e of this.streaks)e.slot=-1;this.bolts.clear(),this.ribbons.clear(),this.sprites.clear(),this.shards.clear(),this.coins.clear(),this.gems.clear()}};function qf(e,{max:t=14}={}){let n=document.createElement(`div`);n.className=`pops`,e.appendChild(n);let r=Array.from({length:t},()=>{let e=document.createElement(`div`);return e.className=`pop`,e.innerHTML=`<span class="pop-back"></span><span class="pop-front"></span>`,e.style.display=`none`,n.appendChild(e),e}),i=0;function a(e,n,a,{kind:o=`gold`,size:s=1,rise:c=1,duration:l=1150,tilt:u=-3}={}){let d=r[i];i=(i+1)%t;for(let e of d.getAnimations())e.cancel();d.className=`pop ${o}`,d.style.setProperty(`--pop-size`,String(s)),d.children[0].textContent=a,d.children[1].textContent=a,d.style.display=``;let f=u+(Math.random()-.5)*5,p=(t,r,i)=>`translate(${e.toFixed(1)}px, ${(n+t).toFixed(1)}px) translate(-50%, -50%) scale(${r}) rotate(${i}deg)`,m=d.animate([{transform:p(0,.15,f-12),opacity:0,easing:`cubic-bezier(.2,.9,.3,1)`},{transform:p(0,1.4,f+3),opacity:1,offset:.13,easing:`ease-in-out`},{transform:p(0,.88,f-1),opacity:1,offset:.23,easing:`ease-in-out`},{transform:p(0,1.07,f),opacity:1,offset:.31,easing:`ease-in-out`},{transform:p(0,1,f),opacity:1,offset:.38},{transform:p(-22*c,1,f),opacity:1,offset:.78,easing:`ease-in`},{transform:p(-64*c,.82,f),opacity:0}],{duration:l,fill:`forwards`});return m.onfinish=()=>{d.style.display=`none`},d}return{layer:n,pop:a,combo(e,t,n,r={}){return a(e,t,n,{kind:`combo`,size:.9,duration:1400,tilt:-6,rise:.6,...r})},punch(e,t=1){e?.animate([{scale:1,filter:`brightness(1)`},{scale:1+.3*t,filter:`brightness(1.5)`,offset:.28},{scale:1-.05*t,filter:`brightness(1.1)`,offset:.62},{scale:1,filter:`brightness(1)`}],{duration:280,easing:`ease-out`})},freeze(e){for(let t of r)for(let n of t.getAnimations())n.pause(),n.currentTime=e},clear(){for(let e of r){for(let t of e.getAnimations())t.cancel();e.style.display=`none`}}}}var Jf={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Yf=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},Xf=new ao(-1,1,1,-1,0,1),Zf=new class extends oi{constructor(){super(),this.setAttribute(`position`,new Jr([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new Jr([0,2,0,0,2,0],2))}},Qf=class{constructor(e){this._mesh=new Ai(Zf,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Xf)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},$f=class extends Yf{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof _a?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=ma.clone(e.uniforms),this.material=new _a({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Qf(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},ep=class extends Yf{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},tp=class extends Yf{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},np=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new X);this._width=n.width,this._height=n.height,t=new En(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:le}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $f(Jf),this.copyPass.material.blending=0,this.timer=new mo}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}ep!==void 0&&(r instanceof ep?n=!0:r instanceof tp&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new X);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},rp=class extends Yf{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Q}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},ip={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Q(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},ap=class e extends Yf{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new X(256,256):new X(e.x,e.y),this.clearColor=new Q(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new En(i,a,{type:le,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new En(i,a,{type:le,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new En(i,a,{type:le,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=ip;this.highPassUniforms=ma.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new _a({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new X(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new Z(1,1,1),new Z(1,1,1),new Z(1,1,1),new Z(1,1,1),new Z(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ma.clone(Jf.uniforms),this.blendMaterial=new _a({uniforms:this.copyUniforms,vertexShader:Jf.vertexShader,fragmentShader:Jf.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Q,this._oldClearAlpha=1,this._basic=new vi,this._fsQuad=new Qf(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new X(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new _a({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new X(.5,.5)},direction:{value:new X(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new _a({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};ap.BlurDirectionX=new X(1,0),ap.BlurDirectionY=new X(0,1);var op={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},sp=class extends Yf{constructor(){super(),this.isOutputPass=!0,this.uniforms=ma.clone(op.uniforms),this.material=new va({name:op.name,uniforms:this.uniforms,vertexShader:op.vertexShader,fragmentShader:op.fragmentShader}),this._fsQuad=new Qf(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},pn.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},cp={aces:4,agx:6,neutral:7},lp=`
varying vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,up=`
uniform vec3 uTop, uBottom, uHorizon, uGlow, uGlow2;
uniform vec2 uGlowAt, uGlow2At;
uniform float uGlowSize, uGlow2Size, uHorizonAt, uHorizonWidth, uVignette, uStars, uAspect;
varying vec2 vUv;
float bdHash( vec2 p ) { p = fract( p * vec2( 233.34, 851.73 ) ); p += dot( p, p + 23.45 ); return fract( p.x * p.y ); }
void main() {
  vec2 uv = vUv;
  vec3 c = mix( uBottom, uTop, smoothstep( 0.0, 1.0, uv.y ) );
  float hb = 1.0 - smoothstep( 0.0, uHorizonWidth, abs( uv.y - uHorizonAt ) );
  c += uHorizon * hb * hb;
  vec2 d1 = ( uv - uGlowAt ) * vec2( uAspect, 1.0 );
  c += uGlow * exp( - dot( d1, d1 ) / ( uGlowSize * uGlowSize ) );
  vec2 d2 = ( uv - uGlow2At ) * vec2( uAspect, 1.0 );
  c += uGlow2 * exp( - dot( d2, d2 ) / ( uGlow2Size * uGlow2Size ) );
  if ( uStars > 0.0 ) {
    vec2 p = uv * vec2( uAspect, 1.0 ) * 70.0;
    vec2 cell = floor( p );
    float h = bdHash( cell );
    vec2 o = vec2( bdHash( cell + 1.3 ), bdHash( cell + 7.1 ) ) - 0.5;
    float r = length( fract( p ) - 0.5 - o * 0.6 );
    float star = step( 1.0 - uStars * 0.12, h ) * smoothstep( 0.09, 0.0, r ) * ( 0.4 + 0.6 * bdHash( cell + 3.3 ) );
    c += vec3( 0.75, 0.8, 1.0 ) * star * smoothstep( uHorizonAt - 0.05, 1.0, uv.y ) * 0.6;
  }
  vec2 q = ( uv - 0.5 ) * vec2( 1.0, 1.15 );
  c *= 1.0 - uVignette * smoothstep( 0.18, 0.62, dot( q, q ) * 1.6 );
  c += ( bdHash( gl_FragCoord.xy ) - 0.5 ) / 255.0;
  gl_FragColor = vec4( max( c, 0.0 ), 1.0 );
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function dp(){let e=new oi;e.setAttribute(`position`,new Jr([-1,-1,0,3,-1,0,-1,3,0],3));let t=new Ai(e,new _a({uniforms:{uTop:{value:new Q},uBottom:{value:new Q},uHorizon:{value:new Q},uGlow:{value:new Q},uGlow2:{value:new Q},uGlowAt:{value:new X(.5,.5)},uGlow2At:{value:new X(.5,.5)},uGlowSize:{value:.5},uGlow2Size:{value:.5},uHorizonAt:{value:.5},uHorizonWidth:{value:.2},uVignette:{value:.4},uStars:{value:0},uAspect:{value:16/9}},vertexShader:lp,fragmentShader:up,depthWrite:!1,depthTest:!1}));return t.name=`backdrop`,t.frustumCulled=!1,t.renderOrder=-1e9,t}function fp(e){let t=new fr,n=new sa(40,24,12),r=new Q(e.env[0]),i=new Q(e.env[1]),a=new Q(e.env[2]),o=n.attributes.position,s=new Float32Array(o.count*3),c=new Q;for(let e=0;e<o.count;e++){let t=o.getY(e)/40;t>=0?c.copy(i).lerp(r,Math.min(1,t/.55)):c.copy(i).lerp(a,Math.min(1,-t/.25)),s.set([c.r,c.g,c.b],e*3)}n.setAttribute(`color`,new Jr(s,3)),t.add(new Ai(n,new vi({vertexColors:!0,side:1})));let l=new aa(1,1),u=[{color:e.envPanels[2],k:3.2,pos:[0,30,4],size:[30,16]},{color:e.envPanels[0],k:4.5,pos:[-28,10,14],size:[10,18]},{color:e.envPanels[1],k:4.5,pos:[22,6,-28],size:[14,10]}];for(let n of u){let r=new Ai(l,new vi({color:new Q(n.color).multiplyScalar(n.k*(e.envPanelIntensity??1)),side:1}));r.position.set(...n.pos),r.scale.set(n.size[0],n.size[1],1),r.lookAt(0,0,0),t.add(r)}return t}function pp(e){e.traverse(e=>{e.geometry?.dispose(),e.material?.dispose?.()})}function mp(e,t={}){let{renderer:n,scene:r,camera:i,size:a}=e,o={backdrop:`storm`,toneMapping:`neutral`,exposure:1,shadows:!0,shadowArea:20,shadowsStatic:!1,keyDir:[-.55,1,.45],rimDir:[.35,.45,-1],ground:!1,env:`palette`,fog:!0,alignHorizon:!0,...t,bloom:t.bloom!==!1&&{strength:.85,radius:.55,threshold:.9,...t.bloom||{}}};n.toneMapping=cp[o.toneMapping]??7,n.toneMappingExposure=o.exposure,n.shadowMap.enabled=!0,n.shadowMap.type=1,n.info.autoReset=!1,r.background=null;let s=dp();r.add(s);let c=e.lights.hemi,l=e.lights.sun,u=new so(16777215,1);r.add(u,u.target,l.target);let d=new Z(...o.keyDir).normalize(),f=new Z(...o.rimDir).normalize(),p=new Z,m=o.shadowArea;l.shadow.bias=-4e-4,l.shadow.normalBias=.03,l.shadow.radius=4,l.shadow.intensity=.85;function h(e=0,t=0,r=0,i=m){p.set(e,t,r),m=i,l.target.position.copy(p),l.position.copy(p).addScaledVector(d,i*2.2),u.target.position.copy(p),u.position.copy(p).addScaledVector(f,i*2);let a=l.shadow.camera;a.left=-i,a.right=i,a.top=i,a.bottom=-i,a.near=.5,a.far=i*5,a.updateProjectionMatrix(),l.target.updateMatrixWorld(),u.target.updateMatrixWorld(),n.shadowMap.needsUpdate=!0}h(0,0,0,o.shadowArea),o.shadowsStatic&&(n.shadowMap.autoUpdate=!1);let g=null;if(o.ground){let e={y:0,size:200,opacity:.35,color:`#000000`,...o.ground===!0?{}:o.ground};g=new Ai(new aa(e.size,e.size),new ca({color:e.color,opacity:e.opacity})),g.rotation.x=-Math.PI/2,g.position.y=e.y,g.receiveShadow=!0,g.name=`shadow-catcher`,r.add(g)}let _=null,v=new es(n),y=null;function b(e){let t=typeof e==`string`?Rd[e]??Rd.storm:e;y=t;let i=s.material.uniforms;i.uTop.value.set(t.top),i.uBottom.value.set(t.bottom),i.uHorizon.value.set(t.horizon),i.uGlow.value.set(t.glow),i.uGlow2.value.set(t.glow2??`#000000`),i.uGlowAt.value.set(...t.glowAt),i.uGlow2At.value.set(...t.glow2At??[.5,.5]),i.uGlowSize.value=t.glowSize,i.uGlow2Size.value=t.glow2Size??.5,i.uHorizonAt.value=t.horizonAt,i.uHorizonWidth.value=t.horizonWidth,i.uVignette.value=t.vignette,i.uStars.value=t.stars,o.fog?(r.fog||=new dr(t.fog,t.fogNear,t.fogFar),r.fog.color.set(t.fog),r.fog.near=t.fogNear,r.fog.far=t.fogFar):r.fog=null,c.color.set(t.hemiSky),c.groundColor.set(t.hemiGround),c.intensity=t.hemi,l.color.set(t.key),l.intensity=t.keyIntensity,u.color.set(t.rim),u.intensity=t.rimIntensity;let a=o.env===`room`?new Jl:fp(t),d=v.fromScene(a,o.env===`room`?.04:.02);pp(a);let f=r.environment;r.environment=d.texture,r.environmentIntensity=t.envIntensity??1,_?_.dispose():f?.dispose?.(),_=d,n.info.reset()}b(o.backdrop);let x=n.extensions.has(`EXT_color_buffer_float`)||n.extensions.has(`EXT_color_buffer_half_float`),S=null,C=null,w=null,T=null,E=-1,D=-1,O=-1,k=.5,A={sceneCalls:0,sceneTriangles:0,shadowBake:!1};function j(e){if(S){if(S.renderTarget1.samples!==e)for(let t of[S.renderTarget1,S.renderTarget2])t.samples=e,t.dispose();return}let t=new En(1,1,{type:le,samples:e});S=new np(n,t),C=new rp(r,i);let a=C.render.bind(C);C.render=(...e)=>{a(...e),A.sceneCalls=n.info.render.calls,A.sceneTriangles=n.info.render.triangles},w=new ap(new X(256,256),o.bloom.strength,o.bloom.radius,o.bloom.threshold);let s=w.setSize.bind(w);w.setSize=(e,t)=>s(Math.max(2,Math.round(e*k)),Math.max(2,Math.round(t*k))),T=new sp,S.addPass(C),S.addPass(w),S.addPass(T),E=-1}let M=o.quality??{name:`high`,bloom:!0,shadows:!0,shadowMapSize:1024,msaa:4},N=!1;function P(e){M=e,N=!!(e.bloom&&o.bloom&&x),N&&(k=e.name===`ultra`?1:.5,j(e.msaa??4),E=-1);let t=!!(e.shadows&&o.shadows);l.castShadow=t;let r=e.shadowMapSize||1024;t&&l.shadow.mapSize.x!==r&&(l.shadow.mapSize.set(r,r),l.shadow.map?.dispose(),l.shadow.map=null),n.shadowMap.needsUpdate=!0}P(M);let F=e.resize,ee=e.render;function I(){if(!N||!S)return;let e=n.getPixelRatio();(a.width!==E||a.height!==D||e!==O)&&(E=a.width,D=a.height,O=e,S.setPixelRatio(e),S.setSize(a.width,a.height))}function L(){let e=F();return s.material.uniforms.uAspect.value=a.aspect||1,e}let R=new Z,te=new Z;function z(){if(!o.alignHorizon||!y||(i.getWorldDirection(R),R.y=0,R.lengthSq()<1e-6))return;R.normalize(),te.copy(i.position).addScaledVector(R,1e4).setY(0).project(i);let e=Math.min(1.2,Math.max(-.2,te.y*.5+.5)),t=s.material.uniforms,n=y;t.uHorizonAt.value=e,t.uGlowAt.value.y=e+(n.glowAt[1]-n.horizonAt),t.uGlow2At.value.y=e+((n.glow2At??n.glowAt)[1]-n.horizonAt)}function ne(){n.info.reset(),A.shadowBake=n.shadowMap.enabled&&n.shadowMap.needsUpdate,z(),N?(I(),S.render()):(n.render(r,i),A.sceneCalls=n.info.render.calls,A.sceneTriangles=n.info.render.triangles)}e.resize=L,e.render=ne,L();function B(){let e=n.info.render;return{tier:M.name,dpr:n.getPixelRatio(),bloom:N,shadows:l.castShadow,calls:e.calls,triangles:e.triangles,points:e.points,lines:e.lines,sceneCalls:A.sceneCalls,sceneTriangles:A.sceneTriangles,postCalls:e.calls-A.sceneCalls,shadowBake:A.shadowBake}}function V(){S?.dispose?.(),w?.dispose(),T?.dispose(),_?.dispose(),v.dispose(),s.geometry.dispose(),s.material.dispose(),g&&(g.geometry.dispose(),g.material.dispose(),r.remove(g)),r.remove(s,u,u.target),e.resize=F,e.render=ee}return{get composer(){return S},get bloomPass(){return w},get backdropPreset(){return y},get tier(){return M},key:l,rim:u,hemi:c,ground:g,backdrop:s,setQuality:P,setBackdrop:b,setFocus:h,info:B,dispose:V,render:ne,resize:L,refreshShadows(){n.shadowMap.needsUpdate=!0}}}var hp=new Z;function gp(e,t,n,r,i,a){let o=2*Math.PI*i/4,s=Math.max(a-2*i,0),c=Math.PI/4;hp.copy(t),hp[r]=0,hp.normalize();let l=.5*o/(o+s),u=1-hp.angleTo(e)/c;return Math.sign(hp[n])===1?u*l:s/(o+s)+l+l*(1-u)}var _p=class e extends Qi{constructor(e=1,t=1,n=1,r=2,i=.1){let a=r*2+1;if(i=Math.min(e/2,t/2,n/2,i),super(1,1,1,a,a,a),this.type=`RoundedBoxGeometry`,this.parameters={width:e,height:t,depth:n,segments:r,radius:i},a===1)return;let o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;let s=new Z,c=new Z,l=new Z(e,t,n).divideScalar(2).subScalar(i),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,p=u.length/6,m=new Z,h=.5/a;for(let r=0,a=0;r<u.length;r+=3,a+=2)switch(s.fromArray(u,r),c.copy(s),c.x-=Math.sign(c.x)*h,c.y-=Math.sign(c.y)*h,c.z-=Math.sign(c.z)*h,c.normalize(),u[r+0]=l.x*Math.sign(s.x)+c.x*i,u[r+1]=l.y*Math.sign(s.y)+c.y*i,u[r+2]=l.z*Math.sign(s.z)+c.z*i,d[r+0]=c.x,d[r+1]=c.y,d[r+2]=c.z,Math.floor(r/p)){case 0:m.set(1,0,0),f[a+0]=gp(m,c,`z`,`y`,i,n),f[a+1]=1-gp(m,c,`y`,`z`,i,t);break;case 1:m.set(-1,0,0),f[a+0]=1-gp(m,c,`z`,`y`,i,n),f[a+1]=1-gp(m,c,`y`,`z`,i,t);break;case 2:m.set(0,1,0),f[a+0]=1-gp(m,c,`x`,`z`,i,e),f[a+1]=gp(m,c,`z`,`x`,i,n);break;case 3:m.set(0,-1,0),f[a+0]=1-gp(m,c,`x`,`z`,i,e),f[a+1]=1-gp(m,c,`z`,`x`,i,n);break;case 4:m.set(0,0,1),f[a+0]=1-gp(m,c,`x`,`y`,i,e),f[a+1]=1-gp(m,c,`y`,`x`,i,t);break;case 5:m.set(0,0,-1),f[a+0]=gp(m,c,`x`,`y`,i,e),f[a+1]=1-gp(m,c,`y`,`x`,i,t)}}static fromJSON(t){return new e(t.width,t.height,t.depth,t.segments,t.radius)}};function vp(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i=new Set(Object.keys(e[0].morphAttributes)),a={},o={},s=e[0].morphTargetsRelative,c=new oi,l=0;for(let u=0;u<e.length;++u){let d=e[u],f=0;if(n!==(d.index!==null))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`),null;for(let e in d.attributes){if(!r.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`),null;a[e]===void 0&&(a[e]=[]),a[e].push(d.attributes[e]),f++}if(f!==r.size)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. Make sure all geometries have the same number of attributes.`),null;if(s!==d.morphTargetsRelative)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. .morphTargetsRelative must be consistent throughout all geometries.`),null;for(let e in d.morphAttributes){if(!i.has(e))return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`.  .morphAttributes must be consistent throughout all geometries.`),null;o[e]===void 0&&(o[e]=[]),o[e].push(d.morphAttributes[e])}if(t){let e;if(n)e=d.index.count;else if(d.attributes.position!==void 0)e=d.attributes.position.count;else return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index `+u+`. The geometry must have either an index or a position attribute`),null;c.addGroup(l,e,u),l+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}c.setIndex(n)}for(let e in a){let t=yp(a[e]);if(!t)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` attribute.`),null;c.setAttribute(e,t)}for(let e in o){let t=o[e][0].length;if(t!==0){c.morphAttributes=c.morphAttributes||{},c.morphAttributes[e]=[];for(let n=0;n<t;++n){let t=[];for(let r=0;r<o[e].length;++r)t.push(o[e][r][n]);let r=yp(t);if(!r)return console.error(`THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the `+e+` morphAttribute.`),null;c.morphAttributes[e].push(r)}}}return c}function yp(e){let t,n,r,i=-1,a=0;for(let o=0;o<e.length;++o){let s=e[o];if(t===void 0&&(t=s.array.constructor),t!==s.array.constructor)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`),null;if(n===void 0&&(n=s.itemSize),n!==s.itemSize)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`),null;if(r===void 0&&(r=s.normalized),r!==s.normalized)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`),null;if(i===-1&&(i=s.gpuType),i!==s.gpuType)return console.error(`THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.`),null;a+=s.count*n}let o=new t(a),s=new Gr(o,n,r),c=0;for(let t=0;t<e.length;++t){let r=e[t];if(r.isInterleavedBufferAttribute){let e=c/n;for(let t=0,i=r.count;t<i;t++)for(let i=0;i<n;i++){let n=r.getComponent(t,i);s.setComponent(t+e,i,n)}}else o.set(r.array,c);c+=r.count*n}return i!==void 0&&(s.gpuType=i),s}var bp={unlit:`#8690b6`,unlitWindow:`#474f73`,unlitTrim:`#9aa3c6`,rod:`#d9def0`,window:`#fff2b8`,lit:[`#ffc21a`,`#ff5e57`,`#ff6fb5`,`#3fd07a`,`#ff8c2a`,`#9d6bff`],asphalt:`#5a6290`,field:`#7cc463`,sidewalk:`#e4dde6`,park:`#78c86a`,dash:`#f2f4ff`,treeGreen:[`#58c25a`,`#7fd65a`,`#3fae6a`],trunk:`#8a5a3c`,cars:[`#ff5a5f`,`#ffd23f`,`#4f8dff`,`#ffffff`,`#ff9f40`,`#7a5cff`]};new kn,new an,new Z,new Z,new Q,new Z;function xp(e,t,{x:n=0,y:r=0,z:i=0,ry:a=0,rx:o=0,rz:s=0}={}){let c=e.index?e.toNonIndexed():e;return c.deleteAttribute(`uv`),s&&c.rotateZ(s),o&&c.rotateX(o),a&&c.rotateY(a),c.translate(n,r,i),c.setAttribute(`aPart`,new Jr(new Float32Array(c.attributes.position.count).fill(t),1)),c}function Sp(e,t,n){let r=xp(e,0,n);r.deleteAttribute(`aPart`);let i=new Q(t),a=r.attributes.position.count,o=new Float32Array(a*3);for(let e=0;e<a;e++)o.set([i.r,i.g,i.b],e*3);return r.setAttribute(`color`,new Gr(o,3)),r}function Cp(){return{roundTree:vp([Sp(new $i(.22,.28,1.2,5,1,!0),bp.trunk,{y:.6}),Sp(new sa(1.25,8,5),`#ffffff`,{y:2.1})]),coneTree:vp([Sp(new $i(.18,.22,.8,5,1),bp.trunk,{y:.4}),Sp(new ea(1.05,2.6,7,1),`#ffffff`,{y:2.1})]),car:vp([Sp(new _p(1.5,.6,3,1,.18),`#ffffff`,{y:.55}),Sp(new _p(1.25,.55,1.5,1,.14),`#dfe6ff`,{y:1.1,z:-.2}),...[[-.72,.9],[.72,.9],[-.72,-.9],[.72,-.9]].map(([e,t])=>Sp(new $i(.3,.3,.25,8,1),`#2a2f45`,{rz:Math.PI/2,x:e,y:.3,z:t}))])}}function wp(e=.1){let t=.5-e,n=.5,r=[[t,n],[n,t],[n,-t],[t,-.5],[-t,-.5],[-.5,-t],[-.5,t],[-t,n]],i=[];for(let e=0;e<8;e++){let[t,n]=r[e],[a,o]=r[(e+1)%8];i.push(t,0,n,a,0,o,a,1,o,t,0,n,a,1,o,t,1,n)}for(let e=1;e<7;e++){let[t,n]=r[0],[a,o]=r[e],[s,c]=r[e+1];i.push(t,1,n,a,1,o,s,1,c)}let a=new oi;a.setAttribute(`position`,new Jr(i,3)),a.computeVertexNormals();let o=a.attributes.normal,s=a.attributes.position;if(o.getX(0)*(s.getX(0)+s.getX(1))+o.getZ(0)*(s.getZ(0)+s.getZ(1))<0){for(let e=0;e<s.count;e+=3)for(let t of[s,o]){let n=[t.getX(e+1),t.getY(e+1),t.getZ(e+1)];t.setXYZ(e+1,t.getX(e+2),t.getY(e+2),t.getZ(e+2)),t.setXYZ(e+2,...n)}a.computeVertexNormals()}return a.computeBoundingBox(),a.computeBoundingSphere(),a}var Tp=`
attribute vec4 aState;
attribute vec3 aLitColor;
varying vec3 vBkLocal;
varying vec3 vBkScale;
varying vec3 vBkN;
varying vec4 vBkState;
varying vec3 vBkLit;
`,Ep=`
uniform vec3 bkUnlit, bkUnlitWin, bkUnlitTop, bkWin;
uniform float bkWinGlow, bkEdge, bkFlash, bkStorey, bkMargin, bkPane;
uniform vec2 bkBand;
varying vec3 vBkLocal;
varying vec3 vBkScale;
varying vec3 vBkN;
varying vec4 vBkState;
varying vec3 vBkLit;
`;function Dp({unlit:e=bp.unlit,unlitWindow:t=bp.unlitWindow,unlitTop:n=bp.unlitTrim,window:r=bp.window,windowGlow:i=1.05,edge:a=2.4,flash:o=.9,storey:s=3.2,band:c=[.34,.72],margin:l=.9,pane:u=1.8,roughness:d=.72}={}){let f=new ya({color:16777215,roughness:d,metalness:0,envMapIntensity:.6}),p={bkUnlit:{value:new Q(e)},bkUnlitWin:{value:new Q(t)},bkUnlitTop:{value:new Q(n)},bkWin:{value:new Q(r)},bkWinGlow:{value:i},bkEdge:{value:a},bkFlash:{value:o},bkStorey:{value:s},bkMargin:{value:l},bkPane:{value:u},bkBand:{value:new X(c[0],c[1])}};return f.userData.block=p,f.onBeforeCompile=e=>{Object.assign(e.uniforms,p),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Tp}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        #ifdef USE_INSTANCING
          vBkScale = vec3( length( instanceMatrix[ 0 ].xyz ), length( instanceMatrix[ 1 ].xyz ), length( instanceMatrix[ 2 ].xyz ) );
        #else
          vBkScale = vec3( 1.0 );
        #endif
        vBkLocal = position * vBkScale; vBkN = normal; vBkState = aState; vBkLit = aLitColor;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${Ep}`).replace(`#include <color_fragment>`,`#include <color_fragment>
        float bkY = vBkState.y + vBkLocal.y;
        float bkLitK = 1.0 - smoothstep( vBkState.x - 0.2, vBkState.x + 0.2, bkY );
        float bkTopF = step( 0.5, vBkN.y );
        float bkWinK = 0.0;
        float bkAx = max( abs( vBkN.x ), abs( vBkN.z ) );
        if ( bkTopF < 0.5 && bkAx > 0.9 ) {
          bool onX = abs( vBkN.x ) > abs( vBkN.z );
          float u = onX ? vBkLocal.z : vBkLocal.x;
          float faceW = onX ? vBkScale.z : vBkScale.x;
          float q = bkY / bkStorey;
          float fy = fract( q );
          float aa = max( fwidth( q ) * 1.2, 0.002 );
          float bandK = smoothstep( bkBand.x - aa, bkBand.x + aa, fy ) * ( 1.0 - smoothstep( bkBand.y - aa, bkBand.y + aa, fy ) );
          float edgeU = faceW * 0.5 - bkMargin;
          float au = max( fwidth( u ) * 1.2, 0.002 );
          float inside = 1.0 - smoothstep( edgeU - au, edgeU + au, abs( u ) );
          float notGround = step( 1.0, floor( q ) );
          float notTop = 1.0 - step( vBkScale.y - 1.1, vBkLocal.y );
          bkWinK = bandK * inside * notGround * notTop;
          if ( vBkState.w > 0.5 ) {
            float fu = fract( u / bkPane + 0.5 );
            float ap = max( fwidth( u / bkPane ) * 1.2, 0.002 );
            bkWinK *= smoothstep( 0.16 - ap, 0.16 + ap, fu ) * ( 1.0 - smoothstep( 0.84 - ap, 0.84 + ap, fu ) );
          }
        }
        vec3 bkBody = mix( bkUnlit, vBkLit, bkLitK );
        vec3 bkRoof = mix( bkUnlitTop, mix( vBkLit, vec3( 1.0 ), 0.35 ), bkLitK );
        vec3 bkWinC = mix( bkUnlitWin, bkWin, bkLitK );
        diffuseColor.rgb = mix( mix( bkBody, bkRoof, bkTopF ), bkWinC, bkWinK );`).replace(`#include <roughnessmap_fragment>`,`#include <roughnessmap_fragment>
roughnessFactor = mix( roughnessFactor, 0.3, bkWinK );`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
        totalEmissiveRadiance += bkWin * bkWinGlow * bkWinK * bkLitK;
        float bkLine = ( 1.0 - smoothstep( 0.0, 0.45, abs( bkY - vBkState.x ) ) ) * step( 0.05, vBkState.x ) * ( 1.0 - bkTopF );
        totalEmissiveRadiance += vec3( 1.0, 0.95, 0.82 ) * bkEdge * bkLine * step( bkY, vBkState.x + 0.6 ) * step( vBkState.x, vBkState.y + vBkScale.y + 0.3 ) * step( 0.001, vBkState.x - vBkState.y );
        totalEmissiveRadiance += vec3( 1.0 ) * bkFlash * vBkState.z;`)},f.customProgramCacheKey=()=>`gs-toy-block`,f}function Op({roughness:e=.6,metalness:t=0}={}){return new ya({color:16777215,roughness:e,metalness:t,envMapIntensity:.6})}var kp=-.45,Ap=-1.1,jp={rim:8,beach:3,shallow:5.5,corner:4,cornerSegments:6},Mp={beach:1.4,shallow:2.8,segments:20,max:9},Np=Math.PI*2;function Pp(e,t,n,r,i,a){let o=[],s=[[n-i,r-i,0],[-(n-i),r-i,Np/4],[-(n-i),-(r-i),Np/2],[n-i,-(r-i),Np*.75]];for(let[n,r,c]of s)for(let s=0;s<=a;s++){let l=c+s/a*(Np/4);o.push([e+n+Math.cos(l)*i,t+r+Math.sin(l)*i])}return o}function Fp(e,t,n){let r=e.range(0,Math.PI),i=[[2,e.range(.03,.08),e.range(0,Np)],[3,e.range(.03,.07),e.range(0,Np)],[5,e.range(.01,.03),e.range(0,Np)]];return e=>{let a=e-r,o=1;for(let[t,n,r]of i)o+=n*Math.sin(t*e+r);return t*n/Math.hypot(n*Math.cos(a),t*Math.sin(a))*o}}var Ip=(e,t,n,r,i)=>Array.from({length:i},(a,o)=>{let s=o/i*Np,c=n(s)+r;return[e+Math.cos(s)*c,t+Math.sin(s)*c]});function Lp(e,t,n,r,i){let a=Math.abs(e),o=Math.abs(t);if(a>n-i||o>n-i)return!1;let s=n-r;return a<=s||o<=s||Math.hypot(a-s,o-s)<=r-i}function Rp({rng:e,plate:t,vx:n,vz:r}){let i=t/2+jp.rim,a=e=>Pp(0,0,i+e,i+e,jp.corner+e,jp.cornerSegments),o={kind:`main`,x:0,z:0,half:i,corner:jp.corner,grass:a(0),sand:a(jp.beach),shallow:a(jp.beach+jp.shallow)},s=i+jp.beach+jp.shallow,c=[o],l=[],u=(t,n,r)=>({kind:e.next()<.55?`roundTree`:`coneTree`,x:t,z:n,s:r,r:e.range(0,Np)}),d=(e,t)=>(e*n+t*r)/Math.max(1,Math.hypot(e,t))>.35;for(let t=0;t<120&&c.length<Mp.max+1;t++){let t=e.range(3.8,8.2),n=t*e.range(.78,1.18),r=e.range(0,Np),i=Math.max(t,n)*1.18+Mp.beach+Mp.shallow,a=s+i+e.range(3,48),o=Math.cos(r)*a,f=Math.sin(r)*a;if(d(o,f)||Math.abs(o)<s+i+2&&Math.abs(f)<s+i+2||c.some(e=>e.kind===`islet`&&Math.hypot(e.x-o,e.z-f)<e.reach+i+1.5))continue;let p=Fp(e,t,n),m=Mp.segments;c.push({kind:`islet`,x:o,z:f,reach:i,radius:p,grass:Ip(o,f,p,0,m),sand:Ip(o,f,p,Mp.beach,m),shallow:Ip(o,f,p,Mp.beach+Mp.shallow,m)});let h=t>6.2?3:t>4.6?2:1,g=e.range(0,Np);for(let t=0;t<h;t++){let n=g+t/h*Np+e.range(-.4,.4),r=(h===1?e.range(0,.25):e.range(.3,.6))*Math.max(0,p(n)-1.4);l.push(u(o+Math.cos(n)*r,f+Math.sin(n)*r,e.range(1.6,2.4)))}}let f=t/2;for(let t=0;t<40&&l.length<40;t++){let t=e.range(-1,1)*i,n=e.range(-1,1)*i;Math.abs(t)<f+1.2&&Math.abs(n)<f+1.2||!d(t,n)&&Lp(t,n,i,jp.corner,1.6)&&l.push(u(t,n,e.range(1.8,2.6)))}return{isles:c,trees:l}}var zp=class{pos=[];nor=[];col=[];tri(e,t,n,r,i,a,o){let s=t[0]-e[0],c=t[1]-e[1],l=t[2]-e[2],u=n[0]-e[0],d=n[1]-e[1],f=n[2]-e[2],p=c*f-l*d,m=l*u-s*f,h=s*d-c*u,g=[r[0]+i[0]+a[0],r[1]+i[1]+a[1],r[2]+i[2]+a[2]],_=p*g[0]+m*g[1]+h*g[2]<0?[[e,r],[n,a],[t,i]]:[[e,r],[t,i],[n,a]];for(let[e,t]of _)this.pos.push(e[0],e[1],e[2]),this.nor.push(t[0],t[1],t[2]),o&&this.col.push(o.r,o.g,o.b)}cap(e,t,n){let r=0,i=0;for(let[t,n]of e)r+=t,i+=n;r/=e.length,i/=e.length;let a=[0,1,0];for(let o=0;o<e.length;o++){let s=e[o],c=e[(o+1)%e.length];this.tri([r,t,i],[s[0],t,s[1]],[c[0],t,c[1]],a,a,a,n)}}wall(e,t,n,r){let i=e.length,a=[];for(let t=0;t<i;t++){let n=e[t],r=e[(t+1)%i],o=r[0]-n[0],s=r[1]-n[1],c=Math.hypot(o,s)||1;a.push([s/c,0,-o/c])}let o=e.map((e,t)=>{let n=a[(t-1+i)%i],r=a[t],o=n[0]+r[0],s=n[2]+r[2],c=Math.hypot(o,s)||1;return[o/c,0,s/c]});for(let a=0;a<i;a++){let s=(a+1)%i,c=e[a],l=e[s],u=[c[0],t,c[1]],d=[c[0],n,c[1]],f=[l[0],t,l[1]],p=[l[0],n,l[1]];this.tri(u,d,p,o[a],o[a],o[s],r),this.tri(u,p,f,o[a],o[s],o[s],r)}}geometry(){let e=new oi;return e.setAttribute(`position`,new Jr(this.pos,3)),e.setAttribute(`normal`,new Jr(this.nor,3)),this.col.length&&e.setAttribute(`color`,new Jr(this.col,3)),e.computeBoundingBox(),e.computeBoundingSphere(),e}};function Bp(e,t){let n=new zp,r=new zp;for(let t of e)n.cap(t.grass,0),n.wall(t.grass,0,-.47000000000000003),r.cap(t.sand,kp),r.wall(t.sand,kp,Ap);let i=(e,t,n)=>{let r=new Ai(e.geometry(),n);return r.name=t,r.receiveShadow=!0,r};return[i(n,`isle-land`,new ya({color:t.land,roughness:.95})),i(r,`isle-sand`,new ya({color:t.sand,roughness:.95}))]}function Vp(e,t,n){let r=!1;for(let i=0,a=e.length-2;i<e.length;a=i,i+=2){let o=e[i],s=e[i+1],c=e[a],l=e[a+1];s>n!=l>n&&t<(c-o)*(n-s)/(l-s)+o&&(r=!r)}return r}function Hp(e,t,n){let r=1/0;for(let i=0,a=e.length-2;i<e.length;a=i,i+=2){let o=e[a],s=e[a+1],c=e[i]-o,l=e[i+1]-s,u=((t-o)*c+(n-s)*l)/(c*c+l*l||1);u=u<0?0:u>1?1:u;let d=t-o-u*c,f=n-s-u*l,p=d*d+f*f;p<r&&(r=p)}return Math.sqrt(r)}function Up(e,{maxD:t=16,texel:n=.9}={}){let r=0;for(let t of e)for(let[e,n]of t.shallow)r=Math.max(r,Math.abs(e),Math.abs(n));let i=r+t,a=Math.min(512,Math.max(128,2**Math.round(Math.log2(i*2/n)))),o=i*2/a,s=new Uint8Array(a*a).fill(255),c=e=>Math.round(Math.min(t,Math.max(0,e))/t*255),l=e=>-i+(e+.5)*o,u=e[0],d=u.half+jp.beach,f=u.corner+jp.beach;for(let e=0;e<a;e++){let n=Math.abs(l(e))-(d-f);if(!(n-f>=t))for(let r=0;r<a;r++){let i=Math.abs(l(r))-(d-f);if(i-f>=t)continue;let o=i>0?i:0,u=n>0?n:0,p=Math.sqrt(o*o+u*u)+Math.min(Math.max(i,n),0)-f;p<t&&(s[e*a+r]=c(p))}}for(let n of e.slice(1)){let e=Float64Array.from(n.sand.flat()),r=1/0,u=-1/0,d=1/0,f=-1/0;for(let[e,t]of n.sand)r=Math.min(r,e),u=Math.max(u,e),d=Math.min(d,t),f=Math.max(f,t);let p=Math.max(0,Math.floor((r-t+i)/o)),m=Math.min(a-1,Math.ceil((u+t+i)/o)),h=Math.max(0,Math.floor((d-t+i)/o)),g=Math.min(a-1,Math.ceil((f+t+i)/o));for(let t=h;t<=g;t++)for(let n=p;n<=m;n++){let r=l(n),i=l(t),o=c(Vp(e,r,i)?0:Hp(e,r,i)),u=t*a+n;o<s[u]&&(s[u]=o)}}return{data:s,res:a,half:i,maxD:t}}var Wp=Math.PI*2,Gp=[`#b8957a`,`#a07e6a`,`#87695c`,`#6f5650`],Kp=`#7fcf6a`,qp=`#a8795a`,Jp=new kn,Yp=new Z,Xp=new Z,Zp=new an,Qp=new Q,$p=new Z(0,1,0),em=new an,tm=class{pos=[];col=[];tri(e,t,n,r,i){let a=t[0]-e[0],o=t[1]-e[1],s=t[2]-e[2],c=n[0]-e[0],l=n[1]-e[1],u=n[2]-e[2],d=[o*u-s*l,s*c-a*u,a*l-o*c],[f,p]=d[0]*i[0]+d[1]*i[1]+d[2]*i[2]<0?[n,t]:[t,n];Qp.set(r);for(let t of[e,f,p])this.pos.push(t[0],t[1],t[2]),this.col.push(Qp.r,Qp.g,Qp.b)}loft(e,t,n,r){let i=n[0];for(let n=0;n<i.pts.length;n++){let r=i.pts[n],a=i.pts[(n+1)%i.pts.length];this.tri([e,i.y,t],[r[0],i.y,r[1]],[a[0],i.y,a[1]],i.color,[0,1,0])}for(let r=0;r+1<n.length;r++){let i=n[r],a=n[r+1],o=i.pts.length;for(let n=0;n<o;n++){let r=(n+1)%o,s=[i.pts[n][0],i.y,i.pts[n][1]],c=[i.pts[r][0],i.y,i.pts[r][1]],l=[a.pts[n][0],a.y,a.pts[n][1]],u=[a.pts[r][0],a.y,a.pts[r][1]],d=[(s[0]+c[0])/2-e,0,(s[2]+c[2])/2-t];this.tri(s,l,u,i.color,d),this.tri(s,u,c,i.color,d)}}if(r){let i=n[n.length-1],a=i.pts.length,o=[e+r.dx,r.y,t+r.dz];for(let n=0;n<a;n++){let r=(n+1)%a,s=[i.pts[n][0],i.y,i.pts[n][1]],c=[i.pts[r][0],i.y,i.pts[r][1]];this.tri(s,c,o,i.color,[(s[0]+c[0])/2-e,-.6,(s[2]+c[2])/2-t])}}}geometry(){let e=new oi;return e.setAttribute(`position`,new Jr(this.pos,3)),e.setAttribute(`color`,new Jr(this.col,3)),e.computeVertexNormals(),e.computeBoundingSphere(),e}};function nm(e,t){let n=[];return e.forEach((r,i)=>{let a=e[(i+1)%e.length],o=Math.max(1,Math.ceil(Math.hypot(a[0]-r[0],a[1]-r[1])/t));for(let e=0;e<o;e++)n.push([r[0]+(a[0]-r[0])*e/o,r[1]+(a[1]-r[1])*e/o])}),n}var rm=(e,t,n,r,i,a)=>t.map(([t,o])=>{let s=i*(1+e.range(-a,a));return[n+(t-n)*s,r+(o-r)*s]});function im(){let e=new sa(1,8,5),t=e.attributes.position,n=new Float32Array(t.count*3);for(let e=0;e<t.count;e++){let r=t.getY(e);r<-.35&&t.setY(e,-.35);let i=.82+.18*Math.min(1,Math.max(0,(r+.35)/1.35));n.set([i,i,i*1.03],e*3)}return e.setAttribute(`color`,new Jr(n,3)),e.deleteAttribute(`uv`),e.computeVertexNormals(),e}function am(){let e=new sa(2,10,8).toNonIndexed();e.scale(1,1.15,1).translate(0,3.4,0);let t=e.attributes.position,n=new Float32Array(t.count*3);for(let e=0;e<t.count;e+=3){let r=(t.getX(e)+t.getX(e+1)+t.getX(e+2))/3,i=(t.getZ(e)+t.getZ(e+1)+t.getZ(e+2))/3,a=Math.floor((Math.atan2(i,r)+Math.PI)/Wp*10)%2?1:.72;for(let t=0;t<3;t++)n.set([a,a,a],(e+t)*3)}e.setAttribute(`color`,new Jr(n,3)),e.deleteAttribute(`uv`);let r=(e,t)=>{let n=e.toNonIndexed();n.deleteAttribute(`uv`);let r=new Q(t),i=new Float32Array(n.attributes.position.count*3);for(let e=0;e<i.length;e+=3)i.set([r.r,r.g,r.b],e);return n.setAttribute(`color`,new Jr(i,3)),n};return vp([e,r(new ea(1.05,1.3,10,1,!0).rotateX(Math.PI).translate(0,1.15,0),`#e8e2f4`),r(new Qi(.9,.7,.9).translate(0,.1,0),`#9a6b45`)])}function om(){let e=(e,t)=>{let n=e.index?e.toNonIndexed():e;n.deleteAttribute(`uv`);let r=new Q(t),i=new Float32Array(n.attributes.position.count*3);for(let e=0;e<i.length;e+=3)i.set([r.r,r.g,r.b],e);return n.setAttribute(`color`,new Jr(i,3)),n};return vp([e(new sa(2.4,12,8).scale(1,1,3.1),`#eef0ff`),e(new sa(2.42,12,1,0,Wp,Math.PI*.46,Math.PI*.08).scale(1,1,3.1),`#ff6f8a`),e(new Qi(1.3,.9,3.4).translate(0,-2.75,.4),`#7a5a45`),e(new Qi(.15,2.4,2).translate(0,1.6,-6.4),`#ff6f8a`),e(new Qi(2.4,.15,2).translate(0,0,-6.4),`#ff6f8a`)])}function sm({rng:e,plate:t,camDir:n}){let r=new rr,i=[],a=[],o=t/2,s=(e,t)=>(e*n.x+t*n.z)/Math.max(1,Math.hypot(e,t))<.25,c=new tm,l=o+6,u=nm(Pp(0,0,l,l,5,2),13);c.loft(0,0,[{pts:u,y:-.05,color:Kp},{pts:u,y:-.9,color:qp},{pts:rm(e,u,0,0,1,.012),y:-2.2,color:Gp[0]},{pts:rm(e,u,0,0,.995,.02),y:-7,color:Gp[1]},{pts:rm(e,u,0,0,.9,.05),y:-11,color:Gp[2]},{pts:rm(e,u,0,0,.6,.09),y:-21,color:Gp[3]}],{y:-35-o*.1,dx:e.range(-3,3),dz:e.range(-3,3)});let d=[];for(let t=0;t<160&&d.length<6;t++){let t=e.range(0,Wp),n=o+e.range(16,70),r=Math.cos(t)*n,i=Math.sin(t)*n,l=e.range(4.5,8),u=e.range(-6,8);if(!s(r,i)||d.some(e=>Math.hypot(e.x-r,e.z-i)<e.r+l+8))continue;d.push({x:r,z:i,r:l,y:u});let f=Array.from({length:10},()=>l*e.range(.82,1.12)),p=(t,n,a)=>({pts:f.map((a,o)=>{let s=o/10*Wp,c=t*(1+e.range(-n,n));return[r+Math.cos(s)*a*c,i+Math.sin(s)*a*c]}),y:u+a});c.loft(r,i,[{...p(1,0,0),color:Kp},{...p(1,0,-.7),color:qp},{...p(1,.04,-1.5),color:Gp[0]},{...p(.8,.08,-3.6),color:Gp[1]},{...p(.4,.1,-6.4),color:Gp[2]}],{y:u-l*1.6-3,dx:e.range(-.8,.8),dz:e.range(-.8,.8)});let m=l>6.5?4:l>5.5?3:2,h=e.range(0,Wp);for(let t=0;t<m;t++){let n=h+t/m*Wp,o=l*.45;a.push({kind:e.next()<.5?`roundTree`:`coneTree`,x:r+Math.cos(n)*o,y:u,z:i+Math.sin(n)*o,s:e.range(1.3,1.9),r:e.range(0,Wp)})}}let f=c.geometry(),p=new ya({vertexColors:!0,roughness:.9,flatShading:!0}),m=new Ai(f,p);m.name=`sky-island`,m.receiveShadow=!0,r.add(m),i.push(f,p);let h=[],g=(t,n,r,i,a,o)=>{let s=e.range(0,Wp);for(let c=0;c<a;c++){let l=c/a*Wp+e.range(-.4,.4),u=c===0?0:i*e.range(.7,1.05),d=c===0?i:i*e.range(.5,.72);h.push({x:t+Math.cos(l)*u*1.25,y:n-(c===0?0:i-d)*.35,z:r+Math.sin(l)*u,r:d,phase:s,color:o})}},_=[];for(let t=0;t<600&&_.length<20;t++){let t=e.range(0,Wp),n=o+e.range(4,170),r=Math.cos(t)*n,i=Math.sin(t)*n,a=e.range(9,16);_.some(e=>Math.hypot(e.x-r,e.z-i)<(e.R+a)*1.1)||(_.push({x:r,z:i,R:a}),g(r,e.range(-32,-26),i,a,4,e.next()<.8?`#ffffff`:`#eef0ff`))}let v=[];for(let t=0;t<300&&v.length<5;t++){let t=e.range(0,Wp),n=o+e.range(14,110),r=Math.cos(t)*n,i=Math.sin(t)*n,a=e.range(4,7);!s(r,i)||v.some(e=>Math.hypot(e.x-r,e.z-i)<22)||d.some(e=>Math.hypot(e.x-r,e.z-i)<e.r+a*2)||(v.push({x:r,z:i}),g(r,e.range(-4,10),i,a,3,`#ffffff`))}let y=im(),b=new ya({vertexColors:!0,roughness:1,emissive:`#ffffff`,emissiveIntensity:.14}),x=new Hi(y,b,h.length);x.name=`sky-clouds`,h.forEach((e,t)=>x.setColorAt(t,Qp.set(e.color))),r.add(x),i.push(y,b);let S=[];for(let t=0;t<120&&S.length<4;t++){let n=e.range(0,Wp),r=o+e.range(10,55),i=Math.cos(n)*r,a=Math.sin(n)*r;s(i,a)&&!S.some(e=>Math.hypot(e.x-i,e.z-a)<18)&&S.push({x:i,z:a,y:e.range(14,30),s:e.range(1.5,2.1),phase:e.range(0,Wp),speed:e.range(.08,.14),color:[`#ff6f8a`,`#ffd23f`,`#6fd0ff`,`#a98bff`,`#7be08a`][t%5]})}let C=am(),w=new ya({vertexColors:!0,roughness:.75}),T=new Hi(C,w,Math.max(1,S.length));T.name=`sky-balloons`,T.count=S.length,S.forEach((e,t)=>T.setColorAt(t,Qp.set(e.color))),r.add(T),i.push(C,w);let E=om(),D=new ya({vertexColors:!0,roughness:.6}),O=new Ai(E,D);O.name=`sky-airship`,r.add(O),i.push(E,D);let k={cx:-n.x*(o+75),cz:-n.z*(o+75),r:34+o*.15,y:26+o*.06,speed:.045};function A(e){h.forEach((t,n)=>{let r=Math.sin(e*.25+t.phase);x.setMatrixAt(n,Jp.compose(Yp.set(t.x+r*1.2,t.y+r*.3,t.z),em,Xp.set(t.r*1.2,t.r*.62,t.r)))}),x.instanceMatrix.needsUpdate=!0,S.forEach((t,n)=>{let r=e*t.speed+t.phase;Jp.compose(Yp.set(t.x+Math.cos(r)*5,t.y+Math.sin(e*.7+t.phase)*.8,t.z+Math.sin(r)*5),Zp.setFromAxisAngle($p,r*.5),Xp.setScalar(t.s)),T.setMatrixAt(n,Jp)}),T.instanceMatrix.needsUpdate=!0;let t=e*k.speed;O.position.set(k.cx+Math.cos(t)*k.r,k.y+Math.sin(e*.5)*.6,k.cz+Math.sin(t)*k.r),O.rotation.set(0,Math.atan2(-Math.sin(t),Math.cos(t)),Math.sin(e*.4)*.03)}return A(0),{group:r,trees:a,update:A,counts:{islets:d.length,clouds:h.length,balloons:S.length,islandTris:f.attributes.position.count/3},dispose(){for(let e of i)e.dispose?.()}}}var cm=`
uniform sampler2D wtDist;
uniform float wtHalf;
uniform float wtMaxD;
uniform float wtTime;
uniform vec3 wtDeep;
uniform vec3 wtShallow;
uniform vec3 wtFoam;
varying vec3 vWtWorld;
float wtHash( vec2 p ) { p = fract( p * vec2( 123.34, 456.21 ) ); p += dot( p, p + 45.32 ); return fract( p.x * p.y ); }
float wtNoise( vec2 p ) {
  vec2 i = floor( p ), f = fract( p ), u = f * f * ( 3.0 - 2.0 * f );
  return mix( mix( wtHash( i ), wtHash( i + vec2( 1.0, 0.0 ) ), u.x ), mix( wtHash( i + vec2( 0.0, 1.0 ) ), wtHash( i + vec2( 1.0, 1.0 ) ), u.x ), u.y );
}
`,lm=`
#include <color_fragment>
{
  vec2 wp = vWtWorld.xz;
  vec2 uv = wp / ( 2.0 * wtHalf ) + 0.5;
  float d = wtMaxD;                                                  // metres from the nearest beach
  if ( uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0 ) d = texture2D( wtDist, uv ).r * wtMaxD;
  float t = wtTime;
  float wob = wtNoise( wp * 0.22 + vec2( t * 0.15, -t * 0.11 ) ) - 0.5;   // breaks every line up a little
  float dw = d + wob * 1.1;
  float aa = max( fwidth( dw ), 0.02 );

  vec3 col = mix( wtShallow, wtDeep, smoothstep( 0.6, 10.0, dw ) );

  // contact foam: a solid line along the beach
  float contact = 1.0 - smoothstep( 0.9 - aa, 0.9 + aa, dw );

  // waves rolling in: a thin band every 3.4 m, between the contact line and ~8 m out, broken into arcs
  float ph = fract( dw / 3.4 + t * 0.3 );
  float a2 = aa / 3.4;
  float band = 1.0 - smoothstep( 0.06 - a2, 0.06 + a2, abs( ph - 0.5 ) );
  band *= smoothstep( 1.3, 2.3, dw ) * ( 1.0 - smoothstep( 4.5, 8.5, dw ) );
  band *= smoothstep( 0.32, 0.5, wtNoise( wp * 0.12 + vec2( 3.1, -t * 0.05 ) ) );

  // open sea: small, sparse crests - short strokes along the swell, drifting slowly
  vec2 q = wp * vec2( 0.11, 0.3 ) + vec2( t * 0.06, t * 0.02 );
  float n = wtNoise( q ) * wtNoise( q * 1.9 + 7.7 );
  float a3 = max( fwidth( n ), 0.001 );
  float crest = smoothstep( 0.53 - a3, 0.53 + a3, n ) * smoothstep( 6.0, 12.0, dw );
  crest *= 1.0 - smoothstep( 0.12, 0.3, length( fwidth( q ) ) );   // gone where a crest would be a few pixels (no shimmer)

  col = mix( col, wtFoam, max( contact, band * 0.85 ) );
  col = mix( col, wtFoam, crest * 0.22 );
  diffuseColor.rgb = col;
}
`;function um(e,t){let n=new Ni(e.data,e.res,e.res,ve,H);n.magFilter=V,n.minFilter=V,n.wrapS=n.wrapT=R,n.generateMipmaps=!1,n.needsUpdate=!0;let r={wtDist:{value:n},wtHalf:{value:e.half},wtMaxD:{value:e.maxD},wtTime:{value:0},wtDeep:{value:new Q(t.deep)},wtShallow:{value:new Q(t.shallow)},wtFoam:{value:new Q(t.foam)}},i=new ya({color:t.deep,roughness:.7});i.userData.water=r,i.onBeforeCompile=e=>{Object.assign(e.uniforms,r),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWtWorld;`).replace(`#include <project_vertex>`,`#include <project_vertex>
vWtWorld = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${cm}`).replace(`#include <color_fragment>`,lm)},i.customProgramCacheKey=()=>`storm-grid-water`;let a=i.dispose.bind(i);return i.dispose=()=>{n.dispose(),a()},i}var dm=[[0,`#5f6688`],[.3,`#7c83a8`],[.62,`#9fa5c8`],[1,`#b9bed9`]],fm=4900,pm=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)},mm=(e,t,n)=>{let r=Math.max(n-Math.abs(e-t),0)/n;return Math.min(e,t)-r*r*n*.25};function hm(e,t,n){let r=[],i=t*.45,a=(e,t,n,i,a,o)=>{let s={x:e,y:t,z:n,rx:i*a,ry:i*o,rz:i};return r.push(s),s},o=(t,r,o,s,c,l,u,d=.35)=>{let f=[];for(let p=0;p<t;p++){let m=(t===1?0:p/(t-1)*2-1)+e.range(-.25,.25)/t,h=o*(1-.28*m*m)*e.range(.9,1.1);f.push(a(m*i*r,(s-d*Math.abs(m)*s)*e.range(.94,1.06),c+e.range(-.8,.8)*n,h,l,u))}return f};return o(5,1,8.4*n,2.4*n,5*n,1.25,.78,0),o(4,.88,8.6*n,2.8*n,-3*n,1.25,.75,0),o(3,.66,9.6*n,7.4*n,1*n,1.15,.84),o(2,.26,8.4*n,14*n,-1.8*n,1.12,.9),r}function gm(e,t){let n=2*t,r=1*t,i=new Float64Array(e.length*7);return e.forEach((e,t)=>i.set([e.x,e.y,e.z,1/e.rx,1/e.ry,1/e.rz,Math.max(e.rx,e.ry,e.rz)],t*7)),(e,t,a)=>{let o=1/0;for(let r=0;r<i.length;r+=7){let s=e-i[r],c=t-i[r+1],l=a-i[r+2];if(o!==1/0){let e=o+n+i[r+6];if(e>0&&s*s+c*c+l*l>e*e)continue}let u=i[r+3],d=i[r+4],f=i[r+5],p=s*u,m=c*d,h=l*f,g=Math.sqrt(p*p+m*m+h*h),_=Math.sqrt(p*p*u*u+m*m*d*d+h*h*f*f)||1e-6,v=g*(g-1)/_;o=o===1/0?v:mm(o,v,n)}return-mm(-o,t,r)}}function _m(e,t,n,r,i,a){let o=e(t+i,n,r)-e(t-i,n,r),s=e(t,n+i,r)-e(t,n-i,r),c=e(t,n,r+i)-e(t,n,r-i),l=Math.sqrt(o*o+s*s+c*c)||1;return a[0]=o/l,a[1]=s/l,a[2]=c/l,a}function vm(e,t,n){let r=1/0,i=-1/0,a=0,o=1/0,s=-1/0;for(let t of e)r=Math.min(r,t.x-t.rx),i=Math.max(i,t.x+t.rx),a=Math.max(a,t.y+t.ry),o=Math.min(o,t.z-t.rz),s=Math.max(s,t.z+t.rz);let c=2*n,l=r-c,u=-c,d=o-c,f=Math.ceil((i+c-l)/n)+1,p=Math.ceil((a+c-u)/n)+1,m=Math.ceil((s+c-d)/n)+1,h=new Float32Array(f*p*m),g=(e,t,n)=>e+f*(t+p*n);for(let e=0;e<m;e+=2)for(let r=0;r<p;r+=2)for(let i=0;i<f;i+=2)h[g(i,r,e)]=t(l+i*n,u+r*n,d+e*n);let _=2.2*n;for(let e=0;e<m;e++)for(let r=0;r<p;r++)for(let i=0;i<f;i++){if(!(i&1)&&!(r&1)&&!(e&1))continue;let a=h[g(Math.min(i+(i&1),f-1)&-2,Math.min(r+(r&1),p-1)&-2,Math.min(e+(e&1),m-1)&-2)];h[g(i,r,e)]=Math.abs(a)>_?a:t(l+i*n,u+r*n,d+e*n)}let v=new Int32Array(f*p*m).fill(-1),y=[],b=[],x=[0,0,0],S=[0,1,0,1,0,1,0,1],C=[0,0,1,1,0,0,1,1],w=[0,0,0,0,1,1,1,1],T=S.map((e,t)=>e+f*(C[t]+p*w[t])),E=[0,2,4,6,0,1,4,5,0,1,2,3],D=[1,3,5,7,2,3,6,7,4,5,6,7],O=new Float32Array(8);for(let e=0;e+1<m;e++)for(let r=0;r+1<p;r++)for(let i=0;i+1<f;i++){let a=g(i,r,e),o=0;for(let e=0;e<8;e++)O[e]=h[a+T[e]],O[e]<0&&o++;if(o===0||o===8)continue;let s=0,c=0,f=0,p=0;for(let e=0;e<12;e++){let t=E[e],n=D[e];if(O[t]<0==O[n]<0)continue;let r=O[t]/(O[t]-O[n]);s+=S[t]+(S[n]-S[t])*r,c+=C[t]+(C[n]-C[t])*r,f+=w[t]+(w[n]-w[t])*r,p++}let m=l+(i+s/p)*n,_=u+(r+c/p)*n,k=d+(e+f/p)*n,A=t(m,_,k);_m(t,m,_,k,.3*n,x),m-=x[0]*A,_-=x[1]*A,k-=x[2]*A,v[a]=y.length/3,y.push(m,_,k),b.push(x[0],x[1],x[2])}let k=[],A=[[1,0,0],[0,1,0],[0,0,1]];for(let e=1;e+1<m;e++)for(let t=1;t+1<p;t++)for(let n=1;n+1<f;n++){let r=h[g(n,t,e)]<0;for(let i=0;i<3;i++){let[a,o,s]=A[i];if(r===h[g(n+a,t+o,e+s)]<0)continue;let[c,l,u]=A[(i+1)%3],[d,f,p]=A[(i+2)%3],m=v[g(n-c-d,t-l-f,e-u-p)],_=v[g(n-d,t-f,e-p)],y=v[g(n,t,e)],b=v[g(n-c,t-l,e-u)];m<0||_<0||y<0||b<0||(r?k.push(m,_,y,m,y,b):k.push(m,y,_,m,b,y))}}let j=new oi;return j.setAttribute(`position`,new Gr(new Float32Array(y),3)),j.setAttribute(`normal`,new Gr(new Float32Array(b),3)),j.setIndex(k),{geometry:j,top:a}}function ym(e,{center:t,yaw:n,across:r,scale:i,rim:a,glow:o}){let s=i,c=hm(e,r,s),l=gm(c,s),u=1.5*s,d=vm(c,l,u);for(let e=0;e<4&&d.geometry.index.count/3>fm;e++)u*=Math.sqrt(d.geometry.index.count/3/fm)*1.03,d.geometry.dispose(),d=vm(c,l,u);let{geometry:f,top:p}=d,m=f.attributes.position,h=f.attributes.normal,g=m.count,_=dm.map(([e,t])=>[e,new Q(t)]),v=new Float32Array(g*3),y=new Q,b=new Float32Array(m.array),x=new Float32Array(g),S=new Float32Array(g),C=2*s;for(let e=0;e<g;e++){let t=m.getX(e),n=m.getY(e),r=m.getZ(e),i=h.getX(e),a=h.getY(e),o=h.getZ(e),c=Math.min(1,Math.max(0,n/p)),u=1;for(;u<_.length-1&&_[u][0]<c;)u++;y.copy(_[u-1][1]).lerp(_[u][1],Math.min(1,Math.max(0,(c-_[u-1][0])/(_[u][0]-_[u-1][0]))));let d=.62+.38*pm(-.9,.6,a),f=.45+.55*Math.min(1,Math.max(0,l(t+i*C,n+a*C,r+o*C)/C));v.set([y.r*d*f,y.g*d*f,y.b*d*f*1.02],e*3),x[e]=.32*s*pm(.6*s,4*s,n),S[e]=t*.11/s+n*.17/s+r*.07/s}f.setAttribute(`color`,new Gr(v,3)),f.computeBoundingSphere(),f.boundingSphere.radius+=.5*s;let w=jf(new ya({vertexColors:!0,roughness:1,emissive:o,emissiveIntensity:0,envMapIntensity:.3}),{rim:.45,rimPower:2.2,rimColor:a,rimTint:0}),T=new Ai(f,w);T.name=`storm-cloud`,T.position.copy(t),T.rotation.y=n;let E=new rr;E.add(T);let D=-10;function O(e,t=0){let n=m.array,r=h.array;for(let t=0;t<g;t++){let i=x[t]*Math.sin(e*.55+S[t]),a=t*3;n[a]=b[a]+r[a]*i,n[a+1]=b[a+1]+r[a+1]*i,n[a+2]=b[a+2]+r[a+2]*i}m.needsUpdate=!0;let i=t>0?t*(.55+.45*Math.sin(e*37)*Math.sin(e*23)):0,a=Math.max(0,1-(e-D)/.35);w.emissiveIntensity=Math.max(0,i)*.35+a*a*.9}return O(0),{group:E,mesh:T,update:O,flash(e){D=e},dispose(){f.dispose(),w.dispose()}}}var bm=.08,xm=.13,Sm={dressedParks:40,benches:40,lamps:36,bushes:64,fountains:6,walkers:32,cars:18,trees:70},Cm=[`#ff7eb6`,`#ffd23f`,`#ffffff`,`#ff8c5a`,`#b98cff`,`#6fd07a`],wm=[`#ff5a5f`,`#4f8dff`,`#ffd23f`,`#3fd07a`,`#ff9f40`,`#9d6bff`,`#ffffff`,`#2a2f45`],Tm=[`#f6d2b8`,`#e0ac86`,`#b97f5a`,`#8a5a3c`];function Em(e,t,{x:n=0,y:r=0,z:i=0,rx:a=0,rz:o=0}={}){let s=e.index?e.toNonIndexed():e;s.deleteAttribute(`uv`),o&&s.rotateZ(o),a&&s.rotateX(a),s.translate(n,r,i);let c=new Q(t),l=s.attributes.position.count,u=new Float32Array(l*3);for(let e=0;e<l;e++)u.set([c.r,c.g,c.b],e*3);return s.setAttribute(`color`,new Jr(u,3)),s}function Dm(){let e=`#c98a4b`,t=`#3b3f5c`,n=`#dfe1ec`;return{ground:new Qi(1,1,1).translate(0,.5,0),car:vp([Em(new Qi(1.5,.62,3),`#ffffff`,{y:.58}),Em(new Qi(1.24,.52,1.5),`#dfe6ff`,{y:1.15,z:-.2}),Em(new Qi(1.62,.5,.56),`#2a2f45`,{y:.3,z:.95}),Em(new Qi(1.62,.5,.56),`#2a2f45`,{y:.3,z:-.95})]),bench:vp([Em(new Qi(1.6,.1,.5),e,{y:.45}),Em(new Qi(1.6,.42,.09),e,{y:.74,z:-.22}),Em(new Qi(.1,.45,.45),t,{x:-.68,y:.22}),Em(new Qi(.1,.45,.45),t,{x:.68,y:.22})]),lamp:vp([Em(new $i(.07,.1,3.3,5,1,!0),t,{y:1.65}),Em(new ra(.3,0),`#fff4c2`,{y:3.45})]),fountain:vp([Em(new $i(1.75,1.85,.45,14),n,{y:.22}),Em(new $i(1.48,1.48,.06,14),`#79c9ff`,{y:.46}),Em(new $i(.2,.28,1,6),n,{y:.9}),Em(new $i(.62,.32,.22,10),n,{y:1.4}),Em(new $i(.02,.2,.55,6),`#d4f0ff`,{y:1.78})]),bush:Em(new ra(.62,0),`#ffffff`,{y:.45}),body:vp([Em(new $i(.17,.2,.5,6),`#3a3f5c`,{y:.25}),Em(new $i(.24,.3,.62,7),`#ffffff`,{y:.8})]),head:Em(new sa(.22,7,5),`#ffffff`,{y:1.33})}}var Om=new kn,km=new Z,Am=new Z,jm=new an,Mm=new Q,Nm=new Z(0,1,0),Pm=new an;function Fm({city:e,bs:t,rng:n,W:r,base:i,pitch:a,lanes:o,camDir:s}){let c=Dm(),l=[...Object.values(c)],u=new rr,d=r.park??`#86cf63`,f=new Q(r.pad).lerp(new Q(`#b7b2c6`),.3).getStyle(),p=[],m=[],h=[],g=[],_=[],v=[],y=[],b=e=>({hw:Math.min(7.6,e.w*1.1)/2+.35,hd:Math.min(7.6,e.d*1.1)/2+.35}),x=(e,n,r)=>!t.some(t=>{let i=b(t);return Math.abs(t.x-e)<i.hw+r&&Math.abs(t.z-n)<i.hd+r}),S=(e,t,r)=>m.length<Sm.trees&&x(e,t,r*1.1)&&m.push({kind:n.next()<.6?`roundTree`:`coneTree`,x:e,z:t,s:r,r:n.range(0,6.28)}),C=(e,t)=>v.length<Sm.bushes&&x(e,t,.7)&&v.push({x:e,z:t,s:n.range(.75,1.15),r:n.range(0,6.28),color:Cm[Math.floor(n.next()*Cm.length)]}),w=(e,t,n)=>h.length<Sm.benches&&x(e,t,.9)&&h.push({x:e,z:t,r:n}),T=(e,t)=>g.length<Sm.lamps&&x(e,t,.45)&&g.push({x:e,z:t}),E=[];for(let n of e.districts){let e=Math.max(1,Math.round(n.w/a)),r=Math.max(1,Math.round(n.d/a)),i=n.w/e;for(let a=0;a<r;a++)for(let o=0;o<e;o++){let e=n.x-n.w/2+(o+.5)*i,c=n.z-n.d/2+(a+.5)*(n.d/r);t.some(t=>{let n=b(t);return Math.abs(t.x-e)<i/2+n.hw-1&&Math.abs(t.z-c)<i/2+n.hd-1})||E.push({x:e,z:c,cell:i,front:e*s.x+c*s.z})}}E.sort((e,t)=>t.front-e.front);let D=0;for(let{x:e,z:t,cell:a}of E){let o=a;if(p.push({x:e,z:t,w:o,d:o,y:i,h:bm,color:d}),D>=Sm.dressedParks){S(e+n.range(-1.5,1.5),t+n.range(-1.5,1.5),n.range(1.6,2.1)),C(e+n.range(-3,3),t+n.range(-3,3));continue}D++;let s=_.length<Sm.fountains&&n.next()<.3?`fountain`:n.next()<.6?`grove`:`pond`,c=n.next()<.5,l=i+xm,u=n=>p.push(n?{x:e,z:t,w:o,d:1.5,y:i,h:xm,color:f}:{x:e,z:t,w:1.5,d:o,y:i,h:xm,color:f}),m=o*.3;if(s===`fountain`){u(!0),u(!1),_.push({x:e,z:t}),w(e-m,t-m,Math.PI/4),w(e+m,t+m,Math.PI+Math.PI/4),S(e+m,t-m,n.range(1.5,1.9)),S(e-m,t+m,n.range(1.5,1.9));for(let[n,r]of[[-1,-1],[1,1]])C(e+n*(m+1.6),t+r*(m-1.2));T(e+o*.42,t+o*.42),y.push({ax:e-o*.45,az:t,bx:e-2.1,bz:t,y:l})}else if(s===`grove`){u(c);let r=c?[[0,1],[0,-1]]:[[1,0],[-1,0]];S(e-m+n.range(-.4,.4),t+(c?m:-m),n.range(1.6,2.2)),S(e+m+n.range(-.4,.4),t+(c?-m:m),n.range(1.6,2.2));let[i,a]=r[0];w(e+i*1.35+(c?-1.2:0),t+a*1.35+(c?0:-1.2),c?Math.PI:-Math.PI/2),C(e+m,t+(c?m:-m)),C(e-m,t+(c?-m:m)),C(e+m*1.2,t+(c?m*.4:-m*.4)),T(e+(c?o*.1:1.2),t+(c?1.2:o*.1)),y.push(c?{ax:e-o*.45,az:t,bx:e+o*.45,bz:t,y:l}:{ax:e,az:t-o*.45,bx:e,bz:t+o*.45,y:l})}else{u(c);let a=e+(c?0:2.35),s=t+(c?2.35:0);p.push({x:a,z:s,w:c?4.2:2.8,d:c?2.8:4.2,y:i,h:xm,color:r.water?.shallow??`#6fc3f0`}),C(a+(c?2.4:.9),s+(c?.9:2.4)),C(a-(c?2.4:.9),s-(c?.9:2.4)),S(e+-m,t+(c?-m:m),n.range(1.6,2.1)),w(e+(c?m:-1.3),t+(c?-1.3:m),c?0:Math.PI/2),T(e-(c?o*.35:1.2),t-(c?1.2:o*.35))}}let O=[];for(let n of e.districts)for(let[e,r]of[[0,1],[0,-1],[1,0],[-1,0]]){let i=r!==0,a=i?n.w:n.d,o=i?n.z+r*(n.d/2+.42):n.x+e*(n.w/2+.42),s=(i?n.x:n.z)-a/2,c=s+a,l=[];for(let e of t){let t=b(e);(i?Math.abs(e.z-o)<t.hd+.3:Math.abs(e.x-o)<t.hw+.3)&&l.push(i?[e.x-t.hw,e.x+t.hw]:[e.z-t.hd,e.z+t.hd])}l.sort((e,t)=>e[0]-t[0]);let u=s;for(let[t,n]of[...l,[c,c]])t-u>=5&&O.push({alongX:i,c:o,a:u+.6,b:t-.6,nx:e,nz:r}),u=Math.max(u,n)}for(let e of O)for(let t=e.a+2;t<e.b-1&&g.length<Sm.lamps;t+=13)n.next()<.55&&T(e.alongX?t:e.c,e.alongX?e.c:t);let k=O.filter(e=>e.b-e.a>=6);for(let e=0;e<k.length*2&&y.length<Sm.walkers;e++){let e=k[Math.floor(n.next()*k.length)];y.push(e.alongX?{ax:e.a,az:e.c,bx:e.b,bz:e.c,y:i}:{ax:e.c,az:e.a,bx:e.c,bz:e.b,y:i})}for(let e of y)e.len=Math.hypot(e.bx-e.ax,e.bz-e.az),e.speed=n.range(1,1.5),e.phase=n.range(0,1e3),e.shirt=wm[Math.floor(n.next()*wm.length)],e.skin=Tm[Math.floor(n.next()*Tm.length)],e.scale=n.range(1.2,1.38);let A=[],j=[],M=o.avenue-1.6,N=M>=5.2,P=e=>e.forEach((t,n)=>{let r=n===0||n===e.length-1;N||r?j.push(0,0):j.push(0)});P(o.lx),P(o.lz);for(let e=0;e<j.length&&A.length<Sm.cars;e++){let e=j.length*2<=Sm.cars?2:1;for(let t=0;t<e&&A.length<Sm.cars;t++)n.range(5.5,7.5),A.push({seed:n.range(0,1)+t*.5,color:wm[Math.floor(n.next()*6)]})}let F=o.lx,ee=o.lz,I=F.length,L=ee.length,R={speed:6.5,scale:Math.min(1.35,(M-.3)/1.5),lane:1.45,turn:3,accel:8,brake:30};R.len=3*R.scale,R.stop=R.lane+.81*R.scale+R.len/2+.6,R.clear=R.len+2,R.follow=R.len+1.5;let te=new Map,z=e=>N||e===0||e===I-1,ne=e=>N||e===0||e===L-1,B=e=>e%2?1:-1,V=(e,t)=>{let n=[];for(let r of[1,-1])t+r>=0&&t+r<L&&(z(e)||r===B(e))&&n.push([0,r]);for(let r of[1,-1])e+r>=0&&e+r<I&&(ne(t)||r===B(t))&&n.push([r,0]);return n},re=(e,t,n)=>n[0]===0?[z(e)?-n[1]*R.lane:0,0]:[0,ne(t)?n[0]*R.lane:0],ie=(e,t,n,r)=>{let i=re(e,t,n),a=R.turn,o=F[e]+i[0],s=ee[t]+i[1];if(n[0]!==r[0]||n[1]!==r[1]){let n=re(e,t,r);o+=n[0],s+=n[1]}return{p0:[o-n[0]*a,s-n[1]*a],c:[o,s],p2:[o+r[0]*a,s+r[1]*a]}},H=(e,t,n,r)=>{let i=V(t,n).filter(e=>e[0]!==-r[0]||e[1]!==-r[1]),a=i.map(e=>e[0]===r[0]&&e[1]===r[1]?2:1),o=e.rand()*a.reduce((e,t)=>e+t,0);for(let e=0;e<i.length;e++)if((o-=a[e])<0)return i[e];return i[i.length-1]??[-r[0],-r[1]]},ae=(e,t)=>Math.hypot(t[0]-e[0],t[1]-e[1]),U=(e,t,n,r,i)=>{let a=t+r[0],o=n+r[1],s=H(e,a,o,r),c=ie(a,o,r,s);Object.assign(e,{ti:a,tj:o,m:r,next:s,cv:c,kind:`run`,a:i,b:c.p0,s:0}),e.len=Math.max(.001,ae(i,c.p0));let l=R.turn-((c.c[0]-F[a])*r[0]+(c.c[1]-ee[o])*r[1]);e.gate=Math.min(e.len,Math.max(.5,R.stop-l))},W=e=>{e.freeAfter&&te.get(e.freeAfter)===e&&te.delete(e.freeAfter),e.freeAfter=null},oe=e=>{if(e.kind===`run`){W(e);let{p0:t,c:n,p2:r}=e.cv;e.kind=`turn`,e.s=0,e.len=Math.max(.001,(2*ae(t,r)+ae(t,n)+ae(n,r))/3)}else W(e),e.freeAfter=e.hold,e.hold=null,U(e,e.ti,e.tj,e.next,e.cv.p2)},se=(e,t)=>{let n=Math.min(1,e.s/e.len);if(e.kind===`run`)return t.x=e.a[0]+(e.b[0]-e.a[0])*n,t.z=e.a[1]+(e.b[1]-e.a[1])*n,t.dx=e.m[0],t.dz=e.m[1],t;let{p0:r,c:i,p2:a}=e.cv,o=1-n;t.x=o*o*r[0]+2*o*n*i[0]+n*n*a[0],t.z=o*o*r[1]+2*o*n*i[1]+n*n*a[1];let s=o*(i[0]-r[0])+n*(a[0]-i[0]),c=o*(i[1]-r[1])+n*(a[1]-i[1]),l=Math.hypot(s,c)||1;return t.dx=s/l,t.dz=c/l,t};I>=2&&L>=2?A.forEach(e=>{let t=Math.floor(e.seed*1e9)>>>0;e.rand=()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296};let n=Math.floor(e.rand()*I),r=Math.floor(e.rand()*L),i=V(n,r);for(let t=0;!i.length&&t<20;t++)n=Math.floor(e.rand()*I),r=Math.floor(e.rand()*L),i=V(n,r);let a=i[Math.floor(e.rand()*i.length)]??[1,0],o=re(n,r,a);U(e,n,r,a,[F[n]+o[0]+a[0]*R.turn,ee[r]+o[1]+a[1]*R.turn]),e.s=e.rand()*Math.max(0,e.len-e.gate-1),e.v=R.speed,e.hold=null,e.freeAfter=null,e.pos=se(e,{});for(let t=0;t<40&&A.some(t=>t!==e&&t.pos&&Math.hypot(t.pos.x-e.pos.x,t.pos.z-e.pos.z)<R.follow+1);t++){let t=Math.floor(e.rand()*I),n=Math.floor(e.rand()*L),r=V(t,n);if(!r.length)continue;let i=r[Math.floor(e.rand()*r.length)],a=re(t,n,i);U(e,t,n,i,[F[t]+a[0]+i[0]*R.turn,ee[n]+a[1]+i[1]*R.turn]),e.s=e.rand()*Math.max(0,e.len-e.gate-1),e.pos=se(e,{})}}):A.length=0;let ce=(e={})=>{let t=new ya({vertexColors:!0,roughness:.85,...e});return l.push(t),t},le=(e,t,n,r,i,a=!1)=>{if(!t.length)return null;let o=new Hi(e,a?(()=>{let e=new ya({roughness:.9});return l.push(e),e})():ce(),t.length);return o.name=n,o.receiveShadow=!0,t.forEach((e,t)=>{r(e),o.setMatrixAt(t,Om),i&&o.setColorAt(t,Mm.set(i(e)))}),u.add(o),o};le(c.ground,p,`park-ground`,e=>Om.compose(km.set(e.x,e.y,e.z),Pm,Am.set(e.w,e.h,e.d)),e=>e.color,!0),le(c.bench,h,`benches`,e=>Om.compose(km.set(e.x,i,e.z),jm.setFromAxisAngle(Nm,e.r),Am.setScalar(1))),le(c.lamp,g,`lamps`,e=>Om.compose(km.set(e.x,i,e.z),Pm,Am.setScalar(1))),le(c.fountain,_,`fountains`,e=>Om.compose(km.set(e.x,i,e.z),Pm,Am.setScalar(1))),le(c.bush,v,`flower-bushes`,e=>Om.compose(km.set(e.x,i,e.z),jm.setFromAxisAngle(Nm,e.r),Am.set(e.s,e.s*.8,e.s)),e=>e.color);let G=le(c.body,y,`people`,()=>Om.identity(),e=>e.shirt),K=le(c.head,y,`people-heads`,()=>Om.identity(),e=>e.skin),ue=A.length?new Hi(c.car,ce({roughness:.45}),A.length):null;ue&&(ue.name=`cars`,A.forEach((e,t)=>ue.setColorAt(t,Mm.set(e.color))),u.add(ue));let de=0;function fe(e){if(G&&(y.forEach((t,n)=>{let r=(t.phase+e*t.speed)/t.len%2,i=r<1?r:2-r,a=r<1?1:-1,o=t.ax+(t.bx-t.ax)*i,s=t.az+(t.bz-t.az)*i,c=Math.atan2((t.bx-t.ax)*a,(t.bz-t.az)*a),l=e*t.speed*5+t.phase;jm.setFromAxisAngle(Nm,c),Om.compose(km.set(o,t.y+Math.abs(Math.sin(l))*.07,s),jm,Am.setScalar(t.scale)),G.setMatrixAt(n,Om),K.setMatrixAt(n,Om)}),G.instanceMatrix.needsUpdate=!0,K.instanceMatrix.needsUpdate=!0),ue){let t=Math.min(.1,Math.max(0,e-de));de=e;for(let e of A){let t=e.pos;e.blocked=A.some(n=>{if(n===e)return!1;let r=n.pos.x-t.x,i=n.pos.z-t.z,a=r*t.dx+i*t.dz;return a>0&&a<R.follow&&Math.abs(r*t.dz-i*t.dx)<R.len*.5&&n.pos.dx*t.dx+n.pos.dz*t.dz>.3})}A.forEach((e,n)=>{e.v=e.blocked?Math.max(0,e.v-R.brake*t):Math.min(R.speed,e.v+R.accel*t);let r=e.v*t;if(e.kind===`run`&&!e.hold&&e.s+r>=e.len-e.gate){let t=`${e.ti},${e.tj}`,n=te.get(t);!n||n===e?(te.set(t,e),e.hold=t):(r=Math.max(0,e.len-e.gate-e.s),e.v=0)}e.s+=r;for(let t=0;e.s>=e.len&&t<8;t++)e.s-=e.len,oe(e);e.freeAfter&&e.kind===`run`&&e.s>=R.clear&&W(e);let i=se(e,e.pos);ue.setMatrixAt(n,Om.compose(km.set(i.x,.1,i.z),jm.setFromAxisAngle(Nm,Math.atan2(i.dx,i.dz)),Am.setScalar(R.scale)))}),ue.instanceMatrix.needsUpdate=!0}}return fe(0),{group:u,trees:m,update:fe,layers:p.map(e=>({x:e.x,z:e.z,w:e.w,d:e.d,top:e.y+e.h,color:e.color})),counts:{parks:D,lawns:p.length,benches:h.length,lamps:g.length,bushes:v.length,fountains:_.length,walkers:y.length,cars:A.length},dispose(){for(let e of l)e.dispose?.()}}}var Im=Math.PI*2,Lm={field:.07,pond:.09,road:.15,row:.17,dash:.21},Rm={meadow:{fields:.6,rows:.25,hills:12,mesas:0,groves:5,pines:.35,rocks:14,roads:!0,crops:[`#e8c65a`,`#a6d86a`,`#5fae4f`,`#c99a62`,`#8fcf5f`],hill:[`#6cbd58`,`#88cc62`,`#5aa857`],rock:`#a7a3b8`},farm:{fields:.85,rows:.6,hills:9,mesas:0,groves:3,pines:.2,rocks:8,roads:!0,windmills:2,crops:[`#e9c75a`,`#f0d77a`,`#a9cf5a`,`#7dbb4c`,`#c79a5e`,`#d4b06a`],hill:[`#9cc35a`,`#86b44f`,`#b0cc66`],rock:`#b3a497`},hills:{fields:.25,rows:.2,hills:18,hillScale:1.5,mesas:0,groves:8,pines:.75,rocks:14,roads:!0,crops:[`#a6d86a`,`#e8c65a`,`#5fae4f`],hill:[`#5fae55`,`#77c160`,`#4f9c50`],rock:`#9a9fb4`},snow:{fields:0,rows:0,hills:13,peaks:!0,mesas:0,groves:8,pines:1,rocks:18,ponds:3,roads:!0,crops:[],hill:[`#8f9ab6`,`#a3acc6`,`#7f89a6`],cap:`#f6f9ff`,rock:`#8c95ad`},desert:{fields:0,rows:0,hills:16,dunes:!0,mesas:8,groves:0,pines:0,rocks:16,cacti:30,roads:!0,crops:[],hill:[`#efcf93`,`#e6c084`,`#f3d9a3`],rock:`#c08a63`},sky:{fields:0,rows:0,hills:0,mesas:0,groves:0,pines:0,rocks:0,roads:!1,crops:[],hill:[],rock:`#ffffff`},sea:{fields:0,rows:0,hills:0,mesas:0,groves:0,pines:0,rocks:0,boats:5,roads:!1,crops:[],hill:[],rock:`#ffffff`}};function zm(e,t,{x:n=0,y:r=0,z:i=0,rx:a=0,rz:o=0}={}){let s=e.index?e.toNonIndexed():e;s.deleteAttribute(`uv`),o&&s.rotateZ(o),a&&s.rotateX(a),s.translate(n,r,i);let c=new Q(t),l=s.attributes.position.count,u=new Float32Array(l*3);for(let e=0;e<l;e++)u.set([c.r,c.g,c.b],e*3);return s.setAttribute(`color`,new Jr(u,3)),s}var Bm=new kn,Vm=new Z,Hm=new Z,Um=new an,Wm=new Q,Gm=new Z(0,1,0),Km=new Z(0,0,1),qm=new an,Jm=new an;function Ym({W:e,rng:t,plate:n,camDir:r,lanes:i}){let a=Rm[e.scenery??`meadow`]??Rm.meadow,o=new rr,s=[],c=[],l=n/2,u=(e,t)=>(e*r.x+t*r.z)/Math.max(1,Math.hypot(e,t))<.2,d=(e,t,n)=>Math.abs(e)>l+n||Math.abs(t)>l+n,f=e=>e[Math.floor(t.next()*e.length)],p=[],m=(e,t,n)=>p.every(r=>Math.hypot(r.x-e,r.z-t)>r.r+n),h=[],g=[];if(a.roads&&i.lx.length&&i.lz.length){let t=e=>e[Math.floor(e.length/2)];g.push({alongX:!0,c:t(i.lz),from:-l-280,to:-l}),g.push({alongX:!1,c:t(i.lx),from:-l-280,to:-l});for(let t of g){let n=t.to-t.from,r=(t.to+t.from)/2;h.push(t.alongX?{x:r,z:t.c,w:n,d:6.5,h:Lm.road,color:e.asphalt}:{x:t.c,z:r,w:6.5,d:n,h:Lm.road,color:e.asphalt});for(let n=t.from+2;n<t.to-2;n+=6)h.push(t.alongX?{x:n,z:t.c,w:2.2,d:.35,h:Lm.dash,color:e.dash}:{x:t.c,z:n,w:.35,d:2.2,h:Lm.dash,color:e.dash})}}let _=(e,t,n)=>g.some(r=>r.alongX?Math.abs(t-r.c)<3.25+n&&e<r.to+n:Math.abs(e-r.c)<3.25+n&&t<r.to+n);if(a.fields>0){let e=l+80;for(let n=-e;n<e;n+=17)for(let r=-e;r<e;r+=17){let i=n+17/2,o=r+17/2;if(!d(i,o,12.5)||Math.hypot(i,o)>e||_(i,o,17/2)||t.next()>a.fields)continue;let s=17-t.range(1.6,3),c=17-t.range(1.6,3),u=f(a.crops);if(h.push({x:i,z:o,w:s,d:c,h:Lm.field,color:u}),t.next()<a.rows&&Math.hypot(i,o)<l+45){let e=new Q(u).multiplyScalar(.82).getStyle(),n=t.next()<.5;for(let t=-2;t<=2;t++)h.push(n?{x:i,z:o+t*c*.18,w:s*.9,d:c*.07,h:Lm.row,color:e}:{x:i+t*s*.18,z:o,w:s*.07,d:c*.9,h:Lm.row,color:e})}}}for(let e=0;e<(a.ponds??0);e++)for(let e=0;e<20;e++){let e=t.range(0,Im),n=l+t.range(14,60),r=Math.cos(e)*n,i=Math.sin(e)*n;if(d(r,i,10)&&!_(r,i,8)){h.push({x:r,z:i,w:t.range(10,18),d:t.range(7,12),h:Lm.pond,color:`#bfe4f7`});break}}let v=[],y=[],b=a.hillScale??1;for(let e=0;e<400&&v.length+y.length/2<a.hills;e++){let e=t.range(0,Im),n=Math.cos(e),r=Math.sin(e);if(a.peaks){let e=t.range(18,34),i=l+t.range(70,200),o=n*i,s=r*i;if(!u(o,s)||!d(o,s,e+6)||_(o,s,e)||!m(o,s,e*.7))continue;p.push({x:o,z:s,r:e*.7});let c=e*t.range(.9,1.4),h=t.range(0,Im),g=t.range(.85,1.2);y.push({x:o,z:s,r:e,h:c,rot:h,sx:g,color:f(a.hill),y:-.5}),y.push({x:o,z:s,r:e*.48,h:c*.47,rot:h,sx:g,color:a.cap,y:-.5+c*.56});continue}let i=l+t.range(45,190),o=n*i,s=r*i,c=t.range(14,30)*b,h=a.dunes?c*t.range(.12,.18):c*t.range(.35,.7);u(o,s)&&d(o,s,c+6)&&!_(o,s,c)&&m(o,s,c*.7)&&(p.push({x:o,z:s,r:c*.7}),v.push({x:o,z:s,r:c,h,rot:t.range(0,Im),sx:a.dunes?t.range(1.3,1.8):t.range(.85,1.25),color:f(a.hill),y:-h*(a.dunes?.3:.18)}))}let x=[];for(let e=0;e<300&&x.length<(a.mesas??0);e++){let e=t.range(0,Im),n=l+t.range(40,160),r=Math.cos(e)*n,i=Math.sin(e)*n,a=t.range(10,20);u(r,i)&&d(r,i,a+4)&&!_(r,i,a)&&m(r,i,a)&&(p.push({x:r,z:i,r:a}),x.push({x:r,z:i,r:a,h:t.range(12,24),rot:t.range(0,Im)}))}let S=[];for(let e=0;e<200&&S.length<(a.windmills??0);e++){let e=t.range(0,Im),n=l+t.range(22,60),i=Math.cos(e)*n,a=Math.sin(e)*n;u(i,a)&&d(i,a,8)&&!_(i,a,6)&&m(i,a,6)&&(p.push({x:i,z:a,r:5}),S.push({x:i,z:a,face:Math.atan2(r.x,r.z)+t.range(-.5,.5),speed:t.range(.6,.9),phase:t.range(0,Im)}))}for(let e=0;e<a.groves;e++)for(let e=0;e<40;e++){let e=t.range(0,Im),n=l+t.range(14,80),r=Math.cos(e)*n,i=Math.sin(e)*n;if(!u(r,i)||!d(r,i,9)||_(r,i,9)||!m(r,i,9))continue;p.push({x:r,z:i,r:7});let o=4+Math.floor(t.next()*5);for(let e=0;e<o&&c.length<50;e++){let e=r+t.range(-7,7),n=i+t.range(-7,7);d(e,n,3)&&!_(e,n,2)&&c.push({kind:t.next()<a.pines?`coneTree`:`roundTree`,x:e,z:n,s:t.range(1.7,2.7),r:t.range(0,Im)})}break}for(let e=0;e<200&&c.length<64&&a.groves>0;e++){let e=t.range(0,Im),n=l+t.range(8,110),r=Math.cos(e)*n,i=Math.sin(e)*n;u(r,i)&&d(r,i,4)&&!_(r,i,3)&&m(r,i,2)&&c.push({kind:t.next()<a.pines?`coneTree`:`roundTree`,x:r,z:i,s:t.range(1.8,2.8),r:t.range(0,Im)})}let C=[];for(let e=0;e<400&&C.length<(a.cacti??0);e++){let e=t.range(0,Im),n=l+t.range(6,90),r=Math.cos(e)*n,i=Math.sin(e)*n;d(r,i,4)&&!_(r,i,2)&&m(r,i,2)&&C.push({x:r,z:i,s:t.range(1.6,2.6),r:t.range(0,Im)})}let w=[];for(let e=0;e<300&&w.length<a.rocks;e++){let e=t.range(0,Im),n=l+t.range(5,70),r=Math.cos(e)*n,i=Math.sin(e)*n;d(r,i,3)&&!_(r,i,2)&&m(r,i,2)&&w.push({x:r,z:i,s:t.range(.7,2.2),r:t.range(0,Im)})}let T=[],E=l+8+3+3.5;for(let e=0;e<(a.boats??0);e++)T.push({s0:t.range(0,1),speed:t.range(2.2,3.4)*(e%2?1:-1),off:t.range(-1.2,1.2),sail:f([`#ffffff`,`#ff7e8a`,`#ffd23f`,`#7fd0ff`])});let D=e=>{let t=new ya({roughness:.9,...e});return s.push(t),t},O=(e,t,n,r,i,a={})=>{if(!t.length)return e.dispose(),null;s.push(e);let c=new Hi(e,D(a),t.length);return c.name=n,c.receiveShadow=!0,t.forEach((e,t)=>{r(e),c.setMatrixAt(t,Bm),i&&c.setColorAt(t,Wm.set(i(e)))}),o.add(c),c};O(new Qi(1,1,1).translate(0,.5,0),h,`scenery-ground`,e=>Bm.compose(Vm.set(e.x,-.05,e.z),qm,Hm.set(e.w,e.h,e.d)),e=>e.color),O(new ra(1,1),v,`scenery-hills`,e=>Bm.compose(Vm.set(e.x,e.y,e.z),Um.setFromAxisAngle(Gm,e.rot),Hm.set(e.r*e.sx,e.h,e.r)),e=>e.color,{flatShading:!0}),O(new ea(1,1,7,1).translate(0,.5,0),y,`scenery-mountains`,e=>Bm.compose(Vm.set(e.x,e.y,e.z),Um.setFromAxisAngle(Gm,e.rot),Hm.set(e.r*e.sx,e.h,e.r)),e=>e.color,{flatShading:!0}),O(vp([zm(new $i(.88,1,.82,7),`#c9774f`,{y:.41}),zm(new $i(.86,.88,.06,7),`#e9a46e`,{y:.85}),zm(new $i(.66,.86,.14,7),`#d98a5c`,{y:.95})]),x,`scenery-mesas`,e=>Bm.compose(Vm.set(e.x,0,e.z),Um.setFromAxisAngle(Gm,e.rot),Hm.set(e.r,e.h,e.r)),null,{vertexColors:!0,flatShading:!0}),O(vp([zm(new $i(.32,.38,3,6),`#4f9f55`,{y:1.5}),zm(new $i(.2,.22,1.1,5,1,!0),`#4f9f55`,{x:.62,y:1.1,rz:Math.PI/2}),zm(new $i(.2,.22,1,5),`#5aab5c`,{x:1.15,y:1.55}),zm(new $i(.18,.2,.8,5,1,!0),`#4f9f55`,{x:-.5,y:1.7,rz:Math.PI/2}),zm(new $i(.18,.2,.8,5),`#5aab5c`,{x:-.92,y:2.05})]),C,`scenery-cacti`,e=>Bm.compose(Vm.set(e.x,0,e.z),Um.setFromAxisAngle(Gm,e.r),Hm.setScalar(e.s)),null,{vertexColors:!0}),O(new na(1,0),w,`scenery-rocks`,e=>Bm.compose(Vm.set(e.x,e.s*.25,e.z),Um.setFromAxisAngle(Gm,e.r),Hm.set(e.s*1.2,e.s*.7,e.s)),()=>a.rock,{flatShading:!0});let k=O(vp([zm(new $i(1.1,1.7,7,8),`#f4efe6`,{y:3.5}),zm(new ea(1.45,2.2,8),`#c75b4b`,{y:8.1}),zm(new Qi(.9,1.4,.2),`#7a5a45`,{y:.7,z:1.55})]),S,`scenery-windmills`,e=>Bm.compose(Vm.set(e.x,0,e.z),Um.setFromAxisAngle(Gm,e.face),Hm.setScalar(1)),null,{vertexColors:!0}),A=O(vp([0,1,2,3].map(e=>{let t=zm(new Qi(.55,4.4,.08),`#fffaf0`,{y:2.4});return t.rotateZ(e*Math.PI/2),t})),S,`scenery-windmill-blades`,()=>Bm.identity(),null,{vertexColors:!0}),j=O(vp([zm(new Qi(1.5,.6,3.6),`#8a5a3c`,{y:.15}),zm(new Qi(1.2,.12,3.2),`#e9d3a8`,{y:.5}),zm(new $i(.06,.07,3.4,4),`#5b4636`,{y:2.1,z:.2}),zm(new ea(1.1,2.9,3),`#ffffff`,{y:2.2,z:-.25})]),T,`scenery-boats`,()=>Bm.identity(),e=>e.sail,{vertexColors:!0,roughness:.7});k&&(k.castShadow=!1);let M=E-9,N=M*2,P=N+Math.PI/2*9,F=P*4;function ee(e,t){e=(e%F+F)%F;let n=Math.floor(e/P),r=e-n*P,i,a,o,s;if(r<N)i=E,a=-M+r,o=0,s=1;else{let e=(r-N)/9;i=M+Math.cos(e)*9,a=M+Math.sin(e)*9,o=-Math.sin(e),s=Math.cos(e)}for(let e=0;e<n;e++)[i,a]=[-a,i],[o,s]=[-s,o];return t.x=i,t.z=a,t.hx=o,t.hz=s,t}let I={x:0,z:0,hx:0,hz:1};function L(e){A&&(S.forEach((t,n)=>{Um.setFromAxisAngle(Gm,t.face).multiply(Jm.setFromAxisAngle(Km,e*t.speed+t.phase)),Bm.compose(Vm.set(t.x+Math.sin(t.face)*1.75,6.6,t.z+Math.cos(t.face)*1.75),Um,Hm.setScalar(1)),A.setMatrixAt(n,Bm)}),A.instanceMatrix.needsUpdate=!0),j&&(T.forEach((t,n)=>{ee(t.s0*F+e*t.speed,I);let r=Math.sign(t.speed),i=Math.atan2(I.hx*r,I.hz*r),a=I.hz,o=-I.hx;Um.setFromAxisAngle(Gm,i),Bm.compose(Vm.set(I.x+a*t.off,-1+Math.sin(e*1.6+n)*.08,I.z+o*t.off),Um,Hm.setScalar(1.25)),j.setMatrixAt(n,Bm)}),j.instanceMatrix.needsUpdate=!0)}L(0);let R=e.scenery===`sky`?sm({rng:t,plate:n,camDir:r}):null;return R&&(o.add(R.group),c.push(...R.trees)),{group:o,trees:c,update(e){L(e),R?.update(e)},layers:h.map(e=>({x:e.x,z:e.z,w:e.w,d:e.d,top:-.05+e.h,color:e.color})),peaks:y,counts:{flat:h.length,mounds:v.length,peaks:y.length,mesas:x.length,mills:S.length,trees:c.length,cacti:C.length,rocks:w.length,boats:T.length,sky:R?.counts},dispose(){for(let e of s)e.dispose?.();R?.dispose()}}}var Xm=new kn,Zm=new Z,Qm=new an,$m=new Z,eh=new Q,th=new Q,nh=new Z(0,1,0),rh=new an,ih=.35,ah=.45,oh=.22,sh=.55,ch=n.city.maxVisual,lh=n.city.visualGrow,uh=n.city.capOverhang,dh=class{group=new rr;city=null;top=0;cloudY=0;#e=[];#t;#n=[];#r=-1;#i;#a;#o;constructor(e){this.#t=e,e.add(this.group)}#s(e){return this.#e.push(e),e}clear(){for(let e of this.#e)e.dispose?.();this.#e=[],this.group.clear(),this.city=null,this.water=null,this.life=null,this.scenery=null}build(e,t,r,i){this.clear(),this.city=e,this.theme=r;let a=r.world,o=e.buildings,s=o.length,c=tu(`${t}:look:${e.level}`),l=e.plan,u=n.city.heightMin,d=Math.max(u+1,l?.heightMax??u+12);this.#i=new Float32Array(s),this.#a=new Float32Array(s).fill(-2),this.#o=new Uint8Array(s),this.#n=e.districts.map(()=>-1),this.#r=-1,this.litColor=[],this.kind=[];let f=[],p=[],m=[],h=[],g=[],_=[];this.parts=o.map(()=>({segs:[],trims:[],roof:-1,roofKind:``,pole:-1,tip:-1}));for(let e of o){let t=Math.min(1,Math.max(0,(e.h-u)/(d-u))),n=e.seed*7.13%1,i=e.seed*13.7%1,a=e.roof===`spire`?`spire`:e.roof===`stepped`?`stepped`:`flat`;a===`flat`&&(a=t<.2&&n<.65?`house`:t>.5&&n>.55?`dome`:n<.3?`box`:`flat`),this.kind[e.id]=a,this.litColor[e.id]=new Q(r.lit[Math.floor(i*r.lit.length)%r.lit.length]);let o=Math.min(ch,e.w*lh),s=Math.min(ch,e.d*lh),c=e.h-ih,l=+(n>.5),v=this.parts[e.id],y;if(a===`stepped`){let t=Math.round(c*.7),n=o*.64,r=s*.64;v.segs.push(f.length),f.push([e.x,ih,e.z,o,t,s,0,l,e.id]),v.trims.push(p.length),p.push([e.x,ih+t,e.z,o+.5,.4,s+.5,e.id]),v.segs.push(f.length),f.push([e.x,ih+t,e.z,n,c-t,r,t,l,e.id]),v.trims.push(p.length),p.push([e.x,e.h,e.z,n+.6,sh,r+.6,e.id]),y=e.h+sh}else if(v.segs.push(f.length),f.push([e.x,ih,e.z,o,c,s,0,l,e.id]),a===`house`){v.roof=g.length,v.roofKind=`pyramid`;let t=Math.min(o,s)*.74,n=Math.min(2.4,t*.8);g.push([e.x,e.h,e.z,t,n,e.id]),y=e.h+n}else if(v.trims.push(p.length),p.push([e.x,e.h,e.z,o+uh,sh,s+uh,e.id]),y=e.h+sh,a===`dome`){let t=Math.min(1.9,Math.min(o,s)*.36);v.roof=m.length,v.roofKind=`dome`,m.push([e.x,y,e.z,t,e.id]),y+=t}else if(a===`spire`){let t=Math.min(o,s)*.3;v.roof=h.length,v.roofKind=`spire`,h.push([e.x,y,e.z,t,2.1,e.id]),y+=2.1}else a===`box`&&(v.trims.push(p.length),p.push([e.x+o*.18*(i<.5?1:-1),y,e.z-s*.15,o*.34,1.1,s*.3,e.id]));v.pole=_.length,_.push([e.x,Math.min(y,e.tipY-.4),e.z,e.tipY,e.gold,e.id])}let v=this.#s(wp(.1)),y=new Pi(new Float32Array(f.length*4),4).setUsage(_t),b=new Pi(new Float32Array(f.length*3),3);v.setAttribute(`aState`,y),v.setAttribute(`aLitColor`,b);let x=this.#s(Dp({unlit:a.unlit,unlitWindow:a.unlitWin,unlitTop:a.trim})),S=s<=120,C=new Hi(v,x,f.length);C.name=`buildings`,C.castShadow=!0,C.receiveShadow=!0,f.forEach(([e,t,n,r,i,a,o,s,c],l)=>{C.setMatrixAt(l,Xm.compose(Zm.set(e,t,n),rh,$m.set(r,i,a))),y.array.set([0,o,0,s],l*4);let u=this.litColor[c];b.array.set([u.r,u.g,u.b],l*3)}),C.computeBoundingSphere(),this.bodies=C,this.aState=y,this.segs=f,this.group.add(C);let w=this.#s(Op()),T=new Hi(this.#s(wp(.14)),w,Math.max(1,p.length));T.name=`roof-caps`,T.castShadow=S,T.receiveShadow=!0,p.forEach(([e,t,n,r,i,o],s)=>{T.setMatrixAt(s,Xm.compose(Zm.set(e,t,n),rh,$m.set(r,i,o))),T.setColorAt(s,eh.set(a.trim))}),T.count=p.length,T.instanceColor&&T.instanceColor.setUsage(_t),this.trims=T,this.group.add(T);let E=(e,t,n,r)=>{let i=new Hi(this.#s(e),w,Math.max(1,t.length));return i.name=n,i.castShadow=S,t.forEach((e,t)=>{r(e),i.setMatrixAt(t,Xm),i.setColorAt(t,eh.set(a.trim))}),i.count=t.length,i.instanceColor&&i.instanceColor.setUsage(_t),this.group.add(i),i};this.domes=E(new sa(1,10,4,0,Math.PI*2,0,Math.PI/2),m,`roof-domes`,([e,t,n,r])=>Xm.compose(Zm.set(e,t,n),rh,$m.set(r,r*.95,r))),this.spires=E(new ea(1,1,8,1).translate(0,.5,0),h,`roof-spires`,([e,t,n,r,i])=>Xm.compose(Zm.set(e,t,n),rh,$m.set(r,i,r))),this.pyramids=E(new ea(1,1,4,1).rotateY(Math.PI/4).translate(0,.5,0),g,`roof-pyramids`,([e,t,n,r,i])=>Xm.compose(Zm.set(e,t,n),rh,$m.set(r,i,r)));let D=new Hi(this.#s(new $i(.14,.2,1,4,1,!0).translate(0,.5,0)),this.#s(Op({roughness:.4})),s);D.name=`rods`;let O=new Hi(this.#s(new ia(.62,0)),this.#s(new ya({color:16777215,roughness:.3,emissive:16777215,emissiveIntensity:.15})),s);if(O.name=`rod-tips`,_.forEach(([e,t,n,r,i],a)=>{let o=i?1.6:1;D.setMatrixAt(a,Xm.compose(Zm.set(e,t,n),rh,$m.set(o,Math.max(.3,r-t),o))),D.setColorAt(a,eh.set(i?Bd.gold:Bd.pole)),O.setMatrixAt(a,Xm.compose(Zm.set(e,r,n),rh,$m.setScalar(i?1.5:1))),O.setColorAt(a,eh.set(i?Bd.gold:Bd.tipDark))}),O.instanceColor.setUsage(_t),this.poles=D,this.tips=O,this.group.add(D,O),i)for(let e of o)e.gold&&i.sprites.glow(e.x,e.tipY,e.z,{color:Bd.goldGlow,size:3.2,life:1/0,intensity:1.6,pulse:1.1});let k=Math.max(e.width,e.depth),A=new Ai(this.#s(new aa(k*14+400,k*14+400)),this.#s(new ya({color:a.field,roughness:.95})));A.rotation.x=-Math.PI/2,A.position.y=a.water?-1:a.scenery===`sky`?-70:-.05,A.receiveShadow=a.scenery!==`sky`,A.name=`field`;let j=l?.avenue??6,M=new Ai(this.#s(wp(.02)),this.#s(new ya({color:a.asphalt,roughness:.9})));M.scale.set(e.width+j*2+6,.12,e.depth+j*2+6),M.position.y=-.02,M.receiveShadow=!0,M.name=`asphalt`;let N=new Hi(this.#s(wp(.06)),this.#s(Op({roughness:.85})),e.districts.length);N.name=`districts`,N.receiveShadow=!0,e.districts.forEach((e,t)=>{N.setMatrixAt(t,Xm.compose(Zm.set(e.x,.08,e.z),rh,$m.set(e.w+1.6,.26999999999999996,e.d+1.6))),N.setColorAt(t,eh.set(a.pad))}),N.instanceColor.setUsage(_t),this.pads=N,this.group.add(A,M,N);let P=e.grid.xs,F=e.grid.zs,ee=e=>{let t=[];for(let n=0;n<e.length-1;n++)t.push((e[n].c+e[n].w/2+e[n+1].c-e[n+1].w/2)/2);return e.length&&(t.unshift(e[0].c-e[0].w/2-j/2-1.5),t.push(e.at(-1).c+e.at(-1).w/2+j/2+1.5)),t},I=ee(P),L=ee(F),R=[],te=(e,t)=>t.every(t=>Math.abs(e-t.c)>t.w/2+1.2),z=k/2+j;for(let e of I)for(let t=-z;t<z;t+=4.2)te(t,F)&&R.push([e,t,0]);for(let e of L)for(let t=-z;t<z;t+=4.2)te(t,P)&&R.push([t,e,1]);let ne=new Hi(this.#s(new aa(1,1).rotateX(-Math.PI/2)),this.#s(new ya({color:a.dash,roughness:.8,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4})),Math.max(1,R.length));ne.name=`lane-dashes`,ne.receiveShadow=!0,R.forEach(([e,t,n],r)=>ne.setMatrixAt(r,Xm.compose(Zm.set(e,.085,t),rh,n?$m.set(2.2,1,.35):$m.set(.35,1,2.2)))),ne.count=R.length,this.group.add(ne);let B=Cp();for(let e of Object.values(B))this.#s(e);let V=n.city.lotPitch,re=[],ie=[],H=35*Math.PI/180,ae=Math.sin(H),U=Math.cos(H);if(this.life=this.#s(Fm({city:e,bs:o,rng:c,W:a,base:ih,pitch:V,lanes:{lx:I,lz:L,span:z,avenue:j},camDir:{x:ae,z:U}})),this.group.add(this.life.group),re.push(...this.life.trees),this.scenery=this.#s(Ym({W:a,rng:c,plate:e.width+j*2+6,camDir:{x:ae,z:U},lanes:{lx:I,lz:L}})),this.group.add(this.scenery.group),a.water){let{isles:t,trees:n}=Rp({rng:c,plate:e.width+j*2+6,vx:ae,vz:U});for(let e of Bp(t,a.water))this.#s(e.geometry),this.#s(e.material),this.group.add(e);A.material=this.#s(um(Up(t),{deep:a.field,shallow:a.water.shallow,foam:a.water.foam})),this.water=A.material.userData.water,ie.push(...n)}else ie.push(...this.scenery.trees);let W=(e,t,n,r,i=0)=>{let o=e.filter(e=>e.kind===t);if(!o.length)return;let s=new Hi(B[t],this.#s(new ya({vertexColors:!0,roughness:t===`car`?.45:.85})),o.length);s.name=r,s.castShadow=n,s.receiveShadow=t!==`car`,o.forEach((e,n)=>{s.setMatrixAt(n,Xm.compose(Zm.set(e.x,t===`car`?.1:e.y??i,e.z),Qm.setFromAxisAngle(nh,e.r),$m.setScalar(e.s))),s.setColorAt(n,eh.set(t===`car`?[`#ff5a5f`,`#ffd23f`,`#4f8dff`,`#ffffff`,`#ff9f40`][n%5]:a.trees[n%a.trees.length]))}),this.group.add(s)};W(re,`roundTree`,S,`park-trees`,ih),W(re,`coneTree`,S,`park-pines`,ih),W(ie,`roundTree`,!1,`ring-trees`),W(ie,`coneTree`,!1,`ring-pines`);let oe=0;for(let e of o)oe=Math.max(oe,e.tipY);this.top=oe;let se=Math.min(1,k/58);this.cloudY=oe+16*se;let ce=35*Math.PI/180,le=k*.5+14*se,G=-Math.sin(ce)*le,K=-Math.cos(ce)*le;this.cloudCenter=new Z(G,this.cloudY,K),this.cloud=this.#s(ym(c,{center:this.cloudCenter,yaw:ce,across:Math.max(40,k*1.1),scale:Math.max(1,k/60),rim:`#ffe0ec`,glow:Bd.cloudGlow})),this.cloudGroup=this.cloud.group,this.group.add(this.cloudGroup),this.cloudBase=this.cloudCenter.clone()}setCloudYaw(e){this.cloudGroup&&(this.cloudGroup.rotation.y=e,this.cloudCenter.copy(this.cloudBase).applyAxisAngle(nh,e))}setCloudOver(e,t){if(!this.cloudGroup)return;Zm.copy(this.cloudBase).applyAxisAngle(nh,this.cloudGroup.rotation.y);let n=t*t*(3-2*t);this.cloudGroup.position.set(-Zm.x*n,(e-Zm.y)*n,-Zm.z*n),this.cloudCenter.copy(Zm).add(this.cloudGroup.position)}flashCloud(e){this.cloud?.flash(e)}strikeOrigin(e,t){let n=this.cloudCenter;return t.x=n.x+(e.x-n.x)*.18,t.y=n.y-5,t.z=n.z+(e.z-n.z)*.18,t}districtWave(e,t){this.#n[e]!==void 0&&(this.#n[e]=t)}sweep(e){this.#r=e}update(e,t,n,r=0,i=!1){if(!this.city)return;this.water&&(this.water.wtTime.value=t);let a=this.city.buildings,o=this.theme.world,s=this.parts,c=this.aState.array,l=!1,u=!1,d=this.#i;d.fill(0);let f=!1;for(let e=0;e<this.#n.length;e++){let n=this.#n[e];if(n<0)continue;let r=this.city.districts[e],i=t-n;if(i>2){this.#n[e]=-2;continue}f=!0;let s=Math.min(1,i/.6);this.pads.setColorAt(e,eh.set(o.pad).lerp(th.set(o.padLit),s)),u=!0;for(let e of r.members){let t=a[e],n=i-Math.hypot(t.x-r.x,t.z-r.z)/(r.w*.7)*.45;n>0&&n<.35&&(d[e]=Math.max(d[e],.55*(1-n/.35)))}}if(this.#r>=0){let e=t-this.#r,n=Math.max(this.city.width,this.city.depth)*.75;if(e>2.2)this.#r=-1;else{f=!0;for(let t of a){let r=e-Math.hypot(t.x,t.z)/n*1.2;r>0&&r<.6&&(d[t.id]=Math.max(d[t.id],.9*(1-r/.6)))}}}for(let t=0;t<a.length;t++){let n=a[t],r=e.litAt[t];if(r!==this.#a[t]&&(this.#a[t]=r,this.#o[t]=0),this.#o[t]&&d[t]===0)continue;let i=0,f=0;if(r>=0){let n=Math.max(0,e.t-r),a=Math.min(1,n/ah);i=1-(1-a)*(1-a),f=Math.max(0,1-n/oh),a>=1&&f===0&&d[t]===0&&(this.#o[t]=1)}else d[t]===0&&(this.#o[t]=1);let p=Math.min(1,f*.6+d[t]*.8),m=s[t],h=i*(n.h-ih+.8);for(let e of m.segs)c[e*4]=h,c[e*4+2]=p;l=!0;let g=Math.max(0,Math.min(1,(i-.8)/.2)),_=this.litColor[t];eh.set(o.trim).lerp(th.copy(_).lerp(fh,.4),g).lerp(fh,p*.6);for(let e of m.trims)this.trims.setColorAt(e,eh);if(m.roof>=0){let e=m.roofKind===`dome`?this.domes:m.roofKind===`spire`?this.spires:this.pyramids;eh.set(o.trim).lerp(_,g).lerp(fh,p*.6),e.setColorAt(m.roof,eh),e.instanceColor.needsUpdate=!0}n.gold||this.tips.setColorAt(m.pole,eh.set(r>=0?Bd.tipLit:Bd.tipDark).lerp(fh,p)),u=!0}if(l&&(this.aState.needsUpdate=!0),u&&(this.trims.instanceColor&&(this.trims.instanceColor.needsUpdate=!0),this.tips.instanceColor.needsUpdate=!0,this.pads.instanceColor.needsUpdate=!0),!f)for(let t=0;t<this.#n.length;t++)e.districtDone[t]&&this.#n[t]===-1&&(this.pads.setColorAt(t,eh.set(o.padLit)),this.pads.instanceColor.needsUpdate=!0,this.#n[t]=-2);this.cloud.update(t,i?Math.min(1,r):0),this.life?.update(t),this.scenery?.update(t)}dispose(){this.clear()}},fh=new Q(1,1,1),ph=2.4,mh=new Z,hh=new Z,gh=new Z,_h=new Z,vh=new Z,yh={x:0,y:0,visible:!1},bh={x:0,y:0,visible:!1},xh={x:0,z:0},Sh=[0,2,4,7,9,12,14,16,19,21,24],Ch=5,wh=.2,Th=(e,t,n)=>e+(t-e)*n,Eh=Math.PI/180,Dh={landscape:{camH:.28,lookH:.8,dist:1.6,fov:40,side:.4},portrait:{camH:.25,lookH:.95,dist:2,fov:50,side:0},square:{camH:.25,lookH:1.02,dist:1.8,fov:45,side:0}},Oh={top:`#150a3e`,bottom:`#3a1a6e`,horizon:`#ff4fb8`,horizonAt:.72,horizonWidth:.12,glow:`#5a6aff`,glowAt:[.72,.72],glowSize:.3,glow2:`#ff3fc8`,glow2At:[.12,.6],glow2Size:.45,vignette:.6,stars:.35,fog:`#3a2a6e`,fogNear:120,fogFar:420,hemiSky:`#8f9cf0`,hemiGround:`#3a2a5a`,hemi:.85,key:`#ffd6c0`,keyIntensity:1.6,rim:`#6fe8ff`,rimIntensity:1.6,env:[`#3a50b0`,`#f0a890`,`#3a3050`],envPanels:[`#ffffff`,`#ffd0a0`,`#a0b8ff`],envPanelIntensity:.5,envIntensity:.5},kh={landscape:{fov:45,pitch:38,yaw:35,mx:.92,ylo:-.84,yhi:.62},portrait:{fov:55,pitch:48,yaw:15,mx:.95,ylo:-.74,yhi:.66}},Ah=35*Eh,jh=class{constructor(e,{audio:t,ui:n,loop:r}){this.stage=e,this.audio=t,this.ui=n,this.loop=r,this.look=mp(e,{backdrop:Ud(Vd[0]),toneMapping:`neutral`,exposure:1.08,shadowsStatic:!0,shadowArea:60,keyDir:[-.75,.62,.5],rimDir:[.2,.6,-1],bloom:{strength:.6,radius:.25,threshold:2.2}}),this.look.key.shadow.radius=5;let i=N.of(e.renderer);i&&i.subscribe(e=>this.look.setQuality(e)),typeof location<`u`&&new URLSearchParams(location.search).get(`qa`)===`1`&&(window.__GS_LOOK__=this.look,window.__GS_VIEW__=this),this.cityMesh=new dh(e.scene),this.fx=new Kf(e.scene,{unit:ph,sprites:1400,ribbons:30,outline:{color:Bd.boltOutline,alpha:.55}});let a=typeof document<`u`?document.getElementById(`ui`):null;this.pops=a?qf(a,{max:8}):null,this.shake=new Wd({maxOffset:4,maxRoll:0,decay:1.4}),this.time=0,this.boltHex=Bd.boltGlow,this.boltColor=new Q(Bd.boltGlow),this.yaw=Ah,this.camLook=new Z,this.camPos=new Z(0,80,80),this.follow=new Z,this.followW=0,this.punch=0,this.orbitT=0,this.cloudHeld=!1,this.cloudOver=0,this.fit={key:``,dist:100,ty:0,shift:0,side:0,fov:45,pitch:38*Eh,yaw:Ah},this.floats={n:0,pending:0,at:-9,x:0,y:0,z:0},this.forkShown=1,this.lastHum=0,this.lastCue=0,this.aim={index:-1,visible:!1},this.chargeView={x:0,y:0,charge:0,lo:0,hi:0,band:``},this.cameraOverride=null,this.safe=null,this.fxScale=1;let o=new oa(.86,1.1,40);o.rotateX(-Math.PI/2),this.marker=new Ai(o,new vi({color:16777215,transparent:!0,opacity:.9,depthWrite:!1})),this.marker.name=`aim-marker`,this.marker.renderOrder=6,this.marker.visible=!1,e.scene.add(this.marker)}setCameraOverride(e){this.cameraOverride=e}setSafeArea(e){let t=e=>Math.round(Math.max(0,e||0)/8)*8;this.safe=e?{top:t(e.top),bottom:t(e.bottom),left:t(e.left),right:t(e.right)}:null}build(e){let t=Hd(e.city);this.theme=t,this.look.setBackdrop(Ud(t)),this.fx.clear(),this.cityMesh.build(e.city,e.seed,t,this.fx);let n=Math.max(e.city.width,e.city.depth)*.62+14;this.look.setFocus(0,0,0,n),this.look.refreshShadows(),this.shake.trauma=0,this.followW=0,this.forkShown=1,this.orbitT=0,this.cloudHeld=!1,this.cloudOver=0,this.floats.n=0,this.floats.pending=0,this.fit.key=``,this.pops?.clear(),this.snapCamera(e)}recolor(e){this.boltHex=e||Bd.boltGlow,this.boltColor.set(this.boltHex)}coverShot(e,t){let n=e.city.buildings,r=this.cityMesh,i=Math.max(e.city.width,e.city.depth);e.t+=3;for(let t=0;t<n.length;t++)(!(e.litAt[t]>=0)||e.t-e.litAt[t]<1.5)&&(e.litAt[t]=e.t-3);let a=Dh[t]??Dh.landscape,o=35*Eh,s=Math.sin(o),c=Math.cos(o),l=Math.cos(o),u=-Math.sin(o),d=0,f=-1/0;n.forEach((e,t)=>{let n=e.x*s+e.z*c,r=e.x*l+e.z*u,a=e.tipY+n*.2-(n<i*.3||Math.abs(r)>i*.25?1e6:0);a>f&&(f=a,d=t)});let p=n[d],m=p.tipY,h=m*a.dist,g=m*a.side;this.setCameraOverride({pos:[p.x+s*h,m*a.camH,p.z+c*h],look:[p.x-l*g,m*a.lookH,p.z-u*g],fov:a.fov}),r.cloudGroup.visible=!1,this.stage.scene.traverse(e=>{(e.name===`sky-balloons`||e.name===`sky-airship`)&&(e.visible=!1)}),this.look.setBackdrop(Oh);let _=this.look.bloomPass;_&&Object.assign(_,{strength:.45,radius:.3,threshold:2});let v=this.boltHex,y=1e6;this.fx.clear(),gh.set(p.x-s*m*.11+l*m*.09,m*2.55,p.z-c*m*.11+u*m*.09),mh.set(p.x,m,p.z),this.fx.bolt(gh,mh,{color:v,width:6,forks:4,forkLength:.3,arc:0,jag:.1,life:y,intensity:2,core:4,beads:3,fromHalo:!1}),this.fx.glow(mh,{color:v,size:4,grow:1,life:y,intensity:2.2});let b=n.map((e,t)=>[t,Math.hypot(e.x-p.x,e.z-p.z)]).filter(([e,t])=>e!==d&&t>3).sort((e,t)=>e[1]-t[1]).slice(0,4);for(let[e]of b){let t=n[e];hh.set(t.x,t.tipY,t.z),this.fx.bolt(mh,hh,{color:v,width:3,forks:1,forkLength:.3,arc:1.6,jag:.12,life:y,intensity:1.6,core:3.4,beads:2,fromHalo:!1,haloSize:2}),this.fx.glow(hh,{color:v,size:2,grow:1,life:y,intensity:2})}}toScreen(e,t,n,r={x:0,y:0,visible:!1}){return _h.set(e,t,n).project(this.stage.camera),r.x=(_h.x*.5+.5)*this.stage.size.width,r.y=(-_h.y*.5+.5)*this.stage.size.height,r.visible=_h.z>-1&&_h.z<1&&Math.abs(_h.x)<1.05&&Math.abs(_h.y)<1.05,r}screenToGround(e,t,n){let r=this.stage.camera;if(_h.set(e/this.stage.size.width*2-1,-(t/this.stage.size.height)*2+1,.5).unproject(r),vh.copy(_h).sub(r.position),Math.abs(vh.y)<1e-6)return!1;let i=-r.position.y/vh.y;return i<0?!1:(n.x=r.position.x+vh.x*i,n.z=r.position.z+vh.z*i,!0)}pick(e,t,r){let i=-1,a=1/0;for(let n of e.city.buildings){this.toScreen(n.x,n.tipY,n.z,yh);let e=(yh.x-t)**2+(yh.y-r)**2;e<a&&(a=e,i=n.id)}if(a<=n.input.snapPx**2)return i;if(this.screenToGround(t,r,xh)){let t=yu(e,xh.x,xh.z,!0);if(t>=0)return t}return i}stepAim(e,t,n,r){let i=e.city.buildings;if(t<0||t>=i.length)return this.pick(e,this.stage.size.width/2,this.stage.size.height/2);let a=i[t];this.toScreen(a.x,a.tipY,a.z,bh);let o=Math.hypot(n,r)||1,s=t,c=1/0;for(let e of i){if(e.id===t)continue;this.toScreen(e.x,e.tipY,e.z,yh);let i=yh.x-bh.x,a=yh.y-bh.y,l=Math.hypot(i,a)||1,u=(i*n+a*r)/(l*o);if(u<.5)continue;let d=l*(1+2.5*(1-u));d<c&&(c=d,s=e.id)}return s}snapCamera(e){this.#l(e,0,!0)}update(e,t,n){let r=n*this.fxScale;this.time+=r,this.#e(e),this.cityMesh.update(e,this.time,this.stage.camera.quaternion,e.charge,e.holding),this.shake.update(r),this.#i(!1),this.#a(e),this.#l(e,r,!1),this.#o(e),this.#s(e),this.#n(e),this.fx.update(r,this.stage.camera)}#e(e){let t=e.city.buildings,n=this.fx,r=this.boltHex;for(let i of e.events)switch(i.type){case`chargeStart`:this.audio.play(`charge`,{pitch:1}),this.lastHum=this.time;break;case`band`:if(i.band===`super`){this.audio.play(`ding`);let e=this.aim.index>=0?t[this.aim.index]:null;e&&n.impact(mh.set(e.x,e.tipY,e.z),{color:Bd.super,size:2.2,sparks:14,sparkSize:.18,ringDrop:3})}else this.audio.play(`buzz`);break;case`strike`:{let e=t[i.target],a=i.band===`fizzle`,o=i.band===`super`;this.cityMesh.strikeOrigin(e,gh),this.cityMesh.flashCloud(this.time),mh.set(e.x,e.tipY,e.z),n.strike(gh,mh,{color:o?Bd.super:r,width:a?.9:o?3.2:2.6,forks:a?0:o?3:2,forkLength:.25,arc:0,jag:.09,life:.55,intensity:1.5,core:3.2,haloSize:a?1.4:o?3:2.4,sparks:a?8:34,sparkSize:.2,ringDrop:3,beads:3}),o&&n.bolt(gh,mh,{color:r,width:1.8,forks:1,jag:.14,life:.5,fromHalo:!1,beads:0}),this.shake.add(a?.08:o?.18:.13),this.shake.trauma=Math.min(.32,this.shake.trauma),this.punch=a?0:.12,a||this.loop.freeze(60),this.audio.play(`thunder`,{pitch:o?1.1:a?.7:.9}),this.forkShown=i.bolts>1?2:1,this.floats.n=0,this.floats.pending=0,this.follow.set(e.x,e.tipY,e.z);let s=this.toScreen(e.x,e.tipY+4,e.z,yh);o?this.#t(s.x,s.y-40,I(`supercharge`),`gold`):a&&(this.#t(s.x,s.y-40,I(`fizzle`),`bad`),this.audio.play(`fizzle`));break}case`hop`:{let e=t[i.from],a=t[i.to],o=Math.min(4,i.gen);mh.set(e.x,e.tipY,e.z),hh.set(a.x,a.tipY,a.z),n.bolt(mh,hh,{color:r,width:2.1+o*.12,forks:1,forkLength:.3,arc:1.4,jag:.12,life:.6,intensity:1.5,core:3.2,beads:2,fromHalo:!1,haloSize:2}),n.glow(hh,{color:r,size:2.6,grow:1.5,life:.4,intensity:2.2}),n.sparks(hh,{count:6,color:Bd.spark,speed:5,up:3,size:.18,life:.45});let s=Sh[Math.min(Sh.length-1,Math.max(0,i.depth-1))];this.audio.play(`crackle`,{pitch:2**(s/12)*(.97+Math.random()*.06),minGap:.03,maxVoices:6,volume:.8});break}case`light`:{let e=t[i.b];i.gold&&(mh.set(e.x,e.tipY,e.z),n.impact(mh,{color:Bd.gold,size:3.4,sparks:26,sparkSize:.22,ringDrop:3}),n.coinBurst(mh,{count:8,speed:3,size:.7,life:1.4}),this.audio.play(`gold`)),this.#r(e,i.value,i.gold);break}case`fork`:{let e=t[i.at];if(n.glow(mh.set(e.x,e.tipY,e.z),{color:`#ffffff`,size:2.4,grow:1.4,life:.3,intensity:2.4}),i.bolts>=this.forkShown*2){this.forkShown=2**Math.floor(Math.log2(i.bolts));let t=this.toScreen(e.x,e.tipY+6,e.z,yh);t.visible&&this.#t(t.x,t.y-30,I(`fork_x`,{n:this.forkShown}),`merge`);let n=Math.min(Sh.length-1,Math.floor(Math.log2(i.bolts))+1);this.audio.play(`fork`,{pitch:2**(Sh[n]/12),minGap:.05})}break}case`boltEnd`:{let e=t[i.at];i.grounded&&(mh.set(e.x,e.tipY,e.z),hh.set(e.x+3,.4,e.z+2),n.bolt(mh,hh,{color:r,width:.25,forks:0,arc:0,life:.25,beads:0,fromHalo:!1}),n.sparks(hh,{count:5,color:r,speed:3,up:2,size:.16,life:.35}));break}case`district`:{this.#i(!0);let t=e.city.districts[i.d];this.cityMesh.districtWave(i.d,this.time),n.ring(mh.set(t.x,.6,t.z),{color:Bd.super,from:.5,to:t.w*.5/ph,life:.7,thickness:.1,intensity:1.3,normal:[0,1,0]}),this.ui.showWorld(I(`block_powered`),`+${i.bonus}`),this.audio.play(`district`),this.shake.add(.1),this.shake.trauma=Math.min(.3,this.shake.trauma);break}case`cascadeEnd`:{this.#i(!0);let e=this.toScreen(this.follow.x,this.cityMesh.top*.8,this.follow.z,yh),t=e.visible?e.x:this.stage.size.width/2,n=e.visible?e.y-40:this.stage.size.height*.3,r=Math.min(this.stage.size.width*.8,Math.max(this.stage.size.width*.2,t)),a=Math.max(this.stage.size.height*.24,n);i.hops>=6&&(this.pops?this.pops.combo(r,a,I(`chain_x`,{n:i.hops}),{size:.85,duration:1300}):this.#t(r,a,I(`chain_x`,{n:i.hops}),`gold`)),i.value>0&&i.hops>=Ch&&(this.pops?this.pops.pop(r,a+46,`+${i.value}`,{kind:`gold`,size:.9,duration:1200}):this.#t(r,a+44,`+${i.value}`,`merge`));break}case`runEnd`:this.orbitT=0,i.share>=1?(this.cityMesh.sweep(this.time),[...t].sort((e,t)=>t.tipY-e.tipY).slice(0,5).forEach((e,t)=>{mh.set(e.x,e.tipY+14+t*3,e.z);let r=this.theme?.lit[t%this.theme.lit.length]??Bd.gold;n.sparks(mh,{count:30,colors:[r,`#ffffff`,Bd.gold],speed:9,up:0,size:.3,life:1.3,gravity:2.5,stretch:.03}),n.glow(mh,{color:r,size:5,grow:1.6,life:.5,intensity:2}),n.sparks(hh.set(e.x,e.tipY,e.z),{count:10,color:Bd.gold,speed:5,up:6,size:.22,life:.9})}),this.audio.play(`powerSweep`),this.audio.play(`fanfare`,{volume:.9})):this.audio.play(i.phase===`won`?`win`:`fail`,{pitch:i.phase===`won`?1:.9});break;case`extraStrike`:this.audio.play(`charge`,{pitch:1.4})}e.events.length=0}#t(e,t,n,r){let i=this.stage.size.width,a=this.stage.size.height;this.ui.floatText(Math.min(i*.9,Math.max(i*.1,e)),Math.min(a*.86,Math.max(a*.2,t)),n,r)}#n(e){let t=this.aim.index>=0?e.city.buildings[this.aim.index]:null;if(!t||!e.holding||e.phase!==`run`||this.time-this.lastCue<.14)return;let n=bu(e,e.charge);(n===`super`||n===`over`)&&(this.lastCue=this.time,mh.set(t.x,t.tipY,t.z),n===`super`?(this.fx.glow(mh,{color:Bd.super,size:3.4,grow:1.3,life:.22,intensity:2.2}),this.fx.ring(hh.set(t.x,t.h+.8,t.z),{color:Bd.super,from:.6,to:Math.max(t.w,t.d)/ph,life:.3,thickness:.25,intensity:1.6,normal:[0,1,0]})):this.fx.sparks(mh,{count:6,color:Bd.over,speed:4,up:3,size:.2,life:.35}))}#r(e,t,n){let r=this.floats;if(r.n++,r.n<=Ch||n){let r=this.toScreen(e.x,e.tipY+3,e.z,yh);r.visible&&this.#t(r.x,r.y,`+${t}`,n?`gold`:`good`);return}r.pending+=t,r.x=e.x,r.y=e.tipY,r.z=e.z}#i(e){let t=this.floats;if(t.pending<=0||!e&&this.time-t.at<wh)return;let n=this.toScreen(t.x,t.y+3,t.z,yh);n.visible&&this.#t(n.x,n.y,`+${t.pending}`,t.pending>=20?`gold`:`good`),t.pending=0,t.at=this.time}#a(e){if(!e.holding||this.time-this.lastHum<.11)return;this.lastHum=this.time;let t=Math.min(1,e.charge);this.audio.play(`hum`,{pitch:1+t,volume:.3+.5*t,maxVoices:2})}#o(e){let t=this.aim,n=t.index>=0?e.city.buildings[t.index]:null,r=!!n&&t.visible&&(e.phase===`ready`||e.phase===`run`);if(this.marker.visible=r,!r)return;let i=e.holding?e.charge:0,a=e.holding?bu(e,i):`weak`,o=(Math.max(n.w,n.d)*.62+1)*(e.holding?1.25-Math.min(1,i)*.45:1+Math.sin(this.time*4)*.06);this.marker.position.set(n.x,n.h+.4,n.z),this.marker.scale.set(o,1,o),this.marker.material.color.set(a===`over`?Bd.over:a===`super`?Bd.super:`#ffffff`),this.marker.material.opacity=e.holding?1:.65}#s(e){let t=this.aim,n=t.index>=0?e.city.buildings[t.index]:null;if(!n||!e.holding||e.phase!==`run`){this.ui.setCharge(null);return}let r=this.toScreen(n.x,n.tipY,n.z,yh),i=e.params,a=this.chargeView;a.x=r.x,a.y=r.y,a.charge=e.charge,a.lo=i.bandLo,a.hi=i.bandHi,a.band=bu(e,e.charge),this.ui.setCharge(a)}#c(e,t,n){let r=t?kh.portrait:kh.landscape,i=e.city,a=this.safe,o=`${this.stage.size.width}x${this.stage.size.height}:${i.level}:${e.seed}:${a?`${a.top},${a.bottom},${a.left},${a.right}`:``}`;if(this.fit.key===o)return this.fit;let s=this.stage.size.width||1,c=this.stage.size.height||1,l=Math.max(-r.mx,a?-1+2*a.left/s:-1),u=Math.min(r.mx,a?1-2*a.right/s:1),d=Math.min(r.yhi,a?1-2*a.top/c:1),f=Math.max(r.ylo,a?-1+2*a.bottom/c:-1),p=[];for(let e of i.districts){let t=e.w/2+.8,n=e.d/2+.8;p.push(e.x-t,0,e.z-n,e.x+t,0,e.z-n,e.x-t,0,e.z+n,e.x+t,0,e.z+n)}let m=0;for(let e of i.buildings){let t=e.w/2,n=e.d/2;p.push(e.x-t,e.h,e.z-n,e.x+t,e.h,e.z-n,e.x-t,e.h,e.z+n,e.x+t,e.h,e.z+n,e.x,e.tipY,e.z),m=Math.max(m,e.tipY)}let h=r.pitch*Eh,g=r.yaw*Eh,_=Math.tan(r.fov*Eh/2),v=_*n,y=Math.sin(g)*Math.cos(h),b=Math.sin(h),x=Math.cos(g)*Math.cos(h),S=Math.cos(g),C=-Math.sin(g),w=-Math.sin(h)*Math.sin(g),T=Math.cos(h),E=-Math.sin(h)*Math.cos(g),D=m*.2,O=e=>{let t=1/0,n=-1/0,r=1/0,i=-1/0,a=0;for(let o=0;o<p.length;o+=3){let s=p[o]-y*e,c=p[o+1]-D-b*e,l=p[o+2]-x*e,u=-(s*y+c*b+l*x),d=(s*S+l*C)/(u*v),f=(s*w+c*T+l*E)/(u*_);t=Math.min(t,d),n=Math.max(n,d),r=Math.min(r,f),i=Math.max(i,f),a+=u}return{xmin:t,xmax:n,ymin:r,ymax:i,zc:a/(p.length/3)}},k=5,A=5e3;for(let e=0;e<40;e++){let e=(k+A)/2,t=O(e);t.xmax-t.xmin<=Math.max(.2,u-l)&&t.ymax-t.ymin<=Math.max(.2,d-f)?A=e:k=e}let j=O(A),M=((j.ymin+j.ymax)/2-(f+d)/2)*j.zc*_,N=((j.xmin+j.xmax)/2-(l+u)/2)*j.zc*v;return Object.assign(this.fit,{key:o,dist:A,fov:r.fov,pitch:h,yaw:g,ty:D,shift:M,side:N}),this.fit}#l(e,t,n){let r=this.stage.camera,i=this.stage.size.aspect||16/9,a=i<1,o=this.#c(e,a,i);this.punch=Math.max(0,this.punch-t);let s=(this.cameraOverride?.fov??o.fov)-4*(this.punch/.12);if(Math.abs(r.fov-s)>.001&&(r.fov=s,r.updateProjectionMatrix()),this.cameraOverride){let e=this.cameraOverride;r.position.set(e.pos[0],e.pos[1],e.pos[2]),r.lookAt(e.look[0],e.look[1],e.look[2]);return}let c=e.phase===`won`||e.phase===`failed`;if(c&&(this.cloudHeld=!0),!this.cloudHeld)this.cityMesh.setCloudYaw(this.yaw-o.yaw);else{this.cloudOver=rn.clamp(this.cloudOver+(c?t:-t)/2.5,0,1);let e=this.cityMesh,n=Math.sin(o.pitch),r=Math.cos(o.pitch),i=o.dist,a=Math.hypot(e.cloudBase.x,e.cloudBase.z),s=e.cloudBase.y-o.ty;e.setCloudOver(o.ty+1.12*(i*(a*n+s*r))/(r*i+a),this.cloudOver)}c?(this.orbitT+=t,this.yaw+=t*(this.orbitT<3?20:4)*Eh):this.yaw=e.phase===`ready`?o.yaw+Math.sin(this.time*.25)*8*Eh:Th(this.yaw,o.yaw,1-Math.exp(-1.2*t));let l=0,u=0,d=0;for(let t of e.bolts){let n=e.city.buildings[t.at];u+=n.x,d+=n.z,l++}if(l){let e=1-Math.exp(-3*t);this.follow.x=Th(this.follow.x,u/l,e),this.follow.z=Th(this.follow.z,d/l,e),this.followW=Math.min(1,this.followW+t*3)}else this.followW=Math.max(0,this.followW-t*.8);let f=n?0:rn.smoothstep(this.followW,0,1),p=o.dist*(1-.15*f),m=Math.sin(o.pitch),h=Math.cos(o.pitch),g=-m*Math.sin(this.yaw)*o.shift+Math.cos(this.yaw)*o.side+this.follow.x*.3*f,_=o.ty+h*o.shift,v=-m*Math.cos(this.yaw)*o.shift-Math.sin(this.yaw)*o.side+this.follow.z*.3*f,y=g+Math.sin(this.yaw)*Math.cos(o.pitch)*p,b=_+Math.sin(o.pitch)*p,x=v+Math.cos(this.yaw)*Math.cos(o.pitch)*p,S=n?1:1-Math.exp(-3*t);this.camPos.x=Th(this.camPos.x,y,S),this.camPos.y=Th(this.camPos.y,b,S),this.camPos.z=Th(this.camPos.z,x,S),this.camLook.x=Th(this.camLook.x,g,S),this.camLook.y=Th(this.camLook.y,_,S),this.camLook.z=Th(this.camLook.z,v,S),this.shake.maxOffset=o.dist*.05;let C=this.shake.offset;r.position.set(this.camPos.x+C.x,this.camPos.y+C.y,this.camPos.z+C.z),r.lookAt(this.camLook);let w=o.dist*4;Math.abs(r.far-w)>1&&(r.far=w,r.near=Math.max(.1,o.dist*.01),r.updateProjectionMatrix());let T=this.stage.scene.fog;T&&(T.near=o.dist*Bd.fogNear,T.far=o.dist*Bd.fogFar)}},Mh={coin:`<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="#ffd23f" stroke="#e08e12" stroke-width="3"/><circle cx="16" cy="16" r="8" fill="none" stroke="#fff1b8" stroke-width="2.4"/></svg>`,video:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="14" height="14" rx="3"/><path d="M17 10.2 22 7v10l-5-3.2z"/></svg>`,soundOn:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,soundOff:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 9.5l5 5m0-5-5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>`,pause:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.2"/><rect x="14" y="5" width="4" height="14" rx="1.2"/></svg>`,mouse:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="6" fill="none" stroke="#fff" stroke-width="2"/><path d="M12 7v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,finger:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10l5 1.2c1 .3 1.6 1.2 1.5 2.2L18 18c-.2 1.7-1.6 3-3.3 3h-3.2c-1 0-1.9-.5-2.5-1.3L5.7 15.6a1.4 1.4 0 0 1 2.1-1.8L9 15z" fill="#fff"/></svg>`,keys:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="8" width="20" height="9" rx="2" fill="none" stroke="#fff" stroke-width="2"/><path d="M6 12.5h12" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,bolt:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="#fff"/></svg>`,voltage:`<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="#4df3ff" opacity=".25"/><path d="M27 6 13 27h9l-2 15 15-22h-9z" fill="#fff"/></svg>`,fork:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 18 20l6 3-4 21" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/><path d="m24 23 10 8-3 13" fill="none" stroke="#bff8ff" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`,capacitor:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="12" y="10" width="24" height="32" rx="5" fill="none" stroke="#fff" stroke-width="4"/><rect x="19" y="5" width="10" height="6" rx="2" fill="#fff"/><rect x="17" y="24" width="14" height="13" rx="2" fill="#ffe066"/></svg>`,strikes:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 6 8 24h7l-2 16 11-20h-7z" fill="#fff"/><path d="M34 6l-8 18h7l-2 16 11-20h-7z" fill="#bff8ff"/></svg>`,gold:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4v30" stroke="#ffcc33" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="8" r="6" fill="#ffe066"/><rect x="14" y="34" width="20" height="8" rx="2" fill="#fff"/></svg>`,shop:`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 4 12 27h10l-3 17 17-25H26z" fill="#fff"/><circle cx="36" cy="12" r="6" fill="#ff3fd8"/></svg>`,close:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`,gift:`<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="19" width="34" height="23" rx="3" fill="#ff3fa4"/><rect x="5" y="13" width="38" height="8" rx="2.5" fill="#ff7ac4"/><rect x="21" y="13" width="6" height="29" fill="#ffd166"/><path d="M24 13c-3-7-12-8-11-2 1 4 8 3 11 2zm0 0c3-7 12-8 11-2-1 4-8 3-11 2z" fill="#ffd166"/></svg>`},Nh=e=>`<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28 4 12 27h10l-3 17 17-25H26z" fill="${e}"/></svg>`,Ph={2:`#4df3ff`,3:`#7cff7a`,5:`#ffcc33`,10:`#ff3fa4`};function Fh(e,{onSound:t,onPause:n,onResume:r,onBuy:i,onFree:a,onBoost:o,onBoostCoins:s,onGift:c,onShop:l,onShopClose:u,onSkin:d,onPreview:f,onUnlock:p,onCash:m,onTry:h}){e.innerHTML=`
    <div class="hud">
      <div class="hud-left"><div class="coins"><b>0</b><span class="coin">${Mh.coin}</span></div></div>
      <div class="hud-center">
        <div class="score stroke glow-cyan" style="text-align:center"><b>0%</b><span class="powered-label" style="display:block;font-size:max(12px,0.36em);letter-spacing:0.16em;margin-top:0.1em">${I(`powered`)}</span></div>
        <div class="meter" style="position:relative;width:9em;overflow:visible"><i></i></div>
        <div class="strike-pips" style="display:flex;gap:0.15em;margin-top:0.2em"></div>
      </div>
      <div class="hud-right">
        <div class="btns"><button class="icon-btn pause" type="button">${Mh.pause}</button><button class="icon-btn sound" type="button"></button></div>
        <div class="ranks"><p class="ranks-title"></p><ol></ol></div>
      </div>
    </div>
    <div class="charge" style="position:absolute;left:0;top:0;width:6em;height:6em;pointer-events:none;display:none;z-index:4">
      <svg viewBox="0 0 60 60" aria-hidden="true" style="width:100%;height:100%;display:block;transform:rotate(-90deg);overflow:visible">
        <circle class="charge-track" cx="30" cy="30" r="24" fill="none" stroke="rgba(8,6,32,0.6)" stroke-width="8"/>
        <circle class="charge-band" cx="30" cy="30" r="24" fill="none" stroke="#ffe066" stroke-width="8" pathLength="100" opacity="0.6"/>
        <circle class="charge-fill" cx="30" cy="30" r="24" fill="none" stroke="#fff" stroke-width="5" pathLength="100" stroke-linecap="round" stroke-dasharray="0 100"/>
      </svg>
    </div>
    <div class="floats"></div>
    <div class="home">
      <h1 class="logo stroke"></h1>
      <p class="mode stroke"></p>
      <div class="hint"><p class="stroke main"></p><p class="stroke sub"></p></div>
    </div>
    <div class="pill hidden"><span class="pill-icon"></span><span class="pill-text stroke"></span></div>
    <div class="world-card hidden"><p class="stroke small"></p><p class="stroke big"></p></div>
    <div class="upgrades hidden"></div>
    <div class="boost-row hidden"><button class="btn boost hidden" type="button" data-video="1">${Mh.video}<span class="boost-label"></span></button><button class="btn boost-coins hidden" type="button"><span class="boost-label"></span><b></b><span class="coin">${Mh.coin}</span></button></div>
    <button class="icon-btn shop-btn hidden" type="button" aria-label="shop">${Mh.shop}</button>
    <button class="icon-btn gift-btn hidden" type="button" aria-label="gift">${Mh.gift}</button>
    <div class="paused" hidden><div class="paused-card"><h2 class="stroke"></h2><p class="stroke sub"></p><p class="keys"></p></div></div>
    <div class="shop-modal" hidden><div class="shop">
      <button class="icon-btn close" type="button">${Mh.close}</button>
      <h2 class="stroke"></h2>
      <p class="owned-count stroke"></p>
      <div class="grid"></div>
      <p class="skin-name stroke"></p>
      <div class="row"></div>
      <p class="note stroke"></p>
    </div></div>
    <div class="modal" hidden><div class="dialog"><p class="dialog-mode"></p><h2 class="stroke"></h2><div class="podium plate-ladder"></div><div class="stats"></div><div class="amount stroke"><span class="coin">${Mh.coin}</span><b>0</b><span class="crate"></span></div><div class="ring" hidden><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="track" cx="20" cy="20" r="17"/><circle class="fill" cx="20" cy="20" r="17" pathLength="100"/></svg><b class="stroke"></b></div><div class="row"></div><p class="note stroke"></p></div></div>
    <div class="toast"></div>
    <div class="ad-block" hidden><div class="spinner"></div></div>`;let g=t=>e.querySelector(t),_=g(`.sound`),v=g(`.pause`),y=g(`.coins b`),b=g(`.coins`),x=g(`.floats`),S=g(`.hint`),C=g(`.home`),w=g(`.upgrades`),T=g(`.modal`),E=g(`.dialog`),D=g(`.toast`),O=g(`.ad-block`),k=g(`.boost-row`),A=g(`.boost`),j=g(`.boost-coins`),M=g(`.gift-btn`),N=g(`.shop-btn`),P=g(`.shop-modal`),F=E.querySelector(`.ring`),ee=g(`.score b`),L=g(`.score`),R=g(`.meter`),te=g(`.meter i`),z=g(`.strike-pips`),ne=g(`.ranks-title`),B=g(`.ranks`),V=matchMedia(`(max-aspect-ratio: 1/1)`),re=g(`.ranks ol`),ie=g(`.pill`),H=g(`.world-card`),ae=g(`.paused`),U=g(`.charge`),W=g(`.charge-band`),oe=g(`.charge-fill`);R.insertAdjacentHTML(`beforeend`,[[.6,2],[.8,3],[.95,5]].map(([e,t])=>`<span class="meter-tick" style="position:absolute;left:${e*100}%;top:-0.2em;bottom:-0.2em;width:0.14em;margin-left:-0.07em;border-radius:0.1em;background:${Ph[t]}"></span>`).join(``)),_.addEventListener(`click`,()=>t?.()),v.addEventListener(`click`,()=>n?.()),ae.addEventListener(`click`,()=>r?.()),A.addEventListener(`click`,()=>o?.()),j.addEventListener(`click`,()=>s?.(j)),M.addEventListener(`click`,()=>c?.()),N.addEventListener(`click`,()=>l?.()),P.querySelector(`.close`).addEventListener(`click`,()=>u?.()),P.addEventListener(`click`,e=>{let t=e.target.closest(`button[data-act]`);t&&(t.dataset.act===`skin`?d?.(t.dataset.id):t.dataset.act===`preview`?f?.(t.dataset.id):t.dataset.act===`unlock`?p?.(t):t.dataset.act===`cash`?m?.(t):t.dataset.act===`try`&&h?.(t))});let se=0,ce=0;function le(e,{animate:t=!1}={}){ce=e,t||(se=e,y.textContent=String(e))}let G=Array.from({length:14},()=>{let e=document.createElement(`div`);return e.className=`float stroke`,x.appendChild(e),e}),K=0;function ue(e,t,n,r=`good`){let i=G[K];K=(K+1)%G.length,i.textContent=n,i.className=`float stroke ${r}`,i.getAnimations().forEach(e=>e.cancel()),i.animate([{transform:`translate(${e}px, ${t}px) translate(-50%, -50%) scale(.4)`,opacity:0},{transform:`translate(${e}px, ${t-26}px) translate(-50%, -50%) scale(1.15)`,opacity:1,offset:.18},{transform:`translate(${e}px, ${t-80}px) translate(-50%, -50%) scale(1)`,opacity:0}],{duration:900,easing:`cubic-bezier(.2,.8,.2,1)`,fill:`forwards`})}function de(t,n){let r=t.getBoundingClientRect(),i=b.getBoundingClientRect(),a=e.getBoundingClientRect(),o=Math.min(10,Math.max(4,Math.round(Math.log2(n+1)*2)));for(let t=0;t<o;t++){let n=document.createElement(`div`);n.className=`fly-coin`,n.innerHTML=Mh.coin,e.appendChild(n);let s=r.left+r.width/2-a.left+(Math.random()-.5)*60,c=r.top+r.height/2-a.top+(Math.random()-.5)*30,l=i.left-a.left+i.width-18,u=i.top+i.height/2-a.top,d=n.animate([{transform:`translate(${s}px, ${c}px) scale(.3)`,opacity:0},{transform:`translate(${s+(Math.random()-.5)*80}px, ${c-40}px) scale(1.1)`,opacity:1,offset:.3},{transform:`translate(${l}px, ${u}px) scale(.7)`,opacity:1}],{duration:650+t*45,easing:`cubic-bezier(.5,0,.6,1)`,fill:`forwards`});d.onfinish=()=>{n.remove(),b.animate([{scale:1},{scale:1.12},{scale:1}],{duration:160}),t===o-1&&(se=ce-1)}}}function fe(e){if(!e){w.classList.add(`hidden`);return}w.classList.remove(`hidden`),w.innerHTML=e.map(e=>`
      <div class="upgrade" data-kind="${e.kind}">
        <button class="card ${e.affordable||e.maxed?``:`cant`}" type="button" data-act="buy" ${e.maxed?`disabled`:``}>
          <span class="lvl stroke">${I(`lvl`,{n:e.level})}</span>
          <span class="icon">${Mh[e.kind]||Mh.bolt}</span>
          <span class="title stroke">${e.title}</span>
          <span class="cost stroke">${e.maxed?I(`max`):`<b>${e.cost}</b>${Mh.coin}`}</span>
        </button>
        ${e.free.visible?`<button class="btn free" type="button" data-act="free" data-video="1">${Mh.video}<span>FREE</span></button>`:`<span class="free-spacer"></span>`}
      </div>`).join(``),w.querySelectorAll(`button`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.closest(`.upgrade`).dataset.kind;e.currentTarget.dataset.act===`buy`?i?.(t):a?.(t)})})}function pe(t,n){let r=w.querySelector(`[data-kind="${t}"] .card`);if(r?.animate([{scale:1},{scale:1.12},{scale:1}],{duration:280,easing:`ease-out`}),r&&n){let t=r.getBoundingClientRect(),i=e.getBoundingClientRect();ue(t.left+t.width/2-i.left,t.top-i.top,n,`gold`)}}let me=null;function he({kind:e,title:t,amount:n,buttons:r,note:i=``,timed:a=null,mode:o=``,plates:s=null,stats:c=null,crate:l=``}){T.hidden=!1,E.className=`dialog ${e}`,E.querySelector(`.dialog-mode`).textContent=o,E.querySelector(`h2`).textContent=t;let u=E.querySelector(`.podium`);u.style.flexDirection=`row`,u.innerHTML=s?s.map(e=>`<div class="pod${e.on?` me`:``}" data-mult="${e.mult}" style="flex:1;flex-direction:column;gap:0;padding:0.25em 0.2em;text-align:center${e.on?`;background:${Ph[e.mult]};box-shadow:0 0 0 0.12em #fff, 0 0 0.8em ${Ph[e.mult]}`:``}"><span class="r" style="width:auto;text-align:center;font-size:1.35em;color:${e.on?`#1a1240`:Ph[e.mult]}">×${e.mult}</span><span class="sc" style="font-size:max(12px,0.8em)${e.on?`;color:#1a1240`:``}">${Math.round(e.at*100)}%</span></div>`).join(``):``,E.querySelector(`.stats`).innerHTML=c?c.map(e=>`<span>${Ih(e)}</span>`).join(``):``;let d=E.querySelector(`.amount`);d.style.display=n===null?`none`:``;let f=E.querySelector(`.amount b`);f.textContent=String(n??0),E.querySelector(`.crate`).textContent=l;let p=E.querySelector(`.row`);p.innerHTML=r.filter(Boolean).map(e=>`<button class="btn" type="button" data-id="${e.id}"${e.video?` data-video="1"`:``}>${e.video?Mh.video:``}<span>${e.label}</span></button>`).join(``),E.querySelector(`.note`).textContent=i,me=a&&p.querySelector(`[data-id="${a.id}"]`)?{left:a.seconds,total:a.seconds,id:a.id,onExpire:a.onExpire}:null,F.hidden=!me,ge(),E.getAnimations().forEach(e=>e.cancel()),E.animate([{transform:`scale(.6)`,opacity:0},{transform:`scale(1.04)`,opacity:1,offset:.7},{transform:`scale(1)`,opacity:1}],{duration:380,easing:`ease-out`}),u.querySelector(`.pod.me`)?.animate([{transform:`scale(2.2)`,opacity:0},{transform:`scale(2.2)`,opacity:0,offset:.45},{transform:`scale(0.92)`,opacity:1,offset:.8},{transform:`scale(1)`,opacity:1}],{duration:760,easing:`ease-in`});let m=null,h=!1;return p.onclick=e=>{let t=e.target.closest(`button[data-id]`);t&&!h&&m?.(t.dataset.id)},{onChoice(e){m=e},lock(e){h=e,E.classList.toggle(`locked`,e)},hideButton(e){p.querySelector(`[data-id="${e}"]`)?.remove(),me?.id===e&&(me=null,F.hidden=!0)},setNote(e){E.querySelector(`.note`).textContent=e},setAmount(e){f.textContent=String(e),f.animate([{scale:1},{scale:1.3},{scale:1}],{duration:300})},get amountElement(){return E.querySelector(`.amount`)},get locked(){return h},close(){T.hidden=!0,p.onclick=null,me=null,F.hidden=!0}}}function ge(){me&&(F.querySelector(`b`).textContent=String(Math.max(0,Math.ceil(me.left))),F.querySelector(`.fill`).style.strokeDashoffset=String(100*(1-me.left/me.total)))}function _e(e){if(!me||T.hidden||E.classList.contains(`locked`))return;if(me.left-=e,me.left>0){ge();return}let{id:t,onExpire:n}=me;me=null,F.hidden=!0,E.querySelector(`.row [data-id="${t}"]`)?.remove(),n?.()}function ve(e){let t=e?.video,n=e?.coin;k.classList.toggle(`hidden`,!t&&!n),A.classList.toggle(`hidden`,!t),j.classList.toggle(`hidden`,!n),t&&(A.querySelector(`.boost-label`).textContent=t.label),n&&(j.querySelector(`.boost-label`).textContent=n.label,j.querySelector(`b`).textContent=String(n.cost),j.classList.toggle(`cant`,!n.affordable))}let ye=``;function q(e,t=!1){let n=JSON.stringify({...e,note:null});if(P.querySelector(`.note`).textContent=e.note||``,n===ye&&!t)return;ye=n,P.querySelector(`h2`).textContent=e.title,P.querySelector(`.owned-count`).textContent=e.count||``,P.querySelector(`.grid`).innerHTML=e.skins.map(e=>`<button class="swatch ${e.owned?`owned`:`locked`}${e.selected?` selected`:``}${e.preview?` preview`:``}" type="button" data-act="${e.owned?`skin`:`preview`}" data-id="${e.id}" aria-label="${Ih(e.name)}">${Nh(e.owned?e.color:e.preview?`#4a3f7a`:`#2c2446`)}</button>`).join(``),P.querySelector(`.skin-name`).textContent=e.name||``;let r=[];e.unlock&&r.push(`<button class="btn${e.unlock.affordable?``:` cant`}" type="button" data-act="unlock"><span>${e.unlock.label}</span><b>${e.unlock.cost}</b><span class="coin">${Mh.coin}</span></button>`),e.tryIt&&r.push(`<button class="btn" type="button" data-act="try" data-video="1">${Mh.video}<span>${e.tryIt.label}</span></button>`),e.cash&&r.push(`<button class="btn" type="button" data-act="cash" data-video="1">${Mh.video}<span>+${e.cash.amount}</span><span class="coin">${Mh.coin}</span></button>`),P.querySelector(`.row`).innerHTML=r.join(``)}let be=0;function xe(e,t=2400){D.textContent=e,D.classList.add(`show`),clearTimeout(be),be=setTimeout(()=>D.classList.remove(`show`),t)}let Se=-1;function Ce(e,t){let n=Math.floor(e*100+1e-6);n!==Se&&(Se=n,ee.textContent=`${n}%`,te.style.width=`${Math.max(0,Math.min(100,e*100))}%`,t&&L.animate([{scale:1},{scale:1.18},{scale:1}],{duration:200,easing:`ease-out`}))}let we=-1,J=-1;function Te(e,t){if(e===we&&t===J)return;let n=we>e;we=e,J=t,z.innerHTML=Array.from({length:t},(t,n)=>`<span class="pip${n<e?``:` used`}" style="display:block;width:1.25em;height:1.25em;opacity:${n<e?1:.28};filter:drop-shadow(0 0.08em 0 #1a1240)">${Mh.bolt}</span>`).join(``),n&&z.animate([{scale:1.2},{scale:1}],{duration:220})}let Ee=Array.from({length:3},()=>{let e=document.createElement(`li`);return e.innerHTML=`<span class="r"></span><span class="nm"></span><span class="sc"></span>`,re.appendChild(e),e});function De(e,t){B.style.display=V.matches?`none`:``,ne.textContent!==e&&(ne.textContent=e);for(let e=0;e<Ee.length;e++){let n=Ee[e],r=t[e];if(!r){n.style.display=`none`;continue}n.style.display=``;let[i,a,o]=n.children;i.textContent!==r[0]&&(i.textContent=r[0]),a.textContent!==r[1]&&(a.textContent=r[1]),o.textContent!==r[2]&&(o.textContent=r[2])}}let Oe=``;function ke(e,t){let n=e?`${t}|${e}`:``;n!==Oe&&(Oe=n,ie.classList.toggle(`hidden`,!e),e&&(ie.querySelector(`.pill-text`).textContent=e,ie.querySelector(`.pill-icon`).innerHTML=Mh[t]||``,ie.animate([{transform:`translate(-50%, 0.5em) scale(.9)`,opacity:0},{transform:`translate(-50%, 0) scale(1)`,opacity:1}],{duration:260,easing:`ease-out`})))}let Ae=0;function je(e,t){H.querySelector(`.small`).textContent=e,H.querySelector(`.big`).textContent=t,H.classList.remove(`hidden`),H.animate([{transform:`translate(-50%, -50%) scale(.5)`,opacity:0},{transform:`translate(-50%, -50%) scale(1.08)`,opacity:1,offset:.35},{transform:`translate(-50%, -50%) scale(1)`,opacity:1}],{duration:420,easing:`ease-out`}),Ae=1.6}let Me={on:!1,x:0,y:0,k:-1,band:``,lo:-1,hi:-1};function Ne(e){if(!e){Me.on&&(U.style.display=`none`,Me.on=!1,Me.k=-1);return}let t=Math.min(1,e.charge);if(Me.on&&Math.abs(e.x-Me.x)<.5&&Math.abs(e.y-Me.y)<.5&&Math.abs(t-Me.k)<.004&&e.band===Me.band)return;let n=!Me.on;Me.on=!0,Me.x=e.x,Me.y=e.y,Me.k=t,Me.band=e.band,U.style.display=``;let r=e.band===`super`?1.14:e.band===`over`?1.06+Math.random()*.06:1;U.style.transform=`translate(${e.x.toFixed(1)}px, ${e.y.toFixed(1)}px) translate(-50%, -50%) scale(${r})`,(e.lo!==Me.lo||e.hi!==Me.hi)&&(Me.lo=e.lo,Me.hi=e.hi,W.setAttribute(`stroke-dasharray`,`${((e.hi-e.lo)*100).toFixed(1)} ${(100-(e.hi-e.lo)*100).toFixed(1)}`),W.setAttribute(`stroke-dashoffset`,String(-e.lo*100))),oe.setAttribute(`stroke-dasharray`,`${(t*100).toFixed(1)} 100`),oe.setAttribute(`stroke`,e.band===`super`?`#ffe066`:e.band===`over`?`#ff5a6e`:`#ffffff`),W.setAttribute(`opacity`,e.band===`super`?`1`:`0.6`),n&&U.animate([{opacity:0},{opacity:1}],{duration:120})}let Pe=null;return{setCoins:le,coinsFly:de,setSound({effectiveMuted:e,platformMute:t}){_.innerHTML=e?Mh.soundOff:Mh.soundOn,_.title=I(t?`muted_by_platform`:e?`sound_off`:`sound_on`),_.setAttribute(`aria-label`,_.title)},showHome(e,{title:t=``,mode:n=``,main:r=``,sub:i=``,icon:a=`mouse`}={}){if(C.classList.toggle(`hidden`,!e),!e){Pe?.cancel(),Pe=null;return}C.querySelector(`.logo`).textContent=t,C.querySelector(`.mode`).textContent=n;let o=S.querySelector(`.main`);o.innerHTML=`<span class="ico">${Mh[a]||``}</span>${Ih(r)}`,S.querySelector(`.sub`).textContent=i,Pe||=o.animate([{transform:`scale(1)`,opacity:.85},{transform:`scale(1.07)`,opacity:1},{transform:`scale(1)`,opacity:.85}],{duration:1300,iterations:1/0,easing:`ease-in-out`})},showRoundHud(t){e.classList.toggle(`in-round`,t),z.style.display=t?`flex`:`none`},setPowered:Ce,setStrikes:Te,setPanel:De,setCharge:Ne,showPill:ke,showWorld:je,showPaused(e,{title:t=``,sub:n=``,keys:r=``}={}){ae.hidden=!e,e&&(ae.querySelector(`h2`).textContent=t,ae.querySelector(`.sub`).textContent=n,ae.querySelector(`.keys`).textContent=r)},showUpgrades:fe,popUpgrade:pe,showBoost:ve,readyInsets(){let t=e.getBoundingClientRect(),n=t.width,r=t.height,i={top:0,bottom:0,left:0,right:0},a=e=>e&&!e.classList.contains(`hidden`)&&!e.closest(`.hidden`)&&e.getClientRects().length>0;a(S)&&(i.top=S.getBoundingClientRect().bottom-t.top);let o=V.matches;for(let e of[w,k,N,M]){if(!a(e))continue;let s=e.getBoundingClientRect(),c=s.left-t.left,l=s.top-t.top,u=s.right-t.left,d=s.bottom-t.top;d<r*.4?i.top=Math.max(i.top,d):o||l>r*.75&&c>n*.25&&u<n*.75?i.bottom=Math.max(i.bottom,r-l):(c+u)/2<n/2?i.left=Math.max(i.left,u):i.right=Math.max(i.right,n-c)}return i},showShopButton(e){N.classList.toggle(`hidden`,!e)},showGift(e){let t=!M.classList.contains(`hidden`);M.classList.toggle(`hidden`,!e),e&&!t&&M.animate([{scale:.3,rotate:`-20deg`},{scale:1.2,rotate:`8deg`,offset:.6},{scale:1,rotate:`0deg`}],{duration:520,easing:`ease-out`})},openShop(t){q(t,!0),P.hidden=!1,e.classList.add(`shop-open`),P.querySelector(`.shop`).animate([{transform:`scale(.7)`,opacity:0},{transform:`scale(1)`,opacity:1}],{duration:260,easing:`ease-out`})},updateShop(e){P.hidden||q(e)},closeShop(){P.hidden=!0,e.classList.remove(`shop-open`)},get shopOpen(){return!P.hidden},get modalOpen(){return!T.hidden},popSwatch(e){P.querySelector(`.swatch[data-id="${e}"]`)?.animate([{scale:.4,rotate:`-12deg`},{scale:1.25,rotate:`6deg`,offset:.6},{scale:1,rotate:`0deg`}],{duration:520,easing:`ease-out`})},shakeElement(e){e?.animate([{translate:`0`},{translate:`-0.25em`},{translate:`0.25em`},{translate:`0`}],{duration:220})},floatText:ue,showResult:he,toast:xe,adOverlay:{show(){O.hidden=!1},hide(){O.hidden=!0}},update(e){if(_e(e),Ae>0&&(Ae-=e,Ae<=0&&H.classList.add(`hidden`)),se!==ce){let t=Math.max(1,Math.round(Math.abs(ce-se)*Math.min(1,e*6)));se+=Math.sign(ce-se)*t,Math.abs(ce-se)<t&&(se=ce),y.textContent=String(se)}}}}function Ih(e){return String(e).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var Lh=new URLSearchParams(location.search),Rh=e=>new Promise(t=>setTimeout(t,e)),zh=e=>`${Math.floor(e/60)}:${String(e%60).padStart(2,`0`)}`,Bh=e=>Math.floor(e*100+1e-6),Vh=Object.keys(Wu),Hh=[...n.payout.plates].reverse();async function Uh(){let r=document.getElementById(`game`),i=1,a=null,o=!1,s=0,c=1,l=!1,h=-1,g=!1,_=null,y=null,b=0,x=0,S=!1,w=null,D=!1,k=null,j=[],M=e=>{D=e,de.fxScale=1,e?setTimeout(()=>{D&&(de.fxScale=0,j=document.getAnimations().filter(e=>e.playState===`running`),j.forEach(e=>{(e.currentTime??0)<250&&(e.currentTime=250),e.pause()}))},300):(j.forEach(e=>e.play()),j=[])},P=!1,F=0,L=-1,R=`mouse`,te=!1,z=-1,ne=!1,B={id:null,down:!1,x:0,y:0},V=new Map,re=iu(),ie=await u();ie.loadingStart(),ee(ie.systemInfo.locale),ie.isCrazyGamesApp&&document.documentElement.classList.add(`in-app`);let H=new f([d.BOOT]),ae=A(ie,H),U=new C({key:`${e.slug}.save`,version:e.saveVersion,defaults:Iu,migrations:Lu}).init(ie),W=new E({sounds:{...T,...Od},samples:Md,userMuted:U.data.userMuted}).bindPlatform(ie).installUnlockHandlers(window),oe=new v(r,{bindings:{action:[`Space`,`Enter`],pause:[`KeyP`]}}).attach(),se=Xl(r),ce=new N(se.renderer),le=()=>R===`touch`||matchMedia(`(pointer: coarse)`).matches||ie.systemInfo?.device?.type===`mobile`,G=Fh(document.getElementById(`ui`),{onSound:Ye,onPause:()=>P?xe():be(),onResume:xe,onBuy:qe,onFree:Je,onBoost:Ie,onBoostCoins:Le,onGift:Re,onShop:Be,onShopClose:Ve,onSkin:He,onPreview:Ue,onUnlock:Ge,onCash:Ke,onTry:We}),K=new O(H,W,G.adOverlay);K.detectAdblock().then(Me),await Zl();let ue=new m({update:Se,render:Ce,maxStepsPerFrame:8}),de=new jh(se,{audio:W,ui:G,loop:ue}),fe=()=>{let e=Bu(U.data,_);de.recolor(e.glow,e)};fe();let pe=()=>I(`theme_${Hd(a.city).id}`),me=()=>I(`city_mode`,{n:i,theme:pe()});function he(e){i=e,a=fu({level:e,seed:`city-${e}`,up:Ku(U.data),extraStrikes:l?t.boostStrikes:0}),o=!1,F=0,de.build(a),L=-1,G.setPowered(0,!1),G.setStrikes(a.strikesLeft,a.strikesMax),G.setCharge(null),G.showPill(null),ne=!1}function ge(){h!==U.data.runs&&(h=U.data.runs,g=nd(U.data,Date.now()),g&&U.update(e=>{e.lastBoostRun=e.runs,e.lastBoostAt=Date.now()}));let e=R===`keys`;G.showHome(!0,{title:I(`title`),mode:me(),main:I(`hint_hold`),sub:e?I(`hint_sub_keys`,{keys:oe.movementLabel}):I(`hint_sub_pointer`),icon:le()?`finger`:e?`keys`:`mouse`}),G.showRoundHud(!1),Me()}function _e(){return!a||a.phase!==`ready`||!ve()?!1:(gu(a),G.showHome(!1),G.showRoundHud(!0),G.showUpgrades(null),G.showBoost(null),G.showShopButton(!1),G.showGift(!1),de.setSafeArea(null),V.clear(),ae.setPlaying(!0),ie.setGameContext({city:i}),U.update(e=>{e.runs++}),!0)}let ve=()=>!P&&!H.has(d.MENU)&&!H.has(d.AD)&&!H.has(d.BOOT)&&!G.shopOpen&&!G.modalOpen,ye=e=>{let t=r.getBoundingClientRect();return[e.clientX-t.left,e.clientY-t.top]};r.addEventListener(`pointerdown`,e=>{B.id!==null||e.button>0||a&&(a.phase===`ready`||a.phase===`run`)&&ve()&&([B.x,B.y]=ye(e),B.id=e.pointerId,B.down=!0,R=e.pointerType===`touch`?`touch`:`mouse`,L=de.pick(a,B.x,B.y),a.phase===`ready`&&_e())}),r.addEventListener(`pointermove`,e=>{let t=e.pointerId===B.id;(t||e.pointerType===`mouse`)&&a&&(a.phase===`ready`||a.phase===`run`)&&ve()&&([B.x,B.y]=ye(e),!(t&&e.pointerType===`mouse`)&&(t||e.pointerType===`mouse`)&&(L=de.pick(a,B.x,B.y),t||(R=`mouse`)))},{passive:!0});let q=e=>{e.pointerId===B.id&&(B.down=!1,B.id=null)};window.addEventListener(`pointerup`,q),window.addEventListener(`pointercancel`,q),window.addEventListener(`blur`,()=>{B.down=!1,B.id=null}),window.addEventListener(`keydown`,e=>{e.code===`KeyM`&&!e.repeat&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&Ye()});function be(){if(P||a?.phase!==`run`||o)return;P=!0,B.down=!1,B.id=null,H.hold(d.DIALOG),G.setCharge(null);let e=le();G.showPaused(!0,{title:I(`paused`),sub:I(e?`tap_resume`:`click_resume`),keys:e?``:I(`pause_keys`)})}function xe(){P&&(P=!1,G.showPaused(!1),H.release(d.DIALOG))}function Se(e){if(!D){if(oe.justPressed(`pause`)&&(P?xe():be()),(a.phase===`ready`||a.phase===`run`)&&ve()){let e=+!!oe.justPressed(`right`)-!!oe.justPressed(`left`),t=+!!oe.justPressed(`down`)-!!oe.justPressed(`up`);(e||t)&&(R=`keys`,L=de.stepAim(a,L,e,t)),oe.justPressed(`action`)&&(R!==`keys`&&!B.down&&(R=`keys`),L<0&&(L=de.pick(a,se.size.width/2,se.size.height/2)),a.phase===`ready`&&_e())}a.phase===`run`?S?$l(a,re):(re.hold=w??(!P&&(B.down||oe.held(`action`))),re.aim=L):re.hold=!1,Su(a,e,re),oe.endStep(),S&&re.aim>=0&&(L=re.aim),k&&k(a)&&(k=null,M(!0)),(a.phase===`won`||a.phase===`failed`)&&!o&&J()}}function Ce(e,t){se.resize(),c<1&&(c=Math.min(1,c+t*2),ue.timeScale=.25+.75*c);let n=a.phase===`ready`||a.phase===`run`;de.aim.index=L,de.aim.visible=n&&!P&&L>=0&&(R!==`touch`||a.holding),de.update(a,e,t),we(),G.update(t*de.fxScale),x+=t,x>=.5&&(x=0,Ne()),ce.update(ue.frameMs,t),se.render()}function we(){a.litCount!==F&&(G.setPowered(pu(a),a.litCount>F),F=a.litCount),G.setStrikes(a.strikesLeft,a.strikesMax);let e=(((i*16+a.strikesLeft)*16+a.strikesMax)*4096+a.districtsDone*512+a.bestChain)*2+ +(se.size.aspect<1);if(e!==z&&a.phase!==`ready`&&(z=e,G.setPanel(I(`city_n`,{n:i}),[[`${a.strikesLeft}/${a.strikesMax}`,I(`strikes`),``],[`${a.districtsDone}/${a.city.districts.length}`,I(`blocks`),``],[String(a.bestChain),I(`best_chain`),``]])),R===`keys`&&a.phase===`run`&&!a.holding&&a.bolts.length===0&&L>=0&&a.lit[L]){let e=a.city.buildings[L],t=yu(a,e.x,e.z,!0);t>=0&&(L=t)}a.lastRelease?.band===`super`&&(te=!0);let t=a.phase===`run`&&a.holding&&!te&&U.data.runs<=3;t!==ne&&(ne=t,G.showPill(t?I(`pill_band`):null,`bolt`))}async function J(){o=!0,B.down=!1,G.setCharge(null),G.showPill(null),ne=!1,P&&(P=!1,G.showPaused(!1),H.release(d.DIALOG));let e=pu(a),n=K.rewardedAvailability;if(!td({available:n.ok,revivesUsed:s,progress:e})){Te();return}ae.setPlaying(!1),await Rh(700),H.hold(d.MENU),K.beginBreak(`fail`);let r=!0,i=a.city.buildings.length-a.litCount,l=G.showResult({kind:`fail`,mode:me(),title:I(`so_close`),stats:[i===1?I(`near_full_1`,{p:Bh(e)}):I(`near_full_n`,{p:Bh(e),k:i})],amount:null,buttons:[{id:`finish`,label:I(`finish`)},{id:`revive`,label:I(`one_more_strike`),video:!0}],timed:{id:`revive`,seconds:t.reviveCountdownSec,onExpire:()=>{r=!1,K.offer(`fail-revive`,`expired`)}}});K.offer(`fail-revive`),l.onChoice(async e=>{if(W.play(`click`),e===`revive`){l.lock(!0);let e=await K.rewarded({context:`fail-revive`,isContinue:!0,grant:()=>{s++}});if(l.lock(!1),e.shown){l.close(),K.endBreak(),vu(a),o=!1,H.release(d.MENU),ae.setPlaying(!0),c=0,ue.timeScale=.25;return}r=!1,l.hideButton(`revive`),l.setNote(e.reason===`adblock`?I(`adblock_notice`):I(`no_video`));return}r&&K.offer(`fail-revive`,`declined`),l.close(),K.endBreak(),H.release(d.MENU),Te()})}async function Te(){ae.setPlaying(!1),b++,ie.clearGameContext();let t=pu(a),r=mu(t),o=a.phase===`won`,s=hu(a),c=i,u=t>=1&&U.data.fullPowers===0,f=U.data.bestLevel;U.update(e=>{e.coins+=s,o&&(e.level=c+1,e.bestLevel=Math.max(e.bestLevel,c+1),e.wins++),t>=1&&e.fullPowers++,e.bestShare=Math.max(e.bestShare,t),e.bestChain=Math.max(e.bestChain,a.bestChain),e.plates={...e.plates,[c]:Math.max(e.plates[c]||0,r.mult)}}),U.flush(),ie.reportCompletion(Qu(U.data.bestLevel)),(u||f<20&&U.data.bestLevel>=20||f<40&&U.data.bestLevel>=40)&&ie.happytime(),await Rh(o?1300:900),H.hold(d.MENU),K.beginBreak(`level-complete`);let p=K.rewardedAvailability,m=p.ok&&U.data.runs>=2,h=a.city.buildings.length,g=``;if(!o)g=I(`near_pass`,{p:Bh(t),d:Math.max(1,Math.ceil((n.payout.passAt-t)*100))});else if(t<1){let[e,n]=Hh.find(([e])=>e>t+1e-9),r=Math.max(1,Math.ceil(e*h-1e-9)-a.litCount);n===10?g=r===1?I(`near_full_1`,{p:Bh(t)}):I(`near_full_n`,{p:Bh(t),k:r}):r<=3&&(g=r===1?I(`near_plate_1`,{p:Bh(t),m:n}):I(`near_plate_n`,{p:Bh(t),k:r,m:n}))}p.reason===`adblock`&&(g=I(`adblock_notice`));let v=G.showResult({kind:o?`win`:`fail`,mode:me(),title:t>=1?I(`full_power`):I(o?`city_cleared`:`city_dark`,{p:Bh(t)}),plates:Hh.map(([e,t])=>({at:e,mult:t,on:t===r.mult})),stats:[I(`stat_lit`,{a:a.litCount,b:h}),I(`stat_blocks`,{a:a.districtsDone,b:a.city.districts.length}),I(`stat_chain`,{n:a.bestChain})],amount:s,crate:r.mult>1?I(`jackpot`,{m:r.mult}):``,buttons:[o?{id:`claim`,label:I(`claim`)}:{id:`retry`,label:I(`retry`)},m?{id:`claim_x`,label:I(`claim_x`,{m:3}),video:!0}:null],note:g});m&&K.offer(`level-complete-x3`);let y=!1;v.onChoice(async e=>{if(W.play(`click`),e===`claim_x`){v.lock(!0);let e=await K.rewarded({context:`level-complete-x3`,grant:()=>{U.update(e=>{e.coins+=s*2}),v.setAmount(s*3)}});if(v.lock(!1),e.shown)return y=!0,U.flush(),W.play(`coin`),await Rh(450),x();v.hideButton(`claim_x`),v.setNote(e.reason===`adblock`?I(`adblock_notice`):I(`no_video`));return}x()});async function x(){G.coinsFly(v.amountElement,s),G.setCoins(U.data.coins,{animate:!0}),v.close(),await Rh(250),c>=e.firstMidgameLevel&&!y&&await K.midgame({context:o?`level-complete-next`:`retry`}),K.endBreak(),l=!1,_&&(G.toast(I(`trial_over`,{name:I(`skin_${_}`)})),_=null,fe()),he(o?c+1:c),H.release(d.MENU),ge()}}let Ee=()=>({available:K.rewardedAvailability.ok,now:Date.now()});function De(e,t){t&&!V.get(e)&&K.offer(e),V.set(e,t)}function Oe(){let e=Ee(),n=Vh.map(t=>{let n=Gu(t,U.data);return{kind:t,title:I(`up_${t}`),level:U.data[Wu[t].key]+1,cost:n,affordable:n!==null&&U.data.coins>=n,maxed:n===null,free:id(t,U.data,e)}}),r=t.maxVideoOffersPerScreen-+!!ke()?.video;return n.filter(e=>e.free.visible).sort((e,t)=>e.cost-t.cost).slice(Math.max(0,r)).forEach(e=>{e.free={visible:!1}}),n}function ke(){let e=rd(U.data,{available:K.rewardedAvailability.ok,due:g,boostedThisRun:l});if(!e.visible&&!e.coin)return null;let t=I(`start_boost`,{n:e.strikes});return{video:e.visible?{label:t}:null,coin:e.coin?{label:t,cost:e.cost,affordable:e.affordable}:null}}function Ae(){return sd(U.data,{available:K.rewardedAvailability.ok,now:Date.now(),resultsThisSession:b})}function je(){if(a?.phase!==`ready`)return;let e=G.readyInsets();de.setSafeArea({top:e.top+10,bottom:e.bottom+10,left:e.left+10,right:e.right+10})}function Me(){if(!a||a.phase!==`ready`||G.shopOpen)return;let e=U.data.wins>0?Oe():null;G.showUpgrades(e),De(`free-upgrade`,!!e?.some(e=>e.free.visible));let t=ke();G.showBoost(t),De(`ready-boost`,!!t?.video),G.showShopButton(U.data.runs>0),G.showGift(Ae().visible),requestAnimationFrame(je)}function Ne(){if(G.shopOpen){G.updateShop(ze());return}if(a?.phase!==`ready`||H.reasons.length)return;let e=ke();!!e?.video!=!!V.get(`ready-boost`)&&(G.showBoost(e),De(`ready-boost`,!!e?.video)),je()}function Pe(e){U.update(t=>{t[Wu[e].key]++}),a.phase===`ready`&&he(i),W.play(`tier`,{pitch:1.2}),Me(),G.popUpgrade(e,I(`up_fx_${e}`))}function Fe(){l=!0,_u(a,t.boostStrikes),G.setStrikes(a.strikesLeft,a.strikesMax),G.floatText(se.size.width/2,se.size.height*.45,I(`boosted`,{n:t.boostStrikes}),`gold`),W.play(`tier`,{pitch:1.35})}async function Ie(){if(a.phase!==`ready`||l||H.has(d.AD)||H.has(d.MENU))return;let e=await K.rewarded({context:`ready-boost`,grant:Fe});e.shown||G.toast(e.reason===`adblock`?I(`adblock_notice`):I(`no_video`)),U.flush(),Me()}function Le(e){if(a.phase!==`ready`||l||H.has(d.AD)||H.has(d.MENU))return;let t=rd(U.data,{available:!1,due:g,boostedThisRun:l});if(t.coin){if(U.data.coins<t.cost){W.play(`gateBad`,{volume:.5}),G.shakeElement(e),G.toast(I(`need_coins`));return}U.update(e=>{e.coins-=t.cost}),G.setCoins(U.data.coins,{animate:!0}),Fe(),U.flush(),Me()}}function Re(){let e=Ae();if(!e.visible||a.phase!==`ready`||G.shopOpen||G.modalOpen||H.has(d.AD)||H.has(d.MENU))return;H.hold(d.MENU),G.showGift(!1),G.showUpgrades(null),G.showBoost(null),G.showShopButton(!1),V.delete(`ready-boost`),V.delete(`free-upgrade`),W.play(`click`);let t=G.showResult({kind:`win`,mode:I(`gift_mode`,{n:e.streak,m:e.mult.toFixed(2).replace(/\.?0+$/,``)}),title:I(`gift_title`),amount:e.amount,buttons:[{id:`collect`,label:I(`collect`)},e.video?{id:`collect_x`,label:I(`collect_x`,{m:e.factor}),video:!0}:null],note:K.rewardedAvailability.reason===`adblock`?I(`adblock_notice`):I(`gift_note`,{n:Math.min(7,e.streak+1)})});e.video&&K.offer(`daily-gift`);let n=e.amount,r=()=>U.update(t=>{t.lastGiftDay=e.day,t.giftStreak=e.streak});t.onChoice(async a=>{if(a===`collect_x`){t.lock(!0);let a=await K.rewarded({context:`daily-gift`,grant:()=>{n=e.amount*e.factor,U.update(e=>{e.coins+=n}),r(),t.setAmount(n)}});if(t.lock(!1),a.shown)return W.play(`coin`),await Rh(450),i();t.hideButton(`collect_x`),t.setNote(a.reason===`adblock`?I(`adblock_notice`):I(`no_video`));return}W.play(`click`),e.video&&K.offer(`daily-gift`,`declined`),U.update(e=>{e.coins+=n}),r(),i()});function i(){U.flush(),G.coinsFly(t.amountElement,n),G.setCoins(U.data.coins,{animate:!0}),t.close(),H.release(d.MENU),Me()}}function ze(){let e=Ee(),t=Hu(U.data),n=ad(U.data,e),r=t!==null&&U.data.coins<t,i=y&&!U.data.owned.includes(y)?y:null,a=od(U.data,i,{available:e.available,trialActive:!!_}),o=``;t===null?o=I(`all_skins`):i&&U.data.tried.includes(i)?o=I(`tried_already`):a?o=I(`try_once`):r&&K.rewardedAvailability.reason===`adblock`?o=I(`adblock_notice`):r&&e.available&&n.cooldown>0&&(o=I(`free_coins_in`,{t:zh(n.cooldown)}));let s=i||_||U.data.skin;return{title:I(`skins`),count:I(`owned_count`,{a:U.data.owned.length,b:Ru.length}),skins:Ru.map(e=>({id:e.id,name:I(`skin_${e.id}`),color:e.glow,owned:U.data.owned.includes(e.id),selected:U.data.skin===e.id,preview:e.id===i})),name:`${I(`skin_${s}`)}${i?` · ${I(`locked`)}`:``}`,unlock:t===null?null:{label:I(`unlock_random`),cost:t,affordable:!r},tryIt:a?{label:I(`try_it`)}:null,cash:n.visible?{amount:n.amount}:null,note:o}}function Be(){if(a.phase!==`ready`||G.shopOpen||H.has(d.AD)||H.has(d.MENU))return;H.hold(d.MENU),G.showHome(!1),G.showUpgrades(null),G.showBoost(null),G.showShopButton(!1),V.delete(`ready-boost`),y=null,G.showGift(!1);let e=ze();G.openShop(e),De(`shop-cash`,!!e.cash),W.play(`click`)}function Ve(){G.shopOpen&&!H.has(d.AD)&&(G.closeShop(),V.delete(`shop-cash`),V.delete(`try-skin`),y=null,H.release(d.MENU),W.play(`click`),ge())}function He(e){U.data.owned.includes(e)&&U.data.skin!==e&&!H.has(d.AD)&&(U.update(t=>{t.skin=e}),y=null,fe(),W.play(`pop`,{pitch:1.2}),G.updateShop(ze()),De(`try-skin`,!1))}function Ue(e){if(U.data.owned.includes(e)||H.has(d.AD))return;y=y===e?null:e,W.play(`pop`,{pitch:.9});let t=ze();G.updateShop(t),De(`try-skin`,!!t.tryIt)}async function We(){let e=y;if(!od(U.data,e,{available:K.rewardedAvailability.ok,trialActive:!!_})||H.has(d.AD))return;let t=await K.rewarded({context:`try-skin`,grant:()=>{_=e,U.update(t=>{t.tried=[...t.tried,e]}),fe()}});if(U.flush(),t.shown){W.play(`tier`,{pitch:1.3}),G.toast(I(`trying`,{name:I(`skin_${e}`)})),y=null,Ve();return}G.toast(t.reason===`adblock`?I(`adblock_notice`):I(`no_video`)),G.updateShop(ze())}function Ge(e){let t=Hu(U.data);if(t===null||H.has(d.AD))return;if(U.data.coins<t){W.play(`gateBad`,{volume:.5}),G.shakeElement(e),G.toast(I(`need_coins`));return}let n=Uu(U.data,Math.random);U.update(e=>{e.coins-=t,e.owned.push(n),e.skin=n}),U.flush(),y=null,_===n&&(_=null),G.setCoins(U.data.coins,{animate:!0}),fe(),G.updateShop(ze()),De(`shop-cash`,!!ze().cash),G.popSwatch(n),W.play(`tier`,{pitch:1.3}),G.toast(I(`new_skin`))}async function Ke(e){let t=ad(U.data,Ee());if(!t.visible||H.has(d.AD))return;let n=await K.rewarded({context:`shop-cash`,grant:()=>{U.update(e=>{e.coins+=t.amount,e.lastCashAt=Date.now()})}});n.shown?(G.coinsFly(e,t.amount),G.setCoins(U.data.coins,{animate:!0}),W.play(`coin`)):G.toast(n.reason===`adblock`?I(`adblock_notice`):I(`no_video`)),U.flush(),G.updateShop(ze()),V.set(`shop-cash`,!!ze().cash)}function qe(e){if(a.phase!==`ready`||H.has(d.AD))return;let t=Gu(e,U.data);if(t!==null){if(U.data.coins<t){W.play(`gateBad`,{volume:.5});return}U.update(e=>{e.coins-=t}),G.setCoins(U.data.coins,{animate:!0}),Pe(e)}}async function Je(e){if(a.phase!==`ready`||H.has(d.AD))return;let t=await K.rewarded({context:`free-upgrade`,grant:()=>{U.update(e=>{e.lastFreeUpgradeAt=Date.now()}),Pe(e)}});t.shown||G.toast(t.reason===`adblock`?I(`adblock_notice`):I(`no_video`)),U.flush(),Me()}function Ye(){let e=W.toggleUserMute();U.update(t=>{t.userMuted=e.userMute}),G.setSound(W.state),e.lockedByPlatform&&G.toast(I(`muted_by_platform`))}W.onChange(e=>G.setSound(e)),H.onChange(({reasons:e})=>{let t=e.length>0;ue.setSimPaused(t),W.setHiddenMute(e.includes(d.HIDDEN)),t&&(B.down=!1,B.id=null),!t&&a?.phase===`run`&&(c=0,ue.timeScale=.25)}),p(H,{onHide:()=>{U.update(e=>{e.lastSeenAt=Date.now(),a&&(e.bestChain=Math.max(e.bestChain,a.bestChain))}),U.flush()},interactionTarget:r});async function Xe(e){let t=document.getElementById(`ui`);t.classList.add(`marketing`),document.getElementById(`boot`).classList.add(`done`),G.showHome(!1);let n=(Lh.get(`capture_up`)||``).split(`,`).map(Number);if(n.length===5&&n.every(Number.isFinite)&&([U.data.upVoltage,U.data.upFork,U.data.upStrikes,U.data.upCapacitor,U.data.upGold]=n),he(Number(Lh.get(e?`cover_level`:`capture_level`)||8)),gu(a),G.showRoundHud(!e),e){t.classList.add(`cover`),t.appendChild(Ld(I(`title`),e));let n=Number(Lh.get(`cover_share`)||.9);for(let e=0;e<2400&&a.phase===`run`&&($l(a,re),Su(a,1/60,re),!(pu(a)>=n));e++);ue.setSimPaused(!0),de.coverShot(a,e),ue.start(),await Rh(1200),window.__GS_COVER_READY__=!0;return}a.events.length=0,de.snapCamera(a);let r=0,o=Number(Lh.get(`capture_next`)||0),s=0;window.__GS_CAPTURE__={frame(e=1/30){o&&i!==o&&a.phase===`won`&&(s+=e)>=2.2&&(he(o),gu(a),a.events.length=0,de.snapCamera(a));let t=Math.max(1,Math.round(e*60));for(let e=0;e<t;e++)$l(a,re),Su(a,1/60,re);return L=re.aim,de.aim.index=L,de.aim.visible=a.phase===`run`,se.resize(),de.update(a,1,e),we(),G.update(e),se.render(),{frame:++r,phase:a.phase,progress:pu(a)}}}}let Ze=Lh.get(`cover`);if(Ze||Lh.get(`capture`)===`1`)return Xe(Ze);let Qe=Lh.get(`qa`)===`1`,$e=Qe?Number(Lh.get(`level`)):0;if(Qe&&Number(Lh.get(`runs`))>0&&U.update(e=>{e.runs=Math.max(e.runs,Number(Lh.get(`runs`)))}),Qe&&Lh.has(`coins`)&&U.update(e=>{e.coins=Math.max(0,Number(Lh.get(`coins`))||0)}),Qe&&Number(Lh.get(`wins`))>0&&U.update(e=>{e.wins=Math.max(e.wins,Number(Lh.get(`wins`)))}),Qe&&Lh.has(`up`)){let e=Lh.get(`up`).split(`,`).map(e=>Math.max(0,Number(e)||0));U.update(t=>{[`voltage`,`fork`,`strikes`,`capacitor`,`gold`].forEach((n,r)=>{t[Wu[n].key]=Math.min(Wu[n].max,e[r]||0)})})}if(he($e>0?$e:U.data.level),se.resize(),de.snapCamera(a),G.setCoins(U.data.coins),G.setSound(W.state),ue.start(),ie.reportCompletion(Qu(U.data.bestLevel)),ie.loadingStop(),H.release(d.BOOT),document.getElementById(`boot`).classList.add(`done`),ge(),W.preload(),Qe){let e=[];for(let[t,n]of[[W,`play`],[G,`floatText`]]){let r=t[n].bind(t);t[n]=(...t)=>(e.push([Math.round(performance.now()),n,t[0]]),r(...t))}window.__GS_QA__={get state(){return{phase:a.phase,level:i,progress:pu(a),lit:a.litCount,buildings:a.city.buildings.length,simT:a.t,strikesLeft:a.strikesLeft,strikesMax:a.strikesMax,holding:a.holding,charge:a.charge,bolts:a.bolts.length,score:a.score,bestChain:a.bestChain,districtsDone:a.districtsDone,aim:L,inputMode:R,paused:P,coins:U.data.coins,pause:H.reasons,gameplayReported:ae.reported,firstGameplayStartMs:ae.firstStartMs,audio:W.state,save:U.status,platform:{name:ie.name,environment:ie.environment},fps:ue.stats.fps,pixelRatio:se.renderer.getPixelRatio(),adsLog:K.log,gameplayHistory:ae.history,runs:U.data.runs,skin:U.data.skin,owned:[...U.data.owned],boosted:l,shopOpen:G.shopOpen,trialSkin:_,tried:[...U.data.tried],boostDue:g,giftDay:U.data.lastGiftDay,giftStreak:U.data.giftStreak,upgrades:Ku(U.data),bestLevel:U.data.bestLevel}},reviveAt:Math.min(.99,t.reviveMinProgress+.05),feedback:e,start:_e,setAutopilot(e){S=!!e},setHold(e){w=e===null?null:!!e},setAim(e=-1){return L=e>=0?e:Ql(a),L},freeze(e){M(!!e)},get frozen(){return D},freezeWhen(e){k=t=>e.charge!==void 0&&t.holding&&t.charge>=e.charge||e.bolts!==void 0&&t.bolts.length>=e.bolts||e.district!==void 0&&t.districtsDone>e.district},forceWin(){Pu(a)},forceFail(e=0){Fu(a,e)},renderInfo:()=>({...se.renderer.info.render,geometries:se.renderer.info.memory.geometries,textures:se.renderer.info.memory.textures,shadowBake:!!window.__GS_LOOK__?.info?.().shadowBake}),sceneStats(){let e=new Map;se.scene.traverse(t=>{if(!(t.isMesh||t.isPoints)||!t.geometry?.attributes?.position)return;let n=t.geometry,r=t.isPoints?0:Math.round((n.index?n.index.count:n.attributes.position.count)/3),i=e.get(n.uuid)||{name:t.name||n.type,triangles:r,instances:0};i.instances+=t.isInstancedMesh?t.count:1,e.set(n.uuid,i)});let t=[...e.values()].sort((e,t)=>t.triangles-e.triangles);return{geometries:t.length,maxGeometryTriangles:t[0]?.triangles??0,heaviest:t.slice(0,6),all:t}}}}}Uh().catch(e=>{console.error(`[boot] failed`,e)});