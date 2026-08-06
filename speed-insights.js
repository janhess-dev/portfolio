// Initialize Vercel Speed Insights
(function() {
    // Initialize the Speed Insights queue
    window.si = window.si || function () { 
        (window.siq = window.siq || []).push(arguments); 
    };
    
    // Load the Speed Insights script
    var script = document.createElement('script');
    script.defer = true;
    script.src = '/_vercel/speed-insights/script.js';
    document.head.appendChild(script);
})();
