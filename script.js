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
        path: 'lottie/toggle-v4/toggle-v4.json'
    });
    
    // Set initial state for toggle-v4
    let isToggleV4Active = true;
    
    // Play frames 1-30 on intro then loop the rest (initial load is now toggle-v4)
    let hasIntroPlayed = false;
    
    toggleAnimation.addEventListener('DOMLoaded', function() {
        console.log('Playing intro [1, 30] for toggle-v4, then looping rest');
        
        // Play intro without forcing complete
        toggleAnimation.playSegments([1, 30], false);
        
        // Listen for when animation reaches frame 30
        toggleAnimation.addEventListener('enterFrame', function checkFrame() {
            const currentFrame = Math.floor(toggleAnimation.currentFrame);
            
            if (currentFrame >= 30 && !hasIntroPlayed) {
                console.log('Reached frame 30, starting continuous loop');
                hasIntroPlayed = true;
                
                // Remove this listener
                toggleAnimation.removeEventListener('enterFrame', checkFrame);
                
                // Get total frames
                const totalFrames = toggleAnimation.totalFrames;
                console.log('Total frames:', totalFrames, 'Setting up loop from frame 30');
                
                // Set up loop for frames 30 onwards and play continuously
                toggleAnimation.playSegments([30, totalFrames - 1], true);
                
                // Add complete listener to restart from frame 30 when it finishes
                toggleAnimation.addEventListener('complete', function restartLoop() {
                    console.log('Loop complete, restarting from frame 30');
                    toggleAnimation.goToAndPlay(30, false);
                });
            }
        });
    });
    
    // Function to load new animation based on dropdown selection
    function loadNewAnimation(animationPath) {
        console.log('Loading animation:', animationPath);
        
        // Check if this is toggle-v3 or toggle-v4
        isToggleV3Active = animationPath.includes('toggle-v3');
        isToggleV4Active = animationPath.includes('toggle-v4');
        
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
            if (animationPath.includes('toggle') && !isToggleV3Active && !isToggleV4Active) {
                console.log('Playing segments [1, 30] for toggle animation');
                toggleAnimation.playSegments([1, 30], true);
            }
            // For toggle-v4, play intro then loop the rest
            else if (isToggleV4Active) {
                console.log('Playing intro [1, 30] for toggle-v4, then looping rest');
                let hasNewIntroPlayed = false;
                
                // Play intro without forcing complete
                toggleAnimation.playSegments([1, 30], false);
                
                // Listen for when animation reaches frame 30
                toggleAnimation.addEventListener('enterFrame', function checkFrame() {
                    const currentFrame = Math.floor(toggleAnimation.currentFrame);
                    
                    if (currentFrame >= 30 && !hasNewIntroPlayed) {
                        console.log('Reached frame 30, starting continuous loop');
                        hasNewIntroPlayed = true;
                        
                        // Remove this listener
                        toggleAnimation.removeEventListener('enterFrame', checkFrame);
                        
                        // Get total frames
                        const totalFrames = toggleAnimation.totalFrames;
                        console.log('Total frames:', totalFrames, 'Setting up loop from frame 30');
                        
                        // Set up loop for frames 30 onwards and play continuously
                        toggleAnimation.playSegments([30, totalFrames - 1], true);
                        
                        // Add complete listener to restart from frame 30 when it finishes
                        toggleAnimation.addEventListener('complete', function restartLoop() {
                            console.log('Loop complete, restarting from frame 30');
                            toggleAnimation.goToAndPlay(30, false);
                        });
                    }
                });
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
            // Only play animation segments if not toggle-v3 or toggle-v4
            if (!isToggleV3Active && !isToggleV4Active) {
                // Search was inactive, now switching to search active - play frames 30-60
                toggleAnimation.playSegments([30, 60], true);
            }
            toggleImages();
        }
    });
    
    duckaiImg.addEventListener('click', function() {
        if (isSearchActive) {
            // Only play animation segments if not toggle-v3 or toggle-v4
            if (!isToggleV3Active && !isToggleV4Active) {
                // DuckAI was inactive, now switching to duckai active - play frames 0-30
                toggleAnimation.playSegments([0, 30], true);
            }
            toggleImages();
        }
    });
    
    // Initialize cursor styles based on default selection (toggle-v4)
    searchImg.style.cursor = 'pointer';
    duckaiImg.style.cursor = 'pointer';
});
