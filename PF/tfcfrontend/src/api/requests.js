import axios from 'axios';

const server_url = "http://127.0.0.1:8000/";

export function getProfile(setProfile, token) {
    axios.get(server_url + "api/accounts/profile/", {
        headers: {
            Authorization: 'Token ' + token
        },
    }).then((res) => {
        setProfile(res.data)
    });
}

export function patchProfile(setProfile, email, first_name, last_name, avatar, phone_number, token) {
    axios.patch(server_url + "api/accounts/profile/", {
        email: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        avatar: avatar,
    },
    {
        headers: {
            Authorization: 'Token ' + token,
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        setProfile(res.data)
    })
}

export function getAvatar(setAvatar, token) {
    axios.get(server_url + "api/accounts/profile/", {
        headers: {
            Authorization: 'Token ' + token
        },
    }).then((res) => {
        if (res.data.avatar) {
            setAvatar(res.data.avatar)
        }
        else {
            setAvatar(require("../images/default.png"))
        }
    });
}

export function getCard(setCard, token) {
    axios.get(server_url + "api/accounts/cardinfo/", {
        headers: {
            Authorization: 'Token ' + token
        },
    }).then((res) => {
        if (res.data) {
            setCard(res.data[0])
        }
    });
}