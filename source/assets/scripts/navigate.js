// Contains functions for navigating between pages

import { saveToMyRecipes } from "./create-edit-recipe.js";

/** BUTTONS **/

let createRecipeButton = document.getElementById("create-recipe-btn");
createRecipeButton.addEventListener("click", (e) => {
  changeView(e);
});
let myRecipesButton = document.getElementById("my-recipes-btn");
myRecipesButton.addEventListener("click", (e) => {
  changeView(e);
});
let exploreButton = document.getElementById("explore-btn");
exploreButton.addEventListener("click", (e) => {
  changeView(e);
});
let cookModeBtn = document.getElementById("cook-mode-btn");
cookModeBtn.addEventListener("click", (e) => {
  changeView(e);
});

let refreshButton = document.getElementById("refresh-btn");
refreshButton.addEventListener("click", (e) => {
  refresh();
});

let showMoreButton = document.getElementById("show-more-btn");
showMoreButton.addEventListener("click", (e) => {
  fetchApiRecipes();
});


/*
 * Function to switch pages
 */
export function changeView(e) {
  // reference for needed elements
  var myRecipes = document.querySelector(".recipe-cards--wrapper");
  var explore = document.querySelector(".explore");
  var createRecipe = document.querySelector(".section--create-recipe");
  var createButton = document.getElementById("create-recipe-btn");
  var returnButton = document.getElementById("return-btn");
  var editButton = document.getElementById("edit-btn");
  var deleteButton = document.getElementById("delete-btn");
  var expandRecipe = document.querySelector(".section--recipe-expand");
  var saveButtonCreate = document.querySelector("button.save-btn-create");
  const delbutIcon = document.getElementById("delbut-icon");
  const deleteMode = delbutIcon.className === "bi bi-arrow-return-left";
  const cookModeBut = document.getElementById("cook-mode-btn");
  const cookMode = document.querySelector(".section--cook-mode");
  const navBar = document.querySelector("nav");

  const innerText = typeof e === "string" ? e : e.target.innerText;

  // navigating to My Recipes page
  if (innerText === "My Recipes") {
    location.reload();
    myRecipes.classList.add("shown");
    explore.classList.remove("shown");
    createRecipe.classList.remove("shown");
    createButton.className = "btn btn-light";
    deleteButton.className = "btn btn-light";
    returnButton.className = "hidden";
    cookModeBut.className = "hidden";
    expandRecipe.classList.remove("shown");
    [...document.querySelectorAll(".col")].forEach((element) => {
      element.innerHTML = "";
    });
    editButton.style.display = "none";
  }
  // navigating to explore page
  else if (innerText === "Explore" && !deleteMode) {
    myRecipes.classList.remove("shown");
    createRecipe.classList.remove("shown");
    expandRecipe.classList.remove("shown");
    explore.classList.add("shown");
    createButton.className = "hidden";
    deleteButton.className = "hidden";
    editButton.style.display = "none";
    if(!returnButton.classList.contains("explore")) {
      refresh();
    }
    returnButton.className = "hidden";
    cookModeBut.className = "hidden";
  }
  // navigating to recipe expand page
  else if (innerText === "Recipe Expand") {
    myRecipes.classList.remove("shown");
    explore.classList.remove("shown");
    createRecipe.classList.remove("shown");
    cookMode.classList.remove("shown");
    expandRecipe.classList.add("shown");
    navBar.className = "navbar navbar-light bg-dark";
    //switchButtonView(returnButton);
    returnButton.classList.add("btn");
    returnButton.classList.add("btn-light");
    returnButton.classList.remove("hidden");
    deleteButton.className = "btn btn-light";
    cookModeBut.className = "btn btn-light";
    createButton.className = "hidden";

    // make edit button visible so user can click it
    editButton.style.display = "block";
  }
  // navigating to cook mode page
  else if (e.target.id === "cook-mode-btn" || e.target.id === "cook-mode-icon") {
    cookMode.classList.add("shown");
    expandRecipe.classList.remove("shown");
    navBar.className = "hidden";
    returnButton.className = "hidden";
    deleteButton.className = "hidden";
    cookModeBut.className = "hidden";
    editButton.style.display = "none";
  }
  // navigating to create recipe page
  else if (
    (e.target.id === "create-recipe-btn" ||
      e.target.id === "create-recipe-btn-plus") &&
    !deleteMode
  ) {
    myRecipes.classList.remove("shown");
    explore.classList.remove("shown");
    expandRecipe.classList.remove("shown");
    createRecipe.classList.add("shown");
    switchButtonView(createButton);
    switchButtonView(returnButton);
    switchButtonView(deleteButton);
    saveButtonCreate.style.display="block";
  }
  switchHighlight(innerText);
}

// switch between shown and hidden for button
export function switchButtonView(but) {
  but.className = but.className === "hidden" ? "btn btn-light" : "hidden";
}

/*
 * Function to change button highlight
 */
function switchHighlight(innerText) {
  let nav = document.querySelector(".navbar-nav");
  let buttons = nav.getElementsByTagName("*");
  let e;
  for (var i = 0; i < buttons.length; i++) {
    e = buttons[i];
    if (e.innerText === innerText) {
      e.classList.remove("btn-dark");
      e.classList.add("btn-white");
    } else {
      e.classList.add("btn-dark");
      e.classList.remove("btn-white");
    }
  }
}

