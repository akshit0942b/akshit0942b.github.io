// Algorithm Comparison Module

function openComparisonModal() {
    document.getElementById('comparisonModal').style.display = 'block';
    // Clear previous results
    document.getElementById('timeImages').innerHTML = '';
    document.getElementById('memoryImages').innerHTML = '';
}

function closeComparisonModal() {
    document.getElementById('comparisonModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('comparisonModal');
    if (event.target == modal) {
        closeComparisonModal();
    }
}

function loadComparison() {
    const distribution = document.getElementById('distributionSelect').value;
    const selectedAlgos = getSelectedAlgorithms();
    
    if (selectedAlgos.length === 0) {
        alert('Please select at least one algorithm to compare.');
        return;
    }
    
    if (selectedAlgos.length === 1) {
        alert('Please select at least two algorithms for comparison.');
        return;
    }
    
    displayComparison(distribution, selectedAlgos);
}

function getSelectedAlgorithms() {
    const checkboxes = document.querySelectorAll('.algorithm-checkboxes input[type="checkbox"]');
    const selected = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selected.push(checkbox.value);
        }
    });
    
    return selected;
}

function displayComparison(distribution, algorithms) {
    const timeImagesDiv = document.getElementById('timeImages');
    const memoryImagesDiv = document.getElementById('memoryImages');
    
    // Clear previous results
    timeImagesDiv.innerHTML = '';
    memoryImagesDiv.innerHTML = '';
    
    const basePath = `plots_latest1/${distribution}/`;
    
    // Create a comparison grid
    const timeContainer = document.createElement('div');
    timeContainer.className = 'image-grid';
    
    const memoryContainer = document.createElement('div');
    memoryContainer.className = 'image-grid';
    
    algorithms.forEach(algo => {
        // Time comparison
        const timeImgWrapper = document.createElement('div');
        timeImgWrapper.className = 'image-wrapper';
        
        const timeImg = document.createElement('img');
        timeImg.src = `${basePath}${algo}_Time.png`;
        timeImg.alt = `${algo} Time`;
        timeImg.className = 'zoomable-image';
        timeImg.onclick = function() {
            openLightbox(this.src, this.alt);
        };
        timeImg.onerror = function() {
            this.parentElement.innerHTML = `<div class="error-message">Image not found: ${algo}_Time.png</div>`;
        };
        
        const timeLabel = document.createElement('div');
        timeLabel.className = 'image-label';
        timeLabel.textContent = formatAlgorithmName(algo) + ' - Time';
        
        timeImgWrapper.appendChild(timeImg);
        timeImgWrapper.appendChild(timeLabel);
        timeContainer.appendChild(timeImgWrapper);
        
        // Memory comparison
        const memoryImgWrapper = document.createElement('div');
        memoryImgWrapper.className = 'image-wrapper';
        
        const memoryImg = document.createElement('img');
        memoryImg.src = `${basePath}${algo}_Memory.png`;
        memoryImg.alt = `${algo} Memory`;
        memoryImg.className = 'zoomable-image';
        memoryImg.onclick = function() {
            openLightbox(this.src, this.alt);
        };
        memoryImg.onerror = function() {
            this.parentElement.innerHTML = `<div class="error-message">Image not found: ${algo}_Memory.png</div>`;
        };
        
        const memoryLabel = document.createElement('div');
        memoryLabel.className = 'image-label';
        memoryLabel.textContent = formatAlgorithmName(algo) + ' - Memory';
        
        memoryImgWrapper.appendChild(memoryImg);
        memoryImgWrapper.appendChild(memoryLabel);
        memoryContainer.appendChild(memoryImgWrapper);
    });
    
    timeImagesDiv.appendChild(timeContainer);
    memoryImagesDiv.appendChild(memoryContainer);
    
    // Add distribution info
    const distInfo = document.createElement('div');
    distInfo.className = 'distribution-info';
    distInfo.innerHTML = `<strong>Distribution:</strong> ${formatDistributionName(distribution)}`;
    timeImagesDiv.insertBefore(distInfo, timeContainer);
}

function formatAlgorithmName(algo) {
    return algo.replace(/_/g, ' ');
}

function formatDistributionName(dist) {
    // Remove number prefix and format
    return dist.replace(/^\d+_/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Image Lightbox Functions
function openLightbox(src, caption) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    lightbox.style.display = 'flex';
    lightboxImg.src = src;
    lightboxCaption.textContent = caption;
    
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    lightbox.style.display = 'none';
    
    // Restore body scrolling
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the image
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('imageLightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});
