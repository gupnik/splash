import { Circle, CircleOutlined, ExpandMore, FormatShapes, Rectangle, RectangleOutlined, Spa } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Path } from "canvaskit-wasm";
import React, { useEffect, useState } from "react"
import { Shape, useSplashContext } from "../store/SplashContext"

export const Project = () => {
    const { canvasKit, shapes, setShapes } = useSplashContext();

    const [x, setX] = useState<number>(20);
    const [y, setY] = useState<number>(20);
    const [width, setWidth] = useState<number>(100);
    const [height, setHeight] = useState<number>(100);

    const [r, setR] = useState<number>(0);
    const [g, setG] = useState<number>(0);
    const [b, setB] = useState<number>(0);
    const [a, setA] = useState<number>(255);

    const loadProject = () => {
        if (!canvasKit) { return }
        const surface = canvasKit.MakeCanvasSurface('foo');

        const paint = new canvasKit.Paint();
        paint.setStyle(canvasKit.PaintStyle.Stroke);
        paint.setAntiAlias(true);

        function drawFrame(canvas) {
            canvas.clear(canvasKit.WHITE);

            for (const shape of shapes) {
                if (shape.color) {
                    paint.setColor(canvasKit.Color4f(shape.color[0]/255., shape.color[1]/255., shape.color[2]/255., shape.color[3]/255.));
                } else {
                    paint.setColor(canvasKit.Color4f(0, 0, 0, 1.0));
                }
                const path = new canvasKit.Path();
                switch(shape.type) {
                    case 0:
                        path.addRect(shape.points);
                        break;
                    case 1:
                        path.addOval(shape.points);
                        break;
                }
                canvas.drawPath(path, paint);
            }

        }
        surface.drawOnce(drawFrame);
    }

    useEffect(() => {
        loadProject();
    }, [canvasKit, shapes])

    const addRectangle = () => {
        setShapes(shapes.concat(new Shape(
            0, 
            [x, y, width, height],
            [r, g, b, a]
        )))
    }

    const addCircle = () => {
        setShapes(shapes.concat(new Shape(
            1, 
            [x, y, width, height],
            [r, g, b, a]
        )))
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
            <Stack width={250} alignItems="center">
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Project Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        You will be able to edit project settigns here.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Artboard Settings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        You will be able to edit artboard settigns here.
                    </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion style={{ width: "100%" }}>
                    <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Position</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <TextField label="X" type="number" defaultValue={x} onChange={(e) => setX(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="Y" type="number" defaultValue={y} onChange={(e) => setY(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="Width" type="number" defaultValue={width} onChange={(e) => setWidth(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="Height" type="number" defaultValue={height} onChange={(e) => setHeight(parseInt(e.currentTarget.value))}/>
                    </AccordionDetails>
                </Accordion>
                <Accordion style={{ width: "100%" }}>
                    <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Color</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <TextField label="R" type="number" defaultValue={r} onChange={(e) => setR(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="G" type="number" defaultValue={g} onChange={(e) => setG(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="B" type="number" defaultValue={b} onChange={(e) => setB(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="A" type="number" defaultValue={a} onChange={(e) => setA(parseInt(e.currentTarget.value))}/>
                    </AccordionDetails>
                </Accordion>
            </Stack>
            <Divider orientation="vertical" />
        </Stack>
    )
} 