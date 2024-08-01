import Logout from "./Logout";
import { Heading, HStack,Spacer} from "@chakra-ui/react";

export default function Dashbar(){

    return(
        <HStack p="2rem">
            <Heading fontSize="lg">Welcome, Buddy😊</Heading>
            <Spacer/>
            <Logout/>
        </HStack>
    )
}