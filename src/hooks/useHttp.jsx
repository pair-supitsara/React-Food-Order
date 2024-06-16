import { useCallback, useEffect, useState } from "react";

async function sendHttpRequest(url, config) {
    const response = await fetch(url, config)

    const resData = await response.json()

    if (!response.ok) {
        throw new Error(resData.message || 'something went wrong! fail to send a request.')
    }

    return resData
}

export default function useHttp(url, config, initialData) {
    const [data, setData] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    function clearData() {
        setData(initialData)
    }

    const sendRequest = useCallback(async function sendRequest(data) {
        try {
            setIsLoading(true)
            const resData = await sendHttpRequest(url, { ...config, body: data })
            setData(resData)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            setError(error.message)
        }
    }, [url, config])

    useEffect(() => {
       if (config && (config.method == 'GET' || !config.method) || !config ) {
            sendRequest()
       }
    }, [sendRequest, config])
    
    return {
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    }
}