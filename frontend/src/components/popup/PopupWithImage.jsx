import React from "react";

function PopupWithImage({card}) {
  return(
      <>
        <img 
          className="popup__image"
          src={card.link}
          alt={card.name}
        />
        <h2 className="popup__text">{card.name}</h2>
      </>
  );
}
export default PopupWithImage;