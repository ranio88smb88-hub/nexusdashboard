
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form-el');
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            // Simple Security Layer
            if (user === 'admin' && pass === 'staff123') {
                const session = {
                    user: user,
                    role: 'SUPERVISOR',
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('nexus_session', JSON.stringify(session));
                window.location.href = 'dashboard.html';
            } else {
                alert('ACCESS DENIED: Credentials mismatch. Hint: admin / staff123');
            }
        });
    }
});

function logout() {
    localStorage.removeItem('nexus_session');
    window.location.href = 'index.html';
}
