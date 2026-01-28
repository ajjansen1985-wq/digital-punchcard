// How many cups / punches are on the card.
// Make sure this matches the number of .cup elements in index.html.
const TOTAL_PUNCHES = 20;
// Example: free drink every 10 punches (you can change this)
const REWARD_EVERY = 10;
// Key name for localStorage
const STORAGE_KEY = "coffeePunchesV1";

const cups = document.querySelectorAll(".cup");
const statusEl = document.getElementById("status");
const rewardEl = document.getElementById("rewardMessage");
const resetButton = document.getElementById("resetButton");

// This array will hold true/false for each cup (stamped or not)
let punches = new Array(TOTAL_PUNCHES).fill(false);

/**
 * Load state from localStorage if present
 */
function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    // Basic check: make sure it looks like an array of booleans
    if (Array.isArray(parsed) && parsed.length === TOTAL_PUNCHES) {
      punches = parsed;
    }
  } catch (err) {
    console.error("Could not parse stored punches:", err);
  }
}

/**
 * Save current punches array to localStorage
 */
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(punches));
}

/**
 * Update the UI based on current punches array
 */
function render() {
  punches.forEach((isStamped, index) => {
    const cup = cups[index];
    if (!cup) return;

    if (isStamped) {
      cup.classList.add("stamped");
      cup.setAttribute("aria-pressed", "true");
    } else {
      cup.classList.remove("stamped");
      cup.setAttribute("aria-pressed", "false");
    }
  });

  const stampedCount = punches.filter(Boolean).length;
  statusEl.textContent = `${stampedCount} / ${TOTAL_PUNCHES} punches`;

  // Reward logic
  if (stampedCount === 0) {
    rewardEl.textContent = "";
  } else if (stampedCount % REWARD_EVERY === 0) {
    rewardEl.textContent = "Free drink unlocked! 🎉";
  } else {
    const untilNext = REWARD_EVERY - (stampedCount % REWARD_EVERY);
    rewardEl.textContent = `${untilNext} more to your next free drink.`;
  }
}

/**
 * Handle a cup click:
 * - One-way stamp (once stamped, it stays stamped unless reset)
 */
function handleCupClick(event) {
  const cup = event.currentTarget;
  const index = Number(cup.dataset.index);

  // Ignore if already stamped
  if (punches[index]) return;

  punches[index] = true;
  saveToStorage();
  render();
}

/**
 * Reset everything
 */
function handleReset() {
  if (!confirm("Reset this punch card?")) return;

  punches = new Array(TOTAL_PUNCHES).fill(false);
  saveToStorage();
  render();
}

// Initial setup
loadFromStorage();
render();

cups.forEach((cup) => {
  cup.addEventListener("click", handleCupClick);
});

resetButton.addEventListener("click", handleReset);
