/**
 * FixElite API Router Module
 */

const express = require('express');
const router = express.Router();
const { loadDB, saveDB } = require('../db');

// 1. Get current logged-in user profile
router.get('/me', (req, res) => {
  const db = loadDB();
  res.json(db.currentUser || { id: "" });
});

// 2. Update current profile / Worker registration application
router.post('/me', (req, res) => {
  const db = loadDB();
  const updatedProfile = req.body;
  
  db.currentUser = {
    ...db.currentUser,
    ...updatedProfile,
    avatar: updatedProfile.name ? updatedProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : "AJ"
  };
  
  if (db.currentUser.role === "Worker" && !db.currentUser.isWorkerApproved) {
    console.log(`Worker registration application received for: ${db.currentUser.name}`);
  }
  
  saveDB(db);
  res.json(db.currentUser);
});

// 2b. Login endpoint for Customer or Worker
router.post('/login', (req, res) => {
  const db = loadDB();
  const { role, name, phone, category, education, experience, licenseNumber, hourlyRate, isElitePro } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and Phone are required" });
  }

  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (role === 'Worker') {
    let worker = db.workers.find(w => w.name.toLowerCase() === name.toLowerCase() || (licenseNumber && w.licenseNumber === licenseNumber));
    if (!worker) {
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
        approved: true,
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
    // Customer login
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
router.post('/logout', (req, res) => {
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
router.get('/workers', (req, res) => {
  const db = loadDB();
  res.json(db.workers);
});

// 4. Get specific worker detail
router.get('/workers/:id', (req, res) => {
  const db = loadDB();
  const worker = db.workers.find(w => w.id === req.params.id);
  if (worker) {
    res.json(worker);
  } else {
    if (db.currentUser.id === req.params.id) {
      res.json(db.currentUser);
    } else {
      res.status(404).json({ error: "Worker profile not found" });
    }
  }
});

// 5. Register user as a worker directly
router.post('/workers/register', (req, res) => {
  const db = loadDB();
  const details = req.body;
  
  const newWorker = {
    id: "worker_" + Date.now(),
    name: db.currentUser.name || details.name || "New Worker",
    category: details.category || "electrician",
    role: details.isElitePro ? "Elite Pro Consultant" : ((details.category || "Electrician").charAt(0).toUpperCase() + (details.category || "electrician").slice(1) + " Expert"),
    experience: details.experience || "1 Year",
    education: details.education || "Diploma Certificate",
    bio: details.isElitePro ? "High-End Engineering Consultant & Diagnostics Architect." : (details.bio || "Registered professional worker ready to assist."),
    avatar: db.currentUser.avatar || "WK",
    phone: db.currentUser.phone || "+91 98000 00000",
    rating: 5.0,
    distance: 1.2,
    hourlyRate: parseInt(details.hourlyRate) || 150,
    approved: false,
    guaranteed: details.isElitePro ? true : false,
    licenseNumber: details.licenseNumber || "PENDING-" + Math.floor(Math.random() * 900 + 100),
    isElitePro: !!details.isElitePro
  };
  
  db.workers.push(newWorker);
  
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
router.post('/workers/:id/approve', (req, res) => {
  const db = loadDB();
  const workerId = req.params.id;
  
  const worker = db.workers.find(w => w.id === workerId);
  if (worker) {
    worker.approved = true;
    worker.guaranteed = true;
    
    if (db.currentUser.licenseNumber === worker.licenseNumber) {
      db.currentUser.isWorkerApproved = true;
    }
    
    saveDB(db);
    res.json({ success: true, worker });
  } else {
    res.status(404).json({ error: "Worker not found" });
  }
});

// 7. Get user bookings
router.get('/bookings', (req, res) => {
  const db = loadDB();
  res.json(db.bookings);
});

// 8. Create a service booking
router.post('/bookings', (req, res) => {
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
router.get('/courses', (req, res) => {
  const db = loadDB();
  res.json(db.courses);
});

// 10. Submit Course Quiz Answers & earn badges
router.post('/courses/:id/quiz', (req, res) => {
  const db = loadDB();
  const courseId = req.params.id;
  const { answers } = req.body;
  
  const course = db.courses.find(c => c.id === courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });
  
  let correctCount = 0;
  course.quiz.questions.forEach((q, idx) => {
    if (answers && answers[idx] === q.answer) {
      correctCount++;
    }
  });
  
  const passed = correctCount === course.quiz.questions.length;
  
  if (passed) {
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

// 11. Trigger Emergency SOS Alert with automatic multi-scenario dispatching
router.post('/sos', (req, res) => {
  const db = loadDB();
  const { location, triggerType } = req.body;
  
  let statusText = "Broadcasting (Responders & Nearby Mechanics Alerted)";
  if (triggerType === "Home Electrical Fire Sensor") {
    statusText = "Responded (Fire Brigade 101, Ambulance 108 & Electricians Ramesh/Vikram Auto-Dispatched)";
  } else if (triggerType === "Vehicle Crash Sensor") {
    statusText = "Responded (Towing Truck, Ambulance 108 & Mechanics Sarah/Amit Auto-Dispatched)";
  }
  
  const newSOS = {
    id: "sos_" + Date.now(),
    timestamp: new Date().toISOString(),
    location: location || "Simulated Emergency Site",
    status: statusText,
    triggerType: triggerType || "Manual SOS Trigger"
  };
  
  db.sosAlerts.unshift(newSOS);
  saveDB(db);
  res.json(newSOS);
});

// 12. Get SOS Logs
router.get('/sos', (req, res) => {
  const db = loadDB();
  res.json(db.sosAlerts);
});

// 12b. Get Corporate Showroom Gigs
router.get('/pro/gigs', (req, res) => {
  const db = loadDB();
  res.json(db.corporateGigs || []);
});

// 12c. Apply for a Corporate Showroom Gig
router.post('/pro/apply-gig', (req, res) => {
  const db = loadDB();
  const { gigId } = req.body;
  
  if (!db.currentUser.appliedGigs) {
    db.currentUser.appliedGigs = [];
  }
  
  if (gigId && !db.currentUser.appliedGigs.includes(gigId)) {
    db.currentUser.appliedGigs.push(gigId);
    
    const gig = (db.corporateGigs || []).find(g => g.id === gigId);
    console.log(`Highly educated worker ${db.currentUser.name} applied for: ${gig ? gig.title : gigId}`);
  }
  
  saveDB(db);
  res.json(db.currentUser);
});

// 13. Get messages between user and worker
router.get('/messages/:otherId', (req, res) => {
  const db = loadDB();
  const otherId = req.params.otherId;
  
  const chatLogs = db.messages.filter(m => 
    (m.senderId === "user" && m.receiverId === otherId) || 
    (m.senderId === otherId && m.receiverId === "user")
  ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  res.json(chatLogs);
});

// 14. Send a message
router.post('/messages', (req, res) => {
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
  
  const worker = db.workers.find(w => w.id === receiverId);
  if (worker) {
    const responseMsgs = [
      `Got it! Let me know if there's any specific tool or spare parts I should buy on my way.`,
      `Thank you for the message. I am packing my toolkit now.`,
      `Okay, I'll keep that in mind. See you at the scheduled time!`,
      `Understood. I will do my best to solve it at a reasonable rate.`
    ];
    const randomReply = responseMsgs[Math.floor(Math.random() * responseMsgs.length)];
    
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

module.exports = router;
