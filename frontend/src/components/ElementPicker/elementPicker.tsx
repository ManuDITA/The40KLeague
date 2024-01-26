import React from 'react';
import { useState } from 'react';
import Picker from 'react-mobile-picker';

export function MyPicker({ selections, startingSelectionIndex }) {
  const [pickerValue, setPickerValue] = useState({ asd: selections[startingSelectionIndex] });

  return (
    <Picker value={pickerValue} onChange={setPickerValue} wheelMode="natural" className='' height={300}>
      <Picker.Column name="asd" className=''>
        {selections.map((option, index) => (
          <Picker.Item key={option} value={option} className={`${startingSelectionIndex==index ? 'bg-green40klight rounded-lg' : '' } `}>
              <div className={`${startingSelectionIndex==index ? 'text-black' : '' } `}>
                {option}
              </div>
          </Picker.Item>
        ))}
      </Picker.Column>
    </Picker>
  );
}