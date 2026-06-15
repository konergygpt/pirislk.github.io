// Interactions used only by index.html.

function setupPirisTypingLine() {
  const typingTarget = document.querySelector("[data-piris-typing]");

  if (!typingTarget) {
    return;
  }

  const phrases = [
    "готовые решения НКУ",
    "документация для проекта",
    "спецификации, схемы и чертежи",
    "поддержка инженеров PIRIS",
  ];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    typingTarget.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let letterIndex = phrases[0].length;
  let isDeleting = false;

  function typeNextFrame() {
    const phrase = phrases[phraseIndex];

    typingTarget.textContent = phrase.slice(0, letterIndex);

    if (!isDeleting && letterIndex < phrase.length) {
      letterIndex += 1;
      window.setTimeout(typeNextFrame, 54);
      return;
    }

    if (!isDeleting) {
      isDeleting = true;
      window.setTimeout(typeNextFrame, 1350);
      return;
    }

    if (letterIndex > 0) {
      letterIndex -= 1;
      window.setTimeout(typeNextFrame, 30);
      return;
    }

    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    window.setTimeout(typeNextFrame, 260);
  }

  typeNextFrame();
}

setupPirisTypingLine();

function setupLandingScrollHero() {
  const hero = document.querySelector("[data-landing-scroll-hero]");

  if (!hero) {
    return;
  }

  const steps = Array.from(hero.querySelectorAll("[data-landing-hero-step]"));
  const cards = Array.from(hero.querySelectorAll("[data-landing-hero-card]"));

  if (!steps.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isTicking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setActiveStep(activeIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("is-active", index === activeIndex);
    });

    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === activeIndex);
    });
  }

  function updateHero() {
    const heroRect = hero.getBoundingClientRect();
    const scrollableDistance = Math.max(hero.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-heroRect.top / scrollableDistance, 0, 1);
    const rawStep = progress * (steps.length - 1);
    const activeIndex = clamp(Math.round(rawStep), 0, steps.length - 1);

    hero.style.setProperty("--landing-hero-progress", progress.toFixed(4));
    setActiveStep(activeIndex);

    if (!prefersReducedMotion) {
      steps.forEach((step, index) => {
        const distance = index - rawStep;
        const opacity = clamp(1 - Math.abs(distance) * 1.65, 0, 1);
        const translateX = distance * 110;

        step.style.opacity = opacity.toFixed(3);
        step.style.transform = `translate3d(${translateX}%, 0, 0)`;
      });
    }

    isTicking = false;
  }

  function requestHeroUpdate() {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(updateHero);
  }

  window.addEventListener("scroll", requestHeroUpdate, { passive: true });
  window.addEventListener("resize", requestHeroUpdate);
  updateHero();
}

setupLandingScrollHero();

function setupPirisBaseStats() {
  const baseSection = document.querySelector("[data-piris-base-stats]");

  if (!baseSection) {
    return;
  }

  const counters = Array.from(baseSection.querySelectorAll("[data-piris-count]"));

  if (!counters.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const formatter = new Intl.NumberFormat("ru-RU");

  function renderCounter(counter, value) {
    const suffix = counter.dataset.pirisCountSuffix || "";

    counter.textContent = `${formatter.format(value)}${suffix}`;
  }

  function finishCounters() {
    counters.forEach((counter) => {
      renderCounter(counter, Number(counter.dataset.pirisCount));
    });
  }

  function animateCounters() {
    const duration = 1150;
    const startTime = performance.now();

    function updateFrame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counters.forEach((counter) => {
        const targetValue = Number(counter.dataset.pirisCount);
        renderCounter(counter, Math.round(targetValue * easedProgress));
      });

      if (progress < 1) {
        window.requestAnimationFrame(updateFrame);
        return;
      }

      finishCounters();
    }

    window.requestAnimationFrame(updateFrame);
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    finishCounters();
    return;
  }

  counters.forEach((counter) => {
    renderCounter(counter, 0);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (!entry.isIntersecting) {
        return;
      }

      baseSection.classList.add("is-visible");
      animateCounters();
      observer.disconnect();
    },
    { threshold: 0.3 }
  );

  observer.observe(baseSection);
}

setupPirisBaseStats();

