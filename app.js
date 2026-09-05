const firebaseConfig = {
  apiKey: "AIzaSyAlDzlJY5tRBMV6GoGmZ0fkL8BYoPE-0pg",
  authDomain: "borsa-valori.firebaseapp.com",
  projectId: "borsa-valori",
  storageBucket: "borsa-valori.firebasestorage.app",
  messagingSenderId: "105238124748",
  appId: "1:105238124748:web:b1a7924caf087632c3ca69"
};

// ─── DEMO MODE: als Firebase niet geconfigureerd is, draait de app in lokale demo-modus ───
const DEMO_MODE = (firebaseConfig.apiKey === "JOUW_API_KEY");

// Demo data store
let demoStore = {
  users: {
    'admin@borsa.intern': { uid: 'uid_admin', email: 'admin@borsa.intern', username: 'admin', displayName: 'Admin Borsa', rol: 'admin' },
    'reisco@borsa.intern': { uid: 'uid_reisco', email: 'reisco@borsa.intern', username: 'reisco', displayName: 'Reisco Lid', rol: 'reisco' },
    'lid@borsa.intern': { uid: 'uid_lid', email: 'lid@borsa.intern', username: 'lid', displayName: 'Gewoon Lid', rol: 'lid' }
  },
  passwords: {
    'admin@borsa.intern': 'admin123',
    'reisco@borsa.intern': 'reisco123',
    'lid@borsa.intern': 'lid123'
  },
  currentUser: null,
  beleggingsboeken: [],
  pitches: [],
  adminFolders: { '': [] },
  reiscoFolders: { '': [] },
  adminDocumenten: [],
  planning: [],
  planningOpen: false,
  kandidaten: [],
  kandidatenZichtbaar: false,
  stemmenOpen: true,
  stemDeadline: null,
  introActief: false,
  moneyManUid: null,
  praesesUid: null,
  smQueenUid: null,
  adminProjects: {},
  reiscoProjects: {},
  comments: {},
  leden: []
};

// Seed ledenlijst (koppelbaar aan username; niet-gekoppelde rijen kunnen later
// door een Admin gekoppeld worden als het lid een account krijgt)
const LEDEN_SEED = [
  { naam: 'Ilza van Biezen',        geboortedatum: '2003-02-20', telefoon: '31640197232', email: 'ilzavanbiezen@gmail.com',        adres: 'Rechter rottekade 403, 3032XH',         hosten: 'ja', dieet: '-' },
  { naam: 'Thea Boeva',             geboortedatum: '2002-10-08', telefoon: '31639601516', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Daan Damman',            geboortedatum: '2004-07-24', telefoon: '31611427686', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Rochelle Diermont',      geboortedatum: '2006-07-26', telefoon: '31616773658', email: 'rochellewallerd2006@outlook.com', adres: 'Coolhaven 544, 3024AR',                  hosten: '-',  dieet: '-' },
  { naam: 'Oscar Heijsteeg',        geboortedatum: '2004-10-27', telefoon: '31629515115', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Kio Husseini',           geboortedatum: '2001-06-02', telefoon: '31644554044', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Inge Koomen',            geboortedatum: '2001-11-17', telefoon: '31619659588', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Tanya Mehta',            geboortedatum: '2005-09-08', telefoon: '32488423211', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Luuk van de Merwe',      geboortedatum: '2005-05-02', telefoon: '31613769555', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Anne Onrust',            geboortedatum: '2001-06-21', telefoon: '31625254631', email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Diederick Rijntjes',     geboortedatum: '',           telefoon: '',            email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Boid Rosendaal',         geboortedatum: '2006-05-16', telefoon: '',            email: '',                                adres: '',                                       hosten: '',   dieet: '' },
  { naam: 'Isa Schelhaas',          geboortedatum: '2002-06-21', telefoon: '31681802015', email: 'Isaschelhaas@hotmail.com',        adres: 'Oudedijk 158, 3061AP',                   hosten: 'ja', dieet: '-' },
  { naam: 'Elias Stad',             geboortedatum: '2002-06-20', telefoon: '31640614137', email: 'es.eliasstad@gmail.com',         adres: 'Oude Binnenweg 106H',                    hosten: '-',  dieet: '-' },
  { naam: 'Lieor Stassen',          geboortedatum: '2005-12-13', telefoon: '31664919042', email: 'lieorstassen@gmail.com',         adres: 'Herman Robbersstraat 104E, 3031RL',      hosten: 'ja', dieet: '-' },
  { naam: 'Ruben Talen',            geboortedatum: '2001-05-29', telefoon: '31622657995', email: 'rtalen01@gmail.com',             adres: 'Kralingse Kerklaan 470, 3065CC',         hosten: 'ja', dieet: '-' },
  { naam: 'Sarah van der Vaart',    geboortedatum: '2007-03-26', telefoon: '31615335700', email: 'sarahangemaria@icloud.com',      adres: 'Andoorn 23, 3068 MA',                    hosten: '-',  dieet: '-' }
];

LEDEN_SEED.forEach((l, i) => {
  demoStore.leden.push({ id: 'lid_' + i, koppelUsername: '', ...l });
});

// Seed planning rows
for (let i = 0; i < 8; i++) {
  demoStore.planning.push({
    id: 'plan_' + i,
    datum: '',
    tijd: '',
    typeAvond: '',
    locatie: '',
    hosten: '',
    helpen: '',
    pitchenOud: '',
    pitchenNieuw: ''
  });
}

let currentUser = null;
let currentUserData = null;
let currentPage = 'home';

// Ontsnapt gebruikersinvoer voordat het als HTML in de pagina wordt gezet (voorkomt XSS)
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── AUTH ───────────────────────────────────────────────────────────────────

function usernameToEmail(username) {
  // Verwijder @borsa.intern als iemand dat per ongeluk mee typt
  const clean = username.replace(/@borsa\.intern$/, '').toLowerCase().trim();
  return clean + '@borsa.intern';
}

function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  const pw = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';

  if (!username) { errEl.textContent = '⚠️ Voer een gebruikersnaam in.'; return; }

  const email = usernameToEmail(username);

  if (DEMO_MODE) {
    // Demo login: zoek op gebruikersnaam in displayName of email
    const user = Object.values(demoStore.users).find(u =>
      u.username === username || u.email === email
    );
    const correctPw = user ? demoStore.passwords[user.email] : null;
    if (user && correctPw === pw) {
      demoStore.currentUser = user;
      currentUser = user;
      currentUserData = user;
      onLoginSuccess(user);
    } else {
      errEl.textContent = '⚠️ Ongeldige gebruikersnaam of wachtwoord.';
    }
    return;
  }

  // Firebase login: gebruikersnaam omzetten naar intern e-mailadres
  firebase.auth().signInWithEmailAndPassword(email, pw)
    .then(cred => {
      currentUser = cred.user;
      return db.collection('users').doc(cred.user.uid).get();
    })
    .then(doc => {
      if (!doc.exists) {
        errEl.textContent = '⚠️ Geen profiel gevonden voor deze gebruiker (UID: ' + currentUser.uid + '). Vraag een Admin om dit aan te maken in Firestore.';
        firebase.auth().signOut();
        return;
      }
      currentUserData = doc.data();
      onLoginSuccess(currentUser);
    })
    .catch(e => {
      console.error('Login error:', e);
      errEl.textContent = '⚠️ ' + (e.message || 'Ongeldige gebruikersnaam of wachtwoord.');
    });
}

function doLogout() {
  if (DEMO_MODE) {
    demoStore.currentUser = null;
    currentUser = null; currentUserData = null;
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('app-shell').style.display = 'none';
    return;
  }
  firebase.auth().signOut();
}

function onLoginSuccess(user) {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-shell').style.display = 'block';
  const displayNaam = currentUserData.displayName || user.email;
  document.getElementById('topbar-name').textContent = displayNaam;
  document.getElementById('topbar-role').textContent = currentUserData.rol || 'lid';
  // Avatar initiaal
  const avatar = document.getElementById('profiel-avatar');
  if (avatar) avatar.textContent = displayNaam.charAt(0).toUpperCase();
  const menuNaam = document.getElementById('menu-naam');
  if (menuNaam) menuNaam.textContent = displayNaam;
  const menuEmail = document.getElementById('menu-email');
  if (menuEmail) menuEmail.textContent = currentUserData.email || '';

  if (DEMO_MODE) {
    renderSidebar();
    navigateTo('home');
    return;
  }

  // Laad instellingen (kandidatenZichtbaar, planningOpen) vanuit Firestore
  // voordat de sidebar en pagina worden gerenderd
  Promise.all([
    db.collection('settings').doc('kandidaten').get(),
    db.collection('settings').doc('planning').get(),
    db.collection('settings').doc('stemmen').get(),
    db.collection('settings').doc('app').get()
  ]).then(([kandidatenSnap, planningSnap, stemmenSnap, appSnap]) => {
    if (kandidatenSnap.exists) {
      demoStore.kandidatenZichtbaar = kandidatenSnap.data().zichtbaar === true;
    }
    if (planningSnap.exists) {
      demoStore.planningOpen = planningSnap.data().open === true;
    }
    if (stemmenSnap && stemmenSnap.exists) {
      demoStore.stemmenOpen = stemmenSnap.data().open !== false;
      demoStore.stemDeadline = stemmenSnap.data().deadline || null;
    }
    if (appSnap && appSnap.exists) {
      demoStore.introActief = appSnap.data().introActief === true;
      demoStore.moneyManUid = appSnap.data().moneyManUid || null;
      demoStore.praesesUid = appSnap.data().praesesUid || null;
      demoStore.smQueenUid = appSnap.data().smQueenUid || null;
    }
  }).catch(() => {
    // Instellingen bestaan nog niet — gebruik defaults (false)
  }).finally(() => {
    renderSidebar();
    // Laad planning alvast in de achtergrond zodat het dashboard direct data heeft
    if (!DEMO_MODE) {
      db.collection('planning').get().then(snap => {
        demoStore.planning = [];
        snap.forEach(doc => demoStore.planning.push({ id: doc.id, ...doc.data() }));
      }).catch(() => {});
    }
    navigateTo('home');
  });
}

function isAdmin() { return currentUserData && currentUserData.rol === 'admin'; }
function isMoneyman() {
  if (!currentUser) return false;
  return demoStore.moneyManUid === currentUser.uid ||
         demoStore.moneyManUid === currentUserData.uid ||
         demoStore.moneyManUid === currentUserData.username;
}
function isReisco() { return currentUserData && (currentUserData.rol === 'reisco' || isAdmin()); }

// ─── FIREBASE INIT (only if not demo) ───────────────────────────────────────
let db, storage, auth;
if (!DEMO_MODE) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  storage = firebase.storage();
  auth = firebase.auth();

  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      db.collection('users').doc(user.uid).get().then(doc => {
        if (!doc.exists) {
          console.error('Geen Firestore-profiel gevonden voor UID:', user.uid);
          const errEl = document.getElementById('login-error');
          if (errEl) errEl.textContent = '⚠️ Geen profiel gevonden voor UID: ' + user.uid + '. Vraag een Admin om dit profiel in Firestore aan te maken.';
          firebase.auth().signOut();
          return;
        }
        currentUserData = doc.data();
        onLoginSuccess(user);
      }).catch(e => {
        console.error('Firestore fout bij ophalen profiel:', e);
      });
    }
  });
}

// ─── SIDEBAR ────────────────────────────────────────────────────────────────

function renderTopbarIntroToggle() {
  const el = document.getElementById('topbar-intro-toggle');
  if (!el) return;
  if (!isAdmin()) { el.innerHTML = ''; return; }
  el.innerHTML = `
    <label class="toggle-switch" style="margin-right:12px;">
      <input type="checkbox" ${demoStore.introActief ? 'checked' : ''} onchange="toggleAppInstelling('introActief', this.checked)">
      <div class="toggle-track"></div>
      <span style="color:#fff;">👥 Introperiode actief</span>
    </label>`;
}

function renderSidebar() {
  renderTopbarIntroToggle();
  const sidebar = document.getElementById('sidebar');
  const rol = currentUserData ? currentUserData.rol : 'lid';
  const kandidatenZichtbaar = isAdmin() || demoStore.kandidatenZichtbaar;

  let html = `
    <div class="nav-section">
      <div class="nav-section-title">Navigatie</div>
      <div class="nav-item" onclick="navigateTo('home')" data-page="home">
        <span class="nav-icon">🏠</span> Home
      </div>
      <div class="nav-item" onclick="navigateTo('beleggingsboeken')" data-page="beleggingsboeken">
        <span class="nav-icon">📚</span> Beleggingsboeken
      </div>
      <div class="nav-item" onclick="navigateTo('pitches')" data-page="pitches">
        <span class="nav-icon">📊</span> Oude Pitches
      </div>
      <div class="nav-item" onclick="navigateTo('planning')" data-page="planning">
        <span class="nav-icon">📅</span> Planning
      </div>
      <div class="nav-item" onclick="navigateTo('leden')" data-page="leden">
        <span class="nav-icon">🪪</span> Leden
      </div>`;

  if (kandidatenZichtbaar) {
    html += `
      <div class="nav-item" onclick="navigateTo('kandidaten')" data-page="kandidaten">
        <span class="nav-icon">👥</span> Introperiode
      </div>`;
  }

  if (isAdmin()) {
    html += `
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Admin</div>
        <div class="nav-item" onclick="navigateTo('admin-board')" data-page="admin-board">
          <span class="nav-icon">🔒</span> Admin Board
        </div>
        <div class="nav-item" onclick="navigateTo('reisco-board')" data-page="reisco-board">
          <span class="nav-icon">📋</span> Admin+Reisco Board
        </div>
        <div class="nav-item" onclick="navigateTo('admin-docs')" data-page="admin-docs">
          <span class="nav-icon">📁</span> Officiële Docs
        </div>
        <div class="nav-item" onclick="navigateTo('budget')" data-page="budget">
          <span class="nav-icon">💰</span> Budget Overzicht
        </div>
        <div class="nav-item" onclick="navigateTo('gebruikersbeheer')" data-page="gebruikersbeheer">
          <span class="nav-icon">⚙️</span> Gebruikersbeheer
        </div>
      </div>`;
  } else if (isReisco()) {
    html += `
      </div>
      <div class="nav-section">
        <div class="nav-section-title">Reisco</div>
        <div class="nav-item" onclick="navigateTo('reisco-board')" data-page="reisco-board">
          <span class="nav-icon">📋</span> Reisco Board
        </div>
      </div>`;
  } else {
    html += `</div>`;
  }

  sidebar.innerHTML = html;
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

function navigateTo(page) {
  currentPage = page;
  setActiveNav(page);
  const content = document.getElementById('main-content');

  const pages = {
    home: renderHome,
    beleggingsboeken: renderBeleggingsboeken,
    pitches: renderPitches,
    planning: renderPlanning,
    leden: renderLeden,
    kandidaten: renderKandidaten,
    'admin-board': renderAdminBoard,
    'reisco-board': renderReiscoBoard,
    'admin-docs': renderAdminDocs,
    budget: renderBudget,
    gebruikersbeheer: renderGebruikersbeheer
  };

  if (pages[page]) {
    content.innerHTML = '';
    pages[page](content);
  }

  // Sluit het mobiele hamburger-menu na navigatie
  closeMobileSidebar();
}

// ─── MOBIEL HAMBURGER-MENU ──────────────────────────────────────────────────

function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('mobile-open');
  if (overlay) {
    overlay.classList.toggle('active', isOpen);
    overlay.style.display = isOpen ? 'block' : 'none';
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
  }
}

