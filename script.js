// ========== VARIABLES ==========
let userName = '';
let candlesBlown = false;
let sparkles = [];

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    initPopup();
    initConfetti();
    initSparkles();
    initGiftPopup();
    initBlowCandles();
    initReminderPopup();
});

// ========== POPUP AWAL ==========
function initPopup() {
    const popup = document.getElementById('namePopup');
    const nameInput = document.getElementById('nameInput');
    const continueBtn = document.getElementById('continueBtn');
    const mainContent = document.getElementById('mainContent');

    // Focus pada input saat popup muncul
    setTimeout(() => {
        nameInput.focus();
    }, 500);

    // Enter key untuk submit
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            continueBtn.click();
        }
    });

    continueBtn.addEventListener('click', () => {
        userName = nameInput.value.trim();
        
        if (userName === '') {
            nameInput.style.borderColor = '#ff0000';
            nameInput.placeholder = 'Nama tidak boleh kosong!';
            setTimeout(() => {
                nameInput.style.borderColor = 'var(--pink-pastel)';
                nameInput.placeholder = 'Masukkan nama kamu...';
            }, 2000);
            return;
        }

        // Fade out popup
        popup.classList.add('hidden');
        
        // Tampilkan main content setelah popup hilang
        setTimeout(() => {
            popup.style.display = 'none';
            mainContent.classList.remove('hidden');
            updateBirthdayMessage();
            startConfetti();
            createSparkles();
        }, 500);
    });
}

// ========== UPDATE BIRTHDAY MESSAGE ==========
function updateBirthdayMessage() {
    const messageElement = document.getElementById('birthdayMessage');
    const message = `Selamat Ulang Tahun, ${userName}! 🎀✨`;
    
    // Typing effect
    typeWriter(messageElement, message, 100);
}

function typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add blinking cursor at the end temporarily
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);
            
            setTimeout(() => {
                cursor.remove();
            }, 1000);
        }
    }
    
    type();
}

// ========== CONFETTI PARTICLES ==========
const confettiParticles = [];
let confettiAnimationId = null;

function initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    // Create initial particles
    for (let i = 0; i < 100; i++) {
        confettiParticles.push(createConfettiParticle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create new particles occasionally
        if (Math.random() < 0.1) {
            confettiParticles.push(createConfettiParticle());
        }
        
        // Update and draw particles
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const particle = confettiParticles[i];
            
            // Handle regular falling particles
            if (particle.vx === undefined) {
                particle.y += particle.speed;
                particle.x += particle.wobble * Math.sin(particle.rotation);
            } else {
                // Handle gift burst particles
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // gravity
            }
            
            particle.rotation += particle.rotationSpeed;
            
            // Remove particles that are off screen
            if (particle.y > canvas.height + 20 || 
                (particle.vx !== undefined && (particle.x < -20 || particle.x > canvas.width + 20))) {
                confettiParticles.splice(i, 1);
                continue;
            }
            
            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
        }
        
        confettiAnimationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function createConfettiParticle() {
    const colors = ['#FFB6D9', '#E6B3FF', '#B3E5FF', '#FFF4B3', '#FFE5F1', '#F3E5FF'];
    
    return {
        x: Math.random() * window.innerWidth,
        y: -20,
        size: Math.random() * 10 + 5,
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        wobble: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
}

// ========== SPARKLES ==========
function initSparkles() {
    // Sparkles will be created when main content appears
}

function createSparkles() {
    const container = document.querySelector('.sparkles-container');
    
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = '✨';
        
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        sparkle.style.animationDelay = Math.random() * 2 + 's';
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 5000);
    }
    
    // Create sparkles continuously
    setInterval(createSparkle, 500);
    
    // Initial sparkles
    for (let i = 0; i < 20; i++) {
        setTimeout(createSparkle, i * 100);
    }
}