function setupPirisDocsShowcase() {
  const showcase = document.querySelector("[data-piris-docs-showcase]");

  if (!showcase) {
    return;
  }

  const slides = Array.from(showcase.querySelectorAll("[data-piris-docs-slide]"));
  const captions = Array.from(showcase.querySelectorAll("[data-piris-docs-caption]"));

  if (!slides.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isTicking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setActiveSlide(activeIndex) {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });

    captions.forEach((caption, index) => {
      caption.classList.toggle("is-active", index === activeIndex);
    });
  }

  function updateDocsShowcase() {
    const showcaseRect = showcase.getBoundingClientRect();
    const scrollableDistance = Math.max(showcase.offsetHeight - window.innerHeight, 1);
    const progress = clamp(-showcaseRect.top / scrollableDistance, 0, 1);
    const rawSlide = progress * (slides.length - 1);
    const activeIndex = clamp(Math.round(rawSlide), 0, slides.length - 1);

    showcase.style.setProperty("--piris-docs-progress", progress.toFixed(4));
    setActiveSlide(activeIndex);

    if (!prefersReducedMotion) {
      slides.forEach((slide, index) => {
        const distance = index - rawSlide;
        const opacity = clamp(1 - Math.abs(distance) * 1.3, 0, 1);
        const translateX = distance * 112;
        const scale = 1 - Math.min(Math.abs(distance) * 0.045, 0.08);

        slide.style.opacity = opacity.toFixed(3);
        slide.style.transform = `translate3d(${translateX}%, 0, 0) scale(${scale.toFixed(3)})`;
      });
    }

    isTicking = false;
  }

  function requestDocsShowcaseUpdate() {
    if (isTicking) {
      return;
    }

    isTicking = true;
    window.requestAnimationFrame(updateDocsShowcase);
  }

  window.addEventListener("scroll", requestDocsShowcaseUpdate, { passive: true });
  window.addEventListener("resize", requestDocsShowcaseUpdate);
  updateDocsShowcase();
}

setupPirisDocsShowcase();

function setupPirisRoleSplit() {
  const split = document.querySelector("[data-piris-role-split]");

  if (!split) {
    return;
  }

  const options = Array.from(split.querySelectorAll("[data-piris-role-option]"));

  if (!options.length) {
    return;
  }

  function setActiveRole(role) {
    split.classList.toggle("is-private-active", role === "private");
    split.classList.toggle("is-company-active", role === "company");
  }

  function clearActiveRole() {
    split.classList.remove("is-private-active", "is-company-active");
  }

  options.forEach((option) => {
    const role = option.dataset.pirisRoleOption;

    option.addEventListener("mouseenter", () => {
      setActiveRole(role);
    });

    option.addEventListener("focus", () => {
      setActiveRole(role);
    });

    option.addEventListener("click", () => {
      setActiveRole(role);
    });

    option.addEventListener("blur", clearActiveRole);
  });

  split.addEventListener("mouseleave", clearActiveRole);
}

setupPirisRoleSplit();

function setupPirisCabinetShowcase() {
  const showcase = document.querySelector("[data-piris-cabinet-showcase]");

  if (!showcase) {
    return;
  }

  const points = Array.from(showcase.querySelectorAll("[data-piris-cabinet-point]"));
  const screens = Array.from(showcase.querySelectorAll("[data-piris-cabinet-screen]"));

  if (!points.length || !screens.length) {
    return;
  }

  function setActivePoint(activeIndex, shouldFocus = false) {
    points.forEach((point, index) => {
      const isActive = index === activeIndex;

      point.classList.toggle("is-active", isActive);
      point.setAttribute("aria-selected", String(isActive));
      point.tabIndex = isActive ? 0 : -1;

      if (isActive && shouldFocus) {
        point.focus();
      }
    });

    screens.forEach((screen, index) => {
      const isActive = index === activeIndex;

      screen.classList.toggle("is-active", isActive);
      screen.hidden = !isActive;
    });
  }

  points.forEach((point, index) => {
    point.tabIndex = point.classList.contains("is-active") ? 0 : -1;

    point.addEventListener("click", () => {
      setActivePoint(index);
    });

    point.addEventListener("keydown", (event) => {
      const lastIndex = points.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = index === lastIndex ? 0 : index + 1;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = index === 0 ? lastIndex : index - 1;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = lastIndex;
      } else {
        return;
      }

      event.preventDefault();
      setActivePoint(nextIndex, true);
    });
  });

  const initialActiveIndex = points.findIndex((point) => point.classList.contains("is-active"));

  setActivePoint(initialActiveIndex >= 0 ? initialActiveIndex : 0);
}

setupPirisCabinetShowcase();
