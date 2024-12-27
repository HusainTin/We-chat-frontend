import React, { FC } from "react";

interface HeadProps {
  title: string;
  description: string;
}

const Heading: FC<HeadProps> = (props) => {
  return (
    <>
      <title>{props.title}</title>
      <meta name="viewport" content="width= device-width" />
      <meta name="description" content={props.description} />
    </>
  );
};

export default Heading;
