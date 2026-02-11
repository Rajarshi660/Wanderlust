// Form Validation
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// Voice Assistant
const voiceBtn = document.getElementById("voice-btn");
const searchInput = document.querySelector(".search-inp");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition && voiceBtn) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.classList.add("voice-active");
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        voiceBtn.classList.remove("voice-active");
    };

    recognition.onspeechend = () => {
        recognition.stop();
        voiceBtn.classList.remove("voice-active");
    };
}