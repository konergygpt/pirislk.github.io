const navLinks = document.querySelectorAll(".nav-link");
const screenLinks = document.querySelectorAll("[data-screen-link]");
const screens = document.querySelectorAll(".screen");
const authPage = document.querySelector(".auth-page[data-role]");
const roleButtons = document.querySelectorAll(".role-toggle-button[data-role]");
const reasonSets = document.querySelectorAll(".reason-set[data-role-content]");
const modalOverlay = document.querySelector("#profile-onboarding");
const openOnboardingButtons = document.querySelectorAll("[data-open-onboarding]");
const closeModalButtons = document.querySelectorAll("[data-modal-close]");
const wizardSteps = document.querySelectorAll("[data-wizard-step]");
const wizardNextButton = document.querySelector("[data-wizard-next]");
const wizardBackButton = document.querySelector("[data-wizard-back]");
const wizardStepLabel = document.querySelector("#wizard-step-label");
const wizardProgressFill = document.querySelector("#wizard-progress-fill");
const progressLinks = document.querySelectorAll("[data-progress-link]");
const pageProgress = document.querySelector("[data-page-progress]");
const profileMenus = document.querySelectorAll("[data-profile-menu]");
const notificationMenus = document.querySelectorAll("[data-notification-menu]");
const dashboardShell = document.querySelector(".dashboard-shell");
const sidebarToggleButton = document.querySelector("[data-sidebar-toggle]");
const projectSearchInput = document.querySelector("[data-project-search]");
const projectFilterButtons = document.querySelectorAll("[data-project-filter]");
const projectRows = document.querySelectorAll("[data-project-row]");
const projectBoard = document.querySelector("[data-project-board]");
const projectSortToggle = document.querySelector("[data-project-sort-toggle]");
const gradeInfoToggle = document.querySelector("[data-grade-info-toggle]");
const gradeInfoPanel = document.querySelector("[data-grade-info-panel]");
const gradeLevelButtons = document.querySelectorAll("[data-grade-level-button]");
const gradeDetailPanel = document.querySelector("[data-grade-detail-panel]");
const gradeDetailBadge = document.querySelector("[data-grade-detail-badge]");
const gradeDetailTitle = document.querySelector("[data-grade-detail-title]");
const gradeDetailText = document.querySelector("[data-grade-detail-text]");
const gradeDetailList = document.querySelector("[data-grade-detail-list]");
const gradeProjectTabs = document.querySelectorAll("[data-grade-project-tab]");
const gradeProjectLists = document.querySelectorAll("[data-grade-project-list]");
const articleInput = document.querySelector("[data-article-input]");
const addArticleButton = document.querySelector("[data-add-article]");
const articleList = document.querySelector("[data-article-list]");
const articleListHead = document.querySelector("[data-article-list-head]");
const articleToggleButton = document.querySelector("[data-article-toggle]");
const articlePanel = document.querySelector("[data-article-panel]");
const articleEmptyState = document.querySelector("[data-article-empty-state]");
const submitProjectButton = document.querySelector("[data-submit-project]");
const submitModal = document.querySelector("[data-submit-modal]");
const submitHomeLink = document.querySelector("[data-submit-home]");
const onboardingDismissedStorageKey = "piris-profile-onboarding-dismissed";
const sidebarCollapsedStorageKey = "piris-sidebar-collapsed";
let currentWizardStep = 1;

const solutionRewardRules = [
  { prefix: "АВР-PRS-", reward: 2000 },
  { prefix: "ВРУ-PRS-", reward: 3000 },
  { prefix: "ГРЩ-PRS-", reward: 3000 },
  { prefix: "ШУН-PRS-", reward: 3000 },
];

const gradeLevelMeta = {
  bronze: {
    label: "Бронза",
    badgeClass: "bronze",
    title: "Коэффициент 1.0",
    text:
      "Бронза — базовый уровень программы лояльности. Он фиксирует стартовую ставку выплат и стандартный приоритет проверки проектов.",
    perks: [
      "Базовый коэффициент выплат x1.0",
      "Стандартный срок проверки проектов",
      "Полный доступ к каталогу решений PIRIS",
    ],
  },
  silver: {
    label: "Серебро",
    badgeClass: "silver",
    title: "Коэффициент 1.1",
    text:
      "Серебро даёт повышенный коэффициент выплат, более высокий приоритет проверки и быструю обратную связь по замечаниям.",
    perks: [
      "Повышенный коэффициент выплат x1.1",
      "Более высокий приоритет проверки проектов",
      "Ускоренная обратная связь по спорным кейсам",
    ],
  },
  gold: {
    label: "Золото",
    badgeClass: "gold",
    title: "Коэффициент 1.15",
    text:
      "Золото усиливает размер выплаты и открывает более комфортное сопровождение по сложным проектам.",
    perks: [
      "Повышенный коэффициент выплат x1.15",
      "Приоритетная поддержка по сложным кейсам",
      "Ранний доступ к новым решениям PIRIS",
    ],
  },
  diamond: {
    label: "Бриллиант",
    badgeClass: "diamond",
    title: "Коэффициент 1.2",
    text:
      "Бриллиант — максимальный уровень программы. Он даёт самый высокий коэффициент выплат и максимальный приоритет обработки.",
    perks: [
      "Максимальный коэффициент выплат x1.2",
      "Персональный приоритет обработки проектов",
      "Специальные условия по программе лояльности PIRIS",
    ],
  },
};

function formatRubles(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function normalizeArticleCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/^AVR-PRS-/, "АВР-PRS-")
    .replace(/^VRU-PRS-/, "ВРУ-PRS-")
    .replace(/^GRSH-PRS-/, "ГРЩ-PRS-")
    .replace(/^SHUN-PRS-/, "ШУН-PRS-");
}

function getSolutionRewardRule(code) {
  const normalizedCode = normalizeArticleCode(code);
  return solutionRewardRules.find((rule) => normalizedCode.startsWith(rule.prefix));
}

