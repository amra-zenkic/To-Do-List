import { useState, useEffect } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
        .then(res => {
            if(!res.ok) {
                throw Error("Could not fetch the data");
            }
            return res.json();
        })
        .then(data => {
            setIsPending(false);
            setData(data);
            setError(null);
            console.log("all good");
        })
        .catch(err => {
            setIsPending(false);
            setError(err.message);
            console.log(err.message);
        })
    }, [url])

    return { data, isPending, error };
}
 
export default useFetch;