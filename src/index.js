let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  document.querySelector(".add-toy-form").addEventListener("submit", handleCreateButton);
  
  function handleCreateButton(e) {
    e.preventDefault();

    let toyObj = {
      name: e.target.name.value,
      image: e.target.image.value,
      likes: 0
    };
    
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(toyObj)
    })
    .then(res => res.json())
    .then(toyCard => {
      addToyInfoToCard([toyCard]);
    });
  }

  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(dataToys => {
      addToyInfoToCard(dataToys);
    });

  function addToyInfoToCard(toys) {
    let toyCollection = document.getElementById("toy-collection");

    toys.forEach(toy => {
      let toyCard = document.createElement("div");
      toyCard.className = "card";
      toyCard.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
      `;

      toyCollection.appendChild(toyCard);

      const likeButton = toyCard.querySelector(".like-btn");
      likeButton.addEventListener("click", () => handleLikeButton(toy));
    });
  }

  function handleLikeButton(toy) {
    const newLikes = toy.likes + 1;


    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      updateToyLikesInDOM(updatedToy);
    });
  }

  function updateToyLikesInDOM(toy) {
    const toyCards = document.querySelectorAll(".card");
    toyCards.forEach(card => {
      if (card.querySelector(".like-btn").dataset.id === toy.id.toString()) {
        card.querySelector("p").textContent = `${toy.likes} Likes`;
      }
    });
  }
});
