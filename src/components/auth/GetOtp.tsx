import { NextPage } from "next";
import { useRef, useState } from "react";

interface Props {
  verifyNumber:any;
  inputRefs: any;
  invalidError: any;
  handleInputChange: (index:number, value:string)=>void;
}

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};


const GetOtp: NextPage<Props> = ({verifyNumber, inputRefs, invalidError, handleInputChange}) => {
  

  return (
    <div>
      <div className="m-auto flex items-center justify-around gap-4">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="text"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent border-[3px] rounded-[3px] flex items-center text-white justify-center text-[18px] font-Poppins outline-none text-center
            ${
              invalidError
                ? "shake border-red-500"
                : "border-white "
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default GetOtp;
