(() => {
  'use strict';
  const query = new URLSearchParams(location.search);
  if (location.pathname === '/white-light-healing-preview/' && query.get('post_type') === 'post') { location.replace('/white-light-healing-preview/journal/'); return; }
  const legacy = {'/white-light-healing-preview/what-is-reflexology/':'/white-light-healing-preview/reflexology/','/white-light-healing-preview/new-page-template/':'/white-light-healing-preview/','/white-light-healing-preview/services/foot-reflexology/':'/white-light-healing-preview/reflexology/#foot-reflexology','/white-light-healing-preview/2026/04/14/example-blog-post-for-reflexology/':'/white-light-healing-preview/2026/05/29/your-first-reflexology-treatment/','/white-light-healing-preview/blog/':'/white-light-healing-preview/journal/','/white-light-healing-preview/privacy-policy/':'/white-light-healing-preview/privacy/','/white-light-healing-preview/home/':'/white-light-healing-preview/'};
  if (legacy[location.pathname]) { location.replace(legacy[location.pathname]); return; }
  document.querySelectorAll('.mobile-menu').forEach(menu => menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  }));
  const form = document.querySelector('#contact-draft');
  if (form) {
    const topic = form.querySelector('#topic');
    if ([...topic.options].some(o => o.value === query.get('topic'))) topic.value = query.get('topic');
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = 'White Light Healing enquiry — ' + topic.options[topic.selectedIndex].text;
      const body = ['Hello Caroline,','',String(data.get('message')).trim(),'','From: '+String(data.get('name')).trim(),'Email: '+String(data.get('email')).trim(),data.get('phone')?'Phone: '+String(data.get('phone')).trim():''].filter((s,i)=>s||i<4).join('\n');
      const link = document.querySelector('#draft-link');
      link.href = 'mailto:whitelighthealing@hotmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
      document.querySelector('#draft-result').hidden = false;
      document.querySelector('#draft-status').textContent = 'Your draft is ready. Open it in your email app to review and send.';
      link.focus();
    });
  }
  const scene = document.querySelector('[data-parent-session]');
  const moments = {
    asleep:{index:0,kicker:'WHILE BABY RESTS',title:'Your pause.\nA little learning, too.',copy:'While baby is settled, your reflexology can come first. Learn the baby techniques with a demonstration doll.',firstTitle:'Time for you',firstCopy:'Your own reflexology while baby is settled or asleep.',secondTitle:'Learn with a doll',secondCopy:'Caroline demonstrates the baby techniques without waking your little one.'},
    awake:{index:1,kicker:'WHEN BABY IS READY',title:'Little discoveries.\nTogether.',copy:'Practise gentle baby-reflexology techniques with Caroline’s guidance, and take home notes to revisit what you’ve learned.',firstTitle:'Try it together',firstCopy:'Caroline guides you as you practise gentle techniques with your baby.',secondTitle:'Take it with you',secondCopy:'Your take-home notes help you revisit the techniques in your own time.'},
    comfort:{index:2,kicker:'WHEN A CUDDLE COMES FIRST',title:'Close to you.\nJust as you are.',copy:'Feed or comfort baby close to you in Caroline’s zero-gravity chair. The session adapts around you both.',firstTitle:'Keep baby close',firstCopy:'Room to feed or comfort your little one in the zero-gravity chair.',secondTitle:'Follow your rhythm',secondCopy:'Caroline adapts the session around you and your baby.'}
  };
  let animateMoment=null, animateTime=null;
  const currentMoment=()=>moments[scene?.querySelector('input:checked')?.value||'asleep'];
  function applyMoment(value){
    const m=moments[value];if(!scene||!m)return;
    scene.dataset.moment=value;scene.style.setProperty('--moment-index',m.index);
    const fields={kicker:m.kicker,title:m.title,copy:m.copy,'first-title':m.firstTitle,'first-copy':m.firstCopy,'second-title':m.secondTitle,'second-copy':m.secondCopy};
    for(const [key,text] of Object.entries(fields))scene.querySelector('[data-moment-'+key+']').textContent=text;
    if(animateMoment)animateMoment(m);
  }
  if(scene)scene.querySelectorAll('input[name="parent-moment"]').forEach(input=>{
    input.disabled=false;input.addEventListener('change',()=>applyMoment(input.value));
  });
  const timeInputs = [...document.querySelectorAll('input[name="pause-time"]')];
  const sessionMenu = {60:{price:'€75',id:'39361958'},90:{price:'€110',id:'39362253'}};
  timeInputs.forEach(input => {
    input.disabled = false;
    input.addEventListener('change', () => {
      const chosen = sessionMenu[input.value];
      document.querySelector('[data-time-price]').textContent = chosen.price;
      document.querySelector('[data-time-description]').textContent = input.value+' minutes of reflexology';
      const bookLink = document.querySelector('[data-time-book]');
      bookLink.href = 'https://whitelighthealingcarolinemurray.as.me/schedule/a3770af6/?appointmentType='+chosen.id;
      bookLink.setAttribute('aria-label','View '+input.value+'-minute reflexology in the real booking calendar');
      document.dispatchEvent(new CustomEvent('wlh:time-change',{detail:{minutes:Number(input.value)}}));
      if (animateTime) animateTime(Number(input.value));
    });
  });
  if (!window.gsap) return;
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add({desktop:'(min-width: 761px)',mobile:'(max-width: 760px)',reduce:'(prefers-reduced-motion: reduce)'}, context => {
    if (context.conditions.reduce) {
      return;
    }
    const ease = 'power2.out', mobile = context.conditions.mobile;
    const opening = gsap.timeline({defaults:{ease,duration:.9}});
    if (document.querySelector('.light-heading')) {
      opening.from('.light-heading h1 > *',{y:mobile?18:36,opacity:0,stagger:.12,clearProps:'all'})
        .from('.wide-treatment img',{scale:1.12,opacity:.3,clearProps:'all'},.15)
        .from('.light-invitation > *',{y:14,opacity:0,stagger:.06,clearProps:'all'},.3)
        .from('.light-rings ellipse',{strokeDasharray:'1 1800',strokeDashoffset:900,stagger:.015,duration:1.1,clearProps:'strokeDasharray,strokeDashoffset'},.1);
      const ringGroup = document.querySelector('[data-light-rings]');
      const currentTime = Number(document.querySelector('input[name="pause-time"]:checked').value);
      gsap.set(ringGroup,{scale:currentTime===90?1.13:1,rotation:currentTime===90?7:0,transformOrigin:'50% 50%'});
      context.add('changeTime', minutes => {
        gsap.to(ringGroup,{scale:minutes===90?1.13:1,rotation:minutes===90?7:0,duration:.9,ease,overwrite:true});
        gsap.fromTo('.time-price',{y:7},{y:0,duration:.45,ease,clearProps:'transform'});
        gsap.to('.wide-treatment img',{objectPosition:minutes===90?'50% 67%':'50% 57%',duration:.9,ease,overwrite:true});
      });
      animateTime = minutes => context.changeTime(minutes);
    } else if (document.querySelector('.page-hero')) {
      opening.from('.page-hero h1',{y:mobile?12:22,opacity:0,clearProps:'all'});
    }
    gsap.utils.toArray('[data-image-reveal]').forEach(el => {
      gsap.from(el.querySelector('img'),{scale:1.08,y:mobile?8:18,duration:1,ease,clearProps:'all',scrollTrigger:{trigger:el,start:'top 92%',once:true}});
    });
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      gsap.from(el,{y:mobile?8:16,opacity:0,duration:.65,ease,clearProps:'all',scrollTrigger:{trigger:el,start:'top 93%',once:true}});
    });
    if (scene) {
      const indicator=scene.querySelector('.moment-indicator');
      gsap.set(indicator,{xPercent:currentMoment().index*100});
      context.add('changeMoment',m=>{
        gsap.to(indicator,{xPercent:m.index*100,duration:.5,ease,overwrite:true});
        gsap.fromTo(scene.querySelector('.moment-response'),{y:8},{y:0,duration:.55,ease,clearProps:'transform',overwrite:true});
      });
      animateMoment=m=>context.changeMoment(m);
    }
    return () => { animateMoment=null; animateTime=null; };
  });
})();
