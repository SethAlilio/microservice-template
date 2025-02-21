import React, {useEffect, useRef, useState} from "react";
import {Toast} from "primereact/toast";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {Ripple} from "primereact/ripple";
import {classNames} from "primereact/utils";
import {Dropdown} from "primereact/dropdown";
//import TeDataDictionaryListService, {getDDListDataCancelToken} from "../../../service/Inventory/DataDictionary/TeDataDictionaryListService";
import {Dialog} from "primereact/dialog";
import {Toolbar} from "primereact/toolbar";
import {Paginator} from "primereact/paginator";
import {Card} from "primereact/card";
import {useUserDetails} from "../../stores/userStore";
import moment from "moment/moment";

const AttributedList = (props) => {

    const dt = useRef(null);
    const paginator = useRef(null);
    const toast = useRef(null);

    const userInfo = useUserDetails();

    const [tableTotalCount, setTableTotalCount] = useState(0);
    const [tableStart, setTableStart] = useState(0);
    const [tableLimit, setTableLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInputTooltip, setPageInputTooltip] = useState('Press \'Enter\' key to go to this page.');
    const [getAttributedList,setAttributedList] = useState('');
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [getLoadingStatus, setLoadingStatus] = useState(false);

    const [getSearchName, setSearchName] = useState(null);

    const [getFormHeader, setFormHeader] = useState("");
    const [displayForm, setDisplayForm] = useState(false);

    const [getDataDictID,setDataDictID] = useState(null);
    const [getName,setName] = useState(null);
    const [getCode,setCode] = useState(null);
    const [getParentId,setParentId] = useState(null);
    const [getInstanceId,setInstanceId] = useState(null);

    const [getDataAllList,setDataAllList] = useState([]);
    const [getDataList,setDataList] = useState([]);
    const [getCodeList,setCodeList] = useState([]);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(()=> {
        /* TeDataDictionaryListService.getCodes().then((res) => {
            //setCodeList(res.data.codeNames);
            setCodeList(res.data.codeNames.filter(x => x.instance_id == '4' || x.instance_id == '6'));
            setDataAllList(res.data.data);
        }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error getting equipments data', detail: 'Please try again'});
        }); */
    },[])

    const tableStyle = {
        header : {
            width: 'auto',
            minWidth: '15rem',
            padding:'10px',
            textAlign:'center'
        },
        column : {
            minWidth: '15rem',
            padding:'5px',
            alignItems: 'center'
        }
    }

    const onPageChange = (e) => {
        setTableStart(e.first);
        setTableLimit(e.rows);
        setCurrentPage(e.page + 1);
        loadListData(e.first, e.rows, false, false);
    }
    const onPageInputKeyDown = (e, options) => {
        if (e.key === 'Enter') {
            const page = parseInt(currentPage);
            if (page < 1 || page > options.totalPages) {
                setPageInputTooltip(`Value must be between 1 and ${options.totalPages}.`);
            }
            else {
                const first = currentPage ? options.rows * (page - 1) : 0;
                setTableStart(first);
                loadListData(first,  options.rows, false, false);
                setPageInputTooltip('Press \'Enter\' key to go to this page.');
            }
        }
    }
    const onPageInputChange = (e) => {
        setCurrentPage(e.target.value);
    }
    const paginatorTemplate = {
        layout: 'PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport',
        'PrevPageLink': (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Previous</span>
                    <Ripple />
                </button>
            )
        },
        'NextPageLink': (options) => {
            return (
                <button type="button" className={options.className} onClick={options.onClick} disabled={options.disabled}>
                    <span className="p-3">Next</span>
                    <Ripple />
                </button>
            )
        },
        'PageLinks': (options) => {
            if ((options.view.startPage === options.page && options.view.startPage !== 0) || (options.view.endPage === options.page && options.page + 1 !== options.totalPages)) {
                const className = classNames(options.className, { 'p-disabled': true });

                return <span className={className} style={{ userSelect: 'none' }}>...</span>;
            }

            return (
                <button type="button" className={options.className} onClick={options.onClick}>
                    {options.page + 1}
                    <Ripple />
                </button>
            )
        },
        'RowsPerPageDropdown': (options) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 25, value: 25 },
                { label: 50, value: 50 },
                { label: 100, value: 100 }
            ];

            return <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />;
        },
        'CurrentPageReport': (options) => {
            return (
                <>
                    <span className="mx-3" style={{ color: 'var(--text-color)', userSelect: 'none' }}>
                        Go to <InputText size="2" className="ml-1" value={currentPage} tooltip={pageInputTooltip}
                                         onKeyDown={(e) => onPageInputKeyDown(e, options)} onChange={onPageInputChange}/>
                    </span>
                    <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                        {options.first} - {options.last} of {options.totalRecords}
                    </span>
                </>
            )
        }
    };

    const clearFields = () => {
        setSearchName("");
    }
    const leftToolBarTemplate = () => {
        return(
            <>
                <div className="p-field col-12 lg:col-3 md:col-6 sm:col-12 label-filter">
                    <span className="p-float-label">
                        <InputText className="p-d-block p-mb-2" id="name" value={getSearchName} onChange={(e) => setSearchName(e.target.value)} />
                        <label htmlFor="Name">Name</label>
                    </span>
                </div>
                { isMobile ?
                <div className="p-field col-12 lg:col-3 md:col-6 sm:col-12 hidden-div">
                        <span className="p-float-label">
                        <InputText disabled style={{width: "100%", color: "transparent", border: "0px"}} className="p-d-block p-mb-2" id="name" value={getSearchName} onChange={(e) => setSearchName(e.target.value)}/>
                    </span>
                </div>
                    : null
                }
            </>
        )
    }
    const rightBarToolTemplate = () => {

        return(
            <>
                <Button label="Search" icon="pi pi-search" className="p-button-secondary mt-2"
                        onClick={onSearch} style={{marginLeft:"auto"}}/>
                <Button className="mt-2" label="Clear filter" icon="pi pi-filter-slash" style={{height:"40px"}} onClick={clearFields}/>
            </>
        )
    }

    const actionBodyTemplate = (row) => {
        return (

            <span>
                <Button icon="pi pi-pencil" className="p-button-outlined p-button-warning mr-2 mb-2" onClick={() => onSubmitEditForm(row)}
                        tooltip="Edit"/>
            </span>

        )
            ;
    }

    const footerContent = (
        <div>
            <Button type="submit" label="Save" icon="pi pi-save" className="p-button-primary"
                    onClick={() => {
                        onSubmitForm();
                    }} autoFocus
            />
            <Button type="button" label="Dismiss" icon="pi pi-times" className="p-button-secondary"
                    onClick={() => {
                        setDisplayForm(false)
                        resetForm()
                    }}
            />

        </div>
    );

    const onSearch = () => {
        setTableStart(0);
        loadListData(0, paginator.current.props.rows, false, true);
    }

    const loadListData = (start, limit, refresh, search) => {
        /* const filterMap = new Map();
        filterMap.set("searchName",getSearchName);

        if (getDDListDataCancelToken) {
            getDDListDataCancelToken.cancel("Request Cancel")
        }
        setRefreshLoading(true);
        setLoadingStatus(true);
        TeDataDictionaryListService.getAttributedList(filterMap, start, limit).then((res) => {
            setAttributedList(res.data.data);
            setTableTotalCount(res.data.totalCount);
            setLoadingStatus(false);
        }).catch((error) => {
            toast.current.show({severity: 'error', summary: 'Error getting equipments data', detail: 'Please try again'});
            setLoadingStatus(false);
        }); */
    }

    const onChangeAttributedList = (e) => {
        setDataList( []);
        setParentId(null);
        setCode(e);
        if(e == "1" || e == "4") {
            setDataList( null);
        } else if(e == "2" || e == "3") {
            let d  = e - 1;
            setDataList(getDataAllList.filter(x => x.code == d ).map(x => {return {...x, name: `${x.name} (${x.id})`}}));
        } else if(e == "5") {
            let d  = e - 2;
            setDataList(getDataAllList.filter(x => x.code == d ).map(x => {return {...x, name: `${x.name} (${x.id})`}}));
        } else if(e == "6") {
            let c  = e - 4;
            setDataList(getDataAllList.filter(x => x.code == c ).map(x => {return {...x, name: `${x.name} (${x.id})`}}));
        } else {
            setDataList(getDataAllList.filter(x => x.code == e ).map(x => {return {...x, name: `${x.name} (${x.id})`}}));
        }
    }

    const onChangeDataList = (e) => {
        setParentId(e.value);
    }

    const resetForm = () => {
        setDataDictID(null);
        setName("");
        setCode(null);
        setParentId(null);
        setInstanceId("");
        setDataList( []);
    }

    const formatDate = (date) => {
        return !!date ? moment(date).format("YYYY-MM-DD HH:mm:ss"):"";
    }
    const onSubmitAddForm = (e) => {
        setFormHeader("Attributed Add Form")
        setDisplayForm(true);
    }

    const onSubmitEditForm = (e) => {
        setFormHeader("Attributed Edit Form")
        setDisplayForm(true);
        setDataDictID(e.dataDictID);
        setName(e.name);
        onChangeAttributedList(parseInt(e.code));
        setParentId(parseInt(e.parentId));
        setInstanceId(e.instanceId);
    }

    const onSubmitForm = () => {

        let getCreatedDate = formatDate(new Date().toJSON());

        let body = {
            dataDictID: getDataDictID,
            name: getName,
            code: getCode,
            parentId: getParentId,
            instanceId: getInstanceId,
            createdDate : getCreatedDate,
            createdById: userInfo.ACCOUNT_ID,
            createdBy : userInfo.FULL_NAME,
            updatedDate : getCreatedDate,
            updatedById: userInfo.ACCOUNT_ID,
            updatedBy : userInfo.FULL_NAME
        }

        //console.log(body);

        if(getName == null || getName == "" || getCode == null){
            toast.current.show({severity: 'error', summary: 'Input Name and Code Name are Required', detail: 'Please try again'});
        }else{
            /* TeDataDictionaryListService.onSubmitForm(body).then((res) =>{
                 toast.current.show({severity: 'success', summary: 'System Notification', detail: res.data.message, life: 3000});
                 resetForm();
                 setDisplayForm(false);
                 loadListData(0, paginator.current.props.rows, false, true);
            }) */
        }

    }

    return(
        <>

                <Toast ref={toast} />
                <div className="grid">
                    <div className="col-12">
                        <Card style={{backgroundColor:"#eff3f8", boxShadow:"none"}} title="Attributed List"/>
                        <div className="card">
                            <Toolbar left={leftToolBarTemplate} right={rightBarToolTemplate} style={{marginLeft:"auto"}}></Toolbar>
                            <div className="template" style={{marginBottom:"10px"}}>
                                <Button className="slack p-0" aria-label="Slack"
                                        onClick={onSubmitAddForm}>
                                    <i className="pi pi-user-plus px-2"/>
                                    <span className="px-3">Add New</span>
                                </Button>
                            </div>

                            <DataTable  ref={dt} loading={getLoadingStatus} value={getAttributedList}
                                        columnResizeMode="fit" scrollable={true} responsiveLayout="scroll" showGridlines rowHover={true}
                                        dataKey="dataDictID" rows={tableLimit} rowsPerPageOptions={[10, 25, 50, 100]} className="datatable-responsive"
                                        emptyMessage="No tools or equipments found.">

                                <Column frozen alignFrozen="left" header="Action" style={tableStyle.column} headerStyle={tableStyle.header} exportable={false} body={actionBodyTemplate}/>
                                <Column field="dataDictID" style={{display:'none'}} exportable={false} header="ID"></Column>
                                <Column style={tableStyle.column}  sortable field="name" header="Name" headerStyle={tableStyle.header}></Column>
                                <Column style={tableStyle.column}  sortable field="codeName" header="Code Name" headerStyle={tableStyle.header}></Column>
                                <Column style={tableStyle.column}  sortable field="parentName" header="Parent Name" headerStyle={tableStyle.header}></Column>
                                <Column style={tableStyle.column}  sortable field="instanceId" header="Attribute Id" headerStyle={tableStyle.header}></Column>
                            </DataTable>
                            <Paginator ref={paginator} template={paginatorTemplate} first={tableStart} rows={tableLimit} totalRecords={tableTotalCount}
                                       onPageChange={onPageChange}>
                            </Paginator>
                        </div>
                    </div>

                    {/* Add New Dialog */}
                    <Dialog header={getFormHeader} visible={displayForm} className="add-dialog" modal
                             onHide={() => { resetForm(); setDisplayForm(false)} } footer={footerContent}>
                        <div style={{ backgroundColor: "#f9f9f9", padding: '25px', borderRadius: '10px', marginTop: '15px' }}>
                            <div className="p-fluid">
                                <div className="grid">
                                    <div className="field col-12 md:col-6">
                                        <span className="p-float-label">
                                            <InputText id="name" value={getName} onChange={(e) => setName(e.target.value)} />
                                            <label htmlFor="Name">Name</label>
                                        </span>
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <span className="p-float-label">
                                            <InputText id="attributedid" value={getInstanceId} onChange={(e) => setInstanceId(e.target.value)} />
                                            <label htmlFor="Attributed Id">Attributed Id</label>
                                        </span>
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <span className="p-float-label">
                                            <Dropdown inputId="codename" value={getCode}
                                                      optionLabel={"name"} optionValue={"instance_id"}
                                                      onChange={ (e)=> {
                                                          onChangeAttributedList(e.value);
                                                      } }
                                                      options={getCodeList}  style={{ width: '100%' }} showClear filter />
                                            <label htmlFor="Code Name">Code Name</label>
                                        </span>
                                    </div>

                                    <div className="field col-12 md:col-6">
                                        <span className="p-float-label">
                                            <Dropdown inputId="parentname" value={getParentId}
                                                      optionLabel={"name"} optionValue={"id"}
                                                      onChange={ (e)=> {
                                                          onChangeDataList(e);
                                                      } }
                                                      options={getDataList}  style={{ width: '100%' }} showClear filter />
                                            <label htmlFor="Parent Name">Parent Name</label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                    {/* End of Add New Dialog */}

                </div>
        </>

    );

}
export default AttributedList;
