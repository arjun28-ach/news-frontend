import { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  useColorMode,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Badge,
  Container,
  VStack,
  useBreakpointValue,
  Avatar,
  Text,
  HStack,
  MenuDivider,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaMoon, FaSun, FaBookmark, FaUser, FaBars, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { AuthModal } from './AuthModal';
import { Logo } from './Logo';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

export const Header = ({ isAuthenticated, user, onLanguageChange, bookmarkCount = 0 }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { isOpen: isMobileMenuOpen, onToggle: onMobileMenuToggle } = useDisclosure();
  const [authType, setAuthType] = useState('login');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();

  const bgGradient = colorMode === 'light'
    ? 'linear(to-r, nepal.red, nepal.blue)'
    : 'linear(to-r, nepal.darkRed, nepal.darkBlue)';
  const borderColor = colorMode === 'light' ? 'whiteAlpha.300' : 'rgba(255, 255, 255, 0.1)';
  const buttonHoverBg = colorMode === 'light' ? 'whiteAlpha.200' : 'whiteAlpha.100';

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthClick = (type) => {
    setAuthType(type);
    onAuthOpen();
  };

  const MobileNavItem = ({ label, children, href, onClick }) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
      <Stack spacing={4} onClick={children ? onToggle : onClick}>
        <Flex
          py={2}
          as={href ? RouterLink : 'div'}
          to={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Text
            fontWeight={600}
            color={'white'}
          >
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>

        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={'whiteAlpha.300'}
            align={'start'}
          >
            {children &&
              children.map((child) => (
                <RouterLink key={child.label} to={child.href}>
                  <Text py={2} color={'white'}>
                    {child.label}
                  </Text>
                </RouterLink>
              ))}
          </Stack>
        </Collapse>
      </Stack>
    );
  };

  return (
    <>
      <Box
        as="header"
        position="fixed"
        top={0}
        w="100%"
        zIndex={1000}
        bgGradient={bgGradient}
        borderBottom="1px"
        borderColor={borderColor}
        boxShadow="lg"
      >
        <Container maxW="1200px" px={4}>
          <Flex h="72px" align="center" justify="space-between">
            <RouterLink to="/">
              <Logo />
            </RouterLink>

            {isMobile ? (
              <>
                <IconButton
                  onClick={onMobileMenuToggle}
                  icon={isMobileMenuOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                  variant={'ghost'}
                  color="white"
                  aria-label={'Toggle Navigation'}
                  _hover={{ bg: buttonHoverBg }}
                />
              </>
            ) : (
              <HStack spacing={4}>
                <DesktopNav />
                <HStack spacing={4}>
                  <Button
                    variant="ghost"
                    onClick={() => onLanguageChange('en')}
                    color="white"
                    _hover={{ bg: buttonHoverBg }}
                  >
                    EN
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onLanguageChange('np')}
                    color="white"
                    _hover={{ bg: buttonHoverBg }}
                  >
                    नेपाली
                  </Button>

                  <IconButton
                    icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                    onClick={toggleColorMode}
                    variant="ghost"
                    color="white"
                    aria-label="Toggle theme"
                    _hover={{ bg: buttonHoverBg }}
                  />

                  {isAuthenticated && (
                    <Box position="relative">
                      <IconButton
                        as={RouterLink}
                        to="/bookmarks"
                        icon={<FaBookmark />}
                        variant="ghost"
                        color="white"
                        aria-label="Bookmarks"
                        _hover={{ bg: buttonHoverBg }}
                      />
                      {bookmarkCount > 0 && (
                        <Badge
                          position="absolute"
                          top="-1"
                          right="-1"
                          bg="white"
                          color="primary.100"
                          borderRadius="full"
                          fontSize="xs"
                        >
                          {bookmarkCount}
                        </Badge>
                      )}
                    </Box>
                  )}

                  {isAuthenticated ? (
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant="ghost"
                        color="white"
                        rightIcon={<FaChevronDown />}
                        _hover={{ bg: buttonHoverBg }}
                      >
                        <HStack>
                          <Avatar
                            size="sm"
                            name={user?.name}
                            bg="white"
                            color="primary.100"
                          />
                          <Text>{user?.name}</Text>
                        </HStack>
                      </MenuButton>
                      <MenuList bg={colorMode === 'light' ? 'white' : 'accent.100'} borderColor={borderColor}>
                        <MenuItem
                          icon={<FaUser />}
                          as={RouterLink}
                          to="/profile"
                          _hover={{ bg: buttonHoverBg }}
                        >
                          Profile
                        </MenuItem>
                        <MenuDivider borderColor={borderColor} />
                        <MenuItem
                          icon={<FaSignOutAlt />}
                          onClick={handleLogout}
                          _hover={{ bg: buttonHoverBg }}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  ) : (
                    <HStack spacing={2}>
                      <Button 
                        variant="ghost"
                        onClick={() => handleAuthClick('login')}
                        color="white"
                        _hover={{ bg: buttonHoverBg }}
                      >
                        Login
                      </Button>
                      <Button 
                        bg="white"
                        color="primary.100"
                        onClick={() => handleAuthClick('signup')}
                        _hover={{ bg: 'whiteAlpha.800' }}
                      >
                        Sign Up
                      </Button>
                    </HStack>
                  )}
                </HStack>
              </HStack>
            )}
          </Flex>

          {/* Mobile Navigation Menu */}
          <Collapse in={isMobileMenuOpen} animateOpacity>
            <Box
              py={4}
              borderTop={1}
              borderStyle={'solid'}
              borderColor={'whiteAlpha.200'}
            >
              <Stack spacing={4}>
                {NAV_ITEMS.map((navItem) => (
                  <MobileNavItem key={navItem.label} {...navItem} />
                ))}
                
                <MobileNavItem
                  label="Language"
                  children={[
                    { label: 'English', href: '#', onClick: () => onLanguageChange('en') },
                    { label: 'नेपाली', href: '#', onClick: () => onLanguageChange('np') }
                  ]}
                />
                
                <MobileNavItem
                  label="Theme"
                  onClick={toggleColorMode}
                />

                {isAuthenticated ? (
                  <>
                    <MobileNavItem
                      label="Bookmarks"
                      href="/bookmarks"
                    />
                    <MobileNavItem
                      label="Profile"
                      href="/profile"
                    />
                    <MobileNavItem
                      label="Logout"
                      onClick={handleLogout}
                    />
                  </>
                ) : (
                  <>
                    <MobileNavItem
                      label="Login"
                      onClick={() => handleAuthClick('login')}
                    />
                    <MobileNavItem
                      label="Sign Up"
                      onClick={() => handleAuthClick('signup')}
                    />
                  </>
                )}
              </Stack>
            </Box>
          </Collapse>
        </Container>
      </Box>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={onAuthClose}
        type={authType}
      />
    </>
  );
};

