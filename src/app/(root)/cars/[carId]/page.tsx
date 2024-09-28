import React from "react";

const page = ({ params }: { params: { carId: string } }) => {
  const { carId } = params;
  return <div>{carId}</div>;
};

export default page;
