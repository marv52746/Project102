// utilsReducer.js
const initialState = {
  refreshKey: 0,
};

export default function utilsReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_REFRESH_KEY":
      return {
        ...state,
        refreshKey: action.payload, // should be a NEW value
      };
    default:
      return state;
  }
}

export const setRefreshKey = (value) => ({
  type: "SET_REFRESH_KEY",
  payload: value,
});
