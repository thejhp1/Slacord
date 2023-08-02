import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModal } from "../../context/Modal";
import { thunkDeleteSingleServer } from "../../store/singleServer";
import { thunkDeleteChannel } from "../../store/singleServer";
import "../../styles/components/DeleteModal.css";

function DeleteModal({ type, cId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory()
  const state= useSelector((state) => state);
  let word = "";

  function handleSubmit() {
    if (type === "server") {
      dispatch(thunkDeleteSingleServer(state.singleServer.id));
      closeModal();
      history.push("/@")
    } else if (type === "channel") {
      dispatch(thunkDeleteChannel(cId))
      closeModal();
      window.location.reload();
      history.push(`/${state.singleServer.id}/${state.singleServer.channels.orderedChannelsList[0]}`)
    }
  }

  if (type === 'channel') {
    word = '#' + state.singleServer.channels[cId].name
  } else {
    word = state.singleServer.name
  }

  return (
    <div className="delete-modal-container">
      <h2>Delete {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <p>Are you sure you want to delete <span>{word}</span>? This cannot be undone</p>
      <button className="delete-modal-button-no" onClick={closeModal}>
        Cancel
      </button>
      <button
        className="delete-modal-button-yes"
        onClick={() => handleSubmit()}
      >
        Delete {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    </div>
  );
}

export default DeleteModal;
