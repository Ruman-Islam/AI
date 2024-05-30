const initialState = {
  chats: [],
  chatIds: [],
  notes: [],
};

const chatReducer = (state, action) => {
  switch (action?.type) {
    case "LOAD_CHAT":
      return {
        ...state,
        chats: [...action?.payload],
      };

    case "ADD_NEW_CHAT":
      return {
        ...state,
        chats: [...state.chats, action?.payload],
      };

    case "LOAD_CHAT_ID":
      return {
        ...state,
        chatIds: [...action?.payload],
      };

    case "ADD_CHAT_ID":
      return {
        ...state,
        chatIds: [action?.payload, ...state.chatIds],
      };

    case "LOAD_NOTES":
      return {
        ...state,
        notes: [...action?.payload],
      };

    case "ADD_NOTE":
      return {
        ...state,
        notes: [...state.notes, action?.payload],
      };

    default:
      return state;
  }
};

export { chatReducer, initialState };
