document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatWindow = document.getElementById('chat-window');
    const typingIndicator = document.getElementById('typing-indicator');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = messageInput.value.trim();

        if (userMessage === '') {
            return;
        }

        appendMessage(userMessage, 'user');
        messageInput.value = '';
        chatWindow.scrollTop = chatWindow.scrollHeight;

        typingIndicator.classList.remove('d-none');
        chatWindow.scrollTop = chatWindow.scrollHeight;

        try {
            const aiResponse = await getAiResponse(userMessage);

            typingIndicator.classList.add('d-none');

            appendMessage(aiResponse, 'ai');
            chatWindow.scrollTop = chatWindow.scrollHeight;

        } catch (error) {
            console.error("Error fetching AI response:", error);
            typingIndicator.classList.add('d-none');
            appendMessage("Sorry, I'm having trouble connecting. Please try again later.", 'ai');
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    });

    function appendMessage(message, sender) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message', `${sender}-message`);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');

        const paragraph = document.createElement('p');
        paragraph.textContent = message;

        messageContent.appendChild(paragraph);
        messageWrapper.appendChild(messageContent);
        chatWindow.appendChild(messageWrapper);
    }

    // Using OpenAI API implementation
    async function getAiResponse(prompt) {
        const apiKey = "AIzaSyBf4x4iiuNSwxiC-fM-ioeu7YZd82KefSw";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const requestPayload = {
            contents: [{
                role: "user",
                parts: [{text: prompt}]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        const aiText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        return aiText || "I'm not sure how to respond to that.";
    }
});