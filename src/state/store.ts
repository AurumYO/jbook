import { createStore } from 'redux';
import { applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import reducers from './reducers';
import { ActionType } from './action-types';

export const store = createStore(reducers, {}, applyMiddleware(thunk));

store.dispatch({
    type: ActionType.INSERT_CELL_BEFORE,
    payload: {
        id: null,
        type: 'code',
    },
});

store.dispatch({
    type: ActionType.INSERT_CELL_BEFORE,
    payload: {
        id: null,
        type: 'text',
    },
});

console.log(store.getState());
