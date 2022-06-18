import React, { useEffect } from "react"
import { useSplashContext } from "../store/SplashContext"

export const Project = () => {
    const { canvasKit } = useSplashContext();

    const loadProject = () => {
        if (!canvasKit) { return }
        const surface = canvasKit.MakeCanvasSurface('foo');
  
        const paint = new canvasKit.Paint();
        paint.setColor(canvasKit.Color4f(0.9, 0, 0, 1.0));
        paint.setStyle(canvasKit.PaintStyle.Stroke);
        paint.setAntiAlias(true);
        const rr = canvasKit.RRectXY(canvasKit.LTRBRect(10, 60, 210, 260), 25, 15);
    
        function draw(canvas) {
          canvas.clear(canvasKit.WHITE);
          canvas.drawRRect(rr, paint);
        }
        surface.drawOnce(draw);
    }

    useEffect(() => {
        loadProject();
    }, [canvasKit])

    return (
        <canvas id="foo" width="300" height="300"></canvas>
    )
} 