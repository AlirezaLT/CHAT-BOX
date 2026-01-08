   const menuBTN =
    document.getElementById("menuBTN");
   const dropdown =
   document.getElementById("dropdown");

   menuBTN.addEventListener("click", () => {
    dropdown.classList.toggle("active");
   });
