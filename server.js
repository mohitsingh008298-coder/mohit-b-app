const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Seed data definitions for FixElite App
const SEED_DATA = {
  currentUser: {
    id: "user",
    name: "Alex Johnson",
    role: "Customer",
    avatar: "AJ",
    phone: "+91 98765 43210",
    location: "Metro City Central",
    skills: ["Basic Wiring"], // skills learned via Academy
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

// Helper to load database
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    saveDB(SEED_DATA);
    return SEED_DATA;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database, using seed data instead:", err);
    return SEED_DATA;
  }
}

// Helper to save database
function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing to database:", err);
  }
}

// --- API Endpoints ---

// 1. Get current logged-in user profile
app.get('/api/me', (req, res) => {
  const db = loadDB();
  res.json(db.currentUser);
});

// 2. Update current profile / Worker registration application
app.post('/api/me', (req, res) => {
  const db = loadDB();
  const updatedProfile = req.body;
  
  db.currentUser = {
    ...db.currentUser,
    ...updatedProfile,
    avatar: updatedProfile.name ? updatedProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : "AJ"
  };
  
  // If user applied to be a worker, handle simulated approval queue
  if (db.currentUser.role === "Worker" && !db.currentUser.isWorkerApproved) {
    // Generate a mock application
    console.log(`Worker registration application received for: ${db.currentUser.name}`);
  }
  
  saveDB(db);
  res.json(db.currentUser);
});

// 2b. Login endpoint for Customer or Worker
app.post('/api/login', (req, res) => {
  const db = loadDB();
  const { role, name, phone, category, education, experience, licenseNumber, hourlyRate, isElitePro } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and Phone are required" });
  }

  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (role === 'Worker') {
    // Check if worker with this license or name already exists
    let worker = db.workers.find(w => w.name.toLowerCase() === name.toLowerCase() || (licenseNumber && w.licenseNumber === licenseNumber));
    if (!worker) {
      // Create new worker entry
      worker = {
        id: "worker_" + Date.now(),
        name,
        category: category || "electrician",
        role: isElitePro ? "Elite Pro Consultant" : ((category || "electrician").charAt(0).toUpperCase() + (category || "electrician").slice(1) + " Expert"),
        experience: experience || "1 Year",
        education: education || "Diploma Certificate",
        bio: isElitePro ? "High-End Engineering Consultant & Diagnostics Architect." : "Registered professional worker ready to assist.",
        avatar,
        phone,
        rating: 5.0,
        distance: 1.2,
        hourlyRate: parseInt(hourlyRate) || 150,
        approved: true, // Auto-approve on login for fluid demo experience
        guaranteed: true,
        licenseNumber: licenseNumber || "GOV-LIC-" + Math.floor(Math.random() * 900 + 100),
        isElitePro: !!isElitePro
      };
      db.workers.push(worker);
    } else {
      if (isElitePro !== undefined) {
        worker.isElitePro = !!isElitePro;
        if (isElitePro) {
          worker.role = "Elite Pro Consultant";
        }
      }
    }
    
    db.currentUser = {
      id: worker.id,
      name: worker.name,
      role: "Worker",
      avatar: worker.avatar,
      phone: worker.phone,
      location: "Metro City Central",
      skills: worker.isElitePro ? ["Certified Specialist", "Advanced Diagnostics"] : ["Certified Specialist"],
      isWorkerApproved: worker.approved,
      education: worker.education,
      experience: worker.experience,
      category: worker.category,
      licenseNumber: worker.licenseNumber,
      hourlyRate: worker.hourlyRate,
      isElitePro: worker.isElitePro,
      appliedGigs: db.currentUser.appliedGigs || []
    };
  } else {
    // Customer
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
      hourlyRate: "",
      isElitePro: false,
      appliedGigs: []
    };
  }

  saveDB(db);
  res.json(db.currentUser);
});

// 2c. Logout endpoint
app.post('/api/logout', (req, res) => {
  const db = loadDB();
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
    hourlyRate: "",
    isElitePro: false,
    appliedGigs: []
  };
  saveDB(db);
  res.json({ success: true });
});

// 3. Get all service workers
app.get('/api/workers', (req, res) => {
  const db = loadDB();
  res.json(db.workers);
});

