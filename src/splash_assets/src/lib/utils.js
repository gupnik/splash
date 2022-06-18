import CanvasKitInit from "canvaskit-wasm";

export async function loadCanvasKit() {
    return await CanvasKitInit();
}