import create from "zustand";
import {immer} from "zustand/middleware/immer";
import {persist,devtools, subscribeWithSelector} from "zustand/middleware";

const userDetailsConstruction = create(
    devtools(
        persist(
            immer(
                subscribeWithSelector(
                    (set, get) => ({
                        // property
                        userDetails: null,
                        setUserDetails: (payload) => set((state) => {
                            state.userDetails = payload;
                            
                        })
                    })
                )
            )
            ,
            {
                name: 'userdetails',
            }
        )
    )     
);

export const useUserDetails = () => userDetailsConstruction((state) => state.userDetails);
export const setUserDetails = () => userDetailsConstruction((state) => state.setUserDetails);

export default userDetailsConstruction;