// Reflex admin dashboard — single source of truth for the admin UI.

const token = localStorage.getItem('token');
const role = localStorage.getItem('role');
const username = localStorage.getItem('username');

if (!token || role !== 'admin') {
  alert('Admin access required. Please log in as admin.');
  window.location.href = 'login.html';
}

const adminNameEl = document.getElementById('admin-name');
if (adminNameEl) adminNameEl.textContent = username || 'Admin';
const settingsName = document.getElementById('settings-admin-name');
if (settingsName) settingsName.textContent = username || 'admin';

async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };
  const res = await fetch(path, { ...options, headers });
  if (res.status === 401 || res.status === 403) {
    alert('Session expired or unauthorized. Please log in again.');
    localStorage.clear();
    window.location.href = 'login.html';
    throw new Error('unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ---------- Navigation ----------
function showSection(id, navId) {
  document.querySelectorAll('.content-section').forEach((s) => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');

  document.querySelectorAll('.sidebar-nav .nav-link').forEach((l) => l.classList.remove('active'));
  if (navId) {
    const link = document.getElementById(navId);
    if (link) link.classList.add('active');
  }
}

document.getElementById('nav-home').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('home-section', 'nav-home');
  loadStats();
});
document.getElementById('nav-appointments').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('appointments-section', 'nav-appointments');
  loadAppointments();
});
document.getElementById('nav-users').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('users-section', 'nav-users');
  loadUsers();
});
document.getElementById('nav-settings').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('settings-section', 'nav-settings');
  loadHealth();
});
document.getElementById('nav-logout').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = 'login.html';
});

// ---------- Stats ----------
async function loadStats() {
  try {
    const stats = await api('/api/dashboard-stats');
    document.getElementById('stat-total-appts').textContent = stats.totalAppointments;
    document.getElementById('stat-total-users').textContent = stats.totalUsers;
    document.getElementById('stat-pending-appts').textContent = stats.pendingAppointments;
    document.getElementById('stat-approved-appts').textContent = stats.approvedAppointments;
  } catch (err) {
    console.error('Failed to load stats:', err);
  }
}

async function loadHealth() {
  try {
    const data = await fetch('/api/health').then((r) => r.json());
    document.getElementById('settings-server-time').textContent = data.time;
  } catch {
    document.getElementById('settings-server-time').textContent = 'unreachable';
  }
}

// ---------- Appointments ----------
const apptSearch = document.getElementById('appt-search');
const apptStatus = document.getElementById('appt-status-filter');
const apptRefresh = document.getElementById('appt-refresh');

let apptSearchTimer;
apptSearch.addEventListener('input', () => {
  clearTimeout(apptSearchTimer);
  apptSearchTimer = setTimeout(loadAppointments, 250);
});
apptStatus.addEventListener('change', loadAppointments);
apptRefresh.addEventListener('click', loadAppointments);

async function loadAppointments() {
  const params = new URLSearchParams();
  if (apptSearch.value) params.set('q', apptSearch.value);
  if (apptStatus.value) params.set('status', apptStatus.value);

  const tbody = document.getElementById('appointments-body');
  tbody.innerHTML = '<tr><td colspan="8">Loading…</td></tr>';

  try {
    const data = await api(`/api/appointments?${params.toString()}`);
    if (!data.length) {
      tbody.innerHTML = '<tr><td colspan="8">No appointments found.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    data.forEach((appt, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(appt.name)}</td>
        <td>${escapeHtml(appt.email)}</td>
        <td>${escapeHtml(appt.phone)}</td>
        <td>${escapeHtml(appt.date)}</td>
        <td>${escapeHtml(appt.time)}</td>
        <td class="status status-${(appt.status || 'Pending').toLowerCase()}">${escapeHtml(appt.status || 'Pending')}</td>
        <td>
          <button class="status-btn approve" data-id="${appt._id}">Approve</button>
          <button class="status-btn reject" data-id="${appt._id}">Reject</button>
          <button class="status-btn edit" data-id="${appt._id}">Edit</button>
          <button class="status-btn delete" data-id="${appt._id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    attachAppointmentHandlers();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="8">Error: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function attachAppointmentHandlers() {
  document.querySelectorAll('.status-btn.approve').forEach((b) =>
    b.addEventListener('click', () => updateApptStatus(b.dataset.id, 'Approved'))
  );
  document.querySelectorAll('.status-btn.reject').forEach((b) =>
    b.addEventListener('click', () => updateApptStatus(b.dataset.id, 'Rejected'))
  );
  document.querySelectorAll('.status-btn.delete').forEach((b) =>
    b.addEventListener('click', () => deleteAppt(b.dataset.id))
  );
  document.querySelectorAll('.status-btn.edit').forEach((b) =>
    b.addEventListener('click', () => editAppt(b.dataset.id, b.closest('tr')))
  );
}

async function updateApptStatus(id, status) {
  try {
    await api(`/api/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    loadAppointments();
    loadStats();
  } catch (err) {
    alert(err.message);
  }
}

async function deleteAppt(id) {
  if (!confirm('Delete this appointment?')) return;
  try {
    await api(`/api/appointments/${id}`, { method: 'DELETE' });
    loadAppointments();
    loadStats();
  } catch (err) {
    alert(err.message);
  }
}

async function editAppt(id, row) {
  const name = prompt('Name:', row.children[1].textContent);
  if (name === null) return;
  const email = prompt('Email:', row.children[2].textContent);
  if (email === null) return;
  const phone = prompt('Phone:', row.children[3].textContent);
  if (phone === null) return;
  const date = prompt('Date (YYYY-MM-DD):', row.children[4].textContent);
  if (date === null) return;
  const time = prompt('Time:', row.children[5].textContent);
  if (time === null) return;

  try {
    await api(`/api/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, email, phone, date, time }),
    });
    loadAppointments();
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Users ----------
async function loadUsers() {
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '<tr><td colspan="6">Loading…</td></tr>';
  try {
    const users = await api('/api/users');
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6">No users yet.</td></tr>';
      return;
    }
    tbody.innerHTML = '';
    users.forEach((u, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${escapeHtml(u.name || '')}</td>
        <td>${escapeHtml(u.email || '')}</td>
        <td>${escapeHtml(u.role || 'user')}</td>
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}</td>
        <td><button class="status-btn delete" data-id="${u._id}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });
    document.querySelectorAll('#users-table-body .delete').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('Delete this user?')) return;
        try {
          await api(`/api/users/${b.dataset.id}`, { method: 'DELETE' });
          loadUsers();
          loadStats();
        } catch (err) {
          alert(err.message);
        }
      })
    );
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6">Error: ${escapeHtml(err.message)}</td></tr>`;
  }
}

// ---------- Utils ----------
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

document.addEventListener('DOMContentLoaded', () => {
  showSection('home-section', 'nav-home');
  loadStats();
});
