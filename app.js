/**
 /**
 * FixElite Application Engine
 * Implements Frontend Routing, API State Synchronizer, Hybrid Local Sandbox fallback,
 * Geolocated Worker search, AI Part verification scanner sweep, Emergency SOS alarm system,
 * Academy Interactive Quizzes, and Chat Simulation.
 */

const API_BASE = 'http://localhost:3000/api';

// ==========================================================================
// AUDIO SYNTHESIS ENGINE (WEB AUDIO API)
// ==========================================================================
let audioCtx = null;
let activeSirenOsc1 = null;
let activeSirenOsc2 = null;
let activeSirenGain = null;
let activeSirenInterval = null;
let activeDialOsc = null;
let activeDialGain = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// 1. UI Click sound: a short synth pop/click
function playClickSound() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.07);
    
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.07);
  } catch (e) {
    console.warn("Audio Context Click error:", e);
  }
}

// 2. Chime sound: double beep for successful action
function playSuccessSound() {
  try {
    initAudioContext();
    const playBeep = (freq, delay, duration) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
      
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
      
      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + duration);
    };
    
    playBeep(523.25, 0, 0.1); // C5
    playBeep(659.25, 0.08, 0.18); // E5
  } catch (e) {
    console.warn("Audio Context Success error:", e);
  }
}

// 3. Danger warn sound: alarm beep during crash sensor countdown
function playWarnBeep() {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, audioCtx.currentTime);
    osc.frequency.setValueAtTime(420, audioCtx.currentTime + 0.06);
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime + 0.12);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    console.warn("Audio warning beep error:", e);
  }
}

// 4. Telephone Dial Tone (Multi-frequency DTMF)
function startDialTone() {
  try {
    initAudioContext();
    stopDialTone();
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.value = 350;
    osc2.type = 'sine';
    osc2.frequency.value = 440;
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    
    activeDialOsc = [osc1, osc2];
    activeDialGain = gain;
  } catch (e) {
    console.warn("Start dial tone error:", e);
  }
}

function stopDialTone() {
  if (activeDialOsc) {
    activeDialOsc.forEach(o => {
      try { o.stop(); } catch(e){}
    });
    activeDialOsc = null;
  }
  if (activeDialGain) {
    try { activeDialGain.disconnect(); } catch(e){}
    activeDialGain = null;
  }
}

// 5. Emergency Siren (Continuous alternating frequency)
function startSirenSound() {
  try {
    initAudioContext();
    stopSirenSound();
    
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    osc1.frequency.value = 800;
    osc2.frequency.value = 600;
    
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc1.start();
    osc2.start();
    
    activeSirenOsc1 = osc1;
    activeSirenOsc2 = osc2;
    activeSirenGain = gain;
    
    let frequencyFlip = false;
    activeSirenInterval = setInterval(() => {
      if (!audioCtx) return;
      const target1 = frequencyFlip ? 950 : 750;
      const target2 = frequencyFlip ? 800 : 600;
      osc1.frequency.linearRampToValueAtTime(target1, audioCtx.currentTime + 0.2);
      osc2.frequency.linearRampToValueAtTime(target2, audioCtx.currentTime + 0.2);
      frequencyFlip = !frequencyFlip;
    }, 250);
  } catch (e) {
    console.warn("Start siren sound error:", e);
  }
}

function stopSirenSound() {
  if (activeSirenInterval) {
    clearInterval(activeSirenInterval);
    activeSirenInterval = null;
  }
  if (activeSirenOsc1) {
    try { activeSirenOsc1.stop(); } catch(e){}
    activeSirenOsc1 = null;
  }
  if (activeSirenOsc2) {
    try { activeSirenOsc2.stop(); } catch(e){}
    activeSirenOsc2 = null;
  }
  if (activeSirenGain) {
    try { activeSirenGain.disconnect(); } catch(e){}
    activeSirenGain = null;
  }
}

// ==========================================================================
// AUTHENTICATION LOGIC & PORTAL REDIRECTS
// ==========================================================================
window.switchLoginTab = function(role) {
  playClickSound();
  const tabUser = document.getElementById('login-tab-user');
  const tabWorker = document.getElementById('login-tab-worker');
  const formUser = document.getElementById('login-form-user');
  const formWorker = document.getElementById('login-form-worker');

  if (role === 'user') {
    tabUser.classList.add('active');
    tabWorker.classList.remove('active');
    formUser.style.display = 'block';
    formWorker.style.display = 'none';
    
    tabUser.style.color = 'var(--text-main)';
    tabWorker.style.color = 'var(--text-muted)';
  } else {
    tabWorker.classList.add('active');
    tabUser.classList.remove('active');
    formWorker.style.display = 'block';
    formUser.style.display = 'none';
    
    tabWorker.style.color = 'var(--text-main)';
    tabUser.style.color = 'var(--text-muted)';
  }
};

async function loginUser(details) {
  if (isOfflineMode) {
    const db = getLocalDB();
    const { role, name, phone, category, education, experience, licenseNumber, hourlyRate } = details;
    
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    if (role === 'Worker') {
      let worker = db.workers.find(w => w.name.toLowerCase() === name.toLowerCase() || (licenseNumber && w.licenseNumber === licenseNumber));
      if (!worker) {
        worker = {
          id: "worker_" + Date.now(),
          name,
          category: category || "electrician",
          role: (category || "electrician").charAt(0).toUpperCase() + (category || "electrician").slice(1) + " Expert",
          experience: experience || "1 Year",
          education: education || "Diploma Certificate",
          bio: "Registered professional worker ready to assist.",
          avatar,
          phone,
          rating: 5.0,
          distance: 1.2,
          hourlyRate: parseInt(hourlyRate) || 150,
          approved: true,
          guaranteed: true,
          licenseNumber: licenseNumber || "GOV-LIC-" + Math.floor(Math.random() * 900 + 100)
        };
        db.workers.push(worker);
      }
      db.currentUser = {
        id: worker.id,
        name: worker.name,
        role: "Worker",
        avatar: worker.avatar,
        phone: worker.phone,
        location: "Metro City Central",
        skills: ["Certified Specialist"],
        isWorkerApproved: worker.approved,
        education: worker.education,
        experience: worker.experience,
        category: worker.category,
        licenseNumber: worker.licenseNumber,
        hourlyRate: worker.hourlyRate
      };
    } else {
      db.currentUser = {
        id: "user_" + Date.now(),
        name,
        role: "Customer",
        avatar,
        phone,
        location: "Metro City Central",
        skills: ["Basic Wiring"],
        isWorkerApproved: false,
        education: "",
        experience: "",
        category: "",
        licenseNumber: "",
        hourlyRate: ""
      };
    }
    
    saveLocalDB(db);
    return db.currentUser;
  }
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return loginUser(details);
  }
}

async function logoutUser() {
  if (isOfflineMode) {
    const db = getLocalDB();
    db.currentUser = {
      id: "",
      name: "",
      role: "",
      avatar: "",
      phone: "",
      location: "",
      skills: [],
      isWorkerApproved: false,
      education: "",
      experience: "",
      category: "",
      licenseNumber: "",
      hourlyRate: ""
    };
    saveLocalDB(db);
    return { success: true };
  }
  try {
    const res = await fetch(`${API_BASE}/logout`, { method: 'POST' });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return logoutUser();
  }
}

