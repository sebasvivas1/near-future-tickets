import { useRouter } from 'next/router';
import React from 'react';
import NewAssistant from '../../../../components/Assistant/NewAssistant';
import Layout from '../../../../components/common/Layout';
import { initContract } from '../../../../components/near/near';
import Event from '../../../../models/Event';

export default function AssistantsPage() {
  const router = useRouter();
  const index = router.query.index;
  const [event, setEvent] = React.useState<Event>();

  const get_event = async () => {
    const NEAR = await initContract();
    setEvent(
      // @ts-ignore: Unreachable code error
      await NEAR.contracts.nftContract.get_event({ index: parseInt(index) })
    );
  };
  React.useEffect(() => {
    get_event();
  }, []);
  return (
    <Layout>
      <NewAssistant event={event} />
    </Layout>
  );
}
