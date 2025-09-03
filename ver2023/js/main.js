// COMMON
const spyEls = document.querySelectorAll('section.scroll-spy');

// 스크롤시 나타나는 효과
spyEls.forEach(function (spyEl) {
  new ScrollMagic
    .Scene({ 
      triggerElement: spyEl,
      triggerHook: .6
    })
    .setClassToggle(spyEl, 'show')
    .addTo(new ScrollMagic.Controller());
});


// HEADER
const headerEl = document.querySelector('header');
const headerMenuEls = document.querySelectorAll('header .menu a'); 
const menuToggleEl = document.querySelector('header .menu-toggle');
const mobileHeaderMenuEls = document.querySelectorAll('header .m-menu a'); 
const sectionEls = document.querySelectorAll('section'); 

// 스크롤시 변경되는 효과
window.addEventListener('scroll', () => {
  // 헤더 스타일 변경
  headerEl.classList.toggle('fixed', window.scrollY > 0);

  // 섹션에 따른 메뉴 스타일 변경
  let current = '';
  
  sectionEls.forEach((el) => {
    const sectionTop = window.scrollY + el.getBoundingClientRect().top // getBoundingClientRect() : 현재 보이는 화면 기준으로 좌표값 반환
    const sectionHeight = el.clientHeight; // clientHeight : padding을 포함한 높이
    
    if (window.scrollY >= sectionTop - sectionHeight/4) {
      current = el.getAttribute('id');
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

// 스크롤시 부드럽게 이동하는 효과
document.addEventListener('DOMContentLoaded', smoothScroll);

function smoothScroll() { 
  headerMenuEls.forEach((el) => {
    el.addEventListener('click', smooth);
  });

  mobileHeaderMenuEls.forEach((el) => {
    el.addEventListener('click', smooth);
  });
}

function smooth(el) {
  el.preventDefault();
  const targetId = this.getAttribute('href');
  const targetEl = document.querySelector(targetId);

  if (targetEl) { 
    targetEl.scrollIntoView({ behavior: 'smooth' });
  }
}


// VISUAL
const typingEl = document.querySelector('.visual__txt h1');
const typingTxt = 'PUBLISHER.';
const typingTxtArr = typingTxt.split('');

// 텍스트 타이핑 효과
function typing(txtArr) {
  if (txtArr.length > 0) {
    typingEl.textContent += txtArr.shift();
    setTimeout(function () {
      typing(txtArr);
    }, 200);
  }
}
typing(typingTxtArr);

// 커서 깜빡이는 효과
function blink() {
  typingEl.classList.toggle('active');
}
setInterval(blink, 500);


// PORTFOLIO - Swiper 슬라이더
var portfolioSwiper = new Swiper('.portfolio .swiper-container', {
  effect : 'fade',
  loop: true,
  navigation: {
    prevEl: '.portfolio .swiper-prev',
    nextEl: '.portfolio .swiper-next'
  }
});


// DESIGN - Masonry 레이아웃
var designMasonry = new Masonry('.design ul', {
  itemSelector : '.design ul li',
  percentPosition : true,
  gutter : 25
});

imagesLoaded('.design ul').on('progress', function() {
  designMasonry.layout();
});


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
  window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
});