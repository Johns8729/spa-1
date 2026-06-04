const errorHandler = {
  //Log es usado para no repetir los errores, es decir no usar console.error, solo log y dentro se llama 'error'
  log(error, context) {
    console.error(`[Error in ${context}]:`, error.message || error);
  },
  renderUI(containerId, msg) {
    const content = document.getElementById(containerId);

    if (content) {
      content.innerHTML = `
        <div class="error-container">
          <h3>¡Ups! Somthing is wrong</h3>
          <p>${msg}</p>
          <button onclick="window.location.reload()">Try</button>
        </div>
      `;
    }
  },

  showLoading(containerId) {
    const content = document.getElementById(containerId);
    if (content) {
      content.innerHTML = `
      <div class="loader-container">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>
    `;
    }
  },
};

export default errorHandler;
