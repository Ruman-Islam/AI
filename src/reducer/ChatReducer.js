import { sortDocumentsByTimestampDesc } from "@/utils/sort";

const initialState = {
  chats: [],
  chatIds: [],
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
      const sorted = sortDocumentsByTimestampDesc(state.chatIds);
      return {
        ...state,
        chatIds: [action?.payload, ...sorted],
      };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.chatIds, action?.payload],
      };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action?.payload.id) {
            return action?.payload;
          }
          return task;
        }),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action?.payload.id),
      };

    case "DELETE_ALL_TASK":
      return {
        ...state,
        tasks: [],
      };

    case "ADD_TO_FAVORITE":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action?.payload.id) {
            return { ...task, isFavorite: !task.isFavorite };
          } else {
            return task;
          }
        }),
      };

    case "SEARCH":
      return {
        ...state,
        searchQuery: action?.payload,
      };

    default:
      return state;
  }
};

export { chatReducer, initialState };
