import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-responsive-modal';
import {
  Form,
  Button
} from 'muicss/react';
import mapDispatchToProps from '../../../actions';
import ChatRoomNameInput from '../../../components/CreateChatRoomModal/ChatRoomNameInput';
import ChatMember from '../../../components/CreateChatRoomModal/ChatMember';
import ChatMemberSelect from '../../../components/CreateChatRoomModal/ChatMemberSelect';
import ErrorCard from '../../../components/AuthForm/Card/ErrorCard';
import './styles.scss';

class CreateChatRoomModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatRoomName: '',
      members: [this.props.user.active]
    }
  }
  componentDidUpdate(prevProps) {
    if ( prevProps.chatRoom.isCreating && this.props.chatRoom.isCreatingSuccess ) {
      const {
        handleCloseModal,
        handleLeftSideDrawerToggleEvent
      } = this.props;

      handleCloseModal();
      handleLeftSideDrawerToggleEvent();
    }
  }
  onChatRoomNameChange(event) {
    event.preventDefault();

    this.setState({chatRoomName: event.target.value});
  }
  onSuggestionSelected(event, suggestion) {
    event.preventDefault();

    const { members } = this.state;
    const selectedMember = suggestion.suggestion;

    if (members.some((singleMember) => singleMember._id === selectedMember._id)) {
      this.setState({
        members: [
          ...members.filter((singleMember) => singleMember._id !== selectedMember._id)
        ]
      });
    } else {
      this.setState({
        members: [
          ...members.filter((singleMember) => singleMember._id !== selectedMember._id),
          selectedMember
        ]
      });
    }
  }
  handleDeselectMember(member) {
    const { members } = this.state;

    this.setState({
      members: [
        ...members.filter((singleMember) => singleMember._id !== member._id)
      ]
    });
  }
  handleAddGroupChatRoom(event) {
    event.preventDefault();

    const {
      user,
      chatRoom,
      createGroupChatRoom
    } = this.props;
    const {
      chatRoomName,
      members
    } = this.state;
    const activeChatRoom = chatRoom.active;

    if ( chatRoomName.length > 0 && members.length > 2 ) {
      createGroupChatRoom(chatRoomName, members, user.active._id, activeChatRoom.data._id);
    }
  }
  render() {
    const {
      user,
      chatRoom,
      searchUser,
      isModalOpen,
      handleCloseModal
    } = this.props;
    const {
      chatRoomName,
      members
    } = this.state;
    const modalClassNames = {
      modal: "modal add-chat-room-modal",
      closeButton: "close-button"
    };
    const isSubmitButtonDisabled =
      chatRoomName.length === 0 ||
      members.length < 3 ||
      chatRoom.isCreating;

    return (
      <Modal
        classNames={modalClassNames}
        open={isModalOpen}
        onClose={handleCloseModal}
        center
      >
        <Form onSubmit={::this.handleAddGroupChatRoom}>
          <div className="modal-header">
            <h3 className="modal-title">Add Chat Room</h3>
          </div>
          <div className="modal-body">
            {
              !chatRoom.isCreating &&
              !chatRoom.isCreatingSuccess &&
              <ErrorCard label="Error! Please try again" />
            }
            <ChatRoomNameInput
              onChatRoomNameChange={::this.onChatRoomNameChange}
              isDisabled={chatRoom.isCreating}
            />
            <div className="members-list-label">
              Select at least 3 members
            </div>
            <div className="members-list" disabled={chatRoom.isCreating}>
              {
                members.map((member, i) =>
                  <ChatMember
                    key={i}
                    index={i}
                    member={member}
                    handleDeselectMember={::this.handleDeselectMember}
                  />
                )
              }
            </div>
            <ChatMemberSelect
              searchedUsers={user.search}
              handleSearchUser={searchUser}
              onSuggestionSelected={::this.onSuggestionSelected}
              isDisabled={chatRoom.isCreating}
            />
          </div>
          <div className="modal-footer">
            <Button
              className="button button-default"
              variant="raised"
              onClick={handleCloseModal}
              disabled={chatRoom.isCreating}
            >
              Cancel
            </Button>
            <Button
              className="button button-primary"
              type="submit"
              variant="raised"
              disabled={isSubmitButtonDisabled}
            >
              Add
            </Button>
          </div>
        </Form>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    chatRoom: state.chatRoom
  }
}

CreateChatRoomModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleCloseModal: PropTypes.func.isRequired,
  handleLeftSideDrawerToggleEvent: PropTypes.func.isRequired
}

CreateChatRoomModal.defaultProps = {
  isModalOpen: false
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateChatRoomModal);
