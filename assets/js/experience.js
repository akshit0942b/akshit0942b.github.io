AOS.init();

//  Work experience cards

const experiencecards = document.querySelector(".experience-cards");
const exp = [
  {
    title: "IOT Project Developer",
    cardImage: "assets/images/experience-page/flipkart.jpg",
    place: "IIIT Hyderabad",
    time: "(feb, 2025 - april, 2025)",
    desp: "<li>Our IoT-based Warehouse Management System automates pharmaceutical storage using sensors, RFID, and ESP32 microcontrollers.</li><li>We integrated Meta’s LLaVA (LLaMA Vision Assistant) model for real-time OCR and visual classification of chemical labels.</li> <li>This enables intelligent, safe, and efficient compartment control based on chemical properties.</li>",
  },
  {
    title: "",
    cardImage: "assets/images/experience-page/gsoc.png",
    place: "",
    time: "",
    desp: "",
  },
  {
    title: "",
    cardImage: "assets/images/experience-page/IIT_Bombay.jpg",
    place: "",
    time: "",
    desp: "",
  },
];

const showCards2 = () => {
  let output = "";
  exp.forEach(
    ({ title, cardImage, place, time, desp }) =>
      (output += `        
    <div class="col gaap" data-aos="fade-up" data-aos-easing="linear" data-aos-delay="100" data-aos-duration="400"> 
      <div class="card card1">
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
      </div>
    </div>
      `)
  );
  experiencecards.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards2);

// Volunteership Cards

const volunteership = document.querySelector(".volunteership");
const volunteershipcards = [
  {
    title: "C++ & Data Structures",
    cardImage: "assets/images/experience-page/1.jpg",
    description:
      "Strong command over C++ and core data structures, enabling efficient problem-solving and algorithm design.",
  },
  {
    title: "Python & Computer Vision",
    cardImage: "assets/images/experience-page/2.jpg",
    description:
      "Experienced in Python with OpenCV and MediaPipe for real-time gesture recognition and modelling.",
  },
  {
    title: "Full Stack Development",
    cardImage: "assets/images/experience-page/3.jpg",
    description:
      "Building dynamic websites using HTML, CSS, JavaScript, React, and backend APIs for Web dashboards.",
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
    title: "Kaggle",
    subtitle: "Participant",
    image: "assets/images/experience-page/ulhacks.png",
    desp: "Nk Secutities organized a hackathon to build a model predicting missing implied volatility values for NIFTY50 index options using high-frequency trading data. The goal is to reconstruct the market’s volatility surface accurately, optimizing for mean squared error.",
    href: "https://www.kaggle.com/competitions/nk-iv-prediction/overview",
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
};
document.addEventListener("DOMContentLoaded", showCards3);