function formatShortRubles(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} р.`;
}

function titleCaseLatinSegment(value) {
  const lowerValue = String(value || "").toLowerCase();

  return lowerValue.charAt(0).toUpperCase() + lowerValue.slice(1);
}

function getSolutionNameFromArticle(code) {
  const normalizedCode = normalizeArticleCode(code);

  if (!normalizedCode) {
    return "Решение PIRIS";
  }

  const parts = normalizedCode.split("-");
  const prefix = `${parts[0]}-${parts[1]}-`;
  const familyMap = {
    "АВР-PRS-": "Шкаф АВР",
    "ВРУ-PRS-": "ВРУ PIRIS",
    "ГРЩ-PRS-": "Главный распределительный щит",
    "ШУН-PRS-": "Шкаф управления нагрузкой",
  };
  const typeMap = {
    МБ: "моноблок",
    НП: "напольный",
    НВ: "навесной",
  };
  const familyName = familyMap[prefix] || "Решение PIRIS";
  const suffixParts = parts.slice(2);
  const typeLabel = typeMap[suffixParts[0]];
  const inputCount = suffixParts.find((part) => /^\d+$/.test(part));
  const amperage = [...suffixParts].reverse().find((part) => /^\d{2,4}$/.test(part));
  const brandToken = suffixParts.at(-1);
  const brandLabel = /^[A-Z0-9]+$/.test(brandToken || "") ? brandToken : titleCaseLatinSegment(brandToken);
  const detailParts = [];

  if (amperage) {
    detailParts.push(`${amperage}А`);
  }

  if (typeLabel) {
    detailParts.push(typeLabel);
  }

  if (inputCount) {
    detailParts.push(`${inputCount} ввода`);
  }

  if (brandLabel) {
    detailParts.push(brandLabel);
  }

  return detailParts.length ? `${familyName} ${detailParts.join(", ")}` : familyName;
}

function updateArticleEmptyState() {
  if (!articleList || !articleEmptyState) {
    return;
  }

  const hasItems = articleList.children.length > 0;

  articleEmptyState.hidden = hasItems;

  if (articleListHead) {
    articleListHead.hidden = !hasItems;
  }
}

function setArticleAccordionExpanded(isExpanded) {
  if (!articleToggleButton || !articlePanel) {
    return;
  }

  articleToggleButton.setAttribute("aria-expanded", String(isExpanded));
  articlePanel.hidden = !isExpanded;
  articlePanel.style.display = isExpanded ? "grid" : "none";

  const articleSection = articleToggleButton.closest(".submit-support-panel");

  if (articleSection) {
    articleSection.classList.toggle("is-expanded", isExpanded);
  }
}

function openScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.screen === screenId);
  });
}

navLinks.forEach((link) => {
  if (!link.dataset.screen) {
    return;
  }

  link.addEventListener("click", () => openScreen(link.dataset.screen));
});

screenLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.screenLink;
    if (target) {
      openScreen(target);
    }
  });
});

function setRole(role) {
  if (!authPage) {
    return;
  }

  authPage.dataset.role = role;

  roleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.role === role);
  });

  reasonSets.forEach((set) => {
    set.classList.toggle("active", set.dataset.roleContent === role);
  });
}

roleButtons.forEach((button) => {
  button.addEventListener("click", () => setRole(button.dataset.role));
});

function updateWizard() {
  if (!wizardSteps.length) {
    return;
  }

  wizardSteps.forEach((step) => {
    step.classList.toggle(
      "active",
      Number(step.dataset.wizardStep) === currentWizardStep
    );
  });

  if (wizardStepLabel) {
    wizardStepLabel.textContent = `Шаг ${currentWizardStep}/2`;
  }

  if (wizardProgressFill) {
    wizardProgressFill.style.width = currentWizardStep === 1 ? "0%" : "50%";
  }

  if (wizardBackButton) {
    wizardBackButton.style.visibility = currentWizardStep === 1 ? "hidden" : "visible";
  }

  if (wizardNextButton) {
    wizardNextButton.textContent =
      currentWizardStep === 1 ? "Далее ->" : "Сохранить";
  }
}

function isOnboardingDismissed() {
  try {
    return window.localStorage.getItem(onboardingDismissedStorageKey) === "true";
  } catch {
    return false;
  }
}

function rememberOnboardingDismissed() {
  try {
    window.localStorage.setItem(onboardingDismissedStorageKey, "true");
  } catch {
    // Ignore storage issues and fall back to default modal behaviour.
  }
}

function setSidebarCollapsed(isCollapsed) {
  if (!dashboardShell) {
    return;
  }

  const shouldCollapse =
    isCollapsed && !window.matchMedia("(max-width: 920px)").matches;

  dashboardShell.classList.toggle("sidebar-collapsed", shouldCollapse);

  if (sidebarToggleButton) {
    sidebarToggleButton.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");

    const label = sidebarToggleButton.querySelector(".sidebar-toggle-label");
    const icon = sidebarToggleButton.querySelector(".sidebar-toggle-icon");

    if (label) {
      label.textContent = shouldCollapse ? "Развернуть меню" : "Свернуть меню";
    }

    if (icon) {
      icon.textContent = shouldCollapse ? "›" : "‹";
    }
  }
}

function getSidebarCollapsedPreference() {
  try {
    return window.localStorage.getItem(sidebarCollapsedStorageKey) === "true";
  } catch {
    return false;
  }
}

function rememberSidebarCollapsedPreference(isCollapsed) {
  try {
    window.localStorage.setItem(sidebarCollapsedStorageKey, String(isCollapsed));
  } catch {
    // Ignore storage issues and keep sidebar state in-memory only.
  }
}

function openModal() {
  if (!modalOverlay) {
    return;
  }

  modalOverlay.classList.add("is-visible");
  currentWizardStep = 1;
  updateWizard();
}

function closeModal() {
  if (!modalOverlay) {
    return;
  }

  rememberOnboardingDismissed();
  modalOverlay.classList.remove("is-visible");
}

openOnboardingButtons.forEach((button) => {
  button.addEventListener("click", openModal);
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

if (wizardBackButton) {
  wizardBackButton.addEventListener("click", () => {
    if (currentWizardStep > 1) {
      currentWizardStep -= 1;
      updateWizard();
    }
  });
}

if (wizardNextButton) {
  wizardNextButton.addEventListener("click", () => {
    if (currentWizardStep < 2) {
      currentWizardStep += 1;
      updateWizard();
      return;
    }

    if (wizardProgressFill) {
      wizardProgressFill.style.width = "100%";
    }

    window.setTimeout(() => {
      closeModal();
    }, 320);
  });
}

updateWizard();

if (modalOverlay && !isOnboardingDismissed()) {
  openModal();
}

if (sidebarToggleButton && dashboardShell) {
  setSidebarCollapsed(getSidebarCollapsedPreference());

  sidebarToggleButton.addEventListener("click", () => {
    const nextState = !dashboardShell.classList.contains("sidebar-collapsed");
    rememberSidebarCollapsedPreference(nextState);
    setSidebarCollapsed(nextState);
  });

  window.addEventListener("resize", () => {
    setSidebarCollapsed(getSidebarCollapsedPreference());
  });
}

if (gradeInfoToggle && gradeInfoPanel) {
  gradeInfoToggle.addEventListener("click", () => {
    const shouldOpen = gradeInfoPanel.hidden;
    gradeInfoPanel.hidden = !shouldOpen;
    gradeInfoToggle.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    gradeInfoToggle.closest(".grades-intro-panel")?.classList.toggle("is-open", shouldOpen);
  });
}

function setActiveGradeLevel(level) {
  const meta = gradeLevelMeta[level];

  if (!meta) {
    return;
  }

  gradeLevelButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.gradeLevel === level);
  });

  if (!gradeDetailPanel || !gradeDetailBadge || !gradeDetailTitle || !gradeDetailText || !gradeDetailList) {
    return;
  }

  gradeDetailBadge.textContent = meta.label;
  gradeDetailBadge.className = `grade-badge ${meta.badgeClass}`;
  gradeDetailTitle.textContent = meta.title;
  gradeDetailText.textContent = meta.text;
  gradeDetailList.innerHTML = meta.perks.map((item) => `<li>${item}</li>`).join("");
}

gradeLevelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveGradeLevel(button.dataset.gradeLevel);
  });
});

function setActiveGradeProjectTab(tabName) {
  gradeProjectTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.gradeProjectTabTarget === tabName);
  });

  gradeProjectLists.forEach((list) => {
    list.hidden = list.dataset.gradeProjectList !== tabName;
  });
}

gradeProjectTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveGradeProjectTab(button.dataset.gradeProjectTabTarget);
  });
});

if (gradeLevelButtons.length) {
  setActiveGradeLevel("silver");
}

if (gradeProjectTabs.length) {
  setActiveGradeProjectTab("work");
}

function resetPageProgress({ disableTransition = false } = {}) {
  if (!pageProgress) {
    return;
  }

  const initialValue = pageProgress.dataset.pageProgressInitial;

  if (typeof initialValue === "undefined") {
    return;
  }

  if (disableTransition) {
    pageProgress.style.transition = "none";
  }

  pageProgress.style.width = `${initialValue}%`;

  if (!disableTransition) {
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      pageProgress.style.removeProperty("transition");
    });
  });
}

resetPageProgress({ disableTransition: true });
window.addEventListener("pageshow", () => {
  resetPageProgress({ disableTransition: true });
});

progressLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.dataset.progressTarget || link.getAttribute("href");
    const value = link.dataset.progressValue;

    if (!target || !pageProgress || !value) {
      return;
    }

    event.preventDefault();
    pageProgress.style.width = `${value}%`;

    window.setTimeout(() => {
      window.location.href = target;
    }, 280);
  });
});

function closeDropdownMenu(menu, toggleSelector, panelSelector) {
  const toggle = menu.querySelector(toggleSelector);
  const panel = menu.querySelector(panelSelector);

  if (!toggle || !panel) {
    return;
  }

  panel.hidden = true;
  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}

function openDropdownMenu(menu, toggleSelector, panelSelector) {
  const toggle = menu.querySelector(toggleSelector);
  const panel = menu.querySelector(panelSelector);

  if (!toggle || !panel) {
    return;
  }

  panel.hidden = false;
  menu.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
}

function closeAllDropdownMenus(exceptMenu) {
  profileMenus.forEach((menu) => {
    if (menu !== exceptMenu) {
      closeDropdownMenu(menu, "[data-profile-menu-toggle]", "[data-profile-menu-panel]");
    }
  });

  notificationMenus.forEach((menu) => {
    if (menu !== exceptMenu) {
      closeDropdownMenu(
        menu,
        "[data-notification-menu-toggle]",
        "[data-notification-menu-panel]"
      );
    }
  });
}

function setupDropdownMenus(menus, toggleSelector, panelSelector) {
  menus.forEach((menu) => {
    const toggle = menu.querySelector(toggleSelector);
    const panel = menu.querySelector(panelSelector);

    if (!toggle || !panel) {
      return;
    }

    toggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const shouldOpen = panel.hidden;

      closeAllDropdownMenus(menu);

      if (shouldOpen) {
        openDropdownMenu(menu, toggleSelector, panelSelector);
        return;
      }

      closeDropdownMenu(menu, toggleSelector, panelSelector);
    });

    panel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });
}

const notificationToggleIconSvg = `
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M10 5a2 2 0 1 1 4 0c3.038.606 5 2.833 5 6v2c0 .832.302 1.592.803 2.176A1 1 0 0 1 19.05 17H4.95a1 1 0 0 1-.753-1.824A3.241 3.241 0 0 0 5 13v-2c0-3.167 1.962-5.394 5-6"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9 17v1a3 3 0 0 0 6 0v-1"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

