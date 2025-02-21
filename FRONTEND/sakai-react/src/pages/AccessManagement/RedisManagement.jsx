import React, {useState} from "react";
import {Toast} from "primereact/toast";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {useEffect, useRef} from "react";
import {Button} from "primereact/button";
import RedisService from "../../../service/Inventory/AccessManagement/RedisService";
import {Dialog} from "primereact/dialog";
import {MultiSelect} from "primereact/multiselect";
import {InputText} from "primereact/inputtext";
import {FilterMatchMode} from "primereact/api";

const RedisManagement = () => {

    const [getLoadingStatus, setLoadingStatus] = useState(false);
    const dt = useRef(null);
    const [selectedKey, setSelectedKey] = useState(null);
    const toast = useRef(null);
    const [keyList, setKeyList] = useState(null);
    const [dialogValue, setDialogValue] = useState(false);
    const [valueList, setValueList] = useState([]);
    const [selectedDataType, setSelectedDateType] = useState(null);
    const [getGlobalFilterValue, setGlobalFilterValue] = useState('');
    const [getFilter, setFilter] = useState({
        'global' : {value:null, matchMode: FilterMatchMode.CONTAINS},
        'key': {value:null, matchMode: FilterMatchMode.CONTAINS},
        'type': { value: null, matchMode: FilterMatchMode.IN },
    })

    const getOrRefreshKeys = () => {
        RedisService.getAllRedisKeys().then((res)=>{
            setKeyList(res.data);
        }).catch((error)=>{
            toast.current.show({ severity: 'error', summary: 'Error getting all Redis keys', detail: error,life: 3000});
        })
    }
    useEffect(() => {
        getOrRefreshKeys();
    },[]);
    const getValueByRedisKey = (key) => {
        setSelectedKey(key);
        RedisService.getAllValuesByKey(key).then((res)=>{
            setDialogValue(true);
            setValueList(res.data);
        }).catch((error)=> {
            toast.current.show({ severity: 'error', summary: 'Error getting all values of Redis key: '+key, detail: error,life: 3000});
        });
    }
    const deleteRedisKey = (key) => {
        RedisService.deleteRedisKey(key).then((res)=>{
            toast.current.show({ severity: 'success', summary: "Key deletion success",life: 3000});
        }).catch((error)=> {
            toast.current.show({ severity: 'error', summary: 'Error deleting Redis key: '+key, detail: error,life: 3000});
        });
    }
    const deleteRedisValue = (value) => {
        RedisService.deleteValueOnKey(selectedKey, value).then((res)=>{
            toast.current.show({ severity: 'success', summary: "Delete success",life: 3000});
        }).catch((error)=> {
            toast.current.show({ severity: 'error', summary: 'Error deleting value on '+selectedKey, detail: error,life: 3000});
        });
    }
    const actionColumnTemplate = (rowData) => {
        return (
            <div>
                <Button title={"View Values"} icon="pi pi-key"  onClick={() => getValueByRedisKey(rowData.key)} className="p-button-rounded p-button-outlined"  />
                <Button title={"Delete Key"} icon="pi pi-trash"  onClick={() => deleteRedisKey(rowData.key)} className="p-button-rounded p-button-outlined"  />
            </div>
        );
    };
    const modalHeader = (
        <div className={"info-title"}>Redis Key-Value Pair</div>
    );

    function toggleReadValue(value){
        RedisService.toggleNotificationReadState(selectedKey, value).then((res)=>{
            getValueByRedisKey(selectedKey);
            toast.current.show({ severity: 'success', summary: "Toggle success",life: 3000});
        }).catch((error)=> {
            toast.current.show({ severity: 'error', summary: 'Error toggling read state', detail: error,life: 3000});
        });
    }
    function actionValueColumnTemplate(rowData) {
        return (
            <div>
                <Button title={"Toggle "+ (rowData.read? 'Unread': 'Read')} icon={"pi "+ (rowData.read? 'pi-eye-slash': 'pi-eye')}  onClick={() => toggleReadValue(rowData)} className="p-button-rounded p-button-outlined"  />
                <Button title={"Delete Value"} icon="pi pi-trash"  onClick={() => deleteRedisValue(rowData)} className="p-button-rounded p-button-outlined"  />
            </div>
        );
    }
    const btnSearch = () => {

    }
    const redisDataTypeList = ["String","List","Hash","Set","Sorted Set"];
    const onChangeSelectedDataType = (event) => {
        setSelectedDateType(event.target.value)
    }
    const leftToolbarTemplate = () => {
        return(
            <>
                <MultiSelect display="chip" options={redisDataTypeList}
                             value={selectedDataType} onChange={onChangeSelectedDataType}
                             showClear placeholder="Filter Redis Key Type"/>
                <Button onClick={btnSearch}  style={{marginLeft: "10px"}} label="Search" icon="pi pi-search" className="p-button-secondary"/>
            </>
        )
    }
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filter = { ...getFilter};
        _filter['global'].value = value;
        setFilter(_filter);
        setGlobalFilterValue(value);
    }
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">
                <span style={{fontSize:'x-large', fontWeight:'900'}}>Redis Key-Value List</span>
                <span style={{color:'#1E9FDB', fontWeight: '700', fontSize:'larger'}}/>
            </h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                 <i className="pi pi-search" />
                <InputText value={getGlobalFilterValue} onChange={onGlobalFilterChange}
                           placeholder={"Search"} />
            </span>
        </div>
    )
    const handleDataType = (dataType) =>{
        switch (dataType){
            case "ZSET": return "Sorted Set";
        }
    }

    const dataTypeFilterTemplate= (options) => {
        return <MultiSelect display="chip" options={redisDataTypeList}
                            value={options.value} onChange={(e) => options.filterApplyCallback(e.value)}
                            showClear placeholder="Filter Redis Key Type"  className="p-column-filter"
            /* itemTemplate={dataTypeFilterItemTemplate}*//>;
    }
    return(
        <>
            <div className="grid table-demo">
                <div className="col-12">
                    <div className={'datatable-crud-demo card'}>
                        <Toast ref={toast} />
                        {/*  <Toolbar className="mb-4" left={leftToolbarTemplate}/>*/}
                        <DataTable loading={getLoadingStatus} ref={dt}
                                   responsiveLayout="scroll"
                                   dataKey="announcementId" paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} redis keys" showGridlines
                                   className="datatable-responsive" value={keyList} selection={selectedKey}
                                   onSelectionChange={(e)=> {setSelectedKey(e.target.value)}}
                                   emptyMessage="No keys available." filterDisplay="row"
                                   header={header}
                                   globalFilterFields={["Keys","keys","Type","type"]}
                                   filters={getFilter}>
                            <Column header="Action" body={actionColumnTemplate} exportable={false} style={{width: '9.5rem',minWidth: '2rem'}}></Column>
                            <Column field="type" header="Type" body={(row) => handleDataType(row.type)} sortable
                                    filter filterField="type" filterElement={dataTypeFilterTemplate}
                                    filterMenuStyle={{ width: '10rem'}} style={{ width: '10rem',minWidth: '10rem' }}
                                    showFilterMenu={false}/>
                            <Column field="key"  header="Keys" sortable />
                        </DataTable>
                    </div>
                </div>
            </div>
            <Dialog header={modalHeader} visible={dialogValue} style={{ width: '80vw' }} modal  onHide={() => setDialogValue(prevState => !prevState)}>
                <br />
                <div style={{ backgroundColor: "#fafafa", padding: '25px', borderRadius: '10px' }}>
                    <div className="grid">
                        <div className="field col-12 md:col-12">
                            <DataTable value={valueList} responsiveLayout="scroll" rowHover={true} showGridlines={true}>
                                <Column header="Action" body={actionValueColumnTemplate} exportable={false} style={{width: '9.5rem',minWidth: '2rem'}}></Column>
                                <Column field="subject" header="Subject"></Column>
                                <Column field="content" header="Content"></Column>
                                <Column body={(row) => row.read? "true":"false"} header="Read"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
export default RedisManagement;
