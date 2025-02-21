import {Toast} from "primereact/toast";
import {useEffect, useRef} from "react";
import {TabPanel, TabView} from "primereact/tabview";
import AddAnnouncement from "./AddAnnouncement";
import React, {useState} from "react";
import {DataTable} from "primereact/datatable";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import FilterOperator, {FilterMatchMode} from "primereact/api";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {Column} from "primereact/column";
import {confirmDialog} from "primereact/confirmdialog";
import AnnouncementService from "../../../../service/Inventory/AccessManagement/AnnouncementService";
import AppConfigDialog from "../../../../AppConfigDialog";
import moment from "moment";

const Announcements = () => {
    const headStyle = { width: 'auto', minWidth: '10rem', padding:'5px',textAlign:'center' };
    const colStyle = {minWidth: '10rem',padding:'5px',textAlign:'center'};
    const [getLoadingStatus, setLoadingStatus] = useState(false);
    const dt = useRef(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const toast = useRef(null);

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'subject': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'publishedDate': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
    });
    const [announcementDate, setAnnouncementDate] = useState(null);
    const [getGlobalFilterValue, setGlobalFilterValue] = useState('');
    const [announcementList, setAnnouncementList] = useState([]);
    const [displayMaximizable, setDisplayMaximizable] = useState(false);
    const [notificationDialogContent, setNotificationDialogContent] = useState("");
    const [headerSubject, setHeaderSubject]=useState("");
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filter = { ...filters};
        _filter['global'].value = value;
        setFilters(_filter);
        setGlobalFilterValue(value);
    }
    const monthNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} style={{ lineHeight: 1 }} />;
    }
    const yearNavigatorTemplate = (e) => {
        return <Dropdown value={e.value} options={e.options} onChange={(event) => e.onChange(event.originalEvent, event.value)} className="p-ml-2" style={{ lineHeight: 1 }} />;
    }

    const onSearch = () => {
        if (announcementDate){
            let paramMap = new Map();
            if (announcementDate.every(element => {return !!element})) {
                let startDate = moment(announcementDate[0]).format("YYYY-MM-DD HH:mm:ss");
                let endDate =  moment(announcementDate[1]).add(1,'day').format("YYYY-MM-DD HH:mm:ss");
                paramMap.set("startDate",startDate);
                paramMap.set("endDate",endDate);
            }else{
                let startDate = moment(announcementDate[0]).format("YYYY-MM-DD");
                paramMap.set("startDate",startDate);
            }
            queryAnnouncementList(paramMap);
        }
    };

    const header = (
        <>
            <label htmlFor="annDate">Date: </label>
            <Calendar id="annDate" value={announcementDate} onChange={(e) => setAnnouncementDate(e.value)}
                      selectionMode="range" showIcon showButtonBar readOnlyInput
                      monthNavigator monthNavigatorTemplate={monthNavigatorTemplate}
                      yearNavigator yearRange="2022:2040" yearNavigatorTemplate={yearNavigatorTemplate}
                      onClearButtonClick={() => queryAnnouncementList()}/>
        <Button onClick={onSearch} style={{marginLeft:"10px",backgroundColor:"#6366F1"}} label="Query" icon="pi pi-search" className="p-button-secondary"/>
        <span className="block mt-2 md:mt-0 p-input-icon-left pull-right">
            <i className="pi pi-search" />
            <InputText value={getGlobalFilterValue} onChange={onGlobalFilterChange} placeholder={"Search"} />
        </span>
        </>
    );
    //const SOCKET_URL = window.location.protocol.concat("//").concat(window.location.hostname).concat(":1103/fh-websocket/");
    const queryAnnouncementList = (filter) => {
        AnnouncementService.loadAllAnnouncements(filter).then((res)=>{
            res.data.sort((a, b) => b['announcementId'] - a['announcementId']);
            let calData = res.data.map(item=> {
                let temp = Object.assign({}, item);
                temp.publishedDate = moment(temp.publishedDate).format("MM/DD/YYYY HH:mm:ss");
                return temp;
            });
            setAnnouncementList(calData);
        }).catch((error) =>{
            toast.current.show({severity: 'error', summary: 'Error getting announcements', detail: 'Please try again'});
        });
    }

    useEffect(() => {
        queryAnnouncementList();
    }, []);

    const deleteAnnouncement = (id) => {
        if (id) {
            AnnouncementService.deleteAnnouncement(id).then((res)=> {
                setAnnouncementList(announcementList.filter(announcement => announcement.announcementId !== id));
                toast.current.show({severity: 'success', summary: 'Announcement deleted'});
            }).catch((error) => {
                toast.current.show({severity: 'error', summary: 'Error deleting announcement', detail: 'Please try again'});
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'No id selected'});
        }
    }
    const showDeleteConfirmDialog = (rowData) => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteAnnouncement(rowData.announcementId),
            reject: () => {}
        });
    }
    const actionColumnTemplate = (rowData) => {
        return (
            <div>
                <Button title={"View Announcement"} icon="pi pi-eye"  onClick={() => displayMaximizeNotification(rowData?.subject,getContent(rowData?.content))} className="p-button-rounded p-button-outlined"  />
                <Button title={"Delete Announcement"} icon="pi pi-trash"  onClick={() => showDeleteConfirmDialog(rowData)} className="p-button-rounded p-button-outlined"  />
            </div>
        );
    };
    // Get the notification message
    const getContent = message => {
        if (message.indexOf('\n') >= 0) {
            let splitted = message.split('\n');
            let ret = '<ul>';
            for (let i = 0; i <= splitted.length - 1; i++) {
                if (splitted[i] !== '') {
                    ret = ret + '<li>' + splitted[i] + '</li>';
                }
            }
            ret = ret + '</ul>';
            return {
                __html: ret
            };
        }
        return {
            __html: `<ul><li>${message}</li></ul>`
        };
    };
    const displayMaximizeNotification = (subject,content) => {
        setDisplayMaximizable(prevState => !prevState);
        setNotificationDialogContent(content);
        setHeaderSubject(subject);
    };
    return(
        <>
            <AppConfigDialog subject={headerSubject} displayMaximizable={displayMaximizable} setDisplayMaximizable={setDisplayMaximizable}
                             notificationDialogContent={notificationDialogContent}/>
            <div className="grid table-demo">
                <Toast ref={toast} position="top-right" />
                <div className="col-12">
                    <TabView>
                        <TabPanel header="ANNOUNCEMENT LIST">
                            <div className={'datatable-crud-demo card'}>
                                <Toast ref={toast} />
                                <DataTable loading={getLoadingStatus} ref={dt}
                                           responsiveLayout="scroll"
                                           dataKey="announcementId" paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]}
                                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} announcements" showGridlines
                                           globalFilterFields={['subject','publishedDate']} filters={filters}
                                           header={header} className="datatable-responsive"
                                           value={announcementList} selection={selectedAnnouncement} onSelectionChange={(e)=> {setSelectedAnnouncement(e.target.value)}}
                                           emptyMessage="No announcements posted.">
                                    <Column header="Action" body={actionColumnTemplate} exportable={false} style={{width: '9.5rem',minWidth: '2rem'}}></Column>
                                    <Column style={colStyle} field="subject" header="Subject/Title" headerStyle={headStyle}  sortable />
                                    <Column style={colStyle} field="publishedDate" header="Published Date" headerStyle={headStyle}  sortable />
                                    <Column style={colStyle} colSpan={2} rowSpan={2} field="escapedContent" header="Content" headerStyle={headStyle} sortable/>
                                </DataTable>
                            </div>
                        </TabPanel>
                        <TabPanel header="MAKE ANNOUNCEMENT">
                           <AddAnnouncement/>
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </>
    );
}
export default Announcements;