function updateNotificationToggleIcons() {
  document.querySelectorAll(".notification-toggle-icon").forEach((icon) => {
    if (icon.querySelector("svg")) {
      return;
    }

    icon.innerHTML = notificationToggleIconSvg;
  });
}

function isHomePagePath() {
  return /\/home\.html$/i.test(window.location.pathname);
}

function collectTopbarAccountActionGroups() {
  return Array.from(document.querySelectorAll(".topbar"))
    .map((topbar) => {
      const actionContainer = Array.from(topbar.children).find((child) =>
        child.matches(
          ".topbar-meta, .topbar-actions, .detail-topbar-actions, .documentation-topbar-actions"
        )
      );

      if (!actionContainer) {
        return null;
      }

      const directChildren = Array.from(actionContainer.children);
      const notificationMenu =
        directChildren.find((child) => child.classList.contains("notification-menu")) ||
        null;
      const profileMenu =
        directChildren.find((child) => child.classList.contains("profile-menu")) || null;

      if (!notificationMenu || !profileMenu) {
        return null;
      }

      let accountActions =
        directChildren.find((child) => child.classList.contains("topbar-account-actions")) ||
        null;

      if (!accountActions) {
        accountActions = document.createElement("div");
        accountActions.className = "topbar-account-actions";
        actionContainer.insertBefore(accountActions, notificationMenu);
      }

      if (!isHomePagePath()) {
        let createProjectLink = actionContainer.querySelector(
          '.primary-button.form-link-button[href="./project-create.html"]'
        );

        if (!createProjectLink) {
          createProjectLink = document.createElement("a");
          createProjectLink.className = "primary-button form-link-button";
          createProjectLink.href = "./project-create.html";
        }

        createProjectLink.textContent = "+ Новый проект";

        accountActions.append(createProjectLink);
      }

      accountActions.append(notificationMenu, profileMenu);

      return {
        topbar,
        accountActions,
      };
    })
    .filter(Boolean);
}

setupDropdownMenus(
  profileMenus,
  "[data-profile-menu-toggle]",
  "[data-profile-menu-panel]"
);
setupDropdownMenus(
  notificationMenus,
  "[data-notification-menu-toggle]",
  "[data-notification-menu-panel]"
);

document.addEventListener("click", () => {
  closeAllDropdownMenus();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  closeAllDropdownMenus();
});

updateNotificationToggleIcons();

const topbarAccountActionGroups = collectTopbarAccountActionGroups();
const topbarAccountActionsMediaQuery = window.matchMedia("(min-width: 921px)");
let topbarAccountActionsAnimationFrame = null;

function updateTopbarAccountActionsState() {
  topbarAccountActionGroups.forEach(({ topbar, accountActions }) => {
    const topbarBottom = topbar.getBoundingClientRect().bottom;
    const shouldFloat =
      topbarAccountActionsMediaQuery.matches && topbarBottom <= 20;

    accountActions.classList.toggle("is-floating", shouldFloat);
  });
}

function queueTopbarAccountActionsStateUpdate() {
  if (topbarAccountActionsAnimationFrame !== null) {
    return;
  }

  topbarAccountActionsAnimationFrame = window.requestAnimationFrame(() => {
    topbarAccountActionsAnimationFrame = null;
    updateTopbarAccountActionsState();
  });
}

if (topbarAccountActionGroups.length) {
  updateTopbarAccountActionsState();

  window.addEventListener("scroll", queueTopbarAccountActionsStateUpdate, {
    passive: true,
  });
  window.addEventListener("resize", queueTopbarAccountActionsStateUpdate);

  if (typeof topbarAccountActionsMediaQuery.addEventListener === "function") {
    topbarAccountActionsMediaQuery.addEventListener(
      "change",
      queueTopbarAccountActionsStateUpdate
    );
  } else if (typeof topbarAccountActionsMediaQuery.addListener === "function") {
    topbarAccountActionsMediaQuery.addListener(
      queueTopbarAccountActionsStateUpdate
    );
  }
}

function addArticleRow(code) {
  if (!articleList) {
    return;
  }

  const normalizedCode = normalizeArticleCode(code);
  const existingRow = articleList.querySelector(`[data-article-code="${normalizedCode}"]`);

  if (existingRow) {
    return;
  }

  const rewardRule = getSolutionRewardRule(normalizedCode);
  const rewardLabel = rewardRule ? formatShortRubles(rewardRule.reward) : "Уточняется";
  const articleRow = document.createElement("article");
  articleRow.className = "article-solution-item";
  articleRow.dataset.articleCode = normalizedCode;

  [
    ["Название решения:", getSolutionNameFromArticle(normalizedCode)],
    ["Артикул:", normalizedCode],
    ["Вознаграждение:", rewardLabel],
  ].forEach(([label, value]) => {
    const cell = document.createElement("div");
    const cellLabel = document.createElement("span");
    const cellValue = document.createElement("strong");

    cell.className = "article-solution-cell";
    cellLabel.textContent = label;
    cellValue.textContent = value;

    cell.append(cellLabel, cellValue);
    articleRow.appendChild(cell);
  });

  const removeButton = document.createElement("button");
  removeButton.className = "article-solution-remove";
  removeButton.type = "button";
  removeButton.dataset.removeArticle = normalizedCode;
  removeButton.setAttribute("aria-label", `Удалить решение ${normalizedCode}`);
  removeButton.innerHTML = `
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5.75 7.25V14.25C5.75 15.2165 6.5335 16 7.5 16H12.5C13.4665 16 14.25 15.2165 14.25 14.25V7.25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M4.5 5.25H15.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M8 5.25V4.5C8 4.08579 8.33579 3.75 8.75 3.75H11.25C11.6642 3.75 12 4.08579 12 4.5V5.25" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M8.5 8.5V13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M11.5 8.5V13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `;
  articleRow.appendChild(removeButton);

  articleList.appendChild(articleRow);
}

function addArticleTag() {
  if (!articleInput || !articleList) {
    return;
  }

  const rawValue = articleInput.value.trim();

  if (!rawValue) {
    articleInput.focus();
    return;
  }

  const items = rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  items.forEach((item) => {
    addArticleRow(item);
  });

  articleInput.value = "";
  updateArticleEmptyState();
}

if (addArticleButton) {
  addArticleButton.addEventListener("click", addArticleTag);
}

if (articleList) {
  articleList.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-article]");

    if (!removeButton) {
      return;
    }

    const articleRow = removeButton.closest(".article-solution-item");

    if (!articleRow) {
      return;
    }

    articleRow.remove();
    updateArticleEmptyState();
  });
}

if (articleInput) {
  articleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addArticleTag();
    }
  });
}

if (articleToggleButton) {
  articleToggleButton.addEventListener("click", (event) => {
    event.preventDefault();
    const isExpanded = articleToggleButton.getAttribute("aria-expanded") === "true";
    setArticleAccordionExpanded(!isExpanded);
  });
}

