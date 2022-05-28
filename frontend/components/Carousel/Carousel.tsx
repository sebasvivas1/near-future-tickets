import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';
import { initContract } from '../near/near';

let count = 0;
export default function CarouselComponent() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [events, setEvents] = React.useState<Array<Event>>();
  const [featuredEvents, setFeaturedEvents] = React.useState<Array<Event>>([]);
  const router = useRouter();

  const getEvents = async () => {
    const { contracts } = await initContract();
    // @ts-ignore: Unreachable code error
    setEvents(await contracts?.nftContract?.get_events());
    const featuredEventss: Array<Event> = [];
    if (events) {
      for (let index = 0; index < events.length; index++) {
        featuredEventss.push({
          banner: events[index].banner,
          name: events[index].name,
          description: events[index].description,
          index: events[index].index,
        });
      }
      setFeaturedEvents(featuredEventss);
    }
  };

  const removeAnimation = () => {
    slideRef.current.classList.remove('fade-anim');
  };

  React.useEffect(() => {
    getEvents();
  }, [events]);

  React.useEffect(() => {
    slideRef.current.addEventListener('animationend', removeAnimation);
    startSlider();
  }, []);

  const startSlider = () => {
    if (featuredEvents.length <= 1) {
      null;
    } else {
      setInterval(() => {
        handleOnNextClick();
      }, 3000);
    }
  };

  const slideRef = React.useRef(null);

  const handleOnNextClick = () => {
    count = (count + 1) % featuredEvents.length;
    setCurrentIndex(count);
    slideRef?.current?.classList?.add('fade-anim');
  };
  const handleOnPrevClick = () => {
    count = (currentIndex + featuredEvents.length - 1) % featuredEvents.length;
    setCurrentIndex(count);
    slideRef?.current?.classList?.add('fade-anim');
  };

  // console.log(featuredEvents);

  return (
    <div className="w-full">
      {featuredEvents ? (
        <div ref={slideRef} className="select-none relative bg-bg-event">
          <div className="flex justify-between p-12">
            <div className="justify-start w-1/2">
              <h2
                className="text-figma-400 font-semibold text-8xl cursor-pointer"
                onClick={() =>
                  router.push(
                    `/app/event/${featuredEvents[currentIndex].index}`
                  )
                }
              >
                {featuredEvents[currentIndex]?.name}
              </h2>
              <h2 className="text-figma-400 font-semibold mt-9 text-3xl">
                {featuredEvents[currentIndex]?.description}
              </h2>
            </div>
            <div className="w-1/2">
              <img
                src={featuredEvents[currentIndex]?.banner}
                alt=""
                className="w-full lg:h-96 object-cover rounded-lg cursor-pointer"
                onClick={() =>
                  router.push(
                    `/app/event/${featuredEvents[currentIndex].index}`
                  )
                }
              />
              <div className="flex justify-between w-full text-2xl font-bold space-x-3 lg:mt-3">
                <button className="bg-figma-500 px-6 py-4 w-full rounded-lg text-figma-300 hover:bg-figma-300 hover:text-figma-500 transition duration-300 hover:duration-500 ">
                  Buy Now
                </button>
                <button className="bg-figma-500 px-6 py-4 w-full rounded-lg text-figma-300 hover:bg-figma-300 hover:text-figma-500 transition duration-300 hover:duration-500 ">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 transform translate-y-1/2 flex justify-between items-center w-full lg:px-4 font-bold text-6xl">
            <button
              className="hover:bg-figma-500/[.6] text-figma-500 hover:text-white  transition duration-300 hover:duration-500"
              onClick={handleOnPrevClick}
            >
              &larr;
            </button>
            <button
              className="hover:bg-figma-500/[.6] text-figma-500 hover:text-white transition duration-300 hover:duration-500 "
              onClick={handleOnNextClick}
            >
              &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="select-none relative bg-bg-event">
          <div className="flex justify-between p-12">
            <div className="justify-start w-1/2">
              <h2 className="text-figma-400 font-semibold text-8xl cursor-pointer"></h2>
              <h2 className="text-figma-400 font-semibold mt-9 text-3xl"></h2>
            </div>
            <div className="w-1/2">
              <div className="w-full lg:h-96 object-cover rounded-lg cursor-pointer bg-gray-400">
                {' '}
              </div>
              <div className="flex justify-between w-full text-2xl font-bold space-x-3 lg:mt-3">
                <button className="bg-figma-500 px-6 py-4 w-full rounded-lg text-figma-300 hover:bg-figma-300 hover:text-figma-500 transition duration-300 hover:duration-500 ">
                  Buy Now
                </button>
                <button className="bg-figma-500 px-6 py-4 w-full rounded-lg text-figma-300 hover:bg-figma-300 hover:text-figma-500 transition duration-300 hover:duration-500 ">
                  Learn More
                </button>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 transform translate-y-1/2 flex justify-between items-center w-full lg:px-4 font-bold text-6xl">
            <button
              className="hover:bg-figma-500/[.6] text-figma-500 hover:text-white  transition duration-300 hover:duration-500"
              onClick={handleOnPrevClick}
            >
              &larr;
            </button>
            <button
              className="hover:bg-figma-500/[.6] text-figma-500 hover:text-white transition duration-300 hover:duration-500 "
              onClick={handleOnNextClick}
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
