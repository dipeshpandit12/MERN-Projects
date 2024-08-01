import { useToast } from "@chakra-ui/react";

export const Alert = () => {
  const toast = useToast();

  const showToast = (title, message, status) => {
    toast({
      title: title,
      description: message,
      duration: 1500,
      isClosable: true,
      status: status,
      position: "top",
      zIndex: 9999,
    });
  };

  return showToast;
};