
// Get references to the tab elements
const friendsTab = document.querySelector("#friends-tab");
const searchTab = document.querySelector("#search-tab");
const sentRequestsTab = document.querySelector("#sent-requests-tab");
const receivedRequestsTab = document.querySelector("#received-requests-tab");

// Get references to the content elements
const friendsContent = document.querySelector(".friends-tab");
const searchContent = document.querySelector(".search-tab");
const sentRequestsContent = document.querySelector(".sent-requests-tab");
const receivedRequestsContent = document.querySelector(".received-requests-tab");

// Function to show the specified content and hide the rest
function showContent(contentElement) {
    const allContent = [friendsContent, searchContent, sentRequestsContent, receivedRequestsContent];

    // Hide all content elements
    allContent.forEach((content) => {
        content.style.display = "none";
    });

    // Show the specified content element
    contentElement.style.display = "block";
}

// Event listeners for tab clicks
friendsTab.addEventListener("click", () => {
    showContent(friendsContent);
});

searchTab.addEventListener("click", () => {
    showContent(searchContent);
});

sentRequestsTab.addEventListener("click", () => {
    showContent(sentRequestsContent);
});

receivedRequestsTab.addEventListener("click", () => {
    showContent(receivedRequestsContent);
});

// Show only the "Friends" content initially
showContent(friendsContent);

// Hide other content on page load
window.addEventListener("load", () => {
    const nonFriendsContent = [searchContent, sentRequestsContent, receivedRequestsContent];
    nonFriendsContent.forEach((content) => {
        content.style.display = "none";
    });
});



