document.addEventListener("DOMContentLoaded", function() {
  const transitionDivGrey = document.getElementById('transitionBoxGrey');

  // Function to handle link clicks
  function handleLinkClick(event) {
      const target = event.target;

      // Check if the clicked element is an anchor tag with an href attribute
      if (target.tagName === 'A' && target.href) {
          event.preventDefault(); // Prevent the default link behavior

          const url = target.href;

          // Apply the fade-in transition effect
          transitionDivGrey.classList.add('fade-in-transitionBox');

          // Redirect to the specified URL after the transition
          setTimeout(function() {
              console.log("Transition Timeout");
              window.location.href = url;
          }, 200); // Wait for 2 seconds (2000 milliseconds)
      }
  }

  // Attach the click event listener to the entire document
  document.addEventListener('click', handleLinkClick);
});