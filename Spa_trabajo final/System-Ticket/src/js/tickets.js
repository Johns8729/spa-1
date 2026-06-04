import { appContainer } from '../main.js';
import { checkAuth } from './utils.js';
import { renderDashboard } from './dashboard.js';

const API = 'http://localhost:3002';

export async function loadTickets() {
  const user = checkAuth();
  const container = document.getElementById('tickets-container');

  try {
    const res = await axios.get(`${API}/tickets`);
    let tickets = res.data;

    if (user.role === 'client')
      tickets = tickets.filter((t) => t.clientId === user.id);
    if (user.role === 'tech')
      tickets = tickets.filter((t) => t.technicianId === user.id);

    if (tickets.length === 0) {
      container.innerHTML = `<p class="text-center py-12 text-gray-500">No hay tickets</p>`;
      return;
    }

    container.innerHTML = tickets
      .map(
        (ticket) => `
      <div class="bg-white p-6 rounded-2xl shadow">
        <div class="flex justify-between">
          <h3 class="font-bold">${ticket.title}</h3>
          <span class="px-3 py-1 text-xs rounded-full ${
            ticket.status === 'solved'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }">
            ${ticket.status}
          </span>
        </div>
        <p class="text-gray-600 mt-2">${ticket.description}</p>
        <div class="mt-4 text-sm">
          <p>Cliente: ${ticket.clientName}</p>
          ${
            ticket.technicianName
              ? `<p>Técnico: ${ticket.technicianName}</p>`
              : ''
          }
        </div>
        <div class="mt-4 flex gap-4">
          <!-- CORREGIDO: Se envuelve el id entre comillas simples por si es un string -->
          <button onclick="window.editTicket('${
            ticket.id
          }')" class="text-blue-600 hover:underline">Editar</button>
          ${
            user.role === 'admin'
              ? `<button onclick="window.deleteTicket('${ticket.id}')" class="text-red-600 hover:underline">Eliminar</button>`
              : ''
          }
        </div>
      </div>
    `
      )
      .join('');
  } catch (e) {
    container.innerHTML = `<p class="text-red-500">Error cargando tickets</p>`;
  }
}

export function renderCreateTicketForm() {
  const user = checkAuth();
  appContainer.innerHTML = `
    <div class="max-w-xl mx-auto mt-12 bg-white p-8 rounded-3xl shadow">
      <h2 class="text-2xl font-bold mb-6">Crear Ticket</h2>
      <form id="createForm">
        <input id="title" placeholder="Título" required class="w-full p-4 border rounded-xl mb-4">
        <textarea id="description" rows="5" placeholder="Descripción" required class="w-full p-4 border rounded-xl mb-4"></textarea>
        <div class="flex gap-4">
          <button type="submit" class="flex-1 bg-blue-600 text-white py-4 rounded-xl">Crear</button>
          <button type="button" onclick="window.renderDashboard()" class="flex-1 bg-gray-300 py-4 rounded-xl">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  document.getElementById('createForm').onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const ticket = {
      title,
      description,
      clientId: user.id,
      clientName: user.name,
      status: 'pending',
      technicianId: user.role === 'tech' ? user.id : null,
      technicianName: user.role === 'tech' ? user.name : null,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${API}/tickets`, ticket);
      alert('Ticket creado');
      window.renderDashboard();
    } catch (error) {
      alert('Error al crear el ticket');
    }
  };
}

// ==================== FUNCIONES EDITAR Y ELIMINAR ====================

window.editTicket = async function (id) {
  try {
    const res = await axios.get(`${API}/tickets/${id}`);
    const ticket = res.data;

    appContainer.innerHTML = `
            <div class="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-3xl shadow">
                <h2 class="text-2xl font-bold mb-6">Editar Ticket</h2>
                <form id="editForm">
                    <input id="title" value="${ticket.title}" class="w-full p-4 border rounded-2xl mb-4">
                    <textarea id="description" rows="5" class="w-full p-4 border rounded-2xl mb-4">${ticket.description}</textarea>
                    <div class="flex gap-4">
                        <button type="submit" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl">Guardar</button>
                        <button type="button" onclick="window.renderDashboard()" class="flex-1 bg-gray-200 py-4 rounded-2xl">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

    document
      .getElementById('editForm')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const updated = {
          title: document.getElementById('title').value,
          description: document.getElementById('description').value,
        };
        try {
          await axios.patch(`${API}/tickets/${id}`, updated);
          alert('✅ Ticket actualizado');
          window.renderDashboard();
        } catch (error) {
          alert('Error al actualizar el ticket');
        }
      });
  } catch (error) {
    alert('Error al cargar el ticket para editar');
  }
};

window.deleteTicket = async function (id) {
  if (!confirm('¿Estás seguro de eliminar este ticket?')) return;

  try {
    await axios.delete(`${API}/tickets/${id}`);
    alert('✅ Ticket eliminado correctamente');
    window.renderDashboard();
  } catch (error) {
    alert('Error al eliminar el ticket');
  }
};

// Asegurar que las funciones estén disponibles globalmente
window.renderDashboard = renderDashboard;