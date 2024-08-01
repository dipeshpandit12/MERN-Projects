import { VStack,Input,FormLabel, FormControl,Button,Text, Center,Heading} from "@chakra-ui/react";
import {useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert } from './Alert';
import SocialLogin from "./SocialLogin";

export default function Login({ setIsAuthenticated }){
    const[email,setEmail]=useState();
    const[password,setPassword]=useState();
    const navigate = useNavigate();
    const showToast = Alert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Submitting form...");
        try {
            // console.log("Sending request...");
            const res = await axios.post('http://localhost:4000/api/auth/login', { email, password }, { withCredentials: true });
            showToast('Success', 'Logged in successfully!', 'success');
            console.log("Received response:", res);
            // console.log("Logged in successfully!");
            if(res.status===200){
                setIsAuthenticated(true);
                setTimeout(() => {
                navigate('/');
                }, 2000);
            }
        } catch (err) {
            // console.log("Error:", err);
          showToast('Failed', 'Login failed!'+ err.response.data.error, 'error');
        }
      };
    return(
        <Center>
        <form onSubmit={handleSubmit}>
        <Heading as="h5"size="sm" py="3rem">Please Login to your Account😊</Heading>
            <VStack width="20rem" spacing="1.5rem">
                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" name="user_email" value={email} onChange={(e)=>setEmail(e.target.value)}></Input>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" name="user_password" value={password} onChange={(e)=>setPassword(e.target.value)}></Input>
                </FormControl>
                <Button colorScheme="purple" type="submit" width="20rem" >Login</Button>
                <Text>OR</Text>
                <SocialLogin/>
                <Link to="/signup"><Text as="u">Create an account : SignUp</Text></Link>
            </VStack>
        </form>
    </Center>
    )
}