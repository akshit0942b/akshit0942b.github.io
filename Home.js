document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    // themeToggle.innerHTML = '<span>Toggle Theme</span>';
    document.body.appendChild(themeToggle);
    
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







function analyzeText() {
    const text = document.getElementById("textInput").value;
    const output = document.getElementById("output");

    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const words = (text.match(/\b\w+\b/g) || []).length;
    const spaces = (text.match(/ /g) || []).length;
    const newlines = (text.match(/\n/g) || []).length;
    const specialSymbols = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;

    const pronounsList = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs'];
    const prepositionsList = ['in', 'on', 'at', 'since', 'for', 'ago', 'before', 'to', 'past', 'by', 'under', 'over', 'with', 'without', 'about', 'against', 'among', 'between', 'into', 'through', 'during', 'until', 'of', 'off'];
    const articlesList = ['a', 'an'];

    const wordTokens = text.toLowerCase().match(/\b\w+\b/g) || [];

    const countOccurrences = (tokens, list) =>
        list.reduce((acc, word) => {
            acc[word] = tokens.filter(t => t === word).length;
            return acc;
        }, {});

    const pronounCounts = countOccurrences(wordTokens, pronounsList);
    const prepositionCounts = countOccurrences(wordTokens, prepositionsList);
    const articleCounts = countOccurrences(wordTokens, articlesList);

    // Display Output
    output.innerHTML = `
<b>📊 Basic Stats</b><br>
Letters: ${letters} <br>
Words: ${words} <br>
Spaces: ${spaces} <br>
Newlines: ${newlines} <br>
Special Symbols: ${specialSymbols} <br><br>

<b>👤 Pronouns Count:</b><br>${JSON.stringify(pronounCounts, null, 2)}<br><br>
<b>📍 Prepositions Count:</b><br>${JSON.stringify(prepositionCounts, null, 2)}<br><br>
<b>📄 Indefinite Articles Count:</b><br>${JSON.stringify(articleCounts, null, 2)}<br>
    `;
}

