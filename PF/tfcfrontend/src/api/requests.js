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

export function patchProfile(setProfile, setSuccess, email, first_name, last_name, avatar, phone_number, token) {
    if (avatar) {
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
            if (res.status === 200) {
                setProfile(res.data)
                setSuccess(true)
            }
        })
    }
    else {
        axios.patch(server_url + "api/accounts/profile/", {
            email: email,
            first_name: first_name,
            last_name: last_name,
            phone_number: phone_number,
        },
        {
            headers: {
                Authorization: 'Token ' + token,
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.status === 200) {
                setProfile(res.data)
                setSuccess(true)
            }
        })
    }
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

export function getUserSubscription(setUserSubscription, token) {
    axios.get(server_url + "api/subscriptions/mysubscription/", {
        headers: {
            Authorization: 'Token ' + token
        },
    }).then((res) => {
        if (res.status == 200) {
            setUserSubscription(res.data)
        } else {
            setUserSubscription(false)
        }
    });
}

export function cancelUserSubscription(setCancelled, setUserSubscription, token) {
    axios({
        method: 'post',
        url: server_url + 'api/subscriptions/cancel/',
        headers: {
            Authorization: 'Token ' + token
        }
    }).then((res) => {
        setCancelled(true)
        setUserSubscription(false)
    });
}


export function getSubscriptions(setSubscriptions) {
    axios.get(server_url + "api/subscriptions/")
    .then((res) => {
        setSubscriptions(res.data.results)
    });
}


export function getFuturePayments(payments, setPayments, offset, token) {

    let curr = new Date()

    if (payments.length == 0) {
        curr = curr.toISOString()
        curr = curr.substring(0, curr.length-5);
    } else {
        curr = payments[payments.length-1]['datetime']
    }

    axios.get(server_url + "api/accounts/paymenthistory/", {
        headers: {
            Authorization: 'Token ' + token
        },
        params: {
            start_datetime: curr
        }
    }).then((res) => {
        if (res.status == 200) {
            setPayments([...payments, ...res.data.data.future])
        }
    });
}

export function subscribe(subscriptionPlan, token, setSuccessInfo, setErrorInfo) {
    axios.post(server_url + "api/subscriptions/" + subscriptionPlan.id + "/subscribe/", {}, {
        headers: {
            Authorization: 'Token ' + token,
        }
    })
    .then(res => {
        setSuccessInfo({"success_code": 0, "subscription": subscriptionPlan}) // Successfully Subscribed
    })
    .catch(err => {
        if (err.response.status === 401) {
            setErrorInfo({"error_code": 0})
        }
    })
}

export function changeSubscription(subscriptionPlan, token, setSuccessInfo, setErrorInfo) {
    axios.put(server_url + "api/subscriptions/" + subscriptionPlan.id + "/subscribe/", {}, {
        headers: {
            Authorization: 'Token ' + token,
        }
    })
    .then(res => {
        setSuccessInfo({"success_code": 1, "subscription": subscriptionPlan}) // Successfully Changed Subscription Plan
    })
    .catch(err => {
        if (err.response.status === 401) {
            setErrorInfo({"error_code": 0})
        }
    })
}

export function cancelSubscription(token, setSuccessInfo, setErrorInfo) {
    axios.post(server_url + "api/subscriptions/cancel/", {}, {
        headers: {
            Authorization: 'Token ' + token,
        }
    })
    .then(res => {
        setSuccessInfo({"success_code": 2}) // Successfully Canceled Subscription Plan
    })
    .catch(err => {
        if (err.response.status === 401) {
            setErrorInfo({"error_code": 0})
        }
    })
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
        classCancelled: _class.status == 2,
        isRecurring: _class.is_recurring
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

export function dropUserClass(setDropErrorStatusCode, isInstance, classId, date, token) {
    axios({
        method: isInstance ? 'post' : 'patch',
        url: server_url + `api/studios/classes/${classId}/drop/`,
        headers: {
            Authorization: 'Token ' + token
        },
        data: {
            date: date
        }
    }).then((res) => {
        console.log(res);
    }).catch((error) => {
        console.log(error);
        setDropErrorStatusCode(-1);
    });
}

// STUDIOS
export function getStudioInfo(setStudioInfo, studioId) {
    axios.get(server_url + "api/studios/" + studioId)
    .then((res) => {
        setStudioInfo(res.data)
    })
}

export function getListOfStudios(setStudios, location, params, setStudiosPaginationNextUrl) {
    const locationPathString = location.lng + "," + location.lat + "/"
    
    axios.get(server_url + "api/studios/list/" + locationPathString, {params: params})
    .then((res) => {
        setStudiosPaginationNextUrl(res.data.next)
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

export function getStudioClassSchedule(setClassData, studioId, params, userScheduleStartDate, token) {
    axios.get(
        server_url + `api/studios/${studioId}/classes/`,
        { params: params }
    ).then((res) => {
        const events = res.data.map(_class => createStudioClassData(_class, true));
        if (token == null) {
            setClassData(events);
        } else {
            axios.get(server_url + "api/studios/classes/schedule/", {
                headers: {
                    Authorization: 'Token ' + token
                },
                params: {
                    weeks: params.weeks,
                    start_date: userScheduleStartDate
                }
            }).then((res) => {
                const userSchedule = res.data.map(_class => ({...getDateInfo(_class), ...{classId: _class.studio_class}}));
                // check if user is enrolled in each class
                events.forEach(_class => {
                    for (var i = 0; i < userSchedule.length; i++) {
                        if (_class.classId == userSchedule[i].classId 
                                && _class.start.valueOf() === userSchedule[i].start.valueOf()) {
                            _class.enrolled = true;
                            break;
                        }
                    }
                });
                setClassData(events);
            }).catch((error) => {
                console.log(error)
            });
        }
    }).catch((error) => {
        console.log(error)
    });
}

export function enrollUserClass(setEnrollErrorStatusCode, classId, date, token) {
    console.log(date);
    axios({
        method: 'post',
        url: server_url + `api/studios/classes/${classId}/enrol/`,
        headers: {
            Authorization: 'Token ' + token
        },
        data: {
            date: date
        }
    }).then((res) => {
        console.log(res);
    }).catch((error) => {
        if (error.response.data.error_code) {
            setEnrollErrorStatusCode(error.response.data.error_code);
        } else {
            setEnrollErrorStatusCode(-1);
        }
        
    });
}

export function getAllCoachAndClass(setAllClassNames, setAllCoachNames, studioId) {
    axios.get(
        server_url + `api/studios/${studioId}/coach-and-class/`
    ).then((res) => {
        setAllClassNames(res.data.class_names);
        setAllCoachNames(res.data.coach_names);
    }).catch((error) => {
        console.log(error)
    });
}

export function getListOfStudiosByPaginationUrl(studios, setStudios, studiosPaginationNextUrl, setStudiosPaginationNextUrl) {
    if (studiosPaginationNextUrl === null) {
        return
    }

    axios.get(studiosPaginationNextUrl)
    .then((res) => {
        setStudiosPaginationNextUrl(res.data.next)
        setStudios([...studios, ...res.data.results])
    })
}

export function getFilterTagsForStudios(setTags) {
    axios.get(server_url + "api/studios/tags/")
    .then((res) => {
        res.data.studio_names = ["", ...res.data.studio_names]
        res.data.amenities = ["", ...res.data.amenities]
        res.data.class_names = ["", ...res.data.class_names]
        res.data.coaches = ["", ...res.data.coaches]
        setTags(res.data)
    })
}