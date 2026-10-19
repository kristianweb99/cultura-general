/* =========================================================
   CULTURA GENERAL PRO — app.js
   Full game logic: questions, audio, timer, score, leaderboard
   ========================================================= */

'use strict';

// ============================================================
// 1. QUESTION BANK (1.200 verified questions loaded globally from questions.js)
// ============================================================
if (typeof QUESTION_BANK === 'undefined') {
  if (typeof window !== 'undefined' && window.QUESTION_BANK) {
    var QUESTION_BANK = window.QUESTION_BANK;
  } else {
    var QUESTION_BANK = [];
  }
}

// ============================================================
// 2. CONFIGURATION & STATE
// ============================================================
const AVATARS = ['🧑', '👩', '🦸', '🧙', '🤖', '👾', '🦊', '🐉', '🎮', '🚀', '🧠', '🏆'];

const CATEGORIES = [
  { id: 'all',  label: 'Todas',       icon: 'fa-globe' },
  { id: 'geo',  label: 'Geografía',   icon: 'fa-map-location-dot' },
  { id: 'hist', label: 'Historia',    icon: 'fa-landmark' },
  { id: 'sci',  label: 'Ciencia',     icon: 'fa-flask' },
  { id: 'art',  label: 'Arte',        icon: 'fa-palette' },
  { id: 'pop',  label: 'Cultura Pop', icon: 'fa-star' },
  { id: 'dep',  label: 'Deportes',    icon: 'fa-futbol' },
];

const DIFFICULTIES = [
  { id: 'normal',    label: 'Normal',    seconds: 15, basePoints: 100, icon: 'fa-leaf' },
  { id: 'pro',       label: 'Pro',       seconds: 10, basePoints: 200, icon: 'fa-bolt' },
  { id: 'relampago', label: 'Relámpago', seconds: 5,  basePoints: 350, icon: 'fa-fire' },
];

const RANKS = [
  { min: 0,    title: '🔰 Novato Curioso' },
  { min: 300,  title: '📚 Aprendiz Ágil' },
  { min: 600,  title: '🧠 Mente Despierta' },
  { min: 1000, title: '⭐ Sabio Ilustrado' },
  { min: 1500, title: '🌟 Mente Brillante' },
  { min: 2000, title: '💎 Gran Maestro' },
  { min: 2500, title: '🏆 Leyenda de la Cultura General' },
];

const CATEGORY_CSS = {
  all:  'cat-all',
  geo:  'cat-geo',
  hist: 'cat-hist',
  sci:  'cat-sci',
  art:  'cat-art',
  pop:  'cat-pop',
  dep:  'cat-dep',
};

let gameState = {};
let timerInterval = null;
let funfactTimeout = null;
let nextQuestionTimeout = null;
let audioCtx = null;
let isMuted = false;
let particleInterval = null;

// ============================================================
// 3. DOM REFERENCES
// ============================================================
const $ = (id) => document.getElementById(id);

const DOM = {
  screenStart:    $('screen-start'),
  screenGame:     $('screen-game'),
  screenResults:  $('screen-results'),

  // Start screen
  playerName:       $('player-name'),
  avatarGrid:       $('avatar-grid'),
  categoryGrid:     $('category-grid'),
  difficultyGrid:   $('difficulty-grid'),
  btnPlay:          $('btn-play'),
  leaderboardStart: $('leaderboard-start'),

  // Game screen
  questionLabel:         $('question-label'),
  progressBar:           $('progress-bar'),
  playerAvatarDisplay:   $('player-avatar-display'),
  playerNameDisplay:     $('player-name-display'),
  scoreBadge:            $('score-badge'),
  scoreDisplay:          $('score-display'),
  streakDisplay:         $('streak-display'),
  streakCount:           $('streak-count'),
  statCorrect:           $('stat-correct'),
  statWrong:             $('stat-wrong'),
  statStreak:            $('stat-streak'),
  questionCategoryBadge: $('question-category-badge'),
  difficultyBadge:       $('difficulty-badge'),
  questionText:          $('question-text'),
  optionsGrid:           $('options-grid'),
  funfactCard:           $('funfact-card'),
  funfactText:           $('funfact-text'),
  funfactCountdown:      $('funfact-countdown'),
  btnNext:               $('btn-next'),
  timerRing:             $('timer-ring'),
  timerNumber:           $('timer-number'),
  speedStars:            $('speed-stars'),
  btnFifty:              $('btn-fifty'),
  btnClue:               $('btn-clue'),
  btnTime:               $('btn-time'),
  btnMute:               $('btn-mute'),
  muteIcon:              $('mute-icon'),

  // Results screen
  rankTitle:          $('rank-title'),
  resScore:           $('res-score'),
  resAccuracy:        $('res-accuracy'),
  resStreak:          $('res-streak'),
  resTime:            $('res-time'),
  leaderboardResults: $('leaderboard-results'),
  btnShare:           $('btn-share'),
  btnReplay:          $('btn-replay'),

  // Shared
  scorePopup: $('score-popup'),

  // Auth Screen & Controls
  screenAuth:           $('screen-auth'),
  tabLogin:             $('tab-login'),
  tabRegister:          $('tab-register'),
  formLogin:            $('form-login'),
  formRegister:         $('form-register'),
  btnGoogleLoginMain:   $('btn-google-login-main'),
  loginEmail:           $('login-email'),
  loginPassword:        $('login-password'),
  btnSubmitLogin:       $('btn-submit-login'),
  registerName:         $('register-name'),
  registerEmail:        $('register-email'),
  registerPassword:     $('register-password'),
  btnSubmitRegister:    $('btn-submit-register'),
  authAlert:            $('auth-alert'),
  btnGuestPlay:         $('btn-guest-play'),

  // Screen Start Banner
  userStatusBanner:     $('user-status-banner'),
  bannerUserPhoto:      $('banner-user-photo'),
  bannerUserEmoji:      $('banner-user-emoji'),
  bannerUserName:       $('banner-user-name'),
  bannerBadgeVerified:  $('banner-badge-verified'),
  bannerUserStatus:     $('banner-user-status'),
  btnSwitchAccount:     $('btn-switch-account'),
  btnOpenProfile:       $('btn-open-profile'),
  roundLengthGrid:      $('round-length-grid'),

  // Profile Modal & Achievements
  profileModal:         $('profile-modal'),
  profileModalOverlay:  $('profile-modal-overlay'),
  btnCloseProfile:      $('btn-close-profile'),
  btnProfileDone:       $('btn-profile-done'),
  modalUserAvatar:      $('modal-user-avatar'),
  modalUserName:        $('modal-user-name'),
  modalUserAccount:     $('modal-user-account'),
  statTotalScore:       $('stat-total-score'),
  statBestScore:        $('stat-best-score'),
  statGamesPlayed:      $('stat-games-played'),
  statMaxStreak:        $('stat-max-streak'),
  achievementsGrid:     $('achievements-grid'),
  achievementsCount:    $('achievements-count'),
  achievementToast:     $('achievement-toast'),
  toastIcon:            $('toast-icon'),
  toastTitle:           $('toast-title'),
  toastDesc:            $('toast-desc'),

  // Sharing
  btnShareWhatsapp:     $('btn-share-whatsapp'),

  // Exit modal
  exitModal:         $('exit-modal'),
  exitScorePreview:  $('exit-score-preview'),
  btnExitGame:       $('btn-exit-game'),
  btnExitCancel:     $('btn-exit-cancel'),
  btnExitConfirm:    $('btn-exit-confirm'),
  exitModalOverlay:  $('exit-modal-overlay'),
};

