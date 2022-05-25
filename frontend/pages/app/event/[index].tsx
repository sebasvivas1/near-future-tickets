import { useRouter } from 'next/router';
import React from 'react';
import { initContract } from '../../../components/near/near';
import Event from '../../../models/Event';
import EventData from '../../../components/Event/Event';
import EventLayout from '../../../components/common/EventLayout';
import { Seo } from '../../../components/Seo/Seo';

export default function EventDetails() {
  const router = useRouter();
  const index = router.query.index;
  const [event, setEvent] = React.useState<Event>(null);

  const get_event = async () => {
    const NEAR = await initContract();
    setEvent(
      // @ts-ignore: Unreachable code error
      await NEAR.contracts.nftContract.get_event({ index: parseInt(index) })
    );
  };

  React.useEffect(() => {
    get_event();
  }, [event]);

  return (
    <EventLayout>
      <Seo
        metaTitle={event?.name}
        metaDescription={event?.description}
        shareImage={event?.banner}
      />
      {event ? <EventData event={event} /> : null}
    </EventLayout>
  );
}
