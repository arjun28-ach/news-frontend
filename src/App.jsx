import { ChakraProvider, Box } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import theme from './theme';
import { authService } from './services/auth';
import { ScrollToTop } from './components/ScrollToTop';
import Footer from './components/Footer';
import Contact from './pages/Contact';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: 1000,
      staleTime: 300000, // 5 minutes
    },
  },
});

// Lazy load components
const NewsFeed = lazy(() => import('./components/NewsFeed'));
const Bookmarks = lazy(() => import('./components/Bookmarks'));
const Profile = lazy(() => import('./components/Profile'));
const AboutUs = lazy(() => import('./components/AboutUs'));

function App() {
  const [language, setLanguage] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [user, setUser] = useState(null);

  const fetchBookmarkCount = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch('/api/bookmarks/count/');
      const data = await response.json();
      setBookmarkCount(data.count);
    } catch (error) {
      console.error('Error fetching bookmark count:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { isAuthenticated, user } = await authService.checkAuth();
        setIsAuthenticated(isAuthenticated);
        setUser(user);
        if (isAuthenticated) {
          fetchBookmarkCount();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);

  const handleBookmarkUpdate = () => {
    fetchBookmarkCount();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Router>
          <ErrorBoundary>
            <Box minH="100vh" display="flex" flexDirection="column">
              <Header 
                isAuthenticated={isAuthenticated}
                onLanguageChange={setLanguage}
                bookmarkCount={bookmarkCount}
                user={user}
              />
              <Box 
                flex="1"
                mt="72px" // Height of the header
                display="flex"
                flexDirection="column"
              >
                <Box flex="1" width="100%" px={4} py={8}>
                  <Box maxW="1200px" mx="auto">
                    <Suspense fallback={
                      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
                        Loading...
                      </Box>
                    }>
                      <Routes>
                        <Route 
                          path="/" 
                          element={
                            <NewsFeed 
                              language={language}
                              isAuthenticated={isAuthenticated}
                              onBookmarkUpdate={handleBookmarkUpdate}
                            />
                          } 
                        />
                        <Route 
                          path="/bookmarks" 
                          element={
                            <Bookmarks 
                              isAuthenticated={isAuthenticated}
                              onBookmarkUpdate={handleBookmarkUpdate}
                            />
                          } 
                        />
                        <Route 
                          path="/profile" 
                          element={
                            <Profile 
                              isAuthenticated={isAuthenticated}
                              user={user}
                            />
                          } 
                        />
                        <Route 
                          path="/about" 
                          element={<AboutUs />} 
                        />
                        <Route 
                          path="/contact" 
                          element={<Contact />} 
                        />
                      </Routes>
                    </Suspense>
                  </Box>
                </Box>
                <Footer />
              </Box>
              <ScrollToTop />
            </Box>
          </ErrorBoundary>
        </Router>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
