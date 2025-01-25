// Create floating UI
const floatingUI = document.createElement("div");
floatingUI.id = "ai-assistant-ui";
floatingUI.classList.add("minimized"); // Start minimized

floatingUI.innerHTML = `
  <div id="ai-header">
    AI Code Companion
    <button id="toggle-ui">+</button>
  </div>
  <div id="chat-container" class="hidden">
    <div id="chat-messages"></div>
    <div id="chat-input-container">
      <textarea id="user-query" placeholder="Enter your query"></textarea>
      <button id="send-query">Send</button>
    </div>
  </div>
`;

document.body.appendChild(floatingUI);

// Extract problem content from the page
function extractProblemContent() {
    const problemElement = document.querySelector(".elfjS"); // Update this selector if needed
    return problemElement ? problemElement.innerText : "Problem content cannot be found.";
}

// Toggle the visibility of the chat UI
document.getElementById("toggle-ui").addEventListener("click", () => {
    const ui = document.getElementById("ai-assistant-ui");
    const chatContainer = document.getElementById("chat-container");
    const toggleButton = document.getElementById("toggle-ui");

    if (ui.classList.contains("minimized")) {
        ui.classList.remove("minimized");
        chatContainer.classList.remove("hidden");
        toggleButton.innerText = "−"; // Change button to a minus sign
    } else {
        ui.classList.add("minimized");
        chatContainer.classList.add("hidden");
        toggleButton.innerText = "+"; // Change button back to a plus sign
    }
});

// Add event listener for the send button
document.getElementById("send-query").addEventListener("click", async () => {
    const pageContent = extractProblemContent();
    const userQuery = document.getElementById("user-query").value;

    if (!userQuery.trim()) {
        alert("Please enter a user query.");
        return;
    }

    // Display user's query in the chat
    const chatMessages = document.getElementById("chat-messages");
    const userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user");
    userMessage.innerText = userQuery;
    chatMessages.appendChild(userMessage);

    // Clear the input field
    document.getElementById("user-query").value = "";

    try {
        const response = await fetch("http://127.0.0.1:5000/generate_response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ page_content: pageContent, user_query: userQuery }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // Display AI's response in the chat
        const aiResponse = data.response;
        const aiMessage = document.createElement("div");
        aiMessage.classList.add("chat-message", "ai");
        aiMessage.innerText = aiResponse;
        chatMessages.appendChild(aiMessage);

        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch AI response. Please try again.");
    }
});