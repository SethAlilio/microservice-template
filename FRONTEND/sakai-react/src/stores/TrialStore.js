import create from "zustand";
import {immer} from "zustand/middleware/immer";
import {persist,devtools, subscribeWithSelector} from "zustand/middleware";

const TrialStore = create(
    devtools(
        persist(
            immer(
                subscribeWithSelector(
                    (set, get) => ({
                        label:null,
                        setLabel: (param) => set((state) => { 
                            state.label = param; 
                        }),
                    })
                )
            ),
            {
                name: 'trial-store'
            }
        )
    )
);

export default TrialStore;