// ============================================================
// 4. AUDIO ENGINE (Web Audio API — no external files)
// ============================================================
function ensureAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone({ frequency = 440, type = 'sine', duration = 0.2, gain = 0.3, delay = 0 } = {}) {
  if (isMuted) return;
  ensureAudioCtx();
  const now = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.start(now);
  osc.stop(now + duration + 0.01);
}

function playTick() {
  playTone({ frequency: 800, type: 'square', duration: 0.04, gain: 0.08 });
}

function playCorrect() {
  // Ascending happy chord
  playTone({ frequency: 523.25, type: 'sine', duration: 0.15, gain: 0.25, delay: 0.00 });
  playTone({ frequency: 659.25, type: 'sine', duration: 0.15, gain: 0.25, delay: 0.10 });
  playTone({ frequency: 783.99, type: 'sine', duration: 0.25, gain: 0.30, delay: 0.20 });
  playTone({ frequency: 1046.5, type: 'sine', duration: 0.30, gain: 0.25, delay: 0.30 });
}

function playWrong() {
  // Descending failure sound
  playTone({ frequency: 330, type: 'sawtooth', duration: 0.15, gain: 0.2, delay: 0.00 });
  playTone({ frequency: 220, type: 'sawtooth', duration: 0.20, gain: 0.2, delay: 0.15 });
  playTone({ frequency: 146.83, type: 'sawtooth', duration: 0.30, gain: 0.15, delay: 0.30 });
}

function playFanfare() {
  // Victory fanfare sequence
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1568.0];
  notes.forEach((freq, i) => {
    playTone({ frequency: freq, type: 'sine', duration: 0.2, gain: 0.3, delay: i * 0.12 });
  });
  // Harmony layer
  [659.25, 783.99, 987.77, 1318.5].forEach((freq, i) => {
    playTone({ frequency: freq, type: 'triangle', duration: 0.25, gain: 0.15, delay: 0.72 + i * 0.1 });
  });
}

function playTimeout() {
  playTone({ frequency: 200, type: 'sawtooth', duration: 0.4, gain: 0.25 });
  playTone({ frequency: 150, type: 'sawtooth', duration: 0.5, gain: 0.2, delay: 0.35 });
}

function playAchievementFanfare() {
  playTone({ frequency: 523.25, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.00 });
  playTone({ frequency: 659.25, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.10 });
  playTone({ frequency: 783.99, type: 'triangle', duration: 0.12, gain: 0.25, delay: 0.20 });
  playTone({ frequency: 1046.50, type: 'sine', duration: 0.35, gain: 0.30, delay: 0.30 });
}

function triggerHaptic(type = 'tap') {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      if (type === 'tap') navigator.vibrate(25);
      else if (type === 'correct') navigator.vibrate(50);
      else if (type === 'wrong') navigator.vibrate([70, 40, 70]);
      else if (type === 'win') navigator.vibrate([100, 50, 100, 50, 150]);
    } catch (e) {}
  }
}

function toggleMute() {
  isMuted = !isMuted;
  DOM.muteIcon.className = isMuted
    ? 'fa-solid fa-volume-xmark'
    : 'fa-solid fa-volume-high';
  DOM.btnMute.style.color = isMuted ? 'var(--neon-red)' : '';
}

// ============================================================
// 5. PARTICLE SYSTEM
// ============================================================
const canvas = $('particles-canvas');
const ctx2d = canvas ? canvas.getContext('2d') : null;
let particles = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: canvas.height + 10,
    size: Math.random() * 2 + 0.5,
    speedY: -(Math.random() * 0.6 + 0.2),
    speedX: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.6
      ? 'rgba(0,245,255,'
      : Math.random() > 0.5
        ? 'rgba(0,150,255,'
        : 'rgba(255,215,0,',
  };
}

function animateParticles() {
  if (!canvas || !ctx2d) return;
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, i) => {
    p.y += p.speedY;
    p.x += p.speedX;
    if (p.y < -10) { particles[i] = createParticle(); return; }

    ctx2d.beginPath();
    ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx2d.fillStyle = p.color + p.opacity + ')';
    ctx2d.fill();
  });

  requestAnimationFrame(animateParticles);
}

function initParticles() {
  resizeCanvas();
  particles = Array.from({ length: 80 }, createParticle);
  animateParticles();
}

window.addEventListener('resize', resizeCanvas);

// ============================================================
// 6. LEADERBOARD (Firebase Realtime Database + LocalStorage Fallback)
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyByLu75xLmTH9gM0NEUglTYcRwzi1Q19so",
  authDomain: "cultura-general-pro.firebaseapp.com",
  databaseURL: "https://cultura-general-pro-default-rtdb.firebaseio.com",
  projectId: "cultura-general-pro",
  storageBucket: "cultura-general-pro.firebasestorage.app",
  messagingSenderId: "670535256430",
  appId: "1:670535256430:web:ffd43ad4079e3039bf197f"
};

let db = null;
let globalLeaderboard = [];
const LS_KEY = 'cgpro_leaderboard';

// Initialize Firebase
try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
    console.log("Firebase Realtime Database conectada con éxito.");
  }
} catch (err) {
  console.warn("No se pudo iniciar Firebase, usando LocalStorage:", err);
}

function loadLocalLeaderboard() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    const legacyMockNames = ['Carlos', 'Elena', 'Sofía', 'Mateo', 'Lucía', 'memo', 'ari', 'juan', 'jonathan', 'jugador'];
    const filtered = list.filter(item => item && !legacyMockNames.includes(item.name));
    if (filtered.length !== list.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(filtered));
    }
    return filtered;
  } catch { return []; }
}

function sanitizeKey(str) {
  return (str || 'jugador').toLowerCase().trim().replace(/[.#$\[\]\/]/g, '_');
}

// Guarda o suma puntos en Firebase en la nube
function saveToLeaderboard(entry) {
  // 1. Guardar localmente
  let localLb = loadLocalLeaderboard();
  localLb.push(entry);
  localLb.sort((a, b) => b.score - a.score);
  localLb = localLb.slice(0, 10);
  localStorage.setItem(LS_KEY, JSON.stringify(localLb));

  // 2. Guardar en Firebase Realtime Database
  if (db) {
    const isRegistered = !!(currentUser && currentUser.uid);
    const playerKey = isRegistered ? currentUser.uid : ('guest_' + sanitizeKey(entry.name));
    const playerRef = db.ref('players/' + playerKey);

    playerRef.transaction((current) => {
      const photoURL = currentUser && currentUser.photoURL ? currentUser.photoURL : (entry.photoURL || '');
      const isGoogle = !!(currentUser && currentUser.photoURL);

      if (!current) {
        return {
          uid: isRegistered ? currentUser.uid : null,
          name: entry.name,
          avatar: entry.avatar || '🧑',
          photoURL: photoURL,
          isGoogle: isGoogle,
          isRegistered: isRegistered,
          totalScore: entry.score,
          bestScore: entry.score,
          gamesPlayed: 1,
          accuracy: entry.accuracy || 0,
          streak: entry.streak || 0,
          diff: entry.diff || 'Normal',
          lastDate: entry.date || new Date().toLocaleDateString('es-ES')
        };
      } else {
        // Acumular puntos
        current.totalScore = (current.totalScore || 0) + entry.score;
        if (entry.score > (current.bestScore || 0)) {
          current.bestScore = entry.score;
        }
        current.gamesPlayed = (current.gamesPlayed || 0) + 1;
        current.name = entry.name || current.name;
        if (photoURL) current.photoURL = photoURL;
        if (isGoogle) current.isGoogle = true;
        if (isRegistered) current.isRegistered = true;
        current.avatar = entry.avatar || current.avatar;
        current.accuracy = Math.round(((current.accuracy || entry.accuracy) + entry.accuracy) / 2);
        if ((entry.streak || 0) > (current.streak || 0)) {
          current.streak = entry.streak;
        }
        current.lastDate = entry.date || new Date().toLocaleDateString('es-ES');
        return current;
      }
    }, (error, committed) => {
      if (error) {
        console.error("Error al guardar en Firebase:", error);
      } else if (committed) {
        console.log("Puntaje guardado y sumado en Firebase.");
      }
    });
  }
  return localLb;
}

// Escuchar cambios en vivo en Firebase para actualizar la tabla de todos los celulares
function initRealtimeLeaderboard() {
  if (!db) {
    globalLeaderboard = loadLocalLeaderboard();
    updateAllLeaderboardViews();
    return;
  }

  db.ref('players').on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      globalLeaderboard = [];
    } else {
      globalLeaderboard = Object.values(data).map(p => ({
        uid: p.uid || null,
        name: p.name || 'Anónimo',
        avatar: p.avatar || '🧑',
        photoURL: p.photoURL || '',
        isGoogle: !!p.isGoogle,
        isRegistered: !!p.isRegistered,
        score: p.totalScore || p.bestScore || 0,
        accuracy: p.accuracy || 0,
        streak: p.streak || 0,
        diff: p.diff || 'Pro',
        date: p.lastDate || '',
        gamesPlayed: p.gamesPlayed || 1
      }));
      // Ordenar de mayor a menor puntaje
      globalLeaderboard.sort((a, b) => b.score - a.score);
      globalLeaderboard = globalLeaderboard.slice(0, 10);
    }
    updateAllLeaderboardViews();
  }, (err) => {
    console.warn("Error leyendo de Firebase, usando fallback local:", err);
    globalLeaderboard = loadLocalLeaderboard();
    updateAllLeaderboardViews();
  });
}