// ─── PAGE: HOME ─────────────────────────────────────────────────────────────

function renderHome(el) {
  const naam = currentUserData.displayName || 'lid';
  const uur = new Date().getHours();
  const greeting = uur < 12 ? 'Goedemorgen' : uur < 18 ? 'Goedemiddag' : 'Goedenavond';

  el.innerHTML = `
    <div class="page-header" style="margin-bottom:20px;">
      <div>
        <h2>${greeting}, ${naam}.</h2>
        <p style="color:var(--grijs-donker);font-size:13px;">${new Date().toLocaleDateString('nl-NL', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 3fr;gap:20px;align-items:start;">

      <!-- LINKER KOLOM: Snelkoppelingen (25%) -->
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--grijs-donker);padding:0 4px;margin-bottom:2px;">Snelkoppelingen</div>

        ${(isAdmin() || demoStore.kandidatenZichtbaar) ? `
        <div class="card" onclick="navigateTo('kandidaten')" style="cursor:pointer;padding:16px;display:flex;align-items:center;gap:12px;border-left:4px solid var(--oranje);margin:0;">
          <span style="font-size:22px;">👥</span>
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--groen);">Poti's</div>
            <div style="font-size:11px;color:var(--grijs-donker);">Introperiode</div>
          </div>
        </div>` : ''}

        <div class="card" onclick="navigateTo('planning')" style="cursor:pointer;padding:16px;display:flex;align-items:center;gap:12px;border-left:4px solid #27ae60;margin:0;">
          <span style="font-size:22px;">📅</span>
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--groen);">Planning</div>
            <div style="font-size:11px;color:var(--grijs-donker);">Vergaderplanning</div>
          </div>
        </div>

        <div class="card" onclick="navigateTo('leden')" style="cursor:pointer;padding:16px;display:flex;align-items:center;gap:12px;border-left:4px solid var(--groen-licht);margin:0;">
          <span style="font-size:22px;">🪪</span>
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--groen);">Leden</div>
            <div style="font-size:11px;color:var(--grijs-donker);">Contactgegevens</div>
          </div>
        </div>

        <div class="card" onclick="navigateTo('pitches')" style="cursor:pointer;padding:16px;display:flex;align-items:center;gap:12px;border-left:4px solid var(--oranje);margin:0;">
          <span style="font-size:22px;">📊</span>
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--groen);">Oude Pitches</div>
            <div style="font-size:11px;color:var(--grijs-donker);">Presentaties</div>
          </div>
        </div>

        <div class="card" onclick="navigateTo('beleggingsboeken')" style="cursor:pointer;padding:16px;display:flex;align-items:center;gap:12px;border-left:4px solid var(--groen);margin:0;">
          <span style="font-size:22px;">📚</span>
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--groen);">Beleggingsboeken</div>
            <div style="font-size:11px;color:var(--grijs-donker);">Literatuur</div>
          </div>
        </div>
      </div>

      <!-- RECHTER KOLOM: Planning + Activiteit (75%) -->
      <div style="display:flex;flex-direction:column;gap:16px;">

        <!-- Planning preview -->
        <div class="card" style="margin:0;">
          <div class="card-header" style="cursor:pointer;" onclick="navigateTo('planning')">
            <h3>📅 Aankomende Avonden</h3>
            <span style="font-size:12px;color:var(--groen);font-weight:700;">Bekijk alles →</span>
          </div>
          <div id="home-planning-preview">
            <div class="loading">Even laden...</div>
          </div>
        </div>

      </div>
    </div>

    ${DEMO_MODE ? `<div class="alert alert-info" style="margin-top:16px;">
      <strong>🔧 Demo-modus actief.</strong>
      Gebruikers: <code>admin</code> / <code>admin123</code>, <code>reisco</code> / <code>reisco123</code>, <code>lid</code> / <code>lid123</code>
    </div>` : ''}
  `;

  // Laad planning preview
  laadHomePlanningPreview();
}

function laadHomePlanningPreview() {
  const el = document.getElementById('home-planning-preview');
  if (!el) return;

  const vandaag = new Date().toISOString().split('T')[0];

  if (DEMO_MODE) {
    const komende = demoStore.planning
      .filter(r => r.datum && r.datum >= vandaag)
      .sort((a, b) => a.datum.localeCompare(b.datum))
      .slice(0, 4);

    el.innerHTML = renderPlanningPreviewRows(komende);
    return;
  }

  db.collection('planning').get().then(snap => {
    const rijen = [];
    snap.forEach(doc => rijen.push({ id: doc.id, ...doc.data() }));
    const komende = rijen
      .filter(r => r.datum && r.datum >= vandaag)
      .sort((a, b) => a.datum.localeCompare(b.datum))
      .slice(0, 4);
    const pelEl = document.getElementById('home-planning-preview');
    if (pelEl) pelEl.innerHTML = renderPlanningPreviewRows(komende);
  }).catch(() => {
    if (el) el.innerHTML = '<div class="empty-state" style="padding:16px;"><p>Kon planning niet laden.</p></div>';
  });
}

