import axios from "axios";

const instance = axios.create({
    xsrfHeaderName: "csrf-token",
    xsrfCookieName: "super-secret-csrf-token",
});

export default instance;
