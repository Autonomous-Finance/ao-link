import Header from "@/components/Header";
import {aoEvent} from "@/services/aoscan";
import {formatRelative, parseUtcString} from "@/utils/date-utils";
import {truncateId} from "@/utils/data-utils";
import {Graph} from "@/components/Graph";
import { IdBlock } from "@/components/IdBlock";

const Diamonds = () => (
    <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_107_20)">
            <path
                d="M0.829586 4.16847L1.80716 5.02384C1.91358 5.11696 2.08612 5.11696 2.19253 5.02384L3.17011 4.16846C3.27653 4.07535 3.27653 3.92438 3.17011 3.83126L2.19253 2.97589C2.08612 2.88277 1.91358 2.88277 1.80716 2.97589L0.829586 3.83126C0.723168 3.92438 0.723168 4.07535 0.829586 4.16847Z"
                stroke="#222326"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.82959 2.41847L3.80716 3.27384C3.91358 3.36696 4.08612 3.36696 4.19253 3.27384L5.17011 2.41846C5.27653 2.32535 5.27653 2.17438 5.17011 2.08126L4.19253 1.22589C4.08612 1.13277 3.91358 1.13277 3.80716 1.22589L2.82959 2.08126C2.72317 2.17438 2.72317 2.32535 2.82959 2.41847Z"
                stroke="#222326"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.82989 5.91846L3.80747 6.77384C3.91388 6.86696 4.08642 6.86696 4.19284 6.77384L5.17041 5.91846C5.27683 5.82535 5.27683 5.67438 5.17041 5.58126L4.19284 4.72589C4.08642 4.63277 3.91388 4.63277 3.80747 4.72589L2.82989 5.58126C2.72347 5.67438 2.72347 5.82535 2.82989 5.91846Z"
                stroke="#222326"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M4.82989 4.16847L5.80747 5.02384C5.91388 5.11696 6.08642 5.11696 6.19284 5.02384L7.17041 4.16846C7.27683 4.07535 7.27683 3.92438 7.17041 3.83126L6.19284 2.97589C6.08642 2.88277 5.91388 2.88277 5.80747 2.97589L4.82989 3.83126C4.72347 3.92438 4.72347 4.07535 4.82989 4.16847Z"
                stroke="#222326"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_107_20">
                <rect
                    width="7"
                    height="8"
                    fill="white"
                    transform="translate(0 7.5) rotate(-90)"
                />
            </clipPath>
        </defs>
    </svg>
);
const Asterics = () => (
    <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_55_199)">
            <path
                d="M4 6.75V1.25"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.5 5.5L6.5 2.5"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.5 2.5L6.5 5.5"
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_55_199">
                <rect
                    width="8"
                    height="8"
                    fill="white"
                    transform="matrix(1 0 0 -1 0 8)"
                />
            </clipPath>
        </defs>
    </svg>
);

const SectionInfo = ({ title, value }: { title: string; value: React.ReactNode }) => (
    <div className="flex flex-row items-baseline w-full mb-12">
        <div className="flex w-56 items-center">
            <p className="table-headers">{title}</p>
        </div>
        <div className="flex">
            <p className="table-row hover:bg-transparent !h-auto">{value}</p>
        </div>
    </div>
);

const SectionInfoWithChip = ({
 title,
 value,
}: {
title: string;
value: string;
}) => (
    <div className="flex flex-row items-baseline w-full mb-12">
        <div className="flex w-56 items-center">
            <p className="table-headers">{title}</p>
        </div>
        <div
            className={`flex min-w-[70px] py-1 px-2 space-x-1 items-center ${
                value.toLocaleLowerCase() === 'process'
                    ? 'bg-[#FEEEE5]'
                    : 'bg-[#E2F0DC]'
            }`}
        >
            <p className="table-row hover:bg-transparent !h-auto">
                {value}
            </p>
            {value.toLocaleLowerCase() === 'process' ? <Diamonds /> : <Asterics />}
        </div>
    </div>
);

const Chip = ({ text }: { text: string }) => {
    const colors = {
        red: 'bg-red-300',
        blue: 'bg-blue-300',
        green: 'bg-green-300',
        lime: 'bg-lime-300',
        yellow: 'bg-yellow-300',
        purple: 'bg-purple-300',
        indigo: 'bg-indigo-300',
        cyan: 'bg-cyan-300',
        pink: 'bg-pink-300',
    };

    const pickRandomColor = () => {
        const colorsMap = Object.keys(colors);
        const index = Math.floor(Math.random() * colorsMap.length);
        return colorsMap[index];
    };

    const randomColor = pickRandomColor();
    const chipColor = `bg-${randomColor}-300`;

    return (
        <span
            className={`m-1 inline-block px-3 py-1 rounded-full text-[#5d5d5d] ${chipColor}`}
        >
            {text}
        </span>
    );
};

export default async function Page({
   params: {slug},
}: {
    params: { slug: string };
}) {
    const {id, owner_address, tags_flat, created_at, height, target} = await aoEvent({id: slug});

    return (
        <main className="min-h-screen mb-6">
            <Header/>
            <div className="flex gap-2 items-center text-sm mt-12 mb-11">
                <p className="text-[#9EA2AA] ">MESSAGE</p>
                <p className="font-bold">/</p>
                <p className="">{truncateId(id)}</p>
            </div>

            <div className="flex w-full">
                <div className="w-1/2 flex flex-col">
                    <div className="w-[426px] h-[410px] border border-[#000] flex items-center justify-center mb-6">
                        <Graph messageId={id}/>
                    </div>
                    <div>
                        <SectionInfo
                            title="Owner"
                            value={<IdBlock  value={owner_address}/>}
                        />
                        <SectionInfo
                            title="Message ID"
                            value={<IdBlock  value={id}/>}
                        />
                        <SectionInfo
                            title="Process ID"
                            value={<IdBlock  value={target}/>}
                        />
                        <SectionInfo
                            title="Created"
                            value={created_at? formatRelative(parseUtcString(created_at)): ''}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start ">
                    <SectionInfoWithChip title="Type" value={tags_flat.Type}/>
                    <SectionInfo
                        title="Block Height"
                        value={height.toString()}
                    />
                    <div className='mb-12'>
                        <SectionInfoWithChip title="Compute Results" value={'Compute'}/>
                        <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start -mt-6">
                            <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                                Waiting to compute...
                            </p>
                        </div>
                    </div>
                    <div className='mb-12'>
                        <div className="flex w-full justify-between items-center mb-6">
                            <p className="table-headers">Result Type</p>
                        </div>
                        <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
                            <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2"></p>
                        </div>
                    </div>
                    <div className='mb-12'>
                        <div className="flex w-full justify-between items-center mb-6">
                            <p className="table-headers">Related Messages Tree:</p>
                        </div>
                        <div className="bg-secondary-gray w-96 min-h-14 flex items-start justify-start">
                            <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2"></p>
                        </div>
                    </div>
                    <div>
                        <div className="flex w-full justify-between items-center mb-6">
                            <p className="table-headers">Tags:</p>
                        </div>
                        <div className="bg-secondary-gray w-96 flex items-start justify-start">
                            <p className="font-mono text-xs font-normal leading-normal tracking-tighter p-2">
                                {Object.entries(tags_flat).map(([key, value]) => <Chip key={key} text={`${key}:${value}`}/>)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
