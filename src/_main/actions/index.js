import { bindActionCreators } from 'redux';
import {
  socketUserLogin,
  localLogin,
  facebookLogin,
  googleLogin,
  twitterLogin,
  instagramLogin,
  linkedinLogin,
  githubLogin,
  register,
  logout
} from './auth';
import {
  fetchUser,
  searchUser
} from './user';
import {
  socketIsTyping,
  socketIsNotTyping
} from './typer';
import {
  changeChatRoom,
  createGroupChatRoom,
  createDirectChatRoom,
  socketJoinChatRoom,
  socketLeaveChatRoom
} from './chat-room';
import {
  fetchOldMessages,
  sendTextMessage,
  sendFileMessage,
  sendImageMessage,
  sendAudioMessage
} from './message';

const actions = (dispatch) => {
  return bindActionCreators({
    socketUserLogin,
    localLogin,
    facebookLogin,
    googleLogin,
    twitterLogin,
    instagramLogin,
    linkedinLogin,
    githubLogin,
    register,
    logout,
    fetchUser,
    searchUser,
    socketIsTyping,
    socketIsNotTyping,
    changeChatRoom,
    createGroupChatRoom,
    createDirectChatRoom,
    socketJoinChatRoom,
    socketLeaveChatRoom,
    fetchOldMessages,
    sendTextMessage,
    sendFileMessage,
    sendImageMessage,
    sendAudioMessage
  }, dispatch);
}

export default actions;