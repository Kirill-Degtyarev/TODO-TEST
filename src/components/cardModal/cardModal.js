import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase-config';

import CardHistoryAction from '../../actions/cardHistoryAction';
import TaskListAction from '../../actions/taskListAction';
import CardsAction from '../../actions/cardsAction';
import AvatarUtils from '../../utils/avatarUtils';
import TaskList from '../tasklist/tasklist';
import AddTags from '../addtags/addtags';
import AddUsers from '../addusers/addusers';
import Loader from '../loader/loader';
import { RemoveModal } from '../removeModal/removeModal';

import fileImage from '../../resources/file.png';
import filesImage from '../../resources/files.png';

import './cardModal.scss';

export default function CardModal({
    workSpaceId,
    tags,
    card,
    setOpenCardModal,
    setCurrentCard,
    setDraggableBoard,
    boards,
    overdue,
}) {
    const [commentText, setCommentText] = useState('');
    const [commentFiles, setCommentFiles] = useState([]);
    const [history, setHistory] = useState([]);
    const [editName, setEditName] = useState(false);
    const [editCaption, setEditCaption] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [addDate, setAddDate] = useState(false);
    const [addDateValue, setAddDateValue] = useState(null);
    const [addTaskList, setAddTaskList] = useState(false);
    const [addTags, setAddTags] = useState(false);
    const [addUsers, setAddUsers] = useState(false);
    const [isRemovable, setIsRemovable] = useState(false);
    const [moveInBoard, setMoveInBoard] = useState(false);
    const formatter = new Intl.DateTimeFormat('ru', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    useEffect(() => {
        CardHistoryAction.getHistory(setHistory, card.id);
        TaskListAction.getTaskList(card.id, setTaskList);
    }, [card.id]);

    function resizeTextArea(e) {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    function changeCommentText(e) {
        resizeTextArea(e);
        setCommentText(e.target.value);
    }

    function addAttachementActive() {
        const inputFile = document.getElementById('add-attachement');
        inputFile.click();
    }

    function addAttachement(e) {
        const files = e.target.files;
        commentFiles.push(files[0]);
        setCommentFiles(commentFiles);
    }

    function saveComment() {
        if (commentText !== '' || commentFiles.length > 0) {
            let comment = [];

            if (commentFiles.length > 0) {
                comment.push({ text: null });
                comment.push({
                    files: commentFiles.map((file) => {
                        return { name: file.name, file: file };
                    }),
                });
            }
            if (commentText !== '') {
                if (comment.length === 0) {
                    comment.push({ text: commentText });
                } else {
                    comment[0].text = commentText;
                }
            }
            CardHistoryAction.addHistroy('comment', null, comment, card);
            setCommentText('');
            setCommentFiles([]);
            const commentDiv = document.getElementById('comment');
            commentDiv.style.height = '30px';
        }
    }

    function openImage(url) {
        window.open(url);
    }

    function closeCardModal(e) {
        if (e.target.className === 'card-modal-container') {
            setOpenCardModal(false);
            setCurrentCard(null);
            setDraggableBoard(true);
        }
    }

    async function endEditNameOrCaption(e, card, property) {
        if (property === 'name') {
            const newCardName = e.target.value;
            if (newCardName !== card.name) {
                if (newCardName !== '') {
                    await CardsAction.updateCardName(newCardName, card.id);
                    card.name = newCardName;
                    setCurrentCard(card);
                }
            }
            setEditName(false);
        } else {
            const newCardCaption = e.target.value;
            if (newCardCaption !== card.caption) {
                await CardsAction.updateCardCaption(newCardCaption, card.id);
                card.caption = newCardCaption;
                setCurrentCard(card);
            }
            setEditCaption(false);
        }
    }

    async function updateCardDate(e, cardDate) {
        if (cardDate.toISOString().substring(0, 16) !== e.target.value) {
            const newDate = new Date(e.target.value);
            await CardsAction.updateCardDate(newDate, card, workSpaceId);
        }
    }

    async function addCardDate() {
        if (addDate) {
            const newDate = new Date(addDateValue);
            await CardsAction.updateCardDate(newDate, card, workSpaceId);
            card.date = new Date(newDate.setHours(newDate.getHours() + 3));
            setCurrentCard(card);
            setAddDate(false);
        }
    }

    function changeAddDate() {
        const date = new Date();
        date.setHours(date.getHours() + 3);
        setAddDateValue(date.toISOString().substring(0, 16));
        setAddDate(true);
    }

    async function deleteTaskList() {
        TaskListAction.deleteCardTasks(taskList);
        setAddTaskList(false);
    }

    async function deleteDate() {
        setAddTaskList(false);
        await CardsAction.updateCardDate(null, card, workSpaceId);
        card.date = null;
        setCurrentCard(card);
        setAddDate(false);
    }

    async function joinInCard() {
        card.users.push(auth.currentUser.email);
        setCurrentCard(card);
        await CardsAction.joinInCard(card, workSpaceId);
    }

    async function unsubscribeFromCard() {
        card.users = card.users.filter((user) => user !== auth.currentUser.email);
        setCurrentCard(card);
        await CardsAction.unsubscribeFromCard(card, workSpaceId);
    }

    async function removeCard() {
        await CardsAction.deleteCard(card);
        setCurrentCard(null);
        setDraggableBoard(true);
        setOpenCardModal(false);
    }

    async function moveToBoard(boardId) {
        card.boardId = boardId;
        let cardsInBoard = await CardsAction.getBoardCard(boardId);
        cardsInBoard = cardsInBoard.sort((a, b) => {
            return a.sortIndex - b.sortIndex;
        });
        card.sortIndex =
            cardsInBoard.length > 0 ? cardsInBoard[cardsInBoard.length - 1].sortIndex + 1 : 1;
        await CardsAction.moveCard(card);
        setCurrentCard(card);
    }

    return (
        <div
            className="card-modal-container"
            onClick={(e) => {
                closeCardModal(e);
            }}>
            {isRemovable ? (
                <RemoveModal
                    setIsRemovable={setIsRemovable}
                    removeFunction={removeCard}
                    type={'card'}
                />
            ) : (
                ''
            )}
            <div className="card-modal" draggable={false}>
                <div className="card-modal__body">
                    <div className="card-modal__info">
                        <div className="card-modal-name" onClick={() => setEditName(true)}>
                            {!editName ? (
                                card.name
                            ) : (
                                <textarea
                                    maxLength={128}
                                    onBlur={(e) => {
                                        endEditNameOrCaption(e, card, 'name');
                                    }}
                                    className="card-modal-edit-name"
                                    autoFocus
                                    onFocus={(e) => {
                                        e.target.setSelectionRange(0, 512);
                                    }}
                                    defaultValue={card.name}
                                    onChange={(e) => {
                                        resizeTextArea(e);
                                    }}
                                />
                            )}
                        </div>
                        <h2 className="card-modal__title">????????????????</h2>
                        <div
                            className="card-modal-caption"
                            onClick={() => setEditCaption(true)}
                            draggable={false}>
                            {!editCaption ? (
                                card.caption || '?????????????? ?????????? ???????????????? ????????????????'
                            ) : (
                                <textarea
                                    onBlur={(e) => {
                                        endEditNameOrCaption(e, card, 'caption');
                                    }}
                                    className="card-modal-edit-caption"
                                    autoFocus
                                    onFocus={(e) => e.target.setSelectionRange(0, 512)}
                                    defaultValue={card.caption}
                                    onChange={(e) => {
                                        resizeTextArea(e);
                                    }}
                                />
                            )}
                        </div>
                        {card.date || addDate ? (
                            <div className="card-modal-date">
                                ????????
                                {!addDate ? (
                                    <div className="date-wr">
                                        <input
                                            onBlur={(e) => {
                                                updateCardDate(e, card.date);
                                            }}
                                            className="card-date"
                                            type="datetime-local"
                                            defaultValue={card.date.toISOString().substring(0, 16)}
                                        />
                                        {overdue && <h2>???????????????? ???????? ???????????????????? ????????????!</h2>}
                                    </div>
                                ) : (
                                    <div className="date__body">
                                        <input
                                            onChange={(e) => {
                                                setAddDateValue(e.target.value);
                                            }}
                                            className="card-date"
                                            type="datetime-local"
                                            defaultValue={addDateValue}
                                        />
                                        <input
                                            value="OK"
                                            type="button"
                                            className="green"
                                            onClick={() => addCardDate()}
                                        />
                                        <input
                                            value="X"
                                            type="button"
                                            className="red"
                                            onClick={() => setAddDate(false)}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            ''
                        )}
                        {taskList.length || addTaskList > 0 ? (
                            <TaskList tasks={taskList} cardId={card.id} />
                        ) : (
                            ''
                        )}
                        <div className="card-modal-history">
                            <h2 className="card-modal-history__title">????????????????</h2>
                            <div className="card-modal-history__container">
                                <div className="comment-container">
                                    <textarea
                                        onChange={(e) => {
                                            changeCommentText(e);
                                        }}
                                        className="comment-container-input"
                                        aria-label="???????????????? ??????????????????????"
                                        placeholder="???????????????? ?????????????????????????"
                                        dir="auto"
                                        data-autosize="true"
                                        value={commentText}
                                        id="comment"></textarea>
                                    <div className="comment-option">
                                        <input
                                            onClick={() => {
                                                saveComment();
                                            }}
                                            className="comment-option__btn"
                                            type="button"
                                            value="??????????????????"
                                        />
                                        <img
                                            alt="attachements"
                                            onClick={() => {
                                                addAttachementActive();
                                            }}
                                            className="comment-attachement"
                                            src={filesImage}
                                        />
                                        <input
                                            onChange={(e) => {
                                                addAttachement(e);
                                            }}
                                            type="file"
                                            id="add-attachement"
                                        />
                                    </div>
                                </div>
                            </div>
                            {history.length ? (
                                history.map((h) => {
                                    if (h.type === 'move') {
                                        return (
                                            <div
                                                key={h.id}
                                                className="card-modal-history-move-container">
                                                <div className="card-modal-history-move-delay">
                                                    {h.creatorAvatar !== null ? (
                                                        <img
                                                            alt="avatar"
                                                            className="card-modal-history-move-creator-avatar"
                                                            src={h.creatorAvatar}
                                                        />
                                                    ) : (
                                                        <div className="avatar-replacer">
                                                            {AvatarUtils.getAvatarReplacerText(
                                                                h.creatorName,
                                                                h.creatorEmail,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="card-modal-history-move-date">
                                                    {h.delay}
                                                    <h2>{formatter.format(h.date.toDate())}</h2>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={h.id} className="card-modal-history-comment">
                                                <div className="comment-text-container">
                                                    <div className="card-modal-history-comment-creator-avatar__container">
                                                        {h.creatorAvatar !== null ? (
                                                            <img
                                                                alt="avatar"
                                                                className="card-modal-history-comment-creator-avatar"
                                                                src={h.creatorAvatar}
                                                            />
                                                        ) : (
                                                            <div className="avatar-replacer">
                                                                {AvatarUtils.getAvatarReplacerText(
                                                                    h.creatorName,
                                                                    h.creatorEmail,
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="comment-creator">
                                                        <h2>
                                                            {h.creatorName
                                                                ? h.creatorName +
                                                                  `<${h.creatorEmail}>`
                                                                : h.creatorEmail}
                                                        </h2>
                                                        <div className="comment-text">
                                                            {h.comment}
                                                        </div>
                                                        <div className="comment-attachments">
                                                            {h.files.map((file, index) =>
                                                                file.type === 'other file' ? (
                                                                    <div
                                                                        key={index}
                                                                        className="other-file">
                                                                        <img
                                                                            alt="file"
                                                                            className="other-file-image"
                                                                            src={fileImage}
                                                                        />
                                                                        <a href={file.url}>
                                                                            {file.name}
                                                                        </a>
                                                                    </div>
                                                                ) : file.type === 'image' ? (
                                                                    <img
                                                                        alt="file"
                                                                        key={index}
                                                                        className="file-image"
                                                                        onClick={() => {
                                                                            openImage(file.url);
                                                                        }}
                                                                        src={file.url}
                                                                    />
                                                                ) : (
                                                                    file.type === 'video' && (
                                                                        <video
                                                                            alt="file"
                                                                            key={index}
                                                                            className="file-video"
                                                                            onClick={() => {
                                                                                openImage(file.url);
                                                                            }}
                                                                            src={file.url}
                                                                        />
                                                                    )
                                                                ),
                                                            )}
                                                        </div>
                                                        <div className="comment-date">
                                                            {formatter.format(h.date.toDate())}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })
                            ) : (
                                <Loader />
                            )}
                        </div>
                    </div>
                    <div className="card-modal__btn">
                        <div className="card-modal-users-tags-container">
                            <div className="card-modal-tags">
                                {tags.map((tag) => {
                                    return (
                                        <div
                                            key={tag.id}
                                            className="card-modal-tag"
                                            style={{ backgroundColor: tag.color }}>
                                            {tag.name}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="card-modal-delay">
                            {!card.users.find((user) => user === auth.currentUser.email) ? (
                                <input
                                    onClick={() => {
                                        joinInCard();
                                    }}
                                    type="button"
                                    value="????????????????????????????"
                                />
                            ) : (
                                <input
                                    onClick={() => {
                                        unsubscribeFromCard();
                                    }}
                                    type="button"
                                    value="??????????????????????????"
                                />
                            )}
                            <input
                                type="button"
                                value={!addUsers ? '???????????????? ??????????????????' : '??????????????'}
                                onClick={(e) => {
                                    setAddUsers(!addUsers);
                                }}
                            />
                            {addUsers ? (
                                <AddUsers
                                    card={card}
                                    setCurrentCard={setCurrentCard}
                                    workspaceId={workSpaceId}
                                    setAddUser={setAddUsers}
                                />
                            ) : (
                                ''
                            )}
                            <div className="btn-tags__container">
                                <input
                                    type="button"
                                    value={!addTags ? '???????????????? ??????????' : '??????????????'}
                                    onClick={(e) => {
                                        setAddTags(!addTags);
                                    }}
                                />
                                {addTags ? (
                                    <AddTags workSpaceId={workSpaceId} cardId={card.id} />
                                ) : (
                                    ''
                                )}
                            </div>

                            <div className="move__container">
                                <input
                                    type="button"
                                    value="??????????????????????"
                                    onClick={() => setMoveInBoard(!moveInBoard)}
                                />
                                {moveInBoard ? (
                                    <ul className="card-modal-move">
                                        {boards.map((board) => {
                                            if (board.id !== card.boardId) {
                                                return (
                                                    <li
                                                        className="card-modal-move-to-board"
                                                        onClick={() => {
                                                            moveToBoard(board.id);
                                                        }}
                                                        key={board.id}>
                                                        "{board.name}"
                                                    </li>
                                                );
                                            }
                                            return '';
                                        })}
                                    </ul>
                                ) : (
                                    ''
                                )}
                            </div>
                            {card.date === null ? (
                                <input
                                    onClick={() => {
                                        changeAddDate();
                                    }}
                                    type="button"
                                    value="???????????????? ????????"
                                />
                            ) : (
                                <input
                                    onClick={() => {
                                        deleteDate();
                                    }}
                                    type="button"
                                    value="?????????????? ????????"
                                />
                            )}
                            {taskList.length === 0 && !addTaskList ? (
                                <input
                                    onClick={() => {
                                        setAddTaskList(true);
                                    }}
                                    type="button"
                                    value="???????????????? ??????-????????"
                                />
                            ) : (
                                <input
                                    onClick={() => {
                                        deleteTaskList();
                                    }}
                                    type="button"
                                    value="?????????????? ??????-????????"
                                />
                            )}
                            <input
                                type="button"
                                value="?????????????? ????????????????"
                                onClick={() => {
                                    setIsRemovable(true);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
