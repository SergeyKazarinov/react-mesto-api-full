import React, { useRef, useState, useEffect } from "react";
import Popup from "./Popup";
import PopupWithForm from "./PopupWithForm";
import FieldSet from "../Fieldset";
import useFormValidation from "../../hooks/useFormValidation";

function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const linkInputRef = useRef();
  const nameInputRef = useRef();
  const [buttonSubmitName, setButtonSubmitName] = useState('Создать');
  const {isButtonValid, handleTheFirstInputChange, handleTheSecondInputChange, resetValid} = useFormValidation(nameInputRef, linkInputRef);


  useEffect(() => {
    nameInputRef.current.value='';
    linkInputRef.current.value='';
    resetValid();
    setButtonSubmitName('Создать')
  }, [isOpen])

  function handleSubmit(e) {
    e.preventDefault();
    setButtonSubmitName('Сохранение...')
    onAddPlace({
      link: linkInputRef.current.value,
      name: nameInputRef.current.value
    });
  }

  return(
    <Popup 
      name="add-image"
      nameContainer="popup__container"
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopupWithForm 
        name="add-image" 
        title="Новое место" 
        titleBtn={buttonSubmitName}
        onSubmit={handleSubmit}
        isValid={isButtonValid}
      >
        <FieldSet 
          inputType="text"
          inputClassType="place"
          placeholder="Название"
          id="input-name"
          minLength="2"
          maxLength="30"
          inputRef={nameInputRef}
          onChange={handleTheFirstInputChange}
          isOpen={isOpen}
        />

        <FieldSet 
          inputType="url"
          inputClassType="link"
          placeholder="Ссылка на картинку"
          id="input-link"
          inputRef={linkInputRef}
          onChange={handleTheSecondInputChange}
          isOpen={isOpen}
        />
      </PopupWithForm>
    </Popup>
  )
}

export default AddPlacePopup;