function renderPlanningPreviewRows(rijen) {
  if (rijen.length === 0) {
    return '<div class="empty-state" style="padding:16px 0;"><p>Geen aankomende avonden gepland.</p></div>';
  }
  return rijen.map(r => `
    <div style="display:flex;align-items:center;gap:16px;padding:10px 0;border-bottom:1px solid var(--grijs);">
      <div style="min-width:90px;font-size:13px;font-weight:600;color:var(--groen);">
        ${new Date(r.datum).toLocaleDateString('nl-NL', { day:'numeric', month:'short' })}
      </div>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:600;">${r.typeAvond || '—'}</div>
        ${r.hosten ? `<div style="font-size:12px;color:var(--grijs-donker);">Host: ${r.hosten}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ─── PAGE: BELEGGINGSBOEKEN ──────────────────────────────────────────────────

function renderBeleggingsboeken(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Beleggingsboeken</h2><p>PDF's, Word-documenten en overige literatuur.</p></div>
      ${isAdmin() ? `<button class="btn btn-primary btn-sm" onclick="openUploadModal('beleggingsboeken')">+ Toevoegen</button>` : ''}
    </div>
    <div style="margin-bottom:16px;">
      <input type="text" id="bb-zoek" placeholder="🔍 Zoek op titel of auteur..." oninput="filterBestanden('bb-list','bb-zoek')"
        style="width:100%;max-width:400px;padding:10px 14px;border:1.5px solid var(--grijs);border-radius:6px;font-family:'Inter',sans-serif;font-size:14px;">
    </div>
    <div id="bb-list"><div class="loading">Even laden...</div></div>
  `;
  laadBestanden('beleggingsboeken', 'bb-list', demoStore.beleggingsboeken, '📚', 'Nog geen boeken toegevoegd.');
}

function renderPitches(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Oude Pitches</h2><p>PowerPoint- en Google Slides-presentaties.</p></div>
      ${isAdmin() ? `<button class="btn btn-primary btn-sm" onclick="openUploadModal('pitches')">+ Toevoegen</button>` : ''}
    </div>
    <div style="margin-bottom:16px;">
      <input type="text" id="pitch-zoek" placeholder="🔍 Zoek op titel of pitcher..." oninput="filterBestanden('pitch-list','pitch-zoek')"
        style="width:100%;max-width:400px;padding:10px 14px;border:1.5px solid var(--grijs);border-radius:6px;font-family:'Inter',sans-serif;font-size:14px;">
    </div>
    <div id="pitch-list"><div class="loading">Even laden...</div></div>
  `;
  laadBestanden('pitches', 'pitch-list', demoStore.pitches, '📊', 'Nog geen pitches toegevoegd.');
}

function filterBestanden(listId, zoekId) {
  const zoek = document.getElementById(zoekId)?.value.toLowerCase().trim() || '';
  const items = document.querySelectorAll('#' + listId + ' .file-item');
  items.forEach(item => {
    const tekst = item.textContent.toLowerCase();
    item.style.display = zoek === '' || tekst.includes(zoek) ? '' : 'none';
  });
}

function laadBestanden(collection, listId, demoData, icon, leegTekst) {
  const listEl = document.getElementById(listId);
  if (!listEl) return;

  if (DEMO_MODE) {
    listEl.innerHTML = demoData.length === 0
      ? `<div class="empty-state"><div class="empty-icon">${icon}</div><p>${leegTekst}</p></div>`
      : demoData.map(f => fileItemHTML(f, collection)).join('');
    return;
  }

  // Live Firebase: geen orderBy zodat er geen Firestore-index nodig is
  db.collection(collection).get()
    .then(snap => {
      const el = document.getElementById(listId);
      if (!el) return;
      if (snap.empty) {
        el.innerHTML = `<div class="empty-state"><div class="empty-icon">${icon}</div><p>${leegTekst}</p></div>`;
        return;
      }
      const items = [];
      snap.forEach(doc => { const data = doc.data(); items.push({ ...data, firestoreId: doc.id }); });
      items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      el.innerHTML = items.map(f => fileItemHTML(f, collection)).join('');
    })
    .catch(e => {
      const el = document.getElementById(listId);
      if (el) el.innerHTML = `<div class="alert alert-error">Fout bij laden: ${e.message}</div>`;
    });
}

function deleteFile(collection, id) {
  showConfirm('Dit document wordt permanent verwijderd.', () => { _deleteFile(collection, id); }); return; }
function _deleteFile(collection, id) {

  const el = document.getElementById('file-' + id);
  console.log('Verwijderen document ID:', id);
  if (el) el.style.opacity = '0.3';

  if (DEMO_MODE) {
    const key = collection === 'admin-docs' ? 'adminDocumenten' : collection;
    demoStore[key] = demoStore[key].filter(f => f.id !== id);
    if (el) el.remove();
    return;
  }

  db.collection(collection).doc(id).delete()
    .then(() => {
      if (el) el.remove();
      const icons = { beleggingsboeken: '📚', pitches: '📊', 'admin-docs': '📁' };
      const leegteksten = {
        beleggingsboeken: 'Nog geen boeken toegevoegd.',
        pitches: 'Nog geen pitches toegevoegd.',
        'admin-docs': 'Nog geen documenten toegevoegd.'
      };
      const listIds = { beleggingsboeken: 'bb-list', pitches: 'pitch-list', 'admin-docs': 'admindoc-list' };
      const listEl = document.getElementById(listIds[collection]);
      if (listEl && listEl.children.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><div class="empty-icon">${icons[collection] || '📎'}</div><p>${leegteksten[collection] || 'Leeg.'}</p></div>`;
      }
    })
    .catch(e => {
      if (el) el.style.opacity = '1';
      alert('\u274c Verwijderen mislukt: ' + e.message);
    });
}
// ─── GOOGLE DRIVE HELPERS ────────────────────────────────────────────────────

function driveUrlNaarEmbed(url) {
  if (!url) return { preview: '#', download: '#', open: '#' };

  // Haal het file-ID op uit alle gangbare Google Drive/Docs/Slides URL-formaten
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,           // Drive bestand
    /\/presentation\/d\/([a-zA-Z0-9_-]+)/,   // Google Slides
    /\/document\/d\/([a-zA-Z0-9_-]+)/,       // Google Docs
    /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,   // Google Sheets
    /\/d\/([a-zA-Z0-9_-]+)/,                 // Generiek /d/ patroon
    /id=([a-zA-Z0-9_-]+)/                    // ?id= parameter
  ];

  for (const pat of patterns) {
    const match = url.match(pat);
    if (match) {
      const id = match[1];

      // Bepaal type op basis van URL
      const isSlides = url.includes('/presentation/');
      const isDocs = url.includes('/document/');
      const isSheets = url.includes('/spreadsheets/');

      let openUrl;
      if (isSlides) {
        openUrl = `https://docs.google.com/presentation/d/${id}/view`;
      } else if (isDocs) {
        openUrl = `https://docs.google.com/document/d/${id}/view`;
      } else if (isSheets) {
        openUrl = `https://docs.google.com/spreadsheets/d/${id}/view`;
      } else {
        openUrl = `https://drive.google.com/file/d/${id}/view`;
      }

      return {
        preview: openUrl,
        download: `https://drive.google.com/uc?export=download&id=${id}`,
        open: openUrl
      };
    }
  }

  // Geen herkend formaat — geef originele URL terug
  return { preview: url, download: url, open: url };
}

function fileItemHTML(f, collection) {
  // Bepaal icoon op basis van type of naam
  const icons = { pdf: '📄', docx: '📝', doc: '📝', pptx: '📊', ppt: '📊', xlsx: '📈', xls: '📈', jpg: '🖼️', png: '🖼️', default: '📎' };
  const ext = (f.name || '').split('.').pop().toLowerCase();
  const icon = icons[ext] || icons.default;

  const adminDelete = isAdmin()
    ? `<button class="btn btn-danger btn-sm" onclick="deleteFile('${collection}','${f.firestoreId || f.id}')">✕</button>`
    : '';

  let openLink = '';
  if (f.url) {
    const links = driveUrlNaarEmbed(f.url);
    openLink = `<a href="${links.open}" target="_blank" style="margin-right:6px;">Openen</a>`;
  } else {
    openLink = '<span style="font-size:12px;color:#aaa;">Geen link</span>';
  }

  const fid = f.firestoreId || f.id;
  const adminEdit = isAdmin()
    ? `<button class="btn btn-outline btn-sm" onclick="openBewerkFileModal('${collection}','${fid}')">✏️ Bewerken</button>`
    : '';

  return `
    <div class="file-item" id="file-${fid}">
      <div class="file-icon">${icon}</div>
      <div class="file-info">
        <strong>${escapeHtml(f.name)}</strong>
        ${f.auteur ? `<span style="display:block;color:var(--groen);font-size:12px;margin-top:2px;">📖 ${escapeHtml(f.auteur)}</span>` : ''}
        ${f.pitcher ? `<span style="display:block;color:var(--oranje);font-size:12px;margin-top:2px;">🎤 ${escapeHtml(f.pitcher)}</span>` : ''}
        ${f.description ? `<span style="display:block;color:#666;font-size:12px;margin-top:2px;">${escapeHtml(f.description)}</span>` : ''}
      </div>
      ${openLink}
      ${adminEdit}
      ${adminDelete}
    </div>`;
}

function openUploadModal(collection) {
  const labels = {
    beleggingsboeken: 'Beleggingsboek / Document',
    pitches: 'Pitch / Presentatie',
    'admin-docs': 'Officieel Document'
  };

  showModal(`
    <h3>📎 ${labels[collection] || 'Document'} toevoegen</h3>
    <div class="alert alert-info" style="margin-bottom:16px;font-size:12px;">
      <strong>Hoe werkt het?</strong><br>
      1. Upload het bestand naar <a href="https://drive.google.com" target="_blank" style="color:var(--groen);font-weight:700;">Google Drive</a><br>
      2. Klik rechts op het bestand → <strong>"Delen"</strong> → <strong>"Iedereen met de link"</strong><br>
      3. Kopieer de link en plak hem hieronder
    </div>
    <div class="form-group">
      <label>Naam / Titel</label>
      <input type="text" id="upload-naam" placeholder="bijv. Beleggingsboek 2024.pdf">
    </div>
    <div class="form-group">
      <label>Google Drive deellink</label>
      <input type="url" id="upload-url" placeholder="https://drive.google.com/file/d/...">
    </div>
    ${collection === 'beleggingsboeken' ? `
    <div class="form-group">
      <label>Auteur(s)</label>
      <input type="text" id="upload-auteur" placeholder="bijv. Benjamin Graham">
    </div>` : ''}
    <div class="form-group">
      <label>Omschrijving (optioneel)</label>
      <input type="text" id="upload-desc" placeholder="Kort omschrijving van het document">
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="doUpload('${collection}')">Toevoegen</button>
    </div>
  `);
}

function doUpload(collection) {
  const naam = document.getElementById('upload-naam')?.value.trim();
  const url = document.getElementById('upload-url')?.value.trim();
  const desc = document.getElementById('upload-desc')?.value.trim();

  if (!naam) { alert('Voer een naam in.'); return; }
  if (!url) { alert('Plak een Google Drive link.'); return; }
  if (!url.includes('drive.google.com') && !url.startsWith('http')) {
    alert('Voer een geldige Google Drive link in (bijv. https://drive.google.com/file/d/...)');
    return;
  }

  const auteurEl = document.getElementById('upload-auteur');
  const auteur = auteurEl ? auteurEl.value.trim() : '';
  const pitcherEl = document.getElementById('upload-pitcher');
  const pitcher = pitcherEl ? pitcherEl.value.trim() : '';

  const entry = {
    name: naam,
    url: url,
    description: desc || '',
    auteur: auteur || '',
    pitcher: pitcher || '',
    uploadedBy: currentUserData.displayName,
    date: new Date().toLocaleDateString('nl-NL'),
    aangemaakt: Date.now()
  };

  if (DEMO_MODE) {
    entry.id = 'file_' + Date.now(); // lokale demo ID
    if (collection === 'beleggingsboeken') demoStore.beleggingsboeken.push(entry);
    else if (collection === 'pitches') demoStore.pitches.push(entry);
    else if (collection === 'admin-docs') demoStore.adminDocumenten.push(entry);
    closeModal();
    navigateTo(collection === 'admin-docs' ? 'admin-docs' : collection);
    return;
  }

  // Sla op in Firestore — alleen tekst, geen bestandsdata, past altijd
  db.collection(collection).add(entry)
    .then(docRef => {
      entry.id = docRef.id; // gebruik Firestore auto-ID
      showToast(collection === 'beleggingsboeken' ? 'Beleggingsboek toegevoegd!' : collection === 'pitches' ? 'Pitch toegevoegd!' : 'Document toegevoegd!');
    closeModal();
      navigateTo(collection === 'admin-docs' ? 'admin-docs' : collection);
    })
    .catch(e => alert('❌ Opslaan mislukt: ' + e.message));
}

function openBewerkFileModal(collection, fid) {
  // Zoek het bestand in demoStore of via Firestore
  const storeKey = collection === 'admin-docs' ? 'adminDocumenten' : collection;
  let f = (demoStore[storeKey] || []).find(x => (x.firestoreId || x.id) === fid);

  const isBeleggingsboek = collection === 'beleggingsboeken';

  const toonModal = (item) => {
    showModal(`
      <h3>✏️ Informatie bewerken</h3>
      <div class="form-group"><label>Titel</label>
        <input type="text" id="bewerk-naam" value="${item ? item.name || '' : ''}" placeholder="Titel">
      </div>
      <div class="form-group"><label>Google Drive link</label>
        <input type="url" id="bewerk-url" value="${item ? item.url || '' : ''}" placeholder="https://drive.google.com/...">
      </div>
      ${isBeleggingsboek ? `
      <div class="form-group"><label>Auteur(s)</label>
        <input type="text" id="bewerk-auteur" value="${item ? item.auteur || '' : ''}" placeholder="bijv. Benjamin Graham">
      </div>` : `
      <div class="form-group"><label>Gepitcht door</label>
        <input type="text" id="bewerk-pitcher" value="${item ? item.pitcher || '' : ''}" placeholder="bijv. Oscar & Ruben">
      </div>`}
      <div class="form-group"><label>Omschrijving (optioneel)</label>
        <input type="text" id="bewerk-desc" value="${item ? item.description || '' : ''}" placeholder="Korte omschrijving">
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
        <button class="btn btn-primary btn-sm" onclick="saveBewerkFile('${collection}','${fid}')">Opslaan</button>
      </div>
    `);
  };

  if (f) {
    toonModal(f);
    return;
  }

  if (!DEMO_MODE) {
    db.collection(collection).doc(fid).get().then(doc => {
      toonModal(doc.exists ? { ...doc.data(), firestoreId: doc.id } : null);
    });
  } else {
    toonModal(null);
  }
}

function saveBewerkFile(collection, fid) {
  const naam = document.getElementById('bewerk-naam').value.trim();
  const url = document.getElementById('bewerk-url').value.trim();
  const desc = document.getElementById('bewerk-desc').value.trim();
  const auteurEl = document.getElementById('bewerk-auteur');
  const auteur = auteurEl ? auteurEl.value.trim() : null;
  const pitcherEl = document.getElementById('bewerk-pitcher');
  const pitcher = pitcherEl ? pitcherEl.value.trim() : null;

  if (!naam) { alert('Voer een titel in.'); return; }

  const updates = { name: naam, url, description: desc };
  if (auteur !== null) updates.auteur = auteur;
  if (pitcher !== null) updates.pitcher = pitcher;

  // Update demoStore
  const storeKey = collection === 'admin-docs' ? 'adminDocumenten' : collection;
  const idx = (demoStore[storeKey] || []).findIndex(x => (x.firestoreId || x.id) === fid);
  if (idx !== -1) Object.assign(demoStore[storeKey][idx], updates);

  if (!DEMO_MODE) {
    db.collection(collection).doc(fid).update(updates)
      .then(() => {
        closeModal();
        navigateTo(collection === 'admin-docs' ? 'admin-docs' : collection);
      })
      .catch(e => alert('Fout: ' + e.message));
    return;
  }

  closeModal();
  navigateTo(collection === 'admin-docs' ? 'admin-docs' : collection);
}

// ─── PAGE: PLANNING ──────────────────────────────────────────────────────────


function renderPlanning(el) {
  const rows = [...demoStore.planning].sort((a, b) => {
    if (!a.datum && !b.datum) return 0;
    if (!a.datum) return 1;
    if (!b.datum) return -1;
    return a.datum.localeCompare(b.datum);
  });
  const open = demoStore.planningOpen;
  const canEditCells = isAdmin() || open;

  const heeftDatums = rows.some(r => r.datum);

  el.innerHTML = `
    <div class="page-header">
      <div><h2>Planning</h2><p>Vergaderplanning &amp; rolbezetting.</p></div>
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        ${heeftDatums ? `<button class="btn btn-outline btn-sm" onclick="downloadAllIcs()">\uD83D\uDCC5 Hele planning \u2192 agenda</button>` : ''}
        ${isAdmin() ? `
          <label class="toggle-switch">
            <input type="checkbox" id="planning-toggle" ${open ? 'checked' : ''} onchange="togglePlanning(this)">
            <div class="toggle-track"></div>
            <span style="font-size:13px;font-weight:700;color:${open ? 'var(--groen)' : 'var(--oranje)'};">
              ${open ? '\u{1F513} Leden kunnen invullen' : '\u{1F512} Invullen vergrendeld'}
            </span>
          </label>
          <button class="btn btn-primary btn-sm" onclick="addPlanningRow()">+ Rij toevoegen</button>` :
          open ? `<div class="alert alert-info" style="margin:0;padding:8px 14px;font-size:12px;">\u270F\uFE0F Je kunt nu Hosten, Helpen en Pitchen invullen.</div>` : ''}
      </div>
    </div>
    <div class="card" style="overflow-x:auto;">
      <table class="planning-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Tijd</th>
            <th>Type Avond</th>
            <th>Hosten</th>
            <th>Helpen</th>
            <th>Pitchen (oud lid)</th>
            <th>Pitchen (nieuw lid)</th>
            ${isAdmin() ? '<th></th>' : ''}
          </tr>
        </thead>
        <tbody id="planning-tbody">
          ${(isAdmin() ? rows : rows.filter(r => r.datum || r.typeAvond || r.hosten || r.helpen || r.pitchenOud || r.pitchenNieuw)).map(row => planningRowHTML(row, canEditCells)).join('')}
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" style="margin-top:16px;font-size:12px;">
      <strong>\uD83D\uDCC5 Naar Google Calendar:</strong> maak eerst eenmalig een aparte agenda aan
      (Google Calendar \u2192 "Andere agenda's" \u2192 + \u2192 "Nieuwe agenda maken", bv. <em>Borsa Valori</em>).
      Klik dan op "Hele planning \u2192 agenda", en importeer het bestand via
      Google Calendar \u2192 tandwiel \u2192 Instellingen \u2192 "Importeren en exporteren" en kies je nieuwe agenda.
    </div>
  `;
}

const TYPE_AVOND_OPTIES = ['beleggingsavond', 'borrelavond', 'Borsa activiteit', 'B&R activiteit', 'Introborrel', 'Intro Activiteit'];

function planningRowHTML(row, canEditCells) {
  const adminOnly = isAdmin();
  const isBeleggingsavond = row.typeAvond === 'beleggingsavond';

  const datumVeld = adminOnly
    ? `<input type="date" value="${row.datum || ''}" onchange="savePlanningCell('${row.id}','datum',this.value)">`
    : `<span style="font-size:13px;">${row.datum ? new Date(row.datum).toLocaleDateString('nl-NL') : '\u2014'}</span>`;

  const tijdVeld = adminOnly
    ? `<input type="time" value="${row.tijd || ''}" onchange="savePlanningCell('${row.id}','tijd',this.value)" style="width:100%;">`
    : `<span style="font-size:13px;">${row.tijd || '\u2014'}</span>`;

  const typeVeld = adminOnly
    ? `<select onchange="savePlanningCell('${row.id}','typeAvond',this.value)"
         style="width:100%;border:1.5px solid var(--grijs);border-radius:3px;padding:5px 8px;font-family:'Inter',sans-serif;font-size:13px;background:#fafaf8;">
         <option value="">\u2014 Kies type \u2014</option>
         ${TYPE_AVOND_OPTIES.map(opt => `<option value="${opt}" ${row.typeAvond === opt ? 'selected' : ''}>${opt}</option>`).join('')}
       </select>`
    : `<span style="font-size:13px;">${row.typeAvond || '\u2014'}</span>`;

  const hostenVeld = canEditCells
    ? `<input type="text" value="${row.hosten || ''}" placeholder="Naam" onchange="savePlanningCell('${row.id}','hosten',this.value)">`
    : `<span style="font-size:13px;">${row.hosten || '\u2014'}</span>`;

  const helpenVeld = canEditCells
    ? `<input type="text" value="${row.helpen || ''}" placeholder="Naam" onchange="savePlanningCell('${row.id}','helpen',this.value)">`
    : `<span style="font-size:13px;">${row.helpen || '\u2014'}</span>`;

  // Pitch-kolommen alleen relevant bij een beleggingsavond
  const geenPitchCel = `<span style="font-size:13px;color:var(--grijs-donker);">n.v.t.</span>`;
  const pitchenOudVeld = !isBeleggingsavond ? geenPitchCel : (canEditCells
    ? `<input type="text" value="${row.pitchenOud || ''}" placeholder="Naam" onchange="savePlanningCell('${row.id}','pitchenOud',this.value)">`
    : `<span style="font-size:13px;">${row.pitchenOud || '\u2014'}</span>`);

  const pitchenNieuwVeld = !isBeleggingsavond ? geenPitchCel : (canEditCells
    ? `<input type="text" value="${row.pitchenNieuw || ''}" placeholder="Naam" onchange="savePlanningCell('${row.id}','pitchenNieuw',this.value)">`
    : `<span style="font-size:13px;">${row.pitchenNieuw || '\u2014'}</span>`);

  const icsKnop = (!adminOnly && row.datum)
    ? `<button class="btn btn-outline btn-sm" onclick="downloadIcs('${row.id}')">📅</button>`
    : '';

  return `<tr id="prow-${row.id}">
    <td>${datumVeld}${icsKnop ? '<br>' + icsKnop : ''}</td>
    <td>${tijdVeld}</td>
    <td>${typeVeld}</td>
    <td>${hostenVeld}</td>
    <td>${helpenVeld}</td>
    <td>${pitchenOudVeld}</td>
    <td>${pitchenNieuwVeld}</td>
    ${adminOnly ? `<td><button class="btn btn-danger btn-sm" onclick="deletePlanningRow('${row.id}')">\u2715</button></td>` : ''}
  </tr>`;
}

function icsEscape(s) {
  return String(s == null ? '' : s)
    .replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}

function planningRijNaarVevent(row) {
  if (!row.datum) return null;
  const d = new Date(row.datum);
  if (isNaN(d)) return null;
  const pad = n => String(n).padStart(2, '0');
  const dateStr = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines = ['BEGIN:VEVENT', 'UID:' + (row.id || dateStr) + '@borsavalori', 'DTSTAMP:' + stamp];

  if (row.tijd && /^\d{1,2}:\d{2}$/.test(row.tijd)) {
    const [hh, mm] = row.tijd.split(':').map(Number);
    const start = dateStr + 'T' + pad(hh) + pad(mm) + '00';
    const e = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh + 2, mm);
    const end = e.getFullYear() + pad(e.getMonth() + 1) + pad(e.getDate()) + 'T' + pad(e.getHours()) + pad(e.getMinutes()) + '00';
    lines.push('DTSTART:' + start, 'DTEND:' + end);
  } else {
    const n = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
    const next = n.getFullYear() + pad(n.getMonth() + 1) + pad(n.getDate());
    lines.push('DTSTART;VALUE=DATE:' + dateStr, 'DTEND;VALUE=DATE:' + next);
  }

  lines.push('SUMMARY:' + icsEscape(row.typeAvond || 'Borsa Valori avond'));
  const desc = [];
  if (row.hosten) desc.push('Host: ' + row.hosten);
  if (row.helpen) desc.push('Helpen: ' + row.helpen);
  if (row.typeAvond === 'beleggingsavond') {
    if (row.pitchenOud) desc.push('Pitch (oud lid): ' + row.pitchenOud);
    if (row.pitchenNieuw) desc.push('Pitch (nieuw lid): ' + row.pitchenNieuw);
  }
  if (row.locatie) { desc.push('Locatie: ' + row.locatie); lines.push('LOCATION:' + icsEscape(row.locatie)); }
  if (desc.length) lines.push('DESCRIPTION:' + icsEscape(desc.join(' | ')));
  lines.push('END:VEVENT');
  return lines.join('\r\n');
}

// Eén enkele avond (knop bij een rij voor niet-admins)
function downloadIcs(rowId) {
  const row = (demoStore.planning || []).find(r => r.id === rowId);
  if (!row) return;
  const vevent = planningRijNaarVevent(row);
  if (!vevent) { showToast('Deze rij heeft nog geen datum.', 'error'); return; }
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Borsa Valori//NL', 'CALSCALE:GREGORIAN', vevent, 'END:VCALENDAR'].join('\r\n');
  _downloadIcsBestand(ics, (row.typeAvond || 'borsa-avond').replace(/[^a-z0-9]/gi, '_') + '.ics');
  showToast('Toegevoegd aan agenda! 📅');
}

// Hele planning in één bestand — voor import in een aparte Google-agenda
function downloadAllIcs() {
  const rows = (demoStore.planning || []).filter(r => r.datum);
  if (rows.length === 0) { showToast('Geen avonden met datum om te exporteren.', 'error'); return; }
  const vevents = rows.map(planningRijNaarVevent).filter(Boolean);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Borsa Valori//Planning//NL',
    'CALSCALE:GREGORIAN',
    'X-WR-CALNAME:Borsa Valori Planning',
    'X-WR-TIMEZONE:Europe/Amsterdam',
    ...vevents,
    'END:VCALENDAR'
  ].join('\r\n');
  _downloadIcsBestand(ics, 'borsa-valori-planning.ics');
  showToast(vevents.length + ' avonden geëxporteerd — importeer in je nieuwe agenda 📅');
}

