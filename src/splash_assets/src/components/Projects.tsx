import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Divider, Grid, Stack, Typography } from "@mui/material"
import { Box } from "@mui/system";
import React from "react"
import { useSplashContext } from "../store/SplashContext";

export const Projects = () => {
    const { create, projects, open } = useSplashContext();
    console.log(projects)

    return (
        <Stack>
            <Box height={40}/>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    {/* <CardMedia
                        component="img"
                        height="140"
                        // image="/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"
                    /> */}
                    <CardContent>
                        <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={() => create()}>
                        Create New
                        </Button>
                    </CardActions>
                </CardActionArea>
            </Card>
            <Box height={40}/>
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
                                <CardMedia
                                    component="img"
                                    height="140"
                                    // image="/static/images/cards/contemplative-reptile.jpg"
                                    alt="green iguana"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {project.id.toString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lizards are a widespread group of squamate reptiles, with over 6,000
                                        species, ranging across all continents except Antarctica
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