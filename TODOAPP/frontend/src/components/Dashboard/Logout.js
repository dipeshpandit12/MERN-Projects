import { Button,Text ,useBreakpointValue} from "@chakra-ui/react";
import axios from "axios";
import { Alert } from "../Alert";
import { useNavigate } from "react-router-dom";
import { useEffect, useState} from "react";

export default function Logout(){
    const showToast = Alert();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const isUserEmailVisible = useBreakpointValue({ base: false, md: true });

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/auth/status', { withCredentials: true });
          setUser(response.data.email);
        } catch (err) {
          console.log(`User not authenticated ${err}`);
        }
      };
      fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.post("http://localhost:4000/api/auth/logout", {}, { withCredentials: true });
            if (response.status === 200) {
                console.log("Logout successful");
                showToast("Success", "Logged out successfully", "success");
                navigate('/login');
            } else {
                showToast("Failed", `Logout failed with status: ${response.status}`, "error");
            }
        } catch (error) {
            const result = error.response ? error.response.data.message : error.message;
            showToast("Failed", `Logout failed: ${result}`, "error");
        }
    };
    return(
        <>
            {isUserEmailVisible ? <Text as="h5" pr="1rem" fontSize="sm">{user}</Text>:null}
            <Button minW="3rem" colorScheme="red" onClick={handleLogout}>Logout</Button>
        </>
    )
}