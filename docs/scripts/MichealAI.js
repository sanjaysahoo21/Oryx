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

        if (sender === 'ai') {
            messageContent.innerHTML = formatAIResponse(message);
        } else {
            const paragraph = document.createElement('p');
            paragraph.textContent = message;
            messageContent.appendChild(paragraph);
        }

        messageWrapper.appendChild(messageContent);
        chatWindow.appendChild(messageWrapper);
    }

    function formatAIResponse(text) {
        let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<h6 class="text-muted fw-bold mt-3 mb-2">$1</h6>');
        
        formatted = formatted.replace(/\* ([^*\n]+)/g, '<div class="ms-3 mb-1">• $1</div>');
        
        formatted = formatted.replace(/(\d+\.\s+)([^0-9\n]+)/g, '<div class="mb-2"><strong>$1</strong>$2</div>');
        
        formatted = formatted.replace(/\. ([A-Z])/g, '.</p><p class="mb-2">$1');
        
        if (!formatted.includes('<')) {
            formatted = `<p class="mb-2">${formatted}</p>`;
        } else {
            formatted = formatted.replace(/^([^<][^<>]*?)(<h6|<div)/g, '<p class="mb-2">$1</p>$2');
            formatted = formatted.replace(/([^>])([^<>]+)$/g, '$1<p class="mb-2">$2</p>');
        }
        
        return formatted;
    }

    async function getAiResponse(prompt) {
        // Using Google Gemini API (free tier available)
        const apiKey = "AIzaSyDj-7OoRjAFkAEQiK-mxWKSGSGnTPidQP4";
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

        // Gemini's correct request format
        const requestPayload = {
            contents: [{
                parts: [{
                    text: `You are Michele AI, a helpful and friendly assistant.\n\nUser: ${prompt}\nMichele AI:`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // ✅ No Authorization header—Gemini uses API key in URL
            },
            body: JSON.stringify(requestPayload)
        });

        let resultJson = null;
        try {
            resultJson = await response.json();
            console.log("Gemini Response:", resultJson); // For debugging
        } catch (e) {
            throw new Error(`Failed to parse API response: ${e.message}`);
        }

        if (!response.ok) {
            const apiErr = resultJson?.error?.message || `API request failed with status ${response.status}`;
            console.error("Gemini API Error:", resultJson);
            throw new Error(apiErr);
        }

        // ✅ Gemini's response structure is different from OpenAI
        const aiText = resultJson?.candidates?.[0]?.content?.parts?.[0]?.text;
        return aiText || "I'm not sure how to respond to that.";
    }
});
