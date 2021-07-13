const root = document.documentElement;
const darkModeSwitch = document.getElementById("dark-mode-switch");
const sidebarIcon = document.getElementById("sidebar-icon");
const micOffIcon = document.getElementById("mic-off-icon");
const micOnIcon = document.getElementById("mic-on-icon");

const blurDiv = document.getElementById("blur");
const sidebar = document.getElementById("sidebar");
const sidebarTogglerContainer = document.getElementById("sidebar-toggler");

// show and hide sidebar
let sidebarActive = false;
sidebarTogglerContainer.onclick = () => {
  if (sidebarActive) {
    sidebarTogglerContainer.style.transform = "";
    blurDiv.style.backdropFilter = "";
    sidebar.style.left = "-250px";
    sidebarTogglerContainer.style.left = "";
    sidebarActive = false;
  } else {
    sidebarTogglerContainer.style.transform = "rotateZ(180deg)";
    blurDiv.style.backdropFilter = "blur(1px)";
    sidebar.style.left = "0";
    sidebarTogglerContainer.style.left = "280px";
    sidebarActive = true;
  }
};

// darkmode
darkModeSwitch.onclick = () => {
  if (darkModeSwitch.checked) {
    root.style.setProperty("--background-color", "#212529");
    root.style.setProperty("--foreground-color", "#fff");
    sidebarIcon.style.fill = "white";
    micOffIcon.style.fill = "white";
    micOnIcon.style.fill = "white";
  } else {
    root.style.setProperty("--background-color", "#fff");
    root.style.setProperty("--foreground-color", "#212529");
    sidebarIcon.style.fill = "black";
    micOffIcon.style.fill = "black";
    micOnIcon.style.fill = "black";
  }
};
