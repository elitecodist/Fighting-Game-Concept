import { UntitledCardGame } from "./UntitledCardGame.js";
// import { FighterState } from "./constants/fighter.js";

// function populateMoveDropdown() {
//     const dropdown = document.getElementById("state-dropdown");
    
//     Object.entries(FighterState).forEach(([, value]) => {
//         const option = document.createElement('option');
//         option.innerText = value;
//         dropdown.appendChild(option);
//     });
// }

window.addEventListener('load', function() {
    // populateMoveDropdown();
    this.window.addEventListener('click', function() {
        new UntitledCardGame().start();
    })
});