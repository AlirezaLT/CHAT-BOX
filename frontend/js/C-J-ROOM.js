const overlay = 
document.getElementById("modaloverlay");

const creratemodel = 
document.getElementById("createroommodal");

const joinmodel = 
document.getElementById("joinroommodal");

function openmodel(modal) {
    overlay.classList.add("active");
    modal.classList.add("active");
}

function closemodal() {
    overlay.classList.remove("active");
    creratemodel.classList.remove("active");
    joinmodel.classList.remove("active");
}

    document.querySelector(".dd-item:nth-child(2)") . addEventListener("click" , () => openmodel(createroommodal));

    document.querySelector(".dd-item:nth-child(3)") . addEventListener("click" , () => openmodel(joinroommodal));

    document.querySelectorAll(".modal-close").forEach(btn => btn.addEventListener("click" , closemodal));
    overlay.addEventListener("click" , closemodal);