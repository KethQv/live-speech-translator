const sidebar = document.getElementById("sidebar");
const sidebarToggler = document.getElementById("sidebar-toggler");
const blurDiv = document.getElementById("blur");
let sidebarActive = false;

sidebarToggler.onclick = () => {
  if (sidebarActive) {
    sidebarToggler.style.transform = "";
    blurDiv.style.backdropFilter = "";
    sidebar.style.left = "-180px";
    sidebarActive = false;
  } else {
    sidebarToggler.style.transform = "rotateZ(180deg)";
    blurDiv.style.backdropFilter = "blur(1px)";
    sidebar.style.left = "0";
    sidebarActive = true;
  }
};