// --- Default Data Structure (Used for local sandbox fallback & initialization) ---
const DEFAULT_DB = {
  currentUser: {
    id: "user",
    name: "Alex Johnson",
    role: "Customer",
    avatar: "AJ",
    phone: "+91 98765 43210",
    location: "Metro City Central",
    skills: ["Basic Wiring"],
    isWorkerApproved: false,
    education: "",
    experience: "",
    category: "",
    licenseNumber: "",
    hourlyRate: "",
    isElitePro: false,
    appliedGigs: []
  },
  workers: [
    {
      id: "ramesh_electrician",
      name: "Ramesh Kumar",
      category: "electrician",
      role: "Electrician Expert",
      experience: "8 Years",
      education: "Govt ITI Certificate in Electricals",
      bio: "Specialist in residential wiring, short-circuit diagnostics, and smart fuse-box installations. Government approved license holder.",
      avatar: "RK",
      phone: "+91 98111 22233",
      rating: 4.8,
      distance: 0.8,
      hourlyRate: 200,
      approved: true,
      guaranteed: true,
      licenseNumber: "GOV-EL-90823"
    },
    {
      id: "murugan_plumber",
      name: "S. Murugan",
      category: "plumber",
      role: "Senior Plumbing Consultant",
      experience: "12 Years",
      education: "Certified Plumbing License (MCD)",
      bio: "Expert in high-pressure pipe leakages, bathroom fitting, kitchen drainage routing, and water pump overhauls. Prompt response guaranteed.",
      avatar: "SM",
      phone: "+91 98222 33344",
      rating: 4.9,
      distance: 1.5,
      hourlyRate: 250,
      approved: true,
      guaranteed: true,
      licenseNumber: "GOV-PL-33412"
    },
    {
      id: "amit_mechanic",
      name: "Amit Patel",
      category: "bike_mechanic",
      role: "Two-Wheeler specialist",
      experience: "6 Years",
      education: "Diploma in Automobile Engineering",
      bio: "Engine rebuilding, fuel injection calibration, and performance tuning for all commuter and premium bikes. Ex-showroom head mechanic.",
      avatar: "AP",
      phone: "+91 98333 44455",
      rating: 4.7,
      distance: 2.1,
      hourlyRate: 300,
      approved: true,
      guaranteed: true,
      licenseNumber: "GOV-MECH-4819"
    },
    {
      id: "vikram_solar",
      name: "Vikram Aditya",
      category: "electrician",
      role: "Solar & Smart Grid Engineer",
      experience: "7 Years",
      education: "M.Tech in Renewable Energy Systems",
      bio: "Specializes in hybrid solar grid integration, automated breaker panels, industrial energy audits, and smart building management systems.",
      avatar: "VA",
      phone: "+91 98999 88877",
      rating: 4.9,
      distance: 1.1,
      hourlyRate: 600,
      approved: true,
      guaranteed: true,
      licenseNumber: "GOV-EE-7890",
      isElitePro: true
    },
    {
      id: "sarah_car_mech",
      name: "Sarah D'Souza",
      category: "car_mechanic",
      role: "Master Car Mechanic",
      experience: "10 Years",
      education: "B.Tech in Mechanical Engineering",
      bio: "Certified diagnostic expert for luxury cars, transmission systems, engine overhauls, and OBD-II scanner code analysis.",
      avatar: "SD",
      phone: "+91 98444 55566",
      rating: 4.9,
      distance: 3.4,
      hourlyRate: 500,
      approved: true,
      guaranteed: true,
      licenseNumber: "GOV-MECH-7102",
      isElitePro: true
    },
    {
      id: "john_plumber",
      name: "John Doe",
      category: "plumber",
      role: "Apprentice Plumber",
      experience: "2 Years",
      education: "Plumbing Apprentice Certificate",
      bio: "Affordable solutions for general faucet repairs, drain cleaning, and pipe fixing. Ready to serve anytime.",
      avatar: "JD",
      phone: "+91 98555 66677",
      rating: 4.2,
      distance: 1.8,
      hourlyRate: 120,
      approved: false,
      guaranteed: false,
      licenseNumber: "PENDING-098"
    },
    {
      id: "vicky_electrician",
      name: "Vicky Sharma",
      category: "electrician",
      role: "General Wireman",
      experience: "1 Year",
      education: "Electrical Training Course Certificate",
      bio: "Available for quick ceiling fan installations, simple bulb fittings, socket repairs, and extension boards setup.",
      avatar: "VS",
      phone: "+91 98666 77788",
      rating: 4.4,
      distance: 0.5,
      hourlyRate: 100,
      approved: true,
      guaranteed: false,
      licenseNumber: "GOV-EL-55610"
    }
  ],
  showroomServices: [
    { id: "s1", brand: "Honda Dealership Service", vehicle: "Bike", title: "General Showroom Checkup", price: 799, desc: "Showroom standardized periodic service including oil change, air filter cleaning, brake adjustment, and 15-point check." },
    { id: "s2", brand: "Suzuki Certified Care", vehicle: "Bike", title: "Full Engine Tune-up & Polish", price: 1499, desc: "Detailed engine tuning, carburetor/fuel injector cleanup, chain tightening, water wash, and premium wax polish." },
    { id: "s3", brand: "Maruti Suzuki Showroom", vehicle: "Car", title: "Standard Yearly Service", price: 2999, desc: "Synthetic engine oil replacement, oil filter check, wheel balancing, alignment, brake bleeding, and electrical scan." },
    { id: "s4", brand: "Toyota Showroom Service", vehicle: "Car", title: "Premium Deep Diagnostics & Wash", price: 4999, desc: "Complete OBD diagnostics, AC filter cleaning, coolant top-up, spark plug cleaning, full body undercoat check, and interior vacuum." }
  ],
  bookings: [
    {
      id: "b_1",
      type: "worker",
      entityId: "ramesh_electrician",
      entityName: "Ramesh Kumar",
      category: "Electrician",
      price: 200,
      date: "2026-07-06",
      time: "10:00 AM",
      status: "Confirmed"
    }
  ],
  courses: [
    {
      id: "ev_basics",
      title: "Electric Vehicle (EV) Systems Diagnostic",
      description: "Learn how to troubleshoot and service modern electric cars and electric bikes. Understand battery management systems (BMS), motor controllers, and battery thermal diagnostics.",
      duration: "6 Hours",
      difficulty: "Intermediate",
      lessons: [
        { title: "Introduction to EV High Voltage Architecture", time: "45 mins" },
        { title: "Battery Cell Chemistry and Safety Precautions", time: "1 hour" },
        { title: "Diagnosing BMS and Thermal Controls", time: "1.5 hours" },
        { title: "Electric Motor Speed Controller Troubleshooting", time: "2 hours" }
      ],
      quiz: {
        questions: [
          {
            q: "What is the primary role of a Battery Management System (BMS)?",
            options: [
              "To increase battery voltage output beyond limits",
              "To balance battery cells, monitor temperature, and prevent overcharging",
              "To charge the battery directly from the solar grid",
              "To convert DC voltage to AC for motor usage"
            ],
            answer: 1
          },
          {
            q: "Which safety tool is mandatory when handling open EV battery packs?",
            options: [
              "Steel-plated general screwdriver",
              "1000V Insulated rubber gloves and safety goggles",
              "Polyester anti-static wrist strap only",
              "No special tools needed if vehicle power is off"
            ],
            answer: 1
          }
        ]
      }
    },
    {
      id: "smart_home",
      title: "Smart Home Systems & IoT Setup",
      description: "Upskill in the fast-growing IoT field. Master solar hybrid inverters, smart automated breaker boards, smart CCTV security nodes, and modern lighting systems integration.",
      duration: "4 Hours",
      difficulty: "Beginner Friendly",
      lessons: [
        { title: "Overview of Modern Smart Hubs & Protocols", time: "30 mins" },
        { title: "Installing Wi-Fi and Zigbee Automated Switches", time: "1 hour" },
        { title: "Wiring Smart Breaker Distribution Boxes", time: "1.5 hours" },
        { title: "Integrating Solar Hybrid Inverter Monitoring App", time: "1 hour" }
      ],
      quiz: {
        questions: [
          {
            q: "Why do smart automated circuit breakers require a Neutral wire?",
            options: [
              "Neutral is only needed for color coding",
              "To power the onboard Wi-Fi / communication microchips constantly",
              "To discharge residual static electricity",
              "They do not require a Neutral wire to work"
            ],
            answer: 1
          },
          {
            q: "What protocol is commonly used for low-power smart home mesh networks?",
            options: [
              "Standard USB-C Protocol",
              "Zigbee / Z-Wave",
              "FTP Protocol",
              "NFC Contactless Standard"
            ],
            answer: 1
          }
        ]
      }
    }
  ],
  sosAlerts: [
    {
      id: "sos_1",
      timestamp: "2026-07-05T21:00:00.000Z",
      location: "Near Sector 15 Cross Road (19.0760° N, 72.8777° E)",
      status: "Responded (Ambulance & Nearest Worker Ramesh dispatched)",
      triggerType: "Manual SOS Button"
    }
  ],
  messages: [
    { senderId: "ramesh_electrician", receiverId: "user", content: "Hello! I saw your booking request for tomorrow at 10 AM. I will arrive with my toolkit. Please share any details of the short-circuit problem.", timestamp: "2026-07-05T21:30:00Z" }
  ],
  corporateGigs: [
    { id: "g1", brand: "Toyota Dealership Showroom", title: "Automobile Diagnostic Consultant", rate: 800, duration: "6 Months Contract", location: "Toyota Premium Central", desc: "Require an Mechanical/Automobile Graduate to perform advanced OBD-II scanner calibrations, hybrid power split device debugging, and diagnostic training.", icon: "fa-car" },
    { id: "g2", brand: "Honda Energy Tech Centre", title: "EV Battery System Specialist", rate: 1000, duration: "12 Months Contract", location: "Honda Tech Park", desc: "Oversee EV battery diagnostics, BMS troubleshooting, and thermal runtime integrity validations. B.Tech / Diploma Electrical preferred.", icon: "fa-bolt" },
    { id: "g3", brand: "Suzuki Smart Integration", title: "IoT Distribution Grid Lead", rate: 650, duration: "3 Months Contract", location: "Suzuki Dealership South", desc: "Configure smart home mesh distribution nodes, solar hybrid backup connections, and EV charger docks. Advanced degree certification required.", icon: "fa-network-wired" }
  ]
};

