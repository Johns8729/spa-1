const ticketsApi = 'http://localhost:3002/tickets';

export function renderAdmin(adminName) {
  const appContainer = document.getElementById('app');

  appContainer.innerHTML = `
    <div class="admin">
        <h2>Welcome ${adminName || 'Admin'}</h2>
        <p>Role: Admin</p>
        <hr>
        
        <h3>Create a New Ticket</h3>
        <form id="ticket-form">
          <div class="form-group">
            <label for="ticket-title">Title:</label>
            <input type="text" id="ticket-title" required placeholder="Please enter your ticket title">
          </div>

          <div class="form-group">
            <label for="ticket-description">Description:</label>
            <textarea id="ticket-description" required placeholder="Describe your issue..."></textarea>
          </div>
          <button type="submit">Create Ticket</button>
        </form>
    </div>`;

  const form = document.getElementById('ticket-form');

  // Capturamos los elementos del DOM una sola vez
  const titleInput = document.getElementById('ticket-title');
  const descriptionInput = document.getElementById('ticket-description');

  // Todo el proceso ocurre DENTRO del evento submit
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Frenamos el refresco de la página

    // Creamos el objeto capturando los valores de texto reales (.value)
    const newTicket = {
      id: String(Date.now()), // Corregido: punto en lugar de coma
      title: titleInput.value.trim(), // Corregido: .value para obtener el texto
      description: descriptionInput.value.trim(), // Corregido: .value para obtener el texto
      createBy: adminName || 'admin',
      status: 'open',
      createAt: new Date().toISOString(),
    };

    await saveTicket(newTicket);
    form.reset();
  });

  async function saveTicket(ticket) {
    try {
      const response = await axios.post(ticketsApi, ticket);
      if (response.status === 201 || response.status === 200) {
        console.log(
          'Ticket created successfully in JSON Server:',
          response.data,
        );
        alert(`Ticket "${ticket.title}" created successfully!`);
      }
    } catch (error) {
      console.error('Error saving new tickets to API ', error);
      alert('Could not save the ticket. Please Try Again!');
    }
  }
}
