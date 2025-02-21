import create from "zustand";

import {devtools, persist, subscribeWithSelector} from "zustand/middleware"
import { immer } from 'zustand/middleware/immer'
import TELedgerService from "../service/Inventory/TELedgerService/TELedgerService";

// THIS CODE IS NOT USED
const UseOrganizationV2Store = create(
    /*    persist(*/
            immer(
                subscribeWithSelector(
                    (set,get) => ({
                        tasks:null,
                        getTaskList: async () =>{
                            
                            const response = await TELedgerService.getNewOrgSample();
                            set({tasks: response.data});
                        },
                        setTaskList:(taskList) => set({tasks:taskList}),
                        removeTaskList: () => set({ tasks: null})
                    })
                )
            )/*,
            {
                name: 'tasks',
                getStorage: () => sessionStorage,
                partialize: (state) => ({ tasks: state.tasks})
            }
        )*/
    );

    export const useTaskState = () => UseOrganizationV2Store((state) => state.tasks);
    export const useSetTask = () => UseOrganizationV2Store((state) => state.setTaskList);
    export const useRemoveTask = () => UseOrganizationV2Store((state) => state.removeTaskList);
    export const useGetTask = () => UseOrganizationV2Store((state)=> state.getTaskList);