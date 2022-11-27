import axios from "axios";

let register = async(email, fname, lname, phone, password) => {
    axios.post(`${server_url}/api/accounts/login/`, {
        email: email,
        password: password
    }).then((res) => {
        // Set the auth token if we successfully log in
        if (res.status === 200) {
            setToken(res.data.token)
            localStorage.setItem("token", res.data.token)
            navigate("/")
        }
    }).catch(() => {
        // TODO, just alert for now to test it works
        alert("Your email or password was incorrect.")
    })
}