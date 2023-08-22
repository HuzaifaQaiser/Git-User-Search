import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, TextField } from "@mui/material";

function GitSearch() {
  const [open, setOpen] = useState(false);
  const [GitSearch, setGitSearch] = useState(null);
  const [error, setError] = useState("");
  const [displayError, setDisplayError] = useState(false); // State variable to control error display

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const closeError = () => {
    setDisplayError(false); // Function to close the error div
  };

  const initialValues = {
    username: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required")
        .min(2, "Username must be at least 2 characters")
        .max(20, "Username can't exceed 20 characters"),
    }),
    onSubmit: async (values) => {
      if (formik.isValid) {
        // Check if there are no validation errors
        try {
          const response = await axios.get(
            `https://api.github.com/users/${values.username}`
          );
          setGitSearch(response.data);
          setDisplayError(false); // Close error if it was previously displayed
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setGitSearch(null);
            setError("User Not Found");
            setDisplayError(true); // Display error div
          } else {
            setGitSearch(null);
            setError("An error occurred while fetching data.");
            setDisplayError(true); // Display error div
          }
        }
      }
    },
  });

  // Handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && formik.isValid) {
      // Check if there are no validation errors
      formik.handleSubmit();
      handleClose();
    }
  };

  const parentDivStyle = {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    marginLeft: "10%",
  };

  const profilePicStyle = {
    alignSelf: "center",
    width: "40%",
  };

  // Add a media query for screens with a minimum width of 640px
  if (window.matchMedia("(min-width: 640px)").matches) {
    parentDivStyle.flexDirection = "row";
    parentDivStyle.width = "80%";
    parentDivStyle.marginLeft = "10%";
  }

  return (
    <div
      style={{
        backgroundImage: `url('/src/image2.jpg')`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "static",
        height: "100vh",
      }}
    >
      <div className="flex justify-center ">
        <button
          onClick={handleClickOpen}
          style={{ alignSelf: "center" }}
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mt-40"
        >
          Search for GitHub Account
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-10">
          <div className="bg-white p-6 w-96 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Enter Username To See GitHub Account
            </h2>
            <TextField
              label="GitHub Usename"
              color="secondary"
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyPress={handleKeyPress} // Handle Enter key press
            />{" "}
            <br />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500">{formik.errors.username}</p>
            )}{" "}
            <div className="flex justify-end mt-3">
              <button
                onClick={handleClose}
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  if (formik.isValid) {
                    // Check if there are no validation errors
                    formik.handleSubmit();
                    handleClose();
                  }
                }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {displayError && (
        <div className=" flex flex-col text-center text-2xl mt-20 w-80  mx-auto text-red-600">
          <p>
            <b>{error}</b>
          </p>
          <br />
          <Button variant="text" onClick={closeError}>
            OK
          </Button>
        </div>
      )}

      {GitSearch && (
        <div
          className="bg-orange-400 p-5 flex mt-20 ml-80 mr-80 rounded-3xl"
          style={parentDivStyle}
        >
          <img
            style={profilePicStyle}
            className="rounded-full max-w-xs "
            alt="profile"
            src={GitSearch.avatar_url}
          />
          <div className=" p-5 mt-3">
            <h1 className="text-4xl font-semibold">{GitSearch.name}</h1>
            <br />
            <p className="text-base">{GitSearch.bio}</p> <br />
            <p className="text-base flex items-center">
              {GitSearch.location}
            </p>{" "}
            <br />
            <p className="text-base">
              Repos: {GitSearch.public_repos} &nbsp;&nbsp;&nbsp;&nbsp;
              Followers: {GitSearch.followers}&nbsp;&nbsp;&nbsp;&nbsp;
              Following: {GitSearch.following}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GitSearch;
