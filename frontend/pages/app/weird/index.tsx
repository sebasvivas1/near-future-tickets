import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
    // const [coordinate, setCoordinate] = useState({ lat: 0, lng: 0 });

const Weird = ({ Component, pageProps }) => {

    return (
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}

export default Weird;