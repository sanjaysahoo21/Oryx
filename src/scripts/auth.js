function togglePassword(fieldId, iconId) {
    const passwordField = document.getElementById(fieldId);
    const passwordIcon = document.getElementById(iconId);
    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordIcon.classList.remove("bi-eye");
        passwordIcon.classList.add("bi-eye-slash");
    } else {
        passwordField.type = "password";
        passwordIcon.classList.remove("bi-eye-slash");
        passwordIcon.classList.add("bi-eye");
    }
}

function socialLogin(provider) {
    showMessage(`Login with ${provider} is not implemented.`);
}

function demoLogin() {
    document.getElementById('signinEmail').value = 'demo@example.com';
    document.getElementById('signinPassword').value = 'password123';
}

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const authFormContainer = document.getElementById('auth-form-container');
    const loggedInView = document.getElementById('logged-in-view');
    const loggedInEmailEl = document.getElementById('logged-in-email');
    const logoutButton = document.getElementById('logout-button');

    const USERS_KEY = 'oryx_users';
    const LOGGED_IN_USER_KEY = 'oryx_logged_in_user';

    const showMessage = (message, type = 'danger') => {
        const element = type === 'success' ? successMessage : errorMessage;
        const otherElement = type === 'success' ? errorMessage : successMessage;

        element.textContent = message;
        element.classList.remove('d-none');
        otherElement.classList.add('d-none');

        setTimeout(() => {
            element.classList.add('d-none');
        }, 4000);
    };

    const loggedInUserEmail = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (loggedInUserEmail) {
        authFormContainer.classList.add('d-none');
        loggedInView.classList.remove('d-none');
        loggedInEmailEl.textContent = `Logged in as: ${loggedInUserEmail}`;
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(LOGGED_IN_USER_KEY);
        window.location.reload();
    });

    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('ConfirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (!name || !email || !password) {
            showMessage('Please fill in all required fields.');
            return;
        }
        if (password !== confirmPassword) {
            showMessage('Passwords do not match.');
            return;
        }
        if (!agreeTerms) {
            showMessage('You must agree to the terms to create an account.');
            return;
        }

        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        if (users.some(user => user.email === email)) {
            showMessage('An account with this email already exists.');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        showMessage('Signup successful! Please sign in.', 'success');
        signupForm.reset();

        const signinTabTrigger = document.getElementById('signin-tab');
        const tab = new bootstrap.Tab(signinTabTrigger);
        tab.show();
    });

    signinForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('signinEmail').value.trim();
        const password = document.getElementById('signinPassword').value;

        if (!email || !password) {
            showMessage('Please enter your email and password.');
            return;
        }

        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem(LOGGED_IN_USER_KEY, user.email);
            window.location.href = '../index.html';
        } else {
            showMessage('Invalid email or password. Please try again.');
        }
    });
});