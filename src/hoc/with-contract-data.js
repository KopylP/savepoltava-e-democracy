import { useEffect, useState } from "react"

export default ({
    getDataMethod,
    args = null,
    LoadingComponent = null
}) => (Component) => (props) => {
    const [loaded, setLoaded] = useState(false);
    const [data, setData] = useState(null);
    useEffect(async () => {
        const data = await getDataMethod(args);
        setLoaded(true);
        setData(data);
    }, []);

    if (!loaded) return <LoadingComponent />

    return <Component {...props} data={data} />
} 