function _downloadIcsBestand(inhoud, bestandsnaam) {
  const blob = new Blob([inhoud], { type: 'text/calendar' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = bestandsnaam;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function savePlanningCell(id, field, value) {
  const adminOnlyFields = ['datum', 'tijd', 'typeAvond'];
  if (adminOnlyFields.includes(field) && !isAdmin()) {
    alert('Alleen een Admin mag dit veld aanpassen.');
    navigateTo('planning');
    return;
  }
  if (!isAdmin() && !demoStore.planningOpen) {
    alert('De Admin heeft het invullen nog niet opengesteld.');
    navigateTo('planning');
    return;
  }
  const row = demoStore.planning.find(r => r.id === id);
  if (row) row[field] = value;

  const afronden = () => {
    showToast('Planning opgeslagen!');
    if (field === 'datum' || field === 'typeAvond') navigateTo('planning');
  };
  if (!DEMO_MODE) db.collection('planning').doc(id).update({ [field]: value }).then(afronden);
  else afronden();
}
function togglePlanning(checkbox) {
  demoStore.planningOpen = checkbox.checked;
  if (!DEMO_MODE) db.collection('settings').doc('planning').set({ open: checkbox.checked });
  showToast(checkbox.checked ? '🔓 Invullen opengesteld voor leden!' : '🔒 Invullen vergrendeld.', 'info');
  navigateTo('planning');
}

function addPlanningRow() {
  const id = 'plan_' + Date.now();
  const row = { id, datum: '', tijd: '', typeAvond: '', locatie: '', hosten: '', helpen: '', pitchenOud: '', pitchenNieuw: '' };
  demoStore.planning.push(row);
  if (!DEMO_MODE) db.collection('planning').doc(id).set(row);
  showToast('Rij toegevoegd aan planning!');
  const tbody = document.getElementById('planning-tbody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.id = 'prow-' + id;
    tr.innerHTML = planningRowHTML(row, true).replace(/^<tr[^>]*>/, '').replace(/<\/tr>$/, '');
    tbody.appendChild(tr);
  }
}

function deletePlanningRow(id) {
  showConfirm('Deze planningsrij wordt verwijderd.', () => { _deletePlanningRow(id); }); return; }
function _deletePlanningRow(id) {
  demoStore.planning = demoStore.planning.filter(r => r.id !== id);
  document.getElementById('prow-' + id)?.remove();
  if (!DEMO_MODE) db.collection('planning').doc(id).delete();
}

// ─── PAGE: LEDEN ─────────────────────────────────────────────────────────────
// Iedereen ziet dit tabblad. Alleen een Admin mag rijen bewerken en nieuwe
// leden toevoegen. Gewone leden en Reisco-leden hebben alleen-lezen toegang.
// De eigen rij van de ingelogde gebruiker wordt apart bovenaan getoond.

function magLedenRijBewerken(lid) {
  return isAdmin();
}

function mijnLidRij() {
  const leden = demoStore.leden || [];
  const norm = s => (s || '').toString().trim().toLowerCase();
  const username = norm(currentUserData && currentUserData.username);
  const displayName = norm(currentUserData && currentUserData.displayName);
  const email = norm(currentUserData && currentUserData.email);

  // 1) expliciete koppeling op gebruikersnaam
  if (username) {
    const m = leden.find(l => norm(l.koppelUsername) === username);
    if (m) return m;
  }
  // 2) val terug op naam of e-mailadres
  return leden.find(l =>
    (displayName && norm(l.naam) === displayName) ||
    (email && norm(l.email) === email)
  ) || null;
}

function mijnLidCardHTML(lid) {
  const veld = (label, waarde) => `
    <div style="min-width:150px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--grijs-donker);">${label}</div>
      <div style="font-size:14px;margin-top:2px;">${escapeHtml(waarde) || '—'}</div>
    </div>`;
  return `
    <div class="card" style="border-left:4px solid var(--goud);margin-bottom:20px;">
      <div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--grijs-donker);margin-bottom:10px;">Jouw gegevens</div>
      <div style="display:flex;flex-wrap:wrap;gap:18px;">
        ${veld('Naam', lid.naam)}
        ${veld('Geboortedatum', lid.geboortedatum ? new Date(lid.geboortedatum).toLocaleDateString('nl-NL') : '')}
        ${veld('Telefoon', lid.telefoon)}
        ${veld('E-mail', lid.email)}
        ${veld('Adres', lid.adres)}
        ${veld('Hosten', lid.hosten)}
        ${veld('Dieet', lid.dieet)}
      </div>
      <div style="font-size:11px;color:var(--grijs-donker);margin-top:10px;">
        Klopt er iets niet? Vraag een Admin om het aan te passen.
      </div>
    </div>`;
}

// Vult de eigen-gegevens-kaart + de tabel met de overige leden
function vulLedenOverzicht(leden) {
  demoStore.leden = leden;
  const mijnLid = mijnLidRij();
  const kaartEl = document.getElementById('mijn-lid-kaart');
  if (kaartEl) kaartEl.innerHTML = mijnLid ? mijnLidCardHTML(mijnLid) : '';

  const tbody = document.getElementById('leden-tbody');
  if (!tbody) return;
  // Niet-admins zien hun eigen rij niet nog eens in de tabel
  const tabelLeden = isAdmin() ? leden : leden.filter(l => l !== mijnLid);
  tbody.innerHTML = tabelLeden.length === 0
    ? `<tr><td colspan="8" style="text-align:center;padding:20px;color:var(--grijs-donker);">Geen andere leden om te tonen.</td></tr>`
    : tabelLeden.map(lid => ledenRowHTML(lid)).join('');
}

function renderLeden(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Leden</h2><p>Contactgegevens van alle leden van Borsa Valori.</p></div>
      ${isAdmin() ? `<button class="btn btn-primary btn-sm" onclick="openNieuwLidModal()">+ Lid toevoegen</button>` : ''}
    </div>
    <div id="mijn-lid-kaart"></div>
    <div class="card" style="overflow-x:auto;-webkit-overflow-scrolling:touch;">
      <table class="planning-table" style="min-width:900px;">
        <thead>
          <tr>
            <th style="min-width:140px;">Naam</th>
            <th style="min-width:120px;">Geboortedatum</th>
            <th style="min-width:130px;">Telefoon</th>
            <th style="min-width:180px;">E-mail</th>
            <th style="min-width:200px;">Adres</th>
            <th style="min-width:80px;">Hosten</th>
            <th style="min-width:120px;">Dieet</th>
            ${isAdmin() ? '<th style="min-width:50px;"></th>' : ''}
          </tr>
        </thead>
        <tbody id="leden-tbody">
          <tr><td colspan="8" style="text-align:center;padding:20px;color:var(--grijs-donker);">Even laden...</td></tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" style="margin-top:16px;">
      <strong>ℹ️ Rechten:</strong> ${isAdmin()
        ? 'Als Admin kun je alle velden van iedereen bewerken.'
        : 'Deze lijst is alleen-lezen. Neem contact op met een Admin om gegevens te laten wijzigen.'}
    </div>
  `;

  if (DEMO_MODE) {
    vulLedenOverzicht(demoStore.leden);
    return;
  }

  // Live: laad uit Firestore
  db.collection('leden').get().then(snap => {
    const tbody = document.getElementById('leden-tbody');
    if (!tbody) return;

    // Als leden collectie leeg is: schrijf seed data weg naar Firestore (eenmalige migratie)
    if (snap.empty && LEDEN_SEED.length > 0) {
      const batch = db.batch();
      LEDEN_SEED.forEach(l => {
        const ref = db.collection('leden').doc();
        batch.set(ref, { ...l, koppelUsername: '', aangemaakt: Date.now() });
      });
      return batch.commit().then(() => {
        // Herlaad na migratie
        navigateTo('leden');
      });
    }

    const leden = [];
    snap.forEach(doc => {
      leden.push({ ...doc.data(), id: doc.id });
    });
    leden.sort((a, b) => (a.naam || '').localeCompare(b.naam || ''));
    vulLedenOverzicht(leden);
  }).catch(e => {
    const tbody = document.getElementById('leden-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="color:var(--oranje);padding:20px;">Fout bij laden: ${e.message}</td></tr>`;
  });
}

function ledenRowHTML(lid) {
  const magBewerken = magLedenRijBewerken(lid);
  const dis = magBewerken ? '' : 'disabled';

  return `<tr id="lrow-${lid.id}">
    <td><input type="text" value="${escapeHtml(lid.naam || '')}" placeholder="Naam" ${dis} style="min-width:130px;" onchange="saveLedenCell('${lid.id}','naam',this.value)"></td>
    <td><input type="date" value="${escapeHtml(lid.geboortedatum || '')}" ${dis} style="min-width:110px;" onchange="saveLedenCell('${lid.id}','geboortedatum',this.value)"></td>
    <td><input type="text" value="${escapeHtml(lid.telefoon || '')}" placeholder="06..." ${dis} style="min-width:120px;" onchange="saveLedenCell('${lid.id}','telefoon',this.value)"></td>
    <td><input type="email" value="${escapeHtml(lid.email || '')}" placeholder="naam@mail.com" ${dis} style="min-width:170px;" onchange="saveLedenCell('${lid.id}','email',this.value)"></td>
    <td><input type="text" value="${escapeHtml(lid.adres || '')}" placeholder="Straat 1, 1234AB" ${dis} style="min-width:190px;" onchange="saveLedenCell('${lid.id}','adres',this.value)"></td>
    <td>
      <select ${dis} onchange="saveLedenCell('${lid.id}','hosten',this.value)" style="min-width:70px;width:100%;border:1.5px solid var(--grijs);border-radius:3px;padding:5px 8px;font-family:'Inter',sans-serif;font-size:13px;background:${magBewerken ? '#fafaf8' : 'var(--grijs-licht)'};">
        <option value="" ${!lid.hosten ? 'selected' : ''}>—</option>
        <option value="ja" ${lid.hosten === 'ja' ? 'selected' : ''}>ja</option>
        <option value="-" ${lid.hosten === '-' ? 'selected' : ''}>-</option>
      </select>
    </td>
    <td><input type="text" value="${escapeHtml(lid.dieet || '')}" placeholder="-" ${dis} style="min-width:110px;" onchange="saveLedenCell('${lid.id}','dieet',this.value)"></td>
    ${isAdmin() ? `<td><button class="btn btn-danger btn-sm" onclick="deleteLid('${lid.id}')">✕</button></td>` : ''}
  </tr>`;
}

function saveLedenCell(id, field, value) {
  const lid = demoStore.leden.find(l => l.id === id);
  if (!lid) return;

  if (!magLedenRijBewerken(lid)) {
    alert('Je mag alleen je eigen gegevens bewerken.');
    navigateTo('leden');
    return;
  }

  lid[field] = value;
  if (!DEMO_MODE) db.collection('leden').doc(id).update({ [field]: value });
}

function openNieuwLidModal() {
  showModal(`
    <h3>Nieuw Lid Toevoegen</h3>
    <div class="form-group"><label>Naam</label><input type="text" id="nl-naam" placeholder="Volledige naam"></div>
    <div class="form-group"><label>Geboortedatum</label><input type="date" id="nl-geboortedatum"></div>
    <div class="form-group"><label>Telefoon</label><input type="text" id="nl-telefoon" placeholder="06..."></div>
    <div class="form-group"><label>E-mail</label><input type="email" id="nl-email" placeholder="naam@mail.com"></div>
    <div class="form-group"><label>Adres</label><input type="text" id="nl-adres" placeholder="Straat 1, 1234AB"></div>
    <div class="form-group">
      <label>Koppelen aan gebruikersnaam (optioneel)</label>
      <input type="text" id="nl-koppel" placeholder="bijv. daan" autocapitalize="none">
      <p style="font-size:11px;color:var(--grijs-donker);margin-top:4px;">Zo kan dit lid straks zijn eigen rij bewerken. Leeg laten als het lid nog geen account heeft.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveNieuwLid()">Toevoegen</button>
    </div>
  `);
}

function saveNieuwLid() {
  const naam = document.getElementById('nl-naam').value.trim();
  if (!naam) { alert('Voer een naam in.'); return; }

  const lid = {
    id: 'lid_' + Date.now(),
    naam,
    geboortedatum: document.getElementById('nl-geboortedatum').value,
    telefoon: document.getElementById('nl-telefoon').value.trim(),
    email: document.getElementById('nl-email').value.trim(),
    adres: document.getElementById('nl-adres').value.trim(),
    hosten: '',
    dieet: '',
    koppelUsername: document.getElementById('nl-koppel').value.trim().toLowerCase()
  };

  demoStore.leden.push(lid);
  if (!DEMO_MODE) db.collection('leden').doc(lid.id).set(lid);

  showToast('Lid ' + lid.naam + ' toegevoegd!');
  closeModal();
  navigateTo('leden');
}

function deleteLid(id) {
  showConfirm('Dit lid wordt verwijderd uit het overzicht.', () => { _deleteLid(id); }); return; }
function _deleteLid(id) {
  demoStore.leden = demoStore.leden.filter(l => l.id !== id);
  document.getElementById('lrow-' + id)?.remove();
  if (!DEMO_MODE) db.collection('leden').doc(id).delete();
}

// ─── PAGE: POTI'S (INTROPERIODE) ─────────────────────────────────────────

function renderKandidaten(el) {
  if (!isAdmin() && !demoStore.kandidatenZichtbaar) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">🔒</div><p>De introperiode is nog niet opengesteld.</p></div>`;
    return;
  }
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Introperiode — Poti's</h2><p>Potentiële nieuwe leden &amp; stemming.</p></div>
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
        ${isAdmin() ? `
          <label class="toggle-switch">
            <input type="checkbox" ${demoStore.kandidatenZichtbaar ? 'checked' : ''} onchange="toggleKandidaten(this)">
            <div class="toggle-track"></div>
            <span>Zichtbaar voor leden</span>
          </label>
          <label class="toggle-switch" style="margin-left:8px;">
            <input type="checkbox" ${demoStore.stemmenOpen !== false ? 'checked' : ''} onchange="toggleStemmen(this)">
            <div class="toggle-track"></div>
            <span>Stemmen open</span>
          </label>
          <div style="display:flex;align-items:center;gap:6px;font-size:13px;">
            <span style="color:var(--grijs-donker);">Deadline:</span>
            <input type="date" id="stem-deadline" value="${demoStore.stemDeadline || ''}"
              onchange="saveStemDeadline(this.value)"
              style="border:1.5px solid var(--grijs);border-radius:4px;padding:4px 8px;font-family:'Inter',sans-serif;font-size:13px;">
          </div>
          <button class="btn btn-outline btn-sm" onclick="sorteerPotis()">📊 Sorteer op stemmen</button>
          <button class="btn btn-primary btn-sm" onclick="openNieuwKandidaatModal()">+ Poti toevoegen</button>` : `
          ${demoStore.stemDeadline ? `<span style="font-size:12px;color:var(--grijs-donker);">⏰ Deadline: <strong>${new Date(demoStore.stemDeadline).toLocaleDateString('nl-NL')}</strong></span>` : ''}`}
      </div>
    </div>
    <div id="potis-grid"><div class="loading">Even laden...</div></div>
  `;
  laadPotis();
}

function laadPotis() {
  const gridEl = document.getElementById('potis-grid');
  if (!gridEl) return;

  if (DEMO_MODE) {
    const potis = demoStore.kandidaten;
    gridEl.innerHTML = potis.length === 0
      ? `<div class="empty-state"><div class="empty-icon">👥</div><p>Nog geen poti's toegevoegd.</p></div>`
      : `<div class="candidates-grid">${potis.map(k => kandidaatCardHTML(k)).join('')}</div>`;
    return;
  }

  // Laad poti's uit Firestore
  db.collection('kandidaten').get().then(snap => {
    demoStore.kandidaten = [];
    snap.forEach(doc => {
      const k = { ...doc.data(), firestoreId: doc.id };
      // Zorg dat id altijd de Firestore ID is voor delete/update
      k.id = doc.id;
      demoStore.kandidaten.push(k);
    });
    const el = document.getElementById('potis-grid');
    if (!el) return;
    el.innerHTML = demoStore.kandidaten.length === 0
      ? `<div class="empty-state"><div class="empty-icon">👥</div><p>Nog geen poti's toegevoegd.</p></div>`
      : `<div class="candidates-grid">${demoStore.kandidaten.map(k => kandidaatCardHTML(k)).join('')}</div>`;
    // Laad ook comments — één collectionGroup-query i.p.v. één query per kandidaat (N+1)
    const nogTeLaden = demoStore.kandidaten.filter(k => !demoStore.comments[k.id]);
    if (nogTeLaden.length > 0) {
      nogTeLaden.forEach(k => { demoStore.comments[k.id] = []; });
      db.collectionGroup('comments').get().then(csnap => {
        csnap.forEach(cdoc => {
          const kandidaatId = cdoc.ref.parent.parent.id;
          if (demoStore.comments[kandidaatId]) demoStore.comments[kandidaatId].push(cdoc.data());
        });
        nogTeLaden.forEach(k => {
          const commentsEl = document.getElementById('comments-' + k.id);
          if (commentsEl && demoStore.comments[k.id].length > 0) {
            commentsEl.innerHTML = demoStore.comments[k.id].map(c => commentItemHTML(k.id, c)).join('');
          }
          const teller = document.querySelector(`#kcard-${k.id} .comment-section h4`);
          if (teller) teller.textContent = `💬 Reacties (${demoStore.comments[k.id].length})`;
        });
      });
    }
  }).catch(e => {
    const el = document.getElementById('potis-grid');
    if (el) el.innerHTML = `<div class="alert alert-error">Fout: ${e.message}</div>`;
  });
}

