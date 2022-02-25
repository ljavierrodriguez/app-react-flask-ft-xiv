import React, { useEffect, useState } from 'react';
import getState from './flux';

export const Context = React.createContext(null);

const injectContext = PassedComponet => {

    const StoreWrapper = props => {

        const [state, setState] = useState(getState({
            getStore: () => state.store,
            getActions: () => state.actions,
            setStore: (updateStore = {}) => setState({
                store: Object.assign(state.store, updateStore),
                actions: { ...state.actions }
            })
        }));

        useEffect(() => {
            state.actions.getSessionUser();
        }, [])

        return (
            <Context.Provider value={state}>
                <PassedComponet />
            </Context.Provider>
        )
    }

    return StoreWrapper;
}

export default injectContext;