document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const basicStats = document.getElementById('basicStats');
    const pronounsStats = document.getElementById('pronounsStats');
    const prepositionsStats = document.getElementById('prepositionsStats');
    const articlesStats = document.getElementById('articlesStats');

    analyzeBtn.addEventListener('click', analyzeText);
    clearBtn.addEventListener('click', clearAll);

    function analyzeText() {
        const text = textInput.value.trim();
        
        if (!text) {
            alert('Please enter some text to analyze.');
            return;
        }

        // Basic statistics
        const letters = text.replace(/[^a-zA-Z]/g, '').length;
        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        const spaces = text.split(' ').length - 1;
        const newlines = text.split('\n').length - 1;
        const specialSymbols = text.replace(/[a-zA-Z0-9\s]/g, '').length;

        displayBasicStats(letters, words, spaces, newlines, specialSymbols);

        // Advanced analysis
        const tokens = text.toLowerCase().match(/\b[\w']+\b/g) || [];

        // Pronouns analysis
        const pronouns = ['i', 'me', 'my', 'mine', 'myself', 
                         'you', 'your', 'yours', 'yourself', 'yourselves',
                         'he', 'him', 'his', 'himself',
                         'she', 'her', 'hers', 'herself',
                         'it', 'its', 'itself',
                         'we', 'us', 'our', 'ours', 'ourselves',
                         'they', 'them', 'their', 'theirs', 'themselves'];
        
        const pronounCounts = countWords(tokens, pronouns);
        displayWordStats(pronounCounts, pronounsStats, 'pronoun');

        // Prepositions analysis
        const prepositions = ['aboard', 'about', 'above', 'across', 'after', 'against', 
                            'along', 'amid', 'among', 'around', 'as', 'at', 'before', 
                            'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 
                            'but', 'by', 'concerning', 'considering', 'despite', 'down', 
                            'during', 'except', 'for', 'from', 'in', 'inside', 'into', 
                            'like', 'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 
                            'over', 'past', 'regarding', 'round', 'since', 'through', 
                            'throughout', 'to', 'toward', 'under', 'underneath', 'until', 
                            'unto', 'up', 'upon', 'with', 'within', 'without'];
        
        const prepositionCounts = countWords(tokens, prepositions);
        displayWordStats(prepositionCounts, prepositionsStats, 'preposition');

        // Articles analysis
        const articles = ['a', 'an', 'the'];
        const articleCounts = countWords(tokens, articles);
        displayWordStats(articleCounts, articlesStats, 'article');
    }

    function countWords(tokens, wordList) {
        const counts = {};
        
        wordList.forEach(word => {
            counts[word] = 0;
        });

        tokens.forEach(token => {
            if (wordList.includes(token)) {
                counts[token]++;
            }
        });

        // Filter out words with zero counts and sort by count descending
        return Object.entries(counts)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1]);
    }

    function displayBasicStats(letters, words, spaces, newlines, specialSymbols) {
        basicStats.innerHTML = `
            <div class="stat-card">
                <h3>Letters</h3>
                <p>${letters.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Words</h3>
                <p>${words.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Spaces</h3>
                <p>${spaces.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>New Lines</h3>
                <p>${newlines.toLocaleString()}</p>
            </div>
            <div class="stat-card">
                <h3>Special Symbols</h3>
                <p>${specialSymbols.toLocaleString()}</p>
            </div>
        `;
    }

    function displayWordStats(wordCounts, element, type) {
        if (wordCounts.length === 0) {
            element.innerHTML = `<p>No ${type}s found in the text.</p>`;
            return;
        }

        const list = document.createElement('ul');
        list.className = 'word-list';

        wordCounts.forEach(([word, count]) => {
            const item = document.createElement('li');
            item.className = 'word-item';
            item.innerHTML = `
                <span class="word-text">${word}</span>
                <span class="word-count">${count}</span>
            `;
            list.appendChild(item);
        });

        element.innerHTML = '';
        element.appendChild(list);
    }

    function clearAll() {
        textInput.value = '';
        basicStats.innerHTML = '';
        pronounsStats.innerHTML = '';
        prepositionsStats.innerHTML = '';
        articlesStats.innerHTML = '';
    }
});