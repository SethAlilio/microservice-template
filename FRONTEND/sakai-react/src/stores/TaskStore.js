import create from "zustand";

import {devtools, persist, subscribeWithSelector} from "zustand/middleware"
import { immer } from 'zustand/middleware/immer'
import TeTaskService from "../service/Inventory/TELedgerService/TeTaskService";

const useTaskStore = create(
/*    persist(*/
        immer(
            subscribeWithSelector(
                (set,get) => ({
                    tasks:null,
                    getTaskList: async (username) =>{
                        const response = await TeTaskService.getTeTaskOfUser(username);
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
export const useTaskState = () => useTaskStore((state) => state.tasks);
export const useSetTask = () => useTaskStore((state) => state.setTaskList);
export const useRemoveTask = () => useTaskStore((state) => state.removeTaskList);
export const useGetTask = () => useTaskStore((state)=> state.getTaskList);
