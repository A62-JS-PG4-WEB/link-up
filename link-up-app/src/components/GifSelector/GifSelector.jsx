// src/components/GifSelector.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { GIPHY_API_KEY, GIPHY_API_URL } from '../../common/constants';
import './GifSelector.css';

export default function GifSelector({ onSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [gifs, setGifs] = useState([]);

    const fetchGifs = async (term) => {
        if (term) {
            try {
                const response = await axios.get(GIPHY_API_URL, {
                    params: {
                        api_key: GIPHY_API_KEY,
                        q: term,
                        limit: 25
                    }
                });
                setGifs(response.data.data);
            } catch (error) {
                console.error('Error fetching GIFs', error);
            }
        }
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        fetchGifs(term);
    };

    return (
        <div className="gif-selector">
            <input
                type="text"
                placeholder="Search GIFs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 rounded-lg border border-gray-300"
            />
            <div className="gif-results grid grid-cols-3 gap-2 mt-2">
                {gifs.map((gif) => (
                    <img
                        key={gif.id}
                        src={gif.images.fixed_width_small.url}
                        alt={gif.title}
                        className="cursor-pointer"
                        onClick={() => onSelect(gif.images.original.url)}
                    />
                ))}
            </div>
        </div>
    );
}
GifSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
};