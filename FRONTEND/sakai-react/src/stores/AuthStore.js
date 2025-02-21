import create from 'zustand'
import {devtools, persist, subscribeWithSelector} from "zustand/middleware"
import { immer } from 'zustand/middleware/immer'

const useAuthStore = create(
    persist(
        immer(
        subscribeWithSelector(
            (set,get) => ({
            token:null,
            isUserLoggedIn:0,
            id:null,
            roles:null,
            userOrganization:null,
            setAuth: ({token,username,roles,userOrg}) => set({token: token,isUserLoggedIn: 1,id:username,roles: roles,userOrganization: userOrg}),
            removeAuth: () => set({ token: null,isUserLoggedIn: 0,id:null,roles:null,userOrganization:null}),
            setUserLoggedIn: (payload) => set({isUserLoggedIn:payload})
            })
            )
        ),
        {
            name: 'auth',
            getStorage: () => sessionStorage,
            partialize: (state) => ({ roles: state.roles, id: state.id, token: state.token, userOrganization: state.userOrganization})
        }
    )
);

/*useAuthStore.subscribe(
    (state) => state.isUserLoggedIn,
    async (isUserLoggedIn) => {
        //subscribe to token if there's any changes or it has been refreshed from the back-end
        if (isUserLoggedIn === 2){
            await
        }
        //token ? await authStorage.setToken(token) : await authStorage.removeToken();
    }
)*/


export const useAuthState = () => useAuthStore((state) => state.isUserLoggedIn);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthStateRoles = () => useAuthStore((state) => state.roles);
export const useAuthUsername = () => useAuthStore((state) => state.id);
export const useSetAuth = () => useAuthStore((state) => state.setAuth);
export const useRemoveAuth = () => useAuthStore((state) => state.removeAuth);
export const useSetUserLoggedIn = () => useAuthStore((state) => state.setUserLoggedIn);
export const useUserOrganizationId = () => useAuthStore((state) => state.userOrganization);
export {useAuthStore};
