import dayjs from "dayjs";

export function ChannelMessage({ message, user }) {
  if (!user) return false;
  return (
    <div className='channel-message__container'>
      <div className='channel-message__avatar-container'>
        <img src={user?.avatar || ""} alt='' />
      </div>
      <div className='channel-message__info'>
        <header className='channel-message__info__header'>
          <span>{user.username}</span>
          <span className='channel-message__info__header__date'>
            {dayjs(message.created_at).format("DD/MM/YYYY hh:mm A")}
          </span>
        </header>
        <p className='channel-message__info__content'>{message.content}</p>
      </div>
    </div>
  );
}