function updateAllLeaderboardViews() {
  if (DOM.leaderboardStart) {
    renderLeaderboard(DOM.leaderboardStart);
  }
  if (DOM.leaderboardResults && !DOM.screenResults.classList.contains('hidden')) {
    renderLeaderboard(DOM.leaderboardResults, gameState.score, gameState.player);
  }
}

function renderLeaderboard(container, currentScore = null, currentName = null) {
  const lb = (globalLeaderboard && globalLeaderboard.length) ? globalLeaderboard : loadLocalLeaderboard();
  
  if (!lb.length) {
    container.innerHTML = `
      <div class="text-center py-6 px-4 rounded-xl border border-dashed border-slate-700/60 bg-dark-bg/40">
        <span class="text-3xl mb-2 block">🏆</span>
        <p class="text-white font-bold text-sm font-poppins">¡Tabla de Campeones Lista!</p>
        <p class="text-slate-400 text-xs font-poppins mt-1">Aún no hay puntuaciones registradas.<br>¡Juega una partida para ser el <strong>#1 del Top Mundial</strong>!</p>
      </div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  container.innerHTML = lb.map((entry, i) => {
    const isNew = currentName !== null && 
                  entry.name.toLowerCase().trim() === currentName.toLowerCase().trim();

    const scoreColor = i === 0
      ? 'neon-text-gold'
      : i === 1
        ? 'text-slate-300'
        : i === 2
          ? 'text-amber-500'
          : 'text-slate-400';

    const rankDisplay = i < 3
      ? `<span class="text-lg">${medals[i]}</span>`
      : `<span class="lb-rank text-slate-500">#${i + 1}</span>`;

    const gamesBadge = entry.gamesPlayed && entry.gamesPlayed > 1
      ? `<span class="text-xs px-1.5 py-0.5 rounded text-slate-400 bg-slate-800/80 font-mono">${entry.gamesPlayed} partidas</span>`
      : '';

    const newBadge = isNew
      ? `<span class="text-xs px-2 py-0.5 rounded-full font-black" style="background:rgba(255,215,0,0.15);border:1px solid rgba(255,215,0,0.5);color:var(--neon-gold);">✨ TÚ</span>`
      : '';

    const avatarHtml = entry.photoURL
      ? `<img src="${escapeHtml(entry.photoURL)}" alt="Avatar" class="w-7 h-7 rounded-full object-cover border border-neon-cyan flex-shrink-0" onerror="this.outerHTML='<span class=\'text-lg\'>${entry.avatar || '🧑'}</span>'" />`
      : `<span class="text-lg">${entry.avatar || '🧑'}</span>`;

    const verifiedBadge = (entry.isGoogle || entry.isRegistered)
      ? `<i class="fa-solid fa-circle-check text-neon-cyan text-[11px]" title="Cuenta Verificada"></i>`
      : '';

    return `
      <div class="lb-row ${isNew ? 'highlight' : ''}" style="${isNew ? 'animation: correctPulse 0.6s ease-out;' : ''}">
        <div class="flex items-center gap-2 min-w-[36px]">${rankDisplay}</div>
        <div class="flex items-center justify-center w-7 h-7 flex-shrink-0">${avatarHtml}</div>
        <div class="flex-1 min-w-0">
          <p class="lb-name truncate ${isNew ? 'text-white font-bold' : ''} flex items-center gap-1">
            <span>${escapeHtml(entry.name)}</span>
            ${verifiedBadge}
          </p>
          <div class="flex items-center gap-2 mt-0.5">${gamesBadge}</div>
        </div>
        <div class="text-right shrink-0">
          <p class="lb-score ${scoreColor}">${(entry.score || 0).toLocaleString()} PTS</p>
          <p class="text-xs text-slate-500">${entry.accuracy}%</p>
        </div>
        ${newBadge}
      </div>`;
  }).join('');
}


// ============================================================
// 6b. AUTHENTICATION & ACHIEVEMENTS SYSTEM
// ============================================================
function showAuthAlert(msg, isSuccess = false) {
  if (!DOM.authAlert) return;
  DOM.authAlert.textContent = msg;
  DOM.authAlert.className = isSuccess 
    ? "p-3 rounded-xl text-xs font-poppins border border-green-500/40 bg-green-950/40 text-green-300 flex items-center gap-2"
    : "p-3 rounded-xl text-xs font-poppins border border-red-500/40 bg-red-950/40 text-red-300 flex items-center gap-2";
  DOM.authAlert.classList.remove('hidden');
}

function clearAuthAlert() {
  if (DOM.authAlert) DOM.authAlert.classList.add('hidden');
}

