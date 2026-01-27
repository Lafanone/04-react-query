import axios from 'axios';
import type { Movie } from '../types/movie';

export interface MoviesResponse{
    results: Movie[];
    page: number;
    total_pages: number;
    total_results: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    const { data } = await axios.get<MoviesResponse>(
        `${BASE_URL}/search/movie`,
        {
            params: {
                query: query,
                language: 'en-US',
                page: 1,
            },
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        }
    );
    return data.results
}