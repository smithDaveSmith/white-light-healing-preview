(() => {
  'use strict';
  const intro=document.querySelector('#arrival-intro');
  if(!intro)return;
  const root=document.documentElement,storageKey='wlh-arrival-v3';
  const ready=document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true})):Promise.resolve();
  const modes={
    touch:{number:'01 / TOUCH',name:'A pause, from the ground up.',copy:'Foot, facial, maternity and family reflexology, tailored with Caroline.',link:'/reflexology/',label:'Explore reflexology'},
    scent:{number:'02 / SCENT',name:'A small ritual to take home.',copy:'Personal aromatherapy blends, rollerballs and aroma sticks to take home.',link:'/aromatherapy/',label:'Explore aromatherapy'},
    stillness:{number:'03 / STILLNESS',name:'A little room, just to be.',copy:'Reiki, head massage and combinations. Discuss the right session with Caroline.',link:'/holistic-therapies/',label:'Explore holistic care'}
  };
  let visualChoice=null,visualTime=null,openAgain=null,closeNow=null;
  let activeChoice='touch';
  function revealMobileChoice(){
    if(!matchMedia('(max-width:760px)').matches)return;
    const art=document.querySelector('.light-table').getBoundingClientRect();
    const controls=document.querySelector('.pause-buttons').getBoundingClientRect();
    const vv=window.visualViewport;
    const top=Math.max(document.querySelector('.site-header').getBoundingClientRect().bottom,vv?.offsetTop||0)+12;
    const bottom=(vv?.offsetTop||0)+(vv?.height||innerHeight)-12;
    const first=Math.min(art.top,controls.top),last=Math.max(art.bottom,controls.bottom);
    // A deliberate choice reveals its result with the smallest native scroll.
    // Do nothing when image and controls are already visible; never move focus.
    if(last-first>bottom-top)return;
    const delta=first<top?first-top:last>bottom?last-bottom:0;
    if(Math.abs(delta)>1)window.scrollBy({top:delta,behavior:'auto'});
  }
  function updateChoice(key){
    if(!modes[key])return;
    activeChoice=key;
    document.querySelector('[data-light-table]').dataset.currentPause=key;
    const m=modes[key];
    document.querySelectorAll('[data-pause]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.pause===key)));
    document.querySelector('[data-pause-number]').textContent=m.number;
    document.querySelector('[data-pause-name]').textContent=m.name;
    document.querySelector('[data-pause-explanation]').textContent=m.copy;
    const link=document.querySelector('[data-pause-link]');
    link.href=m.link;link.innerHTML=m.label+' <span aria-hidden="true">↗</span>';
    if(visualChoice)visualChoice(key,true);
    revealMobileChoice();
  }
  ready.then(()=>{
    document.querySelectorAll('[data-pause]').forEach(button=>{button.disabled=false;button.addEventListener('click',()=>updateChoice(button.dataset.pause));});
    const replay=document.querySelector('[data-replay-intro]');
    replay?.addEventListener('click',()=>openAgain?.());
  });
  intro.querySelector('[data-skip-intro]').addEventListener('click',()=>closeNow?.('skipped'));
  intro.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();closeNow?.('skipped');}
    if(event.key==='Tab'){event.preventDefault();intro.querySelector('[data-skip-intro]').focus();}
  });
  document.addEventListener('wlh:time-change',event=>visualTime?.(event.detail.minutes));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)closeNow?.('visibility');});
  if(!window.gsap)return;
  const mm=gsap.matchMedia();
  mm.add({desktop:'(min-width:761px)',mobile:'(max-width:760px)',reduce:'(prefers-reduced-motion:reduce)'},context=>{
    const ease='power2.out',reduce=context.conditions.reduce;
    let destroyed=false,active=false,closing=false,introTimeline=null,oldOverflow='',heroEntered=false;
    let exitTweens=[];
    const timers=new Set();
    function later(fn,ms){const id=setTimeout(()=>{timers.delete(id);if(!destroyed)fn();},ms);timers.add(id);return id;}
    function setInert(value){
      document.querySelectorAll('.site-header,main,.site-footer,.concept,.skip').forEach(el=>{
        if(value&&!el.inert){el.inert=true;el.dataset.introInert='true';}
        else if(!value&&el.dataset.introInert){el.inert=false;delete el.dataset.introInert;}
      });
    }
    function poses(key){
      const others=Object.keys(modes).filter(x=>x!==key),result={};
      result[key]={x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationY:0,zIndex:3};
      if(context.conditions.mobile){
        result[others[0]]={x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationY:0,zIndex:1};
        result[others[1]]={x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationY:0,zIndex:2};
        return result;
      }
      result[others[0]]={x:0,y:0,xPercent:-20,yPercent:0,rotation:-24,rotationY:0,zIndex:1};
      result[others[1]]={x:0,y:0,xPercent:20,yPercent:0,rotation:24,rotationY:0,zIndex:2};
      return result;
    }
    context.add('choose', (key,animate=false)=>{
      const p=poses(key);
      document.querySelectorAll('[data-light-leaf]').forEach(el=>{
        const dest=p[el.dataset.lightLeaf];
        gsap.set(el,{zIndex:dest.zIndex,transformOrigin:'50% 100%'});
        if(animate&&!reduce&&context.conditions.mobile&&el.dataset.lightLeaf===key){
          gsap.fromTo(el,{...dest,y:6},{...dest,y:0,duration:.35,ease,overwrite:true});
        }
        else if(animate&&!reduce&&!context.conditions.mobile)gsap.to(el,{...dest,duration:.9,ease,overwrite:true});
        else gsap.set(el,dest);
      });
    });
    context.add('enterHero',(animate=true)=>{
      if(heroEntered)return;heroEntered=true;
      context.choose(activeChoice,false);
      if(animate&&!reduce){
        gsap.from('.arrival-copy h1>span',{y:context.conditions.mobile?18:35,stagger:.1,duration:.85,ease,clearProps:'all'});
        if(!context.conditions.mobile){
        const p=poses(activeChoice);
        document.querySelectorAll('[data-light-leaf]').forEach((el,i)=>{
          gsap.fromTo(el,{x:0,y:0,xPercent:0,yPercent:16,rotation:0,rotationY:45,scale:.82},{...p[el.dataset.lightLeaf],scale:1,duration:1.05,delay:i*.08,ease,overwrite:true});
        });
        gsap.from('.light-disc',{scale:.78,duration:1,ease,clearProps:'transform'});
        }
      }
    });
    function finish(reason='complete'){
      if(!active)return;
      active=false;closing=false;
      timers.forEach(clearTimeout);timers.clear();introTimeline?.kill();exitTweens.forEach(t=>t.kill());exitTweens=[];
      intro.hidden=true;setInert(false);root.style.overflow=oldOverflow;
      root.dataset.introState='closed';root.dataset.introReason=reason;
      const focusWasInside=intro.contains(document.activeElement);
      ready.then(()=>{if(!destroyed){context.enterHero(reason==='complete');if(focusWasInside&&!document.hidden)document.querySelector('#opening-title')?.focus({preventScroll:true});}});
    }
    context.add('closeIntro',()=>{
      if(!active||closing)return;closing=true;root.dataset.introState='closing';
      intro.querySelector('[data-intro-message]').textContent='A little room. All yours.';
      exitTweens.push(gsap.to('.intro-centre,.intro-top,.intro-bottom',{opacity:0,y:-12,duration:.35,ease}));
      exitTweens.push(gsap.set(intro,{backgroundColor:'transparent',delay:.35}));
      exitTweens.push(gsap.to('.intro-shutters>span',{yPercent:-103,stagger:.1,duration:.75,delay:.35,ease,onComplete:()=>finish('complete')}));
      later(()=>finish('complete'),1350);
    });
    context.add('openIntro',()=>{
      if(active||reduce||destroyed)return;
      active=true;closing=false;heroEntered=false;
      const started=Date.now();
      try{sessionStorage.setItem(storageKey,'seen');}catch{}
      oldOverflow=root.style.overflow;root.style.overflow='hidden';
      intro.hidden=false;root.dataset.introState='open';delete root.dataset.introReason;
      later(()=>finish('timeout'),5400);
      const openedAtWidth=innerWidth;
      const guardWidth=()=>{if(!active)return;if(innerWidth!==openedAtWidth){finish('resize');return;}later(guardWidth,120);};
      later(guardWidth,120);
      gsap.set(intro,{backgroundColor:'var(--plum)'});
      gsap.set('.intro-centre,.intro-top,.intro-bottom',{opacity:1,y:0});
      gsap.set('.intro-shutters>span',{yPercent:0});
      intro.querySelector('[data-intro-message]').textContent='Preparing a little space.';
      intro.querySelector('[data-skip-intro]').focus({preventScroll:true});
      introTimeline=gsap.timeline({defaults:{ease}})
        .fromTo('.intro-rays>span',{scaleY:.02,rotation:0},{scaleY:1,rotation:i=>(i-1)*30,duration:1.1,stagger:.07})
        .fromTo('.intro-emblem',{y:15,opacity:0},{y:0,opacity:1,duration:.7},.15)
        .fromTo('#intro-title>span,#intro-title>em',{y:25,opacity:0},{y:0,opacity:1,duration:.8,stagger:.1},.35);
      ready.then(async()=>{
        if(!active||destroyed)return;setInert(true);
        const images=[...document.querySelectorAll('.light-leaf img')];
        await Promise.allSettled([document.fonts?.ready||Promise.resolve(),...images.map(img=>img.decode?img.decode():Promise.resolve())]);
        if(active&&!closing&&!destroyed)later(()=>context.closeIntro(),Math.max(0,1900-(Date.now()-started)));
      });
      later(()=>context.closeIntro(),3800);
    });
    const atDesktop=context.conditions.desktop;
    const releaseAtResize=()=>{if((innerWidth>=761)!==atDesktop)finish('resize');};
    const preference=matchMedia('(prefers-reduced-motion:reduce)');
    const releaseAtPreference=event=>{if(event.matches)finish('reduced-motion');};
    window.addEventListener('resize',releaseAtResize);
    preference.addEventListener('change',releaseAtPreference);
    closeNow=finish;
    openAgain=()=>context.openIntro();
    ready.then(()=>{
      if(destroyed)return;
      const replay=document.querySelector('[data-replay-intro]');
      if(replay)replay.hidden=reduce;
      visualChoice=(key,animate)=>context.choose(key,animate);
      context.choose(activeChoice,false);
      if(!reduce){
        context.add('changeTime',minutes=>gsap.to('.light-disc',{scale:minutes===90?1.08:1,duration:.9,ease,overwrite:true}));
        visualTime=minutes=>context.changeTime(minutes);
      }
      if(!active)context.enterHero(!reduce);
    });
    let seen=false;try{seen=sessionStorage.getItem(storageKey)==='seen';}catch{}
    if(reduce){intro.hidden=true;root.dataset.introState='reduced';try{sessionStorage.setItem(storageKey,'seen');}catch{}}
    else if(!seen)context.openIntro();
    else root.dataset.introState='closed';
    return()=>{
      if(active)finish('preference-or-resize');
      window.removeEventListener('resize',releaseAtResize);
      preference.removeEventListener('change',releaseAtPreference);
      destroyed=true;timers.forEach(clearTimeout);timers.clear();introTimeline?.kill();exitTweens.forEach(t=>t.kill());exitTweens=[];
      intro.hidden=true;setInert(false);visualChoice=null;visualTime=null;openAgain=null;closeNow=null;
    };
  });
})();
