import ImgPick from "@/components/imgPick";
import { HeartButton } from "@/components/heart-button";
import StarRating from "@/components/starRating";

import RentProvider from "@/components/rentProvider";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const Page = ({ params }: { params: { carId: string } }) => {
  const { carId } = params;

  // Sample text content
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis malesuada nisl, non ornare justo tristique eu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris convallis, leo non eleifend tempus, libero sem eleifend turpis, vel posuere nisi neque sed nulla. Sed vel orci nec purus congue posuere. Sed nulla ipsum, sodales vel scelerisque maximus, sodales ut velit. In rutrum nulla id iaculis congue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In tempor consectetur aliquet. Donec id sem ut odio dignissim interdum. Nam sit amet ipsum consequat, pharetra tellus sed, dictum leo. Curabitur interdum metus eget convallis ullamcorper. Donec suscipit lacinia elit, quis fermentum augue.`;

  // Define the max length for truncation
  const maxLength = 288; // Adjust as needed

  return (
    <div className="p-[3.5%] flex gap-[4%] ">
      <aside className="w-[47%]">
        <ImgPick />
      </aside>

      <main className="w-[53%] rounded-2xl bg-white p-8 ">
        <div className="flex items-center gap-8 ">
          <h2 className="text-[2.75rem] font-bold">Porsche Title</h2>
          <HeartButton carId={carId} isFavorite={false} size={44} />
        </div>
        <div className="flex gap-3 items-center mt-2 mb-[1rem]">
          <StarRating rating={3.5} />
          <span className="text-gray-500 text-[20px]">440+ Reviews</span>
        </div>
        <p className="overflow-hidden text-ellipsis mt-[2rem] leading-relaxed text-gray-800  text-[26px]">
          {truncateText(description, maxLength)}
        </p>
        <div className="grid grid-cols-2 2xl:grid-cols-3  grid-rows-3 2xl:grid-rows-2  gap-x-8 gap-4 mt-[2rem] text-[20px] xl:text-[25px]">
          <div className="w-full flex justify-between items-center">
            <span className="text-gray-500">Type Car</span>
            <span className="font-semibold">Sport</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="text-gray-500">Capacity</span>
            <span className="font-semibold">2 Person</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="text-gray-500">Fuel Type</span>
            <span className="font-semibold">Diesel</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="text-gray-500">Steering</span>
            <span className="font-semibold">Manual</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="text-gray-500">Gasoline</span>
            <span className="font-semibold">XL</span>
          </div>
          <div className="w-full flex justify-between items-center">
            <span className="text-gray-500">Year</span>
            <span className="font-semibold">2020</span>
          </div>
        </div>
        <RentProvider />
      </main>
    </div>
  );
};

export default Page;
