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

    async function getAiResponse(prompt) {
        // Replace with your actual API key
        const apiKey = "YOUR_API_KEY_HERE";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const requestPayload = {
            contents: [{
                role: "user",
                parts: [{
                    text: `You are a helpful and encouraging AI career assistant for a platform called Oryx. A user is asking for career advice. Keep your answers concise and helpful. User's query: "${prompt}"`
                }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "I'm not sure how to respond to that. Could you please rephrase?";
        }
    }
});