const STEM_OPTIES = [
  { key: 'leuk', label: 'Leuk', cls: 'active-leuk' },
  { key: 'niet-leuk', label: 'Niet leuk', cls: 'active-niet-leuk' },
  { key: 'ken-ik-niet', label: 'Ken ik niet', cls: 'active-ken-ik-niet' },
  { key: 'niet-genoeg', label: 'Niet genoeg gesproken', cls: 'active-niet-genoeg' }
];

function magCommentVerwijderen(c) {
  return isAdmin() || c.author === currentUserData.displayName;
}

function commentItemHTML(kandidaatId, c) {
  const magVerwijderen = magCommentVerwijderen(c);
  return `
    <div class="comment-item" id="comment-${c.id}">
      <div class="comment-author">
        ${escapeHtml(c.author)} <span class="comment-role-badge">${escapeHtml(c.rol)}</span>
        ${magVerwijderen ? `<button class="btn btn-danger btn-sm" style="float:right;padding:1px 7px;font-size:11px;" onclick="deleteComment('${kandidaatId}','${c.id}')">✕</button>` : ''}
      </div>
      <div>${escapeHtml(c.tekst)}</div>
    </div>`;
}

function deleteComment(kandidaatId, commentId) {
  showConfirm('Deze reactie wordt verwijderd.', () => {
    const lijst = demoStore.comments[kandidaatId] || [];
    const c = lijst.find(x => x.id === commentId);
    if (!c || !magCommentVerwijderen(c)) return;
    demoStore.comments[kandidaatId] = lijst.filter(x => x.id !== commentId);
    document.getElementById('comment-' + commentId)?.remove();
    const teller = document.querySelector(`#kcard-${kandidaatId} .comment-section h4`);
    if (teller) teller.textContent = `💬 Reacties (${demoStore.comments[kandidaatId].length})`;

    if (!DEMO_MODE) {
      db.collection('kandidaten').doc(kandidaatId).collection('comments')
        .where('id', '==', commentId).get()
        .then(snap => Promise.all(snap.docs.map(d => d.ref.delete())))
        .catch(e => alert('❌ Verwijderen mislukt: ' + e.message));
    }
  });
}

function kandidaatCardHTML(k) {
  const comments = (demoStore.comments[k.id] || []);
  const commentsHTML = comments.map(c => commentItemHTML(k.id, c)).join('')
    || '<div style="font-size:12px;color:#aaa;padding:4px 0;">Nog geen reacties.</div>';

  const geslacht = k.geslacht === 'M' ? '♂' : k.geslacht === 'V' ? '♀' : '⚧';

  if (!k.stemmen) k.stemmen = {};
  const mijnUid = (currentUser && currentUser.uid) || currentUserData.uid || currentUserData.username;
  const mijnStem = k.stemmen[mijnUid];

  const stemKnoppenHTML = STEM_OPTIES.map(opt => `
    <button class="stem-btn ${mijnStem === opt.key ? opt.cls : ''}" onclick="setStem('${k.id}','${opt.key}')">${opt.label}</button>
  `).join('');

  // Tel stemmen per optie
  const stemTellingen = {};
  STEM_OPTIES.forEach(o => stemTellingen[o.key] = 0);
  Object.values(k.stemmen).forEach(s => { if (stemTellingen[s] !== undefined) stemTellingen[s]++; });

  // Stemverdeling in % - alleen zichtbaar voor admins
  const totaalStemmen = Object.keys(k.stemmen).length;
  const stemSummaryHTML = isAdmin() ? STEM_OPTIES.map(o => {
    const pct = totaalStemmen > 0 ? Math.round((stemTellingen[o.key] / totaalStemmen) * 100) : 0;
    return `<span title="${stemTellingen[o.key]} stem(men)">${o.label}: <strong>${pct}%</strong></span>`;
  }).join('') + `<span style="color:var(--grijs-donker);margin-left:4px;">(${totaalStemmen} stem${totaalStemmen !== 1 ? 'men' : ''})</span>` : '';

  const introDatums = Array.isArray(k.introDatums) ? k.introDatums.filter(Boolean) : [];
  const introDatumsHTML = introDatums.length ? `
    <div class="candidate-meta" style="margin-top:6px;">Aanwezig bij intro:
      <span>${introDatums.slice().sort().map(d => new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })).join(', ')}</span>
    </div>` : '';

  const notitieHTML = k.notitie ? `
    <div style="margin-top:10px;padding:8px 10px;background:var(--grijs-licht);border-left:3px solid var(--goud);border-radius:3px;font-size:12px;color:var(--zwart);white-space:pre-wrap;">${escapeHtml(k.notitie)}</div>` : '';

  // Meningen (reacties) zijn alleen zichtbaar voor de Admin
  const meningenSectie = isAdmin() ? `
      <div class="comment-section">
        <h4>💬 Reacties (${comments.length})</h4>
        <div id="comments-${k.id}">${commentsHTML}</div>
        <div class="comment-input-row">
          <input type="text" id="comment-input-${k.id}" placeholder="Jouw mening...">
          <button class="btn btn-goud btn-sm" onclick="addComment('${k.id}')">Sturen</button>
        </div>
      </div>` : `
      <div class="comment-section">
        <h4>💬 Jouw mening</h4>
        <div style="font-size:11px;color:var(--grijs-donker);padding:2px 0 6px;">Alleen de Admin ziet wat je hier invult.</div>
        <div class="comment-input-row">
          <input type="text" id="comment-input-${k.id}" placeholder="Jouw mening...">
          <button class="btn btn-goud btn-sm" onclick="addComment('${k.id}')">Sturen</button>
        </div>
      </div>`;

  return `
    <div class="candidate-card" id="kcard-${k.id}">
      <div class="candidate-photo">
        ${k.fotoUrl
          ? `<img src="${k.fotoUrl}" alt="${k.naam}">`
          : '👤'}
      </div>
      <div class="candidate-body">
        <div class="candidate-name">${k.naam} ${geslacht}</div>
        <div class="candidate-meta">Leeftijd: <span>${k.leeftijd}</span></div>
        <div class="candidate-meta">Studie: <span>${k.studie}</span></div>
        ${introDatumsHTML}
        ${notitieHTML}
        ${isAdmin() ? `
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" onclick="openBewerkKandidaatModal('${k.id}')">✏️ Bewerken</button>
            <button class="btn btn-danger btn-sm" onclick="deleteKandidaat('${k.id}')">Verwijderen</button>
          </div>` : ''}
        <div class="stem-bar" id="stembar-${k.id}">${stemKnoppenHTML}</div>
        ${isAdmin() ? `<div class="stem-summary" id="stemsummary-${k.id}">${stemSummaryHTML}</div>` : ''}
      </div>
      ${meningenSectie}
    </div>`;
}

// Planningdatums van intro-activiteiten (voor de multi-select bij een poti)
function introActiviteitDatums() {
  const intro = ['Intro Activiteit', 'Introborrel'];
  return (demoStore.planning || [])
    .filter(r => r.datum && intro.includes(r.typeAvond))
    .map(r => r.datum)
    .filter((d, i, arr) => arr.indexOf(d) === i)
    .sort();
}

function magNogStemmen() {
  if (demoStore.stemmenOpen === false) return false;
  if (demoStore.stemDeadline) {
    const deadline = new Date(demoStore.stemDeadline);
    deadline.setHours(23, 59, 59);
    if (new Date() > deadline) return false;
  }
  return true;
}

function setStem(kandidaatId, stemKey) {
  if (!magNogStemmen()) {
    showToast('Stemmen is gesloten of de deadline is verstreken.', 'error');
    return;
  }
  const k = demoStore.kandidaten.find(x => x.id === kandidaatId);
  if (!k) return;
  if (!k.stemmen) k.stemmen = {};
  const mijnUid = (currentUser && currentUser.uid) || currentUserData.uid || currentUserData.username;

  // Toggle: als je al deze stem had, verwijder hem; anders zet hem
  if (k.stemmen[mijnUid] === stemKey) {
    delete k.stemmen[mijnUid];
  } else {
    k.stemmen[mijnUid] = stemKey;
  }

  if (!DEMO_MODE) {
    db.collection('kandidaten').doc(kandidaatId).update({ stemmen: k.stemmen });
  }

  // Herrender alleen deze kaart's stem-bar en summary
  const bar = document.getElementById('stembar-' + kandidaatId);
  const summary = document.getElementById('stemsummary-' + kandidaatId);
  const mijnStem = k.stemmen[mijnUid];

  if (bar) {
    bar.innerHTML = STEM_OPTIES.map(opt => `
      <button class="stem-btn ${mijnStem === opt.key ? opt.cls : ''}" onclick="setStem('${kandidaatId}','${opt.key}')">${opt.label}</button>
    `).join('');
  }

  if (summary) {
    const stemTellingen = {};
    STEM_OPTIES.forEach(o => stemTellingen[o.key] = 0);
    Object.values(k.stemmen).forEach(s => { if (stemTellingen[s] !== undefined) stemTellingen[s]++; });
    summary.innerHTML = STEM_OPTIES.map(o => `<span>${o.label}: ${stemTellingen[o.key]}</span>`).join('');
  }
}


function toggleStemmen(checkbox) {
  demoStore.stemmenOpen = checkbox.checked;
  if (!DEMO_MODE) db.collection('settings').doc('stemmen').set({ open: checkbox.checked, deadline: demoStore.stemDeadline || null });
  showToast(checkbox.checked ? '✅ Stemmen opengesteld!' : '🔒 Stemmen vergrendeld.', 'info');
}

function saveStemDeadline(datum) {
  demoStore.stemDeadline = datum;
  if (!DEMO_MODE) db.collection('settings').doc('stemmen').update({ deadline: datum });
  showToast('Deadline opgeslagen: ' + new Date(datum).toLocaleDateString('nl-NL'));
}

function sorteerPotis() {
  demoStore.kandidaten.sort((a, b) => {
    const totaalA = Object.keys(a.stemmen || {}).length;
    const totaalB = Object.keys(b.stemmen || {}).length;
    const leukA = Object.values(a.stemmen || {}).filter(s => s === 'leuk').length;
    const leukB = Object.values(b.stemmen || {}).filter(s => s === 'leuk').length;
    // Sorteer op % leuk, dan op totaal stemmen
    const pctA = totaalA > 0 ? leukA / totaalA : 0;
    const pctB = totaalB > 0 ? leukB / totaalB : 0;
    return pctB - pctA;
  });
  navigateTo('kandidaten');
}

function toggleKandidaten(checkbox) {
  demoStore.kandidatenZichtbaar = checkbox.checked;
  if (!DEMO_MODE) db.collection('settings').doc('kandidaten').set({ zichtbaar: checkbox.checked });
  renderSidebar();
}

function openBewerkKandidaatModal(id) {
  const k = demoStore.kandidaten.find(x => x.id === id);
  if (!k) return;

  showModal(`
    <h3>✏️ Poti bewerken</h3>
    <div class="form-group"><label>Naam</label>
      <input type="text" id="bk-naam" value="${k.naam || ''}" placeholder="Volledige naam">
    </div>
    <div class="form-group"><label>Leeftijd</label>
      <input type="number" id="bk-leeftijd" value="${k.leeftijd || ''}" min="16" max="40">
    </div>
    <div class="form-group"><label>Studie</label>
      <input type="text" id="bk-studie" value="${k.studie || ''}" placeholder="Bedrijfskunde, TU Delft">
    </div>
    <div class="form-group">
      <label>Geslacht</label>
      <select id="bk-geslacht">
        <option value="M" ${k.geslacht === 'M' ? 'selected' : ''}>Man</option>
        <option value="V" ${k.geslacht === 'V' ? 'selected' : ''}>Vrouw</option>
        <option value="X" ${k.geslacht === 'X' ? 'selected' : ''}>Anders / Onbekend</option>
      </select>
    </div>
    <div class="form-group">
      <label>Nieuwe foto (optioneel, laat leeg om huidige te behouden)</label>
      <input type="file" id="bk-foto" accept="image/*">
    </div>
    <div class="form-group">
      <label>Notitie (zichtbaar voor alle leden)</label>
      <textarea id="k-notitie" rows="2" placeholder="Bv. reageert enthousiast, kent al een paar leden...">${escapeHtml(k.notitie || '')}</textarea>
    </div>
    <div class="form-group">
      <label>Aanwezig bij intro-activiteiten</label>
      ${introDatumSelectHTML(k.introDatums)}
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveBewerkKandidaat('${id}')">Opslaan</button>
    </div>
  `);
}

