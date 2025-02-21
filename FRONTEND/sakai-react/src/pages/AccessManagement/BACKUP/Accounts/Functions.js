import BaseService from '../../../../service/BaseService';

const onLoading = (setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1) => {
    //debugger;
    BaseService.HttpGet("/system/menu/showAllAccounts").then(
        (response) => {
            setAccountList(response.data["queryAccounts"]);
            setRolesList(response.data["queryRoles"]);
            setOrgTree(response.data["queryOrgTree"]);
            setOrganizationList(response.data["queryOrganization"]);

            setLoading1(false);
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
               console.log('error'); console.log(_content);
        }
    );
}

const getSelectedCustomer = (id,  accountList, setAccount, setSelectedNat, setSelectedGen, setSelectedStat, setSelectedType,
    nationality, gender, status, type) => {

    const single = accountList.filter(x => id == x.ACCOUNT_ID);
        console.log(single[0]);
        setAccount(single[0]);

        var natId = single[0].NATIONALITY;

        if(natId !== ''){
            var sel = nationality.filter(y => y.id == natId);
            setSelectedNat(sel[0]);

        } else {
            setSelectedNat(nationality[0]);

        }

        var sexId = single[0].SEX;
        var selGen = gender.filter(z => z.id == sexId);
        setSelectedGen(selGen[0]);

        var statusId = single[0].STATUS_;
        var selStatus = status.filter(aa => aa.id == statusId);
        setSelectedStat(selStatus[0]);

        var typeName = single[0].TYPE;
        var selTyp = type.filter(t => t == typeName);
        setSelectedType(selTyp[0]);

}

const accountsUpdate = (setDisplayBasic, setIsRoleUpdate, setIsOrgUpdate, isFirstLoadSet,
        setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1,
        roleOrgCont, toast, isRoleUpdate, isOrgUpdate, actionType, account) => {
    if(roleOrgCont.length == 0){
        toast.current.show({severity:'error', summary: 'Account Page', detail:'Role and Organization not selected', life: 3000});
    return null;
    }

    const condition = [];
    if(isRoleUpdate) condition.push("roleUpdate");
    if(isOrgUpdate) condition.push("orgUpdate");

    const objectV = {name:'accountUpdate', conditions: condition , action: actionType ,object: account };

    BaseService.HttpPost("/system/menu/accountsUpdate", objectV).then(
        (response) => {
            if(response.data.feedback === '1'){
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                setDisplayBasic(false);
                setIsRoleUpdate(false);
                setIsOrgUpdate(false);
                isFirstLoadSet(true);
                //onLoading();
                onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
            } else {
                toast.current.show({severity:'error', summary: 'Account Page', detail:'Asterisk fields is required', life: 5000});
            }
        },
        (error) => {
            const _content =
                (error.response && error.response.data) || error.message || error.toString();
                console.log(_content);
        }
    );
}

const accountActivation = (id,
        accountList, toast,
        setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1
    ) =>{

        const single = accountList.filter(x => id == x.ACCOUNT_ID);

        const objectV = {name:'accountActivation', conditions: null , action: null , object: single[0]};

        BaseService.HttpPost("/system/menu/accountActivation", objectV).then(
            (response) => {
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});

                onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                   console.log(_content); 
            }
        );
}

const switchSourceMenuSave = (toast,
        selectedSourceMenu, account,
        setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1,
        dialogSourceMenuSet
    ) => {

    const objectV = {name:'SwitchSourceMenuSave', str: selectedSourceMenu, object: account };
        BaseService.HttpPost("/system/menu/SwitchSourceMenuSave", objectV).then(
            (response) => {
                toast.current.show({severity:'success', summary: 'Account Page', detail:'Update Success', life: 3000});
                //onLoading();
                onLoading(setAccountList, setRolesList, setOrgTree, setOrganizationList, setLoading1);
                dialogSourceMenuSet(false);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) || error.message || error.toString();
                toast.current.show({ severity: 'error', summary: 'Remtal Page', detail: _content, life: 3000 });
            }
        );
}

const onGlobalFilterChange = (e,
    filters, setFilters, setGlobalFilterValue
    ) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
}

// ========================================>>
const FuncAccount = {
    onLoading,
    getSelectedCustomer,
    accountsUpdate,
    accountActivation,
    switchSourceMenuSave,
    onGlobalFilterChange
}

export {FuncAccount};