    const menuBTN =
   document.getElementById("menuBTN");
   const dropdown =
   document.getElementById("dropdown");

   menuBTN.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("active");
   });

   document.addEventListener("click", (e) => {
      const clickedInsideDropdown = dropdown.contains(e.target);
      const clickedmenuBTN = menuBTN.contains(e.target);

      if (!clickedInsideDropdown && ! clickedmenuBTN){
         dropdown.classList.remove("active");
      }
   });