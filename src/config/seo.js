// SEO Configuration for Mukul Batra Portfolio

export const seoConfig = {
  // Basic site information
  siteName: "Mukul Batra Portfolio",
  siteUrl: "https://mukulbatra.dev",
  author: "Mukul Batra",
  
  // Default meta tags
  defaultTitle: "Mukul Batra - Full-Stack MERN Developer",
  defaultDescription: "Modern portfolio showcasing full-stack web development projects with React.js, Node.js, and 3D animations.",
  defaultKeywords: "Mukul Batra, Full-Stack Developer, MERN Stack, React.js, Node.js, Portfolio, Web Developer",
  
  // Social media handles
  social: {
    twitter: "@mukulbatra",
    github: "https://github.com/mukulbatra",
    linkedin: "https://linkedin.com/in/mukulbatra",
    email: "mukulbatra5911@gmail.com"
  },
  
  // Open Graph defaults
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mukul Batra Portfolio",
    images: {
      default: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Mukul Batra Portfolio Preview"
    }
  },
  
  // Twitter Card defaults
  twitter: {
    cardType: "summary_large_image",
    site: "@mukulbatra",
    creator: "@mukulbatra"
  },
  
  // Structured data templates
  structuredData: {
    person: {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Mukul Batra",
      jobTitle: "Full-Stack MERN Developer",
      description: "Detail-oriented Computer Science student specializing in full-stack MERN development and algorithms",
      url: "https://mukulbatra.dev",
      image: "https://mukulbatra.dev/profile-image.jpg",
      email: "mukulbatra5911@gmail.com",
      telephone: "+91-8685965227",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bhiwani",
        addressRegion: "Haryana",
        addressCountry: "IN"
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "The Technological Institute of Textile and Sciences",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bhiwani",
          addressRegion: "Haryana",
          addressCountry: "IN"
        }
      },
      sameAs: [
        "https://github.com/mukulbatra",
        "https://linkedin.com/in/mukulbatra"
      ]
    },
    
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Mukul Batra Portfolio",
      url: "https://mukulbatra.dev",
      description: "Modern portfolio showcasing full-stack web development projects with React.js, Node.js, and 3D animations",
      inLanguage: "en-US"
    }
  },
  
  // Section-specific SEO data
  sections: {
    hero: {
      title: "Mukul Batra - Full-Stack MERN Developer",
      description: "Modern portfolio showcasing full-stack web development projects with React.js, Node.js, and 3D animations.",
      keywords: "Mukul Batra, Full-Stack Developer, MERN Stack, React.js, Node.js, Portfolio"
    },
    about: {
      title: "About Mukul Batra - Full-Stack Developer",
      description: "Learn about Mukul Batra's journey as a Computer Science student specializing in full-stack MERN development.",
      keywords: "About Mukul Batra, Computer Science, Full-Stack Developer, MERN Stack"
    },
    skills: {
      title: "Technical Skills - Mukul Batra",
      description: "Explore Mukul's technical expertise in JavaScript, React.js, Node.js, MongoDB, and modern web development technologies.",
      keywords: "JavaScript, React.js, Node.js, MongoDB, Express.js, Technical Skills, Web Development"
    },
    projects: {
      title: "Projects - Mukul Batra Portfolio",
      description: "Discover innovative web development projects including PortMySim, SydneyEvent, and PixiSphere built with MERN stack.",
      keywords: "Web Development Projects, PortMySim, SydneyEvent, PixiSphere, MERN Stack Projects"
    },
    education: {
      title: "Education - Mukul Batra",
      description: "Academic background and educational journey of Mukul Batra in Computer Science and Engineering.",
      keywords: "Computer Science Education, TIT&S, B.Tech, Academic Background"
    },
    achievements: {
      title: "Achievements - Mukul Batra",
      description: "Awards and recognitions including Code War first position and Graphico Tech second position.",
      keywords: "Code War, Graphico Tech, Programming Competition, Design Competition, Awards"
    },
    experience: {
      title: "Experience - Mukul Batra",
      description: "Professional experience and freelance work in full-stack web development.",
      keywords: "Freelance Developer, Full-Stack Experience, Web Development Experience"
    },
    contact: {
      title: "Contact Mukul Batra - Full-Stack Developer",
      description: "Get in touch with Mukul Batra for web development projects and collaboration opportunities.",
      keywords: "Contact Mukul Batra, Hire Developer, Web Development Services, Collaboration"
    }
  }
};

export default seoConfig;