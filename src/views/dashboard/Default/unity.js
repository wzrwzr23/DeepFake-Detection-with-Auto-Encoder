import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

function UnityComponent() {
    const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
        loaderUrl: "/unity/Build/CapUnity.loader.js",
        dataUrl: "/unity/Build/webgl.data",
        frameworkUrl: "/unity/Build/build.framework.js",
        codeUrl: "/unity/Build/build.wasm",
    });

    return (
        <div>
            {!isLoaded && (
                <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
            )}
            <Unity
                unityProvider={unityProvider}
                style={{ visibility: isLoaded ? "visible" : "hidden" }}
            />
        </div>
    );
}
export default UnityComponent;