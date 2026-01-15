/*==================== MOBILE NAV ====================*/
const navMenu = document.getElementById('nav-menu')
const navToggle = document.getElementById('nav-toggle')

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu')
    })
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu')
        })
    })
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('show-menu')
        }
    })
}

/*==================== HEADER SCROLL ====================*/
function scrollHeader() {
    const header = document.getElementById('header')
    if (window.scrollY >= 50) {
        header.style.borderBottomColor = 'rgba(42, 42, 48, 0.8)'
    } else {
        header.style.borderBottomColor = 'rgba(30, 30, 36, 1)'
    }
}
window.addEventListener('scroll', scrollHeader)

/*==================== ACTIVE LINK ON SCROLL ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight
        const sectionTop = section.offsetTop - 100
        const sectionId = section.getAttribute('id')
        const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`)

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#e8e8ed'
            } else {
                navLink.style.color = ''
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== SMOOTH SCROLL ====================*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href')
        if (href !== '#') {
            e.preventDefault()
            const target = document.querySelector(href)
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        }
    })
})

/*==================== DYNAMIC YEAR ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const footerCopy = document.querySelector('.footer__copy')
    if (footerCopy) {
        footerCopy.textContent = `© ${new Date().getFullYear()} Sheharyar Akhtar`
    }
})

/*==================== PROJECT ACCORDION ====================*/
document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project')
    
    projects.forEach(project => {
        const header = project.querySelector('.project__header')
        
        if (header) {
            header.addEventListener('click', () => {
                // Close other projects
                projects.forEach(p => {
                    if (p !== project) {
                        p.classList.remove('project--expanded')
                        p.classList.add('project--collapsed')
                    }
                })
                
                // Toggle current project
                project.classList.toggle('project--expanded')
                project.classList.toggle('project--collapsed')
            })
        }
    })
})

/*==================== CONTACT FORM ====================*/
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
