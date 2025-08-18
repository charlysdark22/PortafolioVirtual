// Theme management
let currentTheme = localStorage.getItem("theme") || "light"

function setTheme(theme) {
  currentTheme = theme
  localStorage.setItem("theme", theme)

  if (theme === "dark") {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

function toggleTheme() {
  setTheme(currentTheme === "light" ? "dark" : "light")
}

// Initialize theme
document.addEventListener("DOMContentLoaded", () => {
  setTheme(currentTheme)

  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme)
  }
})
