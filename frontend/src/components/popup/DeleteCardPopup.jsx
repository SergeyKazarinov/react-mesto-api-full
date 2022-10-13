import React from "react";
import PopupWithForm from "./PopupWithForm";
import Popup from "./Popup";

function DeleteCardPopup({isOpen, onClose, onSubmit, card}) {
  
  function handleClick(e) {
    e.preventDefault();
    onSubmit(card);
  }
  
  return(
    <Popup 
      name="delete"
      nameContainer="popup__container"
      isOpen={isOpen}
      onClose={onClose}
    >
      <PopupWithForm 
        name="delete" 
        title="Вы уверены?" 
        titleBtn="Да"
        onSubmit={handleClick}
        isValid={true}
      />
    </Popup>
  )
}

export default DeleteCardPopup;