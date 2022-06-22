import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';
import Loader from '../common/Loader';
import ModalityFilterDropdown from '../common/modalityFilterDropdown';
import EventCard from '../Events/EventCard';
import { initContract } from '../near/near';
import { motion } from 'framer-motion';
import { useToast } from '@chakra-ui/react';
import { RightArrowIcon, LeftArrowIcon } from '../icons';

export default function Events() {
  const [events, setEvents] = React.useState<Array<Event>>([]);
  const [modality, setModality] = React.useState(2);
  const [filteredEvents, setFilteredEvents] = React.useState<Array<Event>>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [tokensPerPage] = React.useState(3);
  const [indexFirstNFT, setIndexFirstNFT] = React.useState('0');
  const [lastPage, setLastPage] = React.useState<number>();
  const [maxEvents, setMaxEvents] = React.useState();
  const toast = useToast();

  const getEvents = async () => {
    const { contracts } = await initContract();
    setEvents(
      // @ts-ignore: Unreachable code error
      await contracts.nftContract.get_events({
        from_index: indexFirstNFT,
        limit: tokensPerPage,
      })
    );
    // @ts-ignore: Unreachable code error
    setMaxEvents(await contracts.nftContract.get_events_supply());
  };

  const filterEvents = () => {
    if (modality === 0) {
      setFilteredEvents(events.filter((event) => event.modality === 0));
    } else if (modality === 1) {
      setFilteredEvents(events.filter((event) => event.modality === 1));
    } else {
      setFilteredEvents(events);
    }
  };

  const next = () => {
    setCurrentPage(currentPage + 1);
    setIndexFirstNFT((Number(indexFirstNFT) + tokensPerPage).toPrecision());
  };

  const prev = () => {
    setCurrentPage(currentPage - 1);
    setIndexFirstNFT((Number(indexFirstNFT) - tokensPerPage).toPrecision());
  };

  const calculateLastPage = () => {
    const lastPage = Number(maxEvents) / tokensPerPage;
    if (lastPage % 1 === 0) {
      setLastPage(lastPage);
    } else {
      setLastPage(Math.round(lastPage + 1));
    }
  };

  React.useEffect(() => {
    getEvents();
    filterEvents();
    calculateLastPage();
  }, [events]);

  React.useEffect(() => {
    filterEvents();
  }, [modality]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="lg:mt-24 min-h-screen">
      {events.length > 0 ? (
        <div>
          <div className="p-4 lg:p-8">
            <div className="flex justify-between h-full lg:px-9 md:px-8 xl:px-0 2xl:px-9 3xl:px-2">
              <h2 className="text-figma-400 font-semibold lg:text-2xl lg:self-center text-lg">
                Upcoming Events
              </h2>
              <ModalityFilterDropdown
                setModality={setModality}
                modality={modality}
              />
            </div>
            <div className="flex flex-col self-center items-center md:grid md:grid-cols-2 md:justify-items-center md:gap-2 lg:mt-8 xl:grid-cols-3 xl:gap-8 2xl:grid-cols-3 3xl:grid-cols-4">
              {filteredEvents.map((event, i) => (
                <div className="" key={i}>
                  <EventCard data={event} key={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <Loader />
        </div>
      )}
      <div className="flex justify-center items-center space-x-60 mb-8">
        <div>
          {currentPage === 1 ? (
            <motion.button
              type="button"
              onClick={() => {
                toast({
                  title: 'Already on first page.',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                  position: 'bottom-left',
                });
              }}
              className="bg-gray-400 p-2 text-xl rounded-md text-gray-600 font-bold"
            >
              <LeftArrowIcon className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={prev}
              className="bg-figma-100 p-2 text-xl rounded-md text-figma-300 font-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <LeftArrowIcon className="w-6 h-6" />
            </motion.button>
          )}
        </div>
        <div className="my-8">
          {currentPage === lastPage ? (
            <motion.button
              type="button"
              onClick={() => {
                toast({
                  title: 'Last page reached.',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                  position: 'bottom-left',
                });
              }}
              className="bg-gray-400 p-2 text-xl rounded-md text-gray-600 font-bold"
            >
              <RightArrowIcon className="w-6 h-6" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={next}
              className="bg-figma-100 p-2 text-xl rounded-md text-figma-300 font-bold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RightArrowIcon className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
