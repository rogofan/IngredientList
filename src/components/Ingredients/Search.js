import React, { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/http";
import Card from "../UI/Card";
import ErrorModal from "../UI/ErrorModal";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRefSearchBox = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      //enteredFilter is old value from 500 ms ago
      if (enteredFilter === inputRefSearchBox.current.value) {
        //each object in DB has LC parameter and this is use for search
        const lowerCaseFilter = enteredFilter.toLowerCase();
        const query =
          lowerCaseFilter.length === 0
            ? ""
            : `?orderBy="titleLC"&equalTo="${lowerCaseFilter}"`;
        sendRequest(
          "https://ingredientdatbase-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, sendRequest, inputRefSearchBox]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
            ref={inputRefSearchBox}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