/*
 * Function to fetch recipes from spoonacular and populate explore page
 */
async function fetchApiRecipes() {
  const API_KEY = "75d567c9173d40f69fad55f6870057fe";
  const response = await fetch(
    `https://api.spoonacular.com/recipes/random?number=15&apiKey=${API_KEY}`
  );

  // Storing data in form of JSON
  let data = await response.json();

  saveToMyRecipes(data);

  /*
  for (let i=0; i<3; i++) {
    const curRecipe = data.recipes[i];
    let summary = curRecipe.summary
    summary = summary.replaceAll('<b>', '')
    summary = summary.replaceAll('</b>', '')

    // Trim to fit recipe card size
    summary = summary.length > 173 ? summary.substring(0, 170) + "..." : summary
    
    let tags = curRecipe.cuisines.concat(curRecipe.diets).concat(curRecipe.dishTypes);

    let ingredients = curRecipe.extendedIngredients.map((v)=>{
        return v.name;
      });

    let directions;
    if(curRecipe.analyzedInstructions){
      directions = curRecipe.analyzedInstructions[0].steps.map((v)=>{
        return v.step;
      });
    }

    const recipeData = {
      thumbnail: data.recipes[i].image,
      name: data.recipes[i].title,
      description: summary,
      time: { hours: "", minutes: "" },
      tags,
      ingredients,
      directions,
    };
    
    const recipeCard = document.createElement("recipe-card");
    recipeCard.data = recipeData;
    recipeCard.addEventListener("click", (e) => {
        document.querySelector("recipe-expand").data = recipeData;
        changeView("Recipe Expand");
    });
    
    //document.querySelector("#explore-wrapper").appendChild(recipeCard);
    */
  }

/**
 * @method refresh
 *  Removes recipes and shows 15 other random recipes
 */
function refresh() {
  document.querySelector("#explore-wrapper").innerHTML = ""
  fetchApiRecipes()
}

// Function for return to home page
window.returnToHomePage = function () {
  const returnBut = document.getElementById("return-btn");
  console.log(returnBut.classList);
  if(returnBut.classList.contains("explore")){
    changeView("Explore");
    returnBut.classList.remove("explore");
  }
  else{
    location.reload();
  }
};

// Show tags when pressing filter button
window.showTags = function () {
  let tags = [];
  for (let i = 0; i < localStorage.length; i++) {
    const currentTags = JSON.parse(
      localStorage.getItem(localStorage.key(i))
    ).tags;
    currentTags.forEach(singleTag => {
      if(!tags.includes(singleTag))
      {
        tags.push(singleTag);
      }
    })
  }
  let divTag = document.getElementById("tag-wrapper-filter");
  // If it's not empty, make it empty
  if (!(divTag.innerHTML == "")) {
    divTag.innerHTML = ""; 
  }
  else {
  tags.forEach((element, i) => {
    const newTagBut = document.createElement("button");
    newTagBut.className = "but but-secondary filter-off";
    newTagBut.id = `${element}`;
    newTagBut.textContent = element;
    newTagBut.addEventListener("click", () => {
      if(newTagBut.classList.contains("filter-off")) {
        newTagBut.classList.replace("filter-off", "filter-on");
        newTagBut.style.backgroundColor = "pink";
        filterTags(element);
      } else {
        newTagBut.classList.replace("filter-on", "filter-off");
        newTagBut.style.backgroundColor = "transparent";
        filterTags(element);
      }
    });
    divTag.appendChild(newTagBut);
  });
  }  
};

// Show delete buttons for each card when click delete on home page
window.showDeleteButtons = function () {
  const expandSection = document.querySelector(".section--recipe-expand");
  if (expandSection.classList.contains("shown")) {
    const expandModal = document.querySelector(".delete-modal-expand");
    expandModal.classList.remove("hidden");
  } else {
    const recipeCards = document.getElementsByTagName("recipe-card");
    for (let recipeCard of recipeCards) {
      const delbut = recipeCard.shadowRoot.querySelector(".delbut");
      if (delbut.classList.contains("hidden")) {
        delbut.classList.remove("hidden");
        delbut.classList.add("btn");
      } else {
        delbut.classList.add("hidden");
        delbut.classList.remove("btn");
      }
    }

    const delbutIcon = document.getElementById("delbut-icon");
    delbutIcon.className =
      delbutIcon.className === "bi bi-trash"
        ? "bi bi-arrow-return-left"
        : "bi bi-trash";
  }
};

window.cancelDelete = function () {
  const expandModal = document.querySelector(".delete-modal-expand");
  expandModal.classList.add("hidden");
};

window.confirmDelete = function () {
  const expandRecipe = document.getElementsByTagName("recipe-expand");
  const curCardId =
    expandRecipe[0].shadowRoot.getElementById("input-name").textContent;
  localStorage.removeItem(curCardId.toLowerCase());
  cancelDelete();
  const recipeCardDiv = document.getElementById("recipe-cards");
  const deletedRecipe = document.getElementById(curCardId);
  recipeCardDiv.removeChild(deletedRecipe);
  changeView("My Recipes");
};
