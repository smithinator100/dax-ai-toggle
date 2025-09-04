document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lottie animations
    const lottieContainer = document.getElementById('lottie-container');
    const lottieToggleContainer = document.getElementById('lottie-toggle-container');
    const dropdown = document.getElementById('top-corner-select');
    
    const starsAnimation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'lottie/stars.json'
    });
    
    let toggleAnimation = lottie.loadAnimation({
        container: lottieToggleContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'lottie/toggle-v2/toggle-v2.json'
    });
    
    // Play frames 1-30 on intro then stop (initial load is now toggle-v2)
    toggleAnimation.addEventListener('DOMLoaded', function() {
        toggleAnimation.playSegments([1, 30], true);
    });
    
    // Function to load new animation based on dropdown selection
    function loadNewAnimation(animationPath) {
        console.log('Loading animation:', animationPath);
        
        // Check if this is toggle-v3
        isToggleV3Active = animationPath.includes('toggle-v3');
        
        // Destroy current toggle animation
        if (toggleAnimation) {
            toggleAnimation.destroy();
        }
        
        // Determine animation settings based on file
        let animationSettings = {
            container: lottieToggleContainer,
            renderer: 'svg',
            path: animationPath,
            loop: isToggleV3Active, // Loop if toggle-v3 is active
            autoplay: isToggleV3Active // Autoplay if toggle-v3 is active
        };
        
        // Load new animation
        toggleAnimation = lottie.loadAnimation(animationSettings);
        
        // Keep buttons interactive regardless of toggle version
        searchImg.style.cursor = 'pointer';
        duckaiImg.style.cursor = 'pointer';
        
        // Add error handling
        toggleAnimation.addEventListener('config_ready', function() {
            console.log('Animation config ready:', animationPath);
        });
        
        toggleAnimation.addEventListener('data_ready', function() {
            console.log('Animation data ready:', animationPath);
        });
        
        toggleAnimation.addEventListener('DOMLoaded', function() {
            console.log('Animation DOM loaded:', animationPath);
            // Handle initial playback for toggle animations
            if (animationPath.includes('toggle') && !isToggleV3Active) {
                console.log('Playing segments [1, 30] for toggle animation');
                toggleAnimation.playSegments([1, 30], true);
            }
            // For toggle-v3, animation will autoplay and loop automatically
        });
        
        // Add error listener
        toggleAnimation.addEventListener('data_failed', function() {
            console.error('Failed to load animation:', animationPath);
        });
    }
    
    // Add dropdown change event listener
    dropdown.addEventListener('change', function() {
        const selectedPath = this.value;
        loadNewAnimation(selectedPath);
    });
    
    const searchImg = document.getElementById('search-img');
    const duckaiImg = document.getElementById('duckai-img');
    
    // State to track current mode
    let isSearchActive = false;
    let isToggleV3Active = false;
    
    function toggleImages() {
        if (isSearchActive) {
            // Switch back to search-inactive and duckai-active
            searchImg.src = 'img/search-inactive.png';
            searchImg.alt = 'Search Inactive';
            duckaiImg.src = 'img/duckai-active.png';
            duckaiImg.alt = 'DuckAI Active';
            isSearchActive = false;
        } else {
            // Switch to search-active and duckai-inactive
            searchImg.src = 'img/search-active.png';
            searchImg.alt = 'Search Active';
            duckaiImg.src = 'img/duckai-inactive.png';
            duckaiImg.alt = 'DuckAI Inactive';
            isSearchActive = true;
        }
    }
    
    // Add click event listeners
    searchImg.addEventListener('click', function() {
        if (!isSearchActive) {
            // Only play animation segments if not toggle-v3
            if (!isToggleV3Active) {
                // Search was inactive, now switching to search active - play frames 30-60
                toggleAnimation.playSegments([30, 60], true);
            }
            toggleImages();
        }
    });
    
    duckaiImg.addEventListener('click', function() {
        if (isSearchActive) {
            // Only play animation segments if not toggle-v3
            if (!isToggleV3Active) {
                // DuckAI was inactive, now switching to duckai active - play frames 0-30
                toggleAnimation.playSegments([0, 30], true);
            }
            toggleImages();
        }
    });
    
    // Initialize cursor styles based on default selection (toggle-v2)
    searchImg.style.cursor = 'pointer';
    duckaiImg.style.cursor = 'pointer';
});
