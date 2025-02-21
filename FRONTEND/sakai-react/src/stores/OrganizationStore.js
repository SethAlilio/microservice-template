import create from "zustand";
import {immer} from "zustand/middleware/immer";
import {persist,devtools, subscribeWithSelector} from "zustand/middleware";
//import TELedgerService from "../service/Inventory/TELedgerService/TELedgerService";
const useOrganizationTree = create(
    devtools(
        persist(
            immer(
            subscribeWithSelector(
                (set,get) => ({
                    organizationTree: null,
                    setOrganizationTree: (payload) => set((state) => {
                        state.organizationTree = payload;
                    }),
                    addOrganizationToTree: (payload) => set((state) => {
                        const findParent = state.organizationTree.find(org => org.key === payload.parentKey);
                        findParent.children.push(payload.org);
                    }),
                    removeOrganizationFromTree: (payload) => set((state) =>{
                        const findOrg = get().organizationTree.filter(org => org.children.find(child => child.key === payload.org.key.toString()))[0];
                        findOrg.children.filter(child => { return child.key !== payload.org.key.toString()});
                    }),
                    updateOrganizationTree: (payload) => set((state)=> {
                        state.removeOrganizationFromTree(payload);
                        const findParent = state.organizationTree.find(org => org.key === payload.parentKey);
                        findParent.children.push(payload.org);
                    }),
                    // GET NEW ORG
                    organizationLedgerTree: null,
                    setOrganizationLedgerTree: (payload) => set((state) => {
                        state.organizationLedgerTree = payload;
                    }),

                    organizationLedgerAreaTree: null,
                    setOrganizationLedgerAreaTree: (payload) => set((state) => {
                        state.organizationLedgerAreaTree = payload;
                    }),

                    grade1: null,
                    setOrgGrade1: (payload) => set((state) => {
                        state.grade1 = payload;
                    }),

                    grade2: null,
                    setOrgGrade2: (payload) => set((state) => {
                        state.grade2 = payload;
                    }),

                    grade3: null,
                    setOrgGrade3: (payload) => set((state) => {
                        state.grade3 = payload;
                    }),

                    grade4: null,
                    setOrgGrade4: (payload) => set((state) => {
                        state.grade4 = payload;
                    }),
                })
                )
            ),
            {
                name: 'organization'
            }
        )
    )
);
//Listen to state "organization" on any changes, mutations
/*useOrganizationTree.subscribe((state) => state.organizationTree,
    (value,prevValue) => console.log("Current Value: ", value, 'Previous Value: ', prevValue)
);*/
export const useOrgTree = () => useOrganizationTree((state)=> state.organizationTree);
export const useSetOrgTree = () => useOrganizationTree((state)=> state.setOrganizationTree);
export const useAddOrganization = () => useOrganizationTree((state)=> state.addOrganizationToTree);
export const useRemoveOrganization = () => useOrganizationTree((state)=>state.removeOrganizationFromTree);
export const useUpdateOrganization = () => useOrganizationTree((state) => state.updateOrganizationTree);

export const useLedgerOrgTree = () => useOrganizationTree((state) => state.organizationLedgerTree);
export const UseLedgerOrgAreaTree = () => useOrganizationTree((state) => state.organizationLedgerAreaTree);


export const SetLedgerOrgTree = () => useOrganizationTree((state) => state.setOrganizationLedgerTree);
export const SetLedgerAreaOrgTree = () => useOrganizationTree((state) => state.setOrganizationLedgerAreaTree);

export const useGrade1 = () => useOrganizationTree((state) => state.grade1);
export const useGrade2 = () => useOrganizationTree((state) => state.grade2);
export const useGrade3 = () => useOrganizationTree((state) => state.grade3);
export const useGrade4 = () => useOrganizationTree((state) => state.grade4);

export const SetOrgGrade1 = () => useOrganizationTree((state) => state.setOrgGrade1);
export const SetOrgGrade2 = () => useOrganizationTree((state) => state.setOrgGrade2);
export const SetOrgGrade3 = () => useOrganizationTree((state) => state.setOrgGrade3);
export const SetOrgGrade4 = () => useOrganizationTree((state) => state.setOrgGrade4);

export default useOrganizationTree;