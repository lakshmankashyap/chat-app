import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'muicss/react';
import Popup from 'react-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import uuidv4 from 'uuid/v4';
import mapDispatchToProps from '../../../actions';
import { LoadingAnimation } from '../../../../components/LoadingAnimation';
import {
  ChatDateTime,
  ChatBubble,
  ChatTyper,
  ChatImageLightBox,
  ChatDragDropBox
} from '../../../components/Chat';
import { DeleteMessageModal } from '../DeleteMessageModal';
import './styles.scss';

class ChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLoadedAllMessages: false,
      isChatBoxScrollToBottom: false,
      isChatBoxScrollToTop: false,
      scrollPosition: 0,
      oldestMessageQuery: false,
      oldestMessageOffsetTop: 0,
      isImageLightboxOpen: false,
      imageIndex: -1,
      audioIndex: -1,
      isModalOpen: false,
      selectedMessageID: ''
    };
  }
  componentDidMount() {
    this.chatBox.addEventListener('scroll', ::this.handleChatBoxScroll, true);
  }
  componentDidUpdate(prevProps) {
    if (
      ( prevProps.message.fetchNew.loading && !this.props.message.fetchNew.loading ) ||
      ( !prevProps.message.send.loading && this.props.message.send.loading ) ||
      this.state.isChatBoxScrollToBottom
    ) {
      ::this.handleScrollToBottom();
    }

    if ( prevProps.message.fetchNew.loading && !this.props.message.fetchNew.loading ) {
      this.setState({hasLoadedAllMessages: false});
    }

    if ( prevProps.message.fetchOld.loading && !this.props.message.fetchOld.loading ) {
      const {
        scrollPosition,
        oldestMessageQuery,
        oldestMessageOffsetTop
      } = this.state;
      const newOldestMessageOffsetTop = oldestMessageQuery.offsetTop;

      if (
        ( this.chatBox.scrollTop < 40 ||
        scrollPosition === this.chatBox.scrollTop ) &&
        oldestMessageQuery
      ) {
        this.chatBox.scrollTop = newOldestMessageOffsetTop - oldestMessageOffsetTop;
      }
    }

    if (
      ( prevProps.message.fetchNew.loading &&
        !this.props.message.fetchNew.loading &&
        this.props.message.all.length < 50 ) ||
      ( prevProps.message.fetchOld.loading &&
        !this.props.message.fetchOld.loading &&
        this.props.message.all.length - prevProps.message.all.length < 50 )
    ) {
      this.setState({hasLoadedAllMessages: true});
    }
  }
  handleScrollToBottom() {
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
  handleChatBoxScroll() {
    if ( this.chatBox.scrollTop === (this.chatBox.scrollHeight - this.chatBox.offsetHeight) ) {
      this.setState({isChatBoxScrollToBottom: true});
    } else {
      this.setState({isChatBoxScrollToBottom: false});
    }

    if ( this.chatBox.scrollTop < 40 ) {
      this.setState({isChatBoxScrollToTop: true});
      ::this.handleFetchOldMessages();
    } else {
      this.setState({isChatBoxScrollToTop: false});
    }
  }
  handleChatBoxRender() {
    const {
      user,
      typer,
      chatRoom,
      message
    } = this.props;
    const { hasLoadedAllMessages } = this.state;
    const isActiveUserAdmin = user.active.role === 'admin';

    if (chatRoom.all.length === 0) {
      return (
        <div className="user-no-chat-rooms">
          Hi! Welcome, create a Chat Room now.
        </div>
      )
    } else if ( !message.fetchNew.loading && message.fetchNew.success ) {
      return (
        <Container fluid>
          {
            !hasLoadedAllMessages &&
            <div className="loading-icon">
              <FontAwesomeIcon icon="spinner" size="2x" pulse />
            </div>
          }
          {
            message.all.length > 0
              ?
              message.all.map((singleMessage, i) =>
                <div key={singleMessage._id}>
                  <ChatDateTime
                    messageDate={singleMessage.createdAt}
                    previousMessageDate={i-1 !== -1 ? message.all[i-1].createdAt : ''}
                  />
                  <ChatBubble
                    index={i}
                    message={singleMessage}
                    isSender={(singleMessage.user._id === user.active._id) ? true : false }
                    previousMessageSenderID={i-1 !== -1 ? message.all[i-1].user._id : ''}
                    nextMessageSenderID={i !== message.all.length-1 ? message.all[i+1].user._id : ''}
                    previousMessageDate={i-1 !== -1 ? message.all[i-1].createdAt : ''}
                    nextMessageDate={i !== message.all.length-1 ? message.all[i+1].createdAt : ''}
                    handleImageLightboxToggle={::this.handleImageLightboxToggle}
                    handleAudioPlayingToggle={::this.handleAudioPlayingToggle}
                    isActiveUserAdmin={isActiveUserAdmin}
                    handleOpenModal={::this.handleOpenModal}
                  />
                </div>
              )
              :
              <div className="chat-no-messages">
                No messages in this Chat Room
              </div>
          }
          {
            typer.all.length > 0 &&
            <div className="chat-typers">
              {
                typer.all.map((singleTyper, i) =>
                  <ChatTyper
                    key={i}
                    typer={singleTyper}
                  />
                )
              }
            </div>
          }
        </Container>
      )
    } else {
      return (
        <LoadingAnimation name="ball-clip-rotate" color="black" />
      )
    }
  }
  handleImageLightboxRender() {
    const { message } = this.props;
    const {
      isImageLightboxOpen,
      imageIndex
    } = this.state;
    if ( !message.fetchNew.loading && message.fetchNew.success ) {
      const imagesArray = [];
      const imageMessages = message.all.filter(imageMessage =>
        imageMessage.messageType === 'image'
      );

      for (var i = 0; i < imageMessages.length; i++) {
        var imageMessage = imageMessages[i];

        imagesArray[i] = {
          id: imageMessage._id,
          src: imageMessage.fileLink
        };
      }

      return (
        <div>
          {
            isImageLightboxOpen &&
            <ChatImageLightBox
              images={imagesArray}
              imageIndex={imageIndex}
              handleImageLightboxToggle={::this.handleImageLightboxToggle}
              handlePrevImage={::this.handlePrevImage}
              handleNextImage={::this.handleNextImage}
            />
          }
        </div>
      )
    }
  }
  handleDragDropBoxRender() {
    const {
      handleDragDropBoxToggle,
      isDragDropBoxOpen
    } = this.props;

    if ( isDragDropBoxOpen ) {
      return (
        <ChatDragDropBox
          handleDragDropBoxToggle={handleDragDropBoxToggle}
          handleFilesDrop={::this.handleFilesDrop}
          handleSelectFile={::this.handleSelectFile}
        />
      )
    }
  }
  handleFetchOldMessages() {
    const {
      user,
      chatRoom,
      message,
      fetchOldMessages
    } = this.props;
    const {
      hasLoadedAllMessages,
      isChatBoxScrollToTop
    } = this.state;

    if ( !hasLoadedAllMessages && isChatBoxScrollToTop && !message.fetchOld.loading ) {
      const scrollPosition = this.chatBox.scrollTop;
      const oldestMessageQuery = document.querySelectorAll(".chat-box .chat-bubble-wrapper")[0];
      const oldestMessageOffsetTop = oldestMessageQuery.offsetTop;

      this.setState({
        scrollPosition: scrollPosition,
        oldestMessageQuery: oldestMessageQuery,
        oldestMessageOffsetTop: oldestMessageOffsetTop
      });

      fetchOldMessages(chatRoom.active.data._id, user.active._id, message.all.length);
    }
  }
  handleSendTextMessage(newMessageID, text) {
    const {
      user,
      chatRoom,
      sendTextMessage
    } = this.props;

    sendTextMessage(newMessageID, text, user.active, chatRoom.active.data._id);
  }
  handleImageLightboxToggle(messageID) {
    const { message } = this.props;
    var index = -1;

    const imageMessages = message.all.filter(imageMessage =>
      imageMessage.messageType === 'image'
    );

    for (var i = 0; i < imageMessages.length; i++) {
      var imageMessage = imageMessages[i];

      if (imageMessage._id === messageID) {
        index = i;
        break;
      }
    }

    this.setState({
      isImageLightboxOpen: !this.state.isImageLightboxOpen,
      imageIndex: index
    });
  }
  handlePrevImage(imageIndex) {
    this.setState({imageIndex: imageIndex});
  }
  handleNextImage(imageIndex) {
    this.setState({imageIndex: imageIndex});
  }
  handleSendFileMessage(newMessageID, text, file) {
    const {
      user,
      chatRoom,
      sendFileMessage
    } = this.props;

    sendFileMessage(newMessageID, text, file, user.active, chatRoom.active.data._id);
  }
  handleFilesDrop(acceptedFiles, rejectedFiles) {
    const { handleDragDropBoxToggle } = this.props;

    if ( rejectedFiles.length > 0 ) {
      Popup.alert('Maximum file size upload is 2MB only');
    } else {
      handleDragDropBoxToggle();

      for (var i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const newMessageID = uuidv4();
        const fileName = file.name;

        ::this.handleSendFileMessage(newMessageID, fileName, file);
      }
    }
  }
  handleSelectFile(fileName, file) {
    const { handleDragDropBoxToggle } = this.props;
    const newMessageID = uuidv4();

    if ( file.size > 1024 * 1024 * 2 ) {
      Popup.alert('Maximum file size upload is 2MB only');
    } else {
      handleDragDropBoxToggle();
      ::this.handleSendFileMessage(newMessageID, fileName, file);
    }
  }
  handleAudioPlayingToggle(audioPlayingIndex) {
    const { audioIndex } = this.state;

    if ( audioIndex > -1 && audioIndex !== audioPlayingIndex ) {
      var previousAudio = document.getElementsByClassName('react-plyr-' + audioIndex)[0];

      if (
        previousAudio.currentTime > 0  &&
        !previousAudio.paused &&
        !previousAudio.ended &&
        previousAudio.readyState > 2
      ) {
        previousAudio.pause();
      }
    }

    this.setState({audioIndex: audioPlayingIndex});
  }
  handleOpenModal(selectedMessageID) {
    this.setState({
      isModalOpen: true,
      selectedMessageID: selectedMessageID
    });
  }
  handleCloseModal() {
    this.setState({
      isModalOpen: false,
      selectedMessageID: ''
    });
  }
  render() {
    const {
      user,
      typer,
      chatRoom,
      message,
      isTyping,
      isNotTyping
    } = this.props;
    const {
      isModalOpen,
      selectedMessageID
    } = this.state;

    return (
      <div
        className={"chat-box " + (message.fetchNew.loading ? 'loading' : '')}
        ref={(element) => { this.chatBox = element; }}
      >
        {::this.handleChatBoxRender()}
        {::this.handleImageLightboxRender()}
        {::this.handleDragDropBoxRender()}
        {
          isModalOpen &&
          <DeleteMessageModal
            isModalOpen={isModalOpen}
            selectedMessageID={selectedMessageID}
            handleCloseModal={::this.handleCloseModal}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    typer: state.typer,
    chatRoom: state.chatRoom,
    message: state.message
  }
}

ChatBox.propTypes = {
  handleDragDropBoxToggle: PropTypes.func.isRequired,
  isDragDropBoxOpen: PropTypes.bool
}

ChatBox.defaultProps = {
  isDragDropBoxOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBox);
