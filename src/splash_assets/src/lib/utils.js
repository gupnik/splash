import CanvasKitInit from "canvaskit-wasm";

export async function loadCanvasKit() {
    return await CanvasKitInit({
        locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.34.1/bin/'+file
    });
}