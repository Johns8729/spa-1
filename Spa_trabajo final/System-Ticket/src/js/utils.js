export function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Sesión expirada');
        location.reload();
        return null;
    }
    return user;
}

export function hasRole(requiredRoles) {
    const user = checkAuth();
    return user && requiredRoles.includes(user.role);
}