function initAuth() {
  // Tabs switching: Login / Register
  if (DOM.tabLogin && DOM.tabRegister) {
    DOM.tabLogin.addEventListener('click', () => {
      triggerHaptic('tap');
      clearAuthAlert();
      DOM.tabLogin.className = "py-2.5 rounded-lg transition-all text-neon-cyan bg-cyan-950/60 shadow-[0_0_10px_rgba(0,245,255,0.2)]";
      DOM.tabRegister.className = "py-2.5 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.formLogin) DOM.formLogin.classList.remove('hidden');
      if (DOM.formRegister) DOM.formRegister.classList.add('hidden');
    });

    DOM.tabRegister.addEventListener('click', () => {
      triggerHaptic('tap');
      clearAuthAlert();
      DOM.tabRegister.className = "py-2.5 rounded-lg transition-all text-neon-gold bg-amber-950/60 shadow-[0_0_10px_rgba(255,215,0,0.2)]";
      DOM.tabLogin.className = "py-2.5 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.formRegister) DOM.formRegister.classList.remove('hidden');
      if (DOM.formLogin) DOM.formLogin.classList.add('hidden');
    });
  }

  // Guest Play link
  if (DOM.btnGuestPlay) {
    DOM.btnGuestPlay.addEventListener('click', () => {
      triggerHaptic('tap');
      sessionStorage.setItem('cgpro_guest', '1');
      enterGameLobbyAsGuest();
    });
  }

  // Switch Account / Logout button
  if (DOM.btnSwitchAccount) {
    DOM.btnSwitchAccount.addEventListener('click', () => {
      triggerHaptic('tap');
      if (auth && currentUser) {
        auth.signOut().then(() => {
          sessionStorage.removeItem('cgpro_guest');
          currentUser = null;
          showAuthScreen();
        });
      } else {
        sessionStorage.removeItem('cgpro_guest');
        currentUser = null;
        showAuthScreen();
      }
    });
  }

  if (typeof firebase === 'undefined' || !firebase.auth) {
    console.warn("Firebase Auth no disponible, operando en modo local.");
    loadUserAchievements('guest');
    return;
  }

  try {
    auth = firebase.auth();

    // Listen to Auth State Changes
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      if (user) {
        updateAuthUI(user);
        showGameLobby();
      } else {
        const isGuest = sessionStorage.getItem('cgpro_guest') === '1';
        if (isGuest) {
          enterGameLobbyAsGuest();
        } else {
          showAuthScreen();
        }
      }
    });
  } catch (err) {
    console.warn("Error al inicializar Firebase Auth:", err);
  }

  // Google Login (1-click)
  if (DOM.btnGoogleLoginMain) {
    DOM.btnGoogleLoginMain.addEventListener('click', () => {
      triggerHaptic('tap');
      clearAuthAlert();
      if (!auth) {
        showAuthAlert("Firebase Auth no está listo aún.");
        return;
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      auth.signInWithPopup(provider)
        .then((result) => {
          triggerHaptic('win');
          playTone({ frequency: 660, type: 'sine', duration: 0.15, gain: 0.2 });
          playTone({ frequency: 880, type: 'sine', duration: 0.2, gain: 0.2, delay: 0.12 });
          console.log("Sesión iniciada con Google:", result.user.displayName);
        })
        .catch((error) => {
          console.error("Error al iniciar sesión con Google:", error);
          if (error.code === 'auth/unauthorized-domain') {
            showAuthAlert("Dominio no autorizado en Firebase. Añade '" + window.location.hostname + "' en Firebase Console -> Authentication -> Settings -> Authorized Domains.");
          } else if (error.code === 'auth/popup-blocked') {
            auth.signInWithRedirect(provider);
          } else if (error.code !== 'auth/popup-closed-by-user') {
            showAuthAlert("No se pudo iniciar sesión con Google: " + error.message);
          }
        });
    });
  }

  // Email / Password: Iniciar Sesión
  if (DOM.formLogin) {
    DOM.formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHaptic('tap');
      clearAuthAlert();
      const email = (DOM.loginEmail ? DOM.loginEmail.value : '').trim();
      const pass = (DOM.loginPassword ? DOM.loginPassword.value : '').trim();
      if (!email || !pass) {
        showAuthAlert("Por favor ingresa tu correo y contraseña.");
        return;
      }
      if (!auth) {
        showAuthAlert("Servicio de autenticación no disponible.");
        return;
      }

      auth.signInWithEmailAndPassword(email, pass)
        .then((result) => {
          triggerHaptic('win');
          console.log("Sesión iniciada con correo:", result.user.email);
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
          if (error.code === 'auth/user-not-found') {
            showAuthAlert("No existe ninguna cuenta con este correo. Regístrate en la pestaña 'Registrarte'.");
          } else if (error.code === 'auth/wrong-password') {
            showAuthAlert("Contraseña incorrecta. Inténtalo de nuevo.");
          } else if (error.code === 'auth/invalid-email') {
            showAuthAlert("El correo electrónico no es válido.");
          } else if (error.code === 'auth/operation-not-allowed') {
            showAuthAlert("Inicia con Google o habilita 'Correo electrónico' en Firebase Console.");
          } else {
            showAuthAlert(error.message);
          }
        });
    });
  }

  // Email / Password: Crear Cuenta / Registrarse
  if (DOM.formRegister) {
    DOM.formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHaptic('tap');
      clearAuthAlert();
      const name = (DOM.registerName ? DOM.registerName.value : '').trim();
      const email = (DOM.registerEmail ? DOM.registerEmail.value : '').trim();
      const pass = (DOM.registerPassword ? DOM.registerPassword.value : '').trim();

      if (!name) {
        showAuthAlert("Por favor escribe tu nombre de jugador.");
        return;
      }
      if (!email || !pass) {
        showAuthAlert("Completa tu correo y contraseña (mínimo 6 caracteres).");
        return;
      }
      if (pass.length < 6) {
        showAuthAlert("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      if (!auth) {
        showAuthAlert("Servicio de autenticación no disponible.");
        return;
      }

      auth.createUserWithEmailAndPassword(email, pass)
        .then((result) => {
          triggerHaptic('win');
          return result.user.updateProfile({ displayName: name }).then(() => {
            console.log("Cuenta creada exitosamente para:", name);
            updateAuthUI(result.user);
          });
        })
        .catch((error) => {
          console.error("Error al registrarse:", error);
          if (error.code === 'auth/email-already-in-use') {
            showAuthAlert("Este correo ya está registrado. Inicia sesión en la pestaña 'Iniciar Sesión'.");
          } else if (error.code === 'auth/weak-password') {
            showAuthAlert("La contraseña debe tener mínimo 6 caracteres.");
          } else if (error.code === 'auth/invalid-email') {
            showAuthAlert("El correo electrónico no es válido.");
          } else if (error.code === 'auth/operation-not-allowed') {
            showAuthAlert("Inicia con Google o habilita 'Correo electrónico' en Firebase Console.");
          } else {
            showAuthAlert(error.message);
          }
        });
    });
  }

  // Profile Modal event listeners
  if (DOM.btnOpenProfile) {
    DOM.btnOpenProfile.addEventListener('click', openProfileModal);
  }
  if (DOM.btnCloseProfile) {
    DOM.btnCloseProfile.addEventListener('click', closeProfileModal);
  }
  if (DOM.btnProfileDone) {
    DOM.btnProfileDone.addEventListener('click', closeProfileModal);
  }
  if (DOM.profileModalOverlay) {
    DOM.profileModalOverlay.addEventListener('click', closeProfileModal);
  }
}

function showAuthScreen() {
  if (DOM.screenAuth) DOM.screenAuth.classList.remove('hidden');
  if (DOM.screenStart) DOM.screenStart.classList.add('hidden');
  if (DOM.screenGame) DOM.screenGame.classList.add('hidden');
  if (DOM.screenResults) DOM.screenResults.classList.add('hidden');
}

function showGameLobby() {
  if (DOM.screenAuth) DOM.screenAuth.classList.add('hidden');
  if (DOM.screenStart) DOM.screenStart.classList.remove('hidden');
  if (DOM.screenGame) DOM.screenGame.classList.add('hidden');
  if (DOM.screenResults) DOM.screenResults.classList.add('hidden');
}

function enterGameLobbyAsGuest() {
  showGameLobby();
  if (DOM.bannerUserPhoto) DOM.bannerUserPhoto.classList.add('hidden');
  if (DOM.bannerUserEmoji) {
    DOM.bannerUserEmoji.classList.remove('hidden');
    DOM.bannerUserEmoji.textContent = '🧑';
  }
  if (DOM.bannerUserName) DOM.bannerUserName.textContent = 'Invitado';
  if (DOM.bannerBadgeVerified) DOM.bannerBadgeVerified.classList.add('hidden');
  if (DOM.bannerUserStatus) DOM.bannerUserStatus.textContent = 'Modo Invitado';
  if (DOM.playerName && !DOM.playerName.value) DOM.playerName.value = 'Invitado';
  loadUserAchievements('guest');
}