// --- Application State ---
let isOfflineMode = false;
let state = {
  isLoggedIn: false,
  currentUser: {},
  workers: [],
  showroomServices: [],
  bookings: [],
  courses: [],
  sosAlerts: [],
  messages: [],
  activeView: "workers",
  selectedCategory: "all",
  activeShowroomTab: "Bike",
  scannedPartId: "honda_oil",
  sosTimerValue: 3,
  activeSOSInterval: null,
  activeQuizCourseId: null,
  selectedQuizAnswers: [],
  activeChatId: null,
  filters: {
    search: "",
    experience: "all",
    approval: "all",
    guarantee: "all",
    price: 999,
    pro: "all"
  }
};

// --- Local Storage Database Helper ---
function getLocalDB() {
  const db = localStorage.getItem('fixelite_db');
  if (!db) {
    localStorage.setItem('fixelite_db', JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  }
  try {
    return JSON.parse(db);
  } catch (e) {
    localStorage.setItem('fixelite_db', JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  }
}

function saveLocalDB(data) {
  localStorage.setItem('fixelite_db', JSON.stringify(data));
}

// --- Connection UI Status Updater ---
function updateStatusUI(online) {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const tag = document.getElementById('status-mode-tag');

  if (online) {
    if (dot) dot.className = "status-dot online";
    if (text) text.textContent = "SECURE SERVER ACTIVE";
    if (tag) {
      tag.textContent = "CONNECTED MODE";
      tag.style.background = "var(--color-success-glow)";
      tag.style.borderColor = "var(--color-success)";
    }
  } else {
    if (dot) dot.className = "status-dot offline";
    if (text) text.textContent = "LOCAL SANDBOX ENGINE ACTIVE";
    if (tag) {
      tag.textContent = "SANDBOX MODE";
      tag.style.background = "var(--color-primary-glow)";
      tag.style.borderColor = "var(--color-primary)";
    }
  }
}

function enableOfflineMode() {
  if (!isOfflineMode) {
    isOfflineMode = true;
    updateStatusUI(false);
  }
}

// --- API Service Layer with Sandbox Fallback ---
async function fetchCurrentUser() {
  if (isOfflineMode) return getLocalDB().currentUser;
  try {
    const res = await fetch(`${API_BASE}/me`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return fetchCurrentUser();
  }
}

async function saveCurrentUser(profile) {
  if (isOfflineMode) {
    const db = getLocalDB();
    db.currentUser = { ...db.currentUser, ...profile };
    db.currentUser.avatar = db.currentUser.name ? db.currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase() : "AJ";
    saveLocalDB(db);
    return db.currentUser;
  }
  try {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return saveCurrentUser(profile);
  }
}

async function registerAsWorker(details) {
  if (isOfflineMode) {
    const db = getLocalDB();
    const newWorker = {
      id: "worker_" + Date.now(),
      name: db.currentUser.name,
      category: details.category || "electrician",
      role: (details.category || "Electrician").charAt(0).toUpperCase() + (details.category || "electrician").slice(1) + " Expert",
      experience: details.experience || "1 Year",
      education: details.education || "Diploma Certificate",
      bio: details.bio || "Registered professional worker ready to assist.",
      avatar: db.currentUser.avatar,
      phone: db.currentUser.phone || "+91 98000 00000",
      rating: 5.0,
      distance: 1.2,
      hourlyRate: parseInt(details.hourlyRate) || 150,
      approved: false,
      guaranteed: false,
      licenseNumber: details.licenseNumber || "PENDING-" + Math.floor(Math.random() * 900 + 100)
    };
    db.workers.push(newWorker);
    
    db.currentUser.role = "Worker";
    db.currentUser.isWorkerApproved = false;
    db.currentUser.licenseNumber = newWorker.licenseNumber;
    db.currentUser.education = newWorker.education;
    db.currentUser.experience = newWorker.experience;
    db.currentUser.category = newWorker.category;
    db.currentUser.hourlyRate = newWorker.hourlyRate;
    
    saveLocalDB(db);
    return { success: true, worker: newWorker };
  }
  try {
    const res = await fetch(`${API_BASE}/workers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return registerAsWorker(details);
  }
}

async function simulateApproveWorker(workerId) {
  if (isOfflineMode) {
    const db = getLocalDB();
    const worker = db.workers.find(w => w.id === workerId);
    if (worker) {
      worker.approved = true;
      worker.guaranteed = true;
      if (db.currentUser.licenseNumber === worker.licenseNumber) {
        db.currentUser.isWorkerApproved = true;
      }
      saveLocalDB(db);
      return { success: true, worker };
    }
    return { error: "Not found" };
  }
  try {
    const res = await fetch(`${API_BASE}/workers/${workerId}/approve`, { method: 'POST' });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return simulateApproveWorker(workerId);
  }
}

async function fetchWorkers() {
  if (isOfflineMode) return getLocalDB().workers;
  try {
    const res = await fetch(`${API_BASE}/workers`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return fetchWorkers();
  }
}

async function fetchBookings() {
  if (isOfflineMode) return getLocalDB().bookings;
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return fetchBookings();
  }
}

async function createBooking(bookingData) {
  if (isOfflineMode) {
    const db = getLocalDB();
    let newBooking = {};
    const { type, entityId, date, time } = bookingData;
    
    if (type === 'worker') {
      const worker = db.workers.find(w => w.id === entityId);
      newBooking = {
        id: "b_" + Date.now(),
        type: "worker",
        entityId,
        entityName: worker.name,
        category: worker.category.charAt(0).toUpperCase() + worker.category.slice(1),
        price: worker.hourlyRate,
        date,
        time,
        status: "Confirmed"
      };
      
      db.messages.push({
        senderId: worker.id,
        receiverId: "user",
        content: `Hello! I have accepted your booking for ${date} at ${time}. I will review your requirements and reach your location. Please let me know what needs to be fixed!`,
        timestamp: new Date().toISOString()
      });
    } else {
      const service = db.showroomServices.find(s => s.id === entityId);
      newBooking = {
        id: "b_" + Date.now(),
        type: "showroom",
        entityId,
        entityName: service.brand,
        category: service.title,
        price: service.price,
        date,
        time,
        status: "Confirmed"
      };
    }
    
    db.bookings.push(newBooking);
    saveLocalDB(db);
    return newBooking;
  }
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return createBooking(bookingData);
  }
}

async function fetchCourses() {
  if (isOfflineMode) return getLocalDB().courses;
  try {
    const res = await fetch(`${API_BASE}/courses`);
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return fetchCourses();
  }
}

async function submitQuiz(courseId, answers) {
  if (isOfflineMode) {
    const db = getLocalDB();
    const course = db.courses.find(c => c.id === courseId);
    let correctCount = 0;
    course.quiz.questions.forEach((q, idx) => {
      if (answers && answers[idx] === q.answer) correctCount++;
    });
    const passed = correctCount === course.quiz.questions.length;
    let skillBadge = "";
    if (passed) {
      skillBadge = courseId === 'ev_basics' ? 'Certified EV Diagnostics' : 'Smart IoT Technician';
      if (!db.currentUser.skills.includes(skillBadge)) {
        db.currentUser.skills.push(skillBadge);
      }
      saveLocalDB(db);
    }
    return { passed, correctCount, total: course.quiz.questions.length, skillBadge };
  }
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return submitQuiz(courseId, answers);
  }
}

async function triggerSOSAlert(location, triggerType) {
  if (isOfflineMode) {
    const db = getLocalDB();
    const newSOS = {
      id: "sos_" + Date.now(),
      timestamp: new Date().toISOString(),
      location: location || "Simulated Accident Site",
      status: "Broadcasting (Responders & Nearby Mechanics Alerted)",
      triggerType: triggerType || "Accident Sensor Trigger"
    };
    db.sosAlerts.unshift(newSOS);
    saveLocalDB(db);
    return newSOS;
  }
  try {
    const res = await fetch(`${API_BASE}/sos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, triggerType })
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return triggerSOSAlert(location, triggerType);
  }
}

async function fetchSOSAlerts() {
  if (isOfflineMode) return getLocalDB().sosAlerts;
  try {
    const res = await fetch(`${API_BASE}/sos`);
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return fetchSOSAlerts();
  }
}

async function fetchMessages(otherId) {
  if (isOfflineMode) {
    const db = getLocalDB();
    return db.messages.filter(m =>
      (m.senderId === "user" && m.receiverId === otherId) ||
      (m.senderId === otherId && m.receiverId === "user")
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  try {
    const res = await fetch(`${API_BASE}/messages/${otherId}`);
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return fetchMessages(otherId);
  }
}

async function sendMessage(receiverId, content) {
  if (isOfflineMode) {
    const db = getLocalDB();
    const msg = {
      senderId: "user",
      receiverId,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };
    db.messages.push(msg);
    
    // Auto simulated bot response after a delay
    const worker = db.workers.find(w => w.id === receiverId);
    if (worker) {
      setTimeout(() => {
        const localDb = getLocalDB();
        localDb.messages.push({
          senderId: receiverId,
          receiverId: "user",
          content: `Thank you for the message. I will assist you with the booking.`,
          timestamp: new Date().toISOString()
        });
        saveLocalDB(localDb);
        if (state.activeChatId === receiverId) renderChatConversation();
      }, 1500);
    }
    
    saveLocalDB(db);
    return msg;
  }
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId, content })
    });
    return await res.json();
  } catch (e) {
    enableOfflineMode();
    return sendMessage(receiverId, content);
  }
}

