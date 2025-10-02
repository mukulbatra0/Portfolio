export const contactInfo = {
  personal: {
    name: "Mukul Batra",
    title: "Full-Stack MERN Developer",
    tagline: "Building the future, one line of code at a time",
    location: "Bhiwani, Haryana, India",
    timezone: "IST (UTC+5:30)",
    availability: "Available for freelance projects and full-time opportunities"
  },

  contact: {
    email: {
      primary: "mukulbatra5911@gmail.com",
      display: "mukulbatra5911@gmail.com",
      subject: "Project Inquiry - Portfolio Contact",
      action: "mailto:mukulbatra5911@gmail.com?subject=Project%20Inquiry%20-%20Portfolio%20Contact"
    },
    phone: {
      number: "+91 8685965227",
      display: "+91 86859 65227",
      action: "tel:+918685965227",
      whatsapp: "https://wa.me/918685965227?text=Hi%20Mukul,%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
    },
    location: {
      city: "Bhiwani",
      state: "Haryana",
      country: "India",
      coordinates: { lat: 28.7914, lng: 76.1392 },
      mapUrl: "https://maps.google.com/?q=Bhiwani,Haryana,India"
    }
  },

  social: {
    github: {
      url: "https://github.com/mukulbatra0",
      username: "@mukulbatra0",
      display: "GitHub",
      icon: "github",
      color: "#333"
    },
    linkedin: {
      url: "https://www.linkedin.com/in/mukulbatra0/",
      username: "mukulbatra0",
      display: "LinkedIn",
      icon: "linkedin",
      color: "#0077B5"
    },
    twitter: {
      url: "https://x.com/mukulbatra5911",
      username: "@mukulbatra",
      display: "Twitter",
      icon: "twitter",
      color: "#1DA1F2"
    },
    instagram: {
      url: "https://instagram.com/mukulbatra0",
      username: "@mukulbatra0",
      display: "Instagram",
      icon: "instagram",
      color: "#E4405F"
    }
  },

  resume: {
    url: "/resume/mukul-batra-resume.pdf",
    filename: "Mukul_Batra_Resume.pdf",
    lastUpdated: "November 2024",
    size: "72 KB"
  },

  workingHours: {
    timezone: "IST",
    monday: { start: "09:00", end: "18:00" },
    tuesday: { start: "09:00", end: "18:00" },
    wednesday: { start: "09:00", end: "18:00" },
    thursday: { start: "09:00", end: "18:00" },
    friday: { start: "09:00", end: "18:00" },
    saturday: { start: "10:00", end: "16:00" },
    sunday: { start: "10:00", end: "14:00" }
  },

  responseTime: {
    email: "Within 24 hours",
    phone: "Within 2 hours",
    whatsapp: "Within 1 hour"
  },

  services: [
    {
      title: "Full-Stack Web Development",
      description: "Complete web applications using MERN stack",
      icon: "code",
      color: "#22D3EE"
    },
    {
      title: "Frontend Development",
      description: "Responsive and interactive user interfaces",
      icon: "desktop",
      color: "#10B981"
    },
    {
      title: "Backend Development",
      description: "Scalable APIs and database architecture",
      icon: "server",
      color: "#8B5CF6"
    },
    {
      title: "Technical Consultation",
      description: "Architecture planning and code reviews",
      icon: "lightbulb",
      color: "#F59E0B"
    }
  ],

  preferredContact: {
    method: "email",
    reason: "For detailed project discussions and documentation",
    alternative: "WhatsApp for quick questions and updates"
  }
};

export const getContactMethod = (method) => {
  const methods = {
    email: contactInfo.contact.email,
    phone: contactInfo.contact.phone,
    location: contactInfo.contact.location
  };
  return methods[method];
};

export const getSocialLink = (platform) => {
  return contactInfo.social[platform];
};

export const isWorkingHours = () => {
  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = dayNames[now.getDay()];
  const currentHour = now.getHours();

  const todayHours = contactInfo.workingHours[day];
  if (!todayHours) return false;

  const startHour = parseInt(todayHours.start.split(':')[0]);
  const endHour = parseInt(todayHours.end.split(':')[0]);

  return currentHour >= startHour && currentHour < endHour;
};

export const getResponseTime = (method) => {
  return contactInfo.responseTime[method] || "Within 48 hours";
};