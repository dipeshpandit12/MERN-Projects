import {Grid,GridItem} from "@chakra-ui/react";
import Header from "../components/Header";

export default function RootLayout({children}){
    return (
        <Grid
            templateColumns="repeat(12, 1fr)"
            templateRows="auto 1fr"
        >
            <GridItem rowSpan={1} colSpan={12}>
                <Header bg="purple.500" color="white" height="4.2rem" colorScheme="red"/>
            </GridItem>
            <GridItem colSpan={12}>
                {children}
            </GridItem>
        </Grid>

    )
}