// --- Check Backend Live Connection ---
async function checkServerConnection() {
  try {
    const res = await fetch(`${API_BASE}/me`, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      isOfflineMode = false;
      updateStatusUI(true);
    } else {
      throw new Error();
    }
  } catch (e) {
    isOfflineMode = true;
    updateStatusUI(false);
  }
}

// --- App State Syncer ---
async function syncAppState() {
  state.currentUser = await fetchCurrentUser();
  state.workers = await fetchWorkers();
  state.bookings = await fetchBookings();
  state.courses = await fetchCourses();
  state.sosAlerts = await fetchSOSAlerts();
  
  // Update logged-in state based on whether currentUser has a name
  const navBar = document.querySelector('.app-nav-bar');
  const sosHeader = document.getElementById('header-sos-trigger');
  
  if (state.currentUser && state.currentUser.name && state.currentUser.name.trim() !== "") {
    state.isLoggedIn = true;
    if (navBar) navBar.classList.remove('hidden-nav');
    if (sosHeader) sosHeader.style.display = 'inline-block';
  } else {
    state.isLoggedIn = false;
    if (navBar) navBar.classList.add('hidden-nav');
    if (sosHeader) sosHeader.style.display = 'none';
  }
  
  // Render general layout settings
  updateProfileUI();
}

// --- CLOCK AND FRAME TOGGLERS ---
function initAppChrome() {
  // Update mock digital clock in notch
  const clockEl = document.getElementById('sim-clock');
  const updateClock = () => {
    const d = new Date();
    let min = d.getMinutes();
    let hr = d.getHours();
    if (min < 10) min = "0" + min;
    if (clockEl) clockEl.textContent = `${hr}:${min}`;
  };
  updateClock();
  setInterval(updateClock, 30000);

  // Desktop Simulator Frame toggle
  const wrapperBtn = document.getElementById('btn-toggle-frame');
  const container = document.getElementById('phone-container');
  const toggleText = document.getElementById('frame-toggle-text');
  if (wrapperBtn && container) {
    wrapperBtn.addEventListener('click', () => {
      container.classList.toggle('fullscreen-mode');
      if (container.classList.contains('fullscreen-mode')) {
        toggleText.textContent = "Toggle Simulator Mode (Phone Frame)";
      } else {
        toggleText.textContent = "Toggle Desktop Mode (Full Screen)";
      }
    });
  }
}

// --- ROUTER VIEW SWITCHING ---
function initViewRouter() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetView = tab.getAttribute('data-view');
      navigateToView(targetView);
    });
  });
  
  // Quick SOS header button triggers views
  const headerSos = document.getElementById('header-sos-trigger');
  if (headerSos) {
    headerSos.addEventListener('click', () => {
      navigateToView('sos');
    });
  }
}

function navigateToView(viewName) {
  if (!state.isLoggedIn && viewName !== 'login') {
    viewName = 'login';
  }
  state.activeView = viewName;
  
  // Update tabs active state
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-view') === viewName) {
      tab.classList.add('active');
    }
  });

  // Switch display elements
  document.querySelectorAll('.content-view').forEach(view => {
    view.classList.remove('active');
  });
  const viewEl = document.getElementById(`view-${viewName}`);
  if (viewEl) viewEl.classList.add('active');
  
  // Trigger specific renders
  if (viewName === 'login') {
    stopSirenSound();
    stopDialTone();
  }
  else if (viewName === 'workers') renderWorkersList();
  else if (viewName === 'showroom') renderShowrooms();
  else if (viewName === 'sos') renderSOSLogs();
  else if (viewName === 'academy') renderAcademyCourses();
  else if (viewName === 'chat') renderChatWorkspace();
  else if (viewName === 'profile') populateProfileDashboard();
}

// --- VIEW 1: WORKERS DISCOVERY SERVICES ---
function initWorkersFilterLogic() {
  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.selectedCategory = pill.getAttribute('data-category');
      renderWorkersList();
    });
  });

  // Filter drawer toggle
  const filterBtn = document.getElementById('btn-filters-toggle');
  const drawer = document.getElementById('filter-drawer');
  if (filterBtn && drawer) {
    filterBtn.addEventListener('click', () => {
      drawer.classList.toggle('active');
      filterBtn.classList.toggle('active');
    });
  }

  // Filter change actions
  const selectExp = document.getElementById('filter-experience');
  const selectAppr = document.getElementById('filter-approval');
  const selectGuar = document.getElementById('filter-guarantee');
  const selectPrice = document.getElementById('filter-price');
  const selectPro = document.getElementById('filter-pro');
  const inputSearch = document.getElementById('worker-search');

  const onFilterChange = () => {
    state.filters = {
      search: inputSearch.value,
      experience: selectExp.value,
      approval: selectAppr.value,
      guarantee: selectGuar.value,
      price: parseInt(selectPrice.value) || 999,
      pro: selectPro ? selectPro.value : "all"
    };
    renderWorkersList();
  };

  if (selectExp) selectExp.addEventListener('change', onFilterChange);
  if (selectAppr) selectAppr.addEventListener('change', onFilterChange);
  if (selectGuar) selectGuar.addEventListener('change', onFilterChange);
  if (selectPrice) selectPrice.addEventListener('change', onFilterChange);
  if (selectPro) selectPro.addEventListener('change', onFilterChange);
  if (inputSearch) inputSearch.addEventListener('input', onFilterChange);
}

