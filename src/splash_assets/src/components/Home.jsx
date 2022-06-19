import { Box, Button, Card, CardActionArea, CardActions, CardContent, Stack, Typography } from "@mui/material";
import React from "react"

import { useSplashContext } from "../store/SplashContext";
import Header from "./Header";
import { Project } from "./Project";
import { Projects } from "./Projects";

export const Home = () => {
    const { actor, currentProject, isAuthenticated, login } = useSplashContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}  height={"100vh"}>
      <Header />
      { isAuthenticated ?
       (currentProject !== null
      ? <Project />
      : <Projects />)
      : 
      <Box display="flex" alignItems="center" justifyContent="center" flex={1}>
        {/* <Card style={{ textAlign: "center" }}>
            <CardActionArea> */}
            <Stack direction="column">
                {/* <CardContent> */}
                    <Typography variant="h2">
                        Welcome to Splash!
                    </Typography>
                    <Typography variant="body">
                        Now create your favourite designs entirely on IC.
                    </Typography>
                {/* </CardContent> */}
                {/* <CardActions> */}
                    <Button style={{ fontSize: "40px" }} color="primary" onClick={() => login()}>
                    LOGIN
                    </Button>
                {/* </CardActions> */}
              </Stack>
            {/* </CardActionArea>
        </Card> */}
      </Box>
      } 
    </div>
  )
}