function updateAuthUI(user) {
  if (user) {
    const displayName = user.displayName || user.email.split('@')[0];
    const photo = user.photoURL;

    if (photo && DOM.bannerUserPhoto) {
      DOM.bannerUserPhoto.src = photo;
      DOM.bannerUserPhoto.classList.remove('hidden');
      if (DOM.bannerUserEmoji) DOM.bannerUserEmoji.classList.add('hidden');
    } else {
      if (DOM.bannerUserPhoto) DOM.bannerUserPhoto.classList.add('hidden');
      if (DOM.bannerUserEmoji) DOM.bannerUserEmoji.classList.remove('hidden');
    }

    if (DOM.bannerUserName) DOM.bannerUserName.textContent = displayName;
    if (DOM.bannerBadgeVerified) DOM.bannerBadgeVerified.classList.remove('hidden');
    if (DOM.bannerUserStatus) {
      DOM.bannerUserStatus.textContent = user.photoURL ? 'Google Verificado' : 'Cuenta Verificada';
    }

    if (DOM.playerName) {
      DOM.playerName.value = displayName;
    }

    loadUserAchievements(user.uid);
  } else {
    enterGameLobbyAsGuest();
  }
}

function loadUserAchievements(key) {
  try {
    const raw = localStorage.getItem('cgpro_ach_' + key);
    if (raw) {
      userAchievements = new Set(JSON.parse(raw));
    } else {
      userAchievements = new Set();
    }
  } catch {
    userAchievements = new Set();
  }
}

function saveAchievements() {
  const key = currentUser ? currentUser.uid : 'guest';
  try {
    localStorage.setItem('cgpro_ach_' + key, JSON.stringify([...userAchievements]));
  } catch {}

  if (db && currentUser) {
    const playerKey = sanitizeKey(currentUser.displayName);
    db.ref('players/' + playerKey + '/achievements').set([...userAchievements]).catch(() => {});
  }
}

function unlockAchievement(id) {
  if (userAchievements.has(id)) return;
  userAchievements.add(id);
  saveAchievements();

  const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
  if (!ach) return;

  playAchievementFanfare();
  triggerHaptic('win');

  if (DOM.achievementToast) {
    DOM.toastIcon.textContent = ach.icon;
    DOM.toastTitle.textContent = ach.title;
    DOM.toastDesc.textContent = ach.desc;
    DOM.achievementToast.classList.remove('hidden');
    DOM.achievementToast.style.opacity = '1';

    setTimeout(() => {
      DOM.achievementToast.style.opacity = '0';
      setTimeout(() => DOM.achievementToast.classList.add('hidden'), 500);
    }, 4000);
  }
}

function openProfileModal() {
  triggerHaptic('tap');
  if (!DOM.profileModal) return;

  const playerName = (currentUser && currentUser.displayName) || DOM.playerName.value.trim() || 'Jugador';
  DOM.modalUserName.innerHTML = `${escapeHtml(playerName)} ${currentUser ? '<i class="fa-solid fa-circle-check text-neon-cyan text-sm ml-1" title="Verificado con Google"></i>' : ''}`;
  DOM.modalUserAccount.textContent = currentUser ? (currentUser.email || 'Cuenta de Google') : 'Perfil de Invitado';

  if (currentUser && currentUser.photoURL) {
    DOM.modalUserAvatar.innerHTML = `<img src="${currentUser.photoURL}" class="w-full h-full object-cover rounded-full" alt="avatar" />`;
  } else {
    DOM.modalUserAvatar.textContent = config.avatar || '🧠';
  }

  const playerKey = sanitizeKey(playerName);
  let totalScore = 0;
  let bestScore = 0;
  let gamesPlayed = 0;
  let maxStreak = 0;

  const entry = globalLeaderboard.find(p => sanitizeKey(p.name) === playerKey);
  if (entry) {
    totalScore = entry.score || 0;
    bestScore = entry.bestScore || entry.score || 0;
    gamesPlayed = entry.gamesPlayed || 1;
    maxStreak = entry.maxStreak || 0;
  }

  DOM.statTotalScore.textContent = totalScore.toLocaleString();
  DOM.statBestScore.textContent = bestScore.toLocaleString();
  DOM.statGamesPlayed.textContent = gamesPlayed;
  DOM.statMaxStreak.textContent = maxStreak;

  DOM.achievementsCount.textContent = `${userAchievements.size}/${ACHIEVEMENTS_LIST.length}`;
  DOM.achievementsGrid.innerHTML = ACHIEVEMENTS_LIST.map(ach => {
    const isUnlocked = userAchievements.has(ach.id);
    return `
      <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'} flex items-center gap-3">
        <span class="text-2xl flex-shrink-0">${isUnlocked ? ach.icon : '🔒'}</span>
        <div class="min-w-0">
          <p class="text-xs font-bold ${isUnlocked ? 'text-neon-gold' : 'text-slate-400'} truncate">${escapeHtml(ach.title)}</p>
          <p class="text-[10px] text-slate-400 leading-tight">${escapeHtml(ach.desc)}</p>
        </div>
      </div>
    `;
  }).join('');

  DOM.profileModal.classList.remove('hidden');
}

function closeProfileModal() {
  if (DOM.profileModal) DOM.profileModal.classList.add('hidden');
}

// ============================================================
// 7. START SCREEN INITIALIZATION
// ============================================================
function initStartScreen() {
  // Setup Round Length buttons
  const roundBtns = document.querySelectorAll('.round-len-btn');
  roundBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerHaptic('tap');
      roundBtns.forEach(b => {
        b.classList.remove('border-neon-cyan', 'bg-cyan-950/40', 'text-neon-cyan', 'shadow-[0_0_10px_rgba(0,245,255,0.3)]');
        b.classList.add('border-dark-border', 'text-slate-400');
      });
      btn.classList.remove('border-dark-border', 'text-slate-400');
      btn.classList.add('border-neon-cyan', 'bg-cyan-950/40', 'text-neon-cyan', 'shadow-[0_0_10px_rgba(0,245,255,0.3)]');
      config.questionCount = parseInt(btn.dataset.count, 10) || 10;
    });
  });

  // Build avatar grid
  DOM.avatarGrid.innerHTML = AVATARS.map((av, i) =>
    `<button class="avatar-option ${i === 0 ? 'selected' : ''}" data-index="${i}" data-avatar="${av}" title="Avatar ${i + 1}">${av}</button>`
  ).join('');

  DOM.avatarGrid.querySelectorAll('.avatar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.avatarGrid.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Build category chips
  DOM.categoryGrid.innerHTML = CATEGORIES.map((cat, i) =>
    `<button class="category-chip ${i === 0 ? 'selected' : ''}" data-cat="${cat.id}">
       <i class="fa-solid ${cat.icon} mr-1"></i>${cat.label}
     </button>`
  ).join('');

  DOM.categoryGrid.querySelectorAll('.category-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.categoryGrid.querySelectorAll('.category-chip').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Build difficulty chips
  DOM.difficultyGrid.innerHTML = DIFFICULTIES.map((d, i) =>
    `<button class="difficulty-chip ${i === 1 ? 'selected-pro' : ''}" data-diff="${d.id}">
       <i class="fa-solid ${d.icon} mr-1"></i>${d.label}<br/>
       <small class="opacity-70">${d.seconds}s / pregunta</small>
     </button>`
  ).join('');

  DOM.difficultyGrid.querySelectorAll('.difficulty-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.difficultyGrid.querySelectorAll('.difficulty-chip').forEach(b => {
        b.classList.remove('selected-normal', 'selected-pro', 'selected-relampago');
      });
      const classMap = { normal: 'selected-normal', pro: 'selected-pro', relampago: 'selected-relampago' };
      btn.classList.add(classMap[btn.dataset.diff]);
    });
  });

  // Render leaderboard
  renderLeaderboard(DOM.leaderboardStart);

  // Play button
  DOM.btnPlay.addEventListener('click', startGame);
}

