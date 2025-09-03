gsap.registerPlugin(ScrollTrigger); // ScrollTrigger를 사용한다는 선언

// 부드러운 스크롤 효과
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// HEADER
const headerEl = document.querySelector('header');
const headerMenuEls = document.querySelectorAll('header .menu a'); 
const menuToggleEl = document.querySelector('header .menu-toggle');
const mobileHeaderMenuEls = document.querySelectorAll('header .m-menu a'); 
const sectionEls = document.querySelectorAll('section'); 

// 스크롤시 섹션에 따라 헤더가 변경되는 효과
window.addEventListener('scroll', () => {
  let current = '';
  
  sectionEls.forEach((el) => {
    const sectionTop = window.scrollY + el.getBoundingClientRect().top; // getBoundingClientRect() : 현재 보이는 화면 기준으로 좌표값 반환
    const sectionHeight = el.clientHeight; // clientHeight : padding을 포함한 높이
    
    if (window.scrollY >= sectionTop - sectionHeight/15) {
      current = el.getAttribute('id');

      if (window.scrollY <= 0) {
        headerEl.classList.remove('header--black');
      } else if (el.classList.contains('bg--black')) {
        headerEl.classList.remove('header--black');
        headerEl.classList.add('header--white');
      } else {
        headerEl.classList.remove('header--white');
        headerEl.classList.add('header--black');
      }
    }
  });

  headerMenuEls.forEach((el) => {
    el.classList.remove('active');
    const href = el.getAttribute('href').substring(1);
    
    if (href === current) {
      el.classList.add('active')
    }
  });

  mobileHeaderMenuEls.forEach((el) => {
    el.classList.remove('active');
    const href = el.getAttribute('href').substring(1);
    
    if (href === current) {
      el.classList.add('active')
    }

    if (headerEl.classList.contains('m-header')) {
      headerEl.classList.remove('m-header');
    }
  });
});

// 모바일 헤더일 경우 토글메뉴 클릭하는 효과
menuToggleEl.addEventListener('click', () => {
  if (headerEl.classList.contains('m-header')) {
    headerEl.classList.remove('m-header');
  } else {
    headerEl.classList.add('m-header');
  }
});

// 메뉴 클릭시 부드럽게 이동하는 효과
document.addEventListener('DOMContentLoaded', smoothScroll);

function smoothScroll() { 
  headerMenuEls.forEach(el => el.addEventListener('click', smooth));

  mobileHeaderMenuEls.forEach(el => el.addEventListener('click', smooth));
}

function smooth(el) {
  el.preventDefault(); // a 태그의 기본 동작을 막고 Lenis로 스크롤을 직접 제어

  const targetId = this.getAttribute('href');
  const targetEl = document.querySelector(targetId);

  if (!targetEl) return; // targetId를 갖는 대상 섹션이 없으면 종료

  let targetTop;

  switch (targetId) {
    case '#home':
      targetTop = 0;
      break;

    case '#work': {
      // ScrollTrigger 중에서 trigger가 .work 인 인스턴스를 찾고, 그 인스턴스의 start(px)를 사용해 그 지점으로 스크롤
      const workTrigger = ScrollTrigger.getAll().find(st => st.trigger?.classList.contains('work'));

      targetTop = workTrigger ? workTrigger.start : window.scrollY + targetEl.getBoundingClientRect().top;
      // workTrigger.start : 가로 스크롤 시작 Y 좌표, start: 'center center' 설정을 실제 픽셀로 환산한 결과
      // 혹시 ScrollTrigger가 생성되기 전이거나 찾지 못한 경우, 섹션의 top으로 이동
      break;
    }

    default:
      targetTop = window.scrollY + targetEl.getBoundingClientRect().top;
  }

  lenis.scrollTo(targetTop, {
    duration: 1,
    easing: t => 1 - Math.pow(1 - t, 3) // easeOutCubic : 초반 가속, 후반 감속으로 자연스러운 느낌
  });
}


// HOME 텍스트 효과
const splitEl = new SplitType('.home__txt > *', {
  types: 'lines, words', /* lines, words, chasrs */
  tagName: 'p'
});

gsap.from('.home__txt .word', { // 애니메이션이 시작할 때의 상태를 설정하는 메서드
  y: '100%',                    // 각 단어가 아래쪽으로 100% 위치에서 시작하도록 설정 > 텍스트가 아래에서 위로 올라오는 효과
  opacity: 1,                   // 각 단어의 투명도가 없도록 설정 > 부드러운 전환 효과
  duration: 0.6,
  ease: 'circ.out',             // circ.out : 빠르게 시작했다가 천천히 끝나는 원형의 속도 곡선 > 자연스러운 움직임 효과 / 참고) https://gsap.com/docs/v3/Eases/
  stagger: 0.1,                 // 각 단어가 0.1초 간격으로 순차적으로 등장하는 효과
});

// HOME section 고정 효과
ScrollTrigger.create({
  trigger: '.home',
  start: 'top top',
  end: '+=100%',
  pin: true,
  pinSpacing: false // 핀 설정시 여백이 생길 수 있는 부분을 제거
  // markers: true
});


// ABOUT ME 이미지 스크롤 효과
gsap.matchMedia().add('(min-width: 769px)', () => {
  gsap.to('.aboutme__img', {
    y: () => {
      const aboutmeRight = document.querySelector('.aboutme__right');
      const aboutmeImg = document.querySelector('.aboutme__img');

      return aboutmeRight.offsetHeight - aboutmeImg.offsetHeight; // 오른쪽 텍스트 전체 높이 - 이미지 높이
    },
    ease: 'none',
    scrollTrigger: {
      trigger: '.aboutme__right',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      invalidateOnRefresh: true
      // markers: true
    }
  });
});


// WORK 가로 스크롤 효과
const workCon = document.querySelector('.work .content');
const workEls = gsap.utils.toArray('.work .work__list'); // ('대상')을 배열로 생성

gsap.to(workEls, {
  x: () => - (workCon.scrollWidth - workCon.offsetWidth),
  ease: 'none',                            
  scrollTrigger: {
    trigger: '.work',
    start: 'center center',
    end: () => '+=' + (workCon.scrollWidth - workCon.offsetWidth),
    pin: true,
    anticipatePin: 1, // 고정효과를 부드럽게
    scrub: 1,         // 스크롤시 부드럽게
    invalidateOnRefresh: true
    // markers: true
  }
});

ScrollTrigger.addEventListener('refreshInit', () => {
  gsap.set(workCon, { 
    clearProps: 'all' 
  });
});


// CONTACT 나타나는 효과
const contactEl = document.querySelector('.contact');

new ScrollMagic.Scene({ 
  triggerElement: contactEl,
  triggerHook: .6
})
.setClassToggle(contactEl, 'show')
.addTo(new ScrollMagic.Controller());


// FOOTER
const yearEl = document.querySelector('footer .year');

yearEl.textContent = new Date().getFullYear();


// TOP BUTTON
const topEl = document.querySelector('.top-btn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    topEl.style.bottom = '20px';
  } else {
    topEl.style.bottom = '-50px';
  }
});

topEl.addEventListener('click', () => {
  window.scrollTo({
    top: 0, 
    left: 0, 
    behavior: 'smooth'
  });
});


window.addEventListener('load', () => ScrollTrigger.refresh());  
window.addEventListener('resize', () => ScrollTrigger.refresh());