// ========== BLOW CANDLES ==========
function initBlowCandles() {
    const blowBtn = document.getElementById('blowBtn');
    const flames = document.querySelectorAll('.flame');
    const smokes = document.querySelectorAll('.smoke');
    const windEmojis = document.getElementById('windEmojis');
    const giftBtn = document.getElementById('giftBtn');
    
    if (!blowBtn) return; // Safety check
    
    blowBtn.addEventListener('click', () => {
        if (candlesBlown) return;
        
        candlesBlown = true;
        
        // Play blow sound effect
        playBlowSound();
        
        // Hide blow button immediately
        blowBtn.classList.add('hidden');
        
        // Show wind emojis
        windEmojis.classList.remove('hidden');
        
        // Animate wind emojis and blow out flames
        const windEmojiElements = windEmojis.querySelectorAll('.wind-emoji');
        
        flames.forEach((flame, index) => {
            setTimeout(() => {
                // Activate wind emoji
                if (windEmojiElements[index]) {
                    windEmojiElements[index].classList.add('active');
                }
                
                // Blow out flame
                setTimeout(() => {
                    flame.classList.add('blown');
                    
                    // Show smoke after flame is blown
                    setTimeout(() => {
                        smokes[index].classList.add('rising');
                    }, 200);
                }, 300);
            }, index * 250);
        });
        
        // Show gift button after all candles are blown
        setTimeout(() => {
            if (giftBtn) {
                giftBtn.classList.remove('hidden');
                giftBtn.style.animation = 'messagePop 0.5s ease-out';
            }
            // Hide wind emojis
            windEmojis.classList.add('hidden');
        }, 1500);
    });
}

// Simple blow sound effect using Web Audio API
function playBlowSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback if Web Audio API is not supported
        console.log('Sound effect not available');
    }
}

// ========== UPDATE GIFT POPUP TEXT ==========
function updateGiftPopupText() {
    const giftTitle = document.getElementById('giftTitle');
    const giftMessage = document.getElementById('giftMessage');
    
    if (giftTitle && userName) {
        giftTitle.textContent = `Hadiah Untuk ${userName}! 🎁💝`;
    }
    
    if (giftMessage && userName) {
        giftMessage.textContent = `Selamat ulang tahun ya ${userName}! Semoga hari ini penuh kebahagiaan, dan momen indah yang tak terlupakan. Semoga semua impianmu tercapai! dan semoga panjang umur yaa 🌟💖✨`;
    }
}

// ========== REMINDER POPUP ==========
function initReminderPopup() {
    const continueGiftBtn = document.getElementById('continueGiftBtn');
    const reminderPopup = document.getElementById('reminderPopup');
    const giftPopup = document.getElementById('giftPopup');
    
    if (continueGiftBtn) {
        continueGiftBtn.addEventListener('click', () => {
            reminderPopup.classList.add('hidden');
            // Show gift popup after reminder
            setTimeout(() => {
                // Update gift popup text with user name
                updateGiftPopupText();
                giftPopup.classList.remove('hidden');
                const giftContent = document.querySelector('.gift-content');
                if (giftContent) {
                    giftContent.style.animation = 'popupBounce 0.6s ease-out';
                }
                createGiftConfetti();
            }, 300);
        });
    }
}

// ========== GIFT POPUP ==========
function initGiftPopup() {
    const giftBtn = document.getElementById('giftBtn');
    const reminderPopup = document.getElementById('reminderPopup');
    const giftPopup = document.getElementById('giftPopup');
    const closeGiftBtn = document.getElementById('closeGiftBtn');
    
    if (!giftBtn) return;
    
    giftBtn.addEventListener('click', () => {
        // Show reminder popup first
        reminderPopup.classList.remove('hidden');
    });
    
    if (closeGiftBtn) {
        closeGiftBtn.addEventListener('click', () => {
            giftPopup.classList.add('hidden');
        });
    }
    
    // Close on background click
    if (giftPopup) {
        giftPopup.addEventListener('click', (e) => {
            if (e.target === giftPopup) {
                giftPopup.classList.add('hidden');
            }
        });
    }
}

function createGiftConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    // Create burst of confetti from center
    for (let i = 0; i < 50; i++) {
        confettiParticles.push(createGiftConfettiParticle());
    }
}

function createGiftConfettiParticle() {
    const colors = ['#FFB6D9', '#E6B3FF', '#B3E5FF', '#FFF4B3', '#FFE5F1', '#F3E5FF'];
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 3;
    
    return {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: Math.random() * 12 + 6,
        speed: speed,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)]
    };
}