async function renderWorkersList() {
  const container = document.getElementById('workers-list');
  if (!container) return;
  
  state.workers = await fetchWorkers();
  let list = [...state.workers];

  // 1. Filter Category
  if (state.selectedCategory !== 'all') {
    list = list.filter(w => w.category === state.selectedCategory);
  }

  // 2. Filter Search input
  if (state.filters.search.trim() !== '') {
    const q = state.filters.search.toLowerCase();
    list = list.filter(w =>
      w.name.toLowerCase().includes(q) ||
      w.role.toLowerCase().includes(q) ||
      w.bio.toLowerCase().includes(q) ||
      w.education.toLowerCase().includes(q)
    );
  }

  // 3. Filter Experience Years
  if (state.filters.experience !== 'all') {
    const minYears = parseInt(state.filters.experience);
    list = list.filter(w => parseInt(w.experience) >= minYears);
  }

  // 4. Filter Government Approval
  if (state.filters.approval === 'approved') {
    list = list.filter(w => w.approved === true);
  }

  // 5. Filter Guarantee status
  if (state.filters.guarantee === 'guaranteed') {
    list = list.filter(w => w.guaranteed === true);
  }

  // 6. Filter Max Price rate
  list = list.filter(w => w.hourlyRate <= state.filters.price);

  // 6b. Filter Pro Tiers
  if (state.filters.pro === 'pro') {
    list = list.filter(w => w.isElitePro === true);
  }

  container.innerHTML = '';
  
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px;" class="text-muted">
        <i class="fa-solid fa-users-slash" style="font-size:32px; display:block; margin-bottom:8px;"></i>
        <p>No workers match your filter criteria. Try adjusting filters.</p>
      </div>
    `;
    return;
  }

  list.forEach(worker => {
    const card = document.createElement('div');
    card.className = worker.isElitePro ? 'glass-card worker-card elite-pro-card' : 'glass-card worker-card';
    
    // Badges block
    let badgesHTML = '';
    if (worker.isElitePro) {
      badgesHTML += `<span class="badge badge-elite"><i class="fa-solid fa-crown"></i> Elite Pro</span> `;
    }
    if (worker.approved) {
      badgesHTML += `<span class="badge badge-approved"><i class="fa-solid fa-shield-check"></i> Approved ID</span> `;
    } else {
      badgesHTML += `<span class="badge badge-pending"><i class="fa-solid fa-hourglass-start"></i> Pending Review</span> `;
    }
    if (worker.guaranteed) {
      badgesHTML += `<span class="badge badge-guaranteed"><i class="fa-solid fa-handshake"></i> Guaranteed Rate</span> `;
    }

    card.innerHTML = `
      <div class="worker-card-header">
        <div class="worker-avatar" style="${worker.isElitePro ? 'background: linear-gradient(135deg, #facc15, #ca8a04);' : ''}">${worker.avatar}</div>
        <div class="worker-meta">
          <h3>${worker.name} ${worker.isElitePro ? '<i class="fa-solid fa-crown" style="color:#facc15; font-size:11px; margin-left:2px;" title="Elite Pro Consultant"></i>' : ''}</h3>
          <p>${worker.role} • ${worker.experience} Exp</p>
        </div>
        <div class="worker-stats">
          <div class="worker-price" style="${worker.isElitePro ? 'color:#facc15;' : ''}">₹${worker.hourlyRate}/hr</div>
          <div class="worker-dist">${worker.distance} km away</div>
        </div>
      </div>
      <div class="worker-badges-row">${badgesHTML}</div>
      <p class="worker-bio">${worker.bio}</p>
      <div style="font-size:10px; color: var(--text-dark);">
        <i class="fa-solid fa-graduation-cap"></i> ${worker.education}
      </div>
      <div class="worker-card-footer">
        <button class="btn btn-secondary" onclick="openChatFromWorker('${worker.id}')">
          <i class="fa-solid fa-comments"></i> Chat
        </button>
        <button class="btn btn-primary" onclick="openBookingModal('worker', '${worker.id}', '${worker.name}', '₹${worker.hourlyRate}/hr')">
          Book Service
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- VIEW 2: SHOWROOM BOOKINGS ---
function initShowroomTabs() {
  const tabs = document.querySelectorAll('.showroom-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.activeShowroomTab = tab.getAttribute('data-vehicle');
      renderShowrooms();
    });
  });
}

