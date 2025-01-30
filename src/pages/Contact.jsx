import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  Icon,
  HStack,
  useColorMode,
  Button,
} from '@chakra-ui/react';
import { FaLinkedin } from 'react-icons/fa';

export default function Contact() {
  const { colorMode } = useColorMode();
  
  const bgGradient = colorMode === 'light'
    ? 'linear(to-r, nepal.red, nepal.blue)'
    : 'linear(to-r, nepal.darkRed, nepal.darkBlue)';

  return (
    <Container maxW="4xl" py={20}>
      <VStack spacing={8} align="start">
        <Box
          w="full"
          p={8}
          borderRadius="lg"
          bgGradient={bgGradient}
          color="white"
        >
          <VStack spacing={4} align="start">
            <Heading size="xl">Contact Us</Heading>
            <Text fontSize="lg">
              Feel free to reach out for any questions, suggestions, or collaboration opportunities.
            </Text>
          </VStack>
        </Box>

        <VStack spacing={6} align="start" w="full" p={8}>
          <Heading size="lg">Contact Information</Heading>
          
          <VStack spacing={4} align="start">
            <Box>
              <Text fontSize="xl" fontWeight="bold">Arjun Acharya</Text>
              <Text color="gray.600">Full Stack Developer</Text>
            </Box>

            <HStack spacing={4}>
              <Link 
                href="https://www.linkedin.com/in/arjun-acharya-935230194/"
                isExternal
              >
                <Button
                  leftIcon={<FaLinkedin />}
                  colorScheme="linkedin"
                  variant="solid"
                >
                  Connect on LinkedIn
                </Button>
              </Link>

              <Link 
                href="https://www.linkedin.com/in/arjun-acharya-935230194/message/"
                isExternal
              >
                <Button
                  leftIcon={<FaLinkedin />}
                  colorScheme="linkedin"
                  variant="outline"
                >
                  Message on LinkedIn
                </Button>
              </Link>
            </HStack>

            <Box mt={6}>
              <Text fontSize="lg" fontWeight="semibold">About Me</Text>
              <Text color="gray.600" mt={2}>
                I am a passionate Full Stack Developer with expertise in web development
                and a strong focus on creating user-friendly applications. I specialize in
                building modern web applications using React, Node.js, and various other
                technologies.
              </Text>
            </Box>
          </VStack>
        </VStack>
      </VStack>
    </Container>
  );
} 