// ============================================================
// 8. GAME INITIALIZATION
// ============================================================
function getSelectedConfig() {
  const selectedAvatar = DOM.avatarGrid.querySelector('.avatar-option.selected');
  const selectedCat    = DOM.categoryGrid.querySelector('.category-chip.selected');
  const selectedDiff   = DOM.difficultyGrid.querySelector('.difficulty-chip');
  let activeDiff       = DOM.difficultyGrid.querySelector('.difficulty-chip.selected-normal') ||
                         DOM.difficultyGrid.querySelector('.difficulty-chip.selected-pro') ||
                         DOM.difficultyGrid.querySelector('.difficulty-chip.selected-relampago') ||
                         selectedDiff;

  const name     = DOM.playerName.value.trim() || 'Jugador';
  const avatar   = selectedAvatar ? selectedAvatar.dataset.avatar : '🧑';
  const category = selectedCat ? selectedCat.dataset.cat : 'all';
  const diffId   = activeDiff ? activeDiff.dataset.diff : 'pro';
  const diff     = DIFFICULTIES.find(d => d.id === diffId) || DIFFICULTIES[1];

  return { name, avatar, category, diff };
}

function getQuestions(category, count = 10) {
  let pool = category === 'all'
    ? [...QUESTION_BANK]
    : QUESTION_BANK.filter(q => q.category === category);

  // If not enough questions in category, pad with other categories
  if (pool.length < count) {
    const extras = QUESTION_BANK.filter(q => q.category !== category);
    pool = pool.concat(extras);
  }

  // Shuffle and pick
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

function startGame() {
  ensureAudioCtx(); // Unlock audio on user gesture

  const config = getSelectedConfig();
  const questions = getQuestions(config.category);

  gameState = {
    player:         config.name,
    avatar:         config.avatar,
    category:       config.category,
    diff:           config.diff,
    questions:      questions,
    currentIndex:   0,
    score:          0,
    correct:        0,
    wrong:          0,
    streak:         0,
    maxStreak:      0,
    timePerQ:       [],
    lifelinesFifty: 1,
    lifelinesClue:  1,
    lifelinesTime:  1,
    answered:       false,
    timeLeft:       config.diff.seconds,
  };

  // Update profile UI
  DOM.playerAvatarDisplay.textContent = config.avatar;
  DOM.playerNameDisplay.textContent   = config.name;
  DOM.difficultyBadge.textContent     = config.diff.label;

  // Reset lifeline buttons
  if (DOM.btnFifty) {
    DOM.btnFifty.disabled = false;
    DOM.btnFifty.classList.remove('opacity-30');
  }
  if (DOM.btnClue) {
    DOM.btnClue.disabled = false;
    DOM.btnClue.classList.remove('opacity-30');
  }
  if (DOM.btnTime) {
    DOM.btnTime.disabled  = false;
    DOM.btnTime.classList.remove('opacity-30');
  }

  showScreen('game');
  loadQuestion();
}

// ============================================================
// 9. QUESTION LOADER
// ============================================================
function loadQuestion() {
  clearIntervals();
  DOM.funfactCard.classList.add('hidden');

  const q = gameState.questions[gameState.currentIndex];
  const total = gameState.questions.length;
  const idx   = gameState.currentIndex;

  // Header
  DOM.questionLabel.textContent = `Pregunta ${idx + 1} de ${total}`;
  DOM.progressBar.style.width   = `${(idx / total) * 100}%`;

  // Category badge
  DOM.questionCategoryBadge.textContent = q.categoryLabel;
  DOM.questionCategoryBadge.className   = `category-badge text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${CATEGORY_CSS[q.category] || 'cat-all'}`;

  // Question text with keyword highlights
  DOM.questionText.innerHTML = highlightKeywords(q.question, q.keywords);

  // Options
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  const letters = ['A', 'B', 'C', 'D'];
  optBtns.forEach((btn, i) => {
    btn.disabled = false;
    btn.className = 'option-btn';
    btn.querySelector('.option-letter').textContent = letters[i];
    btn.querySelector('.option-text').textContent   = q.options[i];
    btn.dataset.index = i;
  });

  // Reset timer
  gameState.answered = false;
  gameState.timeLeft = gameState.diff.seconds;
  updateTimerUI(gameState.timeLeft, gameState.diff.seconds);
  updateSpeedStars(gameState.timeLeft, gameState.diff.seconds);

  // Start timer
  startTimer();
}

function highlightKeywords(text, keywords) {
  if (!keywords || !keywords.length) return escapeHtml(text);
  let result = escapeHtml(text);
  keywords.forEach(kw => {
    const regex = new RegExp(`(${escapeRegex(kw)})`, 'gi');
    result = result.replace(regex, '<span class="kw-highlight">$1</span>');
  });
  return result;
}

// ============================================================
// 10. TIMER
// ============================================================
function startTimer() {
  const total = gameState.diff.seconds;
  let elapsed = 0;

  timerInterval = setInterval(() => {
    if (gameState.answered) return;
    gameState.timeLeft--;
    elapsed++;

    updateTimerUI(gameState.timeLeft, total);
    updateSpeedStars(gameState.timeLeft, total);

    if (gameState.timeLeft > 0) {
      // Only tick for the last 5 seconds or relampago mode
      if (gameState.timeLeft <= 5 || gameState.diff.id === 'relampago') {
        playTick();
      }
    } else {
      // Time's up
      clearIntervals();
      onTimeout();
    }
  }, 1000);
}

function updateTimerUI(timeLeft, total) {
  DOM.timerNumber.textContent = String(timeLeft).padStart(2, '0');

  const fraction = timeLeft / total;
  const circumference = 2 * Math.PI * 52; // r=52
  DOM.timerRing.style.strokeDashoffset = circumference * (1 - fraction);

  // Color transitions
  DOM.timerRing.classList.remove('timer-ok', 'timer-warn', 'timer-danger');
  if (timeLeft <= 3) {
    DOM.timerRing.classList.add('timer-danger');
    DOM.timerNumber.className = 'text-4xl font-black leading-none neon-text-red';
  } else if (timeLeft <= Math.ceil(total * 0.4)) {
    DOM.timerRing.classList.add('timer-warn');
    DOM.timerNumber.className = 'text-4xl font-black leading-none neon-text-gold';
  } else {
    DOM.timerRing.classList.add('timer-ok');
    DOM.timerNumber.className = 'text-4xl font-black leading-none neon-text-gold';
  }
}

function updateSpeedStars(timeLeft, total) {
  const stars = DOM.speedStars.querySelectorAll('.fa-star');
  const fraction = timeLeft / total;
  const lit = fraction > 0.65 ? 3 : fraction > 0.33 ? 2 : 1;
  stars.forEach((s, i) => {
    s.style.color = i < lit ? 'var(--neon-gold)' : 'rgba(100,100,100,0.3)';
  });
}

function clearIntervals() {
  if (timerInterval)    { clearInterval(timerInterval); timerInterval = null; }
  if (funfactTimeout)   { clearTimeout(funfactTimeout);  funfactTimeout = null; }
  if (nextQuestionTimeout) { clearTimeout(nextQuestionTimeout); nextQuestionTimeout = null; }
}

// ============================================================
// 11. ANSWER HANDLING
// ============================================================
DOM.optionsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.option-btn');
  if (!btn || gameState.answered || btn.disabled) return;
  handleAnswer(parseInt(btn.dataset.index, 10));
});

