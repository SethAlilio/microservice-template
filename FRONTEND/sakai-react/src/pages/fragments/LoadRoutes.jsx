import { Route, Routes } from 'react-router-dom';
import React from "react";
import Accounts from '../../pages/AccessManagement/Accounts';
import Organizations from '../../pages/AccessManagement/Organizations';
import Roles from '../../pages/AccessManagement/Roles';

//import FaTracker from "../Inventory/SummaryReport/FaTracker";



import { useUserOrganizationId } from '../../stores/AuthStore';


import AttributedListList from "../DataDictionary/AttributedList";
import BlankPage from "../../pages/BlankPage";
import ProfilePage from "../../pages/ProfilePage";




const LoadRoutes = (props) =>{
const taskList = null; //useTaskState();
const userOrganizationId = useUserOrganizationId();
const teLedgerPath = '/te-ledger';//(userOrganizationId === 332) ? '/ipg-te-ledger' : '/te-ledger'
const ipgfaLedgerPath = '/ipgfa-ledger';//(userOrganizationId === 332) ? '/ipg-te-ledger' : '/te-ledger'

const LandingPageTemplate = () =>{

    if(props.landingPage == 'dashboard'){
        return(
            <>
                {/* <Route path="/" element={<FaTracker colorMode={props.colorMode} location={props.location} />} /> */}
            </>
        );
    } else {
        return(
            <>
                <Route path="/" element={<BlankPage/>} />
            </>
        );
    }
}



    return (
        <Routes>
            {LandingPageTemplate()}
            {/*Profile Page*/}
            <Route path="/profile" element={<ProfilePage  colorMode={props.colorMode} location={props.location} />}/>

            {/*Access Management*/}
            <Route path="/accounts" element={<Accounts  colorMode={props.colorMode} location={props.location} />}/>
            <Route path="/organization" element={<Organizations  colorMode={props.colorMode} location={props.location} />}/>
            <Route path="/roles" element={<Roles  colorMode={props.colorMode} location={props.location} />}/>

            {/*Data Dictionary*/}
            <Route path={'/te-attributed-list'} element={<AttributedListList location={props.location}  />}/>
        </Routes>

    )
}

export default LoadRoutes;
