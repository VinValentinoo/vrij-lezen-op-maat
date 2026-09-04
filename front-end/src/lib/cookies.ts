// Waarom geen cookie store?
// Dit is omdat de cookie store een relatief nieuwe web api is die nog niet ondersteund word op Safari en Firefox alleen Chormium browsers

export function setToken(token: string) {
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
}

export function getToken() {
    const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith('token='))
        ?.split("=")[1];
    
    if(!cookieToken) {
        return null;
    }

    return cookieToken;
}

export function deleteToken() {
    document.cookie = `token=; path=/; max-age=0; SameSite=Strict`;
}