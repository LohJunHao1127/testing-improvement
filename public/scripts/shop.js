document.addEventListener("DOMContentLoaded", function() {
    const itemContainer = document.querySelector(".item-container"); // Update the selector to use querySelector
  
    // Fetch item data from the server and populate the item container
    fetch("/api/items")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((item) => {
          const itemCard = createItemCard(item);
          itemContainer.appendChild(itemCard);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
   
  
  
  function createItemCard(item) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("item");
  
    const itemImg = document.createElement("img");
    itemImg.src = item.item_img;
    itemImg.alt = "Item Image";
    itemCard.appendChild(itemImg);
  
    const itemDetails = document.createElement("div");
    itemDetails.classList.add("item-details");
  
    const itemTitle = document.createElement("h2");
    itemTitle.classList.add("item-title");
    itemTitle.textContent = item.item_title;
    itemDetails.appendChild(itemTitle);
  
    const itemPrice = document.createElement("p");
    itemPrice.classList.add("item-price");
    itemPrice.textContent = "$" + item.item_price;
    itemDetails.appendChild(itemPrice);
  
    const itemDescription = document.createElement("p");
    itemDescription.classList.add("item-description");
    itemDescription.textContent = item.item_description;
    itemDetails.appendChild(itemDescription);
  
    const buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    buyButton.textContent = "Buy Now";
    itemDetails.appendChild(buyButton);
  
    itemCard.appendChild(itemDetails);
  
    return itemCard;
  }
  
  //purchase item
  document.addEventListener("DOMContentLoaded", function () {
    const buyButtons = document.querySelectorAll(".buy-button");
  
    buyButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const itemTitle = this.parentNode.querySelector(".item-title").textContent;
  
        // Prompt the user for confirmation
        const confirmation = confirm(`Are you sure you want to buy ${itemTitle}?`);
        
        // Check the user's confirmation
        if (confirmation) {
          // Successful purchase
          alert("Successful purchase");
        } else {
          // Purchase failed
          alert("Purchase failed");
        }
      });
    });
  });
  