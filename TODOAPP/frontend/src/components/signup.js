import { VStack,Input,FormLabel, FormControl,Button,Text,Heading,Center} from "@chakra-ui/react";
import {Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from './Alert';
import SocialLogin from "./SocialLogin";

export default function Signup(){

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate=useNavigate();
    const showToast = Alert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/auth/register', { email, password });
            if (response.status===201) {
                showToast('Success', "Registration successful!", 'success');
                setTimeout(() => {
                  navigate("/login");
                }, 2000);
              }
        } catch (error) {
            showToast('Failed', 'Registration failed. ' + error.response.data.error, 'error');
        }
    };
    return(
        <Center>
        <form onSubmit={handleSubmit}>
            <Heading  as="h5"size="sm" py="3rem" >Please create your Account😊</Heading>
            <VStack width="20rem" spacing="1.5rem">
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="user_email" value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>New Password</FormLabel>
                    <Input type="password" name="user_password" value={password} onChange={(e)=>setPassword(e.target.value)}></Input>
                </FormControl>
                <Button colorScheme="purple" type="submit" width="20rem">SignUp</Button>
                <Text>OR</Text>
                <SocialLogin/>
                <Link to="/login"><Text as="u">Already have an account : Login</Text></Link>
            </VStack>
        </form>
    </Center>
    )
}