import React from "react";
import LabClient from "../../../../components/LabClient";

const page = ({ params }: { params: { slug: string } }) => {
  return (
    <div className="h-[calc(100vh-64px)]">
      <LabClient slug={params.slug} />
    </div>
  );
};

export default page;
