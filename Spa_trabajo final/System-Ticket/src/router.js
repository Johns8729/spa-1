/**
 * SPA Router
 */
import errorHandler from './utils/errorHandler.js';

/**
 * Main router
 */
export async function router() {
  try {
    // Clears previous content and displays the spinner while the route is being processed.
    errorHandler.showLoading('content');

    // Gets the current URL path
    const path = window.location.pathname;

    // Looks for the corresponding render function
    const render = router[path];
    if (render) {
      await render();
      setActiveLink();
    } else {
      document.getElementById('content').innerHTML = `
            <section>
                <h2>404 - Page not Found</h2>
            </section>
        `;
    }
  } catch (error) {
    errorHandler.log(error, 'Router SPA');
    errorHandler.renderUI(
      'content',
      'There was a problem connecting to the tickets. Please try again.',
    );
  }
}
