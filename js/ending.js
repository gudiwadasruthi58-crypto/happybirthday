document.addEventListener("DOMContentLoaded", () => {
  const endingMontage = document.getElementById("endingMontage");
  const endingStars = document.getElementById("endingStars");
  const messageLines = document.querySelectorAll(".message-line");
  const signature = document.querySelector(".signature");

  if (!messageLines.length) return;

  // 1. Spawns Twinkling Stars
  function spawnStars() {
    if (!endingStars) return;
    endingStars.innerHTML = "";
    const count = 45;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${0.1 + Math.random() * 0.2}rem`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * -5}s`;
      star.style.animationDuration = `${2 + Math.random() * 4}s`;
      fragment.appendChild(star);
    }
    endingStars.appendChild(fragment);
  }

  // 2. Build Photo Montage Slideshow
  function photoBackground(photo, fallbackIndex) {
    if (photo) {
      return `url("${photo}")`;
    }
    const gradients = [
      "radial-gradient(circle at 50% 50%, rgba(20, 8, 22, 0.4) 0%, rgba(6, 3, 8, 0.8) 100%), linear-gradient(135deg, #4a154b, #1a052e)",
      "radial-gradient(circle at 50% 50%, rgba(20, 8, 22, 0.4) 0%, rgba(6, 3, 8, 0.8) 100%), linear-gradient(135deg, #1b0a2a, #030006)",
      "radial-gradient(circle at 50% 50%, rgba(20, 8, 22, 0.4) 0%, rgba(6, 3, 8, 0.8) 100%), linear-gradient(135deg, #2a083d, #08020a)",
      "radial-gradient(circle at 50% 50%, rgba(20, 8, 22, 0.4) 0%, rgba(6, 3, 8, 0.8) 100%), linear-gradient(135deg, #3d002a, #0a0007)",
    ];
    return gradients[fallbackIndex % gradients.length];
  }

  function startSlideshow() {
    if (!endingMontage) return;
    
    // Gather all photos from configuration
    const photos = [];
    if (typeof BirthdayConfig !== "undefined") {
      if (BirthdayConfig.memoryTimeline) {
        BirthdayConfig.memoryTimeline.forEach(item => {
          if (item.photo) photos.push(item.photo);
        });
      }
    }

    // Fallback: If no custom photos are provided, generate gradient slides
    const totalSlides = photos.length > 0 ? photos.length : 4;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < totalSlides; i++) {
      const frame = document.createElement("div");
      frame.className = "montage-photo";
      const photoPath = photos[i] || "";
      frame.style.setProperty("--photo-bg", photoBackground(photoPath, i));
      fragment.appendChild(frame);
    }
    endingMontage.appendChild(fragment);

    const slides = document.querySelectorAll(".montage-photo");
    if (slides.length === 0) return;

    let currentIndex = 0;
    slides[0].classList.add("is-active");

    setInterval(() => {
      slides[currentIndex].classList.remove("is-active");
      currentIndex = (currentIndex + 1) % slides.length;
      
      // Force scaling reset for Ghibli Ken Burns zoom feel
      slides[currentIndex].style.transition = "none";
      slides[currentIndex].style.transform = "scale(1.08)";
      void slides[currentIndex].offsetWidth; // reflow
      
      slides[currentIndex].style.transition = "";
      slides[currentIndex].classList.add("is-active");
    }, 6000);
  }

  // 3. Play ending message sequence - reveal lines one by one
  function playMessageSequence() {
    let lineIndex = 0;
    const lineDelay = 2500; // 2.5 seconds between each line

    const showNextLine = () => {
      if (lineIndex < messageLines.length) {
        messageLines[lineIndex].classList.add("is-visible");
        lineIndex++;
        setTimeout(showNextLine, lineDelay);
      } else {
        // After all lines are shown, show signature
        setTimeout(() => {
          if (signature) {
            signature.classList.add("is-visible");
          }
          
          // Fade out background music after signature appears
          setTimeout(() => {
            if (typeof fadeOutMusic === "function") {
              fadeOutMusic(4000); // 4-second gentle fade out
            }
          }, 3000);
        }, 1500);
      }
    };

    // Start sequence after initial delay
    setTimeout(showNextLine, 1000);
  }

  // Set dark body explicitly
  document.body.classList.add("is-dark");

  spawnStars();
  startSlideshow();
  playMessageSequence();
});
