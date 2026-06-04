import { appContainer } from '../main.js';
import { checkAuth, hasRole } from './utils.js';
import { renderCreateTicketForm, loadTickets } from './tickets.js';
import { logout } from './auth.js';

const DATA_API = 'http://localhost:3002';

export async function renderDashboard() {
  const user = checkAuth();
  if (!user) return;

  appContainer.innerHTML = `
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-blue-600">Tickets Riwi</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm">Hola, <b>${user.name}</b> (${user.role})</span>
            <button onclick="logout()" class="text-red-600 hover:text-red-700 font-medium">Cerrar Sesión</button>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="flex justify-between mb-6">
          <h2 class="text-3xl font-semibold">Mis Tickets</h2>
          <button onclick="renderCreateTicketForm()" 
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold">
            + Nuevo Ticket
          </button>
        </div>

        <div id="tickets-container" class="grid gap-6"></div>
      </div>
    </div>
  `;

  loadTickets();
}

// Función global para que funcione el onclick
window.renderCreateTicketForm = renderCreateTicketForm;
window.logout = logout;