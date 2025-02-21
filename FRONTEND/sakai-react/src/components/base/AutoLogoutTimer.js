import React from 'react'
import { useIdleTimer } from 'react-idle-timer'
import {useNavigate} from "react-router";

const SESSION_IDEL_MINUTES = 1;

const AutoLogoutTimer = (props : Any) => {

    const { ComposedClass } = props
    const navigation = useNavigate()

    const handleOnIdle = (event: any) => {
        // SHOW YOUR MODAL HERE AND LAGOUT
        alert('idle')
        console.log('user is idle', event)
        console.log('last active', getLastActiveTime())
        navigation("/login");
    }

    const {getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * SESSION_IDEL_MINUTES,
        onIdle: handleOnIdle,
        debounce: 500,
    })

    return <ComposedClass />
    
}

export default AutoLogoutTimer;