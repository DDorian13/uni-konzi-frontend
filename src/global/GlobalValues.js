import decodeJWT from "jwt-decode";

class GlobalValues {
    static tokenStorageName = "uni-konzi-token";
    static serverURL = "http://localhost:8080/api";
    static adminRole = "ROLE_ADMIN";

    static hasAdminRole = (redirect) => {
        const jwtToken = localStorage.getItem(this.tokenStorageName);
        if (jwtToken != null) {
            const decodedToken = decodeJWT(jwtToken);
            if (decodedToken.roles.filter(role => role === GlobalValues.adminRole).length <= 0) {
                if (redirect) {
                    alert("Nincs jogosultságod ehhez a művelethez");
                    const url = new URL(window.location);
                    url.pathname = "/";
                    window.location = url.href;
                    return;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    }
}

export default GlobalValues;