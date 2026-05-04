AOS.init();

//  Work experience cards

const experiencecards = document.querySelector(".experience-cards");
const exp = [
  {
    title: "IOT Project",
    cardImage: "assets/images/experience-page/flipkart.jpg",
    place: "IIIT Hyderabad",
    time: "(feb, 2025 - april, 2025)",
    desp: "<li>Our IoT-based Warehouse Management System automates pharmaceutical storage using sensors, RFID, and ESP32 microcontrollers.</li><li>We integrated Meta's LLaVA (LLaMA Vision Assistant) model for real-time OCR and visual classification of chemical labels.</li><li>This enables intelligent, safe, and efficient compartment control based on chemical properties.</li>",
    link: "https://github.com/MukundHebbar/Symbiots.git",
  },
  {
    title: "Hustlr",
    cardImage: "assets/images/experience-page/hustlr.png",
    place: "Web Frontend Lead",
    time: "Jan 2025 - Present",
    desp: "<li>Leading frontend development for hustlr web connecting clients with student talent.</li><li>Designed and implemented scalable, responsive UI for user/client onboarding and project workflows.</li><li>Collaborated with backend and product teams to improve user experience and platform usability.</li>",
    link: "#",
  },
  {
    title: "QIDK",
    cardImage: "assets/images/experience-page/innovators4.jpeg",
    place: "Qualcomm, Hyderabad",
    time: "Aug 2025 - Dec, 2025",
    desp: "<li>AI Tutor leverages Qualcomm's on-device intelligence for personalized, privacy-first educational experiences.</li><li>Students upload PDFs generating quizzes and flashcards using optimized CPU GPU NPU.</li><li>Context-aware learning adapts to individual progress eliminating cloud dependency and latency.</li><li>Energy-efficient JNIE inference delivers instant responses while maintaining complete user data privacy.</li>",
    link: "https://github.com/akshit0942b/QIDK-ATOM.git",
  },
];


const showCards2 = () => {
  let output = "";
  exp.forEach(
    ({ title, cardImage, place, time, desp, link }) => {
      const cardContent = `
        <img src="${cardImage}" class="featured-image"/>
        <article class="card-body">
          <header>
            <div class="title">
              <h3>${title}</h3>
            </div>
            <p class="meta">
              <span class="pre-heading">${place}</span><br>
              <span class="author">${time}</span>
            </p>
            <ol>
              ${desp}
            </ol>
          </header>
        </article>
      `;
      
      if (link) {
        output += `        
    <div class="col gaap" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="400"> 
      <a href="${link}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit;">
        <div class="card card1" style="cursor: pointer; transition: transform 0.3s ease;" 
             onmouseover="this.style.transform='translateY(-10px)'" 
             onmouseout="this.style.transform='translateY(0)'">
          ${cardContent}
        </div>
      </a>
    </div>
      `;
      } else {
        output += `        
    <div class="col gaap" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="400"> 
      <div class="card card1">
        ${cardContent}
      </div>
    </div>
      `;
      }
    }
  );
  experiencecards.innerHTML = output;
  // Refresh AOS to animate the newly added cards
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
};
document.addEventListener("DOMContentLoaded", showCards2);

// Volunteership Cards

const volunteership = document.querySelector(".volunteership");
const volunteershipcards = [
  {
    title: "Programming & Algorithms",
    cardImage: "assets/images/experience-page/1.jpg",
    description:
      "Strong command over C++ and Python, enabling efficient problem-solving, algorithm design, and core data structures.",
  },
  {
    title: "Deep Learning & Vision",
    cardImage: "assets/images/experience-page/2.jpg",
    description:
      "Experienced in PyTorch, Neural Nets, Vision Architectures, and Transformers for building advanced AI models.",
  },
  {
    title: "Full Stack Development",
    cardImage: "assets/images/experience-page/3.jpg",
    description:
      "Building dynamic, scalable websites and applications using React, TypeScript, HTML, CSS, and modern backend APIs.",
  },
];

const showCards = () => {
  let output = "";
  volunteershipcards.forEach(
    ({ title, cardImage, description }) =>
      (output += `        
      <div class="card volunteerCard" data-aos="fade-down" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="600" style="height: 550px;width:400px">
      
      <img src="${cardImage}" height="250" width="65" class="card-img" style="border-radius:10px">
      <div class="content">
          <h2 class="volunteerTitle">${title}</h2><br>
          <p class="copy">${description}</p></div>
      
      </div>
      `)
  );
  volunteership.innerHTML = output;
  // Refresh AOS to animate the newly added cards
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
};
document.addEventListener("DOMContentLoaded", showCards);

// Hackathon Section

const hackathonsection = document.querySelector(".hackathon-section");
const mentor = [
  {
    title: "E-Cell Megathon",
    subtitle: "Participant",
    image: "assets/images/experience-page/uplift.png",
    desp: "Megathon, IIIT Hyderabad's flagship event is a 24 hour long hackathon organized with an aim to enable students to meet, ideate, and hack.",
    href: "https://megathon.in",
  },
  {
    title: "The 2026 NeuroGolf Championship",
    subtitle: "THE NEUROSYNTHETIC RESEARCH INSTITUTE · RESEARCH PREDICTION COMPETITION",
    image: "assets/images/experience-page/neurogolf.png",
    desp: "Design the smallest neural networks to solve ARC-AGI image transformations. (2 MONTHS TO GO)",
    href: "https://www.kaggle.com/competitions/neurogolf-2026/overview",
  },
];

const showCards3 = () => {
  let output = "";
  mentor.forEach(
    ({ title, image, subtitle, desp, href }) =>
      (output += `  
      <div class="blog-slider__item swiper-slide">
        <div class="blog-slider__img">
            <img src="${image}" alt="">
        </div>
        <div class="blog-slider__content">
          <div class="blog-slider__title">${title}</div>
          <span class="blog-slider__code">${subtitle}</span>
          <div class="blog-slider__text">${desp}</div>
          <a href="${href}" class="blog-slider__button">Read More</a>   
        </div>
      </div>
      `)
  );
  hackathonsection.innerHTML = output;
  // Refresh AOS to animate the newly added content
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }
  if (typeof swiper !== 'undefined') {
    swiper.update();
  }
};
document.addEventListener("DOMContentLoaded", showCards3);
