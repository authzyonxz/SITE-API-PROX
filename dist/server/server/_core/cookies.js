const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
    // Basic IPv4 check and IPv6 presence detection.
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host))
        return true;
    return host.includes(":");
}
function isSecureRequest(req) {
    if (req.protocol === "https")
        return true;
    const forwardedProto = req.headers["x-forwarded-proto"];
    if (!forwardedProto)
        return false;
    const protoList = Array.isArray(forwardedProto)
        ? forwardedProto
        : forwardedProto.split(",");
    return protoList.some(proto => proto.trim().toLowerCase() === "https");
}
export function getSessionCookieOptions(req) {
    const hostname = req.get("host") || "";
    const isLocal = hostname.includes("localhost") || hostname.includes("127.0.0.1");
    // No Chrome Android, se o site for HTTPS, o cookie PRECISA ser secure: true e SameSite: 'Lax' ou 'None'.
    // Para domínios do Railway, 'Lax' costuma funcionar melhor sem precisar de configurações extras de domínio.
    return {
        httpOnly: true,
        path: "/",
        sameSite: isLocal ? "lax" : "lax",
        secure: !isLocal, // Secure apenas em produção (HTTPS)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    };
}
