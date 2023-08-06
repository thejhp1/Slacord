import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import "../../styles/components/ChannelMessageList.css";
import { ChannelMessage } from "./ChannelMessage";
import {
  deleteSingleChannelMessage,
  updateChannelMessages,
} from "../../store/singleServer";
export function ChannelMessageList({ socket }) {
  const { channelId, serverId } = useParams();
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    if (!socket) return;
    socket.on(`server-channel-messages-${serverId}`, (data) => {
      dispatch(updateChannelMessages(data));
    });
    socket.on(`server-channel-messages-delete-${serverId}`, (data) => {
      const { messageId, channelId } = data;
      dispatch(deleteSingleChannelMessage(channelId, messageId));
    });
    socket.on(`server-channel-${channelId}-user-typing`, (data) => {
      if (data.typing === true) {
        setUsersTyping((prev) =>
          data.username === user.username ? [...prev] : [...prev, data.username]
        );
      } else {
        setUsersTyping((prev) =>
          prev.filter((username) => username !== data.username)
        );
      }
    });
    return () => {
      socket.off(`server-channel-messages-${serverId}`);
      socket.off(`server-channel-messages-delete-${serverId}`);
      socket.off(`server-channel-${channelId}-user-typing`);
    };
  }, [serverId, socket]);
  const [usersTyping, setUsersTyping] = useState([]);
  const users = useSelector((state) => state.singleServer?.users);
  const channel = useSelector(
    (state) => state.singleServer?.channels[channelId]
  );

  const server = useSelector((state) => state.singleServer);
  const messages = useSelector((state) => {
    if (state.singleServer.selectedChannelId) {
      if (state.singleServer.channels[state.singleServer.selectedChannelId])
        return state.singleServer?.channels[
          state.singleServer.selectedChannelId
        ].messages;
    }
    return [];
  });
  const dispatch = useDispatch();
  if (!socket) return false;

  return (
    <div className='channel-message-list__container'>
      <div className='message__container'>
        <h3 className='channel-message-list__container-title'>
          Welcome to #{channel ? channel.name : ""}!
        </h3>
        {users &&
          messages.map((msg, i) => {
            const user = users.find((usr) => usr.id == msg.user_id);
            return (
              <>
                <ChannelMessage
                  key={i}
                  message={msg}
                  user={user}
                  socket={socket}
                />
              </>
            );
          })}
      </div>
      {usersTyping.length > 0 && (
        <div className='users-typing'>
          {usersTyping.length > 3
            ? "Several people are typing..."
            : usersTyping.join(", ") + " is typing..."}
        </div>
      )}
    </div>
  );
}
