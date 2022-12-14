import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase-config';

import TagsAction from '../../actions/tagsAction';

import CardModal from '../cardModal/cardModal';

import captionImage from '../../resources/caption.png';
import eyeImage from '../../resources/eyeBlack.png';
import commentCountImage from '../../resources/commentCount.png';

import './cardslist.scss';

export default function CardList({
    workSpaceId,
    setCurrentCardForBoard,
    updateCards,
    cards,
    boards,
    setDraggableBoard,
}) {
    const [openCardModal, setOpenCardModal] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    const [tags, setTags] = useState([]);
    const currentDate = new Date().toISOString();
    useEffect(() => {
        TagsAction.getTags(setTags, workSpaceId);
    }, [workSpaceId]);

    const dragOverCard = (e) => {
        e.preventDefault();
        if (e.target.className === 'card') {
            e.target.style.boxShadow = '0 5px 7px gray';
        }
    };

    const dragLeaveCard = (e) => {
        e.target.style.boxShadow = 'none';
    };

    const dragStartCard = (e, card) => {
        e.target.style.transform = 'rotate(-10deg)';
        setCurrentCard(card);
        setCurrentCardForBoard(card);
    };

    const dragEndCard = (e) => {
        e.target.style.boxShadow = 'none';
        e.target.style.transform = 'none';
    };

    const dropCard = (e, card) => {
        e.preventDefault();
        const sorIndexCard = card.sortIndex;
        const sortIndexCurrentCard = currentCard.sortIndex;

        const indexCurrentCard = cards.indexOf(currentCard);
        const indexCard = cards.indexOf(card);

        cards[indexCurrentCard].sortIndex = sorIndexCard;
        cards[indexCard].sortIndex = sortIndexCurrentCard;

        updateCards(cards);
        setCurrentCard(null);
    };
    function openCardModalById(cardId) {
        setDraggableBoard(false);
        setCurrentCard(cards.find((card) => card.id === cardId));
        setOpenCardModal(true);
    }
    return (
        <div className="cards-container">
            {openCardModal && (
                <CardModal
                    workSpaceId={workSpaceId}
                    setDraggableBoard={setDraggableBoard}
                    tags={tags.filter((tag) => tag.cardids.includes(currentCard.id))}
                    card={currentCard}
                    setCurrentCard={setCurrentCard}
                    setOpenCardModal={setOpenCardModal}
                    boards={boards}
                    overdue={currentCard.date && currentCard.date.toISOString() < currentDate}
                />
            )}
            {cards.map((card) => {
                return (
                    <div
                        key={card.id}
                        className="card"
                        id={'card.' + card.id}
                        onClick={() => {
                            openCardModalById(card.id);
                        }}
                        draggable={true}
                        onDragOver={(e) => {
                            dragOverCard(e);
                        }}
                        onDragLeave={(e) => {
                            dragLeaveCard(e);
                        }}
                        onDragStart={(e) => {
                            dragStartCard(e, card);
                        }}
                        onDragEnd={(e) => {
                            dragEndCard(e);
                        }}
                        onDrop={(e) => {
                            dropCard(e, card);
                        }}>
                        {card.date && card.date.toISOString() < currentDate && (
                            <h2 className="overdue">???????????????? ???????? ???????????????????? ????????????!</h2>
                        )}
                        <div className="card-tags">
                            {tags
                                .filter((tag) => tag.cardids.includes(card.id))
                                .map((tag) => {
                                    return (
                                        <div
                                            className="tag"
                                            key={tag.id}
                                            style={{ backgroundColor: tag.color }}>
                                            {tag.name}
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="card-name">{card.name}</div>
                        <div className="widgets">
                            {card.caption !== '' && card.caption !== null && (
                                <img
                                    title="?????? ???????????????? ?? ??????????????????"
                                    src={captionImage}
                                    alt="title"
                                />
                            )}
                            {card.users.includes(auth.currentUser.email) && (
                                <img title="???? ???????????????? ???????? ????????????????" src={eyeImage} alt="title" />
                            )}
                            {card.commentCount > 0 && (
                                <div>
                                    <img title="??????????????????????" src={commentCountImage} alt="title" />
                                    {card.commentCount}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
