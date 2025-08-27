export function clearAuthStorage() {
    try {
        localStorage.removeItem("auth");
        localStorage.removeItem("accessToken");
    } catch {}
}

export function gotoLoginHard() {
    window.location.replace("/login");
}
