// document.addEventListener("DOMContentLoaded", function () {
//     const buyButtons = document.querySelectorAll(".buy-button");
//     buyButtons.forEach(function (buyButton) {
//       buyButton.addEventListener("click", handleBuyButtonClick);
//     });
//   });
  
//   // Function to handle buy button click
//   const handleBuyButtonClick = (event) => {
//     const itemContainer = event.target.closest(".item");
//     const itemTitle = itemContainer.querySelector(".item-title").textContent;
//     const itemPrice = parseInt(itemContainer.querySelector(".item-price").textContent.slice(1)); // Extract the price and convert to an integer
//     const credits = getCurrentCredits(); // Replace with the actual function to get the user's current credits
  
//     if (validatePurchase(credits, itemPrice)) {
//       const remainingCredits = deductCredits(credits, itemPrice); // Replace with the actual function to deduct the item price from the user's credits
//       showPurchaseSuccessAlert(itemTitle, remainingCredits);
//     } else {
//       showPurchaseErrorAlert();
//     }
//   };
  
//   // Function to validate the purchase
//   const validatePurchase = (credits, itemPrice) => {
//     return credits >= itemPrice;
//   };
  
//   // Function to show the purchase success alert
//   const showPurchaseSuccessAlert = (itemTitle, remainingCredits) => {
//     alert(`Purchase of ${itemTitle} successful!\nRemaining Credits: ${remainingCredits}`);
//   };
  
//   // Function to show the purchase error alert
//   const showPurchaseErrorAlert = () => {
//     alert("Purchase failed. Please try again.");
//   };
  
//   // Example function to get the user's current credits (replace with your own implementation)
//   const getCurrentCredits = () => {
//     return 100; // Replace with the actual function to get the user's current credits
//   };
  
//   // Example function to deduct the item price from the user's credits (replace with your own implementation)
//   const deductCredits = (credits, itemPrice) => {
//     return credits - itemPrice; // Replace with the actual function to deduct the item price from the user's credits
//   };
  
document.addEventListener("DOMContentLoaded", function () {
    const buyButtons = document.querySelectorAll(".buy-button");
    buyButtons.forEach(function (buyButton) {
      buyButton.addEventListener("click", function () {
        alert("Purchase Successful");
      });
    });
  });
  