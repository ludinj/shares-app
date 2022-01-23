import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";
import { v4 as uuidv4 } from "uuid";
// categorys:[{name: "sports" , image: "" ,}]
const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setdestination] = useState("");
  const [loadin, setLoadin] = useState(false);
  const [fields, setFields] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [fieldError, setFieldError] = useState({
    titleError: false,
    aboutError: false,
    destinationError: false,
  });
  const [category, setCategory] = useState("");
  const [imageAsset, setImageAsset] = useState(null);

  const navigate = useNavigate();
  console.log(fieldError.aboutError);
  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/gif" ||
      type === "image/jpeg" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoadin(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoadin(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (!title) {
      setFieldError((fieldError) => ({ ...fieldError, titleError: true }));
    } else {
      setFieldError((fieldError) => ({ ...fieldError, titleError: false }));
    }
    if (!about) {
      setFieldError((fieldError) => ({ ...fieldError, aboutError: true }));
    } else {
      setFieldError((fieldError) => ({ ...fieldError, aboutError: false }));
    }
    if (!destination) {
      setFieldError((fieldError) => ({
        ...fieldError,
        destinationError: true,
      }));
    } else {
      setFieldError((fieldError) => ({
        ...fieldError,
        destinationError: false,
      }));
    }
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);
      setTimeout(() => setFields(false), 2000);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center mt-5  lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 transition-all duration-150 easy-in">
          Please fill in all the fields
        </p>
      )}
      <div className="flex lg:flex-rows flex-col justify-center itmes-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex items-center justify-center flex-col border-2 border-dotted border-gray-300 w-full p-3 h-420 ">
            {loadin && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col  items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Use hight quaility fotos less than 20mb
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  className="w-0 h-0"
                  onChange={uploadImage}
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-img"
                  className="h-full w-f"
                />
                <button
                  type="button"
                  onClick={() => setImageAsset(null)}
                  className="absolute bottom-3 right-3 p-3 bg-white  rounded-full text-xl cursor-pointer outline-none hover:shadow-md transition-all duration"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5  w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              !fieldError.titleError
                ? "Add your title here"
                : "Add your title here *Required"
            }
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
            required
          />

          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder={
              !fieldError.aboutError
                ? "What is your pin about"
                : "What is your pin about *Required"
            }
            className="outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2"
            required
          />

          <input
            type="text"
            value={destination}
            onChange={(e) => setdestination(e.target.value)}
            placeholder={
              !fieldError.destinationError
                ? "Add a destination link"
                : "Add a destination link *Required"
            }
            className="outline-none text-base sm:text-lg  border-b-2 border-gray-200 p-2"
            required
          />

          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Chose pin Category
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="ouline-none w-2/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>
                {categories.map((category) => {
                  return (
                    <option
                      key={uuidv4()}
                      value={category.name}
                      className="text-base border-0 outline-none capitalize bg-white text-black/"
                    >
                      {category.name}
                    </option>
                  );
                })}
              </select>
              <div className="flex justify-end items-end mt-5">
                <button
                  type="button"
                  onClick={savePin}
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 ouline-none"
                >
                  Save Pins
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
