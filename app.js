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

const ACHIEVEMENTS_LIST = [
  { id: 'first_game',    title: 'Primera Partida',   desc: 'Completa tu primera partida', icon: '🎮' },
  { id: 'speed_3',       title: 'Velocidad Mental',  desc: 'Responde en menos de 3 segundos', icon: '⚡' },
  { id: 'streak_5',      title: 'En Racha (x5)',     desc: 'Acierta 5 preguntas consecutivas', icon: '🔥' },
  { id: 'streak_10',     title: 'Imparable (x10)',   desc: 'Acierta 10 preguntas consecutivas', icon: '🌟' },
  { id: 'perfect_round', title: 'Ronda Perfecta',    desc: 'Termina con 100% de precisión', icon: '🎯' },
  { id: 'score_1000',    title: 'Club de los 1.000', desc: 'Consigue 1.000 puntos en un juego', icon: '⭐' },
  { id: 'titan_3000',    title: 'Titán del Saber',   desc: 'Supera los 3.000 puntos acumulados', icon: '👑' },
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
let userAchievements = new Set();
let auth = null;
let currentUser = null;
let config = { questionCount: 10 };

// 1 vs 1 Duel State
let isDuelMode = false;
let currentDuelRoom = null;
let duelPlayerRole = null; // 'p1' or 'p2'
let duelRoomListener = null;
let duelOpponent = { name: 'Rival', score: 0, avatar: '👾', photoURL: null };
let duelQuestionCount = 5;

// Admin Panel State
let isAdminAuthenticated = false;
let adminAllPlayers = {};

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

  // Game Mode & Duel Elements
  modeSoloTab:          $('mode-solo-tab'),
  modeDuelTab:          $('mode-duel-tab'),
  panelSolo:            $('panel-solo'),
  panelDuel:            $('panel-duel'),
  duelTabCreate:        $('duel-tab-create'),
  duelTabJoin:          $('duel-tab-join'),
  duelSubpanelCreate:   $('duel-subpanel-create'),
  duelSubpanelJoin:     $('duel-subpanel-join'),
  btnCreateRoom:        $('btn-create-room'),
  duelWaitingCard:      $('duel-waiting-card'),
  createdRoomCode:      $('created-room-code'),
  btnCopyRoomCode:      $('btn-copy-room-code'),
  btnCopyText:          $('btn-copy-text'),
  btnShareDuelWhatsapp: $('btn-share-duel-whatsapp'),
  duelWaitingStatus:    $('duel-waiting-status'),
  inputRoomCode:        $('input-room-code'),
  btnJoinRoom:          $('btn-join-room'),
  duelJoinError:        $('duel-join-error'),
  duelVsBar:            $('duel-vs-bar'),
  duelYouPhoto:         $('duel-you-photo'),
  duelYouAvatar:        $('duel-you-avatar'),
  duelYouName:          $('duel-you-name'),
  duelYouScore:         $('duel-you-score'),
  duelOppPhoto:         $('duel-opp-photo'),
  duelOppAvatar:        $('duel-opp-avatar'),
  duelOppName:          $('duel-opp-name'),
  duelOppScore:         $('duel-opp-score'),
  duelResultsCard:      $('duel-results-card'),
  duelResultBadge:      $('duel-result-badge'),
  duelResultSubtitle:   $('duel-result-subtitle'),
  duelFinalYouScore:    $('duel-final-you-score'),
  duelFinalOppName:     $('duel-final-opp-name'),
  duelFinalOppScore:    $('duel-final-opp-score'),

  // Global Announcement
  globalAnnouncement:   $('global-announcement'),
  announcementText:     $('announcement-text'),

  // Admin Elements
  btnOpenAdmin:         $('btn-open-admin'),
  adminPinModal:        $('admin-pin-modal'),
  adminPinOverlay:      $('admin-pin-overlay'),
  formAdminPin:         $('form-admin-pin'),
  inputAdminPin:        $('input-admin-pin'),
  btnClosePinModal:     $('btn-close-pin-modal'),
  adminDashboardModal:  $('admin-dashboard-modal'),
  adminDashboardOverlay:$('admin-dashboard-overlay'),
  btnCloseAdminDash:    $('btn-close-admin-dash'),
  adminTabStats:        $('admin-tab-stats'),
  adminTabPlayers:      $('admin-tab-players'),
  adminTabQuestions:    $('admin-tab-questions'),
  adminTabAnnouncement: $('admin-tab-announcement'),
  adminPanelStats:      $('admin-panel-stats'),
  adminPanelPlayers:    $('admin-panel-players'),
  adminPanelQuestions:  $('admin-panel-questions'),
  adminPanelAnnouncement:$('admin-panel-announcement'),
  adminStatTotalPlayers:$('admin-stat-total-players'),
  adminStatTotalScore:  $('admin-stat-total-score'),
  adminStatTotalGames:  $('admin-stat-total-games'),
  adminStatTotalQuestions:$('admin-stat-total-questions'),
  btnAdminRefresh:      $('btn-admin-refresh'),
  adminSearchPlayers:   $('admin-search-players'),
  btnAdminClearAll:     $('btn-admin-clear-all'),
  adminPlayersList:     $('admin-players-list'),
  formAdminAddQuestion: $('form-admin-add-question'),
  adminQCategory:       $('admin-q-category'),
  adminQCorrect:        $('admin-q-correct'),
  adminQText:           $('admin-q-text'),
  adminQOpt0:           $('admin-q-opt-0'),
  adminQOpt1:           $('admin-q-opt-1'),
  adminQOpt2:           $('admin-q-opt-2'),
  adminQOpt3:           $('admin-q-opt-3'),
  adminQFunfact:        $('admin-q-funfact'),
  adminQSuccess:        $('admin-q-success'),
  adminAnnouncementInput:$('admin-announcement-input'),
  adminAnnouncementActive:$('admin-announcement-active'),
  btnAdminSaveAnnouncement:$('btn-admin-save-announcement'),
  btnAdminClearAnnouncement:$('btn-admin-clear-announcement'),
  adminAnnouncementStatus:$('admin-announcement-status'),

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
  if (DOM.authAlert) {
    DOM.authAlert.textContent = msg;
    DOM.authAlert.className = isSuccess 
      ? "p-3 rounded-xl text-xs font-poppins border border-green-500/40 bg-green-950/40 text-green-300 flex items-center gap-2"
      : "p-3 rounded-xl text-xs font-poppins border border-red-500/40 bg-red-950/40 text-red-300 flex items-center gap-2";
    DOM.authAlert.classList.remove('hidden');
    DOM.authAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  if (!isSuccess) {
    console.warn("Auth alert:", msg);
  }
}

function clearAuthAlert() {
  if (DOM.authAlert) DOM.authAlert.classList.add('hidden');
}

function getFirebaseAuth() {
  if (auth) return auth;
  try {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      auth = firebase.auth();
      return auth;
    }
  } catch (err) {
    console.error("Error obteniendo Firebase Auth:", err);
  }
  return null;
}

