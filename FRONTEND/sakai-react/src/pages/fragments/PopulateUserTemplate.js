const UserTemplate = (origData, NewData) => {

    //
    let newTemplate = {
        ACCOUNT_ID: NewData.hasOwnProperty('ACCOUNT_ID') ? NewData.ACCOUNT_ID : origData.ACCOUNT_ID ,
        ACCOUNT_NAME: NewData.hasOwnProperty('ACCOUNT_NAME') ? NewData.ACCOUNT_NAME : origData.ACCOUNT_NAME ,
        FULL_NAME: NewData.hasOwnProperty('FULL_NAME') ? NewData.FULL_NAME : origData.FULL_NAME ,
        HOME_ADDRESS: NewData.hasOwnProperty('HOME_ADDRESS') ? NewData.HOME_ADDRESS : origData.HOME_ADDRESS ,
        MOBILE_PHONE_A: NewData.hasOwnProperty('MOBILE_PHONE_A') ? NewData.MOBILE_PHONE_A : origData.MOBILE_PHONE_A ,
        
        EMAIL1: NewData.hasOwnProperty('EMAIL1') ? NewData.EMAIL1 : origData.EMAIL1 ,
        ROLE_ID: NewData.hasOwnProperty('ROLE_ID') ? NewData.ROLE_ID : origData.ROLE_ID ,
        ROLE_NAME: NewData.hasOwnProperty('ROLE_NAME') ? NewData.ROLE_NAME : origData.ROLE_NAME ,
        ORGANIZATION_ID: NewData.hasOwnProperty('ORGANIZATION_ID') ? NewData.ORGANIZATION_ID : origData.ORGANIZATION_ID ,
        ORG_NAME: NewData.hasOwnProperty('ORG_NAME') ? NewData.ORG_NAME : origData.ORG_NAME ,

        ORG_TYPE: NewData.hasOwnProperty('ORG_TYPE') ? NewData.ORG_TYPE : origData.ORG_TYPE ,
        PROJECT_ID: NewData.hasOwnProperty('PROJECT_ID') ? NewData.PROJECT_ID : origData.PROJECT_ID ,
        REGION_ID: NewData.hasOwnProperty('REGION_ID') ? NewData.REGION_ID : origData.REGION_ID ,
        FIBERHOMEID: NewData.hasOwnProperty('FIBERHOMEID') ? NewData.FIBERHOMEID : origData.FIBERHOMEID ,
        SOURCE_MENU: NewData.hasOwnProperty('SOURCE_MENU') ? NewData.SOURCE_MENU : origData.SOURCE_MENU ,

        TYPE: NewData.hasOwnProperty('TYPE') ? NewData.TYPE : origData.TYPE ,
        rolorgids: NewData.hasOwnProperty('rolorgids') ? NewData.rolorgids : origData.rolorgids ,
        rolorgnames: NewData.hasOwnProperty('rolorgnames') ? NewData.rolorgnames : origData.rolorgnames

    };

    return newTemplate;
    //
}

export default UserTemplate;