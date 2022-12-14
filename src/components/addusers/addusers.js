import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase-config';

import UsersAction from '../../actions/usersAction';
import WorkSpaceAction from '../../actions/workspaceAction';
import CardsAction from '../../actions/cardsAction';
import AvatarUtils from '../../utils/avatarUtils';

import checkImage from '../../resources/check.png';
import removeImage from '../../resources/remove.png';

import './addusers.scss';

export default function AddUsers({ workspaceId, card, setCurrentCard, setAddUser }) {
    const [users, setUsers] = useState([]);
    const [workspace, setWorkspace] = useState([]);
    const [search, setSearch] = useState('');
    const [newUser, setNewUser] = useState('');
    useEffect(() => {
        WorkSpaceAction.getWorkSpace(workspaceId).then((ws) => {
            setWorkspace(ws);
            UsersAction.getWorkspaceUsers(ws.users, setUsers);
        });
    }, [workspaceId]);
    async function addUserInCard(email, name) {
        if (card.users.filter((cardUser) => cardUser === email).length === 0) {
            card.users.push(email);
            await CardsAction.addUserInCard(email, card, name, workspaceId);
            setCurrentCard(card);
        } else {
            card.users = card.users.filter((cardUser) => cardUser !== email);
            await CardsAction.removeUserFromCard(email, card, name, workspaceId);
            setCurrentCard(card);
        }
    }
    function closeAddUsers(e) {
        if (e.target.className === 'close-add-users-container') {
            setAddUser(false);
        }
    }
    async function addNewUserInWorkSpace() {
        const userExist = await UsersAction.userExist(newUser);
        if (userExist) {
            if (!workspace.users.includes(newUser)) {
                workspace.users.push(newUser);
                users.push(userExist);
                setUsers(users);
                await WorkSpaceAction.updateWorkspaceUsers(workspace.id, workspace.users);
                setNewUser('');
            }
        } else {
            console.error('???????????????????????? ???? ????????????????????');
        }
    }
    async function removeUserFormWorkSpace(email) {
        workspace.users = workspace.users.filter((user) => user !== email);
        setUsers(users.filter((user) => user.email !== email));
        await WorkSpaceAction.updateWorkspaceUsers(workspace.id, workspace.users);
    }
    return card ? (
        <div className="close-add-users-container" onClick={(e) => closeAddUsers(e)}>
            <div className="add-users-container">
                <input
                    className="add-users-search"
                    type="text"
                    placeholder="??????????"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
                {search === ''
                    ? users.map((user) => {
                          return (
                              auth.currentUser.email !== user.email && (
                                  <div
                                      onClick={() => {
                                          addUserInCard(user.email, user.name);
                                      }}
                                      className="add-user"
                                      key={user.id}>
                                      {user.avatarURL ? (
                                          <img
                                              className="card-modal-history-move-creator-avatar"
                                              src={user.avatarURL}
                                              alt="avatar"
                                          />
                                      ) : (
                                          <div className="avatar-replacer">
                                              {AvatarUtils.getAvatarReplacerText(
                                                  user.displayName,
                                                  user.email,
                                              )}
                                          </div>
                                      )}
                                      <div className="add-user__info">
                                          {user.displayName
                                              ? user.displayName + '<' + user.email + '>'
                                              : user.email}
                                          {card.users.filter((cardUser) => cardUser === user.email)
                                              .length > 0 && (
                                              <img
                                                  className="user-check"
                                                  src={checkImage}
                                                  alt="avatar"
                                              />
                                          )}
                                      </div>
                                  </div>
                              )
                          );
                      })
                    : users
                          .filter(
                              (user) =>
                                  (user.displayName &&
                                      user.displayName
                                          .toLowerCase()
                                          .includes(search.toLowerCase())) ||
                                  (user.email &&
                                      user.email.toLowerCase().includes(search.toLowerCase())),
                          )
                          .map((user) => (
                              <div
                                  onClick={() => {
                                      addUserInCard(user.email, user.name);
                                  }}
                                  className="add-user"
                                  key={user.id}>
                                  {user.avatarURL ? (
                                      <img
                                          className="card-modal-history-move-creator-avatar"
                                          src={user.avatarURL}
                                          alt="avatar"
                                      />
                                  ) : (
                                      <div className="avatar-replacer">
                                          {AvatarUtils.getAvatarReplacerText(
                                              user.displayName,
                                              user.email,
                                          )}
                                      </div>
                                  )}
                                  <div className="add-user__info">
                                      {user.displayName
                                          ? `${user.displayName}<${user.email}>`
                                          : user.email}
                                      <img className="user-check" src={checkImage} alt="avatar" />
                                  </div>
                              </div>
                          ))}
            </div>
        </div>
    ) : (
        <div className="close-add-users-container" onClick={(e) => closeAddUsers(e)}>
            <div className="add-users-container__menu">
                <div className="add-users__input">
                    <div className="add-users__input-search">
                        <input
                            type="text"
                            placeholder="?????????? ???????????? ????????????????????????"
                            value={newUser}
                            onChange={(e) => {
                                setNewUser(e.target.value);
                            }}
                        />
                        <input
                            type="button"
                            value="????????????????"
                            onClick={() => addNewUserInWorkSpace()}
                        />
                    </div>
                    <input
                        className="add-users__input-search-text"
                        type="text"
                        placeholder="??????????"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                {search === ''
                    ? users.map((user) => {
                          return (
                              auth.currentUser.email !== user.email && (
                                  <div className="add-user" key={user.id}>
                                      {user.avatarURL ? (
                                          <img
                                              className="card-modal-history-move-creator-avatar"
                                              src={user.avatarURL}
                                              alt="avatar"
                                          />
                                      ) : (
                                          <div className="avatar-replacer">
                                              {AvatarUtils.getAvatarReplacerText(
                                                  user.displayName,
                                                  user.email,
                                              )}
                                          </div>
                                      )}
                                      <div className="add-user__info">
                                          {user.displayName
                                              ? user.displayName + '<' + user.email + '>'
                                              : user.email}
                                          <img
                                              onClick={() => removeUserFormWorkSpace(user.email)}
                                              className="user-check"
                                              src={removeImage}
                                              alt="avatar"
                                          />
                                      </div>
                                  </div>
                              )
                          );
                      })
                    : users
                          .filter(
                              (user) =>
                                  (user.displayName &&
                                      user.displayName
                                          .toLowerCase()
                                          .includes(search.toLowerCase())) ||
                                  (user.email &&
                                      user.email.toLowerCase().includes(search.toLowerCase())),
                          )
                          .map((user) => {
                              return (
                                  auth.currentUser.email !== user.email && (
                                      <div className="add-user" key={user.id}>
                                          {user.avatarURL ? (
                                              <img
                                                  className="card-modal-history-move-creator-avatar"
                                                  src={user.avatarURL}
                                                  alt="avatar"
                                              />
                                          ) : (
                                              <div className="avatar-replacer">
                                                  {AvatarUtils.getAvatarReplacerText(
                                                      user.displayName,
                                                      user.email,
                                                  )}
                                              </div>
                                          )}
                                          <div className="add-user__info">
                                              {user.displayName
                                                  ? user.displayName + '<' + user.email + '>'
                                                  : user.email}
                                              <img
                                                  onClick={() =>
                                                      removeUserFormWorkSpace(user.email)
                                                  }
                                                  className="user-check"
                                                  src={removeImage}
                                                  alt="avatar"
                                              />
                                          </div>
                                      </div>
                                  )
                              );
                          })}
            </div>
        </div>
    );
}