function initAuth() {
  console.log("initAuth() iniciado...");

  // 1. Tab Iniciar Sesión
  if (DOM.tabLogin) {
    DOM.tabLogin.addEventListener('click', () => {
      triggerHaptic('tap');
      clearAuthAlert();
      DOM.tabLogin.className = "py-2.5 rounded-lg transition-all text-neon-cyan bg-cyan-950/60 shadow-[0_0_10px_rgba(0,245,255,0.2)]";
      if (DOM.tabRegister) DOM.tabRegister.className = "py-2.5 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.formLogin) DOM.formLogin.classList.remove('hidden');
      if (DOM.formRegister) DOM.formRegister.classList.add('hidden');
    });
  }

  // 2. Tab Registrarte
  if (DOM.tabRegister) {
    DOM.tabRegister.addEventListener('click', () => {
      triggerHaptic('tap');
      clearAuthAlert();
      DOM.tabRegister.className = "py-2.5 rounded-lg transition-all text-neon-gold bg-amber-950/60 shadow-[0_0_10px_rgba(255,215,0,0.2)]";
      if (DOM.tabLogin) DOM.tabLogin.className = "py-2.5 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.formRegister) DOM.formRegister.classList.remove('hidden');
      if (DOM.formLogin) DOM.formLogin.classList.add('hidden');
    });
  }

  // 3. Jugar como Invitado
  if (DOM.btnGuestPlay) {
    DOM.btnGuestPlay.addEventListener('click', () => {
      triggerHaptic('tap');
      sessionStorage.setItem('cgpro_guest', '1');
      enterGameLobbyAsGuest();
    });
  }

  // 4. Cambiar Cuenta / Cerrar Sesión
  if (DOM.btnSwitchAccount) {
    DOM.btnSwitchAccount.addEventListener('click', () => {
      triggerHaptic('tap');
      const authInst = getFirebaseAuth();
      if (authInst && currentUser) {
        authInst.signOut().finally(() => {
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

  // 5. Iniciar sesión con Google (1 solo clic)
  if (DOM.btnGoogleLoginMain) {
    DOM.btnGoogleLoginMain.addEventListener('click', () => {
      triggerHaptic('tap');
      clearAuthAlert();
      const authInst = getFirebaseAuth();
      if (!authInst) {
        showAuthAlert("Firebase Auth no está listo aún. Revisa tu conexión a internet.");
        alert("Firebase Auth no está listo. Verifica que cargó la librería de Firebase.");
        return;
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');

      authInst.signInWithPopup(provider)
        .then((result) => {
          triggerHaptic('win');
          playTone({ frequency: 660, type: 'sine', duration: 0.15, gain: 0.2 });
          playTone({ frequency: 880, type: 'sine', duration: 0.2, gain: 0.2, delay: 0.12 });
          console.log("Sesión iniciada con Google:", result.user.displayName);
        })
        .catch((error) => {
          console.error("Error al iniciar sesión con Google:", error);
          if (error.code === 'auth/unauthorized-domain') {
            const host = window.location.hostname;
            const msg = "Dominio no autorizado en Firebase: '" + host + "'. Añádelo en Firebase Console -> Authentication -> Settings -> Dominios autorizados.";
            showAuthAlert(msg);
            alert(msg);
          } else if (error.code === 'auth/operation-not-allowed') {
            const msg = "Google no está habilitado en Firebase. Ve a Firebase Console -> Authentication -> Sign-in method y activa Google.";
            showAuthAlert(msg);
            alert(msg);
          } else if (error.code === 'auth/popup-blocked') {
            authInst.signInWithRedirect(provider);
          } else if (error.code !== 'auth/popup-closed-by-user') {
            showAuthAlert("Error al iniciar con Google: " + error.message);
            alert("Error con Google: " + error.message);
          }
        });
    });
  }

  // 6. Formulario Iniciar Sesión (Email)
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
      const authInst = getFirebaseAuth();
      if (!authInst) {
        showAuthAlert("Servicio de autenticación no disponible.");
        return;
      }

      authInst.signInWithEmailAndPassword(email, pass)
        .then((result) => {
          triggerHaptic('win');
          console.log("Sesión iniciada con correo:", result.user.email);
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
          if (error.code === 'auth/user-not-found') {
            showAuthAlert("No existe cuenta con este correo. Ve a la pestaña 'Registrarte'.");
          } else if (error.code === 'auth/wrong-password') {
            showAuthAlert("Contraseña incorrecta. Inténtalo de nuevo.");
          } else if (error.code === 'auth/invalid-email') {
            showAuthAlert("El correo electrónico no es válido.");
          } else if (error.code === 'auth/operation-not-allowed') {
            showAuthAlert("Correo/Contraseña no habilitado en Firebase. Usa el botón de Google o actívalo en Firebase Console.");
            alert("Correo/Contraseña no está habilitado en Firebase Console. Por favor usa 'Continuar con Google'.");
          } else {
            showAuthAlert(error.message);
          }
        });
    });
  }

  // 7. Formulario Registrarte (Email + Nombre)
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
      const authInst = getFirebaseAuth();
      if (!authInst) {
        showAuthAlert("Servicio de autenticación no disponible.");
        return;
      }

      authInst.createUserWithEmailAndPassword(email, pass)
        .then((result) => {
          triggerHaptic('win');
          return result.user.updateProfile({ displayName: name }).then(() => {
            console.log("Cuenta creada para:", name);
            updateAuthUI(result.user);
            showGameLobby();
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
            showAuthAlert("El registro con correo no está habilitado en Firebase. Inicia sesión con el botón 'Continuar con Google'.");
            alert("El proveedor de Correo/Contraseña no está habilitado en tu Firebase. Usa el botón 'Continuar con Google' que es con 1 solo clic.");
          } else {
            showAuthAlert(error.message);
          }
        });
    });
  }

  // 8. Escuchar cambios de sesión de Firebase Auth
  const authInst = getFirebaseAuth();
  if (authInst) {
    authInst.onAuthStateChanged((user) => {
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
  } else {
    // Si no hay Firebase disponible, entra como invitado
    console.warn("Firebase Auth no disponible en el inicio, usando invitado.");
    enterGameLobbyAsGuest();
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

    // Panel Admin: Visible ÚNICAMENTE para la cuenta del dueño
    const ADMIN_EMAILS = ['kristianguillermo53@gmail.com'];
    const isOwner = user.email && ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
    if (DOM.btnOpenAdmin) {
      if (isOwner) DOM.btnOpenAdmin.classList.remove('hidden');
      else DOM.btnOpenAdmin.classList.add('hidden');
    }
  } else {
    enterGameLobbyAsGuest();
    if (DOM.btnOpenAdmin) DOM.btnOpenAdmin.classList.add('hidden');
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
  try {
    if (!userAchievements) userAchievements = new Set();
    if (userAchievements.has(id)) return;
    userAchievements.add(id);
    saveAchievements();

    const list = (typeof ACHIEVEMENTS_LIST !== 'undefined') ? ACHIEVEMENTS_LIST : [];
    const ach = list.find(a => a.id === id);
    if (!ach) return;

    playAchievementFanfare();
    triggerHaptic('win');

    if (DOM.achievementToast && DOM.toastIcon && DOM.toastTitle && DOM.toastDesc) {
      DOM.toastIcon.textContent = ach.icon;
      DOM.toastTitle.textContent = ach.title;
      DOM.toastDesc.textContent = ach.desc;
      DOM.achievementToast.classList.remove('hidden');
      DOM.achievementToast.style.opacity = '1';

      setTimeout(() => {
        if (DOM.achievementToast) {
          DOM.achievementToast.style.opacity = '0';
          setTimeout(() => DOM.achievementToast.classList.add('hidden'), 500);
        }
      }, 4000);
    }
  } catch (err) {
    console.warn("Logro omitido por error no crítico:", err);
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

  const selectedCfg = getSelectedConfig();
  const qCount = (config && config.questionCount) ? config.questionCount : 10;
  const questions = getQuestions(selectedCfg.category, qCount);

  gameState = {
    player:         selectedCfg.name,
    avatar:         selectedCfg.avatar,
    category:       selectedCfg.category,
    diff:           selectedCfg.diff,
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
    timeLeft:       selectedCfg.diff.seconds,
  };

  // Update profile UI
  DOM.playerAvatarDisplay.textContent = selectedCfg.avatar;
  DOM.playerNameDisplay.textContent   = selectedCfg.name;
  DOM.difficultyBadge.textContent     = selectedCfg.diff.label;

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
  if (isDuelMode) updateDuelScoreInFirebase(gameState.score);

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
  if (isDuelMode) finishDuelInFirebase();

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

  if (isDuelMode) {
    finishDuelInFirebase();
    if (DOM.duelResultsCard) DOM.duelResultsCard.classList.remove('hidden');
    if (db && currentDuelRoom) {
      db.ref('rooms/' + currentDuelRoom).once('value').then(snap => {
        const room = snap.val();
        if (room) renderDuelFinalResult(room, duelPlayerRole);
      });
    }
  } else {
    if (DOM.duelResultsCard) DOM.duelResultsCard.classList.add('hidden');
  }

  DOM.btnReplay.onclick = () => {
    isDuelMode = false;
    currentDuelRoom = null;
    duelPlayerRole = null;
    if (DOM.duelVsBar) DOM.duelVsBar.classList.add('hidden');
    if (DOM.duelResultsCard) DOM.duelResultsCard.classList.add('hidden');
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
// 15b. REALTIME 1 VS 1 DUEL SYSTEM
// ============================================================
function initDuelSystem() {
  // Mode switcher: Solitario vs Duelo
  if (DOM.modeSoloTab && DOM.modeDuelTab) {
    DOM.modeSoloTab.addEventListener('click', () => {
      triggerHaptic('tap');
      DOM.modeSoloTab.className = "py-2.5 rounded-lg transition-all text-neon-cyan bg-cyan-950/60 shadow-[0_0_10px_rgba(0,245,255,0.2)]";
      DOM.modeDuelTab.className = "py-2.5 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.panelSolo) DOM.panelSolo.classList.remove('hidden');
      if (DOM.panelDuel) DOM.panelDuel.classList.add('hidden');
    });

    DOM.modeDuelTab.addEventListener('click', () => {
      triggerHaptic('tap');
      DOM.modeDuelTab.className = "py-2.5 rounded-lg transition-all text-neon-gold bg-amber-950/60 shadow-[0_0_10px_rgba(255,215,0,0.2)]";
      DOM.modeSoloTab.className = "py-2.5 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.panelDuel) DOM.panelDuel.classList.remove('hidden');
      if (DOM.panelSolo) DOM.panelSolo.classList.add('hidden');
    });
  }

  // Subtabs: Crear Sala vs Unirse
  if (DOM.duelTabCreate && DOM.duelTabJoin) {
    DOM.duelTabCreate.addEventListener('click', () => {
      triggerHaptic('tap');
      DOM.duelTabCreate.className = "py-2 rounded-lg transition-all text-neon-gold bg-amber-950/60 shadow-[0_0_8px_rgba(255,215,0,0.2)]";
      DOM.duelTabJoin.className = "py-2 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.duelSubpanelCreate) DOM.duelSubpanelCreate.classList.remove('hidden');
      if (DOM.duelSubpanelJoin) DOM.duelSubpanelJoin.classList.add('hidden');
    });

    DOM.duelTabJoin.addEventListener('click', () => {
      triggerHaptic('tap');
      DOM.duelTabJoin.className = "py-2 rounded-lg transition-all text-neon-cyan bg-cyan-950/60 shadow-[0_0_8px_rgba(0,245,255,0.2)]";
      DOM.duelTabCreate.className = "py-2 rounded-lg transition-all text-slate-400 hover:text-white";
      if (DOM.duelSubpanelJoin) DOM.duelSubpanelJoin.classList.remove('hidden');
      if (DOM.duelSubpanelCreate) DOM.duelSubpanelCreate.classList.add('hidden');
    });
  }

  // Selector de preguntas en Duelo (5 o 10)
  const duelBtns = document.querySelectorAll('.duel-len-btn');
  duelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerHaptic('tap');
      duelBtns.forEach(b => {
        b.classList.remove('border-neon-cyan', 'bg-cyan-950/40', 'text-neon-cyan');
        b.classList.add('border-dark-border', 'text-slate-400');
      });
      btn.classList.remove('border-dark-border', 'text-slate-400');
      btn.classList.add('border-neon-cyan', 'bg-cyan-950/40', 'text-neon-cyan');
      duelQuestionCount = parseInt(btn.dataset.count, 10) || 5;
    });
  });

  // Botón Crear Sala
  if (DOM.btnCreateRoom) {
    DOM.btnCreateRoom.addEventListener('click', () => {
      triggerHaptic('tap');
      createDuelRoom();
    });
  }

  // Copiar código de sala
  if (DOM.btnCopyRoomCode) {
    DOM.btnCopyRoomCode.addEventListener('click', () => {
      if (!currentDuelRoom) return;
      triggerHaptic('tap');
      navigator.clipboard.writeText(currentDuelRoom).then(() => {
        if (DOM.btnCopyText) DOM.btnCopyText.textContent = "¡Copiado!";
        setTimeout(() => { if (DOM.btnCopyText) DOM.btnCopyText.textContent = "Copiar"; }, 2000);
      });
    });
  }

  // Compartir reto por WhatsApp
  if (DOM.btnShareDuelWhatsapp) {
    DOM.btnShareDuelWhatsapp.addEventListener('click', () => {
      if (!currentDuelRoom) return;
      triggerHaptic('tap');
      const msg = `⚔️ ¡Te reto a un DUELO en CULTURA GENERAL PRO!\\n\\n1. Entra a: ${window.location.origin + window.location.pathname}\\n2. Elige 'Duelo 1 vs 1' -> 'Unirse a Sala'\\n3. Ingresa el código: *${currentDuelRoom}*\\n\\n¡A ver quién sabe más! 🧠🔥`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }

  // Botón Unirse a Sala
  if (DOM.btnJoinRoom) {
    DOM.btnJoinRoom.addEventListener('click', () => {
      triggerHaptic('tap');
      const code = (DOM.inputRoomCode ? DOM.inputRoomCode.value : '').trim().toUpperCase();
      if (!code) {
        showDuelJoinError("Por favor escribe el código de la sala.");
        return;
      }
      joinDuelRoom(code);
    });
  }
}

function showDuelJoinError(msg) {
  if (DOM.duelJoinError) {
    DOM.duelJoinError.textContent = msg;
    DOM.duelJoinError.classList.remove('hidden');
  }
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function createDuelRoom() {
  if (!db) {
    alert("Firebase Database no disponible para multijugador.");
    return;
  }
  const roomCode = generateRoomCode();
  currentDuelRoom = roomCode;
  duelPlayerRole = 'p1';

  const playerName = (currentUser && currentUser.displayName) || (DOM.playerName ? DOM.playerName.value.trim() : '') || 'Jugador 1';
  const playerPhoto = (currentUser && currentUser.photoURL) || null;
  const playerAvatar = config.avatar || '🧑';

  // Obtener preguntas idénticas para ambos jugadores
  const questions = getQuestions('all', duelQuestionCount);

  const roomData = {
    code: roomCode,
    createdAt: Date.now(),
    status: 'waiting', // waiting, playing, finished
    qCount: duelQuestionCount,
    questions: questions,
    p1: {
      name: playerName,
      photoURL: playerPhoto,
      avatar: playerAvatar,
      score: 0,
      finished: false
    },
    p2: null
  };

  db.ref('rooms/' + roomCode).set(roomData).then(() => {
    if (DOM.createdRoomCode) DOM.createdRoomCode.textContent = roomCode;
    if (DOM.duelWaitingCard) DOM.duelWaitingCard.classList.remove('hidden');
    if (DOM.duelWaitingStatus) DOM.duelWaitingStatus.textContent = "Esperando a que tu rival se una...";

    // Escuchar cuando el rival se conecte
    listenToDuelRoom(roomCode, 'p1');
  }).catch(err => {
    console.error("Error creando sala:", err);
    alert("Error al crear la sala: " + err.message);
  });
}

function joinDuelRoom(code) {
  if (!db) {
    alert("Firebase Database no disponible.");
    return;
  }
  if (DOM.duelJoinError) DOM.duelJoinError.classList.add('hidden');

  db.ref('rooms/' + code).once('value').then(snapshot => {
    const room = snapshot.val();
    if (!room) {
      showDuelJoinError("No existe ninguna sala con el código '" + code + "'.");
      return;
    }
    if (room.status !== 'waiting' || room.p2) {
      showDuelJoinError("Esta sala ya está llena o el duelo ya empezó.");
      return;
    }

    const playerName = (currentUser && currentUser.displayName) || (DOM.playerName ? DOM.playerName.value.trim() : '') || 'Jugador 2';
    const playerPhoto = (currentUser && currentUser.photoURL) || null;
    const playerAvatar = config.avatar || '👾';

    const p2Data = {
      name: playerName,
      photoURL: playerPhoto,
      avatar: playerAvatar,
      score: 0,
      finished: false
    };

    // Actualizar objeto localmente
    room.p2 = p2Data;
    room.status = 'playing';

    // Actualizar sala con Jugador 2 y arrancar
    db.ref('rooms/' + code).update({
      p2: p2Data,
      status: 'playing'
    }).then(() => {
      currentDuelRoom = code;
      duelPlayerRole = 'p2';
      startDuelGame(room, 'p2');
      listenToDuelRoom(code, 'p2');
    }).catch(err => {
      showDuelJoinError("Error al unirse: " + err.message);
    });
  });
}

function listenToDuelRoom(code, myRole) {
  if (duelRoomListener) {
    db.ref('rooms/' + code).off('value', duelRoomListener);
  }

  duelRoomListener = (snapshot) => {
    const room = snapshot.val();
    if (!room) return;

    const oppRole = myRole === 'p1' ? 'p2' : 'p1';
    const opp = room[oppRole];

    // Si P1 estaba esperando y P2 se une:
    if (myRole === 'p1' && room.status === 'playing' && !isDuelMode) {
      if (DOM.duelWaitingStatus) DOM.duelWaitingStatus.textContent = "¡Rival conectado! Iniciando...";
      setTimeout(() => {
        startDuelGame(room, 'p1');
      }, 800);
    }

    // Actualizar puntaje del rival en vivo en la pantalla de juego
    if (opp && isDuelMode) {
      duelOpponent = opp;
      if (DOM.duelOppScore) DOM.duelOppScore.textContent = `${(opp.score || 0).toLocaleString()} PTS`;
      if (DOM.duelOppName) DOM.duelOppName.textContent = opp.name || 'Rival';
      if (opp.photoURL && DOM.duelOppPhoto) {
        DOM.duelOppPhoto.src = opp.photoURL;
        DOM.duelOppPhoto.classList.remove('hidden');
        if (DOM.duelOppAvatar) DOM.duelOppAvatar.classList.add('hidden');
      } else {
        if (DOM.duelOppPhoto) DOM.duelOppPhoto.classList.add('hidden');
        if (DOM.duelOppAvatar) {
          DOM.duelOppAvatar.classList.remove('hidden');
          DOM.duelOppAvatar.textContent = opp.avatar || '👾';
        }
      }
    }

    // Comprobar si ambos terminaron
    if (room.p1 && room.p1.finished && room.p2 && room.p2.finished) {
      renderDuelFinalResult(room, myRole);
    }
  };

  db.ref('rooms/' + code).on('value', duelRoomListener);
}

function startDuelGame(room, role) {
  if (!room) return;
  isDuelMode = true;
  currentDuelRoom = room.code;
  duelPlayerRole = role;

  const myRoleData = (room && room[role]) || {
    name: (currentUser && currentUser.displayName) || (DOM.playerName ? DOM.playerName.value.trim() : '') || (role === 'p1' ? 'Jugador 1' : 'Jugador 2'),
    avatar: config.avatar || '🧑',
    photoURL: (currentUser && currentUser.photoURL) || null,
    score: 0
  };
  const oppRole = role === 'p1' ? 'p2' : 'p1';
  const oppRoleData = (room && room[oppRole]) || { name: 'Rival', score: 0, avatar: '👾', photoURL: null };
  duelOpponent = oppRoleData;

  // Configurar barra de Duelo VS
  if (DOM.duelVsBar) DOM.duelVsBar.classList.remove('hidden');
  if (DOM.duelYouName) DOM.duelYouName.textContent = myRoleData.name || 'Tú';
  if (DOM.duelYouScore) DOM.duelYouScore.textContent = '0 PTS';
  if (myRoleData.photoURL && DOM.duelYouPhoto) {
    DOM.duelYouPhoto.src = myRoleData.photoURL;
    DOM.duelYouPhoto.classList.remove('hidden');
    if (DOM.duelYouAvatar) DOM.duelYouAvatar.classList.add('hidden');
  } else {
    if (DOM.duelYouPhoto) DOM.duelYouPhoto.classList.add('hidden');
    if (DOM.duelYouAvatar) {
      DOM.duelYouAvatar.classList.remove('hidden');
      DOM.duelYouAvatar.textContent = myRoleData.avatar || '🧑';
    }
  }

  if (DOM.duelOppName) DOM.duelOppName.textContent = oppRoleData.name || 'Rival';
  if (DOM.duelOppScore) DOM.duelOppScore.textContent = '0 PTS';
  if (oppRoleData.photoURL && DOM.duelOppPhoto) {
    DOM.duelOppPhoto.src = oppRoleData.photoURL;
    DOM.duelOppPhoto.classList.remove('hidden');
    if (DOM.duelOppAvatar) DOM.duelOppAvatar.classList.add('hidden');
  } else {
    if (DOM.duelOppPhoto) DOM.duelOppPhoto.classList.add('hidden');
    if (DOM.duelOppAvatar) {
      DOM.duelOppAvatar.classList.remove('hidden');
      DOM.duelOppAvatar.textContent = oppRoleData.avatar || '👾';
    }
  }

  // Iniciar juego con las preguntas idénticas de la sala
  ensureAudioCtx();
  gameState = {
    player:         myRoleData.name || 'Jugador',
    avatar:         myRoleData.avatar || '🧑',
    category:       'all',
    diff:           DIFFICULTIES[1], // Pro (10s)
    questions:      room.questions || getQuestions('all', 5),
    currentIndex:   0,
    score:          0,
    correct:        0,
    wrong:          0,
    streak:         0,
    maxStreak:      0,
    answered:       false,
    timePerQ:       [],
    lifelinesFifty: 1,
    lifelinesTime:  1,
    lifelinesClue:  1,
    timeLeft:       10,
  };

  DOM.playerAvatarDisplay.textContent = myRoleData.avatar || '🧑';
  DOM.playerNameDisplay.textContent   = myRoleData.name || 'Jugador';
  DOM.difficultyBadge.textContent     = 'Duelo 1 vs 1';

  // Mostrar pantalla de juego
  showScreen('game');
  loadQuestion();
}

function updateDuelScoreInFirebase(newScore) {
  if (!isDuelMode || !currentDuelRoom || !duelPlayerRole || !db) return;
  db.ref('rooms/' + currentDuelRoom + '/' + duelPlayerRole + '/score').set(newScore).catch(() => {});
}

function finishDuelInFirebase() {
  if (!isDuelMode || !currentDuelRoom || !duelPlayerRole || !db) return;
  db.ref('rooms/' + currentDuelRoom + '/' + duelPlayerRole + '/finished').set(true).catch(() => {});
}

function renderDuelFinalResult(room, myRole) {
  if (!DOM.duelResultsCard) return;
  DOM.duelResultsCard.classList.remove('hidden');

  const myData = room[myRole] || {};
  const oppRole = myRole === 'p1' ? 'p2' : 'p1';
  const oppData = room[oppRole] || {};

  const myScore = myData.score || 0;
  const oppScore = oppData.score || 0;

  if (DOM.duelFinalYouScore) DOM.duelFinalYouScore.textContent = `${myScore.toLocaleString()} PTS`;
  if (DOM.duelFinalOppName) DOM.duelFinalOppName.textContent = oppData.name || 'Rival';
  if (DOM.duelFinalOppScore) DOM.duelFinalOppScore.textContent = `${oppScore.toLocaleString()} PTS`;

  if (myScore > oppScore) {
    if (DOM.duelResultBadge) {
      DOM.duelResultBadge.textContent = "🏆 ¡VICTORIA ÉPICA!";
      DOM.duelResultBadge.className = "text-3xl sm:text-4xl font-black uppercase tracking-wider text-neon-gold";
    }
    if (DOM.duelResultSubtitle) DOM.duelResultSubtitle.textContent = "¡Venciste a tu rival en conocimientos!";
    fireSmallConfetti();
    playTone({ frequency: 587, type: 'sine', duration: 0.15, gain: 0.25 });
    playTone({ frequency: 880, type: 'sine', duration: 0.35, gain: 0.3, delay: 0.15 });
  } else if (myScore < oppScore) {
    if (DOM.duelResultBadge) {
      DOM.duelResultBadge.textContent = "💀 DERROTA";
      DOM.duelResultBadge.className = "text-3xl sm:text-4xl font-black uppercase tracking-wider text-neon-red";
    }
    if (DOM.duelResultSubtitle) DOM.duelResultSubtitle.textContent = "Tu rival fue más rápido esta vez. ¡Pide la revancha!";
  } else {
    if (DOM.duelResultBadge) {
      DOM.duelResultBadge.textContent = "🤝 ¡EMPATE TÉCNICO!";
      DOM.duelResultBadge.className = "text-3xl sm:text-4xl font-black uppercase tracking-wider text-neon-cyan";
    }
    if (DOM.duelResultSubtitle) DOM.duelResultSubtitle.textContent = "¡Increíble duelo! Tuvieron la misma puntuación.";
  }
}

// ============================================================
// 15c. PANEL DE ADMINISTRACIÓN 100% FUNCIONAL
// ============================================================
const ADMIN_PIN_DEFAULT = '9999';

function initAdminSystem() {
  // 1. Escuchar Anuncio Global en vivo desde Firebase
  if (db) {
    db.ref('announcement').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data && data.active && data.message && data.message.trim()) {
        if (DOM.announcementText) DOM.announcementText.textContent = data.message.trim();
        if (DOM.globalAnnouncement) DOM.globalAnnouncement.classList.remove('hidden');
      } else {
        if (DOM.globalAnnouncement) DOM.globalAnnouncement.classList.add('hidden');
      }
    });

    // 2. Escuchar Preguntas personalizadas agregadas por el Admin
    db.ref('customQuestions').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const customList = Object.values(data);
        customList.forEach(q => {
          if (!QUESTION_BANK.some(existing => existing.question === q.question)) {
            QUESTION_BANK.push(q);
          }
        });
        if (DOM.adminStatTotalQuestions) {
          DOM.adminStatTotalQuestions.textContent = QUESTION_BANK.length.toLocaleString();
        }
      }
    });
  }

  // 3. Abrir modal de Admin
  if (DOM.btnOpenAdmin) {
    DOM.btnOpenAdmin.addEventListener('click', () => {
      triggerHaptic('tap');
      if (isAdminAuthenticated) {
        openAdminDashboard();
      } else {
        if (DOM.adminPinModal) DOM.adminPinModal.classList.remove('hidden');
        if (DOM.inputAdminPin) DOM.inputAdminPin.focus();
      }
    });
  }

  // 3b. Gesto secreto: 5 toques rápidos en el título para abrir Admin desde cualquier móvil
  let secretClickCount = 0;
  let secretClickTimer = null;
  const headerTitles = document.querySelectorAll('.animate-float');
  headerTitles.forEach(titleEl => {
    titleEl.addEventListener('click', () => {
      secretClickCount++;
      clearTimeout(secretClickTimer);
      secretClickTimer = setTimeout(() => { secretClickCount = 0; }, 1600);
      if (secretClickCount >= 5) {
        secretClickCount = 0;
        triggerHaptic('win');
        if (isAdminAuthenticated) {
          openAdminDashboard();
        } else {
          if (DOM.adminPinModal) DOM.adminPinModal.classList.remove('hidden');
          if (DOM.inputAdminPin) DOM.inputAdminPin.focus();
        }
      }
    });
  });

  // 4. Cerrar PIN modal
  if (DOM.btnClosePinModal) {
    DOM.btnClosePinModal.addEventListener('click', () => {
      if (DOM.adminPinModal) DOM.adminPinModal.classList.add('hidden');
    });
  }
  if (DOM.adminPinOverlay) {
    DOM.adminPinOverlay.addEventListener('click', () => {
      if (DOM.adminPinModal) DOM.adminPinModal.classList.add('hidden');
    });
  }

  // 5. Submit PIN
  if (DOM.formAdminPin) {
    DOM.formAdminPin.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHaptic('tap');
      const enteredPin = (DOM.inputAdminPin ? DOM.inputAdminPin.value : '').trim();
      const storedPin = localStorage.getItem('cgpro_admin_pin') || ADMIN_PIN_DEFAULT;

      if (enteredPin === storedPin) {
        isAdminAuthenticated = true;
        if (DOM.adminPinModal) DOM.adminPinModal.classList.add('hidden');
        openAdminDashboard();
      } else {
        alert("PIN incorrecto. (PIN por defecto: 9999)");
      }
    });
  }

  // 6. Cerrar Dashboard Modal
  if (DOM.btnCloseAdminDash) {
    DOM.btnCloseAdminDash.addEventListener('click', closeAdminDashboard);
  }
  if (DOM.adminDashboardOverlay) {
    DOM.adminDashboardOverlay.addEventListener('click', closeAdminDashboard);
  }

  // 7. Tabs del Dashboard
  const adminTabs = [
    { tab: DOM.adminTabStats, panel: DOM.adminPanelStats },
    { tab: DOM.adminTabPlayers, panel: DOM.adminPanelPlayers },
    { tab: DOM.adminTabQuestions, panel: DOM.adminPanelQuestions },
    { tab: DOM.adminTabAnnouncement, panel: DOM.adminPanelAnnouncement },
  ];

  adminTabs.forEach(({ tab, panel }) => {
    if (tab && panel) {
      tab.addEventListener('click', () => {
        triggerHaptic('tap');
        adminTabs.forEach(item => {
          if (item.tab) item.tab.className = "py-2 rounded-lg text-slate-400 hover:text-white transition";
          if (item.panel) item.panel.classList.add('hidden');
        });
        tab.className = "py-2 rounded-lg text-neon-cyan bg-cyan-950/60 shadow-sm transition";
        panel.classList.remove('hidden');
      });
    }
  });

  // 8. Botón Actualizar Métricas
  if (DOM.btnAdminRefresh) {
    DOM.btnAdminRefresh.addEventListener('click', () => {
      triggerHaptic('tap');
      loadAdminData();
    });
  }

  // 9. Buscador de jugadores
  if (DOM.adminSearchPlayers) {
    DOM.adminSearchPlayers.addEventListener('input', (e) => {
      renderAdminPlayersList(e.target.value.toLowerCase().trim());
    });
  }

  // 10. Botón Limpiar toda la tabla
  if (DOM.btnAdminClearAll) {
    DOM.btnAdminClearAll.addEventListener('click', () => {
      triggerHaptic('tap');
      const confirmText = prompt("⚠️ ACCIÓN DE PELIGRO:\\nPara borrar toda la tabla de jugadores de Firebase, escribe 'BORRAR':");
      if (confirmText === 'BORRAR' && db) {
        db.ref('players').remove().then(() => {
          localStorage.removeItem('cgpro_leaderboard');
          globalLeaderboard = [];
          updateAllLeaderboardViews();
          loadAdminData();
          alert("¡Tabla de jugadores completamente reiniciada!");
        });
      }
    });
  }

  // 11. Formulario Agregar Pregunta
  if (DOM.formAdminAddQuestion) {
    DOM.formAdminAddQuestion.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHaptic('tap');
      const category = DOM.adminQCategory.value;
      const correctIdx = parseInt(DOM.adminQCorrect.value, 10);
      const questionText = DOM.adminQText.value.trim();
      const opts = [
        DOM.adminQOpt0.value.trim(),
        DOM.adminQOpt1.value.trim(),
        DOM.adminQOpt2.value.trim(),
        DOM.adminQOpt3.value.trim()
      ];
      const funfact = DOM.adminQFunfact.value.trim();

      const catLabels = { geo: 'Geografía', hist: 'Historia', sci: 'Ciencia', art: 'Arte', pop: 'Cultura Pop', dep: 'Deportes' };

      const newQ = {
        category: category,
        categoryLabel: catLabels[category] || 'General',
        question: questionText,
        options: opts,
        correct: correctIdx,
        funfact: funfact,
        keywords: [opts[correctIdx]]
      };

      if (db) {
        db.ref('customQuestions').push(newQ).then(() => {
          QUESTION_BANK.push(newQ);
          if (DOM.adminQSuccess) {
            DOM.adminQSuccess.classList.remove('hidden');
            setTimeout(() => DOM.adminQSuccess.classList.add('hidden'), 3500);
          }
          DOM.formAdminAddQuestion.reset();
        });
      }
    });
  }

  // 12. Guardar y Desactivar Anuncio Global
  if (DOM.btnAdminSaveAnnouncement) {
    DOM.btnAdminSaveAnnouncement.addEventListener('click', () => {
      triggerHaptic('tap');
      const msg = (DOM.adminAnnouncementInput ? DOM.adminAnnouncementInput.value : '').trim();
      const active = DOM.adminAnnouncementActive ? DOM.adminAnnouncementActive.checked : false;

      if (!db) return;
      db.ref('announcement').set({ message: msg, active: active }).then(() => {
        if (DOM.adminAnnouncementStatus) {
          DOM.adminAnnouncementStatus.textContent = "¡Anuncio global guardado y actualizado en vivo!";
          DOM.adminAnnouncementStatus.classList.remove('hidden');
          setTimeout(() => DOM.adminAnnouncementStatus.classList.add('hidden'), 3000);
        }
      });
    });
  }

  if (DOM.btnAdminClearAnnouncement) {
    DOM.btnAdminClearAnnouncement.addEventListener('click', () => {
      triggerHaptic('tap');
      if (DOM.adminAnnouncementActive) DOM.adminAnnouncementActive.checked = false;
      if (DOM.adminAnnouncementInput) DOM.adminAnnouncementInput.value = '';
      if (db) {
        db.ref('announcement').set({ message: '', active: false });
      }
    });
  }
}

