import axios from 'axios';

const server_url = "http://127.0.0.1:8000/";

export function getProfile(setProfile, token) {
    axios.get(server_url + "api/accounts/profile", {
        headers: {
            Authorization: 'Token ' + token
        }
    }).then((res) => {
        console.log(res.data)
        setProfile(res.data)
    });
}