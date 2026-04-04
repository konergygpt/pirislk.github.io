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

function getSolutionRewardRule(code) {
  const normalizedCode = (code || "").trim().toUpperCase();
  return solutionRewardRules.find((rule) => normalizedCode.startsWith(rule.prefix));
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
    const tag = document.createElement("span");
    tag.className = "tag-item";
    tag.textContent = item;
    articleList.appendChild(tag);
  });

  articleInput.value = "";
}

if (addArticleButton) {
  addArticleButton.addEventListener("click", addArticleTag);
}

if (articleInput) {
  articleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addArticleTag();
    }
  });
}

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
    pageProgress.style.width = "100%";
  }

  window.setTimeout(() => {
    submitModal.classList.add("is-visible");
  }, 280);
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
    productUrl: "https://piris.ru/product/avr-prs-mb-2-1-100-chint",
    docs: [
      {
        id: "constructive-documentation",
        title: "Конструкторская документация",
        kind: "Общий файл",
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
        kind: "Габариты и монтаж",
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
        kind: "Электрическая логика",
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
        kind: "Состав решения",
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
  const statusPills = document.querySelectorAll("[data-solution-status-pill]");
  const resultsCount = document.querySelector("[data-solution-results-count]");
  const emptyState = document.querySelector("[data-solution-empty]");

  const docsTriggers = document.querySelectorAll("[data-open-solution-docs]");
  const panelCode = document.querySelector("[data-solution-panel-code]");
  const projectTriggers = document.querySelectorAll("[data-solution-project-trigger]");
  const projectPicker = document.querySelector("[data-project-picker]");
  const projectPickerClose = document.querySelector("[data-project-picker-close]");
  const docsDrawer = document.querySelector("[data-solution-doc-drawer]");
  const docsDrawerClose = document.querySelector("[data-solution-doc-drawer-close]");

  const docCount = document.querySelector("[data-solution-doc-count]");
  const docList = document.querySelector("[data-solution-doc-list]");
  const previewPanel = document.querySelector("[data-solution-preview-panel]");
  const previewImage = document.querySelector("[data-solution-preview-image]");
  const previewLink = document.querySelector("[data-solution-preview-link]");

  let activeStatusFilter = "all";
  let activeSolutionId =
    cards[0]?.dataset.solutionId;
  let activeDocumentId = solutionCatalogData[activeSolutionId]?.docs[0]?.id || null;

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
        <span class="solution-document-icon" aria-hidden="true">PDF</span>
        <span class="solution-document-item-main">
          <strong>${item.title}</strong>
          <span>${item.kind}</span>
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

  function openDocsDrawer(solutionId) {
    if (!docsDrawer) {
      return;
    }

    activeSolutionId = solutionId;
    activeDocumentId = solutionCatalogData[activeSolutionId]?.docs[0]?.id || null;
    renderSolutionPanel(activeSolutionId);
    docsDrawer.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function openProjectPicker() {
    if (!projectPicker) {
      return;
    }

    projectPicker.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function applySolutionFilters() {
    const searchValue = (searchInput?.value || "").trim().toLowerCase();
    const categoryValue = categorySelect?.value || "all";
    const brandValue = brandSelect?.value || "all";

    const visibleCards = cards.filter((card) => {
      const matchesSearch =
        !searchValue ||
        (card.dataset.search || "").toLowerCase().includes(searchValue);
      const matchesCategory =
        categoryValue === "all" || card.dataset.category === categoryValue;
      const matchesBrand =
        brandValue === "all" || card.dataset.brand === brandValue;
      const matchesStatus =
        activeStatusFilter === "all" ||
        card.dataset.status === activeStatusFilter ||
        card.dataset.current === activeStatusFilter;
      const isVisible =
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesStatus;

      card.hidden = !isVisible;
      return isVisible;
    });

    if (resultsCount) {
      resultsCount.textContent = formatSolutionCount(visibleCards.length);
    }

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

  docsTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const solutionId = trigger.dataset.openSolutionDocs;

      if (!solutionId) {
        return;
      }

      openDocsDrawer(solutionId);
    });
  });

  statusPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      activeStatusFilter = pill.dataset.solutionStatusPill || "all";

      statusPills.forEach((item) => {
        item.classList.toggle("active", item === pill);
      });

      applySolutionFilters();
    });
  });

  [searchInput, categorySelect, brandSelect].forEach((field) => {
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

  applySolutionFilters();
}

setupSolutionsCatalog();