function renderShowrooms() {
  const container = document.getElementById('showroom-dealers-list');
  if (!container) return;
  
  const seedServices = DEFAULT_DB.showroomServices; // using local seed config lists
  const filtered = seedServices.filter(s => s.vehicle === state.activeShowroomTab);
  
  container.innerHTML = '';
  
  filtered.forEach(service => {
    const card = document.createElement('div');
    card.className = 'glass-card showroom-card';
    card.innerHTML = `
      <div class="showroom-card-header">
        <span class="showroom-brand">${service.brand}</span>
        <span class="badge badge-guaranteed"><i class="fa-solid fa-circle-check"></i> Standard Dealership</span>
      </div>
      <h3 class="showroom-title">${service.title}</h3>
      <p class="showroom-desc">${service.desc}</p>
      <div class="showroom-price-row">
        <span style="font-size:13.5px; font-weight:800; color:var(--text-main);">₹${service.price} all incl.</span>
        <button class="btn btn-cyan" onclick="openBookingModal('showroom', '${service.id}', '${service.brand} - ${service.title}', '₹${service.price}')">
          Schedule Service
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- BOOKING MODAL MANAGER ---
function openBookingModal(type, id, name, priceText) {
  const modal = document.getElementById('booking-modal');
  const modalTitle = document.getElementById('booking-modal-title');
  const inputId = document.getElementById('booking-entity-id');
  const inputType = document.getElementById('booking-entity-type');
  const inputName = document.getElementById('booking-entity-name');
  const inputPrice = document.getElementById('booking-entity-price');
  
  if (modalTitle) modalTitle.textContent = type === 'worker' ? 'Book Local Worker' : 'Schedule Showroom Service';
  if (inputId) inputId.value = id;
  if (inputType) inputType.value = type;
  if (inputName) inputName.value = name;
  if (inputPrice) inputPrice.value = priceText;
  
  // Set default tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = document.getElementById('booking-date');
  if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];

  if (modal) modal.classList.add('active');
}

function initBookingModalLogic() {
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('btn-close-booking');
  const form = document.getElementById('form-booking-submit');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const entityId = document.getElementById('booking-entity-id').value;
      const type = document.getElementById('booking-entity-type').value;
      const date = document.getElementById('booking-date').value;
      const time = document.getElementById('booking-time').value;

      try {
        await createBooking({ type, entityId, date, time });
        if (modal) modal.classList.remove('active');
        
        // Show simulated toast alert
        alert(`Success! Service booked for ${date} at ${time}.`);
        
        // Refresh bookings and navigate
        await syncAppState();
        navigateToView('profile');
      } catch (err) {
        console.error(err);
      }
    });
  }
}

// --- VIEW 3: AI SCANNER SPARE PART VERIFIER ---
function initAIScannerLogic() {
  const scanBtn = document.getElementById('btn-start-scan');
  const testPartBtns = document.querySelectorAll('.scanner-test-parts button');
  const laser = document.getElementById('scanner-laser');
  const instructions = document.getElementById('scanner-instructions');
  const mockIcon = document.getElementById('qr-mock-icon');
  const reportCard = document.getElementById('ai-report-card');

  // Switch test scan profiles
  testPartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      testPartBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.scannedPartId = btn.getAttribute('data-part');
      // Hide previous report
      if (reportCard) reportCard.style.display = 'none';
    });
  });

  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      // Clean previous UI
      if (reportCard) reportCard.style.display = 'none';
      if (instructions) instructions.textContent = "Connecting to AI Core Neural API database...";
      if (mockIcon) {
        mockIcon.className = "fa-solid fa-network-wired text-cyan fa-spin";
      }
      
      // Start Sweep line animation
      if (laser) laser.style.display = 'block';
      scanBtn.disabled = true;

      // Simulate network verification analysis timeline
      setTimeout(() => {
        // Complete Scan sweep
        if (laser) laser.style.display = 'none';
        scanBtn.disabled = false;
        if (instructions) instructions.textContent = "Scan Complete. AI verification details below:";
        if (mockIcon) mockIcon.className = "fa-solid fa-square-check text-success";
        
        // Process AI validation based on test selections
        displayAIReport();
      }, 2000);
    });
  }
}

function displayAIReport() {
  const reportCard = document.getElementById('ai-report-card');
  const title = document.getElementById('report-part-name');
  const badge = document.getElementById('report-badge');
  const manufacturer = document.getElementById('report-manufacturer');
  const serial = document.getElementById('report-serial');
  const hash = document.getElementById('report-hash');
  const desc = document.getElementById('report-ai-text');

  if (!reportCard) return;

  reportCard.style.display = 'block';

  if (state.scannedPartId === 'honda_oil') {
    reportCard.classList.remove('fake-detected');
    if (title) title.textContent = "Honda Engine Oil Filter (OEM)";
    if (badge) {
      badge.textContent = "Authentic OEM Part";
      badge.className = "badge badge-approved";
    }
    if (manufacturer) manufacturer.textContent = "Honda Motor Co., Ltd. (Tokyo, JP)";
    if (serial) serial.textContent = "HN-78923-OIL-G1";
    if (hash) hash.textContent = "0x8FA43E77BDAC21DE";
    if (desc) desc.textContent = "AI verified 3D micro-engraved serial code structure. Signature cryptographic holograms match production block registers on Honda Logistics Server.";
  } else if (state.scannedPartId === 'suzuki_cable') {
    reportCard.classList.remove('fake-detected');
    if (title) title.textContent = "Suzuki Brake Cable assembly";
    if (badge) {
      badge.textContent = "Authentic OEM Part";
      badge.className = "badge badge-approved";
    }
    if (manufacturer) manufacturer.textContent = "Suzuki Motor Corporation";
    if (serial) serial.textContent = "SZ-BC-55210";
    if (hash) hash.textContent = "0x2C4B7E0011FFA9D2";
    if (desc) desc.textContent = "Tested metallic flexibility tensile index from manufacturing specs database. Part corresponds to factory batch #2026-A.";
  } else {
    // Fake / Counterfeit detected
    reportCard.classList.add('fake-detected');
    if (title) title.textContent = "Denso Spark Plug (K20PR-U)";
    if (badge) {
      badge.textContent = "SUSPICIOUS / COUNTERFEIT DETECTED";
      badge.className = "badge badge-pending"; // displays amber/danger
      badge.style.background = "rgba(244,63,94,0.15)";
      badge.style.border = "1px solid var(--color-danger)";
      badge.style.color = "var(--color-danger)";
    }
    if (manufacturer) manufacturer.textContent = "Unknown Manufacturer (Generic replica)";
    if (serial) serial.textContent = "DS-K20PRU-CLONE";
    if (hash) hash.textContent = "UNREGISTERED HASH SIGNATURE";
    if (desc) desc.textContent = "CRITICAL WARNING: The QR structure matches unregistered codes. Ceramic sleeve insulation density test failed visual micro-contour anomalies audit. Plugs could trigger engine block misfires.";
  }
}

// --- VIEW 4: EMERGENCY SOS & ACCIDENT DETECTOR ---
// --- VIEW 4: EMERGENCY SOS & ACCIDENT DETECTOR ---
function initEmergencySOSLogic() {
  const sosBtn = document.getElementById('sos-big-button');
  const countdownPanel = document.getElementById('sos-countdown-panel');
  const timerText = document.getElementById('sos-timer-seconds');
  const cancelBtn = document.getElementById('btn-cancel-sos');
  const crashBtn = document.getElementById('btn-trigger-crash');

  // 108 Call UI Elements
  const callOverlay = document.getElementById('call-overlay');
  const callStatusText = document.getElementById('call-status');
  const callTimerText = document.getElementById('call-timer');
  const callLogBox = document.getElementById('call-log-box');
  const btnHangup = document.getElementById('btn-hangup-call');

  let callTimeElapsed = 0;
  let callTimerInterval = null;
  let speakTimeouts = [];

  const startSOSCountdown = (triggerType) => {
    // Clean previous timers
    if (state.activeSOSInterval) {
      clearInterval(state.activeSOSInterval);
    }
    
    // Set titles appropriately
    const panelTitle = countdownPanel.querySelector('h4');
    if (triggerType.includes('Accident')) {
      panelTitle.textContent = "ACCIDENT CRASH DETECTED! DIALING 108 IN";
      state.sosTimerValue = 5; // 5 seconds warning countdown for crash calls
    } else {
      panelTitle.textContent = "EMERGENCY SOS INITIATING";
      state.sosTimerValue = 3;
    }
    
    if (timerText) timerText.textContent = state.sosTimerValue;
    if (countdownPanel) countdownPanel.style.display = 'flex';
    if (sosBtn) sosBtn.classList.add('active');

    // Initial warning beep
    playWarnBeep();

    state.activeSOSInterval = setInterval(async () => {
      state.sosTimerValue--;
      if (timerText) timerText.textContent = state.sosTimerValue;
      
      // Warning tick sound
      playWarnBeep();
      
      if (state.sosTimerValue <= 0) {
        clearInterval(state.activeSOSInterval);
        state.activeSOSInterval = null;
        if (countdownPanel) countdownPanel.style.display = 'none';
        if (sosBtn) sosBtn.classList.remove('active');
        
        // Execute SOS broadcast
        try {
          const alertObj = await triggerSOSAlert(
            "G-Road High Speed Highway (19.0760° N, 72.8777° E)",
            triggerType
          );
          
          await syncAppState();
          renderSOSLogs();
          
          if (triggerType.includes('Accident')) {
            // Trigger Automatic 108 Calling Screen Overlay
            trigger108EmergencyCall();
          } else {
            // Play continuous manual SOS siren sound
            startSirenSound();
            alert(`EMERGENCY SOS SENT! Broadcasting coordinates to Ambulance Dispatch and nearby workers. (Siren alarm active. Press CANCEL to stop alarm).`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, 1000);
  };

  const trigger108EmergencyCall = () => {
    // Show 108 Call Overlay
    if (callOverlay) {
      callOverlay.style.display = 'flex';
      callOverlay.style.animation = 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
    
    if (callStatusText) {
      callStatusText.textContent = "Dialing...";
      callStatusText.classList.remove('active-call');
    }
    if (callTimerText) callTimerText.textContent = "00:00";
    if (callLogBox) callLogBox.innerHTML = '';
    
    // Play telephone connection tones
    startDialTone();
    
    // Simulate connection delay of 2.5 seconds
    const connectionTimeout = setTimeout(() => {
      stopDialTone();
      playSuccessSound(); // chime pickup sound
      
      if (callStatusText) {
        callStatusText.textContent = "Connected";
        callStatusText.classList.add('active-call');
      }
      
      // Start call clock
      callTimeElapsed = 0;
      callTimerInterval = setInterval(() => {
        callTimeElapsed++;
        let min = Math.floor(callTimeElapsed / 60);
        let sec = callTimeElapsed % 60;
        if (min < 10) min = "0" + min;
        if (sec < 10) sec = "0" + sec;
        if (callTimerText) callTimerText.textContent = `${min}:${sec}`;
      }, 1000);

      // Stream call dialogue transcription
      const addLog = (speaker, text, styleClass) => {
        if (!callLogBox) return;
        const entry = document.createElement('div');
        entry.className = `log-entry ${styleClass}`;
        entry.innerHTML = `<strong>${speaker}:</strong> ${text}`;
        callLogBox.appendChild(entry);
        callLogBox.scrollTop = callLogBox.scrollHeight;
      };

      // 0s log: Dispatcher
      addLog("108 Dispatcher", "Emergency call received. Ambulance Dispatch Central, what is your location?", "dispatcher");
      playWarnBeep(); // dispatcher radio sound

      // 3.5s log: Automated Accident telemetry
      const t1 = setTimeout(() => {
        const username = state.currentUser ? state.currentUser.name : "Alex Johnson";
        addLog("AI Accident Sensor", `CRASH DETECTED. Telemetry: Deceleration impact of 9.8G registered. Vehicle Owner: ${username}. Coordinates: G-Road High Speed Highway (19.0760° N, 72.8777° E). Sending GPS map data now...`, "car-system");
        playWarnBeep();
      }, 3500);
      speakTimeouts.push(t1);

      // 7.5s log: Dispatcher response
      const t2 = setTimeout(() => {
        addLog("108 Dispatcher", "Coordinates received and mapped. Dispatching emergency trauma ambulance and highway patrol rescue. En route immediately. ETA 4 minutes. Please stay on the line.", "dispatcher");
        playWarnBeep();
      }, 7500);
      speakTimeouts.push(t2);

      // 11s log: AI confirmation
      const t3 = setTimeout(() => {
        addLog("System Telemetry", "Emergency dispatch route locked. Direct phone line active.", "car-system");
        playWarnBeep();
      }, 11000);
      speakTimeouts.push(t3);
      
    }, 2500);
    
    speakTimeouts.push(connectionTimeout);
  };

  const hangUpEmergencyCall = () => {
    stopDialTone();
    stopSirenSound();
    
    if (callTimerInterval) {
      clearInterval(callTimerInterval);
      callTimerInterval = null;
    }
    
    speakTimeouts.forEach(t => clearTimeout(t));
    speakTimeouts = [];
    
    if (callOverlay) callOverlay.style.display = 'none';
    alert("Emergency call ended. Dispatch logs successfully archived on server.");
  };

  if (sosBtn) {
    sosBtn.addEventListener('click', () => {
      // Toggle manual SOS
      if (activeSirenOsc1 || activeSirenOsc2) {
        stopSirenSound();
        alert("Emergency Alarm siren stopped.");
      } else {
        startSOSCountdown('Manual SOS Button');
      }
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (state.activeSOSInterval) {
        clearInterval(state.activeSOSInterval);
        state.activeSOSInterval = null;
      }
      stopSirenSound();
      if (countdownPanel) countdownPanel.style.display = 'none';
      if (sosBtn) sosBtn.classList.remove('active');
      alert("SOS Alert sequence aborted.");
    });
  }

  if (crashBtn) {
    crashBtn.addEventListener('click', () => {
      startSOSCountdown('Automatic Accident Deceleration Sensor');
    });
  }

  if (btnHangup) {
    btnHangup.addEventListener('click', () => {
      hangUpEmergencyCall();
    });
  }
}

async function renderSOSLogs() {
  const container = document.getElementById('sos-ticker');
  if (!container) return;
  
  state.sosAlerts = await fetchSOSAlerts();
  container.innerHTML = '';
  
  state.sosAlerts.forEach(sos => {
    const item = document.createElement('div');
    item.className = 'ticker-item';
    
    const formattedTime = new Date(sos.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    item.innerHTML = `
      <div class="ticker-header">
        <span><i class="fa-solid fa-triangle-exclamation text-danger"></i> Alert Event: ${sos.triggerType}</span>
        <span>${formattedTime}</span>
      </div>
      <div style="font-weight:600; font-size:10px; color:white; margin:2px 0;">Location: ${sos.location}</div>
      <div class="text-success" style="font-size:9.5px; font-weight:700;"><i class="fa-solid fa-truck-medical"></i> ${sos.status}</div>
    `;
    container.appendChild(item);
  });
}

// --- VIEW 5: WORKERS ACADEMY (EDUCATION MODULE) ---
async function renderAcademyCourses() {
  const container = document.getElementById('academy-courses-list');
  if (!container) return;
  
  state.courses = await fetchCourses();
  container.innerHTML = '';
  
  state.courses.forEach(course => {
    const card = document.createElement('div');
    card.className = 'glass-card course-card';
    
    let lessonItemsHTML = '';
    course.lessons.forEach(l => {
      lessonItemsHTML += `<li><i class="fa-regular fa-circle-play"></i> ${l.title} (${l.time})</li>`;
    });
    
    // Check if skill badge is already earned
    const isCompleted = state.currentUser.skills.includes(course.id === 'ev_basics' ? 'Certified EV Diagnostics' : 'Smart IoT Technician');
    
    const actionBtnHTML = isCompleted 
      ? `<button class="btn btn-secondary btn-block" disabled><i class="fa-solid fa-award text-success"></i> Course Certified</button>`
      : `<button class="btn btn-primary btn-block" onclick="startCourseQuiz('${course.id}')"><i class="fa-solid fa-pencil"></i> Start Upskill Quiz</button>`;

    card.innerHTML = `
      <div class="course-meta-tags">
        <span><i class="fa-solid fa-clock"></i> ${course.duration}</span>
        <span>•</span>
        <span><i class="fa-solid fa-graduation-cap"></i> ${course.difficulty}</span>
      </div>
      <h3 class="course-title">${course.title}</h3>
      <p class="course-desc">${course.description}</p>
      <div style="margin: 8px 0;">
        <span style="font-size:10px; font-weight:700; color:var(--text-dark);">CURRICULUM LESSONS:</span>
        <ul class="course-lessons-list">${lessonItemsHTML}</ul>
      </div>
      ${actionBtnHTML}
    `;
    container.appendChild(card);
  });
}

function startCourseQuiz(courseId) {
  state.activeQuizCourseId = courseId;
  state.selectedQuizAnswers = [];
  
  const drawer = document.getElementById('quiz-drawer');
  const titleEl = document.getElementById('quiz-course-title');
  const questionsContainer = document.getElementById('quiz-questions-container');
  
  const course = state.courses.find(c => c.id === courseId);
  if (!course || !drawer || !questionsContainer) return;
  
  if (titleEl) titleEl.textContent = `Quiz: ${course.title}`;
  
  // Render quiz questions
  questionsContainer.innerHTML = '';
  course.quiz.questions.forEach((q, qIdx) => {
    const qBlock = document.createElement('div');
    qBlock.style.marginBottom = '12px';
    
    let optionsHTML = '';
    q.options.forEach((opt, oIdx) => {
      optionsHTML += `
        <div class="quiz-option-item" data-question="${qIdx}" data-option="${oIdx}" onclick="selectQuizOption(${qIdx}, ${oIdx}, this)">
          ${opt}
        </div>
      `;
    });
    
    qBlock.innerHTML = `
      <h4 class="quiz-question-title">Q${qIdx + 1}: ${q.q}</h4>
      <div class="quiz-options-list">${optionsHTML}</div>
    `;
    questionsContainer.appendChild(qBlock);
  });
  
  drawer.classList.add('active');
}

function selectQuizOption(qIdx, oIdx, element) {
  // Deselect previous options in this question block
  const parent = element.parentElement;
  parent.querySelectorAll('.quiz-option-item').forEach(opt => {
    opt.classList.remove('selected');
  });
  element.classList.add('selected');
  
  state.selectedQuizAnswers[qIdx] = oIdx;
}

function initQuizLogic() {
  const drawer = document.getElementById('quiz-drawer');
  const closeBtn = document.getElementById('btn-close-quiz');
  const submitBtn = document.getElementById('btn-submit-quiz');

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('active');
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const course = state.courses.find(c => c.id === state.activeQuizCourseId);
      if (!course) return;
      
      // Ensure all questions are answered
      if (state.selectedQuizAnswers.length < course.quiz.questions.length || state.selectedQuizAnswers.includes(undefined)) {
        alert("Please answer all questions before submitting.");
        return;
      }

      try {
        const result = await submitQuiz(state.activeQuizCourseId, state.selectedQuizAnswers);
        if (drawer) drawer.classList.remove('active');
        
        if (result.passed) {
          alert(`Congratulations! You passed the quiz (${result.correctCount}/${result.total}) and earned the badge: "${result.skillBadge}". This has been added to your profile.`);
        } else {
          alert(`Quiz Failed (${result.correctCount}/${result.total}). Please review course content and try again.`);
        }
        
        await syncAppState();
        renderAcademyCourses();
        updateProfileUI();
      } catch (err) {
        console.error(err);
      }
    });
  }
}

// --- VIEW 6: CHAT & INBOX SYSTEMS ---
async function renderChatWorkspace() {
  const threadContainer = document.getElementById('chat-threads-list');
  const chatPaneActive = document.getElementById('chat-pane-active');
  
  if (!threadContainer || !chatPaneActive) return;
  
  if (state.activeChatId) {
    threadContainer.style.display = 'none';
    chatPaneActive.style.display = 'flex';
    renderChatConversation();
  } else {
    threadContainer.style.display = 'flex';
    chatPaneActive.style.display = 'none';
    
    // Fetch unique people who have active messages in DB
    const db = getLocalDB();
    const chatPartnersIds = [...new Set(db.messages.map(m => m.senderId === 'user' ? m.receiverId : m.senderId))].filter(id => id !== 'user');
    
    threadContainer.innerHTML = '';
    
    if (chatPartnersIds.length === 0) {
      threadContainer.innerHTML = `
        <div class="text-muted" style="text-align:center; padding: 40px;">
          <i class="fa-solid fa-message-slash" style="font-size:32px; display:block; margin-bottom:8px;"></i>
          <p>No active message threads. Choose a worker to begin chatting.</p>
        </div>
      `;
      return;
    }
    
    chatPartnersIds.forEach(id => {
      // Find worker metadata details
      const partner = state.workers.find(w => w.id === id);
      if (!partner) return;
      
      const threadMessages = db.messages.filter(m => 
        (m.senderId === 'user' && m.receiverId === id) || 
        (m.senderId === id && m.receiverId === 'user')
      );
      const lastMsg = threadMessages[threadMessages.length - 1];
      const previewText = lastMsg ? lastMsg.content : "No messages yet";
      
      const card = document.createElement('div');
      card.className = 'glass-card chat-thread-card';
      card.addEventListener('click', () => {
        state.activeChatId = partner.id;
        renderChatWorkspace();
      });
      
      card.innerHTML = `
        <div class="worker-avatar">${partner.avatar}</div>
        <div style="flex:1;">
          <h4>${partner.name}</h4>
          <p style="text-overflow:ellipsis; overflow:hidden; white-space:nowrap; max-width:240px;">${previewText}</p>
        </div>
      `;
      threadContainer.appendChild(card);
    });
  }
}

async function renderChatConversation() {
  const partner = state.workers.find(w => w.id === state.activeChatId);
  const infoEl = document.getElementById('chat-header-info');
  const container = document.getElementById('chat-messages-container');
  
  if (!partner || !infoEl || !container) return;
  
  // Render header info
  infoEl.innerHTML = `
    <div class="worker-avatar" style="width:30px; height:30px; font-size:11px;">${partner.avatar}</div>
    <div>
      <h4>${partner.name}</h4>
      <span>● Online Support</span>
    </div>
  `;
  
  const list = await fetchMessages(partner.id);
  container.innerHTML = '';
  
  list.forEach(m => {
    const isOutgoing = m.senderId === 'user';
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;
    bubble.textContent = m.content;
    container.appendChild(bubble);
  });
  
  // Auto scroll messages to the bottom
  container.scrollTop = container.scrollHeight;
}

function initChatSubmitForm() {
  const form = document.getElementById('chat-message-form');
  const inputText = document.getElementById('chat-input-text');
  const backBtn = document.getElementById('btn-back-to-threads');

  if (form && inputText) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = inputText.value;
      if (!content.trim() || !state.activeChatId) return;

      try {
        await sendMessage(state.activeChatId, content);
        inputText.value = '';
        
        // Refresh convo
        renderChatConversation();
        
        // Sync API state updates
        setTimeout(async () => {
          await syncAppState();
          if (state.activeView === 'chat' && state.activeChatId) {
            renderChatConversation();
          }
        }, 1600);
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.activeChatId = null;
      renderChatWorkspace();
    });
  }
}

function openChatFromWorker(workerId) {
  state.activeChatId = workerId;
  navigateToView('chat');
}

// --- VIEW 7: MY PROFILE & WORKER ACCOUNT REGISTRATION ---
function updateProfileUI() {
  const user = state.currentUser;
  
  // Update generic values
  const nameEl = document.getElementById('profile-display-name');
  const roleEl = document.getElementById('profile-display-role');
  const avatarEl = document.getElementById('profile-avatar');
  const statBookings = document.getElementById('profile-stat-bookings');
  const statBadges = document.getElementById('profile-stat-badges');
  const skillBadgesList = document.getElementById('profile-skill-badges');

  if (nameEl) nameEl.textContent = user.name;
  if (roleEl) roleEl.textContent = `Account Type: ${user.role}`;
  if (avatarEl) avatarEl.textContent = user.avatar;
  if (statBookings) statBookings.textContent = state.bookings.length;
  if (statBadges) statBadges.textContent = user.skills.length;
  
  // Badges lists
  if (skillBadgesList) {
    skillBadgesList.innerHTML = '';
    user.skills.forEach(badge => {
      const span = document.createElement('span');
      span.className = 'badge badge-approved';
      span.innerHTML = `<i class="fa-solid fa-certificate"></i> ${badge}`;
      skillBadgesList.appendChild(span);
    });
  }
}

function populateProfileDashboard() {
  updateProfileUI();
  
  const user = state.currentUser;
  const applicationCard = document.getElementById('worker-application-card');
  const activeDashboard = document.getElementById('worker-active-dashboard');
  
  if (user.role === 'Worker') {
    if (applicationCard) applicationCard.style.display = 'none';
    if (activeDashboard) activeDashboard.style.display = 'block';
    
    // Render worker dashboard values
    document.getElementById('wd-category').textContent = user.category.charAt(0).toUpperCase() + user.category.slice(1);
    document.getElementById('wd-education').textContent = user.education;
    document.getElementById('wd-experience').textContent = user.experience;
    document.getElementById('wd-license').textContent = user.licenseNumber;
    document.getElementById('wd-rate').textContent = `₹${user.hourlyRate}/hr`;
    
    const badge = document.getElementById('wd-badge');
    const adminBox = document.getElementById('wd-admin-simulate-box');
    
    if (user.isWorkerApproved) {
      if (badge) {
        badge.className = 'badge badge-approved';
        badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Government Approved License`;
      }
      if (adminBox) adminBox.style.display = 'none';
    } else {
      if (badge) {
        badge.className = 'badge badge-pending';
        badge.innerHTML = `<i class="fa-solid fa-hourglass"></i> Reviewing Credentials`;
      }
      if (adminBox) adminBox.style.display = 'block';
    }
  } else {
    if (applicationCard) applicationCard.style.display = 'block';
    if (activeDashboard) activeDashboard.style.display = 'none';
  }
}

