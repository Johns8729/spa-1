export let currentUser = null;
export const appContainer = document.getElementById('app');

import { renderLogin } from './js/auth.js';

let inactivityTimer;

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    alert("Sesión cerrada por inactividad (5 minutos)");
    localStorage.removeItem('currentUser');
    location.reload();
  }, 5 * 60 * 1000); // 5 minutos
}

export function initApp() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    import('./js/dashboard.js').then(({ renderDashboard }) => {
      renderDashboard();
      document.addEventListener('mousemove', resetInactivityTimer);
      document.addEventListener('keypress', resetInactivityTimer);
      resetInactivityTimer();
    });
  } else {
    renderLogin();
  }
}

initApp();