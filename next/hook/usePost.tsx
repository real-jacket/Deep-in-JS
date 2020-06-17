import {useEffect, useState} from 'react';
import axios from 'axios';

export const usePost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        axios.get('/api/v1/posts').then((res) => {
            setPosts(res.data);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    return {posts, setPosts, loading, setLoading};
};