function handleAnswer(selectedIndex) {
  if (gameState.answered) return;
  gameState.answered = true;
  clearIntervals();

  const q = gameState.questions[gameState.currentIndex];
  const timeUsed = gameState.diff.seconds - gameState.timeLeft;
  const isCorrect = selectedIndex === q.correct;

  // Record time
  gameState.timePerQ.push(timeUsed);

  // Mark options
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => { btn.disabled = true; });

  if (isCorrect) {
    optBtns[selectedIndex].classList.add('correct');
    handleCorrect(timeUsed);
  } else {
    optBtns[selectedIndex].classList.add('incorrect');
    optBtns[q.correct].classList.add('correct');
    handleWrong();
  }

  // Show fun fact
  showFunfact(q.funfact);
}

function handleCorrect(timeUsed) {
  playCorrect();
  triggerHaptic('correct');
  gameState.correct++;
  gameState.streak++;

  // Chequear logros de partida
  if (timeUsed <= 3) unlockAchievement('speed_3');
  if (gameState.streak >= 5) unlockAchievement('streak_5');
  if (gameState.streak >= 10) unlockAchievement('streak_10');

  if (gameState.streak > gameState.maxStreak) {
    gameState.maxStreak = gameState.streak;
  }

  // Calculate points
  const base     = gameState.diff.basePoints;
  const speedPct = Math.max(0, 1 - (timeUsed / gameState.diff.seconds));
  const speedBonus = Math.round(base * 0.5 * speedPct);
  let multiplier = 1;

  if (gameState.streak >= 3) {
    multiplier = Math.min(3, 1 + Math.floor(gameState.streak / 3) * 0.5);
  }

  const points = Math.round((base + speedBonus) * multiplier);
  gameState.score += points;

  // Update streak UI
  updateStreakUI();

  // Update score with animation
  animateScore(points);
  updateScoreDisplay();

  // Mini confetti
  fireSmallConfetti();

  // Update stats
  DOM.statCorrect.textContent = gameState.correct;
}

function handleWrong() {
  playWrong();
  triggerHaptic('wrong');
  gameState.wrong++;
  gameState.streak = 0;
  updateStreakUI();
  DOM.statWrong.textContent = gameState.wrong;

  // Shake screen briefly
  DOM.screenGame.style.animation = 'none';
  requestAnimationFrame(() => {
    DOM.screenGame.style.animation = '';
  });
}

function onTimeout() {
  if (gameState.answered) return;
  gameState.answered = true;
  playTimeout();

  const q = gameState.questions[gameState.currentIndex];
  const optBtns = DOM.optionsGrid.querySelectorAll('.option-btn');
  optBtns.forEach(btn => { btn.disabled = true; });
  optBtns[q.correct].classList.add('correct');

  gameState.wrong++;
  gameState.streak = 0;
  updateStreakUI();
  DOM.statWrong.textContent = gameState.wrong;

  showFunfact(q.funfact);
}

// ============================================================
// 12. SCORE & STREAK UI
// ============================================================
function updateScoreDisplay() {
  DOM.scoreDisplay.textContent = `${gameState.score.toLocaleString()} PTS`;
  DOM.scoreBadge.classList.remove('score-bump');
  requestAnimationFrame(() => DOM.scoreBadge.classList.add('score-bump'));
}

function updateStreakUI() {
  DOM.statStreak.textContent = gameState.maxStreak;

  if (gameState.streak >= 3) {
    const multiplier = Math.min(3, 1 + Math.floor(gameState.streak / 3) * 0.5).toFixed(1);
    DOM.streakDisplay.classList.remove('hidden');
    DOM.streakCount.textContent = `x${multiplier}`;
    DOM.streakDisplay.classList.remove('streak-fire');
    requestAnimationFrame(() => DOM.streakDisplay.classList.add('streak-fire'));
  } else {
    DOM.streakDisplay.classList.add('hidden');
  }
}

function animateScore(points) {
  const popup = DOM.scorePopup;
  popup.textContent = `+${points}`;

  // Position near score badge
  const badge  = DOM.scoreBadge.getBoundingClientRect();
  popup.style.left = `${badge.left + badge.width / 2}px`;
  popup.style.top  = `${badge.top}px`;
  popup.style.transform = 'translateX(-50%)';
  popup.classList.remove('hidden');

  popup.style.animation = 'none';
  requestAnimationFrame(() => {
    popup.style.animation = 'popupFloat 1.4s ease-out forwards';
  });

  setTimeout(() => popup.classList.add('hidden'), 1500);
}

// ============================================================
// 13. FUN FACT & NEXT QUESTION
// ============================================================
function showFunfact(text) {
  DOM.funfactText.textContent = text;
  DOM.funfactCard.classList.remove('hidden');

  let countdown = 4;
  DOM.funfactCountdown.textContent = `Siguiente en ${countdown}s...`;

  const tick = () => {
    countdown--;
    if (countdown > 0) {
      DOM.funfactCountdown.textContent = `Siguiente en ${countdown}s...`;
      funfactTimeout = setTimeout(tick, 1000);
    } else {
      advanceQuestion();
    }
  };

  funfactTimeout = setTimeout(tick, 1000);
  DOM.btnNext.onclick = () => {
    clearIntervals();
    advanceQuestion();
  };
}

function advanceQuestion() {
  DOM.funfactCard.classList.add('hidden');
  gameState.currentIndex++;

  if (gameState.currentIndex >= gameState.questions.length) {
    endGame();
  } else {
    // Small delay for transition
    nextQuestionTimeout = setTimeout(loadQuestion, 300);
  }
}

// ============================================================
// 14. LIFELINES
// ============================================================
DOM.btnFifty.addEventListener('click', () => {
  if (gameState.answered || gameState.lifelinesFifty <= 0) return;
  gameState.lifelinesFifty--;
  DOM.btnFifty.disabled = true;

  const q = gameState.questions[gameState.currentIndex];
  const optBtns = Array.from(DOM.optionsGrid.querySelectorAll('.option-btn'));

  // Find wrong answers to eliminate (2 of the 3 wrong ones)
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correct && !optBtns[i].classList.contains('eliminated'));
  const toEliminate = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);

  toEliminate.forEach(i => {
    optBtns[i].classList.add('eliminated');
    optBtns[i].disabled = true;
  });

  playTone({ frequency: 440, type: 'sine', duration: 0.1, gain: 0.2 });
  playTone({ frequency: 330, type: 'sine', duration: 0.1, gain: 0.2, delay: 0.12 });
});

if (DOM.btnClue) {
  DOM.btnClue.addEventListener('click', () => {
    if (gameState.answered || gameState.lifelinesClue <= 0) return;
    gameState.lifelinesClue--;
    DOM.btnClue.disabled = true;

    const q = gameState.questions[gameState.currentIndex];
    const optBtns = Array.from(DOM.optionsGrid.querySelectorAll('.option-btn'));

    // Eliminate 1 random wrong answer
    const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correct && !optBtns[i].classList.contains('eliminated'));
    if (wrongIndices.length > 0) {
      const idx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      optBtns[idx].classList.add('eliminated');
      optBtns[idx].disabled = true;
    }

    playTone({ frequency: 587.33, type: 'triangle', duration: 0.15, gain: 0.25 });
    playTone({ frequency: 880.00, type: 'triangle', duration: 0.25, gain: 0.25, delay: 0.12 });
  });
}

