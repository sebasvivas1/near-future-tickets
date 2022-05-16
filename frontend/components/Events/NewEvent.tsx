import { create } from 'ipfs-http-client';
import React from 'react';
import { useNear } from '../../hooks/useNear';
import useUser from '../../hooks/useUser';
import Event from '../../models/Event';
import ModalityDropdown from '../common/ModalityDropdown';
import { Input } from '../inputs/Input';

export default function NewEvent() {
  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  //   const [time, setTime] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [eventStatus, setEventStatus] = React.useState<number>(1);
  const [modality, setModality] = React.useState<number>();
  const [ticketTypeInput, setTicketTypeInput] = React.useState<string>('');
  const [ticketType, setTicketType] = React.useState<Array<string>>();
  const [ticketBanners, setTicketBanners] = React.useState<Array<string>>([]);
  const [file, setFile] = React.useState([]);
  const [ticketFiles, setTicketFiles] = React.useState([]);
  const [urlArr, setUrlArr] = React.useState<string>('');
  const [nearContext] = useNear();
  const [user] = useUser();
  const [uploaded, setUploaded] = React.useState(false);
  const [capacityInput, setCapacityInput] = React.useState<string>('');
  const [capacity, setCapacity] = React.useState<Array<number>>();

  // @ts-ignore: Unreachable code error
  const client = create('https://ipfs.infura.io:5001/api/v0');

  const retrieveFile = async (e) => {
    e.preventDefault();
    setUploaded(false);
    const data = e.target.files[0];
    setFile(e.target.files[0]);
    try {
      const created = await client.add(data);
      setUploaded(true);
      const url = `https://ipfs.infura.io/ipfs/${created.path}`;
      setUrlArr(url);
      console.log('File uploaded ', url);
      console.log(file);
    } catch (error) {
      console.log(error.message);
    }
  };

  const retrieveTicketFiles = async (e) => {
    e.preventDefault();
    setUploaded(false);
    const data = e.target.files;
    setTicketFiles(e.target.files);
    try {
      const urlList = [];
      for (let index = 0; index < data.length; index++) {
        const ticket_banner = data[index];
        const created = await client.add(ticket_banner);
        const url = `https://ipfs.infura.io/ipfs/${created.path}`;
        urlList.push(url);
        console.log('File uploaded ', url);
        console.log(urlList);
      }
      setTicketBanners(urlList);
      //   console.log(ticketBanners);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    // @ts-ignore: Unreachable code error
    await nearContext.contract.create_event(
      {
        name: event.name,
        description: event.description,
        modality: event.modality,
        capacity: capacity,
        date: event.date,
        // time: event.time,
        status: event.status,
        banner: event.banner,
        ticket_type: ticketType,
        ticket_banners: event.ticket_banners,
      },
      '300000000000000',
      '465000000000000000000000'
    );
  };

  const refactorCapacity = () => {
    const arr = [];
    const x = capacityInput.split(',').map(function (item) {
      arr.push(Number(item));
    });
    setCapacity(arr);
    console.log(capacity);
  };

  const refactorTicketType = () => {
    const arr = [];
    const x = ticketTypeInput.split(',').map(function (item) {
      arr.push(item);
    });
    setTicketType(arr);
    console.log(ticketType);
  };

  React.useEffect(() => {
    if (capacityInput !== '') {
      refactorCapacity();
    }
    if (ticketTypeInput !== '') {
      refactorTicketType();
    }
  }, [capacityInput, ticketTypeInput]);

  const event: Event = {
    organizer: user,
    name: name,
    description: description,
    banner: urlArr,
    date: date,
    // time: time,
    status: eventStatus,
    modality: modality,
    ticket_type: ticketType,
    ticket_banners: ticketBanners,
    token_metadata: {},
  };

  return (
    <div className="lg:flex lg:justify-center lg:items-center lg:align-middle lg:p-9 p-5">
      <div className="flex lg:justify-center lg:items-center lg:align-middle">
        <div className="mb-3 w-96">
          <div className={`${uploaded ? 'flex' : 'hidden'}`}>
            <img src={urlArr} alt="" className="w-72 h-72" />
          </div>
          <label
            htmlFor="formFile"
            className="inline-block mb-2 text-figma-400"
          >
            Event Banner *
          </label>
          <input
            required
            className="block w-full px-3 py-1.5 text-base font-normal text-figma-400 bg-white bg-clip-padding border border-solid border-gray-300 rounded-lg transition ease-in-out m-0 focus:text-figma-400 focus:bg-white focus:border-blue-600 focus:outline-none lg:border-0 lg:bg-figma-200"
            type="file"
            id="formFile"
            onChange={(e) => {
              retrieveFile(e);
            }}
          />
          <h2 className={`${uploaded ? 'inline-block' : 'hidden'}`}>
            File Uploaded Succesfully!
          </h2>
        </div>
      </div>
      <div className="lg:w-1/2 ">
        <Input
          required
          className="text-figma-400 mt-8"
          label="Event Title *"
          name="title"
          type="text"
          placeholder="Enter the Event Title"
          value={name}
          setValue={setName}
        />
        <Input
          required
          label="Description *"
          name="description"
          type="text"
          className="rounded-md mt-8"
          value={description}
          setValue={setDescription}
        />
        <div>
          <h2 className="text-figma-400">Modality *</h2>
          <ModalityDropdown modality={modality} setModality={setModality} />
        </div>
        <Input
          required
          type="datetime-local"
          id="date"
          name="date"
          placeholder=""
          className="h-8 text-sm rounded-lg text-figma-400 mt-8"
          setValue={setDate}
          label="Event Date"
        />
        <Input
          required
          type="text"
          id="ticketType"
          name="ticketType"
          placeholder="VIP, GENERAL, X"
          className="text-md text-figma-400 mt-8"
          setValue={setTicketTypeInput}
          label="Ticket Types"
        />
        <div>
          <h2 className="text-figma-400 mt-3 mb-1">Capacity *</h2>
          <input
            aria-label="Capacity"
            className="text-md rounded-lg h-10 mb-4"
            type="text"
            name="capacity"
            placeholder="100,400,1000"
            id="capacity"
            onChange={(e) => {
              setCapacityInput(e.target.value);
            }}
          />
        </div>
        <div>
          <label
            htmlFor="formFile"
            className="inline-block mb-2 text-figma-400"
          >
            Ticket's Banner *
          </label>
          <input
            required
            className="block w-full px-3 py-1.5 text-base font-normal text-figma-400 bg-white bg-clip-padding border border-solid border-gray-300 rounded-lg transition ease-in-out m-0 focus:text-figma-400 focus:bg-white focus:border-blue-600 focus:outline-none lg:border-0 lg:bg-figma-200"
            type="file"
            id="formFile"
            multiple
            onChange={(e) => {
              retrieveTicketFiles(e);
            }}
          />
        </div>
        <button
          type="button"
          className="w-full lg:p-3  bg-figma-500 text-figma-300 font-semibold p-1 rounded-lg drop-shadow-lg mt-4"
          onClick={() => {
            handleSubmit();
          }}
        >
          Create Event
        </button>
      </div>
    </div>
  );
}
