import { HStack, Icon } from "@chakra-ui/react";
import { FaDiscord, FaFacebook,FaGoogle } from 'react-icons/fa';
import { Alert } from "./Alert";

export default function SocialLogin() {
    const showToast = Alert();

    const handleDiscordSubmit = async (e) => {
        e.preventDefault();
        try {
            // Open the Discord login popup or redirect
            window.location.href = 'http://localhost:4000/api/auth/discord';
        } catch (error) {
            showToast('Failed', 'Discord login failed ' + error, 'error');
        }
    }
    const handleFacebookSubmit = async (e) => {
        e.preventDefault();
        try {
            // Open the Discord login popup or redirect
            window.location.href = 'http://localhost:4000/api/auth/facebook';
        } catch (error) {
            showToast('Failed', 'Facebook login failed ' + error, 'error');
        }
    }
    const handleGoogleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Open the Discord login popup or redirect
            window.location.href = 'http://localhost:4000/api/auth/google';
        } catch (error) {
            showToast('Failed', 'Google login failed ' + error, 'error');
        }
    }

    return (
        <HStack spacing={6}>
            <Icon as={FaGoogle} boxSize={8} onClick={handleGoogleSubmit} cursor="pointer" />
            <Icon as={FaDiscord} boxSize={8} onClick={handleDiscordSubmit} cursor="pointer" />
            <Icon as={FaFacebook} boxSize={8} onClick={handleFacebookSubmit} cursor="pointer" />
        </HStack>
    );
}
