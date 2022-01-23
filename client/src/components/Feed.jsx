import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { feedQuery, searchQuery } from "../utils/data.js";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

import { client } from "../client";

const Feed = () => {
  const [loading, setLoading] = useState(false);

  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        setPins(data);
        if (data) {
          setLoading(false);
          console.log(data, "data");
        }
      });
    } else {
      client
        .fetch(feedQuery)
        .then((data) => {
          setPins(data, "data2");
          setLoading(false);
          console.log(data, "data");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [categoryId]);

  if (loading)
    return <Spinner message="We are adding new ideas to your feed!" />;
  if (!pins?.length) return <h2>No pins aveailable</h2>;
  return (
    <div className="Check this div">
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;
