/**
 * FixElite Backend Seed Data Definition
 */

const SEED_DATA = {
  currentUser: {
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
      status: "Responded (Fire Brigade 101, Ambulance 108 & Electricians Ramesh/Vikram dispatched)",
      triggerType: "Home Electrical Fire Sensor"
    }
  ],
  messages: [
    {
      senderId: "ramesh_electrician",
      receiverId: "user",
      content: "Hello! I saw your booking request for tomorrow at 10 AM. I will arrive with my toolkit. Please share any details of the short-circuit problem.",
      timestamp: "2026-07-05T21:30:00Z"
    }
  ],
  corporateGigs: [
    {
      id: "g1",
      brand: "Toyota Dealership Showroom",
      title: "Automobile Diagnostic Consultant",
      rate: 800,
      duration: "6 Months Contract",
      location: "Toyota Premium Central",
      desc: "Require an Mechanical/Automobile Graduate to perform advanced OBD-II scanner calibrations, hybrid power split device debugging, and diagnostic training.",
      icon: "fa-car"
    },
    {
      id: "g2",
      brand: "Honda Energy Tech Centre",
      title: "EV Battery System Specialist",
      rate: 1000,
      duration: "12 Months Contract",
      location: "Honda Tech Park",
      desc: "Oversee EV battery diagnostics, BMS troubleshooting, and thermal runtime integrity validations. B.Tech / Diploma Electrical preferred.",
      icon: "fa-bolt"
    },
    {
      id: "g3",
      brand: "Suzuki Smart Integration",
      title: "IoT Distribution Grid Lead",
      rate: 650,
      duration: "3 Months Contract",
      location: "Suzuki Dealership South",
      desc: "Configure smart home mesh distribution nodes, solar hybrid backup connections, and EV charger docks. Advanced degree certification required.",
      icon: "fa-network-wired"
    }
  ]
};

module.exports = SEED_DATA;
