document.addEventListener("DOMContentLoaded", () => {
  const giftRequestForm = document.getElementById("giftRequestForm");
  const wishInput = document.getElementById("wishInput");
  const submitButton = document.querySelector(".submit-wish-button");
  const successMessage = document.getElementById("successMessage");
  const validationMessage = document.getElementById("validationMessage");
  const devMessage = document.getElementById("devMessage");
  const continueButton = document.getElementById("continueButton");

  if (!giftRequestForm) return;

  // Load Formspree endpoint from config
  const formspreeEndpoint = (typeof BirthdayConfig !== "undefined" && BirthdayConfig.formspreeEndpoint)
    ? BirthdayConfig.formspreeEndpoint
    : "";

  // Show development message if endpoint is empty
  if (!formspreeEndpoint) {
    devMessage.classList.add("is-visible");
  }

  // Handle form submission
  giftRequestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Hide previous messages
    validationMessage.classList.remove("is-visible");
    devMessage.classList.remove("is-visible");

    // Validate input
    const wishValue = wishInput.value.trim();
    if (!wishValue) {
      validationMessage.classList.add("is-visible");
      // Re-trigger shake animation
      validationMessage.style.animation = "none";
      setTimeout(() => {
        validationMessage.style.animation = "shake 0.5s ease";
      }, 10);
      return;
    }

    // Check if endpoint is configured
    if (!formspreeEndpoint) {
      devMessage.classList.add("is-visible");
      return;
    }

    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
      // Submit to Formspree
      const response = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          wish: wishValue,
          _subject: "Birthday Gift Request"
        })
      });

      if (response.ok) {
        // Success - hide form and show success message
        giftRequestForm.style.display = "none";
        successMessage.classList.add("is-visible");
        
        // Show continue button after a short delay
        setTimeout(() => {
          if (continueButton) {
            continueButton.classList.add("is-visible");
          }
        }, 500);
      } else {
        // Error - re-enable button and show error
        submitButton.disabled = false;
        submitButton.textContent = "Send My Wish 💌";
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      submitButton.disabled = false;
      submitButton.textContent = "Send My Wish 💌";
      alert("Something went wrong. Please try again.");
    }
  });

  // Clear validation message when user starts typing
  wishInput.addEventListener("input", () => {
    validationMessage.classList.remove("is-visible");
  });

  // Handle continue button click - navigate to ending.html
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      if (typeof navigateWithTransition === "function") {
        navigateWithTransition("ending.html");
      } else {
        window.location.href = "ending.html";
      }
    });
  }
});