setArticleAccordionExpanded(false);
updateArticleEmptyState();

function setupProjectsList() {
  if (!projectRows.length) {
    return;
  }

  let activeFilter = "all";
  let projectSortOrder = projectSortToggle?.dataset.sortOrder || "desc";
  const projectList = document.querySelector(".projects-list");
  const projectRowsCollection = Array.from(projectRows);

  function normalizeProjectValue(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function projectMatchesFilter(row) {
    const status = row.dataset.projectStatus || "";

    if (activeFilter === "all") {
      return true;
    }

    if (activeFilter === "active") {
      return status !== "draft";
    }

    return status === activeFilter;
  }

  function getProjectCreatedAt(row) {
    const value = row.dataset.projectCreatedAt || "";
    const timestamp = Date.parse(value);

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  function updateProjectSortToggleMeta() {
    if (!projectSortToggle) {
      return;
    }

    projectSortToggle.dataset.sortOrder = projectSortOrder;

    const isDescending = projectSortOrder === "desc";
    const label = isDescending ? "Сортировка по дате создания: сначала новые" : "Сортировка по дате создания: сначала старые";
    const hint = isDescending ? "Сначала новые" : "Сначала старые";

    projectSortToggle.setAttribute("aria-label", label);
    projectSortToggle.setAttribute("title", hint);
  }

  function sortProjectRows() {
    if (!projectList) {
      return;
    }

    projectRowsCollection
      .slice()
      .sort((leftRow, rightRow) => {
        const difference = getProjectCreatedAt(rightRow) - getProjectCreatedAt(leftRow);

        return projectSortOrder === "desc" ? difference : -difference;
      })
      .forEach((row) => {
        projectList.appendChild(row);
      });
  }

  function applyProjectsFilter() {
    const query = normalizeProjectValue(projectSearchInput?.value);
    let visibleProjects = 0;

    projectRows.forEach((row) => {
      const haystack = normalizeProjectValue(row.dataset.projectSearch);
      const matchesQuery = !query || haystack.includes(query);
      const matchesFilter = projectMatchesFilter(row);
      const isVisible = matchesQuery && matchesFilter;

      row.hidden = !isVisible;

      if (isVisible) {
        visibleProjects += 1;
      }
    });

    if (projectBoard) {
      projectBoard.hidden = visibleProjects === 0;
    }
  }

  projectFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.projectFilter || "all";

      projectFilterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      applyProjectsFilter();
    });
  });

  if (projectSearchInput) {
    projectSearchInput.addEventListener("input", applyProjectsFilter);
  }

  if (projectSortToggle) {
    updateProjectSortToggleMeta();

    projectSortToggle.addEventListener("click", () => {
      projectSortOrder = projectSortOrder === "desc" ? "asc" : "desc";
      updateProjectSortToggleMeta();
      sortProjectRows();
      applyProjectsFilter();
    });
  }

  projectRows.forEach((row) => {
    const target = row.dataset.projectLink;

    if (!target) {
      return;
    }

    row.addEventListener("click", () => {
      window.location.href = target;
    });

    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = target;
      }
    });
  });

  sortProjectRows();
  applyProjectsFilter();
}

function openSubmitModal() {
  if (!submitModal) {
    return;
  }

  if (pageProgress) {
    pageProgress.style.transitionDuration = "0.9s";
    pageProgress.style.width = "100%";
  }

  window.setTimeout(() => {
    if (pageProgress) {
      pageProgress.style.removeProperty("transition-duration");
    }

    submitModal.classList.add("is-visible");
  }, 1000);
}

function closeSubmitModal() {
  if (!submitModal) {
    return;
  }

  submitModal.classList.remove("is-visible");
}

if (submitProjectButton) {
  submitProjectButton.addEventListener("click", openSubmitModal);
}

if (submitHomeLink) {
  submitHomeLink.addEventListener("click", () => {
    closeSubmitModal();
  });
}

function setupProjectRewardSummary() {
  const solutionRows = document.querySelectorAll("[data-solution-row]");

  if (!solutionRows.length) {
    return;
  }

  const rewardTotalTargets = document.querySelectorAll("[data-reward-total]");
  let totalReward = 0;

  solutionRows.forEach((row) => {
    const code = row.dataset.solutionCode || "";
    const rewardTarget = row.querySelector("[data-solution-reward]");
    const rewardRule = getSolutionRewardRule(code);

    if (!rewardRule) {
      if (rewardTarget) {
        rewardTarget.textContent = "Не участвует";
      }

      return;
    }

    const rowReward = rewardRule.reward;

    totalReward += rowReward;

    if (rewardTarget) {
      rewardTarget.textContent = formatRubles(rowReward);
    }
  });

  rewardTotalTargets.forEach((target) => {
    target.textContent = formatRubles(totalReward);
  });
}

setupProjectRewardSummary();
setupProjectsList();