const DesktopNav = () => {
  const { colorMode } = useColorMode();
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Box
                as={RouterLink}
                to={navItem.href ?? '#'}
                p={2}
                fontSize={'sm'}
                fontWeight={500}
                color={'white'}
                _hover={{
                  textDecoration: 'none',
                  color: colorMode === 'light' ? 'nepal.darkRed' : 'nepal.darkBlue',
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <Box
                      key={child.label}
                      as={RouterLink}
                      to={child.href}
                      role={'group'}
                      display={'block'}
                      p={2}
                      rounded={'md'}
                      _hover={{ bg: useColorModeValue('nepal.red', 'nepal.darkRed') }}
                    >
                      <Stack direction={'row'} align={'center'}>
                        <Box>
                          <Text
                            transition={'all .3s ease'}
                            _groupHover={{ color: 'white' }}
                            fontWeight={500}
                          >
                            {child.label}
                          </Text>
                          <Text fontSize={'sm'}>{child.subLabel}</Text>
                        </Box>
                        <Flex
                          transition={'all .3s ease'}
                          transform={'translateX(-10px)'}
                          opacity={0}
                          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                          justify={'flex-end'}
                          align={'center'}
                          flex={1}
                        >
                          <Icon color={'white'} w={5} h={5} as={ChevronRightIcon} />
                        </Flex>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];