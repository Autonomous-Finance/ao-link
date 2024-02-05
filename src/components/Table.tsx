"use client";
import { aoEvents } from "@/services/aoscan";
import { transformArrayElements } from "@/utils/transformEvents";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { transformLongText } from "@/utils/transformLongText";
import { Loader } from './Loader'

type DataTableEntry = {
  id: string;
  type: string;
  messageId: string;
  processId: string;
  owner: string;
  blockHeight: number;
  schedulerId: string;
  created: string;
  nonce: number;
}

type DataTableProps = {
  initialData: DataTableEntry[]
}

const DataTable = (props: DataTableProps) => {
  const { initialData } = props;

  const [data, setData] = useState<DataTableEntry[]>(initialData);

  useEffect(() => {
    const getUserInfo = async () => {
      const events = await aoEvents();
      if (events) {
        const parsed = transformArrayElements(events)
        setData(parsed);
      }
    };
    
    setInterval(() => getUserInfo(), 5000);
  }, []);

    return (
        <>
            {data.length ? <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="table-headers">
                  <tr>
                    <th className="text-start p-2">Type</th>
                    <th className="text-start p-2">Message ID</th>
                    <th className="text-start p-2">Process ID</th>
                    <th className="text-start p-2">Owner</th>
                    <th className="text-start p-2">Nonce</th>
                    <th className="text-start p-2">Block Height</th>
                    <th className="text-start p-2">Scheduler ID</th>
                    <th className="text-start p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr
                      className="table-row"
                      key={item.messageId}
                      // @ts-ignore
                      onClick={() => (window.location = `/${item.messageId}`)}
                    >
                      <td
                        className='text-start p-2'
                      >
                        <div className={`gap-2 inline-flex px-2 py-1 ${
                            item.type === "Process" ? "bg-[#FEEEE5]" : "bg-[#E2F0DC]"
                        }`}>
                          <p>{item.type}</p>
                          <Image
                            alt="icon"
                            width={8}
                            height={8}
                            src={
                              item.type === "Process" ? "process.svg" : "message.svg"
                            }
                          />
                        </div>
                      </td>
                      <td className="text-start p-2 ">
                        <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {transformLongText(item.messageId)}
                        </p>
                      </td>
                      <td className="text-start p-2">
                        <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {item.processId}
                        </p>
                      </td>
                      <td className="text-start p-2 ">
                        <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {item.owner}
                        </p>
                      </td>
                      <td className="text-start p-2 ">
                        -
                        {/* {item.nonce} */}
                      </td>
                      <td className="text-start p-2 ">{item.blockHeight}</td>
                      <td className="text-start p-2 ">
                        <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {item.schedulerId}
                        </p>
                      </td>
                      <td className="text-start p-2 ">
                        <p style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {item.created}{" "}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> : <Loader />}
        </>
  );
};

export default DataTable;
