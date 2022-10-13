import React, {useState, useEffect} from "react";
import {CurrentUserContext} from '../context/CurrentUserContext';
import { Route, Switch, withRouter } from 'react-router-dom';
import api from "../utils/Api";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from './popup/EditProfilePopup';
import EditAvatarPopup from './popup/EditAvatarPopup'
import AddPlacePopup from "./popup/AddPlacePopup";
import DeleteCardPopup from "./popup/DeleteCardPopup";
import Popup from "./popup/Popup";
import PopupWithImage from "./popup/PopupWithImage";
import ProtectedRoute from "./ProtectedRoute";
import Register from './Register';
import Login from './Login';
import InfoTooltip from './popup/InfoTooltip';
import { getUserData, authorize, register } from "../utils/auth"; // На самом деле странно, что на gitHub он не 
import AcceptRegist from '../images/Accept-registration.png';     // запушился измененный, поскольку я переименовал файл после первой итерации
import RejectRegist from '../images/rejectRegistration.png'


function App({history}) {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectCard] = useState({});
  const [currentUser, setCurrentUser] = useState({name: '', about: ''});
  const [cards, setCards] = useState([]);
  const [cardToBeDeleted, setCardToBeDeleted] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [imageForInfoTooltip, setImageForInfoTooltip] = useState('');
  const [textForInfoTooltip, setTextForInfoTooltip] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserEmail(token);
    }
  }, []);

  useEffect(() => {
    if(loggedIn){
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userInfo, initialCards]) => {
          setCurrentUser(userInfo);
          setCards(initialCards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn])

  const getUserEmail = async (token) => {
    try{
      const res = await getUserData(token);
      if(res.data.email) {
        setUserEmail(res.data.email);
        setLoggedIn(true);
        history.push('/')
      } else {
        localStorage.removeItem('token')
        setLoggedIn(false);
      }
    } catch {
      console.error("Ошибка");
    }
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleDeleteCardClick(card) {
    setCardToBeDeleted(card);
    setIsDeleteCardPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectCard(card);
    setIsImagePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsImagePopupOpen(false);
  }

  function handleUpdateUser(userData) {
    api.patchUserInfo(userData)
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
      });
  }

  function handleUpdateAvatar(avatarLink) {
    api.patchAvatarInfo(avatarLink)
    .then((res) => {
      setCurrentUser(res);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      closeAllPopups();
    });
  }

  function handleAddPlaceSubmit(newCard) {
    api.addNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
      });
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    if(isLiked) {
      api.deleteLike(card)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      api.setLike(card)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleCardDelete(card) {
    api.deleteCard(card)
      .then(() => {
        setCards((cards) => {
          return cards.filter(item => item !== card);
        })
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
      });
  }

  const handleSignOut = () => {
    if(localStorage.getItem('token')) {
      localStorage.removeItem('token')
      setLoggedIn(false);
      setUserEmail('');
    }
  }

  const handleSignIn = async ({email, password}) => {
    try{
      const res = await authorize(email, password);
      localStorage.setItem('token', res.token);
      setUserEmail(email);
      setLoggedIn(true);
      history.push('/');
    } catch {
      setIsInfoTooltipPopupOpen(true);
      setImageForInfoTooltip(RejectRegist);
      setTextForInfoTooltip("Неверный Email или пароль");
    }
  }

  const handleRegistration = async ({email, password}) => {
    try{
      const res = await register(email, password);
      setIsInfoTooltipPopupOpen(true);
      setImageForInfoTooltip(AcceptRegist);
      setTextForInfoTooltip("Вы успешно зарегистрировались!");
      handleSignIn(email, password);
      setLoggedIn(true);
      history.push('/')
    } catch {
      setIsInfoTooltipPopupOpen(true);
      setImageForInfoTooltip(RejectRegist);
      setTextForInfoTooltip("Что-то пошло не так! Попробуйте ещё раз.");
    }
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <ProtectedRoute 
            exact path="/" 
            loggedIn={loggedIn} 
          >
            <Header linkTitle="Выйти" link="/sign-in" onSignOut={handleSignOut} email={userEmail} loggedIn={loggedIn}/>
            <Main 
                onEditProfile={handleEditProfileClick} 
                onAddPlace={handleAddPlaceClick} 
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteCardClick}
              />
            <Footer />
          </ProtectedRoute>
          <Route path="/sign-up">
            <Register onRegistration={handleRegistration} loggedIn={loggedIn}/>
          </Route>
          <Route path="/sign-in">
            <Login onLogIn={handleSignIn} loggedIn={loggedIn}/>
          </Route>
        </Switch>

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        /> 

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup 
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <DeleteCardPopup
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
          card={cardToBeDeleted}
        />

        <Popup
          name="image-zoom"
          nameContainer="popup__container-image"
          isOpen={isImagePopupOpen}
          onClose = {closeAllPopups}
        >
          <PopupWithImage 
            card={selectedCard} 
          />
        </Popup>
        
        <Popup
          name="info"
          nameContainer="popup__container-info"
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
        >
          <InfoTooltip 
            image={imageForInfoTooltip}
            text={textForInfoTooltip}
          />
        </Popup>
      </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
