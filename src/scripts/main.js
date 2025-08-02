function logout() {
    const isConfirmed = confirm("Are you sure you want to log out?");
    
    if (isConfirmed) {
        localStorage.removeItem('oryx_logged_in_user');
        showToast('You have been logged out.'); 
        setTimeout(() => window.location.href = 'index.html', 1000);
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    const toastColors = {
        success: '#198754',
        danger: '#dc3545',
        info: '#0dcaf0'
    };

    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        color: white;
        background-color: ${toastColors[type] || toastColors.info};
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.4s ease;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 400);
    }, 3000);
}document.addEventListener('DOMContentLoaded', function() {
    const LOGGED_IN_USER_KEY = 'oryx_logged_in_user';
    const USERS_KEY = 'oryx_users';
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userNameEl = document.getElementById('userName');
    const getStartedButtons = document.getElementById('getStartedButtons');
    const profileButtons = document.getElementById('profileButtons');
    const loadingScreen = document.getElementById('loadingScreen');
    function checkAuthStatus() {
        const loggedInUserEmail = localStorage.getItem(LOGGED_IN_USER_KEY);
        
        if (loggedInUserEmail && authButtons && userMenu) {
            authButtons.classList.add('d-none');
            userMenu.classList.remove('d-none');
            const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
            const currentUser = users.find(user => user.email === loggedInUserEmail);
            if (userNameEl) {
                userNameEl.textContent = currentUser ? currentUser.name : 'User';
            }
            if (getStartedButtons && profileButtons) {
                getStartedButtons.classList.add('d-none');
                profileButtons.classList.remove('d-none');
            }

        } else {
            authButtons.classList.remove('d-none');
            userMenu.classList.add('d-none');
            
            if (getStartedButtons && profileButtons) {
                getStartedButtons.classList.remove('d-none');
                profileButtons.classList.add('d-none');
            }
        }
    }
    
    function handleProtectedLinks() {
        const isLoggedIn = !!localStorage.getItem(LOGGED_IN_USER_KEY);
        const protectedLinks = document.querySelectorAll('.protected-link');

        protectedLinks.forEach(link => {
            if (!isLoggedIn) {
                link.classList.add('disabled'); 
                link.setAttribute('title', 'Please sign in to access this feature.');
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    showToast('Please sign in to access this feature.', 'info');
                }, { once: true });
            } else {
                link.classList.remove('disabled');
                link.removeAttribute('title');
            }
        });
    }
    function startLoading() {
        const progressBar = document.getElementById('loadingProgress');
        const progressText = document.getElementById('progressText');
        if (!loadingScreen || !progressBar || !progressText) return;
        
        if (sessionStorage.getItem('oryx_session_started')) {
            loadingScreen.style.display = 'none';
            return;
        }
        sessionStorage.setItem('oryx_session_started', 'true');

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5 + 1;
            progress = Math.min(progress, 100);
            progressBar.style.width = progress + '%';
            progressText.textContent = Math.floor(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => loadingScreen.style.display = 'none', 500);
                }, 500);
            }
        }, 80);
    }
    startLoading();
    checkAuthStatus();
    handleProtectedLinks();

    window.logout = logout;
});