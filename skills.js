document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    });
});



document.addEventListener("DOMContentLoaded", () => {
    const logEvent = (type, element) => {
      const timestamp = new Date().toISOString();
      const tagName = element.tagName.toLowerCase();
      let eventObject = "unknown";
  
      if (element.classList.contains("dropdown")) eventObject = "drop-down";
      else if (tagName === "img") eventObject = "image";
      else if (["p", "span", "h1", "h2", "h3", "h4", "h5"].includes(tagName)) eventObject = "text";
      else if (tagName === "a") eventObject = "link";
      else if (tagName === "button") eventObject = "button";
      else eventObject = tagName;
  
      console.log(`${timestamp}, ${type}, ${eventObject}`);
    };
  
    document.addEventListener("click", (e) => {
      logEvent("click", e.target);
    });
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          logEvent("view", entry.target);
        }
      });
    }, { threshold: 0.5 });
  
    document.querySelectorAll("img, p, h1, h2, h3, a, .dropdown, button").forEach(el => {
      observer.observe(el);
    });
  });