const solutionCatalogData = {
  "avr-prs-mb-2-1-100-chint": {
    title: "Шкаф АВР-PRS 100А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-100-CHINT",
    subtitle: "АВР • CHINT • 100 А • 2 ввода",
    description:
      "Готовый комплект документации по типовому решению: конструкторский файл, габаритный чертеж, принципиальная схема и спецификация.",
    tags: ["АВР", "CHINT", "100 А", "Моноблок"],
    statusLabel: "4 документа готовы",
    statusTone: "accent",
    rewardLabel: "2 000 ₽",
    priceLabel: "Проектная цена с НДС",
    retailPrice: "87 900 ₽",
    detailDescription: `Шкаф АВР-PRS-МБ-2-1-100-CHINT выполнен на моноблочных АВР серии NXZM бренда CHINT, имеет два ввода, индикацию и выносной дисплей контроллера на дверь.

Система АВР выполняет функцию автоматического переключения на резервный источник питания при аварии на основном вводе, с функцией самовозврата. Шкаф АВР имеет приоритет 1-го ввода. Самовозврат на основной источник питания происходит при восстановлении номинальных параметров сети.

Блок АВР NXZM оснащен встроенным контроллером с функциями мониторинга параметров сети, настройки приоритета вводов и регулировки времени переключения. Вводы подключаются снизу, с возможностью вывода на клеммы и дополнения секцией распределения.

Шкаф выполнен в металлическом корпусе со степенью защиты IP 31, возможен заказ в корпусе со степенью защиты IP 54.`,
    productUrl: "https://piris.ru/product/avr-prs-mb-2-1-100-chint",
    gallery: [
      {
        image: "./assets/solutions/avr-prs-mb-2-1-100-chint.jpg",
        thumb: "./assets/solutions/avr-prs-mb-2-1-100-chint.jpg",
        alt: "Шкаф АВР-PRS 100А, моноблок, 2 ввода, CHINT",
        label: "Общий вид",
      },
      {
        image: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/internal-view.jpg",
        thumb: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/internal-view.jpg",
        alt: "Внутренний вид шкафа АВР-PRS 100А, моноблок, 2 ввода, CHINT",
        label: "Компоновка",
      },
      {
        image: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/wiring.jpg",
        thumb: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/wiring.jpg",
        alt: "Принципиальная схема АВР-PRS 100А, моноблок, 2 ввода, CHINT",
        label: "Схема",
      },
      {
        image: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/navigation.jpg",
        thumb: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/navigation.jpg",
        alt: "Расшифровка артикула АВР-PRS-МБ-2-1-100-CHINT",
        label: "Артикул",
      },
      {
        image: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/real-photo-1.jpg",
        thumb: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/real-photo-1.jpg",
        alt: "Фото шкафа АВР-PRS-МБ, 2 ввода, моноблок АВР",
        label: "Фото 1",
      },
      {
        image: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/real-photo-2.jpg",
        thumb: "./assets/solutions/detail-gallery/avr-prs-mb-2-1-100-chint/real-photo-2.jpg",
        alt: "Крупный план компонентов шкафа АВР-PRS-МБ, 2 ввода, моноблок АВР",
        label: "Фото 2",
      },
    ],
    characteristics: [
      { label: "Артикул", value: "АВР-PRS-МБ-2-1-100-CHINT" },
      { label: "Производитель", value: "PIRIS" },
      { label: "Тип коммутации АВР", value: "Моноблок" },
      { label: "Документация", value: "Разработана" },
      { label: "Исполнение", value: "Навесное" },
      { label: "Масса", value: "35 кг" },
      { label: "Степень защиты", value: "IP31" },
      { label: "Направление ввода и вывода кабеля", value: "Снизу" },
      { label: "Количество вводов", value: "2" },
      { label: "Количество полюсов", value: "3 P" },
      { label: "Номинальный ток", value: "100 А" },
      { label: "Номинальная отключающая способность", value: "25 кА" },
      { label: "Режим работы", value: "Автоматический и ручной" },
      { label: "Номинальное рабочее напряжение", value: "380 В" },
      { label: "Напряжение цепей управления", value: "220 В" },
      { label: "Учет электроэнергии", value: "Нет" },
      { label: "Тип расцепителя", value: "Электромагнитный и тепловой" },
      { label: "Потребляемая мощность", value: "< 10 Вт" },
      { label: "Секция распределения", value: "Без секции распределения" },
      { label: "Ресурс, циклов вкл/откл", value: "6000" },
      { label: "Тип заземления", value: "TN-C, TN-S, TN-C-S" },
      { label: "Тип покрытия", value: "Порошковая покраска" },
      { label: "Задержка перехода/возврат на резервный ввод", value: "от 0 с до 180 с" },
      { label: "Высота, мм", value: "600" },
      { label: "Ширина, мм", value: "500" },
      { label: "Глубина, мм", value: "250" },
      { label: "Рабочее время перехода", value: "< 3,5 с" },
      { label: "Комплектующие", value: "CHINT" },
      { label: "Цвет корпуса", value: "RAL 7035" },
      { label: "Задержка на запуск/останов резервного генератора", value: "от 0 с до 180 с" },
      { label: "Рабочая температура", value: "от -5 до +40 °C" },
      { label: "Связь с противопожарной системой", value: "Да" },
    ],
    docs: [
      {
        id: "constructive-documentation",
        title: "Конструкторская документация",
        description:
          "Общий комплект по типовому решению для включения в проект, согласования и передачи в рабочую документацию.",
        fileName: "Конструкторская документация АВР-PRS-МБ-2-1-100-CHINT.pdf",
        size: "469 KB",
        preview:
          "./assets/previews/avr-prs-mb-2-1-100-chint/constructive-documentation.png",
        file: "./assets/docs/avr-prs-mb-2-1-100-chint/constructive-documentation.pdf",
      },
      {
        id: "dimensional-drawing",
        title: "Габаритный чертеж",
        description:
          "Лист с внешними размерами шкафа для быстрой увязки по месту установки, проходам и узлам крепления.",
        fileName: "Габаритный чертеж АВР-PRS-МБ-2-1-100-CHINT.pdf",
        size: "201 KB",
        preview:
          "./assets/previews/avr-prs-mb-2-1-100-chint/dimensional-drawing.png",
        file: "./assets/docs/avr-prs-mb-2-1-100-chint/dimensional-drawing.pdf",
      },
      {
        id: "schematic",
        title: "Принципиальная схема",
        description:
          "Схема подключения и логика переключения между рабочим и резервным вводом с приоритетом первого ввода.",
        fileName: "Принципиальная схема АВР-PRS-МБ-2-1-100-CHINT.pdf",
        size: "91 KB",
        preview: "./assets/previews/avr-prs-mb-2-1-100-chint/schematic.png",
        file: "./assets/docs/avr-prs-mb-2-1-100-chint/schematic.pdf",
      },
      {
        id: "specification",
        title: "Спецификация компонентов",
        description:
          "Перечень комплектующих и состава типового решения для оценки, проверки бренда и согласования закупки.",
        fileName: "Спецификация компонентов АВР-PRS-МБ-2-1-100-CHINT.pdf",
        size: "29 KB",
        preview: "./assets/previews/avr-prs-mb-2-1-100-chint/specification.png",
        file: "./assets/docs/avr-prs-mb-2-1-100-chint/specification.pdf",
      },
    ],
  },
  "avr-prs-mb-2-1-25-chint": {
    title: "Шкаф АВР-PRS 25А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-25-CHINT",
    subtitle: "АВР • CHINT • 25 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "25 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
  "avr-prs-mb-2-1-40-chint": {
    title: "Шкаф АВР-PRS 40А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-40-CHINT",
    subtitle: "АВР • CHINT • 40 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "40 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
  "avr-prs-mb-2-1-63-chint": {
    title: "Шкаф АВР-PRS 63А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-63-CHINT",
    subtitle: "АВР • CHINT • 63 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "63 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
  "avr-prs-mb-2-1-160-chint": {
    title: "Шкаф АВР-PRS 160А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-160-CHINT",
    subtitle: "АВР • CHINT • 160 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "160 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
  "avr-prs-mb-2-1-250-chint": {
    title: "Шкаф АВР-PRS 250А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-250-CHINT",
    subtitle: "АВР • CHINT • 250 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "250 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
  "avr-prs-mb-2-1-400-chint": {
    title: "Шкаф АВР-PRS 400А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-400-CHINT",
    subtitle: "АВР • CHINT • 400 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "400 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
  "avr-prs-mb-2-1-630-chint": {
    title: "Шкаф АВР-PRS 630А, моноблок, 2 ввода, CHINT",
    code: "АВР-PRS-МБ-2-1-630-CHINT",
    subtitle: "АВР • CHINT • 630 А • 2 ввода",
    description:
      "Карточка решения уже в каталоге. Комплект документации по этой модификации сейчас готовится.",
    tags: ["АВР", "CHINT", "630 А", "Моноблок"],
    statusLabel: "Документы в подготовке",
    statusTone: "neutral",
    productUrl: "#",
    docs: [],
  },
};

function formatSolutionCount(value) {
  if (value % 10 === 1 && value % 100 !== 11) {
    return `${value} решение`;
  }

  if (
    value % 10 >= 2 &&
    value % 10 <= 4 &&
    (value % 100 < 12 || value % 100 > 14)
  ) {
    return `${value} решения`;
  }

  return `${value} решений`;
}

function setAnchorState(anchor, isDisabled) {
  if (!anchor) {
    return;
  }

  anchor.classList.toggle("is-disabled", isDisabled);
  anchor.setAttribute("aria-disabled", isDisabled ? "true" : "false");
  anchor.tabIndex = isDisabled ? -1 : 0;
}

function setupSolutionsCatalog() {
  const cards = Array.from(document.querySelectorAll("[data-solution-card]"));

  if (!cards.length) {
    return;
  }

  const searchInput = document.querySelector("[data-solution-filter-search]");
  const categorySelect = document.querySelector("[data-solution-filter-category]");
  const brandSelect = document.querySelector("[data-solution-filter-brand]");
  const currentSelect = document.querySelector("[data-solution-filter-current]");
  const inputsSelect = document.querySelector("[data-solution-filter-inputs]");
  const sectionSelect = document.querySelector("[data-solution-filter-section]");
  const emptyState = document.querySelector("[data-solution-empty]");

  const docsTriggers = document.querySelectorAll("[data-open-solution-docs]");
  const panelCode = document.querySelector("[data-solution-panel-code]");
  const projectTriggers = document.querySelectorAll("[data-solution-project-trigger]");
  const projectPicker = document.querySelector("[data-project-picker]");
  const projectPickerClose = document.querySelector("[data-project-picker-close]");
  const docsDrawer = document.querySelector("[data-solution-doc-drawer]");
  const docsDrawerClose = document.querySelector("[data-solution-doc-drawer-close]");
  const detailTriggers = document.querySelectorAll("[data-open-solution-detail]");
  const detailModal = document.querySelector("[data-solution-detail-modal]");
  const detailModalClose = document.querySelector("[data-solution-detail-close]");
  const detailCode = document.querySelector("[data-solution-detail-code]");
  const detailTitle = document.querySelector("[data-solution-detail-title]");
  const detailDescription = document.querySelector("[data-solution-detail-description]");
  const detailImage = document.querySelector("[data-solution-detail-image]");
  const detailStage = document.querySelector("[data-solution-detail-stage]");
  const detailThumbs = document.querySelector("[data-solution-detail-thumbs]");
  const detailReward = document.querySelector("[data-solution-detail-reward]");
  const detailPrice = document.querySelector("[data-solution-detail-price]");
  const detailPriceLabel = document.querySelector("[data-solution-detail-price-label]");
  const detailLink = document.querySelector("[data-solution-detail-link]");
  const detailCharacteristics = document.querySelector("[data-solution-detail-characteristics]");
  const detailDocs = document.querySelector("[data-solution-detail-docs]");
  const detailProjectTrigger = document.querySelector("[data-solution-detail-project-trigger]");
  const detailTabs = Array.from(document.querySelectorAll("[data-solution-detail-tab]"));
  const detailSections = Array.from(document.querySelectorAll("[data-solution-detail-section]"));

  const docCount = document.querySelector("[data-solution-doc-count]");
  const docList = document.querySelector("[data-solution-doc-list]");
  const previewPanel = document.querySelector("[data-solution-preview-panel]");
  const previewImage = document.querySelector("[data-solution-preview-image]");
  const previewLink = document.querySelector("[data-solution-preview-link]");

  let activeSolutionId =
    cards[0]?.dataset.solutionId;
  let activeDocumentId = solutionCatalogData[activeSolutionId]?.docs[0]?.id || null;
  let activeDetailImageIndex = 0;
  let activeDetailSection = "docs";
  const docRequestStorageKey = "solutionDocRequests";
  const docRequestTooltipText =
    "Отметьте, если документация по этому решению для вас актуальна. Мы учитываем запросы при определении приоритетов разработки. Нажатие не означает мгновенную подготовку документации.";
  const pdfIconMarkup =
    '<span class="solution-file-icon" aria-hidden="true"><img src="./assets/pdf-file.svg" alt="" /></span>';
  const copyIconMarkup = `
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="7" y="4" width="9" height="11" rx="2" stroke="currentColor" stroke-width="1.6" />
      <path d="M5 12H4C2.89543 12 2 11.1046 2 10V4C2 2.89543 2.89543 2 4 2H10C11.1046 2 12 2.89543 12 4V5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  `;
  const requestedDocSolutions = (() => {
    try {
      const storedValue = JSON.parse(window.localStorage.getItem(docRequestStorageKey) || "[]");
      return new Set(Array.isArray(storedValue) ? storedValue : []);
    } catch {
      return new Set();
    }
  })();

  async function copyTextValue(value) {
    if (!value) {
      return false;
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (error) {
        // Fallback continues below.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    textarea.style.pointerEvents = "none";
    document.body.appendChild(textarea);
    textarea.select();

    let isCopied = false;

    try {
      isCopied = document.execCommand("copy");
    } catch (error) {
      isCopied = false;
    }

    textarea.remove();
    return isCopied;
  }

  function showCopyFeedback(statusNode, message) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.classList.add("is-visible");
    window.clearTimeout(Number(statusNode.dataset.timeoutId || 0));

    statusNode.dataset.timeoutId = String(
      window.setTimeout(() => {
        statusNode.classList.remove("is-visible");
      }, 1400)
    );
  }

  function rememberDocRequests() {
    try {
      window.localStorage.setItem(
        docRequestStorageKey,
        JSON.stringify(Array.from(requestedDocSolutions))
      );
    } catch {
      // Ignore storage issues and keep request state in-memory only.
    }
  }

  function submitDocRequest(solutionId) {
    if (!solutionId || requestedDocSolutions.has(solutionId)) {
      return;
    }

    requestedDocSolutions.add(solutionId);
    rememberDocRequests();
    renderSolutionOfferSummaries();

    if (activeSolutionId === solutionId) {
      renderSolutionPanel(solutionId);
    }
  }

  function createDocRequestSection(solutionId) {
    const requestBlock = document.createElement("div");
    const isRequested = requestedDocSolutions.has(solutionId);

    requestBlock.className = "solution-doc-request";
    requestBlock.innerHTML = `
      <div class="solution-doc-request-head">
        <button
          class="solution-doc-request-button${isRequested ? " is-active" : ""}"
          type="button"
          ${isRequested ? "disabled" : ""}
        >
          ${isRequested ? "Запрос учтён" : "Нужна документация"}
        </button>
        <span
          class="tooltip-mark solution-doc-request-help"
          tabindex="0"
          role="button"
          aria-label="Что делает эта кнопка?"
        >
          ?
          <span class="tooltip-bubble">${docRequestTooltipText}</span>
        </span>
      </div>
    `;

    const requestButton = requestBlock.querySelector(".solution-doc-request-button");
    requestButton?.addEventListener("click", () => {
      submitDocRequest(solutionId);
    });

    return requestBlock;
  }

  function getSolutionCard(solutionId) {
    return cards.find((card) => card.dataset.solutionId === solutionId) || null;
  }

  function getFallbackSolutionGallery(card, solution) {
    const image = card?.querySelector(".solution-offer-image");

    if (!image) {
      return [];
    }

    return [
      {
        image: image.getAttribute("src"),
        thumb: image.getAttribute("src"),
        alt: image.getAttribute("alt") || solution.title,
        label: "Общий вид",
      },
    ];
  }

  function getFallbackSolutionCharacteristics(card, solution) {
    const cardSpecs = Array.from(card?.querySelectorAll(".solution-offer-spec") || [])
      .map((item) => {
        const label = item.querySelector("span")?.textContent?.trim();
        const value = item.querySelector("strong")?.textContent?.trim();

        if (!label || !value) {
          return null;
        }

        return { label, value };
      })
      .filter(Boolean);

    return [
      { label: "Артикул", value: solution.code },
      ...cardSpecs,
      { label: "Статус документации", value: solution.statusLabel },
    ];
  }

  function normalizeDetailDescription(detailText) {
    const sourceText = Array.isArray(detailText) ? detailText.join("\n\n") : String(detailText || "");

    return sourceText
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
      .filter(Boolean);
  }

  function sortSolutionCharacteristics(items) {
    const priority = [
      "Артикул",
      "Производитель",
      "Тип коммутации АВР",
      "Комплектующие",
      "Исполнение",
      "Документация",
      "Количество вводов",
      "Количество полюсов",
      "Номинальный ток",
      "Номинальная отключающая способность",
      "Номинальное рабочее напряжение",
      "Напряжение цепей управления",
      "Режим работы",
      "Потребляемая мощность",
      "Тип расцепителя",
      "Ресурс, циклов вкл/откл",
      "Секция распределения",
      "Направление ввода и вывода кабеля",
      "Степень защиты",
      "Тип заземления",
      "Тип покрытия",
      "Цвет корпуса",
      "Высота, мм",
      "Ширина, мм",
      "Глубина, мм",
      "Масса",
      "Задержка перехода/возврат на резервный ввод",
      "Рабочее время перехода",
      "Задержка на запуск/останов резервного генератора",
      "Рабочая температура",
      "Связь с противопожарной системой",
      "Учет электроэнергии",
    ];
    const priorityMap = new Map(priority.map((label, index) => [label, index]));

    return [...items].sort((left, right) => {
      const leftOrder = priorityMap.get(left.label) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = priorityMap.get(right.label) ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });
  }

  function renderSolutionOfferCodes() {
    cards.forEach((card) => {
      const solutionId = card.dataset.solutionId;
      const solution = solutionCatalogData[solutionId];
      const mainColumn = card.querySelector(".solution-offer-main");
      const titleNode = mainColumn?.querySelector("h3");
      const specsBlock = mainColumn?.querySelector(".solution-offer-specs");
      const existingCode = mainColumn?.querySelector(".solution-offer-code");
      const codeValue = existingCode?.textContent?.trim() || solution?.code || "";
      const legacyPanel = card.querySelector("[data-solution-code-panel]");
      const legacyHeading = mainColumn?.querySelector("[data-solution-offer-heading]");

      if (!mainColumn || !titleNode || !specsBlock || !codeValue) {
        return;
      }

      legacyPanel?.remove();
      if (legacyHeading) {
        if (titleNode.parentElement === legacyHeading) {
          legacyHeading.before(titleNode);
        }

        legacyHeading.remove();
      }

      let codeRow = mainColumn.querySelector("[data-solution-code-row]");

      if (!codeRow) {
        codeRow = document.createElement("div");
        codeRow.className = "solution-offer-code-row";
        codeRow.setAttribute("data-solution-code-row", "");
        specsBlock.before(codeRow);
      }

      let codeInline = codeRow.querySelector("[data-solution-code-inline]");

      if (!codeInline) {
        codeInline = document.createElement("div");
        codeInline.className = "solution-offer-code-inline";
        codeInline.setAttribute("data-solution-code-inline", "");
        codeInline.innerHTML = `
          <span class="solution-offer-code-label">арт.</span>
          <span class="solution-offer-code-meta">
            <strong class="solution-offer-code-value" data-solution-code-value></strong>
            <button
              class="solution-offer-copy-button"
              type="button"
              aria-label="Скопировать артикул"
              title="Скопировать артикул"
              data-solution-copy-button
            >
              ${copyIconMarkup}
            </button>
          </span>
          <span class="solution-offer-copy-status" role="status" aria-live="polite" data-solution-copy-status>
            Скопирован
          </span>
        `;

        const copyButton = codeInline.querySelector("[data-solution-copy-button]");
        const copyStatus = codeInline.querySelector("[data-solution-copy-status]");

        copyButton?.addEventListener("click", async () => {
          const currentCode =
            codeInline.querySelector("[data-solution-code-value]")?.textContent?.trim() || "";
          const isCopied = await copyTextValue(currentCode);
          showCopyFeedback(copyStatus, isCopied ? "Скопирован" : "Не удалось");
        });

        codeRow.appendChild(codeInline);
      }

      const codeValueNode = codeInline.querySelector("[data-solution-code-value]");

      if (codeValueNode) {
        codeValueNode.textContent = codeValue;
      }

      existingCode?.remove();
    });
  }

  function renderSolutionOfferSummaries() {
    cards.forEach((card) => {
      const solutionId = card.dataset.solutionId;
      const solution = solutionCatalogData[solutionId];
      const mainColumn = card.querySelector(".solution-offer-main");
      const specsBlock = card.querySelector(".solution-offer-specs");

      if (!solution || !mainColumn || !specsBlock) {
        return;
      }

      let summaryCard = mainColumn.querySelector("[data-solution-inline-summary]");

      if (!summaryCard) {
        summaryCard = document.createElement("button");
        summaryCard.className = "solution-offer-summary-card";
        summaryCard.type = "button";
        summaryCard.setAttribute("data-solution-inline-summary", "");
        summaryCard.addEventListener("click", () => {
          openSolutionDetailModal(solutionId);
        });
        specsBlock.insertAdjacentElement("afterend", summaryCard);
      }

      summaryCard.innerHTML = `
        <span class="solution-offer-summary-copy">
          <strong>Документация, характеристики, описание</strong>
          <span class="solution-offer-summary-meta">Все материалы и параметры в одном окне</span>
        </span>
        <span class="solution-offer-summary-action" aria-hidden="true">Подробнее</span>
      `;
    });
  }

  function getSolutionDetailPayload(solutionId) {
    const solution = solutionCatalogData[solutionId];
    const card = getSolutionCard(solutionId);

    if (!solution || !card) {
      return null;
    }

    return {
      ...solution,
      rewardLabel:
        solution.rewardLabel ||
        card.querySelector(".solution-offer-reward strong")?.textContent?.trim() ||
        "Уточняется",
      retailPrice:
        solution.retailPrice ||
        card.querySelector("[data-solution-price-value]")?.textContent?.trim() ||
        "Уточняется",
      priceLabel: solution.priceLabel || "Проектная цена с НДС",
      detailDescription: normalizeDetailDescription(
        solution.detailDescription ||
          solution.description ||
          "Подробные фотографии и характеристики будут добавлены позже."
      ),
      gallery: solution.gallery?.length
        ? solution.gallery
        : getFallbackSolutionGallery(card, solution),
      characteristics: solution.characteristics?.length
        ? sortSolutionCharacteristics(solution.characteristics)
        : sortSolutionCharacteristics(getFallbackSolutionCharacteristics(card, solution)),
    };
  }

  function updateSolutionDetailGallery(detailData) {
    if (!detailStage || !detailImage || !detailThumbs) {
      return;
    }

    const activeImage = detailData.gallery[activeDetailImageIndex];
    const hasImage = Boolean(activeImage);

    detailStage.classList.toggle("is-empty", !hasImage);

    if (!hasImage) {
      detailImage.removeAttribute("src");
      detailImage.alt = detailData.title;
    } else {
      detailImage.src = activeImage.image;
      detailImage.alt = activeImage.alt || detailData.title;
    }

    Array.from(detailThumbs.children).forEach((thumb, index) => {
      thumb.classList.toggle("is-active", index === activeDetailImageIndex);
    });
  }

  function setActiveSolutionDetailSection(sectionName) {
    activeDetailSection = sectionName;

    detailTabs.forEach((tab) => {
      const isActive = tab.dataset.solutionDetailTab === sectionName;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    detailSections.forEach((section) => {
      const isActive = section.dataset.solutionDetailSection === sectionName;
      section.classList.toggle("is-active", isActive);
      section.hidden = !isActive;
    });
  }

  function renderSolutionDetailDocs(solutionId, detailData) {
    if (!detailDocs) {
      return;
    }

    detailDocs.innerHTML = "";

    if (!detailData.docs?.length) {
      const emptyState = document.createElement("div");
      emptyState.className = "solution-offer-docs-empty";
      emptyState.innerHTML =
        "<strong>Документация готовится</strong><span>PDF-комплект по этой модификации появится здесь, как только будет загружен.</span>";
      emptyState.appendChild(createDocRequestSection(solutionId));
      detailDocs.appendChild(emptyState);
      return;
    }

    detailData.docs.forEach((item) => {
      const link = document.createElement("a");

      link.className = "solution-offer-doc";
      link.href = item.file;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.innerHTML = `
        ${pdfIconMarkup}
        <span class="solution-offer-doc-main">
          <strong>${item.title}</strong>
        </span>
        <span class="solution-offer-doc-size">${item.size}</span>
      `;
      detailDocs.appendChild(link);
    });
  }

  function renderSolutionDetailModal(solutionId) {
    const detailData = getSolutionDetailPayload(solutionId);

    if (!detailData || !detailModal) {
      return;
    }

    if (detailCode) {
      detailCode.textContent = detailData.code;
    }

    if (detailTitle) {
      detailTitle.textContent = detailData.title;
    }

    if (detailDescription) {
      detailDescription.innerHTML = "";
      detailData.detailDescription.forEach((paragraph) => {
        const paragraphNode = document.createElement("p");
        paragraphNode.textContent = paragraph;
        detailDescription.appendChild(paragraphNode);
      });
    }

    renderSolutionDetailDocs(solutionId, detailData);

    if (detailReward) {
      detailReward.textContent = detailData.rewardLabel;
    }

    if (detailPrice) {
      detailPrice.textContent = detailData.retailPrice;
    }

    if (detailPriceLabel) {
      detailPriceLabel.textContent = detailData.priceLabel;
    }

    if (detailLink) {
      detailLink.href = detailData.productUrl || "#";
      setAnchorState(detailLink, !detailData.productUrl || detailData.productUrl === "#");
    }

    if (detailThumbs) {
      detailThumbs.innerHTML = "";

      detailData.gallery.forEach((item, index) => {
        const thumb = document.createElement("button");
        const thumbImage = document.createElement("img");

        thumb.type = "button";
        thumb.className = "solution-detail-thumb";
        thumb.setAttribute("aria-label", item.label || `Фото ${index + 1}`);
        thumbImage.src = item.thumb || item.image;
        thumbImage.alt = item.alt || detailData.title;
        thumb.appendChild(thumbImage);
        thumb.addEventListener("click", () => {
          activeDetailImageIndex = index;
          updateSolutionDetailGallery(detailData);
        });
        detailThumbs.appendChild(thumb);
      });
    }

    if (detailCharacteristics) {
      detailCharacteristics.innerHTML = detailData.characteristics
        .map(
          (item) => `
            <div class="solution-detail-characteristic">
              <dt>${item.label}</dt>
              <dd>${item.value}</dd>
            </div>
          `
        )
        .join("");
    }

    activeDetailImageIndex = 0;
    setActiveSolutionDetailSection(activeDetailSection);
    updateSolutionDetailGallery(detailData);
  }

  function renderPreview(solution, documentItem) {
    const hasDocument = Boolean(documentItem);

    if (previewPanel) {
      previewPanel.classList.toggle("is-empty", !hasDocument);
    }

    if (!hasDocument) {
      if (previewImage) {
        previewImage.removeAttribute("src");
        previewImage.alt = solution.title;
      }

      if (previewLink) {
        previewLink.href = "#";
        setAnchorState(previewLink, true);
      }

      return;
    }

    if (previewImage) {
      previewImage.src = documentItem.preview;
      previewImage.alt = documentItem.title;
    }

    if (previewLink) {
      previewLink.href = documentItem.file;
      setAnchorState(previewLink, false);
    }
  }

  function renderDocumentList(solution) {
    if (!docList) {
      return;
    }

    docList.innerHTML = "";

    if (!solution.docs.length) {
      const emptyCard = document.createElement("div");
      emptyCard.className = "solution-document-empty";
      emptyCard.innerHTML =
        "<strong>Документация готовится</strong><p>Карточка решения уже есть в каталоге, но комплект PDF по этой модификации еще не загружен.</p>";
      emptyCard.appendChild(createDocRequestSection(activeSolutionId));
      docList.appendChild(emptyCard);
      renderPreview(solution, null);
      return;
    }

    solution.docs.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "solution-document-item";
      button.classList.toggle("is-active", item.id === activeDocumentId);
      button.innerHTML = `
        ${pdfIconMarkup}
        <span class="solution-document-item-main">
          <strong>${item.title}</strong>
        </span>
        <span class="solution-document-item-meta">${item.size}</span>
      `;
      button.addEventListener("click", () => {
        activeDocumentId = item.id;
        renderSolutionPanel(activeSolutionId);
      });
      docList.appendChild(button);
    });

    const documentItem =
      solution.docs.find((item) => item.id === activeDocumentId) || solution.docs[0];
    activeDocumentId = documentItem.id;
    renderPreview(solution, documentItem);
  }

  function renderSolutionPanel(solutionId) {
    const solution = solutionCatalogData[solutionId];

    if (!solution) {
      return;
    }

    if (panelCode) {
      panelCode.textContent = solution.code;
    }

    if (docCount) {
      docCount.textContent = `${solution.docs.length} PDF`;
    }

    renderDocumentList(solution);
  }

  function closeProjectPicker() {
    if (!projectPicker) {
      return;
    }

    projectPicker.hidden = true;
    document.body.style.overflow = "";
  }

  function closeDocsDrawer() {
    if (!docsDrawer) {
      return;
    }

    docsDrawer.hidden = true;
    document.body.style.overflow = "";
  }

  function closeSolutionDetailModal() {
    if (!detailModal) {
      return;
    }

    detailModal.hidden = true;
    document.body.style.overflow = "";
  }

  function openDocsDrawer(solutionId) {
    if (!docsDrawer) {
      return;
    }

    closeSolutionDetailModal();
    activeSolutionId = solutionId;
    activeDocumentId = solutionCatalogData[activeSolutionId]?.docs[0]?.id || null;
    renderSolutionPanel(activeSolutionId);
    docsDrawer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function openSolutionDetailModal(solutionId) {
    if (!detailModal) {
      return;
    }

    closeDocsDrawer();
    closeProjectPicker();
    activeSolutionId = solutionId;
    activeDetailSection = "docs";
    renderSolutionDetailModal(solutionId);
    detailModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function openProjectPicker() {
    if (!projectPicker) {
      return;
    }

    closeSolutionDetailModal();
    projectPicker.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function applySolutionFilters() {
    const searchValue = (searchInput?.value || "").trim().toLowerCase();
    const categoryValue = categorySelect?.value || "all";
    const brandValue = brandSelect?.value || "all";
    const currentValue = currentSelect?.value || "all";
    const inputsValue = inputsSelect?.value || "all";
    const sectionValue = sectionSelect?.value || "all";

    const visibleCards = cards.filter((card) => {
      const matchesSearch =
        !searchValue ||
        (card.dataset.search || "").toLowerCase().includes(searchValue);
      const matchesCategory =
        categoryValue === "all" || card.dataset.category === categoryValue;
      const matchesBrand =
        brandValue === "all" || card.dataset.brand === brandValue;
      const matchesCurrent =
        currentValue === "all" || card.dataset.current === currentValue;
      const matchesInputs =
        inputsValue === "all" || card.dataset.inputs === inputsValue;
      const matchesSection =
        sectionValue === "all" || card.dataset.section === sectionValue;
      const isVisible =
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesCurrent &&
        matchesInputs &&
        matchesSection;

      card.hidden = !isVisible;
      return isVisible;
    });

    if (emptyState) {
      emptyState.hidden = visibleCards.length > 0;
    }

    if (!visibleCards.length) {
      closeDocsDrawer();
      return;
    }

    const activeCard = visibleCards.find(
      (card) => card.dataset.solutionId === activeSolutionId
    );

    const selectedCard = activeCard || visibleCards[0];
    activeSolutionId = selectedCard.dataset.solutionId;
  }

  renderSolutionOfferCodes();
  renderSolutionOfferSummaries();

  cards.forEach((card) => {
    const solutionId = card.dataset.solutionId;
    const mediaTrigger = card.querySelector(".solution-offer-media");
    const title = card.querySelector(".solution-offer-main h3")?.textContent?.trim();

    if (!solutionId || !mediaTrigger) {
      return;
    }

    mediaTrigger.tabIndex = 0;
    mediaTrigger.setAttribute("role", "button");
    mediaTrigger.setAttribute(
      "aria-label",
      title ? `Открыть карточку решения: ${title}` : "Открыть карточку решения"
    );

    mediaTrigger.addEventListener("click", () => {
      openSolutionDetailModal(solutionId);
    });

    mediaTrigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openSolutionDetailModal(solutionId);
    });
  });

  docsTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const solutionId = trigger.dataset.openSolutionDocs;

      if (!solutionId) {
        return;
      }

      openDocsDrawer(solutionId);
    });
  });

  detailTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const solutionId = trigger.dataset.openSolutionDetail;

      if (!solutionId) {
        return;
      }

      openSolutionDetailModal(solutionId);
    });
  });

  detailTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const sectionName = tab.dataset.solutionDetailTab;

      if (!sectionName) {
        return;
      }

      setActiveSolutionDetailSection(sectionName);
    });
  });

  [searchInput, categorySelect, brandSelect, currentSelect, inputsSelect, sectionSelect].forEach((field) => {
    if (!field) {
      return;
    }

    field.addEventListener("input", applySolutionFilters);
    field.addEventListener("change", applySolutionFilters);
  });

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      activeSolutionId = trigger.dataset.solutionId || activeSolutionId;
      openProjectPicker();
    });
  });

  if (detailProjectTrigger) {
    detailProjectTrigger.addEventListener("click", () => {
      openProjectPicker();
    });
  }

  if (projectPickerClose) {
    projectPickerClose.addEventListener("click", closeProjectPicker);
  }

  if (projectPicker) {
    projectPicker.addEventListener("click", (event) => {
      if (event.target === projectPicker) {
        closeProjectPicker();
      }
    });
  }

  if (docsDrawerClose) {
    docsDrawerClose.addEventListener("click", closeDocsDrawer);
  }

  if (docsDrawer) {
    docsDrawer.addEventListener("click", (event) => {
      if (event.target === docsDrawer) {
        closeDocsDrawer();
      }
    });
  }

  if (detailModalClose) {
    detailModalClose.addEventListener("click", closeSolutionDetailModal);
  }

  if (detailModal) {
    detailModal.addEventListener("click", (event) => {
      if (event.target === detailModal) {
        closeSolutionDetailModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSolutionDetailModal();
    }
  });

  applySolutionFilters();
}

setupSolutionsCatalog();
