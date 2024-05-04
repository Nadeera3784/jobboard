export function cacheJwtToken(token: string){
    localStorage.setItem('auth-app-key', token);
};

export function getJWTToken() {
    return localStorage.getItem("auth-app-key");
};

export function deleteJWTToken() {
    localStorage.removeItem("auth-app-key")
};