import { Circle, CircleOutlined, FormatShapes, Rectangle, RectangleOutlined } from "@mui/icons-material";
import { Divider, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { Path } from "canvaskit-wasm";
import React, { useEffect, useState } from "react"
import { useSplashContext } from "../store/SplashContext"

export const Project = () => {
    const { canvasKit } = useSplashContext();

    const [paths, setPaths] = useState<Path[]>([]);

    const loadProject = () => {
        if (!canvasKit) { return }
        const surface = canvasKit.MakeCanvasSurface('foo');

        const paint = new canvasKit.Paint();
        paint.setColor(canvasKit.Color4f(0.9, 0, 0, 1.0));
        paint.setStyle(canvasKit.PaintStyle.Stroke);
        paint.setAntiAlias(true);

        function drawFrame(canvas) {
            canvas.clear(canvasKit.WHITE);

            for (const path of paths) {
                canvas.drawPath(path, paint);
            }

            // surface.requestAnimationFrame(drawFrame);
        }
        // surface.requestAnimationFrame(drawFrame);
        surface.drawOnce(drawFrame);
    }

    useEffect(() => {
        loadProject();
    }, [canvasKit, paths])

    const addRectangle = () => {
        if (!canvasKit) { return }
        const path = new canvasKit.Path();
        path.addRect([20, 20, 100, 100]);
        setPaths(paths.concat(path));
    }

    const addCircle = () => {
        if (!canvasKit) { return }
        const path = new canvasKit.Path();
        path.addOval([20, 20, 100, 100]);
        setPaths(paths.concat(path));
    }

    return (
        <Stack direction={"row"} height={"100vh"} display="flex">
            <Divider orientation="vertical" />
            <Stack>
                <IconButton onClick={addRectangle}>
                    <RectangleOutlined />
                </IconButton>
                <IconButton>
                    <CircleOutlined onClick={addCircle}/>
                </IconButton>
            </Stack>
            <Divider orientation="vertical" />
            <Stack style={{ flex: 1, textAlign: "center" }} display="block">
                {/* <Box style={{ flex: 0.25 }} /> */}
                <canvas id="foo" width="600" height="600"  style={{ padding: "10px" }}></canvas>
                {/* <Box style={{ flex: 0.25 }} /> */}
            </Stack>
            <Divider orientation="vertical" />
            <Stack width={250}>
                <div>Properties</div>
            </Stack>
            <Divider orientation="vertical" />
        </Stack>
    )
} 