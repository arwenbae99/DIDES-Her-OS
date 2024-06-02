document.addEventListener("DOMContentLoaded", function() {
    const directionsElement = document.getElementById('directions');
    const answersDiv = document.getElementById('answerFlexbox');
    const transitionDiv = document.getElementById('transitionBox');
    const startButton = document.getElementById('start');
    let currentNodeId = null; // Track current node ID

    function loadNode(nodeId, storyData) {
        const node = storyData.nodes.find(n => n.id === nodeId);
        if (!node) return;

        console.log('Loading node:', nodeId);
        console.log('Node data:', node);

        // Store the current node ID
        currentNodeId = nodeId;

        // Set directions
        directionsElement.textContent = node.directions;

        // Update progress bar
        progressBar.style.width = node.progress + '%';

        // Clear previous answers
        answersDiv.innerHTML = '';

        // Show answers
        node.answers.forEach(answer => {
            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add('buttonAnswer');
            buttonDiv.innerHTML = `<p>${answer.text}</p>`;
            buttonDiv.onclick = () => {
                if (answer.url) {
                    transitionDiv.classList.add('fade-in-transitionBox');
                    setTimeout(function() {
                        // Second action
                        console.log("Transition Timeout");
                        // Redirect to the specified URL    window.location.href = answer.url;
                        window.location.href = answer.url;
                    }, 200); // Wait for 2 seconds (2000 milliseconds)
                    
                } else {
                    loadNode(answer.nextNode, storyData); // Load the next node
                }
            };
            answersDiv.appendChild(buttonDiv);
        });

        // Add fade-in class to show answers
        answersDiv.classList.add('fade-in');
    }

    // Function to start the story
    function startStory() {
        startButton.style.display = 'none'; // Hide the start button
        loadNode('1', storyData); // Start loading the first node
    }

    // Start the story when the start button is clicked
    startButton.addEventListener('click', startStory);

    // Load story data (assuming 'storyData' variable is accessible)
    fetch('scripts/data/storyIdex.json')
        .then(response => response.json())
        .then(storyData => {
            // Store the story data in a global variable
            window.storyData = storyData;
        })
        .catch(error => console.error('Error loading the story data:', error));
});
