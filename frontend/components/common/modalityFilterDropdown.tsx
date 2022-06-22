import React from 'react';

interface ModalityFilterDropdownProps {
  modality;
  setModality: React.Dispatch<React.SetStateAction<number>>;
}

const modalityList = [
  { _id: 2, name: 'All' },
  { _id: 0, name: 'Online' },
  { _id: 1, name: 'Face to Face' },
];

export default function ModalityFilterDropdown({
  modality,
  setModality,
}: ModalityFilterDropdownProps) {
  return (
    <div className="">
      <label htmlFor="modality">
        <select
          id="modality"
          value={modality}
          onChange={(e) => setModality(parseInt(e.target.value))}
          onBlur={(e) => setModality(parseInt(e.target.value))}
          className="rounded-lg sm:w-1/2 lg:w-full px-3 flex mt-2 shadow-lg text-lg"
        >
          {modalityList.map((c) => (
            <option value={c._id} key={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
