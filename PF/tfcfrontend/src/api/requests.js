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

/**
 * 
 * @param {class details} _class 
 * @param {whether the enroll options should be shown} enrollEnabled 
 * @returns 
 */
function createEventData(_class, enrollEnabled) {
    const year = _class.date.split("-")[0];
    const month = _class.date.split("-")[1];
    const day = _class.date.split("-")[2];

    return {
        title: _class.class_name,
        start: new Date(parseInt(year), parseInt(month) - 1, parseInt(day), _class.start_time.split(":")[0], _class.start_time.split(":")[1], _class.start_time.split(":")[2]),
        end: new Date(parseInt(year), parseInt(month) - 1, parseInt(day), _class.end_time.split(":")[0], _class.end_time.split(":")[1], _class.end_time.split(":")[2]),
        description: _class.description,
        location: _class.studio_name,
        coach: _class.coach,
        enrollEnabled: enrollEnabled
    }
}

function getUserClassSchedule(setSchedule, weeks, startDate, token) {
    axios.get(server_url + "api/studios/classes/schedule/", {
        headers: {
            Authorization: 'Token ' + token
        },
        params: {
            weeks: weeks,
            start_date: startDate
        }
    }).then((res) => {
        const events = res.data.map(_class => createEventData(_class, false));
        setSchedule(events);
    }).catch((error) => {
        console.log(error)
    });
}

export function getUserClasses(
    setHistory, setSchedule, weeks, startHistory, startSchedule, getHistory, getSchedule, token
) {
    if (getHistory) {
        axios.get(server_url + "api/studios/classes/history/", {
            headers: {
                Authorization: 'Token ' + token
            },
            params: {
                weeks: weeks,
                start_date: startHistory
            }
        }).then((res) => {
            const events = res.data.map(_class => createEventData(_class, false));
            setHistory(events);

            if (getSchedule) {
                getUserClassSchedule(setSchedule, weeks, startSchedule, token);
            }
        }).catch((error) => {
            console.log(error)
        });
    } else {
        getUserClassSchedule(setSchedule, weeks, startSchedule, token);
    }
}