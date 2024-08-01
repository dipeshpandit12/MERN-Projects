// import {Spacer, HStack, Button} from "@chakra-ui/react";
import { Flex, Heading} from "@chakra-ui/react";
import { Link} from "react-router-dom";

export default function Header({ bg, height, color, colorScheme }) {

    return (
        <Flex as="nav" p="0.7rem" px="1.2rem" flexDirection="row" bg={bg} height={height} position={"sticky"} zIndex={999} top={'0'} color={color}>
            <Heading as='h1'>
                <Link to="/">
                    Todo List
                </Link>
            </Heading>
            {/* <Spacer />
            <HStack spacing="1rem">
                <Button colorScheme={colorScheme}>
                    Logout
                </Button>
            </HStack> */}
        </Flex>
    );
}
