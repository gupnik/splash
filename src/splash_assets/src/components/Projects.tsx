import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system";
import React from "react"
import { useSplashContext } from "../store/SplashContext";

export const Projects = () => {
    const { create, projects, open } = useSplashContext();
    console.log(projects)

    return (
        <Stack padding={"10px"}>
            <Box height={40}/>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    {/* <CardMedia
                        component="img"
                        height="140"
                        // image="/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"
                    /> */}
                    <CardContent style={{ backgroundColor: "lightgray" }}>
                        <Typography variant="body2" color="text.secondary">
                            Click here to create a new project!
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => create()}>
                        Create
                        </Button>
                    </CardActions>
                </CardActionArea>
            </Card>
            <Box height={40}/>
            <Typography variant="h5">
                My Projects
            </Typography>
            <Divider />
            <Box height={40}/>
            { projects == null 
            ? 
            <div style={{display: 'flex', justifyContent: 'center'}}>
             <CircularProgress />
            </div>
            :
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid item key={project.id.toString()}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardActionArea>
                                {/* <CardMedia
                                    component="img"
                                    height="140"
                                    // image="/static/images/cards/contemplative-reptile.jpg"
                                    alt="green iguana"
                                /> */}
                                <CardContent style={{ backgroundColor: "lightgray" }}>
                                    <Typography gutterBottom variant="h1" component="div" textAlign={"center"}>
                                        {project.id.toString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Click here to open this project!
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary" onClick={() => open(project)}>
                                    Edit
                                    </Button>
                                </CardActions>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            }
        </Stack>
    )
} 