import React from "react";
import { useParams } from "react-router-dom";

function DetailsPatient() {
  const { tablename, id } = useParams();
  return (
    <>
      <div>DetailsPatient</div>
      <div>Table : {tablename}</div>
      <div>ID : {id}</div>
    </>
  );
}

export default DetailsPatient;
