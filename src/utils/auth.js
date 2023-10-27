const _VersionAPP = 'V_0.3'

export function getToken() {
    return window.$cookies.get(_VersionAPP)
}

export function setToken(token) {
    return window.$cookies.set(_VersionAPP, token)
}

export function removeToken() {
    return window.$cookies.keys().forEach((cookie) => window.$cookies.remove(cookie))
}
export const VersionAPP = _VersionAPP