// 4. Get specific worker detail
app.get('/api/workers/:id', (req, res) => {
  const db = loadDB();
  const worker = db.workers.find(w => w.id === req.params.id);
  if (worker) {
    res.json(worker);
  } else {
    // Check if current user is this worker
    if (db.currentUser.id === req.params.id) {
      res.json(db.currentUser);
    } else {
      res.status(404).json({ error: "Worker profile not found" });
    }
  }
});

// 5. Register user as a worker directly
app.post('/api/workers/register', (req, res) => {
  const db = loadDB();
  const details = req.body;
  
  const newWorker = {
    id: "worker_" + Date.now(),
    name: db.currentUser.name,
    category: details.category || "electrician",
    role: details.isElitePro ? "Elite Pro Consultant" : ((details.category || "Electrician").charAt(0).toUpperCase() + (details.category || "electrician").slice(1) + " Expert"),
    experience: details.experience || "1 Year",
    education: details.education || "Diploma Certificate",
    bio: details.isElitePro ? "High-End Engineering Consultant & Diagnostics Architect." : (details.bio || "Registered professional worker ready to assist."),
    avatar: db.currentUser.avatar,
    phone: db.currentUser.phone || "+91 98000 00000",
    rating: 5.0,
    distance: 1.2,
    hourlyRate: parseInt(details.hourlyRate) || 150,
    approved: false, // requires admin simulation approval
    guaranteed: details.isElitePro ? true : false, // auto-guaranteed if elite pro
    licenseNumber: details.licenseNumber || "PENDING-" + Math.floor(Math.random() * 900 + 100),
    isElitePro: !!details.isElitePro
  };
  
  db.workers.push(newWorker);
  
  // Update currentUser reference
  db.currentUser.role = "Worker";
  db.currentUser.isWorkerApproved = false;
  db.currentUser.licenseNumber = newWorker.licenseNumber;
  db.currentUser.education = newWorker.education;
  db.currentUser.experience = newWorker.experience;
  db.currentUser.category = newWorker.category;
  db.currentUser.hourlyRate = newWorker.hourlyRate;
  db.currentUser.isElitePro = newWorker.isElitePro;
  db.currentUser.appliedGigs = [];
  
  saveDB(db);
  res.json({ success: true, worker: newWorker });
});

// 6. Approve worker (simulation endpoint)
app.post('/api/workers/:id/approve', (req, res) => {
  const db = loadDB();
  const workerId = req.params.id;
  
  const worker = db.workers.find(w => w.id === workerId);
  if (worker) {
    worker.approved = true;
    worker.guaranteed = true; // Auto-guaranteed on official approval
    
    // If this worker is the current user
    if (db.currentUser.licenseNumber === worker.licenseNumber) {
      db.currentUser.isWorkerApproved = true;
    }
    
    saveDB(db);
    res.json({ success: true, worker });
  } else {
    res.status(404).json({ error: "Worker not found" });
  }
});

// 7. Get user bookings (both worker and showroom bookings)
app.get('/api/bookings', (req, res) => {
  const db = loadDB();
  res.json(db.bookings);
});

// 8. Create a service booking
app.post('/api/bookings', (req, res) => {
  const db = loadDB();
  const { type, entityId, date, time } = req.body;
  
  let newBooking = {};
  
  if (type === 'worker') {
    const worker = db.workers.find(w => w.id === entityId);
    if (!worker) return res.status(404).json({ error: "Worker not found" });
    
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
    
    // Add default automated welcoming message in chat history from this worker
    const autoWelcomeMessage = {
      senderId: worker.id,
      receiverId: "user",
      content: `Hello! I have accepted your booking for ${date} at ${time}. I will review your requirements and reach your location. Please let me know what needs to be fixed!`,
      timestamp: new Date().toISOString()
    };
    db.messages.push(autoWelcomeMessage);
    
  } else if (type === 'showroom') {
    const service = db.showroomServices.find(s => s.id === entityId);
    if (!service) return res.status(404).json({ error: "Showroom package not found" });
    
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
  } else {
    return res.status(400).json({ error: "Invalid booking type" });
  }
  
  db.bookings.push(newBooking);
  saveDB(db);
  res.json(newBooking);
});

// 9. Get Upskilling Academy Courses
app.get('/api/courses', (req, res) => {
  const db = loadDB();
  res.json(db.courses);
});

