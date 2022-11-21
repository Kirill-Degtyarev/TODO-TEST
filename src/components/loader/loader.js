import React from 'react';

import './loader.scss';

export default function Loader() {
    return (
        <div className="loading">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );
}
