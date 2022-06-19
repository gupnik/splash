import { Circle, CircleOutlined, ExpandMore, FormatShapes, Rectangle, RectangleOutlined, Spa } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, Divider, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react"
import { Shape, useSplashContext } from "../store/SplashContext"

export const Project = () => {
    const { canvasKit, shapes, setShapes } = useSplashContext();

    const [mouseState, setMouseState] = useState<number>(-1);
    const [mouseX, setMouseX] = useState<number>(0);
    const [mouseY, setMouseY] = useState<number>(0);

    const [type, setType] = useState<number>(0);

    const [x, setX] = useState<number>(20);
    const [y, setY] = useState<number>(20);
    const [width, setWidth] = useState<number>(100);
    const [height, setHeight] = useState<number>(100);

    const [r, setR] = useState<number>(0);
    const [g, setG] = useState<number>(0);
    const [b, setB] = useState<number>(0);
    const [a, setA] = useState<number>(255);

    const [activeShape, setActiveShape] = useState<Shape | null>(null);

    useEffect(() => {
        if (!canvasKit) { return }

        document.getElementById('foo').addEventListener('mousedown', onMouseDown.bind(this));
        document.getElementById('foo').addEventListener('mousemove', onMouseMove.bind(this));
        document.getElementById('foo').addEventListener('mouseup', onMouseUp.bind(this));
    }, [canvasKit])

    useEffect(() => {
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

            if (activeShape) {
                paint.setColor(canvasKit.Color4f(r/255., g/255., b/255., a/255.));
                const path = new canvasKit.Path();
                switch(activeShape.type) {
                    case 0:
                        path.addRect(activeShape.points);
                        break;
                    case 1:
                        path.addOval(activeShape.points);
                        break;
                }
                canvas.drawPath(path, paint);
            }
        }
        surface!.drawOnce(drawFrame);
    }, [canvasKit, shapes, activeShape])

    const addRectangle = () => {
        setType(0);
    }

    const addCircle = () => {
        setType(1);
    }

    const onMouseDown = (ev) => {
        setMouseState(0);
        setMouseX(ev.offsetX);
        setMouseY(ev.offsetY);
    }

    const onMouseMove = (ev) => {
        setMouseX(ev.offsetX);
        setMouseY(ev.offsetY);
    }

    const onMouseUp = (ev) => {
        setMouseState(2);
        setMouseX(ev.offsetX);
        setMouseY(ev.offsetY);       
    }

    useEffect(() => {
        if (mouseState == 0) {
            setX(mouseX);
            setY(mouseY);
            setMouseState(1);
        } else if (mouseState == 1) {
            const width = mouseX;
            const height = mouseY;
            setWidth(width);
            setHeight(height);
            setActiveShape(new Shape(
                type, 
                [x, y, width, height],
                [r, g, b, a]
            ));
        } else if (mouseState == 2) {
            const width = mouseX;
            const height = mouseY;
            setWidth(width);
            setHeight(height);

            setActiveShape(null);
            setMouseState(-1);
            setShapes(shapes.concat(new Shape(
                type, 
                [x, y, width, height],
                [r, g, b, a]
            )))
        }
    }, [mouseState, mouseX, mouseY])

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
                    <TextField label="X" type="number" value={x} onChange={(e) => setX(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="Y" type="number" value={y} onChange={(e) => setY(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="Width" type="number" value={Math.abs(width - x)} onChange={(e) => setWidth(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="Height" type="number" value={Math.abs(height - y)} onChange={(e) => setHeight(parseInt(e.currentTarget.value))}/>
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
                    <TextField label="R" type="number" value={r} onChange={(e) => setR(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="G" type="number" value={g} onChange={(e) => setG(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="B" type="number" value={b} onChange={(e) => setB(parseInt(e.currentTarget.value))}/>
                    <Box height={10}/>
                    <TextField label="A" type="number" value={a} onChange={(e) => setA(parseInt(e.currentTarget.value))}/>
                    </AccordionDetails>
                </Accordion>
            </Stack>
            <Divider orientation="vertical" />
        </Stack>
    )
} 