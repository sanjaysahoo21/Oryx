function togglePassword(fieldId, iconId) {
    const passwordField = document.getElementById(fieldId);
    const passwordIcon = document.getElementById(iconId);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordIcon.className = "bi bi-eye-slash";
    } else {
        passwordField.type = "password";
        passwordIcon.className = "bi bi-eye";
    }
}

function socialLogin(provider) {
    showMessage(`Login with ${provider} is not implemented.`, 'info');
}

function demoLogin() {
    const users = JSON.parse(localStorage.getItem('oryx_users')) || [];
    const demoEmail = 'sriganeshmenni';
    const demoPassword = 'password123';
    
    if (!users.some(user => user.email === demoEmail)) {
        users.push({ name: 'Sri Ganesh Menni', email: demoEmail, password: demoPassword });
        localStorage.setItem('oryx_users', JSON.stringify(users));
    }
    
    localStorage.setItem('oryx_logged_in_user', demoEmail);
    window.location.href = '../index.html';
}

function showMessage(message, type = 'danger') {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const element = type === 'success' ? successMessage : errorMessage;
    const otherElement = type === 'success' ? errorMessage : successMessage;

    if (!element || !otherElement) return;

    element.textContent = message;
    element.classList.remove('d-none');
    otherElement.classList.add('d-none');

    setTimeout(() => {
        element.classList.add('d-none');
    }, 4000);
}

function updateViewForLoggedInUser(email) {
    const authFormContainer = document.getElementById('auth-form-container');
    const loggedInView = document.getElementById('logged-in-view');
    const loggedInEmailEl = document.getElementById('logged-in-email');

    if (authFormContainer && loggedInView && loggedInEmailEl) {
        authFormContainer.classList.add('d-none');
        loggedInView.classList.remove('d-none');
        loggedInEmailEl.textContent = `You are logged in as: ${email}`;
    }
}

window.togglePassword = togglePassword;
window.socialLogin = socialLogin;
window.demoLogin = demoLogin;

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const logoutButton = document.getElementById('logout-button');

    const USERS_KEY = 'oryx_users';
    const LOGGED_IN_USER_KEY = 'oryx_logged_in_user';

    const loggedInUserEmail = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (loggedInUserEmail) {
        updateViewForLoggedInUser(loggedInUserEmail);
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem(LOGGED_IN_USER_KEY);
            window.location.reload();
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('ConfirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            if (!name || !email || !password) return showMessage('Please fill in all required fields.');
            if (password !== confirmPassword) return showMessage('Passwords do not match.');
            if (!agreeTerms) return showMessage('You must agree to the terms to create an account.');

            const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
            if (users.some(user => user.email === email)) {
                return showMessage('An account with this email already exists.');
            }

            users.push({ name, email, password });
            localStorage.setItem(USERS_KEY, JSON.stringify(users));

            showMessage('Signup successful! Please sign in.', 'success');
            signupForm.reset();
            new bootstrap.Tab(document.getElementById('signin-tab')).show();
        });
    }

    if (signinForm) {
        signinForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('signinEmail').value.trim();
            const password = document.getElementById('signinPassword').value;

            if (!email || !password) return showMessage('Please enter your email and password.');

            const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem(LOGGED_IN_USER_KEY, user.email);
                window.location.href = '../index.html';
            } else {
                showMessage('Invalid email or password. Please try again.');
            }
        });
    }
});
