import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function UnityComponent() {
    const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "/unity/Build/backup.loader.js",
        dataUrl: "/unity/Build/webgl.data",
        frameworkUrl: "/unity/Build/build.framework.js",
        codeUrl: "/unity/Build/build.wasm",
    });

    return (
        <div>
            {!isLoaded && (
                <p style={{ fontSize: '24px' }}>Loading Application... {Math.round(loadingProgression * 100)}%</p>
            )}
            <Unity
                unityProvider={unityProvider}
                style={{
                    visibility: isLoaded ? "visible" : "hidden",
                    width: '1080px', // Adjust the width as needed
                    height: '640px', // Adjust the height as needed
                }}
            />
        </div>

    );
}
export default UnityComponent;