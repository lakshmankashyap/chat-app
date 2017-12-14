import {
  FETCH_CHAT_ROOMS,
  CREATE_CHAT_ROOM,
  RECEIVE_CHAT_ROOM
} from '../constants/chat-room';

const initialState = {
  isLoading: false,
  chatRoomData: {}
};

const chatRoom = (state=initialState, action) => {
  switch(action.type) {
    case `${FETCH_CHAT_ROOMS}_LOADING`:
    case `${CREATE_CHAT_ROOM}_LOADING`:
      return {
        ...state,
        isLoading: true
      };
    case `${FETCH_CHAT_ROOMS}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isFetchChatRoomsSuccess: true,
        chatRooms: action.payload.data.chatRooms
      };
    case `${CREATE_CHAT_ROOM}_SUCCESS`:
      return {
        ...state,
        isLoading: false,
        isCreateChatRoomSuccess: true,
        chatRoomData: action.payload.data
      };
    case RECEIVE_CHAT_ROOM:
      return {
        ...state,
        isLoading: false,
        isReceiveChatRoom: true,
        chatRoomData: action.payload
      };
    case `${FETCH_CHAT_ROOMS}_ERROR`:
    case `${CREATE_CHAT_ROOM}_ERROR`:
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      return state;
  }
}

export default chatRoom;