DOM.btnTime.addEventListener('click', () => {
  if (gameState.answered || gameState.lifelinesTime <= 0) return;
  gameState.lifelinesTime--;
  DOM.btnTime.disabled = true;

  gameState.timeLeft = Math.min(gameState.timeLeft + 5, gameState.diff.seconds + 5);
  updateTimerUI(gameState.timeLeft, gameState.diff.seconds);

  playTone({ frequency: 660, type: 'sine', duration: 0.15, gain: 0.2 });
  playTone({ frequency: 880, type: 'sine', duration: 0.2,  gain: 0.2, delay: 0.15 });
});

// ============================================================
// 15. END GAME & RESULTS
// ============================================================
function buildEntry(incomplete = false) {
  const totalQ   = gameState.questions.length;
  const answered = gameState.correct + gameState.wrong;
  const accuracy = answered > 0 ? Math.round((gameState.correct / answered) * 100) : 0;
  return {
    name:       gameState.player,
    avatar:     (currentUser && currentUser.photoURL) ? currentUser.photoURL : gameState.avatar,
    photoURL:   (currentUser && currentUser.photoURL) ? currentUser.photoURL : null,
    isGoogle:   !!currentUser,
    uid:        currentUser ? currentUser.uid : null,
    score:      gameState.score,
    accuracy:   accuracy,
    streak:     gameState.maxStreak,
    diff:       gameState.diff.label,
    date:       new Date().toLocaleDateString('es-ES'),
    incomplete: incomplete,
  };
}

function endGame(incomplete = false) {
  clearIntervals();
  if (!incomplete) playFanfare();

  // Progress bar to 100%
  DOM.progressBar.style.width = '100%';

  // Calculate stats
  const entry    = buildEntry(incomplete);
  const avgTime  = gameState.timePerQ.length
    ? Math.round(gameState.timePerQ.reduce((a, b) => a + b, 0) / gameState.timePerQ.length)
    : 0;
  const rank = getRank(gameState.score);

  // Chequear logros al finalizar
  if (!incomplete) {
    unlockAchievement('first_game');
    if (gameState.score >= 1000) unlockAchievement('score_1000');
    if (entry.accuracy === 100 && (gameState.correct + gameState.wrong) >= 5) {
      unlockAchievement('perfect_round');
    }
    const pKey = sanitizeKey(gameState.player);
    const existing = globalLeaderboard.find(p => sanitizeKey(p.name) === pKey);
    if (existing && (existing.score || 0) >= 3000) {
      unlockAchievement('titan_3000');
    }
  }

  // Save to leaderboard
  saveToLeaderboard(entry);

  // Update results screen
  DOM.rankTitle.textContent   = incomplete ? '🏃 Partida Interrumpida' : rank;
  DOM.resScore.textContent    = gameState.score.toLocaleString();
  DOM.resAccuracy.textContent = `${entry.accuracy}%`;
  DOM.resStreak.textContent   = gameState.maxStreak;
  DOM.resTime.textContent     = `${avgTime}s`;

  renderLeaderboard(DOM.leaderboardResults, gameState.score, gameState.player);

  showScreen('results');

  // Confetti (only full game)
  if (!incomplete) setTimeout(() => fireConfetti(), 400);
  else {
    // Small confetti for partial
    setTimeout(() => confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 }, colors: ['#ffd700','#00f5ff'], zIndex: 9999 }), 400);
  }

  // Share button
  DOM.btnShare.onclick = () => shareResult(rank, entry.accuracy);
  if (DOM.btnShareWhatsapp) {
    DOM.btnShareWhatsapp.onclick = () => {
      triggerHaptic('tap');
      const msg = `🏆 ¡Obtuve ${gameState.score.toLocaleString()} PTS (${DOM.rankTitle.textContent}) en CULTURA GENERAL PRO! ¿Crees que puedes superarme? 🧠\n\nJuega gratis aquí: ${window.location.href}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    };
  }

  DOM.btnReplay.onclick = () => {
    showScreen('start');
    renderLeaderboard(DOM.leaderboardStart);
  };
}

function getRank(score) {
  let rank = RANKS[0].title;
  for (const r of RANKS) {
    if (score >= r.min) rank = r.title;
  }
  return rank;
}

function shareResult(rank, accuracy) {
  const text = `🎮 ¡Acabo de jugar CULTURA GENERAL PRO!\n\n` +
    `🏆 Rango: ${rank}\n` +
    `⭐ Puntos: ${gameState.score.toLocaleString()} PTS\n` +
    `🎯 Precisión: ${accuracy}%\n` +
    `🔥 Racha máx.: ${gameState.maxStreak}\n` +
    `💪 Dificultad: ${gameState.diff.label}\n\n` +
    `¿Puedes superarme? 🧠`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      DOM.btnShare.innerHTML = '<i class="fa-solid fa-check mr-2 text-neon-green"></i>¡Copiado!';
      setTimeout(() => {
        DOM.btnShare.innerHTML = '<i class="fa-solid fa-share-nodes mr-2"></i>Compartir';
      }, 2500);
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  alert('Resultado copiado al portapapeles');
}

// ============================================================
// 16. CONFETTI
// ============================================================
function fireConfetti() {
  const duration = 3500;
  const end = Date.now() + duration;

  const colors = ['#00f5ff', '#ffd700', '#39ff14', '#ff073a', '#ffffff'];

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      zIndex: 9999,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function fireSmallConfetti() {
  const badge = DOM.scoreBadge.getBoundingClientRect();
  confetti({
    particleCount: 20,
    spread: 50,
    origin: {
      x: (badge.left + badge.width / 2) / window.innerWidth,
      y: (badge.top + badge.height / 2) / window.innerHeight,
    },
    colors: ['#00f5ff', '#ffd700', '#39ff14'],
    scalar: 0.7,
    zIndex: 9999,
  });
}

// ============================================================
// 17. MUTE BUTTON
// ============================================================
DOM.btnMute.addEventListener('click', toggleMute);

// ============================================================
// 17b. EXIT MODAL
// ============================================================
function openExitModal() {
  if (!gameState.diff) return; // not in game
  DOM.exitScorePreview.textContent = `${gameState.score.toLocaleString()} PTS`;
  DOM.exitModal.classList.remove('hidden');
}

function closeExitModal() {
  DOM.exitModal.classList.add('hidden');
}

DOM.btnExitGame.addEventListener('click', openExitModal);
DOM.btnExitCancel.addEventListener('click', closeExitModal);
DOM.exitModalOverlay.addEventListener('click', closeExitModal);

DOM.btnExitConfirm.addEventListener('click', () => {
  closeExitModal();
  endGame(true); // incomplete = true
});

// ============================================================
// 18. SCREEN MANAGEMENT
// ============================================================
function showScreen(name) {
  if (DOM.screenAuth) DOM.screenAuth.classList.add('hidden');
  if (DOM.screenStart) DOM.screenStart.classList.add('hidden');
  if (DOM.screenGame) DOM.screenGame.classList.add('hidden');
  if (DOM.screenResults) DOM.screenResults.classList.add('hidden');

  const screenMap = {
    auth:    DOM.screenAuth,
    start:   DOM.screenStart,
    game:    DOM.screenGame,
    results: DOM.screenResults,
  };

  const el = screenMap[name];
  if (el) {
    el.classList.remove('hidden');
    // Re-trigger animation
    el.style.animation = 'none';
    requestAnimationFrame(() => { el.style.animation = ''; });
    window.scrollTo(0, 0);
  }
}

// ============================================================
// 19. UTILITY FUNCTIONS
// ============================================================
function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, m => map[m]);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================
// 20. BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initAuth();
  initStartScreen();
  initRealtimeLeaderboard();

  // Unlock AudioContext on first interaction
  document.addEventListener('pointerdown', ensureAudioCtx, { once: true });
});
