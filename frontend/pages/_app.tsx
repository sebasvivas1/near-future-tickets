import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NEARApiContextProvider } from '../context/nearContext';
import { ChakraProvider } from '@chakra-ui/react';
import UserContextProvider from '../context/userContext';
import { motion, AnimatePresence } from 'framer-motion';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <NEARApiContextProvider>
      <UserContextProvider>
        <ChakraProvider>
          <AnimatePresence>
            <motion.div
              key={router.route}
              initial="pageInitial"
              animate="pageAnimate"
              variants={{
                pageInitial: { opacity: 0.5 },
                pageAnimate: {
                  opacity: 1,
                },
                pageExit: {
                  backgroundColor: 'bg-figma-200',
                  opacity: 0,
                },
              }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </ChakraProvider>
      </UserContextProvider>
    </NEARApiContextProvider>
  );
}

export default MyApp;
