document.addEventListener("DOMContentLoaded", () => {
  const welcomeHeading = document.getElementById("welcomeHeading");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const welcomePhoto = document.getElementById("welcomePhoto");
  const subtext1 = document.getElementById("subtext1");
  const subtext2 = document.getElementById("subtext2");
  const secondaryMessage = document.getElementById("secondaryMessage");
  const continueButton = document.getElementById("continueButton");
  const buttonText = document.getElementById("buttonText");

  // Load configuration data
  const config = typeof BirthdayConfig !== "undefined" ? BirthdayConfig : null;
  const heading = config?.welcomeHeading || "Welcome, Bestie ❤️";
  const message = config?.welcomeMessage || "You made it... I hope you're ready for a little journey I made just for you. ✨";
  const photo = config?.welcomePhoto || "story/story_2.jpg";
  const subtext = config?.welcomeSubtext || [
    "Because you're not just a friend...",
    "You're one of my favorite people. ❤️"
  ];
  const secondary = config?.welcomeSecondaryMessage || "And this little surprise is only the beginning...";
  const btnText = config?.welcomeButtonText || "Continue ✨";

  // Set content from configuration
  if (welcomeHeading) welcomeHeading.textContent = heading;
  if (welcomeMessage) welcomeMessage.textContent = message;
  if (welcomePhoto) welcomePhoto.src = photo;
  if (subtext1) subtext1.textContent = subtext[0] || "";
  if (subtext2) subtext2.textContent = subtext[1] || "";
  if (secondaryMessage) secondaryMessage.textContent = secondary;
  if (buttonText) buttonText.textContent = btnText;

  // Handle continue button click
  if (continueButton) {
    continueButton.addEventListener("click", () => {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // Navigate to story.html using existing transition system
      if (typeof navigateWithTransition === "function") {
        navigateWithTransition("story.html");
      } else {
        window.location.href = "story.html";
      }
    });
  }
});
