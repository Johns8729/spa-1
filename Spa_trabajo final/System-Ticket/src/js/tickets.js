import { appContainer } from '../main.js';
import { checkAuth } from './utils.js';
import { renderDashboard } from './dashboard.js';

const DATA_API = 'http://localhost:3002';

export async function loadTickets() {
  const user = checkAuth();
  const container = document.getElementById('tickets-container');

  try {
    const res = await axios.get(`${DATA_API}/tickets`);
    let tickets = res.data;

    // Filtrado según rol
    if (user.role === 'client') {
      tickets = tickets.filter(t => t.clientId === user.id);
    } else if (user.role === 'tech') {
      tickets = tickets.filter(t => t.technicianId === user.id);
    }
    // Admin ve todos

    if (tickets.length === 0) {
      container.innerHTML = `<p class="text-gray-500 text-center py-10">No hay tickets aún.</p>`;
      return;
    }

    container.innerHTML = tickets.map(ticket => `
      <div class="ticket-card bg-white p-6 rounded-2xl shadow border border-gray-100">
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-lg">${ticket.title}</h3>
          <span class="status-${ticket.status} text-xs font-medium px-3 py-1 rounded-full">
            ${getStatusText(ticket.status)}
          </span>
        </div>
        <p class="text-gray-600 mt-3 line-clamp-3">${ticket.description}</p>
        
        <div class="mt-4 text-sm text-gray-500">
          <p><strong>Cliente:</strong> ${ticket.clientName}</p>
          ${ticket.technicianName ? `<p><strong>Técnico:</strong> ${ticket.technicianName}</p>` : ''}
        </div>

        <div class="mt-5 flex gap-2">
          ${user.role !== 'client' ? `<button onclick="editTicket(${ticket.id})" class="text-blue-600 hover:text-blue-700 text-sm font-medium">Editar</button>` : ''}
          ${user.role === 'admin' ? `<button onclick="deleteTicket(${ticket.id})" class="text-red-600 hover:text-red-700 text-sm font-medium">Eliminar</button>` : ''}
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = '<p class="text-red-500">Error al cargar tickets</p>';
  }
}

function getStatusText(status) {
  const texts = {
    pending: 'Pendiente',
    inprocess: 'En Proceso',
    assigned: 'Asignado',
    solved: 'Solucionado'
  };
  return texts[status] || status;
}

// ==================== CREAR TICKET ====================
export function renderCreateTicketForm() {
  const user = checkAuth();

  let technicianOptions = '';
  if (user.role === 'admin') {
    technicianOptions = `
      <label class="block text-sm font-medium mb-2">Asignar Técnico</label>
      <select id="technicianId" class="w-full p-4 border rounded-2xl">
        <option value="">Sin asignar</option>
        <!-- Se llenará con JS -->
      </select>`;
  }

  appContainer.innerHTML = `
    <div class="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl">
      <h2 class="text-2xl font-bold mb-6">Nuevo Ticket</h2>
      <form id="create-form" class="space-y-6">
        <input type="text" id="title" placeholder="Título del ticket" required class="w-full p-4 border rounded-2xl">
        
        <select id="type" class="w-full p-4 border rounded-2xl">
          <option value="incidente">Incidente</option>
          <option value="requerimiento">Requerimiento</option>
          <option value="soporte">Soporte</option>
        </select>

        <textarea id="description" rows="5" placeholder="Descripción detallada..." required class="w-full p-4 border rounded-2xl"></textarea>
        
        ${technicianOptions}

        <div class="flex gap-4">
          <button type="submit" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-semibold">Crear Ticket</button>
          <button type="button" onclick="renderDashboard()" class="flex-1 bg-gray-200 py-4 rounded-2xl font-semibold">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  // Cargar técnicos si es admin
  if (user.role === 'admin') {
    loadTechniciansForSelect();
  }

  document.getElementById('create-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const type = document.getElementById('type').value;
    const technicianId = user.role === 'admin' ? document.getElementById('technicianId').value : null;

    const newTicket = {
      title,
      type,
      description,
      clientId: user.id,
      clientName: user.name,
      status: technicianId ? 'assigned' : 'pending',
      technicianId: technicianId || (user.role === 'tech' ? user.id : null),
      technicianName: technicianId ? document.getElementById('technicianId').selectedOptions[0].text : (user.role === 'tech' ? user.name : null),
      createdAt: new Date().toISOString()
    };

    await axios.post(`${DATA_API}/tickets`, newTicket);
    alert('Ticket creado correctamente');
    renderDashboard();
  });
}

async function loadTechniciansForSelect() {
  const res = await axios.get(`${DATA_API}/technicians`);
  const select = document.getElementById('technicianId');
  res.data.forEach(tech => {
    const option = document.createElement('option');
    option.value = tech.id;
    option.textContent = tech.name;
    select.appendChild(option);
  });
}

// ==================== EDITAR TICKET ====================
window.editTicket = async function(id) {
  const user = checkAuth();
  const res = await axios.get(`${DATA_API}/tickets/${id}`);
  const ticket = res.data;

  let html = `
    <div class="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl">
      <h2 class="text-2xl font-bold mb-6">Editar Ticket</h2>
      <form id="edit-form" class="space-y-6">
        <input type="text" id="title" value="${ticket.title}" class="w-full p-4 border rounded-2xl">
        <textarea id="description" rows="5" class="w-full p-4 border rounded-2xl">${ticket.description}</textarea>
        
        <div>
          <label>Estado</label>
          <select id="status" class="w-full p-4 border rounded-2xl">
            <option value="pending" ${ticket.status === 'pending' ? 'selected' : ''}>Pendiente</option>
            <option value="inprocess" ${ticket.status === 'inprocess' ? 'selected' : ''}>En Proceso</option>
            <option value="assigned" ${ticket.status === 'assigned' ? 'selected' : ''}>Asignado</option>
            <option value="solved" ${ticket.status === 'solved' ? 'selected' : ''}>Solucionado</option>
          </select>
        </div>`;

  if (user.role === 'admin') {
    html += `<div><label>Asignar Técnico</label><select id="technicianId" class="w-full p-4 border rounded-2xl"></select></div>`;
  }

  html += `
        <div class="flex gap-4">
          <button type="submit" class="flex-1 bg-blue-600 text-white py-4 rounded-2xl">Guardar Cambios</button>
          <button type="button" onclick="renderDashboard()" class="flex-1 bg-gray-200 py-4 rounded-2xl">Cancelar</button>
        </div>
      </form>
    </div>`;

  appContainer.innerHTML = html;

  if (user.role === 'admin') {
    const techRes = await axios.get(`${DATA_API}/technicians`);
    const select = document.getElementById('technicianId');
    techRes.data.forEach(tech => {
      const opt = document.createElement('option');
      opt.value = tech.id;
      opt.textContent = tech.name;
      if (tech.id == ticket.technicianId) opt.selected = true;
      select.appendChild(opt);
    });
  }

  document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const updated = {
      title: document.getElementById('title').value,
      description: document.getElementById('description').value,
      status: document.getElementById('status').value
    };

    if (user.role === 'admin') {
      const techId = document.getElementById('technicianId').value;
      updated.technicianId = techId || null;
      updated.technicianName = techId ? document.getElementById('technicianId').selectedOptions[0].text : null;
    }

    await axios.patch(`${DATA_API}/tickets/${id}`, updated);
    alert('Ticket actualizado');
    renderDashboard();
  });
};

// ==================== ELIMINAR TICKET ====================
window.deleteTicket = async function(id) {
  if (!confirm('¿Eliminar este ticket?')) return;
  await axios.delete(`${DATA_API}/tickets/${id}`);
  alert('Ticket eliminado');
  renderDashboard();
};