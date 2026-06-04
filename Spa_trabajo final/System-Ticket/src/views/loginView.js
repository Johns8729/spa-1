export function renderLogin(login) {
  appContainer.innerHTML = `<div class="login">
            <h2>Log In User</h2>
            <p>Name :${login.name}</p>
            <p>Password: ${login.password}</p>
        </div>`;
}
