import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { ServerToolTip } from "./ServerToolTip";
import { useRef, useState } from "react";

export function Server({ sId }) {
  const imgRef = useRef();
  const server = useSelector((state) => state.servers[sId]);
  const [isHover, setIsHover] = useState(false);
  const userStore = useSelector((state) => state.session.user);
  const { serverId } = useParams()

  if (!server) return false;
  const history = useHistory();
  const handleClick = (e) => {
    e.preventDefault();
    history.push(`/${server.id}/${server.channels[0].id}`);
  };
  return (
    <>
      {server.owner.id == userStore.id ||
      server.users.map((user) => user.id == userStore.id) ? (
        <div
          className="server__container"
          onClick={handleClick}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="server__img-container" ref={imgRef}>
            {parseInt(serverId) === server?.id ? (
              <img
                style={{ width: "3rem", height: "3rem", border: "2px solid white"}}
                className="serverlist-icon .tooltip-container"
                src={server.avatar}
                alt=""
              />
            ) : (
              <img
                style={{ width: "3rem", height: "3rem" }}
                className="serverlist-icon .tooltip-container"
                src={server.avatar}
                alt=""
              />
            ) }
            {isHover && (
              <ServerToolTip serverName={server.name} parentRef={imgRef} />
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
