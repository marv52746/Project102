import React from "react";
import { useParams } from "react-router-dom";

function Form() {
  const { tablename, id } = useParams();
  return (
    <>
      <div>Form</div>
      <div>Table : {tablename}</div>
      <div>ID : {id}</div>
    </>
  );
}

export default Form;
