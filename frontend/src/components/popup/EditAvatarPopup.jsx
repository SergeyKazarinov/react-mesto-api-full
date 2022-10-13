import React, {useEffect, useRef, useState} from "react";
import PopupWithForm from "./PopupWithForm";
import FieldSet from "../Fieldset";
import Popup from "./Popup";

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const inputRef = useRef();
  const [isLinkValid, setIsLinkValid] = useState (false);
  const [isButtonValid, setIsButtonValid] = useState (false);
  const [buttonSubmitName, setButtonSubmitName] = useState('Сохранить')

  useEffect(() => {
    inputRef.current.value='';
    setIsLinkValid(false);
    setButtonSubmitName('Сохранить')
  }, [isOpen])

  useEffect(() => {
    setIsButtonValid(isLinkValid);
  }, [isLinkValid]);

  function handleClick(e) {
    e.preventDefault();
    setButtonSubmitName('Сохранение...')
    onUpdateAvatar(inputRef.current.value);
    inputRef.current.value='';
  }

  function handleLinkChange() {
    if(inputRef.current.validity.valid) {
      setIsLinkValid(true);
    }
    else {
      setIsLinkValid(false);
    }
  }

  return(
    <Popup 
      name="avatar"
      nameContainer="popup__container"
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopupWithForm 
        name="avatar"
        title="Обновить аватар" 
        titleBtn={buttonSubmitName}
        onSubmit={handleClick}
        isValid={isButtonValid}
      >
        <FieldSet 
          inputType="url"
          inputClassType="link"
          placeholder="Ссылка на картинку"
          id="input-avatar"
          inputRef={inputRef}
          isOpen={isOpen}
          onChange={handleLinkChange}
        />
      </PopupWithForm>
    </Popup>
  )
}

export default EditAvatarPopup;