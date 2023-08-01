import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { thunkCreateServer } from "../../store/server";
import "../../styles/components/CreateServerModal.css";

function CreateServerModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.session.user);

  const [name, setName] = useState(`${user.username}'s server`);
  const [avatar, setAvatar] = useState();
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newServerForm = new FormData();
    newServerForm.append("name", name);
    newServerForm.append("owner_id", user.id);
    if (avatar) {
      newServerForm.append("file", avatar);
    }

    const data = await dispatch(thunkCreateServer(newServerForm));
    if (data.errors) {
      console.log("hello");
      setErrors(data.errors);
    } else {
      closeModal();
      console.log("this is the data", data);
      // add push to new server link
      history.push(`/${data.id}/${data.channels[0].id}`);
    }
  };

  // console.log('hello')
  return (
    <div className='create-server_form_container'>
      <form onSubmit={handleSubmit} className='server_form'>
        <div className='server_form-title'>
          <h2>Customize your server</h2>
          <p>
            Give your new server a personality with a name and an icon. You can
            always change it later.
          </p>
          <input
            type='file'
            onChange={(e) => {
              if (e.target.files[0]) {
                const file = e.target.files[0];
                if (file.type.substring("image/")) {
                  setAvatar(file);
                }
              }
            }}
          />
        </div>
        <label>
          SERVER NAME
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className='errors'>{errors.name}</p>
        </label>
        <div className='server_form-btns'>
          <p>Back</p>
          <button type='submit'>Create</button>
        </div>
      </form>
    </div>
  );
}

export default CreateServerModal;