function introDatumSelectHTML(selected) {
  const sel = Array.isArray(selected) ? selected : [];
  const datums = introActiviteitDatums();
  if (datums.length === 0) {
    return `<p style="font-size:12px;color:var(--grijs-donker);">Nog geen intro-activiteiten in de planning (type "Intro Activiteit" of "Introborrel").</p>`;
  }
  return `<select id="k-introdatums" multiple size="${Math.min(6, datums.length)}" style="width:100%;border:1.5px solid var(--grijs);border-radius:3px;padding:6px 8px;font-family:'Inter',sans-serif;font-size:13px;">
    ${datums.map(d => `<option value="${d}" ${sel.includes(d) ? 'selected' : ''}>${new Date(d).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' })}</option>`).join('')}
  </select>
  <p style="font-size:11px;color:var(--grijs-donker);margin-top:4px;">Houd Ctrl (Windows) of Cmd (Mac) ingedrukt om meerdere te kiezen.</p>`;
}

function leesIntroDatums() {
  const sel = document.getElementById('k-introdatums');
  if (!sel) return null;
  return Array.from(sel.selectedOptions).map(o => o.value);
}

function leesNotitie() {
  const el = document.getElementById('k-notitie');
  return el ? el.value.trim() : null;
}

function saveBewerkKandidaat(id) {
  const k = demoStore.kandidaten.find(x => x.id === id);
  if (!k) return;

  k.naam = document.getElementById('bk-naam').value.trim() || k.naam;
  k.leeftijd = document.getElementById('bk-leeftijd').value || k.leeftijd;
  k.studie = document.getElementById('bk-studie').value.trim() || k.studie;
  k.geslacht = document.getElementById('bk-geslacht').value;
  const notitie = leesNotitie();
  if (notitie !== null) k.notitie = notitie;
  const introDatums = leesIntroDatums();
  if (introDatums !== null) k.introDatums = introDatums;

  const fotoFile = document.getElementById('bk-foto').files[0];

  const slaOp = () => {
    if (!DEMO_MODE) {
      db.collection('kandidaten').doc(id).update({
        naam: k.naam, leeftijd: k.leeftijd,
        studie: k.studie, geslacht: k.geslacht,
        notitie: k.notitie || '', introDatums: k.introDatums || [],
        ...(k.fotoUrl ? { fotoUrl: k.fotoUrl } : {})
      }).catch(e => showToast('Fout: ' + e.message, 'error'));
    }
    showToast('Poti bijgewerkt!');
    closeModal();
    navigateTo('kandidaten');
  };

  if (fotoFile) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 400 / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        k.fotoUrl = canvas.toDataURL('image/jpeg', 0.7);
        slaOp();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(fotoFile);
  } else {
    slaOp();
  }
}

function openNieuwKandidaatModal() {
  showModal(`
    <h3>Nieuwe Poti</h3>
    <div class="form-group"><label>Naam</label><input type="text" id="k-naam" placeholder="Volledige naam"></div>
    <div class="form-group"><label>Leeftijd</label><input type="number" id="k-leeftijd" min="16" max="40" placeholder="22"></div>
    <div class="form-group"><label>Studie</label><input type="text" id="k-studie" placeholder="Bedrijfskunde, TU Delft"></div>
    <div class="form-group">
      <label>Geslacht</label>
      <select id="k-geslacht">
        <option value="M">Man</option>
        <option value="V">Vrouw</option>
        <option value="X">Anders / Onbekend</option>
      </select>
    </div>
    <div class="form-group"><label>Foto (optioneel)</label><input type="file" id="k-foto" accept="image/*"></div>
    <div class="form-group">
      <label>Notitie (zichtbaar voor alle leden)</label>
      <textarea id="k-notitie" rows="2" placeholder="Bv. reageert enthousiast, kent al een paar leden..."></textarea>
    </div>
    <div class="form-group">
      <label>Aanwezig bij intro-activiteiten</label>
      ${introDatumSelectHTML([])}
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveKandidaat()">Opslaan</button>
    </div>
  `);
}

function saveKandidaat() {
  const naam = document.getElementById('k-naam').value.trim();
  const leeftijd = document.getElementById('k-leeftijd').value;
  const studie = document.getElementById('k-studie').value.trim();
  const geslacht = document.getElementById('k-geslacht').value;
  const fotoFile = document.getElementById('k-foto').files[0];

  if (!naam) { alert('Voer een naam in.'); return; }

  const kandidaat = {
    naam, leeftijd, studie, geslacht,
    notitie: leesNotitie() || '',
    introDatums: leesIntroDatums() || [],
    fotoUrl: null,
    stemmen: {},
    aangemaakt: Date.now()
  };

  if (fotoFile) {
    // Comprimeer foto naar base64
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const maxW = 400;
        const scale = Math.min(1, maxW / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        kandidaat.fotoUrl = canvas.toDataURL('image/jpeg', 0.7);
        slaKandidaatOp(kandidaat);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(fotoFile);
  } else {
    slaKandidaatOp(kandidaat);
  }
}

function slaKandidaatOp(kandidaat) {
  if (DEMO_MODE) {
    kandidaat.id = 'k_' + Date.now();
    demoStore.kandidaten.push(kandidaat);
    demoStore.comments[kandidaat.id] = [];
    showToast('Poti toegevoegd!');
    closeModal();
    navigateTo('kandidaten');
    return;
  }

  // Laat Firestore de ID aanmaken (zoals bij bestanden)
  db.collection('kandidaten').add(kandidaat)
    .then(docRef => {
      kandidaat.id = docRef.id;
      kandidaat.firestoreId = docRef.id;
      demoStore.kandidaten.push(kandidaat);
      demoStore.comments[kandidaat.id] = [];
      showToast('Poti toegevoegd!');
      closeModal();
      navigateTo('kandidaten');
    })
    .catch(e => alert('Fout bij opslaan: ' + e.message));
}

function deleteKandidaat(id) {
  showConfirm('Deze poti en alle stemmen worden verwijderd.', () => { _deleteKandidaat(id); }); return; }
function _deleteKandidaat(id) {
  demoStore.kandidaten = demoStore.kandidaten.filter(k => k.id !== id);
  delete demoStore.comments[id];
  document.getElementById('kcard-' + id)?.remove();
  if (!DEMO_MODE) db.collection('kandidaten').doc(id).delete();
}

function addComment(kandidaatId) {
  const input = document.getElementById('comment-input-' + kandidaatId);
  const tekst = input.value.trim();
  if (!tekst) return;

  const comment = {
    id: 'c_' + Date.now(),
    author: currentUserData.displayName,
    rol: currentUserData.rol,
    tekst,
    datum: new Date().toLocaleDateString('nl-NL')
  };

  if (!demoStore.comments[kandidaatId]) demoStore.comments[kandidaatId] = [];
  demoStore.comments[kandidaatId].push(comment);

  if (!DEMO_MODE) {
    db.collection('kandidaten').doc(kandidaatId).collection('comments').add(comment);
  }

  input.value = '';

  // Niet-admins zien de reacties niet; toon alleen een bevestiging
  if (!isAdmin()) {
    showToast('Je mening is doorgegeven aan de Admin.');
    return;
  }

  const commentsEl = document.getElementById('comments-' + kandidaatId);
  if (commentsEl) {
    const placeholder = commentsEl.querySelector(':scope > div:not(.comment-item)');
    if (placeholder) placeholder.remove();
    const div = document.createElement('div');
    div.innerHTML = commentItemHTML(kandidaatId, comment);
    commentsEl.appendChild(div.firstElementChild);
  }
  const teller = document.querySelector(`#kcard-${kandidaatId} .comment-section h4`);
  if (teller) teller.textContent = `💬 Reacties (${demoStore.comments[kandidaatId].length})`;
}

// ─── PAGE: KANBAN BOARDS ────────────────────────────────────────────────────

function renderKanbanPage(el, boardKey, title, desc) {
  if (!demoStore[boardKey]) demoStore[boardKey] = {};

  const mappen = Object.keys(demoStore[boardKey]);

  el.innerHTML = `
    <div class="page-header">
      <div><h2>${title}</h2><p>${desc}</p></div>
      <button class="btn btn-primary btn-sm" onclick="openNieuweMapModal('${boardKey}')">+ Map aanmaken</button>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:24px;">
      ${mappen.length === 0
        ? `<div class="empty-state" style="width:100%"><div class="empty-icon">📁</div><p>Nog geen mappen.</p></div>`
        : mappen.map(m => `
          <div class="folder-item" onclick="openMap('${boardKey}','${encodeURIComponent(m)}')" style="min-width:180px;flex:0 0 auto;">
            <span class="folder-icon">📁</span>
            <span class="folder-name">${m}</span>
            <span style="font-size:11px;color:var(--grijs-donker);">${(demoStore[boardKey][m] || []).length} project(en)</span>
          </div>`).join('')}
    </div>
  `;
}

function renderAdminBoard(el) { renderKanbanPage(el, 'adminProjects', 'Admin Board', 'Privé planning &amp; projecten voor Admin.'); }
function renderReiscoBoard(el) { renderKanbanPage(el, 'reiscoProjects', 'Admin + Reisco Board', 'Gedeelde projecten voor Admin en Reisco.'); }

function openNieuweMapModal(boardKey) {
  showModal(`
    <h3>Nieuwe Map</h3>
    <div class="form-group"><label>Mapnaam</label><input type="text" id="map-naam" placeholder="Bijv. 2025/2026"></div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveMap('${boardKey}')">Aanmaken</button>
    </div>
  `);
}

function saveMap(boardKey) {
  const naam = document.getElementById('map-naam').value.trim();
  if (!naam) return;
  if (!demoStore[boardKey]) demoStore[boardKey] = {};
  demoStore[boardKey][naam] = demoStore[boardKey][naam] || [];
  closeModal();
  showToast('Map aangemaakt!');
  if (boardKey === 'adminProjects') navigateTo('admin-board');
  else navigateTo('reisco-board');
}

function openMap(boardKey, mapNaam) {
  const naam = decodeURIComponent(mapNaam);
  if (!demoStore[boardKey][naam]) demoStore[boardKey][naam] = [];
  const projects = demoStore[boardKey][naam];

  const content = document.getElementById('main-content');
  const COLS = ['Te doen', 'Bezig', 'Review', 'Klaar'];

  const colsHTML = COLS.map(col => {
    const cards = projects.filter(p => p.status === col);
    return `
      <div class="kanban-col" id="kcol-${col.replace(/\s/g,'_')}" ondragover="event.preventDefault()" ondrop="dropCard(event,'${boardKey}','${naam}','${col}')">
        <div class="kanban-col-header">
          <h4>${col}</h4>
          <button class="btn btn-outline btn-sm" onclick="openNieuwProjectModal('${boardKey}','${naam}','${col}')">+</button>
        </div>
        ${cards.map(p => kanbanCardHTML(p, boardKey, naam)).join('')}
      </div>`;
  }).join('');

  content.innerHTML = `
    <div class="page-header" style="margin-bottom:16px;">
      <div>
        <div class="breadcrumb">
          <span onclick="navigateTo('${boardKey === 'adminProjects' ? 'admin-board' : 'reisco-board'}')">← Mappen</span>
          <span>›</span>
          <strong>${naam}</strong>
        </div>
        <h2>${naam}</h2>
      </div>
    </div>
    <div class="kanban-board">${colsHTML}</div>
  `;
}

function kanbanCardHTML(p, boardKey, mapNaam) {
  return `
    <div class="kanban-card" draggable="true" id="kcard-proj-${p.id}"
      ondragstart="dragCard(event,'${p.id}','${boardKey}','${encodeURIComponent(mapNaam)}')"
      onclick="openProjectDetail('${p.id}','${boardKey}','${encodeURIComponent(mapNaam)}')">
      <div class="card-title">${p.titel}</div>
      ${p.beschrijving ? `<div class="card-desc">${p.beschrijving}</div>` : ''}
      ${p.deadline ? `<div class="card-meta">⏰ ${p.deadline}</div>` : ''}
      ${p.verantwoordelijke ? `<div class="card-meta">👤 ${p.verantwoordelijke}</div>` : ''}
    </div>`;
}

let draggedCard = null;
function dragCard(e, id, boardKey, mapNaam) {
  draggedCard = { id, boardKey, mapNaam: decodeURIComponent(mapNaam) };
  document.getElementById('kcard-proj-' + id)?.classList.add('dragging');
}

function dropCard(e, boardKey, mapNaam, newStatus) {
  if (!draggedCard) return;
  const project = demoStore[boardKey][mapNaam]?.find(p => p.id === draggedCard.id);
  if (project) {
    project.status = newStatus;
    if (!DEMO_MODE) db.collection(boardKey + '_' + mapNaam).doc(project.id).update({ status: newStatus });
    openMap(boardKey, encodeURIComponent(mapNaam));
  }
  draggedCard = null;
}

function openNieuwProjectModal(boardKey, mapNaam, status) {
  showModal(`
    <h3>Nieuw Project / Kaart</h3>
    <div class="form-group"><label>Titel</label><input type="text" id="proj-titel" placeholder="Projectnaam"></div>
    <div class="form-group"><label>Beschrijving</label><textarea id="proj-desc" rows="3" placeholder="Omschrijving..."></textarea></div>
    <div class="form-group"><label>Verantwoordelijke</label><input type="text" id="proj-verant" placeholder="Naam"></div>
    <div class="form-group"><label>Deadline</label><input type="date" id="proj-deadline"></div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveProject('${boardKey}','${encodeURIComponent(mapNaam)}','${status}')">Aanmaken</button>
    </div>
  `);
}

function saveProject(boardKey, mapNaam, status) {
  const naam = decodeURIComponent(mapNaam);
  const project = {
    id: 'proj_' + Date.now(),
    titel: document.getElementById('proj-titel').value.trim(),
    beschrijving: document.getElementById('proj-desc').value.trim(),
    verantwoordelijke: document.getElementById('proj-verant').value.trim(),
    deadline: document.getElementById('proj-deadline').value,
    status,
    subtaken: [],
    opmerkingen: []
  };

  if (!project.titel) { alert('Voer een titel in.'); return; }
  if (!demoStore[boardKey][naam]) demoStore[boardKey][naam] = [];
  demoStore[boardKey][naam].push(project);
  if (!DEMO_MODE) db.collection(boardKey + '_' + naam).doc(project.id).set(project);
  closeModal();
  openMap(boardKey, mapNaam);
}

function openProjectDetail(id, boardKey, mapNaam) {
  const naam = decodeURIComponent(mapNaam);
  const project = demoStore[boardKey][naam]?.find(p => p.id === id);
  if (!project) return;

  const subtakenHTML = (project.subtaken || []).map((s, i) => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <input type="checkbox" ${s.klaar ? 'checked' : ''} onchange="toggleSubtaak('${id}','${boardKey}','${encodeURIComponent(naam)}',${i},this.checked)">
      <span style="${s.klaar ? 'text-decoration:line-through;color:#aaa;' : ''}">${escapeHtml(s.tekst)}</span>
    </div>`).join('');

  const opmerkingenHTML = (project.opmerkingen || []).map(o => `
    <div style="padding:8px 10px;background:var(--grijs-licht);border-radius:3px;margin-bottom:6px;font-size:13px;">
      <strong style="color:var(--groen);">${escapeHtml(o.author)}</strong> · ${escapeHtml(o.datum)}<br>${escapeHtml(o.tekst)}
    </div>`).join('');

  showModal(`
    <h3>${escapeHtml(project.titel)}</h3>
    <p style="color:var(--grijs-donker);font-size:13px;margin-bottom:16px;">${escapeHtml(project.beschrijving) || 'Geen beschrijving.'}</p>
    <div style="display:flex;gap:16px;font-size:13px;margin-bottom:16px;">
      ${project.deadline ? `<span>⏰ <strong>${escapeHtml(project.deadline)}</strong></span>` : ''}
      ${project.verantwoordelijke ? `<span>👤 <strong>${escapeHtml(project.verantwoordelijke)}</strong></span>` : ''}
      <span>📌 <strong>${escapeHtml(project.status)}</strong></span>
    </div>
    <h4 style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--groen);">Subtaken</h4>
    <div id="subtaken-list" style="margin-bottom:12px;">${subtakenHTML}</div>
    <div style="display:flex;gap:8px;margin-bottom:20px;">
      <input type="text" id="nieuwe-subtaak" placeholder="Subtaak toevoegen..." style="flex:1;padding:7px 10px;border:1.5px solid var(--grijs);border-radius:3px;font-family:'Inter',sans-serif;font-size:13px;">
      <button class="btn btn-outline btn-sm" onclick="addSubtaak('${id}','${boardKey}','${encodeURIComponent(naam)}')">+</button>
    </div>
    <h4 style="font-size:13px;font-weight:700;margin-bottom:8px;color:var(--groen);">Opmerkingen</h4>
    <div style="margin-bottom:12px;">${opmerkingenHTML}</div>
    <div style="display:flex;gap:8px;margin-bottom:16px;">
      <input type="text" id="nieuwe-opmerking" placeholder="Opmerking toevoegen..." style="flex:1;padding:7px 10px;border:1.5px solid var(--grijs);border-radius:3px;font-family:'Inter',sans-serif;font-size:13px;">
      <button class="btn btn-outline btn-sm" onclick="addOpmerking('${id}','${boardKey}','${encodeURIComponent(naam)}')">+</button>
    </div>
    <div class="modal-footer">
      <button class="btn btn-danger btn-sm" onclick="deleteProject('${id}','${boardKey}','${encodeURIComponent(naam)}')">Verwijderen</button>
      <button class="btn btn-primary btn-sm" onclick="closeModal()">Sluiten</button>
    </div>
  `);
}

function persistProject(boardKey, naam, project) {
  if (DEMO_MODE) return;
  db.collection(boardKey + '_' + naam).doc(project.id).update({
    subtaken: project.subtaken || [],
    opmerkingen: project.opmerkingen || []
  }).catch(e => alert('❌ Opslaan mislukt: ' + e.message));
}

function addSubtaak(projId, boardKey, mapNaam) {
  const naam = decodeURIComponent(mapNaam);
  const tekst = document.getElementById('nieuwe-subtaak').value.trim();
  if (!tekst) return;
  const project = demoStore[boardKey][naam]?.find(p => p.id === projId);
  if (project) {
    if (!project.subtaken) project.subtaken = [];
    project.subtaken.push({ tekst, klaar: false });
    document.getElementById('nieuwe-subtaak').value = '';
    const list = document.getElementById('subtaken-list');
    if (list) {
      const div = document.createElement('div');
      div.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px;';
      div.innerHTML = `<input type="checkbox"><span>${escapeHtml(tekst)}</span>`;
      list.appendChild(div);
    }
    persistProject(boardKey, naam, project);
  }
}

function toggleSubtaak(projId, boardKey, mapNaam, idx, klaar) {
  const naam = decodeURIComponent(mapNaam);
  const project = demoStore[boardKey][naam]?.find(p => p.id === projId);
  if (project && project.subtaken[idx]) {
    project.subtaken[idx].klaar = klaar;
    persistProject(boardKey, naam, project);
  }
}

function addOpmerking(projId, boardKey, mapNaam) {
  const naam = decodeURIComponent(mapNaam);
  const tekst = document.getElementById('nieuwe-opmerking').value.trim();
  if (!tekst) return;
  const project = demoStore[boardKey][naam]?.find(p => p.id === projId);
  if (project) {
    if (!project.opmerkingen) project.opmerkingen = [];
    const o = { author: currentUserData.displayName, tekst, datum: new Date().toLocaleDateString('nl-NL') };
    project.opmerkingen.push(o);
    document.getElementById('nieuwe-opmerking').value = '';
    persistProject(boardKey, naam, project);
  }
}

function deleteProject(id, boardKey, mapNaam) {
  showConfirm('Project verwijderen?', () => {
    const naam = decodeURIComponent(mapNaam);
    demoStore[boardKey][naam] = demoStore[boardKey][naam].filter(p => p.id !== id);
    if (!DEMO_MODE) {
      db.collection(boardKey + '_' + naam).doc(id).delete()
        .catch(e => alert('❌ Verwijderen mislukt: ' + e.message));
    }
    closeModal();
    openMap(boardKey, mapNaam);
  });
}

const ROL_TITELS = {
  moneyManUid: { label: 'Moneyman/ woman', emoji: '💸' },
  praesesUid: { label: 'Praeses', emoji: '👑' },
  smQueenUid: { label: 'Social Media Queen', emoji: '📸' }
};

function selectRolDrager(sleutel, uid) {
  demoStore[sleutel] = uid || null;
  if (!DEMO_MODE) {
    db.collection('settings').doc('app').set({ [sleutel]: uid || null }, { merge: true });
  }
  const { label, emoji } = ROL_TITELS[sleutel];
  if (uid) {
    const user = Object.values(demoStore.users).find(u => (u.uid || u.username) === uid);
    showToast(`${emoji} ${user ? user.displayName : 'Gebruiker'} is nu ${label}!`);
  } else {
    showToast(`${label} gedeselecteerd.`, 'info');
  }
  navigateTo('gebruikersbeheer');
}

function toggleAppInstelling(sleutel, waarde) {
  demoStore[sleutel] = waarde;
  if (!DEMO_MODE) db.collection('settings').doc('app').update({ [sleutel]: waarde })
    .catch(() => db.collection('settings').doc('app').set({ [sleutel]: waarde }, { merge: true }));
  showToast(waarde ? sleutel + ' ingeschakeld!' : sleutel + ' uitgeschakeld.', 'info');
  renderSidebar();
}


// ─── PAGE: ADMIN DOCS ────────────────────────────────────────────────────────


function renderAdminDocs(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Officiële Documenten</h2><p>Alleen zichtbaar voor Admins.</p></div>
      <button class="btn btn-primary btn-sm" onclick="openUploadModal('admin-docs')">+ Toevoegen</button>
    </div>
    <div id="admindoc-list"><div class="loading">Even laden...</div></div>
  `;
  laadBestanden('admin-docs', 'admindoc-list', demoStore.adminDocumenten, '📁', 'Nog geen documenten toegevoegd.');
}

// ─── PAGE: BUDGET ────────────────────────────────────────────────────────────

function renderBudget(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Budget Overzicht</h2><p>Kosten per avond bijhouden.</p></div>
    </div>
    <div id="budget-totaal-blok" style="margin-bottom:24px;">
      <div class="loading">Even laden...</div>
    </div>
    <div class="card" style="overflow-x:auto;">
      <table class="planning-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Type Avond</th>
            <th>Bedrag (€)</th>
            <th>Bonnetje</th>
            <th>Bekijken</th>
          </tr>
        </thead>
        <tbody id="budget-tbody">
          <tr><td colspan="5" style="text-align:center;padding:20px;color:var(--grijs-donker);">Even laden...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  laadBudget();
}

function laadBudget() {
  if (DEMO_MODE) {
    renderBudgetRijen(demoStore.planning);
    return;
  }

  // Laad planning uit Firestore
  db.collection('planning').get()
    .then(snap => {
      const rijen = [];
      snap.forEach(doc => rijen.push({ firestoreId: doc.id, ...doc.data() }));
      // Sorteer op datum
      rijen.sort((a, b) => (a.datum || '').localeCompare(b.datum || ''));
      renderBudgetRijen(rijen);
    })
    .catch(e => {
      const tbody = document.getElementById('budget-tbody');
      if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="color:var(--oranje);padding:20px;">Fout: ${e.message}</td></tr>`;
    });
}

function renderBudgetRijen(rijen) {
  const tbody = document.getElementById('budget-tbody');
  const totaalBlok = document.getElementById('budget-totaal-blok');
  if (!tbody || !totaalBlok) return;

  // Bereken totaal van alle rijen met een bedrag
  const totaal = rijen.reduce((som, r) => som + parseFloat(r.budgetBedrag || 0), 0);
  const aantalMetBedrag = rijen.filter(r => r.budgetBedrag && parseFloat(r.budgetBedrag) > 0).length;

  totaalBlok.innerHTML = `
    <div style="display:flex;gap:16px;flex-wrap:wrap;">
      <div class="card" style="flex:1;min-width:160px;border-top:4px solid var(--groen);text-align:center;">
        <div style="font-size:32px;font-weight:700;color:var(--groen);font-family:'DM Serif Display',serif;">€ ${totaal.toFixed(2)}</div>
        <div style="font-size:12px;color:var(--grijs-donker);margin-top:6px;text-transform:uppercase;letter-spacing:1px;">Totaal uitgekeerd</div>
      </div>
      <div class="card" style="flex:1;min-width:160px;border-top:4px solid var(--goud);text-align:center;">
        <div style="font-size:32px;font-weight:700;color:var(--goud);font-family:'DM Serif Display',serif;">${aantalMetBedrag}</div>
        <div style="font-size:12px;color:var(--grijs-donker);margin-top:6px;text-transform:uppercase;letter-spacing:1px;">Avonden met bon</div>
      </div>
    </div>
  `;

  if (rijen.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--grijs-donker);">Nog geen planningsrijen. Voeg eerst avonden toe in de Planning-tab.</td></tr>`;
    return;
  }

  tbody.innerHTML = rijen.map(r => {
    const rowId = r.firestoreId || r.id;
    const heeftBon = r.budgetBonUrl && r.budgetBonUrl.trim();
    const datumLeesbaar = r.datum ? new Date(r.datum).toLocaleDateString('nl-NL') : '—';

    return `<tr id="budget-row-${rowId}">
      <td style="font-size:13px;">${datumLeesbaar}</td>
      <td style="font-size:13px;">${r.typeAvond || '—'}</td>
      <td>
        <div style="display:flex;align-items:center;gap:4px;">
          <span style="font-size:13px;">€</span>
          <input type="number" step="0.01" min="0"
            value="${r.budgetBedrag || ''}"
            placeholder="0.00"
            style="width:90px;border:1.5px solid var(--grijs);border-radius:3px;padding:5px 8px;font-family:'Inter',sans-serif;font-size:13px;"
            onchange="saveBudgetVeld('${rowId}','budgetBedrag',this.value)">
        </div>
      </td>
      <td>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <label style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1.5px solid var(--grijs);border-radius:3px;font-size:12px;font-family:'Inter',sans-serif;background:#fafaf8;">
            📷 ${heeftBon ? 'Vervangen' : 'Foto uploaden'}
            <input type="file" accept="image/*" capture="environment" style="display:none;"
              onchange="uploadBonFoto('${rowId}', this)">
          </label>
          <div class="bon-paste-zone" contenteditable="true" title="Klik hier en druk Ctrl+V (Windows) of Cmd+V (Mac) om een gekopieerde foto te plakken"
            style="cursor:text;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border:1.5px dashed var(--grijs-donker);border-radius:3px;font-size:12px;font-family:'Inter',sans-serif;color:var(--grijs-donker);outline:none;white-space:nowrap;"
            onpaste="plakBonFoto('${rowId}', event); return false;"
            onfocus="this.style.borderColor='var(--groen)';this.style.color='var(--groen)';"
            onblur="this.style.borderColor='var(--grijs-donker)';this.style.color='var(--grijs-donker)';this.innerText='📋 Klik + plak';">📋 Klik + plak</div>
        </div>
      </td>
      <td>
        ${heeftBon
          ? `<a href="${r.budgetBonUrl}" target="_blank" style="color:var(--groen);font-weight:700;font-size:13px;text-decoration:none;">🧾 Bekijken</a>`
          : '<span style="color:#ccc;font-size:12px;">—</span>'}
      </td>
    </tr>`;
  }).join('');
}

function saveBudgetVeld(planningId, veld, waarde) {
  const rij = demoStore.planning.find(r => (r.firestoreId || r.id) === planningId || r.id === planningId);
  if (rij) rij[veld] = waarde;

  if (!DEMO_MODE) {
    db.collection('planning').doc(planningId).update({ [veld]: waarde })
      .then(() => { showToast('Opgeslagen!'); laadBudget(); })
      .catch(e => alert('❌ Opslaan mislukt: ' + e.message));
    return;
  }
  laadBudget();
}

function uploadBonFoto(planningId, input) {
  const file = input.files[0];
  if (!file) return;
  verwerkBonFoto(planningId, file);
}

function verwerkBonFoto(planningId, file) {
  // Comprimeer afbeelding naar max 800px breed en sla op als base64
  const maxKB = 400;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxW = 800;
      const scale = Math.min(1, maxW / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Comprimeer als JPEG
      let quality = 0.8;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Als nog te groot, verlaag kwaliteit
      while (dataUrl.length > maxKB * 1024 * 1.37 && quality > 0.3) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      saveBudgetVeld(planningId, 'budgetBonUrl', dataUrl);
      showToast('Bonnetje opgeslagen!');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function plakBonFoto(planningId, event) {
  event.preventDefault();
  const target = event.currentTarget;

  const items = (event.clipboardData && (event.clipboardData.items || event.clipboardData.files)) || [];
  let file = null;
  for (const item of items) {
    if (item.type && item.type.startsWith('image/')) {
      file = item.getAsFile ? item.getAsFile() : item;
      break;
    }
  }

  if (target) target.innerText = '📋 Klik + plak';

  if (!file) {
    showToast('Geen afbeelding gevonden. Kopieer eerst een foto (bv. uit WhatsApp) en plak opnieuw.', 'error');
    return;
  }
  verwerkBonFoto(planningId, file);
}

// ─── PAGE: GEBRUIKERSBEHEER ──────────────────────────────────────────────────

function renderGebruikersbeheer(el) {
  el.innerHTML = `
    <div class="page-header">
      <div><h2>Gebruikersbeheer</h2><p>Beheer van alle accounts.</p></div>
      <button class="btn btn-primary btn-sm" onclick="openNieuwGebruikerModal()">+ Gebruiker toevoegen</button>
    </div>

    <!-- App Instellingen -->
    <div class="card" style="margin-bottom:20px;">
      <div class="card-header"><h3>⚙️ App Instellingen</h3></div>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        ${['moneyManUid', 'praesesUid', 'smQueenUid'].map(sleutel => {
          const { label, emoji } = ROL_TITELS[sleutel];
          const huidigeUid = demoStore[sleutel];
          return `
        <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;white-space:nowrap;">
          <span style="font-size:26px;line-height:1;">${emoji}</span>
          <span style="font-size:13px;font-weight:600;color:var(--zwart);">${label}</span>
          <select id="rol-select-${sleutel}" onchange="selectRolDrager('${sleutel}', this.value)"
            style="padding:8px 12px;border:1.5px solid var(--grijs);border-radius:4px;font-family:'Inter',sans-serif;font-size:13px;width:110px;">
            <option value="">—</option>
            ${Object.values(demoStore.users).map(u =>
              `<option value="${u.uid || u.username}" ${huidigeUid === (u.uid || u.username) ? 'selected' : ''}>${u.username || u.email.replace('@borsa.intern','')}</option>`
            ).join('')}
          </select>
          ${huidigeUid ? `<button class="btn btn-danger btn-sm" title="Deselecteren" style="padding:3px 8px;font-size:12px;" onclick="selectRolDrager('${sleutel}', '')">✕</button>` : ''}
        </div>`;
        }).join('')}
      </div>
    </div>
    <div class="card" style="overflow-x:auto;">
      <table class="planning-table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Gebruikersnaam</th>
            <th>Rol</th>
            <th>Wachtwoord</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="users-tbody">
          <tr><td colspan="5" style="text-align:center;color:var(--grijs-donker);padding:20px;">Even laden...</td></tr>
        </tbody>
      </table>
    </div>
    <div class="alert alert-info" style="margin-top:16px;">
      <strong>ℹ️ Wachtwoorden:</strong> Klik op het oog-icoon om een wachtwoord zichtbaar te maken.
      Gebruik "Wijzig wachtwoord" om een nieuw wachtwoord in te stellen als een lid hem vergeten is.
      ${DEMO_MODE ? ' In demo-modus worden wijzigingen niet permanent opgeslagen.' : ''}
    </div>
  `;

  if (DEMO_MODE) {
    const users = Object.values(demoStore.users);
    document.getElementById('users-tbody').innerHTML =
      users.length ? users.map(u => gebruikerRowHTML(u)).join('') :
      '<tr><td colspan="5" style="text-align:center;color:var(--grijs-donker);padding:20px;">Nog geen gebruikers.</td></tr>';
    return;
  }

  // Firebase: laad alle gebruikers uit Firestore inclusief cachedPw
  db.collection('users').get().then(snap => {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    if (snap.empty) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--grijs-donker);padding:20px;">Nog geen gebruikers.</td></tr>';
      return;
    }
    const rows = [];
    const gebruikers = [];
    snap.forEach(doc => {
      const u = { uid: doc.id, ...doc.data() };
      rows.push(gebruikerRowHTML(u));
      gebruikers.push(u);
    });
    tbody.innerHTML = rows.join('');

    // Update rol-dropdowns met echte Firestore users
    ['moneyManUid', 'praesesUid', 'smQueenUid'].forEach(sleutel => {
      const select = document.getElementById('rol-select-' + sleutel);
      if (select) {
        select.innerHTML = '<option value="">—</option>' +
          gebruikers.map(u => `<option value="${u.uid}" ${demoStore[sleutel] === u.uid ? 'selected' : ''}>${u.username || u.email.replace('@borsa.intern','')}</option>`).join('');
      }
    });
  }).catch(e => {
    const tbody = document.getElementById('users-tbody');
    if (tbody) tbody.innerHTML = `<tr><td colspan="5" style="color:var(--oranje);padding:20px;">Fout bij laden: ${e.message}</td></tr>`;
  });
}

function gebruikerRowHTML(u) {
  const username = u.username || u.email.replace('@borsa.intern', '');
  const pw = DEMO_MODE
    ? (demoStore.passwords[u.email] || '••••••••')
    : (u.cachedPw || '(niet opgeslagen)');
  return `
    <tr id="user-row-${u.uid}">
      <td><strong>${u.displayName}</strong></td>
      <td style="color:var(--grijs-donker);">@${username}</td>
      <td>
        <select onchange="changeRole('${u.uid}', this.value)"
          style="border:1.5px solid var(--grijs);border-radius:3px;font-family:'Inter',sans-serif;padding:5px 8px;font-size:12px;background:#fafaf8;">
          <option ${u.rol==='lid' ? 'selected' : ''} value="lid">Lid</option>
          <option ${u.rol==='reisco' ? 'selected' : ''} value="reisco">Reisco</option>
          <option ${u.rol==='admin' ? 'selected' : ''} value="admin">Admin</option>
        </select>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:6px;">
          <span id="pw-display-${u.uid}" style="font-family:monospace;font-size:13px;letter-spacing:1px;">••••••••</span>
          <span data-pw="${pw}" style="display:none;" id="pw-value-${u.uid}"></span>
          <button class="btn btn-outline btn-sm" onclick="togglePwZichtbaar('${u.uid}')" title="Wachtwoord tonen/verbergen"
            style="padding:3px 8px;font-size:14px;">👁</button>
        </div>
      </td>
      <td style="display:flex;gap:6px;flex-wrap:wrap;padding:8px;">
        <button class="btn btn-goud btn-sm" onclick="openWachtwoordModal('${u.uid}','${u.displayName}','${u.email}')">Wijzig wachtwoord</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser('${u.uid}')">Verwijderen</button>
      </td>
    </tr>`;
}

function togglePwZichtbaar(uid) {
  const display = document.getElementById('pw-display-' + uid);
  const valueEl = document.getElementById('pw-value-' + uid);
  if (!display || !valueEl) return;
  if (display.textContent === '••••••••') {
    display.textContent = valueEl.dataset.pw || '(onbekend in live-modus)';
  } else {
    display.textContent = '••••••••';
  }
}

function openWachtwoordModal(uid, naam, email) {
  showModal(`
    <h3>Wachtwoord wijzigen</h3>
    <p style="color:var(--grijs-donker);font-size:13px;margin-bottom:16px;">Nieuw wachtwoord instellen voor <strong>${naam}</strong></p>
    <div class="form-group">
      <label>Nieuw wachtwoord</label>
      <input type="text" id="new-pw-input" placeholder="Minimaal 6 tekens" autocomplete="new-password">
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveNieuwWachtwoord('${uid}','${email}')">Opslaan</button>
    </div>
  `);
}

function saveNieuwWachtwoord(uid, email) {
  const nieuwPw = document.getElementById('new-pw-input').value;
  if (!nieuwPw || nieuwPw.length < 6) { alert('Wachtwoord moet minimaal 6 tekens zijn.'); return; }

  if (DEMO_MODE) {
    demoStore.passwords[email] = nieuwPw;
    const valueEl = document.getElementById('pw-value-' + uid);
    if (valueEl) valueEl.dataset.pw = nieuwPw;
    const display = document.getElementById('pw-display-' + uid);
    if (display && display.textContent !== '••••••••') display.textContent = nieuwPw;
    closeModal();
    showToast('Wachtwoord bijgewerkt!');
    return;
  }

  // Stap 1: sla cachedPw ALTIJD direct op in Firestore — dit werkt ongeacht alles
  db.collection('users').doc(uid).update({ cachedPw: nieuwPw })
    .then(() => {
      // Stap 2: probeer ook het echte Firebase Auth-wachtwoord te updaten
      // via de secondary auth instantie
      const secondaryApp = firebase.apps.find(a => a.name === 'Secondary')
        || firebase.initializeApp(firebaseConfig, 'Secondary');
      const secondaryAuth = secondaryApp.auth();

      return secondaryAuth.signInWithEmailAndPassword(email, nieuwPw)
        .then(() => secondaryAuth.signOut())
        .catch(() => {
          // Lukt de login niet (oud wachtwoord klopt niet meer) — dat is ok,
          // cachedPw is al opgeslagen. De gebruiker kan nu inloggen met het nieuwe wachtwoord
          // nadat een admin het ook in Firebase Auth heeft bijgewerkt via de console.
          return Promise.resolve();
        });
    })
    .then(() => {
      closeModal();
      // Update de weergave in de tabel direct zonder reload
      const valueEl = document.getElementById('pw-value-' + uid);
      if (valueEl) valueEl.dataset.pw = nieuwPw;
      showToast('Wachtwoord opgeslagen! Het is nu zichtbaar via het oog-icoontje.');
    })
    .catch(e => {
      alert('Fout bij opslaan: ' + e.message);
    });
}

function openNieuwGebruikerModal() {
  showModal(`
    <h3>Nieuwe Gebruiker</h3>
    <div class="form-group"><label>Weergavenaam</label><input type="text" id="nu-naam" placeholder="Jan de Vries"></div>
    <div class="form-group">
      <label>Gebruikersnaam</label>
      <div style="display:flex;align-items:center;gap:0;">
        <input type="text" id="nu-username" placeholder="jandevries" autocapitalize="none" style="border-radius:3px 0 0 3px;flex:1;">
        <span style="background:var(--grijs);border:1.5px solid var(--grijs);border-left:none;padding:10px 12px;font-size:13px;color:var(--grijs-donker);border-radius:0 3px 3px 0;white-space:nowrap;">@borsa.intern</span>
      </div>
    </div>
    <div class="form-group"><label>Wachtwoord</label><input type="text" id="nu-pw" placeholder="Min. 6 tekens" autocomplete="new-password"></div>
    <div class="form-group">
      <label>Rol</label>
      <select id="nu-rol">
        <option value="lid">Lid</option>
        <option value="reisco">Reisco</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="saveNieuweGebruiker()">Aanmaken</button>
    </div>
  `);
}

function saveNieuweGebruiker() {
  const naam = document.getElementById('nu-naam').value.trim();
  const username = document.getElementById('nu-username').value.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const pw = document.getElementById('nu-pw').value;
  const rol = document.getElementById('nu-rol').value;

  if (!naam || !username || !pw) { alert('Vul naam, gebruikersnaam en wachtwoord in.'); return; }
  if (pw.length < 6) { alert('Wachtwoord moet minimaal 6 tekens zijn.'); return; }

  const email = username + '@borsa.intern';

  if (DEMO_MODE) {
    const uid = 'uid_' + Date.now();
    demoStore.users[email] = { uid, email, username, displayName: naam, rol };
    demoStore.passwords[email] = pw;
    showToast('Gebruiker ' + naam + ' aangemaakt!');
    closeModal();
    navigateTo('gebruikersbeheer');
    return;
  }

  // Firebase: maak gebruiker aan via secundaire app-instantie zodat admin ingelogd blijft
  const secondaryApp = firebase.apps.find(a => a.name === 'Secondary')
    || firebase.initializeApp(firebaseConfig, 'Secondary');
  const secondaryAuth = secondaryApp.auth();

  secondaryAuth.createUserWithEmailAndPassword(email, pw).then(cred => {
    const newUid = cred.user.uid;
    // Sla ook cachedPw op zodat admin het wachtwoord kan inzien/resetten
    return db.collection('users').doc(newUid).set({ displayName: naam, email, username, rol, cachedPw: pw })
      .then(() => secondaryAuth.signOut());
  }).then(() => {
    showToast('Gebruiker ' + naam + ' aangemaakt!');
    closeModal();
    navigateTo('gebruikersbeheer');
  }).catch(e => {
    if (e.code === 'auth/email-already-in-use') {
      alert('Gebruikersnaam "' + username + '" is al in gebruik.');
    } else {
      alert('Fout: ' + e.message);
    }
  });
}

function changeRole(uid, newRol) {
  const user = Object.values(demoStore.users).find(u => u.uid === uid);
  if (user) user.rol = newRol;
  if (!DEMO_MODE) db.collection('users').doc(uid).update({ rol: newRol });
}

function deleteUser(uid) {
  showConfirm('Dit account wordt permanent verwijderd.', () => { _deleteUser(uid); }); return; }
function _deleteUser(uid) {
  const email = Object.keys(demoStore.users).find(e => demoStore.users[e].uid === uid);
  if (email) { delete demoStore.users[email]; delete demoStore.passwords[email]; }
  document.getElementById('user-row-' + uid)?.remove();
  if (!DEMO_MODE) db.collection('users').doc(uid).delete();
}


// ─── TOAST NOTIFICATIONS ─────────────────────────────────────────────────────
function showToast(message, type = 'success', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '✅'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}


let _confirmCallback = null;

function showConfirm(message, onConfirm) {
  _confirmCallback = onConfirm;
  showModal(`
    <div style="text-align:center;padding:8px 0;">
      <div style="font-size:36px;margin-bottom:16px;">⚠️</div>
      <h3 style="margin-bottom:12px;">Weet je het zeker?</h3>
      <p style="color:var(--grijs-donker);font-size:14px;margin-bottom:24px;">${message}</p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button class="btn btn-outline" onclick="closeModal()">Annuleren</button>
        <button class="btn btn-danger" onclick="closeModal(); if(_confirmCallback) { _confirmCallback(); _confirmCallback = null; }">Verwijderen</button>
      </div>
    </div>
  `);
}


function toggleProfielMenu() {
  const menu = document.getElementById('profiel-menu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Sluit profiel menu bij klik buiten
document.addEventListener('click', function(e) {
  const btn = document.getElementById('profiel-btn');
  const menu = document.getElementById('profiel-menu');
  if (menu && btn && !btn.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});

function openProfielModal() {
  const lid = demoStore.leden.find(l =>
    l.koppelUsername && currentUserData.username &&
    l.koppelUsername.toLowerCase() === currentUserData.username.toLowerCase()
  );
  showModal(`
    <h3>👤 Mijn Profiel</h3>
    <div class="form-group"><label>Weergavenaam</label>
      <input type="text" id="profiel-naam" value="${currentUserData.displayName || ''}" placeholder="Jouw naam">
    </div>
    <div class="form-group"><label>E-mail (privé)</label>
      <input type="email" id="profiel-email" value="${lid ? lid.email || '' : ''}" placeholder="naam@mail.com">
    </div>
    <div class="form-group"><label>Telefoon</label>
      <input type="text" id="profiel-tel" value="${lid ? lid.telefoon || '' : ''}" placeholder="06...">
    </div>
    <div class="form-group"><label>Adres</label>
      <input type="text" id="profiel-adres" value="${lid ? lid.adres || '' : ''}" placeholder="Straat 1, 1234AB">
    </div>
    <div class="form-group"><label>Dieet / allergie</label>
      <input type="text" id="profiel-dieet" value="${lid ? lid.dieet || '' : ''}" placeholder="-">
    </div>
    <div style="border-top:1px solid var(--grijs);margin-top:16px;padding-top:16px;">
      <div class="form-group"><label>Nieuw wachtwoord (leeg = ongewijzigd)</label>
        <input type="password" id="profiel-pw" placeholder="Nieuw wachtwoord">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline btn-sm" onclick="closeModal()">Annuleren</button>
      <button class="btn btn-primary btn-sm" onclick="slaProfielOp()">Opslaan</button>
    </div>
  `);
}

function slaProfielOp() {
  const naam = document.getElementById('profiel-naam').value.trim();
  const email = document.getElementById('profiel-email').value.trim();
  const tel = document.getElementById('profiel-tel').value.trim();
  const adres = document.getElementById('profiel-adres').value.trim();
  const dieet = document.getElementById('profiel-dieet').value.trim();
  const pw = document.getElementById('profiel-pw').value;

  // Update displayName in currentUserData
  if (naam) {
    currentUserData.displayName = naam;
    document.getElementById('topbar-name').textContent = naam;
    const avatar = document.getElementById('profiel-avatar');
    if (avatar) avatar.textContent = naam.charAt(0).toUpperCase();
    const menuNaam = document.getElementById('menu-naam');
    if (menuNaam) menuNaam.textContent = naam;
    if (!DEMO_MODE) db.collection('users').doc(currentUser.uid).update({ displayName: naam });
  }

  // Update ledenlijst als er een koppeling is
  const lid = demoStore.leden.find(l =>
    l.koppelUsername && currentUserData.username &&
    l.koppelUsername.toLowerCase() === currentUserData.username.toLowerCase()
  );
  if (lid) {
    if (email) lid.email = email;
    if (tel) lid.telefoon = tel;
    if (adres) lid.adres = adres;
    lid.dieet = dieet;
    if (!DEMO_MODE) db.collection('leden').doc(lid.id).update({ email, telefoon: tel, adres, dieet });
  }

  // Wachtwoord wijzigen
  if (pw && pw.length >= 6 && !DEMO_MODE && currentUser) {
    currentUser.updatePassword(pw).catch(e => showToast('Wachtwoord kon niet worden bijgewerkt: ' + e.message, 'error'));
  }

  showToast('Profiel opgeslagen!');
  closeModal();
}

// ─── MODAL HELPERS ───────────────────────────────────────────────────────────

function showModal(html) {
  const container = document.getElementById('modal-container');
  container.innerHTML = `
    <div class="modal-overlay" onclick="handleOverlayClick(event)">
      <div class="modal">${html}</div>
    </div>`;
}

function handleOverlayClick(e) {
  if (e.target.classList.contains('modal-overlay')) closeModal();
}

function closeModal() {
  document.getElementById('modal-container').innerHTML = '';
}

// ─── KEYBOARD ────────────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && (document.getElementById('login-password') === document.activeElement || document.getElementById('login-username') === document.activeElement)) doLogin();
});
