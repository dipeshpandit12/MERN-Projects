import Dashbar from "./Dashbar";
import Main from "./Main";
import { Grid, GridItem } from "@chakra-ui/react";

export default function Homepage() {
    return (
        <>
          <Grid
            templateColumns="repeat(12, 1fr)"
            templateRows="auto 1fr"
          >
            <GridItem colSpan={12} rowSpan={1} >
                <Dashbar/>
            </GridItem>
            <GridItem colSpan={12} >
                <Main/>
            </GridItem>
          </Grid>
        </>
    );
}