// 10. Submit Course Quiz Answers & earn badges
app.post('/api/courses/:id/quiz', (req, res) => {
  const db = loadDB();
  const courseId = req.params.id;
  const { answers } = req.body; // Array of option indices [1, 2, ...]
  
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  
  // Validate answers
  let correctCount = 0;
  course.quiz.questions.forEach((q, idx) => {
    if (answers && answers[idx] === q.answer) {
      correctCount++;
    }
  });
  
  const passed = correctCount === course.quiz.questions.length;
  
  if (passed) {
    // Add skill badge to user
    const skillBadge = courseId === 'ev_basics' ? 'Certified EV Diagnostics' : 'Smart IoT Technician';
    if (!db.currentUser.skills.includes(skillBadge)) {
      db.currentUser.skills.push(skillBadge);
    }
    saveDB(db);
    res.json({ passed: true, correctCount, total: course.quiz.questions.length, skillBadge });
  } else {
    res.json({ passed: false, correctCount, total: course.quiz.questions.length });
  }
});

// 11. Trigger Emergency SOS Alert
app.post('/api/sos', (req, res) => {
  const db = loadDB();
  const { location, triggerType } = req.body;
  
  const newSOS = {
    id: "sos_" + Date.now(),
    timestamp: new Date().toISOString(),
    location: location || "Simulated Accident Site",
    status: "Broadcasting (Responders & Nearby Mechanics Alerted)",
    triggerType: triggerType || "Accident Sensor Trigger"
  };
  
  db.sosAlerts.unshift(newSOS); // newest at the top
  saveDB(db);
  res.json(newSOS);
});

// 12. Get SOS Logs
app.get('/api/sos', (req, res) => {
  const db = loadDB();
  res.json(db.sosAlerts);
});

// 12b. Get Corporate Showroom Gigs
app.get('/api/pro/gigs', (req, res) => {
  const db = loadDB();
  res.json(db.corporateGigs || []);
});

// 12c. Apply for a Corporate Showroom Gig
app.post('/api/pro/apply-gig', (req, res) => {
  const db = loadDB();
  const { gigId } = req.body;
  
  if (!db.currentUser.appliedGigs) {
    db.currentUser.appliedGigs = [];
  }
  
  if (gigId && !db.currentUser.appliedGigs.includes(gigId)) {
    db.currentUser.appliedGigs.push(gigId);
    
    // Find the gig details
    const gig = db.corporateGigs.find(g => g.id === gigId);
    console.log(`Highly educated worker ${db.currentUser.name} applied for: ${gig ? gig.title : gigId}`);
  }
  
  saveDB(db);
  res.json(db.currentUser);
});

// 13. Get messages between user and worker
app.get('/api/messages/:otherId', (req, res) => {
  const db = loadDB();
  const otherId = req.params.otherId;
  
  const chatLogs = db.messages.filter(m => 
    (m.senderId === "user" && m.receiverId === otherId) || 
    (m.senderId === otherId && m.receiverId === "user")
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  res.json(chatLogs);
});

// 14. Send a message
app.post('/api/messages', (req, res) => {
  const db = loadDB();
  const { receiverId, content } = req.body;
  
  if (!receiverId || !content || content.trim() === "") {
    return res.status(400).json({ error: "Invalid receiver or empty content" });
  }
  
  const newMessage = {
    senderId: "user",
    receiverId,
    content: content.trim(),
    timestamp: new Date().toISOString()
  };
  
  db.messages.push(newMessage);
  
  // Set up a simulated smart response delay from the worker if they haven't sent one recently
  const worker = db.workers.find(w => w.id === receiverId);
  if (worker) {
    const responseMsgs = [
      `Got it! Let me know if there's any specific tool or spare parts I should buy on my way.`,
      `Thank you for the message. I am packing my toolkit now.`,
      `Okay, I'll keep that in mind. See you at the scheduled time!`,
      `Understood. I will do my best to solve it at a reasonable rate.`
    ];
    const randomReply = responseMsgs[Math.floor(Math.random() * responseMsgs.length)];
    
    // Simulate async bot reply after 1.5 seconds in backend DB
    setTimeout(() => {
      const activeDB = loadDB();
      activeDB.messages.push({
        senderId: receiverId,
        receiverId: "user",
        content: randomReply,
        timestamp: new Date().toISOString()
      });
      saveDB(activeDB);
    }, 1500);
  }
  
  saveDB(db);
  res.json(newMessage);
});

// Fallback index html serving
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 FixElite Service Engine running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});
