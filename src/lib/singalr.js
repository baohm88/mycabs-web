import * as signalR from "@microsoft/signalr";

const BASE =
    import.meta.env.VITE_SIGNALR_BASE || import.meta.env.VITE_API_BASE || "";

let notifConn = null;
let adminConn = null;

export function notificationsHub() {
    return notifConn;
}
export function adminHub() {
    return adminConn;
}

export async function startNotificationsHub(handlers = {}) {
    if (notifConn) return notifConn;
    const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE}/hubs/notifications`, {
            accessTokenFactory: () => localStorage.getItem("accessToken") || "",
        })
        .withAutomaticReconnect()
        .build();

    // default events
    if (handlers.onUnread) {
        conn.on("unread_count", handlers.onUnread);
    }
    if (handlers.onNotification) {
        conn.on("notification", handlers.onNotification);
    }
    if (handlers.onChat) {
        conn.on("chat.message", handlers.onChat);
    }

    await conn.start();
    notifConn = conn;
    return conn;
}

export async function startAdminHub(handlers = {}) {
    if (adminConn) return adminConn;
    const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE}/hubs/admin`, {
            accessTokenFactory: () => localStorage.getItem("accessToken") || "",
        })
        .withAutomaticReconnect()
        .build();

    if (handlers.onTxNew) {
        conn.on("admin:tx:new", handlers.onTxNew);
    }

    await conn.start();
    adminConn = conn;
    return conn;
}

export async function stopAllHubs() {
    if (notifConn) {
        try {
            await notifConn.stop();
        } catch {}
        notifConn = null;
    }
    if (adminConn) {
        try {
            await adminConn.stop();
        } catch {}
        adminConn = null;
    }
}
