document.addEventListener("DOMContentLoaded", function() {
    const audioPlayer = document.getElementById('audioPlayer');
    const answersDiv = document.getElementById('answerFlexbox');
    const transitionDiv = document.getElementById('transitionBox');
    const replayButton = document.getElementById('replay');
    const startButton = document.getElementById('start');
    const svgCircle = document.querySelector("#visualizer circle");
    let currentNodeId = null; // Track current node ID

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaElementSource(audioPlayer);
    const analyser = audioContext.createAnalyser();

    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function animate() {
        requestAnimationFrame(animate);

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const newRadius = 50 + average / 5;
        svgCircle.setAttribute("r", newRadius);
    }

    audioPlayer.onplay = () => {
        audioContext.resume().then(() => {
            animate();
        });
    };

    
    

    function loadNode(nodeId, storyData) {
        const node = storyData.nodes.find(n => n.id === nodeId);
        if (!node) return;

        // Add fade-in class to show answers
        answersDiv.classList.remove('fade-in');


        console.log('Loading node:', nodeId);
        console.log('Node data:', node);

        // Store the current node ID
        currentNodeId = nodeId;

        // Clear previous answers and remove fade-in class
        answersDiv.innerHTML = '';
        answersDiv.classList.remove('fade-out');

        // Set audio source and preload
        audioPlayer.src = node.audio;
        audioPlayer.preload = 'auto';

        // Play audio
        audioPlayer.play();

        // Show answers after audio ends
        audioPlayer.onended = () => {
            node.answers.forEach(answer => {
                const buttonDiv = document.createElement('div');
                buttonDiv.classList.add('buttonAnswer');
                buttonDiv.innerHTML = `<p>${answer.text}</p>`;
                buttonDiv.onclick = () => {
                    if (answer.url) {
                        window.location.href = answer.url;
                    } else {
                        loadNode(answer.nextNode, storyData); // Load the next node
                    }
                };
                answersDiv.appendChild(buttonDiv);
            });

            // Trigger reflow to restart the animation
            void answersDiv.offsetWidth;

            // Add fade-in class to show answers
            answersDiv.classList.add('fade-in');
        };
    }

    // Function to start the story
    function startStory() {
        startButton.style.display = 'none'; // Hide the start button
        loadNode('1', storyData); // Start loading the first node
    }

    // Start the story when the start button is clicked
    startButton.addEventListener('click', startStory);

    // Replay the current audio when the replay button is clicked
    replayButton.addEventListener('click', function() {
        // Clear previous answers and remove fade-in class
        answersDiv.innerHTML = '';
        answersDiv.classList.remove('fade-in');

        // Ensure that the current node ID is not null before replaying
        if (currentNodeId) {
            // Reset audio to the beginning
            audioPlayer.currentTime = 0;
            // Replay the audio
            audioPlayer.play();
        }
    });

    // Load story data (assuming 'storyData' variable is accessible)
    fetch('scripts/data/storyDataSteve.json')
        .then(response => response.json())
        .then(storyData => {
            // Store the story data in a global variable
            window.storyData = storyData;
        })
        .catch(error => console.error('Error loading the story data:', error));
});
