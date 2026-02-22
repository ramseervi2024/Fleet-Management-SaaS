const API_BASE = '/api';

const api = {
    async request(method, path, data = null) {
        const token = localStorage.getItem('fleet_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config = { method, headers };
        if (data && method !== 'GET') config.body = JSON.stringify(data);

        let url = `${API_BASE}${path}`;
        if (data && method === 'GET') {
            const params = new URLSearchParams(data);
            url += `?${params.toString()}`;
        }

        const res = await fetch(url, config);
        const json = await res.json();

        if (res.status === 401) {
            localStorage.clear();
            window.location.href = '/index.html';
            return;
        }

        return { ok: res.ok, status: res.status, data: json };
    },

    get: (path, params) => api.request('GET', path, params),
    post: (path, data) => api.request('POST', path, data),
    put: (path, data) => api.request('PUT', path, data),
    patch: (path, data) => api.request('PATCH', path, data),
    delete: (path) => api.request('DELETE', path),
};

// ─── Auth Utils ───────────────────────────────────────────────────────────
const auth = {
    getToken: () => localStorage.getItem('fleet_token'),
    getUser: () => {
        const u = localStorage.getItem('fleet_user');
        return u ? JSON.parse(u) : null;
    },
    getTenant: () => {
        const t = localStorage.getItem('fleet_tenant');
        return t ? JSON.parse(t) : null;
    },
    setSession(token, user, tenant) {
        localStorage.setItem('fleet_token', token);
        localStorage.setItem('fleet_user', JSON.stringify(user));
        localStorage.setItem('fleet_tenant', JSON.stringify(tenant));
    },
    clear() {
        localStorage.removeItem('fleet_token');
        localStorage.removeItem('fleet_user');
        localStorage.removeItem('fleet_tenant');
    },
    isLoggedIn: () => !!localStorage.getItem('fleet_token'),
    logout() {
        this.clear();
        window.location.href = '/index.html';
    },
};

// ─── Toast Notifications ──────────────────────────────────────────────────
const toast = {
    container: null,
    init() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },
    show(message, type = 'info', duration = 4000) {
        if (!this.container) this.init();
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<span>${icons[type]}</span> <span>${message}</span>`;
        this.container.appendChild(el);
        setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; el.style.transition = '0.3s ease'; setTimeout(() => el.remove(), 300); }, duration);
    },
    success: (msg) => toast.show(msg, 'success'),
    error: (msg) => toast.show(msg, 'error'),
    info: (msg) => toast.show(msg, 'info'),
};

// ─── Alert Box ───────────────────────────────────────────────────────────
function showAlert(id, message, type = 'error') {
    const el = document.getElementById(id);
    if (el) {
        el.className = `alert show alert-${type}`;
        el.textContent = message;
    }
}
function hideAlert(id) {
    const el = document.getElementById(id);
    if (el) el.className = 'alert';
}

// ─── Loading State ────────────────────────────────────────────────────────
function setLoading(btn, loading, text = null) {
    if (!btn) return;
    if (loading) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<div class="spinner"></div> ${text || 'Loading...'}`;
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || 'Submit';
    }
}

// ─── Format Helpers ───────────────────────────────────────────────────────
function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(amount, currency = 'USD') {
    if (amount == null) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
}

function timeAgo(date) {
    if (!date) return '—';
    const diff = (Date.now() - new Date(date).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Sidebar Active State ─────────────────────────────────────────────────
function setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-item').forEach(item => {
        const href = item.getAttribute('href');
        if (href && path.includes(href.replace('.html', ''))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ─── Init user info in sidebar ────────────────────────────────────────────
function initUserInfo() {
    const user = auth.getUser();
    const tenant = auth.getTenant();
    if (user) {
        const nameEl = document.getElementById('sidebar-user-name');
        const roleEl = document.getElementById('sidebar-user-role');
        const avatarEl = document.getElementById('sidebar-user-avatar');
        const tenantEl = document.getElementById('sidebar-tenant-name');
        if (nameEl) nameEl.textContent = user.name || 'User';
        if (roleEl) roleEl.textContent = user.role || 'driver';
        if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
        if (tenantEl) tenantEl.textContent = tenant?.name || 'Fleet Co.';
    }
}

// ─── Protect Page ─────────────────────────────────────────────────────────
function requireAuth() {
    if (!auth.isLoggedIn()) {
        window.location.href = '/index.html';
    }
}

// ─── Hamburger Toggle ─────────────────────────────────────────────────────
function initHamburger() {
    const ham = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    if (ham && sidebar) {
        ham.addEventListener('click', () => sidebar.classList.toggle('open'));
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !ham.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    toast.init();
    setActiveNav();
    initUserInfo();
    initHamburger();
});
