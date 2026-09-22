document.addEventListener("DOMContentLoaded", () => {
  const portraitImage = document.getElementById("portraitImage");
  const message1 = document.getElementById("message1");
  const message2 = document.getElementById("message2");
  const message3 = document.getElementById("message3");
  const passwordSection = document.getElementById("passwordSection");
  const passwordInput = document.getElementById("passwordInput");
  const submitPassword = document.getElementById("submitPassword");
  const passwordMessage = document.getElementById("passwordMessage");
  const passwordCard = document.querySelector(".password-card");

  let passwordSectionRevealed = false;
  let isSubmitting = false;

  // 1. Load configuration data
  const config = typeof BirthdayConfig !== "undefined" ? BirthdayConfig : null;
  const portraitPhoto = config?.portraitPhoto || "story/story_1.jpg";
  const messages = config?.openingMessages || ["Hey there ❤️", "I made something special for you...", "Scroll down ↓"];
  const correctPassword = config?.unlockPassword || "01-01-2000";
  const wrongMessages = config?.wrongPasswordMessages || [
    "Hmm, that's not quite right 🤔",
    "Try again 💕",
    "Almost there... ✨",
    "Think harder 🎂"
  ];

  // 2. Set portrait image
  if (portraitImage) {
    portraitImage.src = portraitPhoto;
  }

  // 3. Display opening messages
  if (message1) message1.textContent = messages[0] || "";
  if (message2) message2.textContent = messages[1] || "";
  if (message3) message3.textContent = messages[2] || "";

  // 4. Start background music
  if (typeof startGlobalMusic === "function") {
    startGlobalMusic();
  }

  // 5. Scroll detection to reveal password section
  function handleScroll() {
    if (passwordSectionRevealed) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollThreshold = windowHeight * 0.3; // Reveal after scrolling 30% of viewport

    if (scrollPosition > scrollThreshold) {
      revealPasswordSection();
    }
  }

  function revealPasswordSection() {
    passwordSectionRevealed = true;
    if (passwordSection) {
      passwordSection.classList.add("is-revealed");
      passwordSection.setAttribute("aria-hidden", "false");
    }
    // Smooth scroll to password section
    setTimeout(() => {
      if (passwordSection) {
        passwordSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  }

  // Add scroll listener with passive for performance
  window.addEventListener("scroll", handleScroll, { passive: true });

  // 5. Password validation
  function validatePassword() {
    if (isSubmitting) return;

    const enteredPassword = passwordInput?.value.trim();
    
    if (!enteredPassword) {
      showPasswordMessage("Please enter your birthday 🎂", "error");
      shakeInput();
      return;
    }

    isSubmitting = true;

    if (enteredPassword === correctPassword) {
      // Success path
      showPasswordMessage("That's perfect! ✨", "success");
      passwordCard?.classList.add("is-success");
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Navigate to gift.html after success animation
      setTimeout(() => {
        if (typeof navigateWithTransition === "function") {
          navigateWithTransition("gift.html");
        } else {
          window.location.href = "gift.html";
        }
      }, 1500);
    } else {
      // Error path
      isSubmitting = false;
      const randomMessage = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      showPasswordMessage(randomMessage, "error");
      shakeInput();
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }

  function showPasswordMessage(text, type) {
    if (!passwordMessage) return;
    
    passwordMessage.textContent = text;
    passwordMessage.classList.remove("is-error", "is-success", "is-visible");
    
    // Force reflow
    void passwordMessage.offsetWidth;
    
    passwordMessage.classList.add("is-visible");
    if (type === "error") {
      passwordMessage.classList.add("is-error");
    } else if (type === "success") {
      passwordMessage.classList.add("is-success");
    }
  }

  function shakeInput() {
    if (!passwordInput) return;
    
    passwordInput.classList.remove("is-shake");
    void passwordInput.offsetWidth; // Force reflow
    passwordInput.classList.add("is-shake");
    
    setTimeout(() => {
      passwordInput.classList.remove("is-shake");
    }, 500);
  }

  // 6. Event listeners
  if (submitPassword) {
    submitPassword.addEventListener("click", validatePassword);
  }

  if (passwordInput) {
    // Allow Enter key to submit
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        validatePassword();
      }
    });

    // Auto-format date input as DD-MM-YYYY
    passwordInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      
      if (value.length >= 2) {
        value = value.slice(0, 2) + "-" + value.slice(2);
      }
      if (value.length >= 5) {
        value = value.slice(0, 5) + "-" + value.slice(5, 9);
      }
      
      e.target.value = value.slice(0, 10);
    });
  }
});
