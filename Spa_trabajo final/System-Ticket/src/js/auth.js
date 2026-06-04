import { appContainer } from '../main.js';
import { renderDashboard } from './dashboard.js';

const AUTH_API = 'http://localhost:3001/users';

export function renderLogin() {
  appContainer.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 class="text-3xl font-bold text-center mb-2">Sistema de Tickets</h1>
        <p class="text-center text-gray-600 mb-8">Inicia sesión</p>
        
        <form id="login-form" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Usuario</label>
            <input type="text" id="username" required class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Contraseña</label>
            <input type="password" id="password" required class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-blue-500">
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await axios.get(AUTH_API);
      const user = res.data.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        renderDashboard();
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor de autenticación');
    }
  });
}

export function logout() {
  localStorage.removeItem('currentUser');
  location.reload();
}