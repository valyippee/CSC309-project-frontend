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
        if (res.data.length > 0) {
            setCard(res.data[0])
        }
    });
}

export function putCard(setSuccess, setError, number, exp_month, exp_year, cvc, token) {
    axios.put(server_url + "api/accounts/cardinfo/", {
        number: number,
        exp_month: exp_month,
        exp_year: exp_year,
        cvc: cvc,
    },
    {
        headers: {
            Authorization: 'Token ' + token,
        }
    }).then((res) => {
        if (res.status === 204) {
            setSuccess(true)
            setError(false)
        } 
    }).catch((err) => {
        setError(true)
        setSuccess(false)
    })
}

export function getSubscriptions(setSubscriptions) {
    axios.get(server_url + "api/subscriptions/")
    .then((res) => {
        setSubscriptions(res.data.results)
    });
}

export function getFuturePayments(setPayments, token) {
    axios.get(server_url + "api/accounts/paymenthistory/", {
        headers: {
            Authorization: 'Token ' + token
        },
    }).then((res) => {
        if (res.status == 200) {
            setPayments(res.data.data.future)
        }
    });
}

export function getPaymentHistory(setPayments, token) {
    axios.get(server_url + "api/accounts/paymenthistory/", {
        headers: {
            Authorization: 'Token ' + token
        },
    }).then((res) => {
        if (res.status == 200) {
            setPayments(res.data.data.history)
        }
    });
}

function getDateInfo(_class) {
    const year = _class.date.split("-")[0];
    const month = _class.date.split("-")[1];
    const day = _class.date.split("-")[2];
    return {
        start: new Date(parseInt(year), parseInt(month) - 1, parseInt(day), _class.start_time.split(":")[0], _class.start_time.split(":")[1], _class.start_time.split(":")[2]),
        end: new Date(parseInt(year), parseInt(month) - 1, parseInt(day), _class.end_time.split(":")[0], _class.end_time.split(":")[1], _class.end_time.split(":")[2])
    }
}

function getGeneralClassInfo(_class) {
    return {
        title: _class.class_name,
        description: _class.description,
        coach: _class.coach,
        classId: _class.studio_class ? _class.studio_class : _class.id,
    }
}

/**
 * 
 * @param {class details} _class 
 * @param {whether the enroll options should be shown} enrollEnabled 
 * @returns an event object to be displayed on the calendar
 */
 function createEventData(_class, enrollEnabled) {
    const dateInfo = getDateInfo(_class);
    const generalInfo = getGeneralClassInfo(_class);
    const otherInfo = {
        location: _class.studio_name,
        enrollEnabled: enrollEnabled,
        classCancelled: _class.status == 2
    }
    return {...dateInfo, ...generalInfo, ...otherInfo}
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
        console.log(res)
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

export function dropUserClass(classId, token) {
    axios({
        method: 'patch',
        url: server_url + `api/studios/classes/${classId}/drop/`,
        headers: {
            Authorization: 'Token ' + token
        }
    }).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    });
}

export function dropUserClassInstance(classId, date, token) {
    axios({
        method: 'post',
        url: server_url + `api/studios/classes/${classId}/drop/`,
        headers: {
            Authorization: 'Token ' + token
        },
        params: {
            date: date
        }
    }).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
    });
}

// STUDIOS
export function getStudioInfo(setStudioInfo, studioId) {
    axios.get(server_url + "api/studios/" + studioId)
    .then((res) => {
        setStudioInfo(res.data)
    })
}

export function getListOfStudios(setStudios, params) {
    const locationPathString = params.location.lng + "," + params.location.lat + "/"

    axios.get(server_url + "api/studios/list/" + locationPathString )
    .then((res) => {
        setStudios(res.data.results)
    })
}

/**
 * 
 * @param {class details} _class 
 * @param {whether the enroll options should be shown} enrollEnabled 
 * @returns an event object to be displayed on the calendar
 */
 function createStudioClassData(_class, enrollEnabled) {
    const dateInfo = getDateInfo(_class);
    const generalInfo = getGeneralClassInfo(_class.studio_class);
    const otherInfo =  {
        enrolled: false,  // defaults to false for now - need to add a check
        enrollEnabled: enrollEnabled,
        capacity: _class.studio_class.capacity,
        keywords: _class.studio_class.keywords.map((word) => word.keyword)
    }
    return {...dateInfo, ...generalInfo, ...otherInfo}
}

export function getStudioClassSchedule(setClassData, studioId, params) {
    axios.get(
        server_url + `api/studios/${studioId}/classes/`,
        { params: params }
    ).then((res) => {
        const events = res.data.map(_class => createStudioClassData(_class, true));
        setClassData(events);
    }).catch((error) => {
        console.log(error)
    });
}

export function enrollUserClass(setSuccessModal, setErrorModal, setErrorMessage, setErrorButtonText, setErrorAction, navigateToSub, classId, date, token) {
    axios({
        method: 'post',
        url: server_url + `api/studios/classes/${classId}/enrol/`,
        headers: {
            Authorization: 'Token ' + token
        },
        params: {
            date: date
        }
    }).then((res) => {
        setSuccessModal(true);
    }).catch((error) => {
        setErrorModal(true);
        if (error.response.data.error_code == 2) {
            setErrorMessage("Class is already full.");
        } else if (error.response.data.error_code == 3) {
            setErrorMessage("You do not have an active subscription.");
            setErrorButtonText("Subscribe now");
            setErrorAction(() => navigateToSub);
        } else if (error.response.data.error_code == 1) {
            setErrorMessage("You are already enrolled in this class.");
        }
    });
}