function openAdminDashboard() {
  if (DOM.adminDashboardModal) DOM.adminDashboardModal.classList.remove('hidden');
  loadAdminData();
}

function closeAdminDashboard() {
  if (DOM.adminDashboardModal) DOM.adminDashboardModal.classList.add('hidden');
}

function loadAdminData() {
  if (!db) return;
  db.ref('players').once('value').then(snapshot => {
    adminAllPlayers = snapshot.val() || {};
    renderAdminStats();
    renderAdminPlayersList();
  });

  db.ref('announcement').once('value').then(snapshot => {
    const data = snapshot.val();
    if (data && DOM.adminAnnouncementInput && DOM.adminAnnouncementActive) {
      DOM.adminAnnouncementInput.value = data.message || '';
      DOM.adminAnnouncementActive.checked = !!data.active;
    }
  });
}

function renderAdminStats() {
  const players = Object.values(adminAllPlayers);
  const totalPlayers = players.length;
  const totalScore = players.reduce((acc, p) => acc + (p.totalScore || p.bestScore || 0), 0);
  const totalGames = players.reduce((acc, p) => acc + (p.gamesPlayed || 1), 0);

  if (DOM.adminStatTotalPlayers) DOM.adminStatTotalPlayers.textContent = totalPlayers.toLocaleString();
  if (DOM.adminStatTotalScore) DOM.adminStatTotalScore.textContent = totalScore.toLocaleString();
  if (DOM.adminStatTotalGames) DOM.adminStatTotalGames.textContent = totalGames.toLocaleString();
  if (DOM.adminStatTotalQuestions) DOM.adminStatTotalQuestions.textContent = QUESTION_BANK.length.toLocaleString();
}

