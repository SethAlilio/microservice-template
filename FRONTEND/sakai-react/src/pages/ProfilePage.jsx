import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { useUserDetails } from "../../src/stores/userStore";
import BaseService from '../service/BaseService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ProfilePage = () => {

    const userInfo = useUserDetails();
    const [userDetails, userDetailsSet] = useState({});
    const [keeperMaterials, keeperMaterialsSet] = useState([]);

    useEffect(() =>{
        onLoading();
    }, []);

    const onLoading = () => {
        BaseService.HttpPost('/system/menu/profileLoading', { userid: userInfo.ACCOUNT_ID }).then((res) => {
            //
            userDetailsSet(res.data["account"]);
            keeperMaterialsSet(res.data["materials"]);
            //
        },
        (err) =>{
            const _content =
            (err.response && err.response.data) || err.message || err.toString();
            console.log(_content);
        });

        
    }
    
    
    return(
        <>

        <div className="bg-black-alpha-10 bg-repeat-x" style={{backgroundImage: `url( "https://img.freepik.com/free-vector/white-abstract-background_23-2148817571.jpg?w=850")`}}>

            <div className="grid">
                <div className="col-4 p-4">
                    <Card title={userDetails.FULL_NAME} subTitle={userDetails.ACCOUNT_NAME} header={
                        (<img alt="Card" src="https://fontawesome.com/social/user" />)
                    }>
                        <p className="m-0">
                            <div className="grid">
                                <div className="col-4 text-gray-500 font-bold">
                                    Gender
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.SEX === "1" ? 'Male' : 'Female'}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    Nationality
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.NATIONALITY === "2" ? 'Filipino' : 'Chinese'}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    Contact Number
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.MOBILE_PHONE_A}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    Email Address
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.EMAIL1}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    Home Address
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.HOME_ADDRESS}
                                </div>
                                
                            </div>
                        </p>
                    </Card>     
                </div>
                <div className="col-4 p-4">
                <Card title="User Group" subTitle="org" header={
                    (<img alt="Card" src="https://fontawesome.com/social/globe" />)
                }>
                        <p className="m-0">
                            <div className="grid">
                                <div className="col-4 text-gray-500 font-bold">
                                    Role
                                </div>
                                <div className="col-8 font-bold">
                                    {userInfo.ROLE_NAME}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    Organization
                                </div>
                                <div className="col-8 font-bold">
                                    {userInfo.ORG_NAME}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    User Type 
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.TYPE}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    Source Menu
                                </div>
                                <div className="col-8 font-bold">
                                     {userDetails.SOURCE_MENU}
                                </div>
                                <div className="col-4 text-gray-500 font-bold">
                                    FIBERHOMEID
                                </div>
                                <div className="col-8 font-bold">
                                    {userDetails.FIBERHOMEID}
                                </div>
                                
                            </div>
                        </p>
                    </Card>     
                </div>
                <div className="col-4 p-4">
                <Card title="Keeper Item List" header={
                    (<img alt="Card" src="https://fontawesome.com/social/square-poll-vertical" />)
                }>
                        <p className="m-0">
                            <div className="grid">
                                
                                <div className="col-12">
                                    
                                    <DataTable value={keeperMaterials} emptyMessage="No item found." >
                                        <Column field="name" header="name"></Column>
                                        <Column field="item_count" header="count"></Column>
                                    </DataTable>
                                            
                                </div>
                            </div>
                        </p>
                    </Card>  
                </div>

            </div>

        </div>
            
        </>
    );
}

/* eslint eqeqeq: 0 */
const comparisonFn = function (prevProps, nextProps) {

    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(ProfilePage, comparisonFn);