function initWorkerRegistrationForm() {
  const form = document.getElementById('form-worker-register');
  const adminApproveBtn = document.getElementById('btn-admin-approve-me');
  
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const category = document.getElementById('reg-category').value;
      const education = document.getElementById('reg-education').value;
      const experience = document.getElementById('reg-experience').value;
      const licenseNumber = document.getElementById('reg-license').value;
      const hourlyRate = document.getElementById('reg-rate').value;
      const isElitePro = document.getElementById('reg-is-pro').checked;
      const bio = document.getElementById('reg-bio').value;

      try {
        await registerAsWorker({ category, education, experience, licenseNumber, hourlyRate, isElitePro, bio });
        alert("Worker registration application submitted successfully! Government credential approval pending.");
        await syncAppState();
        populateProfileDashboard();
      } catch (err) {
        console.error(err);
      }
    });
  }

  if (adminApproveBtn) {
    adminApproveBtn.addEventListener('click', async () => {
      // Find the user's worker profile ID from local or remote workers list
      const userLicense = state.currentUser.licenseNumber;
      const match = state.workers.find(w => w.licenseNumber === userLicense);
      const targetId = match ? match.id : null;
      
      if (targetId) {
        try {
          await simulateApproveWorker(targetId);
          alert("Admin System: Government validation passed. Worker account issued Approved badge status!");
          await syncAppState();
          populateProfileDashboard();
        } catch (e) {
          console.error(e);
        }
      } else {
        alert("Profile target error.");
      }
    });
  }
}