function renderAdminPlayersList(filter = '') {
  if (!DOM.adminPlayersList) return;
  const entries = Object.entries(adminAllPlayers);

  if (!entries.length) {
    DOM.adminPlayersList.innerHTML = `<p class="p-4 text-center text-xs text-slate-500 font-poppins">No hay jugadores registrados en Firebase.</p>`;
    return;
  }

  const filtered = entries.filter(([key, p]) => {
    const name = (p.name || '').toLowerCase();
    return name.includes(filter);
  });

  if (!filtered.length) {
    DOM.adminPlayersList.innerHTML = `<p class="p-4 text-center text-xs text-slate-500 font-poppins">No se encontraron jugadores con ese nombre.</p>`;
    return;
  }

  DOM.adminPlayersList.innerHTML = filtered.map(([key, p]) => {
    const avatar = p.photoURL 
      ? `<img src="${escapeHtml(p.photoURL)}" class="w-7 h-7 rounded-full object-cover border border-neon-cyan flex-shrink-0" />`
      : `<span class="text-lg">${p.avatar || '🧑'}</span>`;

    const score = (p.totalScore || p.bestScore || 0).toLocaleString();
    const games = p.gamesPlayed || 1;

    return `
      <div class="p-3 flex items-center justify-between gap-2 hover:bg-slate-800/40 transition">
        <div class="flex items-center gap-2 min-w-0">
          ${avatar}
          <div class="min-w-0">
            <p class="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>${escapeHtml(p.name || 'Anónimo')}</span>
              ${p.isGoogle ? '<i class="fa-solid fa-circle-check text-neon-cyan text-[10px]"></i>' : ''}
            </p>
            <p class="text-[10px] text-slate-400 font-mono">${score} PTS • ${games} partidas</p>
          </div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button type="button" class="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-neon-gold transition" onclick="adminEditScore('${key}', '${escapeHtml(p.name || '')}', ${p.totalScore || 0})">
            ✏️ Editar
          </button>
          <button type="button" class="text-[10px] px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 transition" onclick="adminDeletePlayer('${key}', '${escapeHtml(p.name || '')}')">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Global window functions for Admin player actions
window.adminEditScore = function(key, name, currentScore) {
  const newScoreStr = prompt(`Ingresa el nuevo puntaje para "${name}":`, currentScore);
  if (newScoreStr !== null && !isNaN(parseInt(newScoreStr, 10)) && db) {
    const newScore = parseInt(newScoreStr, 10);
    db.ref('players/' + key + '/totalScore').set(newScore).then(() => {
      loadAdminData();
      alert(`Puntaje actualizado para ${name} a ${newScore.toLocaleString()} PTS.`);
    });
  }
};

window.adminDeletePlayer = function(key, name) {
  if (confirm(`¿Eliminar al jugador "${name}" de Firebase?`) && db) {
    db.ref('players/' + key).remove().then(() => {
      loadAdminData();
      alert(`Jugador ${name} eliminado.`);
    });
  }
};

// ============================================================
// 20. BOOT
// ============================================================
function bootApp() {
  initParticles();
  initAuth();
  initStartScreen();
  initRealtimeLeaderboard();
  initDuelSystem();
  initAdminSystem();

  // Unlock AudioContext on first interaction
  document.addEventListener('pointerdown', ensureAudioCtx, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApp);
} else {
  bootApp();
}
