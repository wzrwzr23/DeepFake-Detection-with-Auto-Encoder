import React, { useState, useEffect } from 'react';
function UnityComponent() {
    const [htmlContent, setHtmlContent] = useState('');

    useEffect(() => {
        async function fetchUnityHtml() {
            try {
                const response = await fetch('http://127.0.0.1:5001/');
                const html = await response.text();
                console.log(html);
                setHtmlContent(html);
            } catch (error) {
                console.error('Error fetching Unity HTML:', error);
            }
        }

        fetchUnityHtml();
    }, []);

    return (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    );
}

export default UnityComponent;