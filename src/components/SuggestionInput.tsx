"use client";

import { truncateId } from "@/utils/data-utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";

const SuggestionInput = ({ eventsIds }: { eventsIds: string[] }) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { push } = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSelectChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 300);
  };

  const handleKeyDown = (e: any) => {
    if (e.code === "Enter") {
      push(`/${inputValue}`);
    }
  };
  return (
    <div>
      <div className="relative">
        <input
          placeholder="Search...."
          className="bg-background border border-[#222326] w-full py-[28px] px-[32px] outline-none focus:border-none z-50 relative"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
        <Link href={`/${inputValue}`}>
          <Image
            width={28}
            height={28}
            alt="search"
            className="absolute right-[32px] top-1/2 -translate-y-1/2 text-[18px] z-[51]"
            src="/search.svg"
          />
        </Link>
      </div>
      {isInputFocused && inputValue !== "" && (
        <ul className="mt-[10px] z-50 relative max-h-[200px] overflow-y-scroll">
          {eventsIds
            .filter((item) => item.includes(inputValue))
            .map((suggestion) => (
              <li
                key={suggestion}
                // onClick={() => {
                //   handleSelectChange(suggestion);
                // }}
                className="cursor-pointer p-[8px] bg-background flex justify-between"
              >
                <Link href={`/${suggestion}`} className="w-full">
                  <div className="flex justify-between w-full">
                    <p>{truncateId(suggestion)}</p>
                    <p>{Math.random().toFixed(5)}</p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      )}

      {isInputFocused && (
        <div
          className={`fixed top-0 left-0 w-full h-full bg-[#0000004d] z-[1]`}
        ></div>
      )}
    </div>
  );
};

export default SuggestionInput;
