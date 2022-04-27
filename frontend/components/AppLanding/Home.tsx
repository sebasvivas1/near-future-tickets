import { useRouter } from 'next/router';
import React from 'react';
import Event from '../../models/Event';
import EventCard from '../Events/EventCard';
export default function Home() {
  const router = useRouter();
  const events: Array<Event> = [
    {
      index: 1,
      name: 'Event Title',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos animi accusamus odit facere.',
      banner: '/banner1.jpg',
      date: '17-05-2022',
      // time: '1700',
      capacity: [100, 500],
      modality: 1,
      organizer: 'mzterdox.testnet',
      status: 1,
      ticket_type: ['VIP', 'GENERAL'],
      tickets: [
        {
          token_series_id: '1',
          metadata: {
            title: 'Event Title - VIP',
            copies: 70,
            creator: 'mzterdox.testnet',
          },
          creator_id: 'mzterdox.testnet',
          is_mintable: true,
        },
        {
          token_series_id: '2',
          metadata: {
            title: 'Event Title - GENERAL',
            copies: 430,
            creator: 'mzterdox.testnet',
          },
          creator_id: 'mzterdox.testnet',
          is_mintable: true,
        },
      ],
    },
    {
      index: 2,
      name: 'Event Title',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos animi accusamus odit facere.',
      banner: '/banner2.jpg',
      date: '17-05-2022',
      // time: '1700',
      capacity: [100, 500],
      modality: 1,
      organizer: 'mzterdox.testnet',
      status: 1,
      ticket_type: ['VIP', 'GENERAL'],
      tickets: [
        {
          token_series_id: '1',
          metadata: {
            title: 'Event Title - VIP',
            copies: 70,
            creator: 'mzterdox.testnet',
          },
          creator_id: 'mzterdox.testnet',
          is_mintable: true,
        },
        {
          token_series_id: '2',
          metadata: {
            title: 'Event Title - GENERAL',
            copies: 430,
            creator: 'mzterdox.testnet',
          },
          creator_id: 'mzterdox.testnet',
          is_mintable: true,
        },
      ],
    },
    {
      index: 1,
      name: 'Event Title',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos animi accusamus odit facere.',
      banner: '/banner3.jpg',
      date: '17-05-2022',
      // time: '1700',
      capacity: [100, 500],
      modality: 1,
      organizer: 'mzterdox.testnet',
      status: 1,
      ticket_type: ['VIP', 'GENERAL'],
      tickets: [
        {
          token_series_id: '1',
          metadata: {
            title: 'Event Title - VIP',
            copies: 70,
            creator: 'mzterdox.testnet',
          },
          creator_id: 'mzterdox.testnet',
          is_mintable: true,
        },
        {
          token_series_id: '2',
          metadata: {
            title: 'Event Title - GENERAL',
            copies: 430,
            creator: 'mzterdox.testnet',
          },
          creator_id: 'mzterdox.testnet',
          is_mintable: true,
        },
      ],
    },
  ];
  return (
    <div className="p-4">
      <div className="flex justify-between h-full">
        <h2 className="text-figma-400 font-semibold">All Events</h2>
        <button
          type="button"
          className="bg-figma-500 text-figma-400 px-4 py-1.5 rounded-lg"
          onClick={() => router.push('/app/new')}
        >
          New Event
        </button>
      </div>
      {events.map((event, i) => (
        <div className="flex justify-center">
          <EventCard data={event} key={i} />
        </div>
      ))}
    </div>
  );
}
