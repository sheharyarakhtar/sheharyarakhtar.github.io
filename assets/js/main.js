/*==================== MENU SHOW Y HIDDEN ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== ACCORDION SKILLS ====================*/
const skillsContent = document.getElementsByClassName('skills__content'),
    skillsHeader = document.querySelectorAll('.skills__header')

function toggleSkills() {
    let itemClass = this.parentNode.className

    for (i = 0; i < skillsContent.length; i++) {
        skillsContent[i].className = 'skills__content skills__close'
    }
    if (itemClass === 'skills__content skills__close') {
        this.parentNode.className = "skills__content skills__open"
    }
}

skillsHeader.forEach((el) => {
    el.addEventListener('click', toggleSkills)
})

/*==================== QUALIFICATION TABS ====================*/
const tabs = document.querySelectorAll('[data-target]'),
    tabContents = document.querySelectorAll('[data-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target)

        tabContents.forEach(tabContent => {
            tabContent.classList.remove('qualification__active')
            tabContent.style.display = "none";
        })
        target.classList.add('qualificiation__active')
        target.style.display = "block";

        tabs.forEach(tab => {
            tab.classList.remove('qualification__active')
        })
        tab.classList.add('qualification__active')
    })
})

/*==================== QUALIFICATION MODAL ====================*/
const qmodalViews = document.querySelectorAll('.qualification__modal'),
    qmodalBtns = document.querySelectorAll('.qualification__button-modal'),
    qmodalCloses = document.querySelectorAll('.qualification__modal-close')

let qmodal = function (modalCLick) {
    qmodalViews[modalCLick].classList.add('active-modal')
}

qmodalBtns.forEach((qmodalBtn, i) => {
    qmodalBtn.addEventListener('click', () => {
        qmodal(i)
    })
})

qmodalCloses.forEach((qmodalClose, i) => {
    qmodalClose.addEventListener('click', () => {
        qmodalViews.forEach((qmodalView) => {
            qmodalView.classList.remove('active-modal')
        })
    })
})

// Close modal on outside click
qmodalViews.forEach((qmodalView) => {
    qmodalView.addEventListener('click', (e) => {
        if (e.target === qmodalView) {
            qmodalView.classList.remove('active-modal')
        }
    })
})

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        qmodalViews.forEach((qmodalView) => {
            qmodalView.classList.remove('active-modal')
        })
    }
})

/*==================== PORTFOLIO / BLOG SWIPER  ====================*/
let swiper = new Swiper('.swiper-container', {
    cssMode: true,
    loop: true,
    grabCursor: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        mousewheel: false,
        preventInteractionOnTransition: true,
    },
});

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const nav = document.getElementById('header')
    if (this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    if (this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const lightTheme = 'light-theme'
const iconTheme = 'uil-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'light' : 'dark'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'uil-moon' : 'uil-sun'

if (selectedTheme) {
    document.body.classList[selectedTheme === 'light' ? 'add' : 'remove'](lightTheme)
    themeButton.classList[selectedIcon === 'uil-sun' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(lightTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== SCROLL REVEAL ANIMATION ====================*/
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible')
        }
    })
}, observerOptions)

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll(
        '.section__title, .section__subtitle, .about__img, .about__data, ' +
        '.skills__content, .qualification__data, .portfolio__content, ' +
        '.research__content, .certification__content, .blog__content, ' +
        '.contact__information, .contact__form-container, .home__data, .home__social, .home__img'
    )

    fadeElements.forEach(el => {
        el.classList.add('fade-in')
        observer.observe(el)
    })

    const staggerContainers = document.querySelectorAll(
        '.about__info, .nav__list, .footer__links, .footer__socials'
    )

    staggerContainers.forEach(container => {
        container.classList.add('stagger-children')
        observer.observe(container)
    })
})

/*==================== DYNAMIC FOOTER YEAR ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const footerCopy = document.querySelector('.footer__copy')
    if (footerCopy) {
        footerCopy.innerHTML = '© ' + new Date().getFullYear() + ' Sheharyar Akhtar. All rights reserved'
    }
})

/*==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    })
})

/*==================== SUBTLE TYPING EFFECT ====================*/
const homeSubtitle = document.querySelector('.home__subtitle')
if (homeSubtitle) {
    const titles = [
        'Quantitative Systems Builder',
        'Decision Intelligence Engineer',
        'LLM Evaluation Lead @ Turing',
        'Bayesian Modeling Expert',
        'Founder — Markov Chain Finance'
    ]
    let titleIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typingSpeed = 80

    function typeEffect() {
        const currentTitle = titles[titleIndex]

        if (isDeleting) {
            homeSubtitle.textContent = currentTitle.substring(0, charIndex - 1)
            charIndex--
            typingSpeed = 40
        } else {
            homeSubtitle.textContent = currentTitle.substring(0, charIndex + 1)
            charIndex++
            typingSpeed = 80
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 3000
            isDeleting = true
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false
            titleIndex = (titleIndex + 1) % titles.length
            typingSpeed = 500
        }

        setTimeout(typeEffect, typingSpeed)
    }

    setTimeout(typeEffect, 2500)
}

/*==================== PRELOADER ====================*/
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader')
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader--hidden')
            setTimeout(() => {
                preloader.remove()
            }, 500)
        }, 300)
    }
})

/*==================== CONTACT FORM SUBMISSION ====================*/
let submittedForm = false

const contactForm = document.querySelector('.contact__form')
const formSuccess = document.getElementById('form-success')

if (contactForm) {
    contactForm.addEventListener('submit', function() {
        submittedForm = true
    })
}

const hiddenIframe = document.getElementById('hidden_iframe')
if (hiddenIframe) {
    hiddenIframe.addEventListener('load', function() {
        if (submittedForm) {
            formSuccess.classList.add('show')
            contactForm.reset()
            setTimeout(() => {
                formSuccess.classList.remove('show')
                submittedForm = false
            }, 5000)
        }
    })
}
