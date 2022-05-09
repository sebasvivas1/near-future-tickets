import { useRouter } from 'next/router';
import React from 'react';
import { initContract } from '../../../components/near/near';
import Event from '../../../models/Event';
import EventData from '../../../components/Event/Event';
import Layout from '../../../components/common/Layout';
import { useNear } from '../../../hooks/useNear';

export default function EventDetails() {
  const router = useRouter();
  const index = router.query.index;
  const [event, setEvent] = React.useState<Event>(null);
  const [nearContext, setNearContext] = useNear();

  const get_event = async () => {
    const NEAR = await initContract();
    setNearContext(NEAR);
    setEvent(
      // @ts-ignore: Unreachable code error
      await NEAR.contracts.nftContract.get_event({ index: parseInt(index) })
    );
  };

  React.useEffect(() => {
    get_event();
  }, [event]);

  return (
    <Layout>
      <EventData event={event} />
    </Layout>
  );
}
