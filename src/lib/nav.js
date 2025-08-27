let _navigate;

export function setNavigator(n) {
    _navigate = n;
}
export function goLogin() {
    if (_navigate) _navigate("/login", { replace: true });
    else window.location.replace("/login");
}