function initLoginForms() {
  const formUser = document.getElementById('form-login-user');
  const formWorker = document.getElementById('form-login-worker');
  const btnLogout = document.getElementById('btn-logout');

  if (formUser) {
    formUser.addEventListener('submit', async (e) => {
      e.preventDefault();
      playClickSound();
      
      const name = document.getElementById('login-user-name').value;
      const phone = document.getElementById('login-user-phone').value;
      const location = document.getElementById('login-user-location').value;

      try {
        const user = await loginUser({ role: 'Customer', name, phone, location });
        playSuccessSound();
        await syncAppState();
        navigateToView('workers');
      } catch (err) {
        console.error("Login customer error:", err);
      }
    });
  }

  if (formWorker) {
    formWorker.addEventListener('submit', async (e) => {
      e.preventDefault();
      playClickSound();
      
      const name = document.getElementById('login-worker-name').value;
      const phone = document.getElementById('login-worker-phone').value;
      const category = document.getElementById('login-worker-category').value;
      const education = document.getElementById('login-worker-education').value;
      const experience = document.getElementById('login-worker-experience').value;
      const licenseNumber = document.getElementById('login-worker-license').value;
      const hourlyRate = document.getElementById('login-worker-rate').value;
      const isElitePro = document.getElementById('login-worker-pro').checked;

      try {
        const user = await loginUser({
          role: 'Worker',
          name,
          phone,
          category,
          education,
          experience,
          licenseNumber,
          hourlyRate,
          isElitePro
        });
        playSuccessSound();
        await syncAppState();
        navigateToView('profile');
      } catch (err) {
        console.error("Login worker error:", err);
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
      playClickSound();
      if (confirm("Are you sure you want to logout?")) {
        try {
          await logoutUser();
          await syncAppState();
          navigateToView('login');
          if (formUser) formUser.reset();
          if (formWorker) formWorker.reset();
        } catch (err) {
          console.error("Logout error:", err);
        }
      }
    });
  }
}

// --- INITIALIZER BOOTSTRAP ---
window.addEventListener('DOMContentLoaded', async () => {
  initAppChrome();
  initViewRouter();
  initWorkersFilterLogic();
  initShowroomTabs();
  initBookingModalLogic();
  initAIScannerLogic();
  initEmergencySOSLogic();
  initQuizLogic();
  initChatSubmitForm();
  initWorkerRegistrationForm();
  initLoginForms();

  // Attach global click sound listener
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('button, .nav-tab, .category-pill, .showroom-tab, .scanner-test-btn');
    if (target) {
      playClickSound();
    }
  });

  // Test Server & Sync state
  await checkServerConnection();
  await syncAppState();
  
  if (!state.isLoggedIn) {
    navigateToView('login');
  } else {
    if (state.currentUser.role === 'Worker') {
      navigateToView('profile');
    } else {
      navigateToView('workers');
    }
  }
  
  // Set up background synchronization every 10 seconds to catch simulated worker replies
  setInterval(async () => {
    const prevView = state.activeView;
    const prevChat = state.activeChatId;
    await syncAppState();
    if (prevView === 'chat' && prevChat === state.activeChatId && state.activeChatId) {
      renderChatConversation();
    }
  }, 10000);
  
  // Initial lists renders
  renderWorkersList();
});
