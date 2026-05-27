const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const payload = await response.json();
      message = payload.message || payload.error || message;
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }
  return response.json();
}

export function requestOtp(phone) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
}

export function verifyOtp(phone, otp) {
  return request('/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
}

export function saveProfile(userId, payload) {
  return request(`/profile/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function saveIntake(userId, payload) {
  return request(`/intake/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function uploadTransactions(userId, file) {
  const form = new FormData();
  form.append('user_id', String(userId));
  form.append('file', file);
  return request('/upload', {
    method: 'POST',
    body: form,
  });
}

export function analyzeUser(userId, options = {}) {
  const search = new URLSearchParams(options).toString();
  return request(`/analyze/${userId}${search ? `?${search}` : ''}`, { method: 'POST' });
}

export function fetchDashboard(userId) {
  return request(`/dashboard/${userId}`);
}

export function fetchRecommendations(userId) {
  return request(`/recommendations/${userId}`);
}

export function fetchExplanations(userId) {
  return request(`/explanations/${userId}`);
}
